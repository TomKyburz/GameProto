import * as THREE from 'three';
import * as CANNON from 'cannon';
import { floor, wall, ceiling } from '/3d0/js/assetloader.js';

const ARENA_SIZE  = 280;
const WALL_HEIGHT = 40;

const HALF_SIZE   = ARENA_SIZE / 2;
const HALF_HEIGHT = WALL_HEIGHT / 2;

export class World2 {
  constructor() {
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -18, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.defaultContactMaterial.friction = 0;
    this.world.defaultContactMaterial.restitution = 0;
    this.initScene();
  }

  initScene() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));

    ceiling.repeat.set(55,55)
    wall.repeat.set(10, 1);
    floor.repeat.set(20, 20);

    const floorMat = new THREE.MeshPhongMaterial({ map: floor });
    const wallMat  = new THREE.MeshPhongMaterial({ map: wall });
    const ceilMat  = new THREE.MeshPhongMaterial({ map: ceiling });

    const floorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(ARENA_SIZE, 1, ARENA_SIZE),
      floorMat,
    );
    floorMesh.position.set(0, -0.5, 0);
    this.scene.add(floorMesh);

    const floorBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(HALF_SIZE, 0.5, HALF_SIZE)),
    });
    floorBody.position.copy(floorMesh.position);
    this.world.addBody(floorBody);

    const ceilMesh = new THREE.Mesh(
      new THREE.BoxGeometry(ARENA_SIZE, 1, ARENA_SIZE),
      ceilMat,
    );
    ceilMesh.position.set(0, WALL_HEIGHT, 0);
    this.scene.add(ceilMesh);

    const ceilBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(HALF_SIZE, 0.5, HALF_SIZE)),
    });
    ceilBody.position.copy(ceilMesh.position);
    this.world.addBody(ceilBody);

    const geoAlongX = new THREE.BoxGeometry(ARENA_SIZE, WALL_HEIGHT, 1);
    const geoAlongZ = new THREE.BoxGeometry(1, WALL_HEIGHT, ARENA_SIZE);
    const shapeAlongX = new CANNON.Box(new CANNON.Vec3(HALF_SIZE, HALF_HEIGHT, 0.5));
    const shapeAlongZ = new CANNON.Box(new CANNON.Vec3(0.5, HALF_HEIGHT, HALF_SIZE));

    const wallDefs = [
      // [ x, y, z, geo, shape ]
      [0,            HALF_HEIGHT,  HALF_SIZE,  geoAlongX, shapeAlongX],
      [0,            HALF_HEIGHT, -HALF_SIZE,  geoAlongX, shapeAlongX],
      [ HALF_SIZE,   HALF_HEIGHT, 0,           geoAlongZ, shapeAlongZ],
      [-HALF_SIZE,   HALF_HEIGHT, 0,           geoAlongZ, shapeAlongZ],
    ];

    for (const [x, y, z, geo, shape] of wallDefs) {
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);

      const body = new CANNON.Body({ mass: 0, shape });
      body.position.set(x, y, z);
      this.world.addBody(body);
    }
  }
}
