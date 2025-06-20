import React from 'react';
import ModernResume from './ModernResume';
import ClassicResume from './ClassicResume';
import ComprehensiveResume from './ComprehensiveResume';
import { UploadCloud } from 'lucide-react';

interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: string) => void;
  selectedTemplate: string;
  sampleData: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary?: string;
    experience: string;
    education: string;
    skills: string;
  };
}

const templates = [
  { name: 'Comprehensive', component: ComprehensiveResume },
  { name: 'Modern', component: ModernResume },
  { name: 'Classic', component: ClassicResume },
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ open, onClose, onSelect, selectedTemplate, sampleData }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Choose a Resume Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Uploaded Layout Option */}
          <div
            className={`border rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedTemplate === 'uploaded' ? 'border-applynest-emerald ring-2 ring-applynest-emerald' : 'border-gray-200 hover:border-applynest-blue'}`}
            onClick={() => onSelect('uploaded')}
          >
            <UploadCloud className="w-12 h-12 text-applynest-blue mb-2" />
            <div className="mb-2 text-center font-semibold">Select Uploaded Layout</div>
            <div className="text-xs text-gray-500 text-center">Use your uploaded resume's layout (PDF-to-HTML)</div>
          </div>
          {/* Pre-made templates with mocked content */}
          {templates.map(tpl => {
            const Comp = tpl.component;
            // Use mocked content for preview
            const mockData = {
              fullName: 'Jane Doe',
              email: 'jane.doe@email.com',
              phone: '+1 555-123-4567',
              location: 'San Francisco, CA',
              summary: 'Creative and detail-oriented software engineer with 5+ years of experience.',
              experience: 'Senior Developer at TechCorp\n- Led a team of 8 engineers\n- Built scalable web apps',
              education: 'B.Sc. in Computer Science, Stanford University',
              skills: 'JavaScript, React, Node.js, Python, Leadership',
            };
            return (
              <div
                key={tpl.name}
                className={`border rounded-lg p-2 cursor-pointer transition-all flex flex-col ${selectedTemplate === tpl.name ? 'border-applynest-emerald ring-2 ring-applynest-emerald' : 'border-gray-200 hover:border-applynest-blue'}`}
                onClick={() => onSelect(tpl.name)}
              >
                <div className="mb-2 text-center font-semibold">{tpl.name} Template</div>
                <div className="scale-90 origin-top-left pointer-events-none">
                  <Comp {...mockData} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-6">
          <button className="bg-applynest-emerald text-white px-4 py-2 rounded" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery; 