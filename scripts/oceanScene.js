import * as THREE from '../3js/three.module.js';

import Stats from '../3js/stats.module.js';

import { GUI } from '../3js/dat.gui.module.js';
import { OrbitControls } from '../3js/OrbitControls.js';
import { Water } from '../3js/Water.js';
import { Sky } from '../3js/Sky.js';

var container, stats;
var camera, scene, renderer, light;
var controls, water, sphere;

init();
animate();

function init() {
  container = document.getElementById('container');

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //

  scene = new THREE.Scene();

  //

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(30, 30, 100);

  //

  light = new THREE.DirectionalLight(0xffffff, 0.8);
  scene.add(light);

  // Water

  var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      './3js/waternormals.jpg',
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    alpha: 1.0,
    sunDirection: light.position.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined
  });

  water.rotation.x = -Math.PI / 2;

  scene.add(water);

  // Skybox

  var sky = new Sky();

  var uniforms = sky.material.uniforms;

  uniforms['turbidity'].value = 10;
  uniforms['rayleigh'].value = 2;
  uniforms['luminance'].value = 1;
  uniforms['mieCoefficient'].value = 0.005;
  uniforms['mieDirectionalG'].value = 0.8;

  let parameters = {
    distance: 400,
    inclination: 0.25,
    azimuth: 0.0375
  };

  let hour = new Date().getHours();

  checkHour();

  setInterval(() => {
    if (hour < 24) {
      console.log(hour);
      hour += 1;
    } else {
      hour = 0;
    }
    checkHour();
    updateSun();
  }, 360000);

  function checkHour() {
    if (hour >= 21 || hour <= 6) {
      parameters = { ...parameters, azimuth: 0.494 };
    } else if (hour > 6 && hour <= 7) {
      parameters = { ...parameters, azimuth: 0.0155 };
    } else if (hour > 7 && hour <= 8) {
      parameters = { ...parameters, azimuth: 0.0265 };
    } else if (hour > 8 && hour <= 9) {
      parameters = { ...parameters, azimuth: 0.0375 };
    } else if (hour > 9 && hour <= 10) {
      parameters = { ...parameters, azimuth: 0.065 };
    } else if (hour > 10 && hour <= 11) {
      parameters = { ...parameters, azimuth: 0.09 };
    } else if (hour > 11 && hour <= 12) {
      parameters = { ...parameters, azimuth: 0.11 };
    } else if (hour > 12 && hour <= 13) {
      parameters = { ...parameters, azimuth: 0.15 };
    } else if (hour > 13 && hour <= 14) {
      parameters = { ...parameters, azimuth: 0.2 };
    } else if (hour > 14 && hour <= 15) {
      parameters = { ...parameters, azimuth: 0.25 };
    } else if (hour > 14 && hour <= 15) {
      parameters = { ...parameters, azimuth: 0.3 };
    } else if (hour > 15 && hour <= 16) {
      parameters = { ...parameters, azimuth: 0.35 };
    } else if (hour > 16 && hour <= 17) {
      parameters = { ...parameters, azimuth: 0.4 };
    } else if (hour > 17 && hour <= 18) {
      parameters = { ...parameters, azimuth: 0.43 };
    } else if (hour > 18 && hour <= 19) {
      parameters = { ...parameters, azimuth: 0.46 };
    } else if (hour > 19 && hour <= 20) {
      parameters = { ...parameters, azimuth: 0.475 };
    } else if (hour > 20 && hour <= 21) {
      parameters = { ...parameters, azimuth: 0.49 };
    }
  }

  var cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
  cubeCamera.renderTarget.texture.generateMipmaps = true;
  cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;

  scene.background = cubeCamera.renderTarget;

  function updateSun() {
    var theta = Math.PI * (parameters.inclination - 0.5);
    var phi = 2 * Math.PI * (parameters.azimuth - 0.5);

    light.position.x = parameters.distance * Math.cos(phi);
    light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value = light.position.copy(
      light.position
    );
    water.material.uniforms['sunDirection'].value
      .copy(light.position)
      .normalize();

    cubeCamera.update(renderer, sky);
  }

  updateSun();

  // SPHERE

  var geometry = new THREE.SphereGeometry(25, 1000, 100);
  // var count = geometry.attributes.position.count;

  // var colors = [];
  // var color = new THREE.Color();

  // for (var i = 0; i < count; i += 3) {

  // 	color.setHex(Math.random() * 0xffffff);

  // 	colors.push(color.r, color.g, color.b);
  // 	colors.push(color.r, color.g, color.b);
  // 	colors.push(color.r, color.g, color.b);

  // }

  // geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const loader = new THREE.TextureLoader();

  var material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.0,
    metalness: 1,
    flatShading: true,
    envMap: cubeCamera.renderTarget.texture,
    side: THREE.DoubleSide,
    map: loader.load('./images/astrosquarenew.png')
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  //

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  //

  // * CONTROLS START *

  // stats = new Stats();
  // container.appendChild(stats.dom);

  // GUI;

  // var gui = new GUI();

  // var folder = gui.addFolder('Sky');
  // folder.add(parameters, 'inclination', 0, 0.05, 0.0001).onChange(updateSun);
  // folder.add(parameters, 'azimuth', 0, 1, 0.0001).onChange(updateSun);
  // folder.open();

  // var uniforms = water.material.uniforms;

  // var folder = gui.addFolder('Water');
  // folder
  //   .add(uniforms.distortionScale, 'value', 0, 8, 0.1)
  //   .name('distortionScale');
  // folder.add(uniforms.size, 'value', 0.1, 10, 0.1).name('size');
  // folder.add(uniforms.alpha, 'value', 0.9, 1, 0.001).name('alpha');
  // folder.open();

  // * CONTROLS END

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

function render() {
  var time = performance.now() * 0.001;

  sphere.position.y = Math.sin(time) * 20 + 5;
  sphere.rotation.x = time * 0.5;
  sphere.rotation.z = time * 0.51;

  water.material.uniforms['time'].value += 1.0 / 60.0;

  renderer.render(scene, camera);
}
