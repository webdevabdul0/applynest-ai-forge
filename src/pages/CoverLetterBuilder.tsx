import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Wand2, Download, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import OpenAI from "openai";

const CoverLetterBuilder = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    hiringManager: '',
    jobDescription: '',
    personalBackground: '',
    whyInterested: ''
  });
  
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedLetter('');
    try {
      const prompt = `Write a professional cover letter for the following job application.\n\nCompany: ${formData.companyName}\nPosition: ${formData.position}\nHiring Manager: ${formData.hiringManager}\nJob Description: ${formData.jobDescription}\nApplicant Background: ${formData.personalBackground}\nWhy Interested: ${formData.whyInterested}`;
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const endpoint = "https://models.github.ai/inference";
      const model = "openai/gpt-4.1";
      const client = new OpenAI({ 
        baseURL: endpoint, 
        apiKey: token,
        dangerouslyAllowBrowser: true 
      });
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant that writes cover letters." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        model: model,
        max_tokens: 900,
      });
      const aiLetter = response.choices?.[0]?.message?.content || '';
      setGeneratedLetter(aiLetter);
      toast({
        title: 'Cover Letter Generated!',
        description: 'Your personalized cover letter is ready.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate cover letter.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) {
      toast({
        title: 'No Cover Letter',
        description: 'Please generate a cover letter first.',
        variant: 'destructive',
      });
      return;
    }
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedLetter, 180);
    doc.text(lines, 10, 10);
    doc.save('cover_letter.pdf');
    toast({
      title: 'Download Started',
      description: 'Your cover letter PDF is being prepared.',
    });
  };

  return (
    <div className="p-6 bg-applynest-dark min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Cover Letter Builder</h1>
          <p className="text-gray-400">Generate compelling cover letters with AI</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="bg-applynest-slate border-applynest-slate-light/20">
            <CardHeader>
              <CardTitle className="text-white">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-white">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="position" className="text-white">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hiringManager" className="text-white">Hiring Manager (Optional)</Label>
                <Input
                  id="hiringManager"
                  value={formData.hiringManager}
                  onChange={(e) => setFormData(prev => ({ ...prev, hiringManager: e.target.value }))}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                  placeholder="Jane Smith"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-applynest-slate border-applynest-slate-light/20">
            <CardHeader>
              <CardTitle className="text-white">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-32"
                placeholder="Paste the job description here..."
              />
            </CardContent>
          </Card>

          <Card className="bg-applynest-slate border-applynest-slate-light/20">
            <CardHeader>
              <CardTitle className="text-white">Your Background</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.personalBackground}
                onChange={(e) => setFormData(prev => ({ ...prev, personalBackground: e.target.value }))}
                className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-24"
                placeholder="Briefly describe your relevant experience and skills..."
              />
            </CardContent>
          </Card>

          <Card className="bg-applynest-slate border-applynest-slate-light/20">
            <CardHeader>
              <CardTitle className="text-white">Why This Role?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.whyInterested}
                onChange={(e) => setFormData(prev => ({ ...prev, whyInterested: e.target.value }))}
                className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-24"
                placeholder="What interests you about this role and company?"
              />
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-applynest-blue hover:bg-applynest-blue/90 py-6"
          >
            {loading ? (
              <>Generating Cover Letter...</>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate AI Cover Letter
              </>
            )}
          </Button>
        </div>

        {/* Generated Letter Section */}
        <div className="space-y-6">
          <Card className="bg-applynest-slate border-applynest-slate-light/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Generated Cover Letter
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopy}
                    variant="outline" 
                    size="sm" 
                    className="border-applynest-slate-light/30"
                    disabled={!generatedLetter}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-applynest-emerald hover:bg-applynest-emerald/90"
                    disabled={!generatedLetter}
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 min-h-96 text-black">
                {generatedLetter ? (
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedLetter}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Fill in the details and click "Generate AI Cover Letter" to see your personalized letter</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
