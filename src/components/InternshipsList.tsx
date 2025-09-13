import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, DollarSign, Users, Search, Filter, Loader2 } from "lucide-react";
import { supabaseInternshipService, InternshipListing } from "@/services/supabaseInternshipService";

interface InternshipsListProps {
  onBack?: () => void;
}

const sectorOptions = [
  "Healthcare", "Education", "Technology", "Agriculture", "Rural Development",
  "Urban Planning", "Environment", "Finance", "Social Services", "Infrastructure",
  "Digital India", "Skill Development", "Women Empowerment", "Youth Development"
];

const locationOptions = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Jaipur", "Lucknow", "Bhopal", "Chandigarh", "Thiruvananthapuram", "Guwahati", "Remote"
];

export default function InternshipsList({ onBack }: InternshipsListProps) {
  const [internships, setInternships] = useState<InternshipListing[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<InternshipListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    const fetchInternships = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await supabaseInternshipService.fetchInternships();
        setInternships(data);
        setFilteredInternships(data);
      } catch (err) {
        console.error('Failed to fetch internships:', err);
        setError('Failed to load internships. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    let filtered = internships;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sector filter
    if (selectedSector) {
      filtered = filtered.filter(internship => internship.sector === selectedSector);
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(internship => internship.location === selectedLocation);
    }

    setFilteredInternships(filtered);
  }, [internships, searchTerm, selectedSector, selectedLocation]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSector("");
    setSelectedLocation("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading internships...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Back to Form
        </Button>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Available Internships
        </h2>
        <p className="text-muted-foreground">
          Explore {internships.length} government internship opportunities
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter & Search
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger>
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectorOptions.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="grid gap-6">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No internships match your current filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-foreground mb-2">
                      {internship.title}
                    </CardTitle>
                    <CardDescription className="text-base text-primary font-medium">
                      {internship.organization}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                    {internship.sector}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {internship.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-success" />
                    <span>{internship.stipend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{internship.applicants} applicants</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {internship.requirements.map((requirement, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {requirement}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full bg-gradient-primary hover:bg-gradient-hero shadow-button transition-spring">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}