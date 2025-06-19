
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-applynest-emerald to-applynest-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">404</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-gray-400 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-applynest-emerald hover:bg-applynest-emerald/90">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
