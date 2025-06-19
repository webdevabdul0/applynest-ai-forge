import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface Application {
  id: string;
  company_name: string;
  position_title: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  applied_date: string;
  notes?: string;
  job_url?: string;
  salary_range?: string;
  location?: string;
}

const statusConfig = {
  applied: { label: 'Applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  interviewing: { label: 'Interviewing', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  offer: { label: 'Offer', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

interface ApplicationCardProps {
  application: Application;
  onEdit?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export const ApplicationCard = ({ application, onEdit, onDelete }: ApplicationCardProps) => (
  <Card className="bg-applynest-gray-800 border-applynest-gray-600 hover:bg-applynest-gray-700 transition-all duration-200 cursor-move">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{application.position_title}</h3>
          <p className="text-sm text-gray-400">{application.company_name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit && onEdit(application)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete && onDelete(application)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">{application.applied_date}</span>
        {application.job_url && (
          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
        )}
      </div>
      
      {application.notes && (
        <p className="text-sm text-gray-300 mb-3">{application.notes}</p>
      )}

      {application.location && (
        <p className="text-xs text-gray-400 mb-2">{application.location}</p>
      )}

      {application.salary_range && (
        <p className="text-xs text-green-400 mb-3">{application.salary_range}</p>
      )}
      
      <Badge className={statusConfig[application.status].color}>
        {statusConfig[application.status].label}
      </Badge>
    </CardContent>
  </Card>
);

export type { Application };
