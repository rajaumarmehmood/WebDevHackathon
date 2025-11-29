import axios from 'axios';
import * as cheerio from 'cheerio';
import { Job } from './types';

const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_API_URL = 'https://serpapi.com/search.json';

// Search jobs using SERP API (Google Jobs)
export async function searchJobs(
  skills: string[],
  location: string = 'Remote',
  limit: number = 20
): Promise<Job[]> {
  // If SERP API key is not configured, fall back to mock data
  if (!SERP_API_KEY || SERP_API_KEY === 'your-serp-api-key-here') {
    console.warn('SERP_API_KEY not configured, using mock data');
    return generateJobListings(skills, location, limit);
  }

  try {
    // Create search query from top skills
    const topSkills = skills.slice(0, 3).join(' ');
    const query = `${topSkills} jobs ${location}`;

    console.log(`Searching jobs with SERP API: "${query}"`);

    // SERP API location handling
    let searchLocation = location;
    if (location === 'Remote') {
      searchLocation = 'United States';
    } else if (location === 'Pakistan') {
      searchLocation = 'Pakistan';
    }
    
    const response = await axios.get(SERP_API_URL, {
      params: {
        engine: 'google_jobs',
        q: query,
        location: searchLocation,
        api_key: SERP_API_KEY,
        num: limit,
      },
      timeout: 15000,
    });

    if (!response.data || !response.data.jobs_results) {
      console.warn('No jobs found from SERP API, using mock data');
      return generateJobListings(skills, location, limit);
    }

    const jobs: Job[] = response.data.jobs_results
      .filter((job: any) => {
        // Filter out jobs without description or with very short descriptions
        const description = job.description || '';
        return description.trim().length >= 50; // At least 50 characters
      })
      .map((job: any, index: number) => {
        // Parse salary if available
        let salary = 'Not specified';
        if (job.detected_extensions?.salary) {
          salary = job.detected_extensions.salary;
        } else if (job.salary) {
          salary = job.salary;
        }

        // Parse job type
        let jobType = 'Full-time';
        if (job.detected_extensions?.schedule_type) {
          jobType = job.detected_extensions.schedule_type;
        }

        // Extract requirements from description
        const requirements = extractRequirements(job.description, skills);

        return {
          id: job.job_id || `serp-job-${Date.now()}-${index}`,
          title: job.title || 'Untitled Position',
          company: job.company_name || 'Unknown Company',
          location: job.location || location,
          description: job.description.trim(),
          requirements,
          salary,
          type: jobType,
          posted: job.detected_extensions?.posted_at 
            ? parsePostedDate(job.detected_extensions.posted_at)
            : new Date(),
          url: job.share_link || job.apply_link || `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name)}`,
          source: 'Google Jobs (SERP API)',
          tags: requirements.slice(0, 5),
        };
      });

    console.log(`Found ${jobs.length} jobs with valid descriptions from SERP API`);
    return jobs;

  } catch (error: any) {
    console.error('Error fetching jobs from SERP API:', error.message);
    console.warn('Falling back to mock data');
    return generateJobListings(skills, location, limit);
  }
}

// Extract technical requirements from job description
function extractRequirements(description: string, userSkills: string[]): string[] {
  const commonTechSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Rails',
    'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'SASS', 'LESS',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'GitHub', 'GitLab', 'Jira', 'Agile', 'Scrum',
    'REST', 'GraphQL', 'API', 'Microservices',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
  ];

  const found = new Set<string>();
  const descLower = description.toLowerCase();

  // Check for common tech skills
  commonTechSkills.forEach(skill => {
    if (descLower.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  });

  // Check for user's skills
  userSkills.forEach(skill => {
    if (descLower.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  });

  return Array.from(found).slice(0, 10);
}

// Parse posted date from various formats
function parsePostedDate(postedStr: string): Date {
  const now = new Date();
  const lowerStr = postedStr.toLowerCase();

  if (lowerStr.includes('hour')) {
    const hours = parseInt(lowerStr) || 1;
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (lowerStr.includes('day')) {
    const days = parseInt(lowerStr) || 1;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  } else if (lowerStr.includes('week')) {
    const weeks = parseInt(lowerStr) || 1;
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
  } else if (lowerStr.includes('month')) {
    const months = parseInt(lowerStr) || 1;
    return new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);
  }

  return now;
}

function generateJobListings(skills: string[], location: string, limit: number): Job[] {
  const jobTemplates = [
    {
      titleTemplate: 'Frontend Developer',
      companies: ['TechCorp', 'InnovateLabs', 'DigitalWave', 'CodeCraft', 'WebSolutions'],
      requirements: ['React', 'TypeScript', 'CSS', 'JavaScript', 'HTML'],
      description: 'Build modern web applications using React and TypeScript. Work with a talented team to create user-friendly interfaces.',
      type: 'Full-time',
      salaryRange: ['$80k-$120k', '$90k-$130k', '$100k-$140k'],
    },
    {
      titleTemplate: 'Full Stack Engineer',
      companies: ['StartupXYZ', 'CloudTech', 'DataFlow', 'AppBuilder', 'TechVentures'],
      requirements: ['Node.js', 'React', 'MongoDB', 'Express', 'TypeScript'],
      description: 'Design and develop full-stack applications. Work on both frontend and backend systems.',
      type: 'Full-time',
      salaryRange: ['$100k-$150k', '$110k-$160k', '$120k-$170k'],
    },
    {
      titleTemplate: 'Backend Developer',
      companies: ['DataSystems', 'APIFirst', 'ServerTech', 'CloudBase', 'MicroServices Inc'],
      requirements: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
      description: 'Build scalable backend systems and APIs. Work with microservices architecture.',
      type: 'Full-time',
      salaryRange: ['$90k-$140k', '$100k-$150k', '$110k-$160k'],
    },
    {
      titleTemplate: 'Software Engineer Intern',
      companies: ['BigTech Inc', 'Innovation Labs', 'Tech Academy', 'Future Systems', 'Code School'],
      requirements: ['JavaScript', 'Python', 'Git', 'Data Structures', 'Algorithms'],
      description: 'Learn and contribute to real-world projects. Mentorship from senior engineers.',
      type: 'Internship',
      salaryRange: ['$30/hr', '$35/hr', '$40/hr'],
    },
    {
      titleTemplate: 'React Developer',
      companies: ['UIExperts', 'Frontend Masters', 'Component Co', 'React Pros', 'Modern Web'],
      requirements: ['React', 'Redux', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      description: 'Create beautiful and performant React applications. Focus on component architecture.',
      type: 'Full-time',
      salaryRange: ['$85k-$125k', '$95k-$135k', '$105k-$145k'],
    },
    {
      titleTemplate: 'DevOps Engineer',
      companies: ['CloudOps', 'Infrastructure Co', 'Deploy Systems', 'CI/CD Experts', 'AutoScale'],
      requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
      description: 'Manage infrastructure and deployment pipelines. Ensure system reliability.',
      type: 'Full-time',
      salaryRange: ['$100k-$150k', '$110k-$160k', '$120k-$170k'],
    },
    {
      titleTemplate: 'Mobile Developer',
      companies: ['AppMakers', 'Mobile First', 'Native Apps', 'Cross Platform', 'App Studio'],
      requirements: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile UI'],
      description: 'Build cross-platform mobile applications. Focus on performance and UX.',
      type: 'Full-time',
      salaryRange: ['$90k-$140k', '$100k-$150k', '$110k-$160k'],
    },
    {
      titleTemplate: 'Data Engineer',
      companies: ['DataPipe', 'Analytics Co', 'Big Data Inc', 'ETL Systems', 'Data Warehouse'],
      requirements: ['Python', 'SQL', 'Spark', 'Airflow', 'AWS'],
      description: 'Build data pipelines and ETL processes. Work with large-scale data systems.',
      type: 'Full-time',
      salaryRange: ['$100k-$150k', '$110k-$160k', '$120k-$170k'],
    },
  ];

  const jobs: Job[] = [];
  const now = new Date();

  for (let i = 0; i < Math.min(limit, jobTemplates.length * 3); i++) {
    const template = jobTemplates[i % jobTemplates.length];
    const companyIndex = Math.floor(Math.random() * template.companies.length);
    const salaryIndex = Math.floor(Math.random() * template.salaryRange.length);
    
    // Calculate days ago (random between 1-30 days)
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const postedDate = new Date(now);
    postedDate.setDate(postedDate.getDate() - daysAgo);

    const job: Job = {
      id: `job-${Date.now()}-${i}`,
      title: template.titleTemplate,
      company: template.companies[companyIndex],
      location: Math.random() > 0.5 ? location : ['San Francisco', 'New York', 'Austin', 'Seattle', 'Remote'][Math.floor(Math.random() * 5)],
      description: template.description,
      requirements: template.requirements,
      salary: template.salaryRange[salaryIndex],
      type: template.type,
      posted: postedDate,
      url: `https://example.com/jobs/${i}`,
      source: 'CareerAI',
      tags: template.requirements.slice(0, 3),
    };

    jobs.push(job);
  }

  // Filter jobs based on skill match
  const relevantJobs = jobs.filter(job => {
    const matchCount = job.requirements.filter(req => 
      skills.some(skill => skill.toLowerCase().includes(req.toLowerCase()) || 
                          req.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    return matchCount > 0;
  });

  return relevantJobs.length > 0 ? relevantJobs.slice(0, limit) : jobs.slice(0, limit);
}

// Scrape jobs from a website (example - use with caution and respect robots.txt)
export async function scrapeJobsFromWebsite(url: string): Promise<Partial<Job>[]> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const jobs: Partial<Job>[] = [];

    // This is a generic scraper - customize based on target website
    $('.job-listing').each((i, element) => {
      const title = $(element).find('.job-title').text().trim();
      const company = $(element).find('.company-name').text().trim();
      const location = $(element).find('.location').text().trim();
      const url = $(element).find('a').attr('href');

      if (title && company) {
        jobs.push({
          title,
          company,
          location,
          url: url ? (url.startsWith('http') ? url : `${new URL(url).origin}${url}`) : undefined,
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error('Error scraping jobs:', error);
    return [];
  }
}
