import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, MapPin, GraduationCap, Briefcase, Star } from "lucide-react";

interface FormData {
  education: string;
  skills: string[];
  sectors: string[];
  location: string;
}

interface InternshipFormProps {
  onSubmit: (data: FormData) => void;
}

const skillOptions = [
  "Data Analysis", "Project Management", "Communication", "Leadership", "Problem Solving",
  "Digital Marketing", "Research", "Strategic Planning", "Team Management", "Public Speaking",
  "Financial Analysis", "Policy Research", "Social Media", "Content Writing", "Event Management"
];

const sectorOptions = [
  "Healthcare", "Education", "Technology", "Agriculture", "Rural Development",
  "Urban Planning", "Environment", "Finance", "Social Services", "Infrastructure",
  "Digital India", "Skill Development", "Women Empowerment", "Youth Development"
];

const locationOptions = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Bhopal", "Chandigarh", "Thiruvananthapuram", "Guwahati", "Remote"
];

export default function InternshipForm({ onSubmit }: InternshipFormProps) {
  const [formData, setFormData] = useState<FormData>({
    education: "",
    skills: [],
    sectors: [],
    location: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const [showCustomSkill, setShowCustomSkill] = useState(false);

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill("");
    setShowCustomSkill(false);
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.education && formData.skills.length > 0 && formData.sectors.length > 0 && formData.location) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-form border-0 bg-gradient-card backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Find Your Perfect Internship
          </CardTitle>
          <CardDescription className="text-base">
            Tell us about yourself and we'll recommend the best PM internships for you
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Education Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education Level
              </Label>
              <Select value={formData.education} onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                <SelectTrigger className="border-border/50 focus:border-primary transition-smooth">
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="professional">Professional Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Skills
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    className="justify-start h-8 text-xs transition-spring"
                  >
                    {skill}
                  </Button>
                ))}
              </div>

              {!showCustomSkill ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomSkill(true)}
                  className="text-primary hover:text-primary-dark transition-smooth"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add custom skill
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                  />
                  <Button type="button" size="sm" onClick={() => addSkill(newSkill)}>
                    Add
                  </Button>
                </div>
              )}

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Sector Interests */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Sector Interests (Select up to 3)
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                {sectorOptions.map((sector) => (
                  <Button
                    key={sector}
                    type="button"
                    variant={formData.sectors.includes(sector) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSector(sector)}
                    disabled={!formData.sectors.includes(sector) && formData.sectors.length >= 3}
                    className="justify-start h-8 text-xs transition-spring"
                  >
                    {sector}
                  </Button>
                ))}
              </div>

              {formData.sectors.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                  {formData.sectors.map((sector) => (
                    <Badge key={sector} variant="default" className="gap-1">
                      {sector}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-primary-foreground/70"
                        onClick={() => toggleSector(sector)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Preferred Location
              </Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="border-border/50 focus:border-primary transition-smooth">
                  <SelectValue placeholder="Select preferred location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-gradient-hero shadow-button transition-spring"
              disabled={!formData.education || formData.skills.length === 0 || formData.sectors.length === 0 || !formData.location}
            >
              Get My Recommendations
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}