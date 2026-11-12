/**
 * Single Source of Truth for 3D Anime Adventurers' Guild Portfolio
 * Edit this file to update portfolio data without touching UI or 3D components.
 */

// Helper to check if a value is empty or an unfilled placeholder
export const isTODO = (val) => {
  if (!val) return true;
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    return trimmed === '' || trimmed === 'todo' || trimmed.startsWith('todo:');
  }
  return false;
};

export const profile = {
  name: 'Sudhir',
  guildTitle: 'Adventurer', // editable guild title
  rank: 'TODO', // Shown on the guild card; hidden if TODO/empty
  classes: ['AI/ML Developer', 'Full-Stack Developer'],
  tagline: 'Building applied-AI and full-stack projects',
  education: 'Sri Eshwar College of Engineering, Computer and Communication Engineering, 2024-2028',
};

export const quests = [
  {
    id: 'launchpad-ai',
    title: 'LaunchPad AI',
    rank: 'A',
    status: 'Completed',
    statusNote: 'hackathon build',
    track: ['AIML', 'FULLSTACK'],
    summary:
      'Multi-agent startup accelerator that turns a raw idea into an investor-ready pitch through 7 AI agents (Idea Validator, Patent & Prior Art Search, Market Research, Competitor Analysis, Business Model Generator, Pitch Deck Generator, Investor Matching). Built for the AGENTVERSE Grand Challenge 2026 (36-hour hackathon).',
    tech: ['Python', 'FastAPI', 'Next.js', 'React', 'Tailwind', 'SQLAlchemy', 'Gemini', 'Groq'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [
      'Patent search uses the real USPTO PatentsView API',
      'Investor discovery is web-search grounded',
      'PDF report export',
      'Automatic LLM provider fallback',
      'Team of 3',
    ],
  },
  {
    id: 'shieldvision',
    title: 'ShieldVision: CCTV Violence Detection',
    rank: 'A',
    status: 'In Progress',
    statusNote: '',
    track: ['AIML'],
    summary:
      'Surveillance system that detects violence, intrusion, and fire/smoke from camera streams in real time.',
    tech: ['Python', 'OpenCV', 'YOLOv8', 'BiLSTM + VGG16/MobileNet', 'Flask', 'PostgreSQL'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [
      'Real-time alerts over SSE',
      'ROI polygon drawing for intrusion zones',
      'GPU with CPU fallback',
      'Being converted to a desktop app (PyQt)',
      'Team of 2',
    ],
  },
  {
    id: 'veritext-ai',
    title: 'VeriText AI',
    rank: 'B',
    status: 'In Progress',
    statusNote: '',
    track: ['AIML'],
    summary:
      'Explainable detector for AI-generated text that shows a probability, the influential words and style measures, and always states that the result is an estimate, not proof.',
    tech: ['Python', 'scikit-learn', 'TF-IDF', 'Gradio'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [
      'Compares several classical models',
      'Reports false positive rate',
      'Limitations stated openly',
    ],
  },
  {
    id: 'ai365-cce',
    title: 'AI365 @ CCE',
    rank: 'B',
    status: 'In Progress',
    statusNote: '',
    track: ['FULLSTACK'],
    summary:
      'Department platform for tracking AI activities, a digital skill passport with QR verification, and accreditation reporting.',
    tech: ['React'], // Note: confirm full stack
    links: {
      github: '',
      demo: '',
    },
    highlights: [
      '4 user roles',
      'Submission -> faculty verification -> passport update workflow',
      'About 27 pages',
    ],
  },
  {
    id: 'ai-study-tool',
    title: 'AI Study Tool Chrome Extension',
    rank: 'B',
    status: 'In Progress',
    statusNote: '',
    track: ['AIML'],
    summary:
      'Chrome extension that summarizes webpages, YouTube videos and PDFs and generates flashcards, quizzes and a chatbot. Built during an agentic AI internship at Algo Tutor.',
    tech: ['FastAPI', 'Gemini API', 'Groq (Llama 3.1)', 'Whisper', 'JavaScript'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [],
  },
  {
    id: 'retail-iq',
    title: 'RetailIQ',
    rank: 'B',
    status: 'In Progress',
    statusNote: '',
    track: ['AIML'],
    summary:
      'Retail analytics project covering data cleaning, EDA, feature engineering, ML models, a Power BI dashboard and a Streamlit app on a multi-table star-schema dataset.',
    tech: ['Python', 'Power BI', 'Streamlit'],
    links: {
      github: 'https://github.com/sudhir796/RetailIQ',
      demo: '',
    },
    highlights: [],
  },
  {
    id: 'ai-health-insurance',
    title: 'AI Health Insurance Assistant',
    rank: 'B',
    status: 'Completed',
    statusNote: '',
    track: ['AIML'],
    summary:
      'RAG-based assistant that answers health insurance policy questions from policy documents.',
    tech: ['Python', 'LLaMA 3', 'RAG', 'Docling', 'LiteLLM', 'OpenRouter'],
    links: {
      github: '',
      demo: '',
    },
    highlights: ['PDF extraction and chunking pipeline'],
  },
  {
    id: 'lost-and-found',
    title: 'Lost & Found Campus Portal',
    rank: 'C',
    status: 'Completed',
    statusNote: '',
    track: ['FULLSTACK'],
    summary: 'Campus lost-and-found portal with privacy-first in-app messaging.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [],
  },
  {
    id: 'attendance-monitoring',
    title: 'Attendance Monitoring System',
    rank: 'C',
    status: 'In Progress',
    statusNote: '',
    track: ['FULLSTACK'],
    summary:
      'Dashboard for late-arrival tracking, department attendance summaries, a compliance workflow, and class-level entry with PDF reports emailed to HODs.',
    tech: ['React', 'Express', 'Nodemailer', 'jsPDF'],
    links: {
      github: '',
      demo: '',
    },
    highlights: [],
  },
  {
    id: 'eluria-school',
    title: 'Eluria School of Excellence',
    rank: 'C',
    status: 'Completed',
    statusNote: '',
    track: ['FULLSTACK'],
    summary:
      'Full-stack school management system built during an internship at Aptitude Guru, with role-based access for students, parents, staff and admin.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
    links: {
      github: '',
      demo: '',
    },
    highlights: ['Secure authentication', 'RESTful APIs'],
  },
];

export const abilities = {
  groups: [
    {
      id: 'languages',
      name: 'Languages',
      badge: 'Runes',
      items: ['C', 'C++', 'JavaScript', 'Java', 'Python', 'HTML', 'CSS'],
    },
    {
      id: 'frameworks',
      name: 'Frameworks',
      badge: 'Grimoires',
      items: ['React', 'Node.js', 'Express', 'Spring Boot', 'FastAPI', 'Flask', 'Next.js'],
    },
    {
      id: 'aiml',
      name: 'AI / ML',
      badge: 'Sorcery',
      items: [
        'scikit-learn',
        'OpenCV',
        'CNN/LSTM',
        'YOLOv8',
        'RAG',
        'LLM APIs (Gemini, Groq, OpenRouter)',
      ],
    },
    {
      id: 'data',
      name: 'Data & Analytics',
      badge: 'Alchemy',
      items: ['SQL', 'MongoDB', 'PostgreSQL', 'Power BI', 'Streamlit'],
    },
    {
      id: 'tools',
      name: 'Tools & DevOps',
      badge: 'Artifacts',
      items: ['Git', 'GitHub', 'Postman', 'Antigravity'],
    },
  ],
  medals: [
    { title: 'Sri Eshwar ICPC Finalist', year: '2025' },
    { title: 'Code Red 3.0 Finalist', year: '2025' },
  ],
  certifications: [
    { name: 'SQL Basics/Intermediate', issuer: 'HackerRank', year: '2025' },
    { name: 'Python', issuer: 'SpringBoard', year: '2025' },
    { name: 'C Programming', issuer: 'IIT Bombay', year: '2024' },
    { name: 'Data Structures', issuer: 'Udemy', year: '2025' },
  ],
};

export const journey = [
  {
    id: 'agentverse-2026',
    date: 'Aug 2026',
    title: 'AGENTVERSE Grand Challenge',
    role: 'Hackathon Builder',
    description: 'Built LaunchPad AI (36-hour agentic AI hackathon) with a multi-agent team architecture.',
  },
  {
    id: 'salestorm-2026',
    date: 'Oct 2026',
    title: 'SALESTORM / SYSCRAFTERS 2026',
    role: 'Team Participant',
    description: 'System design hackathon solving large-scale architecture challenges.',
  },
  {
    id: 'aptitude-guru-2025',
    date: '2025',
    title: 'Full-Stack Internship',
    organization: 'Aptitude Guru Pvt Ltd',
    description: 'Built Eluria School of Excellence, a comprehensive school management system with role-based access.',
  },
  {
    id: 'algo-tutor-2025',
    date: 'May-Jun 2025/2026',
    title: 'Agentic AI Internship',
    organization: 'Algo Tutor',
    description: 'Built the AI Study Tool Chrome Extension for multi-modal webpage, video and PDF summarization.',
  },
  {
    id: 'icpc-2025',
    date: '2025',
    title: 'Competitive Programming Finalist',
    description: 'Sri Eshwar ICPC Finalist; Code Red 3.0 Finalist.',
  },
  {
    id: 'college-start-2024',
    date: '2024',
    title: 'B.E. Computer & Communication Engineering',
    organization: 'Sri Eshwar College of Engineering (CCE)',
    description:
      'Began engineering journey. Active member of the department technical team building internal digital tools.',
  },
];

export const contact = {
  github: 'https://github.com/sudhir796',
  linkedin: '', // TODO: add LinkedIn URL
  email: '', // TODO: add Email
  resume: '/SudhirD_Resume_AIML.pdf',
  ctaText: 'Post a Quest',
};

// Rank Colors and Display Mapping
export const RANK_CONFIG = {
  A: {
    color: '#ff4d4f',
    bg: 'rgba(255, 77, 79, 0.18)',
    border: 'rgba(255, 77, 79, 0.65)',
    label: 'Rank A - Legendary Bounty',
    glow: 'rgba(255, 77, 79, 0.4)',
  },
  B: {
    color: '#5ee6ff',
    bg: 'rgba(94, 230, 255, 0.16)',
    border: 'rgba(94, 230, 255, 0.55)',
    label: 'Rank B - Veteran Contract',
    glow: 'rgba(94, 230, 255, 0.35)',
  },
  C: {
    color: '#ffb347',
    bg: 'rgba(255, 179, 71, 0.18)',
    border: 'rgba(255, 179, 71, 0.6)',
    label: 'Rank C - Guild Commission',
    glow: 'rgba(255, 179, 71, 0.35)',
  },
};

