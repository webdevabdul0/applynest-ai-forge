
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PenTool, FolderOpen, Zap, Target, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-applynest-emerald to-applynest-blue rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">AN</span>
          </div>
          <span className="text-2xl font-bold gradient-text">ApplyNest</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-applynest-emerald hover:bg-applynest-emerald/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Land Your Dream Job with{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Applications
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
            Generate tailored resumes and cover letters in seconds. Track applications 
            with smart insights. Get hired faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="bg-applynest-emerald hover:bg-applynest-emerald/90 text-lg px-8 py-6">
                Start Building Your Future
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
          
          {/* Screenshot Placeholder */}
          <div className="glass-effect rounded-2xl p-8 mx-auto max-w-5xl">
            <div className="bg-applynest-slate rounded-xl h-96 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop" 
                alt="ApplyNest Dashboard Preview"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Streamline your job search with intelligent tools designed to maximize your success rate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-applynest-slate border-applynest-slate-light/20 hover:border-applynest-emerald/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-applynest-emerald/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-applynest-emerald/30 transition-colors">
                <FileText className="w-6 h-6 text-applynest-emerald" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI Resume Builder</h3>
              <p className="text-gray-400 leading-relaxed">
                Paste any job description and get a perfectly tailored resume in seconds. 
                Choose from professional templates and export as PDF.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-applynest-slate border-applynest-slate-light/20 hover:border-applynest-blue/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-applynest-blue/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-applynest-blue/30 transition-colors">
                <PenTool className="w-6 h-6 text-applynest-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Cover Letters</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate compelling cover letters that highlight your unique value proposition 
                for each specific role and company.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-applynest-slate border-applynest-slate-light/20 hover:border-applynest-purple/30 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-applynest-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-applynest-purple/30 transition-colors">
                <FolderOpen className="w-6 h-6 text-applynest-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Application Tracker</h3>
              <p className="text-gray-400 leading-relaxed">
                Organize applications with Kanban boards. Track status, add notes, 
                and never miss a follow-up opportunity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-8 h-8 text-applynest-emerald" />
                <span className="text-4xl font-bold gradient-text">10x</span>
              </div>
              <p className="text-gray-400">Faster Application Process</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="w-8 h-8 text-applynest-blue" />
                <span className="text-4xl font-bold gradient-text">85%</span>
              </div>
              <p className="text-gray-400">Higher Response Rate</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <BarChart3 className="w-8 h-8 text-applynest-purple" />
                <span className="text-4xl font-bold gradient-text">3x</span>
              </div>
              <p className="text-gray-400">More Interview Invites</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="gradient-text">Job Search?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of job seekers who've accelerated their career with ApplyNest
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-applynest-emerald hover:bg-applynest-emerald/90 text-lg px-12 py-6">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-applynest-slate-light/20 py-12">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-applynest-emerald to-applynest-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AN</span>
            </div>
            <span className="text-xl font-bold gradient-text">ApplyNest</span>
          </div>
          <p>&copy; 2024 ApplyNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
