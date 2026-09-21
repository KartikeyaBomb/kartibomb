import './disk-popups.css';
import { Vector3 } from 'three/webgpu';

const sections = [
  { title: 'About', eyebrow: '01 / INTRODUCTION', text: 'A little more about Kartikeya.', detail: 'This space can hold a short introduction, interests, and what you’re exploring right now.' },
  { title: 'Projects', eyebrow: '02 / SELECTED WORK', text: 'Things built. Ideas explored.', detail: 'Feature your projects here with a short description and links to the work.' },
  { title: 'Notes', eyebrow: '03 / FIELD NOTES', text: 'Thoughts from the journey.', detail: 'A place for writing, experiments, and things you’ve learned along the way.' },
  { title: 'Contact', eyebrow: '04 / SAY HELLO', text: 'Start a conversation.', detail: 'Add your preferred email and social links here when you’re ready.' },
];
let active = null;
const root = document.createElement('div');
root.className = 'disk-navigation';
root.innerHTML = `
  <nav class="disk-markers" aria-label="Explore Kartikeya’s portfolio">
    ${sections.map((s, i) => `<button class="disk-marker marker-${i}" data-section="${i}" aria-haspopup="dialog" aria-controls="disk-popup"><span class="marker-symbol" aria-hidden="true">+</span><span class="marker-label">${s.title}</span></button>`).join('')}
  </nav>
  <dialog id="disk-popup" class="disk-popup" aria-labelledby="disk-popup-title">
    <button class="popup-close" aria-label="Close popup">×</button>
    <p class="popup-eyebrow"></p><h2 id="disk-popup-title"></h2>
    <p class="popup-intro"></p><p class="popup-detail"></p>
    <p class="popup-placeholder">Preview content · Make this space yours</p>
  </dialog>
`;
document.body.append(root);
const dialog = root.querySelector('dialog');
const markers = [...root.querySelectorAll('[data-section]')];
markers.forEach((button, index) => button.addEventListener('click', () => {
  active = index;
  const section = sections[index];
  root.querySelector('.popup-eyebrow').textContent = section.eyebrow;
  root.querySelector('h2').textContent = section.title;
  root.querySelector('.popup-intro').textContent = section.text;
  root.querySelector('.popup-detail').textContent = section.detail;
  button.dataset.active = 'true';
  dialog.showModal();
}));
root.querySelector('.popup-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
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
