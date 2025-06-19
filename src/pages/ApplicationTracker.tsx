import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { KanbanColumn } from '@/components/KanbanColumn';
import { ApplicationStats } from '@/components/ApplicationStats';
import { useApplications } from '@/hooks/useApplications';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDatabase } from '@/hooks/useDatabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ApplicationTracker = () => {
  const { applications, loading, fetchApplications } = useApplications();
  const { addJobApplication } = useDatabase();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    position_title: '',
    status: 'applied',
    applied_date: '',
    job_url: '',
    notes: '',
    salary_range: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await addJobApplication(form);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message || 'Failed to add application', variant: 'destructive' });
    } else {
      toast({ title: 'Application Added', description: 'Job application added successfully.' });
      setShowAddForm(false);
      setForm({ company_name: '', position_title: '', status: 'applied', applied_date: '', job_url: '', notes: '', salary_range: '', location: '' });
      fetchApplications();
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-gray-dark min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-gray-dark min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Application Tracker</h1>
            <p className="text-gray-400">Track and organize your job applications</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-applynest-emerald hover:bg-applynest-emerald/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      <ApplicationStats applications={applications} />

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn status="applied" title="Applied" applications={applications} />
        <KanbanColumn status="interviewing" title="Interviewing" applications={applications} />
        <KanbanColumn status="offer" title="Offers" applications={applications} />
        <KanbanColumn status="rejected" title="Rejected" applications={applications} />
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} required />
            </div>
            <div>
              <Label>Position Title</Label>
              <Input value={form.position_title} onChange={e => setForm(f => ({ ...f, position_title: e.target.value }))} required />
            </div>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full bg-applynest-dark border-applynest-slate-light/30 text-white rounded-md p-2">
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <Label>Applied Date</Label>
              <Input type="date" value={form.applied_date} onChange={e => setForm(f => ({ ...f, applied_date: e.target.value }))} />
            </div>
            <div>
              <Label>Job URL</Label>
              <Input value={form.job_url} onChange={e => setForm(f => ({ ...f, job_url: e.target.value }))} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div>
              <Label>Salary Range</Label>
              <Input value={form.salary_range} onChange={e => setForm(f => ({ ...f, salary_range: e.target.value }))} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full bg-applynest-emerald" disabled={submitting}>{submitting ? 'Adding...' : 'Add Application'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationTracker;
