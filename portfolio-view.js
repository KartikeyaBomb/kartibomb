import './portfolio-view.css';
import { notesLinks, skillGroups, sections, projects, experiences, portraitUrl, currentReadUrl } from './portfolio-content.js';

const storageKey = 'portfolio-view';
let currentView = 'immersive';
try {
  if (localStorage.getItem(storageKey) === 'simple') currentView = 'simple';
} catch { /* The view toggle also works when browser storage is unavailable. */ }
if (location.hash.startsWith('#portfolio-')) currentView = 'simple';

function isSimpleView() {
  return currentView === 'simple';
}

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

function externalLink(url, label) {
  return `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}<span aria-hidden="true"> ↗</span></a>`;
}

const switcher = document.createElement('div');
switcher.className = 'view-switcher';
switcher.setAttribute('role', 'group');
switcher.setAttribute('aria-label', 'Portfolio view');
switcher.innerHTML = `
  <button type="button" data-view="immersive" aria-pressed="false">Black hole</button>
  <button type="button" data-view="simple" aria-pressed="false">Simple view</button>
`;

const portfolio = document.createElement('main');
portfolio.className = 'simple-portfolio';
portfolio.id = 'simple-portfolio';
portfolio.hidden = true;
portfolio.innerHTML = `
  <header class="simple-header">
    <p class="simple-kicker">Portfolio</p>
    <h1>Kartikeya Bomb</h1>
    <nav class="simple-nav" aria-label="Portfolio sections">
      <a href="#portfolio-about">About Me</a>
      <a href="#portfolio-experience">Experience</a>
      <a href="#portfolio-projects">Projects</a>
      <a href="#portfolio-notes">Notes</a>
    </nav>
  </header>
  <section class="simple-section" id="portfolio-about" aria-labelledby="simple-about-title">
    <h2 id="simple-about-title">About Me</h2>
    <div class="simple-about">
      <p>${escape(sections[0].text)}</p>
      <div class="simple-about-images">
        <img class="simple-portrait" src="${portraitUrl}" alt="Kartikeya" loading="lazy">
        <figure>
          <figcaption>Current read</figcaption>
          <img src="${currentReadUrl}" alt="Stories of Your Life and Others by Ted Chiang" loading="lazy">
        </figure>
      </div>
    </div>
  </section>
  <section class="simple-section" id="portfolio-experience" aria-labelledby="simple-experience-title">
    <h2 id="simple-experience-title">Experience</h2>
    ${experiences.map(experience => `
      <article class="simple-entry">
        <header class="simple-company">
          ${experience.logo ? `<img src="${experience.logo}" alt="" loading="lazy">` : `<span class="simple-initials" aria-hidden="true">${escape(experience.initials)}</span>`}
          <div><h3>${escape(experience.company)}</h3><p class="simple-meta">${escape(experience.dates)} · ${escape(experience.location)}</p></div>
        </header>
        <p class="simple-role">${escape(experience.role)}</p>
        <ul>${experience.accomplishments.map(text => `<li>${escape(text)}</li>`).join('')}</ul>
      </article>
    `).join('')}
  </section>
  <section class="simple-section" id="portfolio-projects" aria-labelledby="simple-projects-title">
    <h2 id="simple-projects-title">Projects</h2>
    ${projects.map(project => `
      <article class="simple-entry">
        <h3>${escape(project.title)}</h3>
        <p>${escape(project.description)}</p>
        <div class="simple-links">
          ${project.website ? externalLink(project.website, 'Visit website') : ''}
          ${project.github ? externalLink(project.github, 'View on GitHub') : ''}
        </div>
        <div class="simple-media">
          ${project.media.map(item => item.type === 'video'
            ? `<video src="${item.src}" controls playsinline preload="none" aria-label="${escape(item.alt || project.title)}"></video>`
            : `<img src="${item.src}" alt="${escape(item.alt || project.title)}" loading="lazy" decoding="async">`).join('')}
        </div>
      </article>
    `).join('')}
  </section>
  <section class="simple-section" id="portfolio-notes" aria-labelledby="simple-notes-title">
    <h2 id="simple-notes-title">Notes</h2>
    <nav class="simple-links simple-contact" aria-label="Find me online">
      ${notesLinks.map(link => link.download
        ? `<a href="${escape(link.href)}" download>${escape(link.label)}<span aria-hidden="true"> ↓</span></a>`
        : externalLink(link.href, link.label)).join('')}
    </nav>
    <h3>Skills</h3>
    <div class="simple-skills">
      ${skillGroups.map(group => `<section><h4>${escape(group.title)}</h4><ul>${group.skills.map(skill => `<li>${escape(skill)}</li>`).join('')}</ul></section>`).join('')}
    </div>
  </section>
`;
document.body.append(switcher, portfolio);

let immersiveModule;
let simpleScrollPosition = 0;
function setView(view) {
  if (isSimpleView()) simpleScrollPosition = window.scrollY;
  currentView = view;
  const simple = isSimpleView();
  if (!simple && location.hash.startsWith('#portfolio-')) {
    history.replaceState(history.state, '', location.pathname + location.search);
  }
  const dialog = document.querySelector('#disk-popup');
  if (dialog?.open) dialog.close();
  document.querySelectorAll('video').forEach(video => video.pause());
  document.documentElement.dataset.portfolioView = view;
  portfolio.hidden = !simple;
  switcher.querySelectorAll('button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
  window.scrollTo(0, simple ? simpleScrollPosition : 0);
  try { localStorage.setItem(storageKey, view); } catch { /* Optional preference. */ }
  window.dispatchEvent(new CustomEvent('portfolio:viewchange', { detail: view }));
  // A saved simple view never starts the graphics renderer or loads Three.js.
  if (!simple && !immersiveModule) {
    immersiveModule = import('./main.js').catch(error => {
      immersiveModule = null;
      console.error('Could not load the black hole view:', error);
      setView('simple');
    });
  }
}
switcher.addEventListener('click', event => {
  const button = event.target.closest('button[data-view]');
  if (button && button.dataset.view !== currentView) setView(button.dataset.view);
});
setView(currentView);

if (isSimpleView() && location.hash.startsWith('#portfolio-')) {
  document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
