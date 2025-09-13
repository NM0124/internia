import { useState } from "react";
import InternshipForm from "@/components/InternshipForm";
import RecommendationResults from "@/components/RecommendationResults";
import InternshipsList from "@/components/InternshipsList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Award, MapPin, Search } from "lucide-react";

interface FormData {
  education: string;
  skills: string[];
  sectors: string[];
  location: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'results' | 'browse'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentStep('results');
  };

  const handleBack = () => {
    setCurrentStep('form');
  };

  const handleBrowseInternships = () => {
    setCurrentStep('browse');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-6 shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">PM Internship Portal</h1>
              <p className="text-primary-foreground/90 mt-1">AI-Powered Career Recommendations</p>
            </div>
            <Badge variant="secondary" className="hidden md:flex">
              Government of India
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {currentStep === 'form' ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Discover Your Perfect
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Government Internship
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our AI-powered recommendation engine matches your skills, interests, and location 
                preferences with the best PM internship opportunities across India.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-foreground">10,000+</h3>
                <p className="text-muted-foreground">Active Interns</p>
              </div>
              <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
                <Award className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-foreground">500+</h3>
                <p className="text-muted-foreground">Programs Available</p>
              </div>
              <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
                <MapPin className="w-8 h-8 text-success mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-foreground">28</h3>
                <p className="text-muted-foreground">States & UTs</p>
              </div>
            </div>

            {/* Form */}
            <InternshipForm onSubmit={handleFormSubmit} />

            {/* Browse All Internships Button */}
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleBrowseInternships}
                className="border-primary/30 hover:bg-primary/5 transition-smooth"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse All Available Internships
              </Button>
            </div>
          </div>
        ) : currentStep === 'results' ? (
          <RecommendationResults formData={formData!} onBack={handleBack} />
        ) : (
          <InternshipsList onBack={handleBack} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 A Government Initiative</p>
            <p className="mt-2 text-sm">Building tomorrow's leaders through meaningful experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
