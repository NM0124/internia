import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building2, Clock, Users, ExternalLink, Star, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabaseInternshipService, type InternshipWithMatchScore } from "@/services/supabaseInternshipService";

interface FormData {
  education: string;
  skills: string[];
  sectors: string[];
  location: string;
}

type Internship = InternshipWithMatchScore;

interface RecommendationResultsProps {
  formData: FormData;
  onBack: () => void;
}

// Removed calculateMatchScore - now using service method

export default function RecommendationResults({ formData, onBack }: RecommendationResultsProps) {
  const [recommendations, setRecommendations] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get AI-powered recommendations
        const aiRecommendations = await supabaseInternshipService.getAIRecommendations(formData);
        setRecommendations(aiRecommendations);
      } catch (err) {
        setError('Failed to get AI recommendations. Please try again.');
        console.error('Error getting AI recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIRecommendations();
  }, [formData]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">AI Analyzing Your Profile</h2>
          <p className="text-muted-foreground">AI is analyzing 500+ internships to find your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center space-y-4">
        <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg">
          <h2 className="text-xl font-semibold text-destructive mb-2">Unable to Load Recommendations</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-primary/10 transition-smooth"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Form
        </Button>
        
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI-Powered Recommendations
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI analyzed {recommendations.length > 0 ? 'over 50' : 'all available'} internships and selected the top {recommendations.length} perfect matches for your profile using advanced matching algorithms.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Education</p>
              <p className="font-semibold capitalize">{formData.education}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skills</p>
              <p className="font-semibold">{formData.skills.length} skills</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interests</p>
              <p className="font-semibold">{formData.sectors.length} sectors</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">{formData.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="grid gap-6">
        {recommendations.map((internship, index) => (
          <Card 
            key={internship.id} 
            className="group hover:shadow-form transition-spring border-border/50 hover:border-primary/20"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      #{index + 1} Match
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {internship.matchScore}% Match
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                    {internship.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {internship.organization}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {internship.location}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-accent border-accent">
                  {internship.sector}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                {internship.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Requirements</h4>
                  <div className="flex flex-wrap gap-1">
                    {internship.requirements.map((req) => (
                      <Badge 
                        key={req} 
                        variant={formData.skills.includes(req) ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {internship.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stipend</p>
                    <p className="font-medium text-success">{internship.stipend}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {internship.applicants} applicants
                </span>
                
                <Button className="bg-gradient-primary hover:bg-gradient-hero transition-spring">
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="text-center bg-gradient-hero text-primary-foreground border-0">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-2">Ready to Start Your Journey?</h3>
          <p className="mb-4 opacity-90">
            These recommendations are curated specifically for your profile. Apply to multiple internships to increase your chances.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={onBack}>
              Refine Preferences
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Save Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
