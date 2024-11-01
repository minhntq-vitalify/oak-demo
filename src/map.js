import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats'

// Initialize Stats object
const stats = new Stats();
stats.showPanel(-1);
document.body.appendChild(stats.dom);

const loader = new GLTFLoader();
// Get the base path
const origin = window.location.origin;
const pathname = window.location.pathname;
const basePath = `${origin}${pathname.substring(0, pathname.lastIndexOf('/'))}/`;

// Create a new WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer's DOM element to the document body
document.body.appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.z = 5;
camera.position.y = 2;

// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0, 1, 1).normalize();
light.castShadow = false;
scene.add(light);
const ambientLight = new THREE.AmbientLight(0xf0f6f7, 0.5);
scene.add(ambientLight);


// Set a solid color background for the scene
scene.background = new THREE.Color(0xd0d0d0);

// // Add a plane for the ground
// const groundGeometry = new THREE.PlaneGeometry(130, 200);
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.8, metalness: 0.1 });
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
// ground.position.y = 0; // Position the plane at y = 0
// scene.add(ground);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)  
controls.dampingFactor = 0.25; // Damping factor
controls.screenSpacePanning = false; // Disable panning


// Add a box in the center of the scene
// const boxGeometry = new THREE.BoxGeometry();
// const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);

// hello

async function fetchModelList(folder) {
  const response = await fetch(`${folder}/models.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch model list');
  }
  return response.json();
}

function loadModelBuldings(path, onLoad) {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        if (child.material)
        {
          child.material.color = new THREE.Color(0xffffff);
          child.material.metalness = 0.1;
          child.material.roughness = 0.8;
        }
      }
    });

    onLoad(model);
  }, undefined, (error) => {
    console.error(`Error loading model at ${path}:`, error);
  });
}

function loadModelLands(path, onLoad) {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        if (child.material)
          {
            child.material.color = new THREE.Color(0xffffff);
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
          }
      }
    });

    onLoad(model);
  }, undefined, (error) => {
    console.error(`Error loading model at ${path}:`, error);
  });
}

async function loadBuildings(folder) {
  try {
    const files = await fetchModelList(folder);
    files.forEach(file => {
      const filePath = `${folder}/${file}`;
      loadModelBuldings(filePath, (model) => {
        scene.add(model);
      });
    });
  } catch (error) {
    console.error('Error loading models:', error);
  }
}

async function loadLands(folder) {
  try {
    const files = await fetchModelList(folder);
    files.forEach(file => {
      const filePath = `${folder}/${file}`;
      loadModelLands(filePath, (model) => {
        scene.add(model);
      });
    });
  } catch (error) {
    console.error('Error loading models:', error);
  }
}

loadBuildings(`${basePath}/models/buildings`);
// loadLands(`${basePath}public/lands`);


// Animation loop
function animate() {
  stats.begin(); // Start measuring
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
  stats.end(); // End measuring
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();