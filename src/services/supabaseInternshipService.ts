import { supabase } from "@/integrations/supabase/client";

export interface InternshipListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
  sector: string;
  applicants: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InternshipWithMatchScore extends InternshipListing {
  matchScore: number;
}

export const supabaseInternshipService = {
  async fetchInternships(): Promise<InternshipListing[]> {
    const { data, error } = await supabase
      .from('internship_listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching internships:', error);
      throw new Error('Failed to fetch internships');
    }
    
    return data || [];
  },

  async getAIRecommendations(userProfile: {
    education: string;
    skills: string[];
    sectors: string[];
    location: string;
  }): Promise<InternshipWithMatchScore[]> {
    const { data, error } = await supabase.functions.invoke('ai-recommendations', {
      body: { userProfile }
    });

    if (error) {
      console.error('Error getting AI recommendations:', error);
      throw new Error('Failed to get AI recommendations');
    }

    if (!data.success || !data.recommendations) {
      throw new Error('AI recommendation service returned invalid data');
    }

    return data.recommendations.map((rec: any) => ({
      ...rec,
      matchScore: rec.matchScore || 0
    }));
  },

  async fetchInternshipsByFilters(filters: {
    sectors?: string[];
    location?: string;
    skills?: string[];
  }): Promise<InternshipListing[]> {
    let query = supabase
      .from('internship_listings')
      .select('*')
      .eq('is_active', true);

    if (filters.location && filters.location !== 'Remote') {
      query = query.eq('location', filters.location);
    }

    if (filters.sectors && filters.sectors.length > 0) {
      query = query.in('sector', filters.sectors);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching filtered internships:', error);
      throw new Error('Failed to fetch filtered internships');
    }
    
    return data || [];
  },

  calculateMatchScore(
    userPreferences: {
      education: string;
      skills: string[];
      sectors: string[];
      location: string;
    },
    internship: InternshipListing
  ): number {
    // Create feature vectors for cosine similarity
    const userVector = this.createUserVector(userPreferences);
    const internshipVector = this.createInternshipVector(internship);
    
    // Calculate cosine similarity
    const similarity = this.cosineSimilarity(userVector, internshipVector);
    
    // Convert to percentage score
    return Math.round(similarity * 100);
  },

  createUserVector(userPreferences: {
    education: string;
    skills: string[];
    sectors: string[];
    location: string;
  }): number[] {
    const allSkills = ['javascript', 'react', 'python', 'java', 'sql', 'machine learning', 'data analysis', 'marketing', 'design', 'communication'];
    const allSectors = ['technology', 'healthcare', 'finance', 'education', 'marketing', 'research', 'consulting'];
    const allLocations = ['remote', 'new york', 'san francisco', 'london', 'mumbai', 'bangalore'];
    const educationLevels = ['undergraduate', 'graduate', 'postgraduate', 'professional'];
    
    const vector: number[] = [];
    
    // Education vector (normalized)
    educationLevels.forEach(level => {
      vector.push(userPreferences.education.toLowerCase() === level ? 1 : 0);
    });
    
    // Skills vector (TF-IDF inspired)
    allSkills.forEach(skill => {
      const matches = userPreferences.skills.filter(userSkill => 
        userSkill.toLowerCase().includes(skill) || skill.includes(userSkill.toLowerCase())
      ).length;
      vector.push(matches > 0 ? 1 : 0);
    });
    
    // Sectors vector
    allSectors.forEach(sector => {
      vector.push(userPreferences.sectors.some(userSector => 
        userSector.toLowerCase().includes(sector) || sector.includes(userSector.toLowerCase())
      ) ? 1 : 0);
    });
    
    // Location vector
    allLocations.forEach(location => {
      vector.push(
        userPreferences.location.toLowerCase().includes(location) || 
        location.includes(userPreferences.location.toLowerCase()) ||
        userPreferences.location.toLowerCase() === 'remote'
        ? 1 : 0
      );
    });
    
    return vector;
  },

  createInternshipVector(internship: InternshipListing): number[] {
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
      const skillMatches = internship.requirements.some(req => 
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
  },

  cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error('Vectors must have the same length');
    }
    
    const dotProduct = vectorA.reduce((sum, a, i) => sum + (a * vectorB[i]), 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + (a * a), 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + (b * b), 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
    
    return dotProduct / (magnitudeA * magnitudeB);
  },

  getEducationBonus(education: string): number {
    switch (education) {
      case 'postgraduate':
        return 1;
      case 'graduate':
        return 0.8;
      case 'undergraduate':
        return 0.6;
      case 'professional':
        return 0.9;
      default:
        return 0.5;
    }
  }
};