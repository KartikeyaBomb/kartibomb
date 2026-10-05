import './disk-popups.css';
import { Vector3 } from 'three/webgpu';
import portraitUrl from './assets/photo.png';
import droneVideoUrl from './assets/rhodesdrone.mp4?url';
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

const notesLinks = [
  { label: 'LinkedIn', logo: linkedinLogoUrl, href: 'https://www.linkedin.com/in/karti-bomb-b13ab72ba' },
  { label: 'Download resume', logo: resumeLogoUrl, href: `${import.meta.env.BASE_URL}kartikeya-bomb-resume.pdf`, download: true },
  { label: 'GitHub', logo: githubLogoUrl, href: 'https://github.com/KartikeyaBomb' },
];

const skillGroups = [
  { title: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'SQL'] },
  { title: 'AI engineering', skills: ['PyTorch', 'OpenAI API', 'Hugging Face', 'LangGraph', 'OpenCV', 'ONNX', 'LangSmith'] },
  { title: 'Frameworks', skills: ['React', 'Next.js', 'Spring Boot', 'FastAPI', 'Flask'] },
  { title: 'Data & infrastructure', skills: ['PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Spark'] },
];

const sections = [
  { title: 'About Me', eyebrow: '', text: "Hi, I'm Kartikeya Bomb, a computer science, math, and economics major at Rhodes College passionate about intersecting healthcare with technology. If I'm not thinking about an interesting problem, you will find me watching the night sky, flying my drone or reading a science fiction book.", detail: '' },
  { title: 'Projects', eyebrow: '02 / SELECTED WORK', text: 'Things built. Ideas explored.', detail: 'Feature your projects here with a short description and links to the work.' },
  { title: 'Notes', eyebrow: '', text: '', detail: '' },
  { title: 'Experience', eyebrow: '', text: '', detail: '' },
];
let active = null;
const projects = [
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
const experiences = [
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
let projectIndex = 0;
let experienceIndex = 0;
const root = document.createElement('div');
root.className = 'disk-navigation';
root.innerHTML = `
  <nav class="disk-markers" aria-label="Explore Kartikeya’s portfolio">
    ${sections.map((s, i) => `<button class="disk-marker marker-${i}" data-section="${i}" hidden aria-haspopup="dialog" aria-controls="disk-popup"><span class="marker-symbol" aria-hidden="true">+</span><span class="marker-label">${s.title}</span></button>`).join('')}
  </nav>
  <dialog id="disk-popup" class="disk-popup" aria-labelledby="disk-popup-title">
    <button class="popup-close" aria-label="Close popup">×</button>
    <img class="about-photo" src="${portraitUrl}" alt="Kartikeya" hidden>
    <div class="popup-copy">
    <p class="popup-eyebrow"></p><h2 id="disk-popup-title"></h2>
    <p class="popup-intro"></p><p class="popup-detail"></p>
    <nav class="notes-links" aria-label="Find me online" hidden>
      ${notesLinks.map(link => link.href
        ? `<a class="notes-link" href="${link.href}" ${link.download ? 'download' : 'target="_blank" rel="noopener noreferrer"'} aria-label="${link.label}"><img src="${link.logo}" alt=""><span>${link.label}</span></a>`
        : `<button class="notes-link" type="button" disabled aria-label="${link.label} (coming soon)"><img src="${link.logo}" alt=""><span>${link.label}</span></button>`).join('')}
    </nav>
    <section class="notes-skills" aria-labelledby="notes-skills-title" hidden>
      <h3 id="notes-skills-title">Skills</h3>
      <div class="notes-skills-grid">
        ${skillGroups.map(group => `<section class="notes-skill-group"><h4>${group.title}</h4><ul>${group.skills.map(skill => `<li>${skill}</li>`).join('')}</ul></section>`).join('')}
      </div>
    </section>
    <div class="about-media" hidden>
      <div class="about-campus">
        <p class="about-media-label">Rhodes college campus</p>
    <video class="about-video" controls playsinline preload="metadata" aria-label="Drone footage of Rhodes College" hidden>
      <source src="${droneVideoUrl}" type="video/mp4">
      Your browser does not support embedded video. <a href="${droneVideoUrl}">Watch the drone video</a>.
    </video>
      </div>
      <div class="about-reading">
        <p class="about-media-label">Current read:</p>
        <img class="about-book" src="${currentReadUrl}" alt="Current read book cover" loading="lazy">
      </div>
    </div>
    <div class="experience-list" hidden></div>
    <nav class="experience-pagination" aria-label="Browse experience" hidden>
      <button type="button" class="experience-previous" aria-label="Previous experience">←</button>
      <span class="experience-count" aria-live="polite" aria-atomic="true"></span>
      <button type="button" class="experience-next" aria-label="Next experience">→</button>
    </nav>
    <p class="popup-placeholder">Preview content · Make this space yours</p>
    </div>
    <section class="project-view" hidden aria-label="Project slideshow">
      <h2 id="projects-heading">Projects</h2>
      <div class="project-content">
        <h3 class="project-heading"><span id="project-title"></span><a class="project-github" target="_blank" rel="noopener noreferrer"><img src="${githubLogoUrl}" alt="" width="32" height="32"></a><a class="project-website" target="_blank" rel="noopener noreferrer" hidden></a></h3>
        <p class="project-description"></p>
        <div class="project-media"></div>
      </div>
      <nav class="project-pagination" aria-label="Browse projects">
        <button type="button" class="project-previous" aria-label="Previous project">←</button>
        <span class="project-count" aria-live="polite" aria-atomic="true"></span>
        <button type="button" class="project-next" aria-label="Next project">→</button>
      </nav>
    </section>
  </dialog>
`;
document.body.append(root);
const dialog = root.querySelector('dialog');
const markers = [...root.querySelectorAll('[data-section]')];
const experienceList = root.querySelector('.experience-list');
experiences.forEach(experience => {
  const card = document.createElement('article');
  card.className = 'experience-card';
  const header = document.createElement('header');
  header.className = 'experience-company';
  const logo = document.createElement(experience.logo ? 'img' : 'span');
  logo.className = 'experience-logo';
  if (experience.logo) {
    logo.src = experience.logo;
    logo.alt = `${experience.company} logo`;
  } else {
    logo.textContent = experience.initials || experience.company.charAt(0);
    logo.setAttribute('aria-hidden', 'true');
  }
  const company = document.createElement('h3');
  company.textContent = experience.company;
  header.append(logo, company);
  const dates = document.createElement('p');
  dates.className = 'experience-dates';
  dates.textContent = `${experience.dates} · ${experience.location}`;
  const role = document.createElement('p');
  role.className = 'experience-role';
  role.textContent = experience.role;
  const accomplishments = document.createElement('ul');
  accomplishments.className = 'experience-accomplishments';
  experience.accomplishments.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    accomplishments.append(item);
  });
  card.append(header, dates, role, accomplishments);
  experienceList.append(card);
});
function renderExperience() {
  [...experienceList.children].forEach((card, index) => {
    card.hidden = index !== experienceIndex;
  });
  root.querySelector('.experience-count').textContent = `${experienceIndex + 1} / ${experiences.length}`;
  experienceList.scrollTop = 0;
}
root.querySelector('.experience-previous').addEventListener('click', () => {
  experienceIndex = (experienceIndex + experiences.length - 1) % experiences.length;
  renderExperience();
});
root.querySelector('.experience-next').addEventListener('click', () => {
  experienceIndex = (experienceIndex + 1) % experiences.length;
  renderExperience();
});
renderExperience();
function renderProject() {
  const project = projects[projectIndex];
  root.querySelector('#project-title').textContent = project.title;
  const website = root.querySelector('.project-website');
  website.hidden = !project.website;
  if (project.website) {
    website.href = project.website;
    website.textContent = project.website;
    website.setAttribute('aria-label', `Visit ${project.title}: ${project.website}`);
  } else {
    website.removeAttribute('href');
    website.textContent = '';
  }
  const link = root.querySelector('.project-github');
  link.hidden = !project.github;
  if (project.github) {
    link.href = project.github;
    link.setAttribute('aria-label', `View ${project.title} on GitHub`);
    link.title = `View ${project.title} on GitHub`;
    link.removeAttribute('aria-disabled');
  } else {
    link.removeAttribute('href');
    link.setAttribute('aria-disabled', 'true');
  }
  const description = root.querySelector('.project-description');
  description.textContent = project.description;
  description.hidden = !project.description;
  const media = root.querySelector('.project-media');
  media.querySelectorAll('video').forEach(video => video.pause());
  media.replaceChildren();
  Array.from({ length: 2 }, (_, index) => project.media[index]).forEach((item, index) => {
    const slot = document.createElement('div');
    slot.className = 'project-media-slot';
    media.append(slot);
    if (!item) {
      const placeholder = document.createElement('span');
      placeholder.textContent = `Image / video ${index + 1}`;
      slot.append(placeholder);
      return;
    }
    const element = document.createElement(item.type === 'video' ? 'video' : 'img');
    element.src = item.src;
    if (item.type === 'video') {
      element.controls = true;
      element.playsInline = true;
      element.preload = 'metadata';
      element.setAttribute('aria-label', item.alt || project.title);
    } else {
      element.alt = item.alt || project.title;
    }
    slot.append(element);
  });
  root.querySelector('.project-count').textContent = `${projectIndex + 1} / ${projects.length}`;
  root.querySelector('.project-content').scrollTop = 0;
}
root.querySelector('.project-previous').addEventListener('click', () => {
  projectIndex = (projectIndex + projects.length - 1) % projects.length;
  renderProject();
});
root.querySelector('.project-next').addEventListener('click', () => {
  projectIndex = (projectIndex + 1) % projects.length;
  renderProject();
});
markers.forEach((button, index) => button.addEventListener('click', () => {
  active = index;
  const section = sections[index];
  dialog.classList.toggle('is-about', index === 0);
  dialog.classList.toggle('is-projects', index === 1);
  dialog.classList.toggle('is-experience', index === 3);
  dialog.classList.toggle('is-notes', index === 2);
  root.querySelector('.notes-links').hidden = index !== 2;
  root.querySelector('.notes-skills').hidden = index !== 2;
  experienceList.hidden = index !== 3;
  root.querySelector('.experience-pagination').hidden = index !== 3;
  if (index === 3) {
    experienceIndex = 0;
    renderExperience();
  }
  root.querySelector('.popup-copy').hidden = index === 1;
  root.querySelector('.project-view').hidden = index !== 1;
  dialog.setAttribute('aria-labelledby', index === 1 ? 'projects-heading' : 'disk-popup-title');
  if (index === 1) {
    projectIndex = 0;
    renderProject();
  }
  root.querySelector('.about-photo').hidden = index !== 0;
  root.querySelector('.about-media').hidden = index !== 0;
  root.querySelector('.about-video').hidden = index !== 0;
  if (index !== 0) root.querySelector('.about-video').pause();
  root.querySelector('.popup-eyebrow').textContent = section.eyebrow;
  root.querySelector('.popup-eyebrow').hidden = !section.eyebrow;
  root.querySelector('h2').textContent = section.title;
  root.querySelector('.popup-intro').textContent = section.text;
  root.querySelector('.popup-intro').hidden = !section.text;
  root.querySelector('.popup-detail').textContent = section.detail;
  root.querySelector('.popup-detail').hidden = !section.detail;
  root.querySelector('.popup-placeholder').hidden = index === 0 || index === 2 || index === 3;
  button.dataset.active = 'true';
  dialog.showModal();
}));
root.querySelector('.popup-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  root.querySelectorAll('video').forEach(video => video.pause());
  markers.forEach(button => delete button.dataset.active);
  if (active !== null) markers[active].focus();
  active = null;
});
// Match the shader's camera basis, FOV, and bent-ray disk intersections.
const forward = new Vector3(), right = new Vector3(), up = new Vector3();
const ray = new Vector3(), position = new Vector3();
let lastView = '';
export function updateDiskMarkers(camera, config) {
  const view = [...camera.position, ...camera.quaternion, innerWidth, innerHeight,
    config.diskOuterRadius, config.diskInnerRadius, config.blackHoleMass,
    config.stepSize, config.gravitationalLensing].join(',');
  if (view === lastView) return;
  lastView = view;
  camera.getWorldDirection(forward);
  right.crossVectors(new Vector3(0, 1, 0), forward).normalize();
  up.crossVectors(forward, right);
  const aspect = innerWidth / innerHeight;
  const rs = config.blackHoleMass * 2;
  function hitsDisk(x, y) {
    position.copy(camera.position);
    ray.copy(forward).addScaledVector(right, x * aspect).addScaledVector(up, y).normalize();
    for (let step = 0; step < 64; step++) {
      const radius = position.length();
      if (radius < rs * 1.01 || radius > 100) return false;
      ray.addScaledVector(position, -rs * config.stepSize * config.gravitationalLensing / (radius ** 3)).normalize();
      const previousY = position.y;
      const previousX = position.x, previousZ = position.z;
      position.addScaledVector(ray, config.stepSize);
      if (previousY * position.y < 0) {
        const t = -previousY / (position.y - previousY);
        const hitRadius = Math.hypot(previousX + (position.x - previousX) * t,
          previousZ + (position.z - previousZ) * t);
        if (hitRadius > config.diskInnerRadius && hitRadius < config.diskOuterRadius) return true;
      }
    }
    return false;
  }
  // N, E, S, W in screen space, including the gravitationally lensed outline.
  [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], index) => {
    let edge = null;
    for (let sample = 200; sample >= 0; sample--) {
      const distance = sample / 200;
      if (hitsDisk(dx * distance, dy * distance)) {
        let inside = distance, outside = distance + .005;
        for (let iteration = 0; iteration < 10; iteration++) {
          const middle = (inside + outside) / 2;
          if (hitsDisk(dx * middle, dy * middle)) inside = middle;
          else outside = middle;
        }
        edge = inside;
        break;
      }
    }
    const marker = markers[index];
    marker.hidden = edge === null;
    if (edge !== null) {
      marker.style.left = `${(1 + dx * edge) * innerWidth / 2}px`;
      marker.style.top = `${(1 + dy * edge) * innerHeight / 2}px`;
    }
  });
}
