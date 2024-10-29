import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const loader = new GLTFLoader();
const basePath = `${window.location.origin}${window.location.pathname}`;
const buildingsFolder = `${basePath}public/buildings`;

// Create a new WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer's DOM element to the document body
document.body.appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.25; // Damping factor
controls.screenSpacePanning = false; // Disable panning

// Key controls for camera movement
const moveSpeed = 0.1;
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      camera.position.y += moveSpeed;
      break;
    case 'ArrowDown':
      camera.position.y -= moveSpeed;
      break;
    case 'ArrowLeft':
      camera.position.x -= moveSpeed;
      break;
    case 'ArrowRight':
      camera.position.x += moveSpeed;
      break;
  }
}

window.addEventListener('keydown', handleKeyDown);

async function fetchModelList(folder) {
  const response = await fetch(`${folder}/models.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch model list');
  }
  return response.json();
}

function loadModel(path, onLoad) {
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    onLoad(model);
  }, undefined, (error) => {
    console.error(`Error loading model at ${path}:`, error);
  });
}

async function loadAllModels(folder) {
  try {
    const files = await fetchModelList(folder);
    files.forEach(file => {
      const filePath = `${folder}/${file}`;
      loadModel(filePath, (model) => {
        scene.add(model);
      });
    });
  } catch (error) {
    console.error('Error loading models:', error);
  }
}

// Call the function to load all models
loadAllModels(buildingsFolder);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();