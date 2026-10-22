import * as THREE from 'three';
import * as CANNON from 'cannon';

const jumpVelocity = 8;
const maxSpeed = 8;
const acceleration = 24;

import { World2 } from './js/world2.js';
import { loader, floorTexture, waterTexture, void1Texture, roofTexture, faceTex, sideTex, skyTexture } from './js/assetloader.js';
import { Player } from './js/player.js';

const clock = new THREE.Clock();

const screen = document.getElementById("game-container");
const third = document.getElementById("third");
const swap = document.getElementById("swap");

let screenW = screen.clientWidth;
let screenH = screen.clientHeight;

let myWorld = new World2();

let player = new Player(myWorld.world, myWorld.scene);

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

// --- POINTER LOCK ---
let isLocked = false;
const isMobile = () => 'ontouchstart' in window;

screen.addEventListener('click', () => {
  if (!isMobile() && !isLocked) screen.requestPointerLock();
});

third.addEventListener('click', () => {
  cameraMode = cameraMode === "first" ? "third" : "first";
});

document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === screen;
});

let yaw   = -Math.PI / 2;
let pitch = 0;

document.addEventListener('mousemove', e => {
  if (!isLocked) return;
  yaw   -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch  = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));
});

const keys = {};
document.addEventListener('keydown', e => {
  keys[e.code] = true;
  const num = parseInt(e.key);
});
document.addEventListener('keyup', e => keys[e.code] = false);

// --- STATE ---
let cameraMode = "first";
const lastKeys = {};
const thirdPersonRay = new THREE.Raycaster();

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
  }

  const wantsJump = (isLocked && keys['Space'])
  player.update(input, yaw, wantsJump);

  const px = player.position.x;
  const py = player.position.y;
  const pz = player.position.z;

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
