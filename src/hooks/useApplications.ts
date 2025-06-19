
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Application } from '@/components/ApplicationCard';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to ensure correct status types
      const mappedApplications: Application[] = (data || []).map(app => ({
        ...app,
        status: ['applied', 'interviewing', 'offer', 'rejected'].includes(app.status) 
          ? app.status as Application['status']
          : 'applied'
      }));
      
      setApplications(mappedApplications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    loading,
    fetchApplications,
  };
};
