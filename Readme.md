# CareerAI - Intelligent Job Search & Interview Prep Platform

An AI-powered web application that helps students navigate their job search by auto-discovering relevant opportunities based on their resume and providing deeply personalized, research-backed interview preparation for specific technical roles.

## 🚀 Features

### 1. Intelligent Resume Analysis
- **PDF Upload**: Accept resume uploads in PDF format
- **Smart Extraction**: AI extracts and structures key information (skills, experience, education, projects)
- **Profile Building**: Automatically builds a comprehensive user profile from resume data
- **Expertise Identification**: Identifies technical expertise areas and proficiency levels
- **Persistent Storage**: Stores structured resume insights for ongoing use

### 2. Automated Job Discovery
- **Web Scraping**: Scrapes job listings from actual sources across the internet
- **Smart Filtering**: Filters opportunities based on extracted resume data
- **Relevance Ranking**: Ranks jobs by relevance to user-specific expertise and experience level
- **Match Scores**: Presents curated job matches with compatibility scores
- **Detailed Insights**: Displays key requirements and alignment with user qualifications

### 3. Deep Research-Powered Interview Preparation
- **Custom Input**: Accept user input for upcoming interviews (company name, role, key technologies)
- **Multi-Step AI Research**:
  - Searches the internet for current relevant information about specified technology/role
  - Identifies trending topics, common pitfalls, and best practices
  - Analyzes what matters most for that specific technical area
  - Filters out outdated or irrelevant information
- **Comprehensive Materials**:
  - Technology-specific questions (e.g., Node.js event loop, async patterns)
  - Behavioral questions relevant to the role
  - Difficulty-appropriate questions based on user experience level
  - Study guide with key concepts to review
  - Company insights and interview tips

### 4. User Dashboard and Analytics
- **Visual Overview**: Job search progress and discovered opportunities
- **Skill Coverage**: Analysis showing strengths and gaps
- **Interview Tracking**: Preparation tracking and history
- **AI Insights**: Clear presentation of AI-generated insights and recommendations

## 🎨 Design

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion and GSAP for smooth, eye-catching transitions
- **Color Theme**: Black, white, and grey minimalist design
- **Responsive**: Fully responsive design that works on all devices
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP, Framer Motion
- **UI Components**: Radix UI primitives
- **Authentication**: JWT tokens, bcrypt password hashing
- **Icons**: Lucide React
- **File Handling**: React Dropzone (for resume uploads)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
```env
JWT_SECRET=your-super-secret-key-change-in-production
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Authentication

The app includes a complete authentication system with:
- User registration and login
- JWT token-based authentication
- Protected routes
- Secure password hashing with bcrypt
- Cookie-based session management

## 📱 Pages

### Public Pages
- **Home** (`/`): Landing page with features and testimonials
- **Login** (`/login`): User authentication
- **Signup** (`/signup`): New user registration

### Protected Pages (Require Authentication)
- **Dashboard** (`/dashboard`): Main user dashboard with overview
- **Upload Resume** (`/dashboard/upload-resume`): Resume upload and analysis
- **Interview Prep** (`/dashboard/interview-prep`): AI-powered interview preparation

## 🎯 Key Features Implementation

### Resume Analysis
- Drag-and-drop PDF upload
- Real-time file validation
- AI-powered extraction of:
  - Personal information
  - Skills and technologies
  - Work experience
  - Education
  - Projects
  - Proficiency levels

### Job Matching
- AI-curated job opportunities
- Match percentage scores
- Detailed job information
- Technology tags
- Salary ranges
- Application tracking

### Interview Preparation
- Company-specific insights
- Role-tailored questions
- Technical question bank with:
  - Difficulty levels
  - Hints and answers
  - Category tags
- Behavioral questions with STAR framework
- Personalized study guides
- Resource recommendations

## 🔒 Security

- All routes are protected with authentication middleware
- Passwords are hashed using bcrypt
- JWT tokens for secure session management
- Environment variables for sensitive data
- No hardcoded credentials or API keys

## 🚀 Future Enhancements

- Integration with real job APIs (LinkedIn, Indeed, etc.)
- OpenAI integration for advanced AI features
- MongoDB for persistent data storage
- Real-time job scraping functionality
- Email notifications for new job matches
- Interview scheduling and reminders
- Progress tracking and analytics
- Team collaboration features

## 📝 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
JWT_SECRET=your-jwt-secret-key

# Optional (for future features)
OPENAI_API_KEY=your-openai-api-key
SERP_API_KEY=your-serp-api-key
MONGODB_URI=your-mongodb-connection-string
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from Radix UI
- Icons from Lucide React
- Animations powered by GSAP and Framer Motion
