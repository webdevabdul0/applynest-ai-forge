import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, Key, Trash2, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }
    const updates = {
      full_name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      linkedin_url: profileData.linkedin,
      website_url: profileData.website,
    };
    const { error } = await updateProfile(updates);
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: "New passwords don't match.",
        variant: 'destructive',
      });
      return;
    }
    if (!passwordData.newPassword) {
      toast({
        title: 'Error',
        description: 'New password cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Changed',
        description: 'Your password has been updated successfully.',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Add confirmation dialog and integrate with Supabase
    console.log('Delete account requested');
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 bg-applynest-dark min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and data</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Settings */}
        <Card className="bg-applynest-slate border-applynest-slate-light/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-white">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                  placeholder="linkedin.com/in/yourname"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-white">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSaveProfile}
              className="bg-applynest-emerald hover:bg-applynest-emerald/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="bg-applynest-slate border-applynest-slate-light/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Key className="w-5 h-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-applynest-dark border-applynest-slate-light/30 text-white"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword" className="text-white">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleChangePassword}
              className="bg-applynest-blue hover:bg-applynest-blue/90"
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-applynest-slate border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button 
              onClick={handleDeleteAccount}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
