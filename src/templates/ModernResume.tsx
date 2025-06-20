import React from 'react';

interface ModernResumeProps {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  experience: any;
  education: any;
  skills: any;
}

const ModernResume: React.FC<ModernResumeProps> = ({ fullName, email, phone, location, summary, experience, education, skills }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-black font-sans">
    <div className="border-b pb-4 mb-4">
      <h1 className="text-3xl font-bold">{fullName}</h1>
      <div className="text-gray-600 text-sm mt-2">{email} | {phone} | {location}</div>
      {summary && <p className="mt-2 text-gray-700">{summary}</p>}
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-applynest-emerald">Experience</h2>
      {Array.isArray(experience)
        ? experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">{exp.title}{exp.company && ` @ ${exp.company}`}</div>
              <div className="text-sm text-gray-600">{exp.location}{exp.dates && ` | ${exp.dates}`}</div>
              <div className="text-gray-800">{exp.description}</div>
            </div>
          ))
        : <div className="whitespace-pre-line text-gray-800">{experience}</div>
      }
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-applynest-blue">Education</h2>
      {Array.isArray(education)
        ? education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">{edu.degree}{edu.institution && ` @ ${edu.institution}`}</div>
              <div className="text-sm text-gray-600">{edu.location}{edu.dates && ` | ${edu.dates}`}</div>
              <div className="text-gray-800">{edu.description}</div>
            </div>
          ))
        : <div className="whitespace-pre-line text-gray-800">{education}</div>
      }
    </div>
    <div>
      <h2 className="text-xl font-semibold mb-2 text-applynest-purple">Skills</h2>
      {Array.isArray(skills)
        ? <ul className="list-disc ml-6 text-gray-800">{skills.map((skill, idx) => <li key={idx}>{skill}</li>)}</ul>
        : <div className="whitespace-pre-line text-gray-800">{skills}</div>
      }
    </div>
  </div>
);

export default ModernResume;

export const ModernResumeMeta = {
  name: 'Modern',
  sections: [
    { key: 'summary', label: 'Summary', maxLength: 300 },
    { key: 'experience', label: 'Experience', maxLength: 800 },
    { key: 'education', label: 'Education', maxLength: 400 },
    { key: 'skills', label: 'Skills', maxLength: 200 },
  ]
}; 