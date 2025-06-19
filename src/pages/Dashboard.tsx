
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PenTool, FolderOpen, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gradient-gray-dark min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your job search overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <FolderOpen className="w-8 h-8 text-applynest-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Interviews</p>
                <p className="text-2xl font-bold text-white">6</p>
              </div>
              <Clock className="w-8 h-8 text-applynest-emerald" />
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">25%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-applynest-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Offers</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <CheckCircle className="w-8 h-8 text-applynest-emerald" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="glass-effect hover:liquid-glass transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-applynest-emerald/20 rounded-lg flex items-center justify-center group-hover:bg-applynest-emerald/30 transition-colors">
                <FileText className="w-5 h-5 text-applynest-emerald" />
              </div>
              Build Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Create a tailored resume with AI assistance</p>
            <Link to="/resume-builder">
              <Button className="w-full bg-applynest-emerald hover:bg-applynest-emerald/90">
                Start Building
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:liquid-glass transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-applynest-blue/20 rounded-lg flex items-center justify-center group-hover:bg-applynest-blue/30 transition-colors">
                <PenTool className="w-5 h-5 text-applynest-blue" />
              </div>
              Write Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Generate compelling cover letters instantly</p>
            <Link to="/cover-letter-builder">
              <Button className="w-full bg-applynest-blue hover:bg-applynest-blue/90">
                Start Writing
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:liquid-glass transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-applynest-purple/20 rounded-lg flex items-center justify-center group-hover:bg-applynest-purple/30 transition-colors">
                <FolderOpen className="w-5 h-5 text-applynest-purple" />
              </div>
              Track Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">Organize and monitor your job applications</p>
            <Link to="/applications">
              <Button className="w-full bg-applynest-purple hover:bg-applynest-purple/90">
                View Tracker
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg glass-effect">
              <div className="w-2 h-2 bg-applynest-emerald rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Created resume for Software Engineer position</p>
                <p className="text-gray-400 text-sm">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg glass-effect">
              <div className="w-2 h-2 bg-applynest-blue rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Applied to TechCorp Inc.</p>
                <p className="text-gray-400 text-sm">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg glass-effect">
              <div className="w-2 h-2 bg-applynest-purple rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Generated cover letter for Product Manager role</p>
                <p className="text-gray-400 text-sm">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
