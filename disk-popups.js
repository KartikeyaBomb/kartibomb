import './disk-popups.css';
import { Vector3 } from 'three/webgpu';
import { compactViewport } from './viewport.js';
import { notesLinks, skillGroups, sections, projects, experiences, portraitUrl, currentReadUrl, githubLogoUrl } from './portfolio-content.js';

let active = null;
let projectIndex = 0;
let experienceIndex = 0;
const root = document.createElement('div');
root.className = 'disk-navigation';
root.innerHTML = `
  <nav class="disk-markers is-docked" aria-label="Explore Kartikeya’s portfolio">
    ${sections.map((s, i) => `<button class="disk-marker marker-${i}" data-section="${i}" aria-haspopup="dialog" aria-controls="disk-popup"><span class="marker-symbol" aria-hidden="true">+</span><span class="marker-label">${s.title}</span></button>`).join('')}
  </nav>
  <dialog id="disk-popup" class="disk-popup" aria-labelledby="disk-popup-title">
    <button class="popup-close" aria-label="Close popup">×</button>
    <div class="popup-body">
    <div class="about-sidebar" hidden>
      <img class="about-photo" src="${portraitUrl}" alt="Kartikeya">
    </div>
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
    <div class="experience-list" hidden></div>
    <nav class="experience-pagination" aria-label="Browse experience" hidden>
      <button type="button" class="experience-previous" aria-label="Previous experience">←</button>
      <span class="experience-count" aria-live="polite" aria-atomic="true"></span>
      <button type="button" class="experience-next" aria-label="Next experience">→</button>
    </nav>
    <p class="popup-placeholder">Preview content · Make this space yours</p>
    </div>
    <div class="about-reading" hidden>
      <p class="about-media-label">Current read:</p>
      <img class="about-book" src="${currentReadUrl}" alt="Current read book cover" loading="lazy">
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
    </div>
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
  root.querySelector('.about-sidebar').hidden = index !== 0;
  root.querySelector('.about-reading').hidden = index !== 0;
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
  root.querySelector('.popup-body').scrollTop = 0;
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
  const docked = compactViewport.matches;
  root.querySelector('.disk-markers').classList.toggle('is-docked', docked);
  // On phones, keep every section in a stable, thumb-friendly navigation bar.
  if (docked) {
    lastView = '';
    return;
  }
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
    // Keep navigation reachable even when a disk edge rotates out of view.
    const distance = edge ?? .75;
    const halfWidth = marker.offsetWidth / 2 + 16;
    const halfHeight = marker.offsetHeight / 2 + 16;
    marker.style.left = `${Math.max(halfWidth, Math.min(innerWidth - halfWidth,
      (1 + dx * distance) * innerWidth / 2))}px`;
    marker.style.top = `${Math.max(halfHeight, Math.min(innerHeight - halfHeight,
      (1 + dy * distance) * innerHeight / 2))}px`;
  });
}
