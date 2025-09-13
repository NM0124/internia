-- Create internship_listings table for actual internship postings
CREATE TABLE public.internship_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  stipend TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  sector TEXT NOT NULL,
  applicants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internship_listings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (anyone can view internships)
CREATE POLICY "Public can view active internship listings" 
ON public.internship_listings 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_internship_listings_updated_at
BEFORE UPDATE ON public.internship_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample internship data
INSERT INTO public.internship_listings (title, organization, location, duration, stipend, description, requirements, sector, applicants) VALUES
('Digital India Program Management Intern', 'Ministry of Electronics & IT', 'Delhi', '6 months', '₹25,000/month', 'Support digital transformation initiatives across rural and urban areas. Work on policy implementation and stakeholder coordination.', ARRAY['Digital Marketing', 'Project Management', 'Communication'], 'Technology', 125),
('Healthcare Policy Research Intern', 'NITI Aayog', 'Delhi', '4 months', '₹22,000/month', 'Conduct research on healthcare policies and their implementation. Analyze data and prepare policy briefs.', ARRAY['Research', 'Data Analysis', 'Policy Research'], 'Healthcare', 89),
('Rural Development Program Coordinator', 'Ministry of Rural Development', 'Bhopal', '5 months', '₹20,000/month', 'Coordinate development programs and track implementation progress. Engage with local communities.', ARRAY['Program Coordination', 'Field Work', 'Community Engagement'], 'Rural Development', 156),
('Education Technology Initiative Intern', 'Ministry of Education', 'Bangalore', '6 months', '₹28,000/month', 'Work on technology initiatives and digital platforms for education. Collaborate with tech partners and EdTech startups.', ARRAY['Technology', 'Project Management', 'Digital Marketing'], 'Education', 203),
('Environmental Policy Analysis Intern', 'Ministry of Environment', 'Chennai', '4 months', '₹21,000/month', 'Analyze environmental policies and their impact on climate change mitigation and sustainable development.', ARRAY['Policy Research', 'Data Analysis', 'Report Writing'], 'Environment', 78),
('Women Empowerment Program Intern', 'Ministry of Women & Child Development', 'Mumbai', '5 months', '₹23,000/month', 'Support women empowerment programs and track their effectiveness. Coordinate with NGOs and local women groups.', ARRAY['Program Coordination', 'Social Work', 'Event Management'], 'Women Empowerment', 134),
('Smart Cities Project Intern', 'Ministry of Housing & Urban Affairs', 'Pune', '6 months', '₹26,000/month', 'Assist in smart city planning and urban development projects. Conduct field visits and data collection for city planning.', ARRAY['Urban Planning', 'Data Analysis', 'Project Management'], 'Urban Planning', 167),
('Financial Inclusion Research Intern', 'Ministry of Finance', 'Mumbai', '4 months', '₹24,000/month', 'Research financial inclusion initiatives and analyze their effectiveness. Prepare reports and policy recommendations.', ARRAY['Financial Analysis', 'Research', 'Report Writing'], 'Finance', 92),
('Agricultural Innovation Intern', 'Ministry of Agriculture', 'Hyderabad', '5 months', '₹19,000/month', 'Support agricultural innovation projects and farmer engagement. Work on sustainable farming and crop yield improvement initiatives.', ARRAY['Agriculture', 'Research', 'Field Work'], 'Agriculture', 118),
('Social Welfare Program Intern', 'Ministry of Social Justice', 'Lucknow', '4 months', '₹20,000/month', 'Coordinate social welfare programs and beneficiary outreach. Track program implementation and community impact.', ARRAY['Social Work', 'Program Coordination', 'Community Engagement'], 'Social Services', 145);