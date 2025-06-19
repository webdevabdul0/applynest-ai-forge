import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Wand2, Download, Eye, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import OpenAI from "openai";
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResumeBuilder = () => {
  const [mode, setMode] = useState<'scratch' | 'upload'>('scratch');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfText, setPdfText] = useState<string>('');
  const [pdfError, setPdfError] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  });
  
  const [jobDescription, setJobDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [pdfCanvasUrl, setPdfCanvasUrl] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [resumeFont, setResumeFont] = useState('Inter, Arial, sans-serif');
  const [detectedFonts, setDetectedFonts] = useState<string[]>([]);
  const [fontStyles, setFontStyles] = useState<any[]>([]);
  const [htmlStyleInfo, setHtmlStyleInfo] = useState<any[]>([]);
  
  const { toast } = useToast();

  // Set workerSrc for pdfjs using CDN (works with Vite)
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  // Parse PDF when uploadedFile changes (no resume check)
  React.useEffect(() => {
    if (!uploadedFile) {
      setPdfText('');
      setPdfError('');
      return;
    }
    setPdfLoading(true);
    setPdfText('');
    setPdfError('');
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setPdfText(text);
      } catch (err: any) {
        setPdfError('Failed to parse PDF. Please upload a valid PDF file.');
      } finally {
        setPdfLoading(false);
      }
    };
    reader.onerror = () => {
      setPdfError('Failed to read file.');
      setPdfLoading(false);
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, [uploadedFile]);

  // Render PDF as canvas when uploadedFile changes (first page only)
  React.useEffect(() => {
    if (!uploadedFile) {
      setPdfCanvasUrl(null);
      return;
    }
    const renderCanvas = async () => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext('2d');
          await page.render({ canvasContext: context, viewport }).promise;
          setPdfCanvasUrl(canvas.toDataURL());
        } catch (err) {
          setPdfCanvasUrl(null);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    };
    renderCanvas();
  }, [uploadedFile]);

  // Responsive: hide original on mobile by default
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (isMobile) setShowOriginal(false);
    else setShowOriginal(true);
  }, [isMobile]);

  // Detect fonts from PDF when uploadedFile changes
  useEffect(() => {
    if (!uploadedFile) return;
    extractFontsFromPDF(uploadedFile).then(fonts => {
      setDetectedFonts(fonts);
      // Optionally, map PDF font names to web fonts
      if (fonts.length > 0) {
        // Simple mapping: if font name contains 'Times', use Times New Roman, etc.
        const fontMap: { [key: string]: string } = {
          'Times': 'Times New Roman, Times, serif',
          'Arial': 'Arial, Helvetica, sans-serif',
          'Helvetica': 'Arial, Helvetica, sans-serif',
          'Georgia': 'Georgia, serif',
          'Roboto': 'Roboto, Arial, sans-serif',
          'Montserrat': 'Montserrat, Arial, sans-serif',
          'Lato': 'Lato, Arial, sans-serif',
        };
        for (const f of fonts) {
          for (const key in fontMap) {
            if (f.toLowerCase().includes(key.toLowerCase())) {
              setResumeFont(fontMap[key]);
              return;
            }
          }
        }
      }
    });
  }, [uploadedFile]);

  // Detect detailed font styles from PDF when uploadedFile changes
  useEffect(() => {
    if (!uploadedFile) return;
    extractFontStylesFromPDF(uploadedFile).then(styles => {
      setFontStyles(styles);
    });
  }, [uploadedFile]);

  // On PDF upload, convert to HTML and parse style info
  useEffect(() => {
    if (!uploadedFile) return;
    (async () => {
      try {
        const { styleInfo } = await convertPdfToHtmlAndParse(uploadedFile);
        setHtmlStyleInfo(styleInfo);
      } catch (err) {
        // Optionally show error to user
        setHtmlStyleInfo([]);
      }
    })();
  }, [uploadedFile]);

  const handleGenerateResume = async () => {
    setLoading(true);
    setGeneratedResume('');
    try {
      const prompt = `Generate a professional resume for the following user.\n\nPersonal Info: ${JSON.stringify(personalInfo)}\n\nJob Description: ${jobDescription}\n\nExperience: ${experience}\n\nEducation: ${education}\n\nSkills: ${skills}`;
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
          { role: "system", content: "You are a helpful assistant that generates resumes." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        model: model,
        max_tokens: 1200,
      });
      const aiResume = response.choices?.[0]?.message?.content || '';
      setGeneratedResume(aiResume);
      toast({
        title: 'Resume Generated!',
        description: 'Your tailored resume is ready for review.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate resume.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedResume) {
      toast({
        title: 'No Resume',
        description: 'Please generate a resume first.',
        variant: 'destructive',
      });
      return;
    }
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedResume, 180);
    doc.text(lines, 10, 10);
    doc.save('resume.pdf');
    toast({
      title: 'Download Started',
      description: 'Your resume PDF is being prepared.',
    });
  };

  // AI tailoring for uploaded PDF
  const [uploadJobDescription, setUploadJobDescription] = useState('');
  const [uploadTailoredResume, setUploadTailoredResume] = useState('');
  const [uploadAILoading, setUploadAILoading] = useState(false);
  const handleTailorUploadedResume = async () => {
    setUploadAILoading(true);
    setUploadTailoredResume('');
    try {
      const prompt = `You are an expert resume writer. Here is a resume extracted from a PDF:\n\n${pdfText}\n\nHere is a job description to tailor the resume for:\n\n${uploadJobDescription}\n\nRewrite the resume to best match the job description, keeping the structure and content professional. Do NOT include any introductory phrases like 'Certainly!', 'Here is your tailored resume', or similar. Only output the resume content, formatted for direct use.`;
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
          { role: "system", content: "You are a helpful assistant that tailors resumes." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        model: model,
        max_tokens: 1200,
      });
      const aiResume = response.choices?.[0]?.message?.content || '';
      setUploadTailoredResume(aiResume);
      toast({
        title: 'Resume Tailored!',
        description: 'Your tailored resume is ready for review.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to tailor resume.',
        variant: 'destructive',
      });
    } finally {
      setUploadAILoading(false);
    }
  };

  // Paginate the generated resume preview into A4 pages
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;
  function isSectionHeader(line: string) {
    return /^#+\s/.test(line);
  }
  function isListItem(line: string) {
    return /^\s*[-*+]\s|^\s*\d+\.\s/.test(line);
  }
  function isEmpty(line: string) {
    return /^\s*$/.test(line);
  }
  function PaginatedResume({ content, fontFamily, styleMap }: { content: string, fontFamily: string, styleMap?: any }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<string[]>([content]);

    useLayoutEffect(() => {
      if (!containerRef.current) return;
      const temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.style.visibility = 'hidden';
      temp.style.width = `${A4_WIDTH}px`;
      temp.style.fontFamily = fontFamily;
      temp.style.padding = '32px';
      temp.style.boxSizing = 'border-box';
      document.body.appendChild(temp);
      let markdown = content;
      let pageContents: string[] = [];
      let lines = markdown.split(/\n(?=\S)/g); // split at newlines before non-whitespace (section breaks)
      let current = '';
      for (let i = 0; i < lines.length; i++) {
        let test = current ? current + '\n' + lines[i] : lines[i];
        temp.innerHTML = '';
        temp.appendChild(document.createElement('div'));
        (temp.firstChild as HTMLElement)!.innerHTML = test.replace(/\n/g, '<br/>');
        if (temp.offsetHeight > A4_HEIGHT - 64) {
          // Try to break at previous section header or paragraph
          let breakIdx = -1;
          for (let j = i - 1; j >= 0; j--) {
            if (isSectionHeader(lines[j]) || isEmpty(lines[j])) {
              breakIdx = j;
              break;
            }
          }
          if (breakIdx >= 0 && breakIdx < i - 1) {
            // Break at the found section header/paragraph
            let before = lines.slice(0, breakIdx + 1).join('\n');
            let after = lines.slice(breakIdx + 1).join('\n');
            pageContents.push(before);
            lines = [after, ...lines.slice(i + 1)];
            i = 0;
            current = '';
            continue;
          } else if (current) {
            pageContents.push(current);
            current = lines[i];
          } else {
            current = lines[i];
          }
        } else {
          current = test;
        }
      }
      if (current) pageContents.push(current);
      setPages(pageContents);
      document.body.removeChild(temp);
    }, [content, fontFamily]);

    return (
      <div className="flex flex-col gap-8">
        {pages.map((page, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md overflow-hidden relative text-black"
            style={{
              width: A4_WIDTH,
              minHeight: A4_HEIGHT,
              maxWidth: '100%',
              fontFamily,
              padding: 32,
              boxSizing: 'border-box',
              margin: '0 auto',
              pageBreakAfter: 'always',
            }}
          >
            <ReactMarkdown
              children={page}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 style={styleMap?.h1} className="mb-2" {...props} />,
                h2: ({node, ...props}) => <h2 style={styleMap?.h2} className="mt-6 mb-2 border-b pb-1" {...props} />,
                h3: ({node, ...props}) => <h3 style={styleMap?.h3} className="mt-4 mb-1" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-2" {...props} />,
                li: ({node, ...props}) => <li style={styleMap?.li || styleMap?.p} className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                p: ({node, ...props}) => <p style={styleMap?.p} className="mb-2" {...props} />,
              }}
            />
            <div className="absolute bottom-4 right-8 text-xs text-gray-400">Page {idx + 1}</div>
          </div>
        ))}
      </div>
    );
  }

  // Utility to extract font names from PDF text content using pdfjs-dist
  async function extractFontsFromPDF(file: File): Promise<string[]> {
    try {
      const reader = new FileReader();
      return await new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            const fontSet = new Set<string>();
            for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // check first 3 pages
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              for (const item of content.items) {
                if (typeof item === 'object' && 'fontName' in item) {
                  fontSet.add((item as any).fontName);
                }
              }
            }
            resolve(Array.from(fontSet));
          } catch (err) {
            resolve([]);
          }
        };
        reader.onerror = () => resolve([]);
        reader.readAsArrayBuffer(file);
      });
    } catch {
      return [];
    }
  }

  // Utility to extract detailed font styles from PDF text content using pdfjs-dist, including real font family
  async function extractFontStylesFromPDF(file: File): Promise<any[]> {
    try {
      const reader = new FileReader();
      return await new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
            const styles: any[] = [];
            for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) { // check first 3 pages
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              for (const item of content.items) {
                if (typeof item === 'object' && 'fontName' in item && 'str' in item && 'transform' in item) {
                  // Font size is transform[0] (scaleX) or transform[3] (scaleY)
                  const fontSize = Math.round(Math.abs((item as any).transform[0]));
                  const fontName = (item as any).fontName;
                  let fontFamily = undefined;
                  try {
                    const fontObj = (page as any).commonObjs.get(fontName);
                    fontFamily = fontObj?.fontFamily || fontObj?.fallbackName || undefined;
                  } catch {}
                  styles.push({
                    text: (item as any).str,
                    fontName,
                    fontFamily,
                    fontSize,
                    transform: (item as any).transform,
                  });
                }
              }
            }
            resolve(styles);
          } catch (err) {
            resolve([]);
          }
        };
        reader.onerror = () => resolve([]);
        reader.readAsArrayBuffer(file);
      });
    } catch {
      return [];
    }
  }

  // Utility: Map PDF font resource names to web fonts (expand as needed)
  function mapPdfFontToWebFont(pdfFont: string): string {
    if (!pdfFont) return 'Inter, Arial, sans-serif';
    const map: { [key: string]: string } = {
      'Times': 'Times New Roman, Times, serif',
      'Arial': 'Arial, Helvetica, sans-serif',
      'Helvetica': 'Arial, Helvetica, sans-serif',
      'Georgia': 'Georgia, serif',
      'Roboto': 'Roboto, Arial, sans-serif',
      'Montserrat': 'Montserrat, Arial, sans-serif',
      'Lato': 'Lato, Arial, sans-serif',
    };
    for (const key in map) {
      if (pdfFont.toLowerCase().includes(key.toLowerCase())) return map[key];
    }
    return 'Inter, Arial, sans-serif';
  }

  // Build a style map from detected fontStyles
  function buildStyleMap(fontStyles: any[]) {
    if (!fontStyles || fontStyles.length === 0) return {};
    // Cluster by font size
    const sorted = [...fontStyles].sort((a, b) => b.fontSize - a.fontSize);
    const uniqueSizes = Array.from(new Set(sorted.map(s => s.fontSize)));
    // Assign largest to h1, next to h2, next to h3, smallest to p/li
    const styleMap: any = {};
    if (uniqueSizes.length > 0) {
      const h1 = sorted.find(s => s.fontSize === uniqueSizes[0]);
      if (h1) styleMap.h1 = {
        fontFamily: mapPdfFontToWebFont(h1.fontName),
        fontSize: h1.fontSize + 4,
        fontWeight: /bold/i.test(h1.fontName) ? 'bold' : '700',
      };
    }
    if (uniqueSizes.length > 1) {
      const h2 = sorted.find(s => s.fontSize === uniqueSizes[1]);
      if (h2) styleMap.h2 = {
        fontFamily: mapPdfFontToWebFont(h2.fontName),
        fontSize: h2.fontSize + 2,
        fontWeight: /bold/i.test(h2.fontName) ? 'bold' : '600',
      };
    }
    if (uniqueSizes.length > 2) {
      const h3 = sorted.find(s => s.fontSize === uniqueSizes[2]);
      if (h3) styleMap.h3 = {
        fontFamily: mapPdfFontToWebFont(h3.fontName),
        fontSize: h3.fontSize,
        fontWeight: /bold/i.test(h3.fontName) ? 'bold' : '500',
      };
    }
    // Body text (smallest size)
    const p = sorted.find(s => s.fontSize === uniqueSizes[uniqueSizes.length - 1]);
    if (p) styleMap.p = {
      fontFamily: mapPdfFontToWebFont(p.fontName),
      fontSize: p.fontSize,
      fontWeight: /bold/i.test(p.fontName) ? 'bold' : 'normal',
    };
    // Bullets: look for lines that look like bullets
    const bullet = fontStyles.find(s => /^[-•*]/.test(s.text.trim()));
    if (bullet) styleMap.li = {
      fontFamily: mapPdfFontToWebFont(bullet.fontName),
      fontSize: bullet.fontSize,
      fontWeight: /bold/i.test(bullet.fontName) ? 'bold' : 'normal',
    };
    return styleMap;
  }

  // Automated font resource clustering and mapping
  function autoBuildStyleMap(fontStyles: any[]) {
    if (!fontStyles || fontStyles.length === 0) return {};
    // Group by fontName
    const fontGroups: { [fontName: string]: { items: any[], avgSize: number, count: number, example: any } } = {};
    for (const s of fontStyles) {
      if (!fontGroups[s.fontName]) fontGroups[s.fontName] = { items: [], avgSize: 0, count: 0, example: s };
      fontGroups[s.fontName].items.push(s);
      fontGroups[s.fontName].count++;
      fontGroups[s.fontName].avgSize += s.fontSize;
    }
    for (const k in fontGroups) {
      fontGroups[k].avgSize /= fontGroups[k].count;
    }
    // Sort font resources by average size (desc)
    const sortedFonts = Object.entries(fontGroups).sort((a, b) => b[1].avgSize - a[1].avgSize);
    // Heuristic: largest = h1, next = h2, next = h3, smallest/most frequent = p/li
    const styleMap: any = {};
    const scale = sortedFonts[0] ? 32 / sortedFonts[0][1].avgSize : 1.8; // scale so largest = 32px
    if (sortedFonts[0]) {
      const f = sortedFonts[0][1];
      styleMap.h1 = {
        fontFamily: guessWebFont(f.example),
        fontSize: Math.round(f.avgSize * scale),
        fontWeight: guessWeight(f.example),
      };
    }
    if (sortedFonts[1]) {
      const f = sortedFonts[1][1];
      styleMap.h2 = {
        fontFamily: guessWebFont(f.example),
        fontSize: Math.round(f.avgSize * scale),
        fontWeight: guessWeight(f.example),
      };
    }
    if (sortedFonts[2]) {
      const f = sortedFonts[2][1];
      styleMap.h3 = {
        fontFamily: guessWebFont(f.example),
        fontSize: Math.round(f.avgSize * scale),
        fontWeight: guessWeight(f.example),
      };
    }
    // Body: most frequent font resource (by count)
    const mostFrequent = Object.entries(fontGroups).sort((a, b) => b[1].count - a[1].count)[0];
    if (mostFrequent) {
      const f = mostFrequent[1];
      styleMap.p = {
        fontFamily: guessWebFont(f.example),
        fontSize: Math.round(f.avgSize * scale),
        fontWeight: guessWeight(f.example),
      };
      styleMap.li = styleMap.p;
    }
    // If a font resource is used for bullets, use for li
    for (const [fontName, group] of Object.entries(fontGroups)) {
      if (group.items.some(s => /^[-•*]/.test(s.text.trim()))) {
        styleMap.li = {
          fontFamily: guessWebFont(group.example),
          fontSize: Math.round(group.avgSize * scale),
          fontWeight: guessWeight(group.example),
        };
      }
    }
    return styleMap;
  }

  function guessWebFont(example: any) {
    // Guess based on fontFamily, fallback to Inter
    const f = example.fontFamily || '';
    if (/times/i.test(f)) return 'Times New Roman, Times, serif';
    if (/arial/i.test(f)) return 'Arial, Helvetica, sans-serif';
    if (/helvetica/i.test(f)) return 'Arial, Helvetica, sans-serif';
    if (/georgia/i.test(f)) return 'Georgia, serif';
    if (/roboto/i.test(f)) return 'Roboto, Arial, sans-serif';
    if (/montserrat/i.test(f)) return 'Montserrat, Arial, sans-serif';
    if (/lato/i.test(f)) return 'Lato, Arial, sans-serif';
    // If fontName looks like a serif, guess Times
    if (/f1|serif|roman/i.test(example.fontName)) return 'Times New Roman, Times, serif';
    // If fontName looks like a sans, guess Inter
    if (/f2|f3|sans|inter|arial|helvetica/i.test(example.fontName)) return 'Inter, Arial, sans-serif';
    return 'Inter, Arial, sans-serif';
  }

  function guessWeight(example: any) {
    if (/bold/i.test(example.fontName) || /bold/i.test(example.fontFamily || '')) return 'bold';
    if (/semibold/i.test(example.fontName) || /semibold/i.test(example.fontFamily || '')) return 600;
    return 'normal';
  }

  // Helper: Convert PDF to HTML via Netlify function and parse style info
  async function convertPdfToHtmlAndParse(file) {
    // Read file as base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const b64 = (reader.result as string).split(',')[1];
          resolve(b64);
        } else {
          // ArrayBuffer fallback
          const arr = new Uint8Array(reader.result as ArrayBuffer);
          let binary = '';
          for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i]);
          resolve(btoa(binary));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    // Call Netlify Function
    const res = await fetch('https://applynest.netlify.app/.netlify/functions/pdfToHtml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64: base64, fileName: file.name }),
    });
    if (!res.ok) throw new Error('Failed to convert PDF');
    const { htmlUrl } = await res.json();
    // Fetch and parse HTML
    const htmlText = await fetch(htmlUrl).then(r => r.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    // Extract style info from HTML elements
    const elements = Array.from(doc.body.querySelectorAll('*'));
    const styleInfo = elements.map(el => {
      return {
        tag: el.tagName,
        text: el.textContent.trim(),
        style: el.getAttribute('style') || '',
        class: el.getAttribute('class') || '',
      };
    }).filter(info => info.text);
    return { htmlUrl, styleInfo };
  }

  return (
    <div className="p-6 bg-applynest-dark min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Builder</h1>
          <p className="text-gray-400">Create a tailored resume with AI assistance</p>
        </div>
      </div>
      {/* Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={mode === 'scratch' ? 'default' : 'outline'}
          className={mode === 'scratch' ? 'bg-applynest-emerald text-white' : ''}
          onClick={() => setMode('scratch')}
        >
          Create from Scratch
        </Button>
        <Button
          variant={mode === 'upload' ? 'default' : 'outline'}
          className={mode === 'upload' ? 'bg-applynest-blue text-white' : ''}
          onClick={() => setMode('upload')}
        >
          Upload Existing Resume
        </Button>
      </div>
      {/* Upload Resume UI */}
      {mode === 'upload' && (
        <div className="mb-8">
          {/* Upload and generation UI at the top */}
          <div className="mb-8">
            <label className="block text-white mb-2 text-lg font-semibold" htmlFor="resume-upload">Upload your resume PDF</label>
            <div
              className={
                `flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors duration-200 cursor-pointer ` +
                (uploadedFile ? 'border-emerald-400 bg-emerald-50/10' : 'border-applynest-slate-light/30 bg-applynest-slate/40 hover:border-emerald-400')
              }
              onClick={() => document.getElementById('resume-upload')?.click()}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files?.[0]) setUploadedFile(e.dataTransfer.files[0]);
              }}
            >
              {!uploadedFile ? (
                <>
                  <UploadCloud className="w-12 h-12 text-emerald-400 mb-2" />
                  <span className="text-white font-medium">Drag & drop your PDF here, or <span className="underline text-emerald-400">browse</span></span>
                  <span className="text-xs text-gray-400 mt-1">Only PDF files are supported</span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">{uploadedFile.name}</span>
                    <button
                      className="ml-2 p-1 rounded hover:bg-red-500/20"
                      onClick={e => { e.stopPropagation(); setUploadedFile(null); }}
                      title="Remove file"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">PDF uploaded</span>
                </div>
              )}
              <input
                id="resume-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={e => setUploadedFile(e.target.files?.[0] || null)}
              />
            </div>
            {pdfLoading && <div className="mt-2 text-blue-400">Parsing PDF...</div>}
            {pdfError && <div className="mt-2 text-red-400">{pdfError}</div>}
            {pdfText && (
              <div className="mt-4">
                <div className="text-green-400 font-semibold mb-2">Extracted Resume Text</div>
                <div className="mt-2 bg-applynest-slate text-white p-4 rounded max-h-64 overflow-y-auto text-xs whitespace-pre-wrap">
                  {pdfText}
                </div>
                {/* Job description input and AI button */}
                <div className="mt-6">
                  <label className="block text-white mb-2 font-medium" htmlFor="upload-job-desc">Paste Job Description</label>
                  <Textarea
                    id="upload-job-desc"
                    value={uploadJobDescription}
                    onChange={e => setUploadJobDescription(e.target.value)}
                    className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-24"
                    placeholder="Paste the job description here for AI to tailor your resume..."
                  />
                  <Button
                    onClick={handleTailorUploadedResume}
                    disabled={uploadAILoading || !uploadJobDescription}
                    className="mt-4 w-full bg-applynest-emerald hover:bg-applynest-emerald/90 py-4"
                  >
                    {uploadAILoading ? 'Tailoring Resume...' : 'Tailor Resume with AI'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Toggle for original resume preview */}
          {pdfCanvasUrl && (
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="border-applynest-slate-light/30"
                onClick={() => setShowOriginal(v => !v)}
              >
                {showOriginal ? 'Hide' : 'Show'} Original Resume
              </Button>
              <span className="text-xs text-gray-400">(Original preview is hidden by default on mobile)</span>
            </div>
          )}
          {/* Side-by-side preview */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Original Resume Preview (PDF as image/canvas) */}
            {pdfCanvasUrl && showOriginal && (
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="text-white text-sm mb-2">Original Resume</div>
                <div className="relative w-fit mx-auto" style={{ width: 794 }}>
                  <img src={pdfCanvasUrl} alt="PDF Preview" className="block max-w-full border rounded shadow" style={{ maxWidth: 794, width: '100%' }} />
                </div>
              </div>
            )}
            {/* Generated Resume Preview (A4 size) */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div className="text-white text-sm mb-2">Generated Resume (Editable Preview)</div>
              <div
                className="bg-white rounded-lg shadow-md overflow-auto border"
                style={{
                  width: 794, // A4 width px @ 96dpi
                  minHeight: 1123, // A4 height px @ 96dpi
                  maxWidth: '100%',
                  fontFamily: resumeFont,
                  padding: 32,
                  boxSizing: 'border-box',
                  margin: '0 auto',
                }}
              >
                {uploadTailoredResume ? (
                  <PaginatedResume content={uploadTailoredResume} fontFamily={resumeFont} styleMap={autoBuildStyleMap(fontStyles)} />
                ) : (
                  <div className="text-gray-400 text-center">Your tailored resume will appear here.</div>
                )}
              </div>
            </div>
          </div>
          {/* Show parsed HTML style info summary below previews */}
          {htmlStyleInfo.length > 0 && (
            <div className="mt-8 bg-applynest-slate/60 rounded p-4 text-white text-xs max-w-4xl mx-auto">
              <div className="font-bold mb-2">Parsed HTML Style Info (first 20 elements):</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {htmlStyleInfo.slice(0, 20).map((s, i) => (
                  <div key={i} className="flex flex-col border-b border-applynest-slate-light/20 pb-1 mb-1">
                    <span><span className="font-semibold">Tag:</span> {s.tag}</span>
                    <span><span className="font-semibold">Text:</span> "{s.text}"</span>
                    <span><span className="font-semibold">Style:</span> {s.style}</span>
                    <span><span className="font-semibold">Class:</span> {s.class}</span>
                  </div>
                ))}
              </div>
              {htmlStyleInfo.length > 20 && <div className="text-gray-400 mt-2">...and {htmlStyleInfo.length - 20} more</div>}
            </div>
          )}
        </div>
      )}
      {/* Existing form only if creating from scratch */}
      {mode === 'scratch' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-applynest-slate border-applynest-slate-light/20">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-applynest-dark border-applynest-slate-light/30 text-white"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="bg-applynest-slate border-applynest-slate-light/20">
              <CardHeader>
                <CardTitle className="text-white">Target Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-32"
                  placeholder="Paste the job description here for AI to tailor your resume..."
                />
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-applynest-slate border-applynest-slate-light/20">
              <CardHeader>
                <CardTitle className="text-white">Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-32"
                  placeholder="List your work experience, achievements, and responsibilities..."
                />
              </CardContent>
            </Card>

            {/* Education & Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-applynest-slate border-applynest-slate-light/20">
                <CardHeader>
                  <CardTitle className="text-white">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-24"
                    placeholder="Your educational background..."
                  />
                </CardContent>
              </Card>

              <Card className="bg-applynest-slate border-applynest-slate-light/20">
                <CardHeader>
                  <CardTitle className="text-white">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-applynest-dark border-applynest-slate-light/30 text-white min-h-24"
                    placeholder="List your technical and soft skills..."
                  />
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleGenerateResume}
              disabled={loading}
              className="w-full bg-applynest-emerald hover:bg-applynest-emerald/90 py-6"
            >
              {loading ? (
                <>Generating Resume...</>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Resume
                </>
              )}
            </Button>
            {generatedResume && (
              <Card className="bg-applynest-slate border-applynest-slate-light/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">Generated Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-white text-sm">{generatedResume}</pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="bg-applynest-slate border-applynest-slate-light/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Resume Preview
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-applynest-slate-light/30">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      onClick={handleDownloadPDF}
                      size="sm" 
                      className="bg-applynest-blue hover:bg-applynest-blue/90"
                      disabled={!generatedResume}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-8 min-h-96 text-black">
                  {personalInfo.fullName ? (
                    <div className="space-y-4">
                      <div className="text-center border-b pb-4">
                        <h2 className="text-2xl font-bold">{personalInfo.fullName}</h2>
                        <p className="text-gray-600">{personalInfo.email} | {personalInfo.phone}</p>
                        <p className="text-gray-600">{personalInfo.location}</p>
                      </div>
                      
                      {experience && (
                        <div>
                          <h3 className="font-bold text-lg mb-2">Experience</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">{experience}</p>
                        </div>
                      )}
                      
                      {education && (
                        <div>
                          <h3 className="font-bold text-lg mb-2">Education</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">{education}</p>
                        </div>
                      )}
                      
                      {skills && (
                        <div>
                          <h3 className="font-bold text-lg mb-2">Skills</h3>
                          <p className="text-gray-700 whitespace-pre-wrap">{skills}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>Fill in your information to see the preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
