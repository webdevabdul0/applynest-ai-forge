
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  template_id INTEGER DEFAULT 1,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover letters table
CREATE TABLE public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT,
  position_title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  status TEXT CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected')) DEFAULT 'applied',
  applied_date DATE DEFAULT CURRENT_DATE,
  job_url TEXT,
  notes TEXT,
  salary_range TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work experience table
CREATE TABLE public.work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create education table
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  graduation_date DATE,
  gpa TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for resumes
CREATE POLICY "Users can view own resumes" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cover letters
CREATE POLICY "Users can view own cover letters" ON public.cover_letters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cover letters" ON public.cover_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cover letters" ON public.cover_letters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cover letters" ON public.cover_letters
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for job applications
CREATE POLICY "Users can view own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.job_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.job_applications
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for work experience
CREATE POLICY "Users can view own work experience" ON public.work_experience
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own work experience" ON public.work_experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work experience" ON public.work_experience
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work experience" ON public.work_experience
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for education
CREATE POLICY "Users can view own education" ON public.education
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own education" ON public.education
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education" ON public.education
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education" ON public.education
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for skills
CREATE POLICY "Users can view own skills" ON public.skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own skills" ON public.skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON public.skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills" ON public.skills
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cover_letters_updated_at
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
