interface InternshipApiData {
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
}

// Mock API data generators
const titles = [
  "Digital India Program Management Intern",
  "Healthcare Policy Research Intern", 
  "Rural Development Program Coordinator",
  "Education Technology Initiative Intern",
  "Environmental Policy Analysis Intern",
  "Women Empowerment Program Intern",
  "Smart Cities Project Intern",
  "Financial Inclusion Research Intern",
  "Agricultural Innovation Intern",
  "Social Welfare Program Intern",
  "Urban Planning Assistant Intern",
  "Climate Change Mitigation Intern",
  "Digital Skills Training Coordinator",
  "Public Health Data Analyst Intern",
  "Renewable Energy Project Intern"
];

const organizations = [
  "Ministry of Electronics & IT",
  "NITI Aayog",
  "Ministry of Rural Development", 
  "Ministry of Education",
  "Ministry of Environment",
  "Ministry of Women & Child Development",
  "Ministry of Housing & Urban Affairs",
  "Ministry of Finance",
  "Ministry of Agriculture",
  "Ministry of Social Justice",
  "Ministry of Urban Development",
  "Ministry of New & Renewable Energy",
  "Digital India Corporation",
  "National Health Authority",
  "Central Pollution Control Board"
];

const locations = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", 
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Bhopal", "Chandigarh",
  "Thiruvananthapuram", "Guwahati", "Bhubaneswar", "Gandhinagar"
];

const sectors = [
  "Technology", "Healthcare", "Rural Development", "Education", 
  "Environment", "Women Empowerment", "Smart Cities", "Finance",
  "Agriculture", "Social Welfare", "Urban Planning", "Energy"
];

const skillsPool = [
  "Digital Marketing", "Project Management", "Research", "Data Analysis",
  "Policy Research", "Communication", "Team Management", "Content Writing",
  "Social Media", "Event Management", "Program Coordination", "Public Speaking",
  "Report Writing", "Stakeholder Management", "Field Work", "MS Excel",
  "PowerPoint", "Community Engagement", "Survey Design", "Statistical Analysis"
];

const descriptions = [
  "Support digital transformation initiatives across rural and urban areas. Work on policy implementation and stakeholder coordination.",
  "Conduct research on policies and their implementation. Analyze data and prepare policy briefs.",
  "Coordinate development programs and track implementation progress. Engage with local communities.",
  "Work on technology initiatives and digital platforms. Collaborate with tech partners.",
  "Analyze policies and their impact. Support mitigation and development initiatives.",
  "Support empowerment programs and track their effectiveness. Coordinate with NGOs and local groups.",
  "Assist in planning and development projects. Conduct field visits and data collection.",
  "Research and analyze program effectiveness. Prepare reports and recommendations.",
  "Support innovation projects and farmer engagement. Work on sustainable development initiatives.",
  "Coordinate welfare programs and beneficiary outreach. Track program implementation and impact."
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomInternship(): InternshipApiData {
  const duration = getRandomElement(["3 months", "4 months", "5 months", "6 months"]);
  const stipendAmount = Math.floor(Math.random() * 15000) + 15000; // 15k to 30k
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: getRandomElement(titles),
    organization: getRandomElement(organizations),
    location: getRandomElement(locations),
    duration,
    stipend: `₹${stipendAmount.toLocaleString()}/month`,
    description: getRandomElement(descriptions),
    requirements: getRandomElements(skillsPool, Math.floor(Math.random() * 3) + 2), // 2-4 skills
    sector: getRandomElement(sectors),
    applicants: Math.floor(Math.random() * 200) + 50 // 50-250 applicants
  };
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const internshipApi = {
  async fetchInternships(count: number = 15): Promise<InternshipApiData[]> {
    // Simulate API call delay
    await delay(Math.random() * 1000 + 500); // 500-1500ms delay
    
    // Generate random internships
    const internships: InternshipApiData[] = [];
    for (let i = 0; i < count; i++) {
      internships.push(generateRandomInternship());
    }
    
    return internships;
  }
};

export type { InternshipApiData };