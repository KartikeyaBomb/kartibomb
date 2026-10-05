import './music-player.css';
import { Vector3 } from 'three/webgpu';

const spotifyTracks = [
  '7JM1c8Vn3tl00JPYLcHWN1',
  '5XOiz1w16gsPdMLxoTs80Y', // Omar Gatlato — Ahmed Malek
  '6Yt2xnJZ7w5k7uZpnK5czh', // O Telefone Tocou Novamente — Jorge Ben Jor
  '3HftcG4G08CHk1KU8q09SW', // de babado
  '3JvrhDOgAt6p7K8mDyZwRd', // riptide, vance joy
  '03UrZgTINDqvnUMbbIMhql', // gangnam style
  '5aJOyuvqhcCRpaUCubwXk9', //ballad of eddie jabuley
];

// Shuffle once per page load; navigation keeps this order for the session.
for (let index = spotifyTracks.length - 1; index > 0; index--) {
  const swapIndex = Math.floor(Math.random() * (index + 1));
  [spotifyTracks[index], spotifyTracks[swapIndex]] = [spotifyTracks[swapIndex], spotifyTracks[index]];
}

let trackIndex = 0;
const root = document.createElement('div');
root.innerHTML = `
  <button class="singularity-music" type="button" aria-label="Open Spotify player" aria-controls="music-player" aria-expanded="false" title="Click to open music" hidden>
    <svg class="singularity-music-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="12" width="4" height="8" rx="2" />
      <rect x="17" y="12" width="4" height="8" rx="2" />
    </svg>
  </button>
  <section id="music-player" class="music-player" aria-label="Spotify music player" hidden>
    <button class="music-previous" type="button" aria-label="Previous song" title="Previous song">⏮</button>
    <div class="music-embed"><div class="music-embed-mount"></div></div>
    <button class="music-next" type="button" aria-label="Next song" title="Next song">⏭</button>
  </section>
`;
document.body.append(root);
const trigger = root.querySelector('.singularity-music');
const player = root.querySelector('.music-player');
const mount = root.querySelector('.music-embed-mount');
const previous = root.querySelector('.music-previous');
const next = root.querySelector('.music-next');
let controller = null;
let ready = false;
let playWhenReady = false;
function setReady(value) {
  ready = value;
  previous.disabled = next.disabled = !value || spotifyTracks.length < 2;
}
function trackUrl() {
  return `https://open.spotify.com/track/${spotifyTracks[trackIndex]}?theme=0`;
}
setReady(false);
function changeTrack(direction) {
  if (!controller || !ready) return;
  trackIndex = (trackIndex + direction + spotifyTracks.length) % spotifyTracks.length;
  setReady(false);
  controller.loadEntity(trackUrl());
  // The API queues playback until the newly loaded track is ready.
  controller.play();
}
previous.addEventListener('click', () => changeTrack(-1));
next.addEventListener('click', () => changeTrack(1));
trigger.addEventListener('click', () => {
  player.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  if (controller) controller.play();
  else playWhenReady = true;
});

// Prepare Spotify ahead of the click so playback can use the user's gesture.
window.onSpotifyIframeApiReady = api => {
  api.createController(mount, { url: trackUrl(), width: '100%', height: 80 }, embedController => {
    controller = embedController;
    const iframe = root.querySelector('.music-embed iframe');
    if (iframe) iframe.title = 'Spotify song player';
    controller.addListener('ready', () => setReady(true));
    controller.addListener('error', () => setReady(true));
    if (playWhenReady) {
      playWhenReady = false;
      controller.play();
    }
  });
};
const script = document.createElement('script');
script.src = 'https://open.spotify.com/embed/iframe-api/v1';
script.async = true;
script.onerror = () => {
  const link = document.createElement('a');
  link.href = trackUrl();
  link.textContent = 'Open song in Spotify';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  mount.replaceChildren(link);
};
document.body.append(script);

const center = new Vector3();
export function updateMusicTrigger(camera, config) {
  center.set(0, 0, 0).project(camera);
  trigger.hidden = center.z < -1 || center.z > 1;
  trigger.style.left = `${(center.x + 1) * innerWidth / 2}px`;
  trigger.style.top = `${(1 - center.y) * innerHeight / 2}px`;
  const diameter = (config.blackHoleMass * 2 * 2.6 / camera.position.length())
    * innerHeight / Math.tan(camera.fov * Math.PI / 360);
  const size = Math.max(44, diameter);
  trigger.style.width = trigger.style.height = `${size}px`;
}
