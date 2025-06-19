import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationCard, Application } from './ApplicationCard';

interface KanbanColumnProps {
  status: Application['status'];
  title: string;
  applications: Application[];
  onEdit?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export const KanbanColumn = ({ status, title, applications, onEdit, onDelete }: KanbanColumnProps) => {
  const apps = applications.filter(app => app.status === status);
  
  return (
    <div className="flex-1 min-w-80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          {title}
          <Badge variant="secondary" className="bg-applynest-gray-700 text-gray-300">
            {apps.length}
          </Badge>
        </h2>
      </div>
      
      <div className="space-y-3 min-h-96">
        {apps.map(app => (
          <ApplicationCard key={app.id} application={app} onEdit={onEdit} onDelete={onDelete} />
        ))}
        
        {apps.length === 0 && (
          <div className="border-2 border-dashed border-applynest-gray-600/30 rounded-lg p-8 text-center">
            <p className="text-gray-400">No applications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
