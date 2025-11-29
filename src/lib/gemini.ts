import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeResumeWithAI(resumeText: string) {
  try {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Resume text is too short or empty');
    }

    console.log('Initializing Gemini AI model...');
    // Use gemini-2.5-flash (latest stable model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const prompt = `
Analyze the following resume and extract structured information in JSON format.
Extract: name, email, phone, skills (array), experience (array with title, company, duration, description), 
education (array with degree, school, year), projects (array with name, description, tech array), 
summary, proficiencyLevel (Entry Level/Junior/Mid-Level/Senior/Lead), yearsOfExperience (number).

Resume text:
${resumeText}

Return ONLY valid JSON, no markdown or additional text. Ensure all arrays are properly formatted.
If a field is not found, use empty string for strings, empty array for arrays, or 0 for numbers.
`;

    console.log('Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received AI response, parsing JSON...');
    
    // Clean up the response to extract JSON
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Remove any leading/trailing whitespace
    jsonText = jsonText.trim();
    
    // Try to parse the JSON
    let analysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', jsonText.substring(0, 200));
      throw new Error('AI returned invalid JSON format');
    }
    
    // Validate required fields
    if (!analysis.skills || !Array.isArray(analysis.skills)) {
      analysis.skills = [];
    }
    if (!analysis.experience || !Array.isArray(analysis.experience)) {
      analysis.experience = [];
    }
    if (!analysis.projects || !Array.isArray(analysis.projects)) {
      analysis.projects = [];
    }
    if (!analysis.proficiencyLevel) {
      analysis.proficiencyLevel = 'Mid-Level';
    }
    if (!analysis.yearsOfExperience) {
      analysis.yearsOfExperience = 0;
    }
    
    console.log('Successfully analyzed resume');
    return analysis;
  } catch (error: any) {
    console.error('Error analyzing resume with AI:', error);
    console.error('Error details:', error.message);
    
    if (error.message?.includes('API key')) {
      throw new Error('AI service is not properly configured');
    } else if (error.message?.includes('invalid JSON')) {
      throw new Error('Failed to parse AI response');
    } else {
      throw new Error(`Failed to analyze resume: ${error.message || 'Unknown error'}`);
    }
  }
}

export async function generateInterviewPrep(
  role: string,
  technologies: string[]
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const prompt = `
Generate comprehensive interview preparation material for:
Role: ${role}
Technologies: ${technologies.join(', ')}

This should be GENERAL interview prep for this role type, NOT company-specific.

Return a JSON object with:
1. companyInsights: { 
   culture: "General overview of what this role typically involves",
   techStack: array of key technologies for this role,
   interviewProcess: "Typical interview process for this role",
   tips: array of general preparation tips
}
2. technicalQuestions: array of { question, difficulty (Easy/Medium/Hard), category, hints (array), answer }
3. behavioralQuestions: array of { question, category, framework (STAR), tips (array) }
4. studyGuide: array of { topic, priority (High/Medium/Low), resources (array of resource names/links), timeEstimate }

Generate 8-10 technical questions, 5-6 behavioral questions, and 6-8 study guide items.
Make questions specific to the role and technologies mentioned.
Focus on general industry best practices, not company-specific information.

Return ONLY valid JSON, no markdown or additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const material = JSON.parse(jsonText);
    return material;
  } catch (error) {
    console.error('Error generating interview prep:', error);
    throw new Error('Failed to generate interview material');
  }
}

export async function generateInterviewQuestions(
  company: string,
  role: string,
  technologies: string[]
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const prompt = `
Generate comprehensive interview preparation material for:
Company: ${company}
Role: ${role}
Technologies: ${technologies.join(', ')}

Return a JSON object with:
1. companyInsights: { culture, techStack (array), interviewProcess, tips (array) }
2. technicalQuestions: array of { question, difficulty (Easy/Medium/Hard), category, hints (array), answer }
3. behavioralQuestions: array of { question, category, framework (STAR), tips (array) }
4. studyGuide: array of { topic, priority (High/Medium/Low), resources (array), timeEstimate }

Generate 6-8 technical questions, 4-5 behavioral questions, and 5-6 study guide items.
Make questions specific to the role and technologies mentioned.

Return ONLY valid JSON, no markdown or additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const material = JSON.parse(jsonText);
    return material;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    throw new Error('Failed to generate interview material');
  }
}

export async function matchJobsToProfile(
  skills: string[],
  experience: number,
  proficiencyLevel: string,
  jobs: any[]
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const prompt = `
Given a candidate profile:
- Skills: ${skills.join(', ')}
- Years of Experience: ${experience}
- Proficiency Level: ${proficiencyLevel}

And these job listings:
${JSON.stringify(jobs, null, 2)}

For each job, calculate a match score (0-100) and provide match reasons.
Return a JSON array with: [{ jobId, matchScore, matchReasons (array of strings) }]

Consider:
- Skill overlap
- Experience level match
- Role seniority alignment
- Technology stack compatibility

Return ONLY valid JSON array, no markdown or additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const matches = JSON.parse(jsonText);
    return matches;
  } catch (error) {
    console.error('Error matching jobs:', error);
    throw new Error('Failed to match jobs');
  }
}

export async function analyzeSkillGaps(
  currentSkills: string[],
  targetJobs: any[]
) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });

    const prompt = `
Analyze skill gaps for a candidate:
Current Skills: ${currentSkills.join(', ')}

Target Jobs:
${JSON.stringify(targetJobs.map(j => ({ title: j.title, requirements: j.requirements })), null, 2)}

Return a JSON array of skill gaps: [{ skill, current (0-100), target (0-100), jobsRequiring (number) }]
Include skills the candidate has and skills they need to develop.

Return ONLY valid JSON array, no markdown or additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const gaps = JSON.parse(jsonText);
    return gaps;
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    throw new Error('Failed to analyze skill gaps');
  }
}
