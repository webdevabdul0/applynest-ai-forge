
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Database error:', error);
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  };

  const addJobApplication = async (applicationData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job application added successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      handleError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateJobApplication = async (id: string, updates: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job application updated successfully",
      });
      
      return { data, error: null };
    } catch (error: any) {
      handleError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteJobApplication = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job application deleted successfully",
      });
      
      return { error: null };
    } catch (error: any) {
      handleError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
  };
};
