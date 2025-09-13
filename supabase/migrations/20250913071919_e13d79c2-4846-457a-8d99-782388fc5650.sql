-- Enable RLS on the internships table to fix security warning
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Create a public read policy for the internships table (if it contains general data)
CREATE POLICY "Public can read internships" 
ON public.internships 
FOR SELECT 
USING (true);