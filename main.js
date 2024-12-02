import * as THREE from 'three';

let scene, camera, renderer, player;

// Initialize the scene
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

    window.addEventListener('resize', onWindowResize, false);
}

// Handle resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

initScene();
animate();
