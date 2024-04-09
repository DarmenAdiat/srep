<template>
  <div>
    <div class="fire-wrapper">
      <img class="fire" src="https://stivs.dev/assets/rocket/fire.svg" />
    </div>

    <div class="rain rain1"></div>
    <div class="rain rain2">
      <div class="drop drop2"></div>
    </div>
    <div class="rain rain3"></div>
    <div class="rain rain4"></div>
    <div class="rain rain5">
      <div class="drop drop5"></div>
    </div>
    <div class="rain rain6"></div>
    <div class="rain rain7"></div>
    <div class="rain rain8">
      <div class="drop drop8"></div>
    </div>
    <div class="rain rain9"></div>
    <div class="rain rain10"></div>
    <div class="drop drop11"></div>
    <div class="drop drop12"></div>

    <div ref="canvasContainer"></div>
  </div>
</template>


<script>
import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  mounted() {
    this.main();
  },
  created(){

  },
  methods: {
    async createScene() {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x5d0361, 10, 1500);
      // Другой код, связанный с инициализацией сцены

      this.createLights();
      // Использование GLTFLoader как конструктора
      const loader = new GLTFLoader();
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      
      this.aspectRatio = this.WIDTH / this.HEIGHT;
      this.fieldOfView = 60;
      this.nearPlane = 1;
      this.farPlane = 10000;
      this.camera = new THREE.PerspectiveCamera(
          this.fieldOfView,
          this.aspectRatio,
          this.nearPlane,
          this.farPlane
      );

      this.camera.position.x = 0;
      this.camera.position.z = 500;
      this.camera.position.y = -10;

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.renderer.shadowMap.enabled = true;

      this.$refs.canvasContainer.appendChild(this.renderer.domElement);

      window.addEventListener('resize', this.handleWindowResize, false);

      // let loader = new THREE.GLTFLoader();
      // loader.load("https://stivs.dev/assets/rocket/rocket.gltf", (gltf) => {
      //   this.rocket = gltf.scene;
      //   this.rocket.position.y = 50;
      //   this.scene.add(this.rocket);
      // });
      loader.load(require('@/assets/rocket.gltf').default, (gltf) => {
        this.rocket = gltf.scene;
        this.rocket.position.y = 50;
        this.scene.add(this.rocket);
      });
      console.log(loader)
    },
    handleWindowResize() {
      this.HEIGHT = window.innerHeight;
      this.WIDTH = window.innerWidth;
      this.renderer.setSize(this.WIDTH, this.HEIGHT);
      this.camera.aspect = this.WIDTH / this.HEIGHT;
      this.camera.updateProjectionMatrix();
    },
    createLights() {
      const ambientLight = new THREE.HemisphereLight(0x404040, 0x404040, 1);

      const directionalLight = new THREE.DirectionalLight(0xdfebff, 1);
      directionalLight.position.set(-300, 0, 600);

      const pointLight = new THREE.PointLight(0xa11148, 2, 1000, 2);
      pointLight.position.set(200, -100, 50);

      // Убедитесь, что this.scene уже инициализирован
      if (this.scene) {
        this.scene.add(ambientLight, directionalLight, pointLight);
      }
      // this.scene.add(ambientLight, directionalLight, pointLight);
    },
    loop() {
      const t = (Date.now() % this.animationDuration) / this.animationDuration;

      this.renderer.render(this.scene, this.camera);

      const delta = this.targetRocketPosition * Math.sin(Math.PI * 2 * t);
      if (this.rocket) {
        this.rocket.rotation.y += 0.1;
        this.rocket.position.y = delta;
      }

      requestAnimationFrame(this.loop);
    },
    main() {
      this.targetRocketPosition = 40;
      this.animationDuration = 10000;

      this.createScene();
      // this.createLights();
      // this.loop();
    }
  }
}
</script>


<style scoped>
html,
body {
  margin: 0;
  height: 100%;
  background: #1a032b;
  overflow: hidden;
  perspective: 10rem;
}

#canvasContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fire-wrapper {
  left: 50%;
  position: absolute;
  top: 50%;
  transform-origin: top center;
  transform: translate(-50%, 0) rotate3d(1, 0, 0, 60deg);
  width: 3.5rem;
}

.fire {
  animation: whoosh 1s linear infinite both;
  width: 100%;
}

@keyframes whoosh {
  from {
    transform: translateY(-25%);
  }
  to {
    transform: translateY(0);
  }
}

.rain {
  position: absolute;
  width: 1rem;
  height: 10rem;
  background: #ffffff;
  border-radius: 20%;
  opacity: 0.2;
  z-index: -1;
}

.drop {
  width: 1rem;
  height: 7rem;
  background: #ffffff;
  position: absolute;
  border-radius: 20%;
  opacity: 0.2;
}

.rain1 {
  left: 5rem;
  top: 2rem;
  animation: raining 2s linear infinite both;
}

.rain2 {
  left: 15rem;
  top: 10rem;
  animation: raining 3s linear infinite both;
}

.drop2 {
  top: 12rem;
  animation: raining 4s linear infinite both -2s;
}

.rain3 {
  left: 5rem;
  top: 35rem;
  animation: raining 3s linear infinite both;
}

.rain4 {
  right: 23rem;
  top: 6rem;
  animation: raining 4s linear infinite both;
}

.rain5 {
  left: 25rem;
  top: 47rem;
  animation: raining 3s linear infinite both -3s;
}

.drop5 {
  top: -6rem;
  animation: raining 2s linear infinite both;
}

.rain6 {
  right: 10rem;
  top: 34rem;
  animation: raining 3s linear infinite both;
}

.rain7 {
  left: 34rem;
  top: 10rem;
  animation: raining 2s linear infinite both -5s;
}

.rain8 {
  right: 25rem;
  top: 40rem;
  animation: raining 3s linear infinite both;
}

.drop8 {
  top: -7rem;
  animation: raining 4s linear infinite both -6s;
}

.rain9 {
  right: 5rem;
  top: 15.5rem;
  animation: raining 3s linear infinite both;
}

.rain10 {
  left: 24rem;
  top: -4rem;
  animation: raining 2s linear infinite both -3s;
}

.drop11 {
  right: 17rem;
  top: 20rem;
  animation: raining 3s linear infinite both;
}

.drop12 {
  right: 15rem;
  top: 50rem;
  animation: raining 4s linear infinite both -1s;
}

@keyframes raining {
  from {
    transform: translateY(-1200px);
  }
  to {
    transform: translateY(869px);
  }
}

</style>