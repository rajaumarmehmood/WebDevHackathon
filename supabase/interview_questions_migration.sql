-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_interview_questions_category ON interview_questions(category);

-- Insert sample technical questions
INSERT INTO interview_questions (question, category, difficulty) VALUES
('Can you explain the difference between var, let, and const in JavaScript?', 'technical', 'Easy'),
('What is the virtual DOM and how does React use it?', 'technical', 'Medium'),
('Explain the concept of closures in JavaScript with an example.', 'technical', 'Medium'),
('What are the main differences between SQL and NoSQL databases?', 'technical', 'Medium'),
('How would you optimize the performance of a web application?', 'technical', 'Hard'),
('Explain the concept of RESTful APIs and their principles.', 'technical', 'Medium'),
('What is the difference between synchronous and asynchronous programming?', 'technical', 'Easy'),
('How does garbage collection work in JavaScript?', 'technical', 'Hard'),
('What are the benefits of using TypeScript over JavaScript?', 'technical', 'Easy'),
('Explain the concept of middleware in Express.js.', 'technical', 'Medium');

-- Insert sample behavioral questions
INSERT INTO interview_questions (question, category, difficulty) VALUES
('Tell me about a time when you had to work under pressure to meet a deadline.', 'behavioral', 'Medium'),
('Describe a situation where you had to resolve a conflict with a team member.', 'behavioral', 'Medium'),
('Can you share an example of a project where you took initiative?', 'behavioral', 'Medium'),
('Tell me about a time when you failed and what you learned from it.', 'behavioral', 'Medium'),
('How do you handle feedback and criticism?', 'behavioral', 'Easy'),
('Describe a time when you had to learn a new technology quickly.', 'behavioral', 'Medium'),
('Tell me about a challenging problem you solved and your approach.', 'behavioral', 'Hard'),
('How do you prioritize tasks when working on multiple projects?', 'behavioral', 'Easy'),
('Describe a situation where you had to make a difficult decision.', 'behavioral', 'Medium'),
('Tell me about a time when you mentored or helped a colleague.', 'behavioral', 'Medium');

-- Enable Row Level Security (RLS)
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read questions
CREATE POLICY "Allow public read access" ON interview_questions
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert questions (optional)
CREATE POLICY "Allow authenticated insert" ON interview_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
