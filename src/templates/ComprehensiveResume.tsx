import React from 'react';

interface ComprehensiveResumeProps {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary?: string;
  experience?: any;
  education?: any;
  skills?: any;
  certifications?: any;
  projects?: any;
  languages?: any;
  awards?: any;
  interests?: any;
  references?: any;
}

const sectionTitle = (title: string) => (
  <h2 className="text-lg font-bold mt-6 mb-2 border-b pb-1 text-applynest-emerald uppercase tracking-wide">{title}</h2>
);

const ComprehensiveResume: React.FC<ComprehensiveResumeProps> = (props) => {
  const {
    fullName, email, phone, location, summary,
    experience, education, skills, certifications,
    projects, languages, awards, interests, references
  } = props;
  return (
    <div className="bg-white rounded-lg shadow-lg p-10 mx-auto text-black font-sans" style={{ width: 794, minHeight: 1123, maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-applynest-blue">{fullName}</h1>
          <div className="text-gray-600 text-base mt-2">{email} | {phone} | {location}</div>
        </div>
      </div>
      {summary && (
        <div className="mb-4">
          {sectionTitle('Summary')}
          <div className="text-gray-800">{summary}</div>
        </div>
      )}
      {experience && Array.isArray(experience) && experience.length > 0 && (
        <div>
          {sectionTitle('Experience')}
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold text-lg">{exp.title}{exp.company && ` @ ${exp.company}`}</div>
              <div className="text-sm text-gray-600">{exp.location}{exp.dates && ` | ${exp.dates}`}</div>
              <div className="text-gray-800">{exp.description}</div>
            </div>
          ))}
        </div>
      )}
      {education && Array.isArray(education) && education.length > 0 && (
        <div>
          {sectionTitle('Education')}
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold text-lg">{edu.degree}{edu.institution && ` @ ${edu.institution}`}</div>
              <div className="text-sm text-gray-600">{edu.location}{edu.dates && ` | ${edu.dates}`}</div>
              <div className="text-gray-800">{edu.description}</div>
            </div>
          ))}
        </div>
      )}
      {skills && Array.isArray(skills) && skills.length > 0 && (
        <div>
          {sectionTitle('Skills')}
          <ul className="list-disc ml-6 text-gray-800 flex flex-wrap gap-2">
            {skills.map((skill, idx) => <li key={idx}>{skill}</li>)}
          </ul>
        </div>
      )}
      {certifications && Array.isArray(certifications) && certifications.length > 0 && (
        <div>
          {sectionTitle('Certifications')}
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{cert.name}</div>
              <div className="text-sm text-gray-600">{cert.issuer}{cert.date && ` | ${cert.date}`}</div>
            </div>
          ))}
        </div>
      )}
      {projects && Array.isArray(projects) && projects.length > 0 && (
        <div>
          {sectionTitle('Projects')}
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{proj.name}</div>
              <div className="text-sm text-gray-600">{proj.link}</div>
              <div className="text-gray-800">{proj.description}</div>
            </div>
          ))}
        </div>
      )}
      {languages && Array.isArray(languages) && languages.length > 0 && (
        <div>
          {sectionTitle('Languages')}
          <ul className="list-disc ml-6 text-gray-800 flex flex-wrap gap-2">
            {languages.map((lang, idx) => <li key={idx}>{lang}</li>)}
          </ul>
        </div>
      )}
      {awards && Array.isArray(awards) && awards.length > 0 && (
        <div>
          {sectionTitle('Awards')}
          {awards.map((award, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{award.title}</div>
              <div className="text-sm text-gray-600">{award.issuer}{award.date && ` | ${award.date}`}</div>
              <div className="text-gray-800">{award.description}</div>
            </div>
          ))}
        </div>
      )}
      {interests && Array.isArray(interests) && interests.length > 0 && (
        <div>
          {sectionTitle('Interests')}
          <ul className="list-disc ml-6 text-gray-800 flex flex-wrap gap-2">
            {interests.map((interest, idx) => <li key={idx}>{interest}</li>)}
          </ul>
        </div>
      )}
      {references && Array.isArray(references) && references.length > 0 && (
        <div>
          {sectionTitle('References')}
          {references.map((ref, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{ref.name}</div>
              <div className="text-sm text-gray-600">{ref.contact}</div>
              <div className="text-gray-800">{ref.relationship}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComprehensiveResume; 