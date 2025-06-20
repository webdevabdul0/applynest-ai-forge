import React from 'react';

interface ClassicResumeProps {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  experience: any;
  education: any;
  skills: any;
}

const ClassicResume: React.FC<ClassicResumeProps> = ({ fullName, email, phone, location, summary, experience, education, skills }) => (
  <div className="bg-white border border-gray-300 rounded p-8 max-w-2xl mx-auto text-black font-serif">
    <div className="border-b pb-4 mb-4">
      <h1 className="text-2xl font-bold uppercase tracking-wide">{fullName}</h1>
      <div className="text-gray-700 text-sm mt-2">{email} | {phone} | {location}</div>
      {summary && <p className="mt-2 text-gray-800 italic">{summary}</p>}
    </div>
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2 text-gray-800 border-b">Experience</h2>
      {Array.isArray(experience)
        ? experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">{exp.title}{exp.company && ` @ ${exp.company}`}</div>
              <div className="text-sm text-gray-700">{exp.location}{exp.dates && ` | ${exp.dates}`}</div>
              <div className="text-gray-900">{exp.description}</div>
            </div>
          ))
        : <div className="whitespace-pre-line text-gray-900">{experience}</div>
      }
    </div>
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2 text-gray-800 border-b">Education</h2>
      {Array.isArray(education)
        ? education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">{edu.degree}{edu.institution && ` @ ${edu.institution}`}</div>
              <div className="text-sm text-gray-700">{edu.location}{edu.dates && ` | ${edu.dates}`}</div>
              <div className="text-gray-900">{edu.description}</div>
            </div>
          ))
        : <div className="whitespace-pre-line text-gray-900">{education}</div>
      }
    </div>
    <div>
      <h2 className="text-lg font-bold mb-2 text-gray-800 border-b">Skills</h2>
      {Array.isArray(skills)
        ? <ul className="list-disc ml-6 text-gray-900">{skills.map((skill, idx) => <li key={idx}>{skill}</li>)}</ul>
        : <div className="whitespace-pre-line text-gray-900">{skills}</div>
      }
    </div>
  </div>
);

export default ClassicResume;

export const ClassicResumeMeta = {
  name: 'Classic',
  sections: [
    { key: 'summary', label: 'Summary', maxLength: 250 },
    { key: 'experience', label: 'Experience', maxLength: 700 },
    { key: 'education', label: 'Education', maxLength: 350 },
    { key: 'skills', label: 'Skills', maxLength: 150 },
  ]
}; 