
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Application } from './ApplicationCard';

interface ApplicationStatsProps {
  applications: Application[];
}

export const ApplicationStats = ({ applications }: ApplicationStatsProps) => {
  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status);
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <Card className="bg-applynest-gray-800 border-applynest-gray-600">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{applications.length}</p>
          <p className="text-sm text-gray-400">Total Applications</p>
        </CardContent>
      </Card>
      <Card className="bg-applynest-gray-800 border-applynest-gray-600">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{getApplicationsByStatus('interviewing').length}</p>
          <p className="text-sm text-gray-400">Interviewing</p>
        </CardContent>
      </Card>
      <Card className="bg-applynest-gray-800 border-applynest-gray-600">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{getApplicationsByStatus('offer').length}</p>
          <p className="text-sm text-gray-400">Offers</p>
        </CardContent>
      </Card>
      <Card className="bg-applynest-gray-800 border-applynest-gray-600">
        <CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-applynest-emerald">
            {applications.length > 0 ? Math.round((getApplicationsByStatus('offer').length / applications.length) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-400">Success Rate</p>
        </CardContent>
      </Card>
    </div>
  );
};
