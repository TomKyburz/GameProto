import * as THREE from 'three';

export const loader = new THREE.TextureLoader();

// ─── Texture paths ────────────────────────────────────────────────────────────
const ASSETS = {
  ceiling:  'assets/ceiling.png',
  wall:     'assets/wall.png',
  floor:    'assets/floor.png'
};

const _cache = new Map();
function loadOnce(url, pixelated = true) {
  if (_cache.has(url)) return _cache.get(url);
  const tex = loader.load(url);
  if (pixelated) {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter  = THREE.NearestFilter;
  }
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  _cache.set(url, tex);
  return tex;
}

export const adam         = ASSETS.adam;
export const floorTexture = loadOnce(ASSETS.floor);
export const waterTexture = loadOnce(ASSETS.water);
export const void1Texture = loadOnce(ASSETS.void1);
export const roofTexture  = loadOnce(ASSETS.roof);
export const faceTex      = loadOnce(ASSETS.face);
export const sideTex      = loadOnce(ASSETS.side);
export const skyTexture   = loadOnce(ASSETS.sky);
export const floor        = loadOnce(ASSETS.floor);
export const wall         = loadOnce(ASSETS.wall);
export const ceiling      = loadOnce(ASSETS.ceiling);
