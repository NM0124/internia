import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  education: string;
  skills: string[];
  sectors: string[];
  location: string;
}

// Cosine similarity calculation functions
function createUserVector(userProfile: UserProfile): number[] {
  const allSkills = ['javascript', 'react', 'python', 'java', 'sql', 'machine learning', 'data analysis', 'marketing', 'design', 'communication'];
  const allSectors = ['technology', 'healthcare', 'finance', 'education', 'marketing', 'research', 'consulting'];
  const allLocations = ['remote', 'new york', 'san francisco', 'london', 'mumbai', 'bangalore'];
  const educationLevels = ['undergraduate', 'graduate', 'postgraduate', 'professional'];
  
  const vector: number[] = [];
  
  // Education vector
  educationLevels.forEach(level => {
    vector.push(userProfile.education.toLowerCase() === level ? 1 : 0);
  });
  
  // Skills vector
  allSkills.forEach(skill => {
    const matches = userProfile.skills.filter(userSkill => 
      userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase())
    ).length;
    vector.push(matches > 0 ? 1 : 0);
  });
  
  // Sectors vector
  allSectors.forEach(sector => {
    vector.push(userProfile.sectors.some(userSector => 
      userSector.toLowerCase().includes(sector) || sector.includes(userSector.toLowerCase())
    ) ? 1 : 0);
  });
  
  // Location vector
  allLocations.forEach(location => {
    vector.push(
      userProfile.location.toLowerCase().includes(location) || 
      location.includes(userProfile.location.toLowerCase()) ||
      userProfile.location.toLowerCase() === 'remote'
      ? 1 : 0
    );
  });
  
  return vector;
}

function createInternshipVector(internship: any): number[] {
  const allSkills = ['javascript', 'react', 'python', 'java', 'sql', 'machine learning', 'data analysis', 'marketing', 'design', 'communication'];
  const allSectors = ['technology', 'healthcare', 'finance', 'education', 'marketing', 'research', 'consulting'];
  const allLocations = ['remote', 'new york', 'san francisco', 'london', 'mumbai', 'bangalore'];
  const educationLevels = ['undergraduate', 'graduate', 'postgraduate', 'professional'];
  
  const vector: number[] = [];
  const descriptionText = `${internship.title} ${internship.description} ${internship.requirements.join(' ')}`.toLowerCase();
  
  // Education vector (inferred from description)
  educationLevels.forEach(level => {
    vector.push(descriptionText.includes(level) ? 1 : 0);
  });
  
  // Skills vector
  allSkills.forEach(skill => {
    const skillMatches = internship.requirements.some((req: string) => 
      req.toLowerCase().includes(skill) || skill.includes(req.toLowerCase())
    ) || descriptionText.includes(skill);
    vector.push(skillMatches ? 1 : 0);
  });
  
  // Sectors vector
  allSectors.forEach(sector => {
    vector.push(
      internship.sector.toLowerCase().includes(sector) || 
      sector.includes(internship.sector.toLowerCase())
      ? 1 : 0
    );
  });
  
  // Location vector
  allLocations.forEach(location => {
    vector.push(
      internship.location.toLowerCase().includes(location) || 
      location.includes(internship.location.toLowerCase()) ||
      internship.location.toLowerCase() === 'remote'
      ? 1 : 0
    );
  });
  
  return vector;
}

function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    return 0;
  }
  
  const dotProduct = vectorA.reduce((sum, a, i) => sum + (a * vectorB[i]), 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + (a * a), 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + (b * b), 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

function calculateCosineSimilarity(userProfile: UserProfile, internship: any): number {
  const userVector = createUserVector(userProfile);
  const internshipVector = createInternshipVector(internship);
  const similarity = cosineSimilarity(userVector, internshipVector);
  return Math.round(similarity * 100);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userProfile }: { userProfile: UserProfile } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all active internships
    const { data: internships, error } = await supabase
      .from('internship_listings')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching internships:', error);
      throw new Error('Failed to fetch internships');
    }

    console.log(`Fetched ${internships?.length || 0} internships`);

    // Calculate cosine similarity scores for all internships
    const internshipsWithScores = internships?.map(internship => {
      const score = calculateCosineSimilarity(userProfile, internship);
      return {
        ...internship,
        matchScore: score
      };
    }) || [];
    
    // Sort by similarity score and take top 3
    const topRecommendations = internshipsWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Add reasoning based on cosine similarity
    const finalRecommendations = topRecommendations.map(internship => ({
      ...internship,
      aiReason: `${internship.matchScore}% match based on cosine similarity analysis of your skills, sector preferences, and location requirements`
    }));

    console.log(`Returning ${finalRecommendations.length} cosine similarity-based recommendations`);

    return new Response(JSON.stringify({ 
      recommendations: finalRecommendations,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});