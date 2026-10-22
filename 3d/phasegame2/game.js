import * as THREE from 'three';
import * as CANNON from 'cannon';

import { World2 } from './js/world2.js';
import { World } from './js/world.js';
import { loader, adam, floorTexture, waterTexture, void1Texture, roofTexture, faceTex, sideTex, skyTexture } from './js/assetloader.js';
import { jumpVelocity, maxSpeed, acceleration } from './js/variables.js';
import { Player } from './js/player.js';
import { Vehicle } from './js/car.js';

const clock = new THREE.Clock();

const screen = document.getElementById("game-container");
const full = document.getElementById("lines");
const grid = document.getElementById("grid");
const menu = document.getElementById("pmenu");
const resume = document.getElementById("resume");
const swap = document.getElementById("swap");
const fscreen = document.getElementById("options");
const characteroptions = document.getElementById("character");
menu.addEventListener('click', e => e.stopPropagation());

let screenW = screen.clientWidth;
let screenH = screen.clientHeight;

// --- CREATE WORLD ---
let myWorld = new World();
let usingWorld2 = false;

// --- PLAYER & VEHICLE ---
let player = new Player(myWorld.world, myWorld.scene);
let car = new Vehicle(myWorld.world, myWorld.scene);

// --- WORLD SWAP ---
swap.addEventListener('click', () => {
  const oldScene = myWorld.scene;

  usingWorld2 = !usingWorld2;
  myWorld = usingWorld2 ? new World2() : new World();

  player = new Player(myWorld.world, myWorld.scene);
  car = new Vehicle(myWorld.world, myWorld.scene);

  oldScene.remove(camera);
  myWorld.scene.add(camera);

  yaw = -Math.PI / 2;
  pitch = 0;
  cameraMode = "first";
  player.mesh.visible = false;

  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  camera.rotation.z = 0;

  camera.position.set(
    player.position.x,
    player.position.y + player.eyeHeight,
    player.position.z
  );

  if (!isMobile()) {
    screen.requestPointerLock();
  }
});




// --- CAMERA & RENDERER ---
const camera = new THREE.PerspectiveCamera(70, screenW / screenH, 0.1, 1000);
myWorld.scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(screenW, screenH, false);
renderer.autoClear = false;
screen.appendChild(renderer.domElement);

// --- HUD SCENE ---
const hudScene = new THREE.Scene();
const hudCamera = new THREE.OrthographicCamera(
  -screenW / 2, screenW / 2,
   screenH / 2, -screenH / 2,
  0, 10
);

// --- HOTBAR ---
const SLOT_SIZE = 50;
const SLOT_GAP = 4;
const SLOT_COUNT = 9;
let selectedSlot = 0;
const slotMeshes = [];
const totalWidth = SLOT_COUNT * SLOT_SIZE + (SLOT_COUNT - 1) * SLOT_GAP;

for (let i = 0; i < SLOT_COUNT; i++) {
  const x = -totalWidth / 2 + i * (SLOT_SIZE + SLOT_GAP) + SLOT_SIZE / 2;
  const y = -screenH / 2 + SLOT_SIZE / 2 + 20;

  const slot = new THREE.Mesh(
    new THREE.PlaneGeometry(SLOT_SIZE, SLOT_SIZE),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 })
  );
  slot.position.set(x, y, 0);
  hudScene.add(slot);

  const border = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-SLOT_SIZE / 2, -SLOT_SIZE / 2, 0.1),
      new THREE.Vector3( SLOT_SIZE / 2, -SLOT_SIZE / 2, 0.1),
      new THREE.Vector3( SLOT_SIZE / 2,  SLOT_SIZE / 2, 0.1),
      new THREE.Vector3(-SLOT_SIZE / 2,  SLOT_SIZE / 2, 0.1),
    ]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
  );
  slot.add(border);
  slotMeshes.push({ slot, border });
}

function setSelectedSlot(index) {
  selectedSlot = index;
  slotMeshes.forEach(({ slot, border }, i) => {
    slot.material.opacity = i === index ? 0.7 : 0.4;
    border.material.opacity = i === index ? 1.0 : 0.3;
    border.material.color.set(i === index ? 0xffff00 : 0xffffff);
  });
}
setSelectedSlot(0);

// --- POINTER LOCK ---
let isLocked = false;
const isMobile = () => 'ontouchstart' in window;

function showPauseMenu() {
  menu.style.display = 'flex';
  document.exitPointerLock();
}

function hidePauseMenu() {
  screen.requestPointerLock();
  menu.style.display = 'none';
}

screen.addEventListener('click', () => {
  if (!isMobile() && !isLocked) screen.requestPointerLock();
});

resume.addEventListener('click', () => {
  screen.requestPointerLock();
  hidePauseMenu();
});

fscreen.addEventListener('click', () => {
  screen.requestPointerLock();
  screen.requestFullscreen();
});

full.addEventListener('click', () => {
  document.exitPointerLock();
  showPauseMenu();
});

grid.addEventListener('click', () => {
  cameraMode = cameraMode === "first" ? "third" : "first";
});

document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === screen;
});

document.addEventListener('keydown', e => {
  if (e.code === 'Escape') document.exitPointerLock();
});

// --- YAW / PITCH ---
let yaw   = -Math.PI / 2;
let pitch = 0;

document.addEventListener('mousemove', e => {
  if (!isLocked) return;
  yaw   -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch  = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));
});

// --- KEYBOARD ---
const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  const num = parseInt(e.key);
  if (num >= 1 && num <= 9) setSelectedSlot(num - 1);
});
document.addEventListener('keyup', e => keys[e.code] = false);

// --- SCROLL HOTBAR ---
screen.addEventListener('wheel', e => {
  const next = (selectedSlot + (e.deltaY > 0 ? 1 : -1) + SLOT_COUNT) % SLOT_COUNT;
  setSelectedSlot(next);
});

// --- STATE ---
let cameraMode = "first";
const lastKeys = {};
const thirdPersonRay = new THREE.Raycaster();


// ─── MOBILE CONTROLS ──────────────────────────────────────────────────────────
const mobileInput = { x: 0, z: 0 };
let mobileJump = false;


let joyTouchId = null;
let joyOrigin  = { x: 0, y: 0 };
const JOY_RADIUS = 55;


// --- HUD POS ---
const hudPos = document.getElementById("pos");

// --- ANIMATION LOOP ---
let lastPos = { x: 0, z: 0 };
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  myWorld.world.step(1 / 60, delta);

  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));

  const input = new THREE.Vector3();
  if (isLocked) {
    if (keys['KeyW']) input.add(forward);
    if (keys['KeyS']) input.sub(forward);
    if (keys['KeyA']) input.sub(right);
    if (keys['KeyD']) input.add(right);
    if (keys['KeyF']) screen.requestFullscreen();
    if (keys['KeyR'] && !lastKeys['KeyR']) cameraMode = cameraMode === "first" ? "third" : "first";
    if (keys['ShiftLeft']) player.crouch();
    else player.uncrouch();
  } else if (isMobile()) {
    input.add(forward.clone().multiplyScalar(-mobileInput.z));
    input.add(right.clone().multiplyScalar(mobileInput.x));
  }

  const wantsJump = (isLocked && keys['Space']) || mobileJump;
  player.update(input, yaw, wantsJump);
  car.update(new THREE.Vector3(), yaw, false);

  const px = player.position.x;
  const py = player.position.y;
  const pz = player.position.z;

  // --- CAMERA ---
  const target = new THREE.Vector3(px, py + player.eyeHeight, pz);
  const back = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    -Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  );

  if (cameraMode === "first") {
    player.mesh.visible = false;
    camera.position.copy(target);
  } else {
    player.mesh.visible = true;
    const maxDist = 3;
    thirdPersonRay.set(target, back.clone().normalize());
    thirdPersonRay.far = maxDist;
    const hits = thirdPersonRay.intersectObjects(
      myWorld.scene.children.filter(c => c !== player.mesh),
      true
    );
    const actualDist = hits.length > 0 ? Math.min(hits[0].distance - 0.1, maxDist) : maxDist;
    camera.position.copy(target).addScaledVector(back, actualDist);
  }

  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
  camera.rotation.z = 0;

  renderer.clear();
  renderer.render(myWorld.scene, camera);
  renderer.clearDepth();
  renderer.render(hudScene, hudCamera);

  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  const dx = px - lastPos.x;
  const dz = pz - lastPos.z;
  const ups = Math.sqrt(dx * dx + dz * dz) / dt;
  lastPos = { x: px, z: pz };
  lastTime = now;

  if (hudPos) {
    hudPos.textContent = `X: ${px.toFixed(2)}, Y: ${py.toFixed(2)}, Z: ${pz.toFixed(2)} | SPD: ${ups.toFixed(2)} u/s`;
  }

  Object.assign(lastKeys, keys);
}

animate();
