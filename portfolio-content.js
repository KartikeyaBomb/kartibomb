import portraitUrl from './assets/photo.png';
import currentReadUrl from './assets/chiangstories.jpg';
import autozoneLogoUrl from './assets/autozonelogo.png';
import blightImageUrl from './assets/blightpredictor1.png';
import blightVideoUrl from './assets/blightpredictor2.mp4?url';
import memphisImageUrl from './assets/MemphisInMotion1.png';
import memphisVideoUrl from './assets/MIM2.mp4?url';
import linkedinLogoUrl from './assets/linkedin.jpg';
import resumeLogoUrl from './assets/resumelogo.jpg';
import githubLogoUrl from './assets/githublogo.png';
import innerJFirstVideoUrl from './assets/innerJ1.mov?url';
import innerJSecondVideoUrl from './assets/innerJ2.mov?url';

export const notesLinks = [
  { label: 'LinkedIn', logo: linkedinLogoUrl, href: 'https://www.linkedin.com/in/karti-bomb-b13ab72ba' },
  { label: 'Download resume', logo: resumeLogoUrl, href: `${import.meta.env.BASE_URL}kartikeya-bomb-resume.pdf`, download: true },
  { label: 'GitHub', logo: githubLogoUrl, href: 'https://github.com/KartikeyaBomb' },
];

export const skillGroups = [
  { title: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'SQL'] },
  { title: 'AI engineering', skills: ['PyTorch', 'OpenAI API', 'Hugging Face', 'LangGraph', 'OpenCV', 'ONNX', 'LangSmith'] },
  { title: 'Frameworks', skills: ['React', 'Next.js', 'Spring Boot', 'FastAPI', 'Flask'] },
  { title: 'Data & infrastructure', skills: ['PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Spark'] },
];

export const sections = [
  { title: 'About Me', eyebrow: '', text: "Hi 👋🏽, I'm Kartikeya Bomb, a senior at Rhodes College majoring in computer science, math, and economics curious about autonomous technology and intersecting healthcare with AI. If I'm not thinking about an interesting problem, you will find me watching the night sky, flying my drone or reading a science fiction book.", detail: '' },
  { title: 'Projects', eyebrow: '02 / SELECTED WORK', text: 'Things built. Ideas explored.', detail: 'Feature your projects here with a short description and links to the work.' },
  { title: 'Notes', eyebrow: '', text: '', detail: '' },
  { title: 'Experience', eyebrow: '', text: '', detail: '' },
];
export const projects = [
  {
    title: 'Blight Predictor', website: 'https://blight-predictor.vercel.app/', github: 'https://github.com/KartikeyaBomb/BlightPredictor', description: 'Blight Predictor is a Memphis blight-analysis platform powered by React, Mapbox GL JS, and Python with NumPy and Matplotlib. It brings together eviction filings, police incidents, and service requests to reveal monthly trends and correlations across four neighborhoods. An interactive ZIP-code heatmap and neighborhood-level breakdowns highlight areas for proactive blight mitigation.',
    media: [
      { type: 'image', src: blightImageUrl, alt: 'Blight Predictor screenshot' },
      { type: 'video', src: blightVideoUrl, alt: 'Blight Predictor demo' },
    ],
  },
  {
    title: 'Memphis in Motion', github: 'https://github.com/KartikeyaBomb/fronthacks', description: 'Memphis in Motion is a transit-planning platform for Memphis, powered by React, TypeScript, Python/Flask, and PostgreSQL/PostGIS. LangGraph agents validate requests, XGBoost forecasts ridership, and Google OR-Tools optimizes proposed routes. Its analysis of 10,000 simulated trip requests identifies five priority routes and projects 20% shorter commute times compared with existing service.',
    media: [
      { type: 'image', src: memphisImageUrl, alt: 'Memphis in Motion screenshot' },
      { type: 'video', src: memphisVideoUrl, alt: 'Memphis in Motion demo' },
    ],
  },

  {
    title: 'innerJ', website: 'https://inner-j.vercel.app/', github: 'https://github.com/KartikeyaBomb/innerJ', description: 'innerJ is a full-stack platform where 100+ users discover, test, and share reusable AI prompts. Optimized PostgreSQL retrieval and Redis caching reduce feed response time by 58%. OpenAI automatically organizes 1,000+ prompts, helping users find relevant content and explore new ways to work with AI.',
    media: [
      { type: 'video', src: innerJFirstVideoUrl, alt: 'innerJ demo 1' },
      { type: 'video', src: innerJSecondVideoUrl, alt: 'innerJ demo 2' },
    ],
  },
];
// Logo accepts an imported image URL; initials are shown when no logo is supplied.
export const experiences = [
  {
    company: 'AutoZone', logo: autozoneLogoUrl, initials: 'AZ',
    dates: 'May 2025 - Aug. 2026', location: 'Memphis, TN',
    role: 'Software Engineering Intern',
    accomplishments: [
      'Built an internal React platform for AI-driven store onboarding, using Spring Boot APIs to validate bulk imports and review proposed operational changes.',
      'Engineered a Python AI agent that reconciled HR, store, and Bringg data, diagnosed inconsistencies, and executed remediation workflows through structured tool calls.',
      'Built agent state and recovery logic so AI workflows could verify completed actions, retry failed steps, and avoid repeating successful operations.',
      'Built a distributed pin-pad management system across 7,000+ stores using C/C++ for device communication, IP-based discovery, WebSockets, and React, saving 840 hours and $133K.',
    ],
  },
  {
    company: 'RK Heart and Vascular Care', logo: '', initials: 'RK',
    dates: 'Aug. 2024 - Present', location: 'Memphis, TN',
    role: 'Software Engineering Intern',
    accomplishments: [
      'Integrated PracticeSuite with a custom AI revenue-cycle platform to automate coding, claim submission, denial management, and payment posting across 300+ monthly claims.',
      'Built REST/FHIR workflows with claim-state orchestration and audit logging, reducing manual billing work by 100%.',
      'Integrated a rideshare system with Python/Flask and Baptist Hospital APIs, automating 250+ monthly ride requests and cutting patient no-shows by 40%.',
    ],
  },
];

export { portraitUrl, currentReadUrl, githubLogoUrl };
