import * as THREE from 'THREE';
import { createConnection, broadcastMessage } from './webrtc.js';
import { pushToGitHub, pullFromGitHub } from './github.js';

// World state
const worldState = {};

// Initialize scene, camera, renderer, and player
let scene, camera, renderer, player, controls;

const peerId = 'peer-' + Math.random().toString(36).substring(2);
const connection = createConnection(peerId, (peer, signal) => {
    console.log(`Signal for ${peer}:`, signal);
    // Share this signal manually for testing
});

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00aa00 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add player
    const playerGeometry = new THREE.SphereGeometry(1, 32, 32);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    scene.add(player);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // Camera follows player
    camera.lookAt(player.position);

    // Initialize player movement controls
    controls = new THREE.PointerLockControls(camera, renderer.domElement);

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);

    // Add keyboard event listeners for movement
    window.addEventListener('keydown', onKeyDown, false);
}

// Handle resizing the window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle keyboard input for player movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

// Update player movement
function updateMovement() {
    const speed = 0.1;
    if (moveForward) player.position.z -= speed;
    if (moveBackward) player.position.z += speed;
    if (moveLeft) player.position.x -= speed;
    if (moveRight) player.position.x += speed;
}

// Update world state and broadcast to peers
function updateWorldState(changes) {
    Object.assign(worldState, changes);
    broadcastMessage(JSON.stringify(changes));
}

// Save world state to GitHub
async function saveState() {
    const stateJSON = JSON.stringify(worldState);
    await pushToGitHub('world-state.json', stateJSON);
}

// Load world state from GitHub
async function loadState() {
    const stateJSON = await pullFromGitHub('world-state.json');
    if (stateJSON) {
        Object.assign(worldState, JSON.parse(stateJSON));
        console.log('Loaded world state:', worldState);
    }
}

// Periodically save the world state every minute
setInterval(saveState, 60 * 1000); // Save every minute

// Start the scene
initScene();
animate();

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update player movement
    updateMovement();

    // Render the scene
    renderer.render(scene, camera);
}

// Initial load of the world state
loadState();
