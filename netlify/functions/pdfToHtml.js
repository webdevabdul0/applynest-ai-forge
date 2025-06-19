import FormData from 'form-data';

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export default async function(event, context) {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: 'Method Not Allowed',
    };
  }

  const apiKey = process.env.CLOUDCONVERT_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: 'CloudConvert API key not set',
    };
  }

  // Parse the incoming PDF file (base64-encoded)
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: 'Invalid request body',
    };
  }
  const { pdfBase64, fileName } = body;
  if (!pdfBase64) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: 'Missing PDF data',
    };
  }

  // 1. Create a CloudConvert job
  const jobRes = await fetch('https://api.cloudconvert.com/v2/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tasks: {
        'import-my-file': {
          operation: 'import/base64',
          file: pdfBase64,
          filename: fileName || 'resume.pdf',
        },
        'convert-my-file': {
          operation: 'convert',
          input: 'import-my-file',
          input_format: 'pdf',
          output_format: 'html',
        },
        'export-my-file': {
          operation: 'export/url',
          input: 'convert-my-file',
        },
      },
    }),
  });
  const jobData = await jobRes.json();
  if (!jobData || !jobData.data || !jobData.data.id) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: 'Failed to create CloudConvert job',
    };
  }
  const jobId = jobData.data.id;

  // 2. Poll for job completion
  let htmlUrl = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const pollData = await pollRes.json();
    const exportTask = pollData.data.tasks.find(t => t.name === 'export-my-file');
    if (exportTask && exportTask.status === 'finished' && exportTask.result && exportTask.result.files && exportTask.result.files[0]) {
      htmlUrl = exportTask.result.files[0].url;
      break;
    }
    if (pollData.data.status === 'error') {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: 'CloudConvert job failed',
      };
    }
  }
  if (!htmlUrl) {
    return {
      statusCode: 504,
      headers: CORS_HEADERS,
      body: 'Timed out waiting for CloudConvert job',
    };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ htmlUrl }),
  };
} 