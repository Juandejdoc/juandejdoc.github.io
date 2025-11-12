/* ====== Usar paquete npm para que Vite lo procese ====== */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/* ====== Config básica (ajusta si ya tienes DRACO en otra carpeta) ====== */
const DRACO_PATH = "/draco/gltf/"; // carpeta con decoders draco_wasm_wrapper.js, draco_decoder.wasm, etc. Ajusta a tu estructura.

/* ====== Elementos del DOM ya creados en Fase 1 ====== */
const wrap = document.getElementById("transportCanvasWrap");
const loaderOverlay = document.getElementById("transportLoader");
const barFill = document.getElementById("loaderBarFill");
const percentEl = document.getElementById("loaderPercent");
const captionEl = document.getElementById("transportCaption");
const tabs = document.getElementById("transportTabs");
let currentModelKey = "camion_vacio";
let currentModelSrc = "/Servicios/Recursos/Transporte/Camiondevacio.glb";
let currentModelTitle = "Camion de vacio";
let currentModelThumb = "/Servicios/Recursos/Transporte/thumb_camion_vacio.jpg";

/* ====== Escena/Renderer/Cámara/Controles ====== */
const scene = new THREE.Scene();
scene.background = new THREE.Color("#103d31");

const fov = 45;
const camera = new THREE.PerspectiveCamera(
  fov,
  wrap.clientWidth / wrap.clientHeight,
  0.1,
  2000
);
camera.position.set(4.0, 2.13, 5.78);
camera.rotation.set(
  THREE.MathUtils.degToRad(-14),
  THREE.MathUtils.degToRad(44.2),
  THREE.MathUtils.degToRad(9.9)
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const _rect = wrap.getBoundingClientRect();
const _w0 = Math.max(1, Math.floor(_rect.width || wrap.clientWidth || 800));
const _h0 = Math.max(1, Math.floor(_rect.height || wrap.clientHeight || 480));
renderer.setSize(_w0, _h0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#103d31", 1);
wrap.appendChild(renderer.domElement);
// Asegurar aspecto inicial correcto aunque el wrap inicial sea 0px
camera.aspect = _w0 / _h0;
camera.updateProjectionMatrix();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
controls.target.set(0, 1.2, 0);

/* ====== Luces ====== */
const hemi = new THREE.HemisphereLight(0xffffff, 0x99aabb, 1.2);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.8);
dir.position.set(6, 8, 4);
dir.castShadow = true;
dir.shadow.mapSize.set(2048, 2048);
dir.shadow.camera.near = 0.5;
dir.shadow.camera.far = 40;
dir.shadow.camera.left = -10;
dir.shadow.camera.right = 10;
dir.shadow.camera.top = 10;
dir.shadow.camera.bottom = -10;
scene.add(dir);

/* ====== Piso receptor de sombras ====== */
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({
  color: "#0e4a3b",
  roughness: 1,
  metalness: 0,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* ====== Loader con progreso ====== */
const manager = new THREE.LoadingManager();
manager.onStart = () => showLoader(0);
manager.onProgress = (_, loaded, total) => {
  const p = Math.round((loaded / total) * 100);
  updateLoader(p);
};
manager.onLoad = () => hideLoader();

const gltfLoader = new GLTFLoader(manager);
const draco = new DRACOLoader(manager);
draco.setDecoderPath(DRACO_PATH);
draco.preload();
gltfLoader.setDRACOLoader(draco);

/* ====== Utilidades ====== */
let currentModel = null;
const tmpBox = new THREE.Box3();
const tmpVec = new THREE.Vector3();

function showLoader(p = 0) {
  barFill.style.width = `${p}%`;
  percentEl.textContent = `${p}%`;
  loaderOverlay.classList.add("is-visible");
}
function updateLoader(p) {
  barFill.style.width = `${p}%`;
  percentEl.textContent = `${p}%`;
}
function hideLoader() {
  loaderOverlay.classList.remove("is-visible");
}

function disposeModel(model) {
  if (!model) return;
  model.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry?.dispose?.();
      if (obj.material) {
        if (Array.isArray(obj.material))
          obj.material.forEach((m) => m.dispose?.());
        else obj.material.dispose?.();
      }
    }
  });
  scene.remove(model);
}

function frameObject(obj) {
  tmpBox.setFromObject(obj);
  const size = tmpBox.getSize(new THREE.Vector3());
  const center = tmpBox.getCenter(new THREE.Vector3());

  // Centrar en el origen en Y=0 (piso)
  obj.position.sub(center);
  // Volver a calcular y tomar altura para ponerlo sobre el piso
  tmpBox.setFromObject(obj);
  tmpBox.getCenter(center);
  tmpBox.getSize(size);
  obj.position.y -= tmpBox.min.y; // apoya en Y=0

  // Distancia de cámara según tamaño (factor >1 separa un poco)
  let maxDim = Math.max(size.x, size.y, size.z);
  if (!isFinite(maxDim) || maxDim <= 0) maxDim = 1;

  // Escalar para encajar en un tamaño objetivo razonable
  const targetSize = 6;
  const s = targetSize / maxDim;
  if (s > 0 && s !== 1) {
    obj.scale.setScalar(s);
    tmpBox.setFromObject(obj);
    tmpBox.getSize(size);
    obj.position.y -= tmpBox.min.y;
    maxDim = Math.max(size.x, size.y, size.z);
  }
  const camZ = (maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2))) * 1; // a bit closer

  controls.target.set(0, size.y * 0.45, 0);
  camera.position.set(camZ * 0.6, camZ * 0.45, camZ * 0.8);
  camera.lookAt(controls.target);
  // Ajusta límites de zoom para no atravesar el modelo
  controls.minDistance = Math.max(0.5, maxDim * 0.2);
  controls.maxDistance = Math.max(5, maxDim * 4);
  controls.update();
}

/* ====== Carga de un modelo por ruta ====== */
function loadModelBySrc(src) {
  if (!src) return;
  showLoader(0);
  if (currentModel) {
    disposeModel(currentModel);
    currentModel = null;
  }
  gltfLoader.load(
    src,
    (gltf) => {
      currentModel = gltf.scene;
      currentModel.traverse((o) => {
        if (o.isMesh) o.castShadow = true;
      });
      scene.add(currentModel);
      frameObject(currentModel);
      // Override camera to preferred default on first render of the session
      if (!window.__transport_cam_set__) {
        camera.position.set(4.59, 2.13, 5.78);
        camera.rotation.set(
          THREE.MathUtils.degToRad(-14),
          THREE.MathUtils.degToRad(44.2),
          THREE.MathUtils.degToRad(9.9)
        );
        controls.update();
        window.__transport_cam_set__ = true;
      }
      updateCaptionByAngle();
      hideLoader();
    },
    undefined,
    (err) => {
      console.error("Error cargando GLB:", err);
      hideLoader();
    }
  );
}

/* ====== Textos que cambian según ángulo ====== */
let lastCaptionKey = "";
function getCaptionForAngle(rad) {
  const modelKey = currentModelKey;
  // Normaliza a [0, 2π)
  const a = ((rad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const deg = THREE.MathUtils.radToDeg(a);
  if (modelKey === "camion_vacio") {
    if (deg < 120) return "Succión de aguas y lodos";
    if (deg < 240) return "Sondeo de tuberías desde 3” a 6”";
    return "Equipo de presión y succión (Vactor) de gran potencia para sondeo de redes hasta de 36”";
  }
  const active = document.querySelector(".transport-tab.is-active");
  return active?.title || active?.textContent?.trim() || "Transporte";
}
const updateCaptionByAngle = (() => {
  let t = 0;
  return () => {
    if (performance.now() - t < 120) return; // pequeño debounce
    t = performance.now();
    const angle = controls.getAzimuthalAngle();
    const text = getCaptionForAngle(angle);
    if (text !== lastCaptionKey) {
      captionEl.textContent = text;
      lastCaptionKey = text;
    }
  };
})();

/* ====== Eventos de tabs ====== */
tabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".transport-tab");
  if (!btn) return;
  // No selected state; allow clicking the same tile repeatedly
  // Preparar datos nuevos (del tile clickeado)
  const tileTitleEl = btn.querySelector("h2");
  const tileImgEl = btn.querySelector("img");
  const newKey = btn.dataset.model || "";
  const newSrc = btn.dataset.src || "";
  const newTitle =
    btn.title || tileTitleEl?.textContent?.trim() || "Transporte";
  const newThumb = tileImgEl?.getAttribute("src") || "";

  // Intercambiar la info: mover la del viewer al tile
  if (tileTitleEl) tileTitleEl.textContent = currentModelTitle;
  if (tileImgEl && currentModelThumb)
    tileImgEl.setAttribute("src", currentModelThumb);
  btn.title = currentModelTitle;
  btn.setAttribute("aria-label", currentModelTitle);
  if (tileImgEl) tileImgEl.setAttribute("alt", currentModelTitle);
  btn.dataset.model = currentModelKey;
  btn.dataset.src = currentModelSrc;

  // Actualizar viewer con la info del tile
  currentModelKey = newKey;
  currentModelSrc = newSrc;
  currentModelTitle = newTitle;
  currentModelThumb = newThumb;

  const titleEl = document.getElementById("transportTitle");
  if (titleEl) titleEl.textContent = currentModelTitle;
  captionEl.textContent = getCaptionForAngle(controls.getAzimuthalAngle());
  lastCaptionKey = "";
  loadModelBySrc(currentModelSrc);
});

/* ====== Loop de render ====== */
let running = true;
function animate() {
  if (!running) return;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  updateCaptionByAngle();
}
animate();

/* Pausar si la pestaña no es visible para ahorrar recursos */
document.addEventListener("visibilitychange", () => {
  running = !document.hidden;
  if (running) animate();
});

/* Resize */
window.addEventListener("resize", () => {
  const r = wrap.getBoundingClientRect();
  const w = Math.max(1, Math.floor(r.width || wrap.clientWidth));
  const h = Math.max(1, Math.floor(r.height || wrap.clientHeight));
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

/* ====== Cargar el primer modelo (Camión de vacío por defecto, sin tile) ====== */
document.getElementById("transportTitle").textContent = currentModelTitle;
captionEl.textContent = getCaptionForAngle(0);
loadModelBySrc(currentModelSrc);
