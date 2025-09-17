const button = document.getElementById("colorButton");
const colors = ["#f4f4f4", "#ffcccc", "#ccffcc", "#ccccff", "#ffffcc"];
let index = 0;
button.addEventListener("click", function () {
  document.body.style.backgroundColor = colors[index];
  index = (index + 1) % colors.length;
});

const members = [
  { name: "Ulises", photo: "images/ulises.jpeg", desc: "holaaaa" },
  { name: "Milo",   photo: "images/milo.jpeg",   desc: "adioooss" }
];

let jindex = 0;

const card   = document.getElementById("member-section");
const nameEl = document.getElementById("member-name");
const imgEl  = document.getElementById("alumnoImages");
const descEl = document.getElementById("member-desc");

function getTime(){
  const actualDate = new Date();
  const hour = actualDate.getHours().toString().padStart(2,"0");
  const min = actualDate.getMinutes().toString().padStart(2,"0");
  const seconds = actualDate.getSeconds().toString().padStart(2,"0");
  document.form_reloj.reloj.value = `${hour} : ${min} : ${seconds}`;
  setTimeout(getTime, 1000);
}

//Cargar miembro inicial del array
window.addEventListener("DOMContentLoaded", function () {
  nameEl.textContent = members[jindex].name;
  if (imgEl) imgEl.src = members[jindex].photo;
  descEl.textContent = members[jindex].desc;
  initThree(members[jindex].photo);
});


document.getElementById("nextParticipant").addEventListener("click", () => {
  const next = (jindex + 1) % members.length;

  nameEl.textContent = members[next].name;
  descEl.textContent = members[next].desc;

  // 3D: giro completo con cambio de textura al terminar
  spinToNextTexture(members[next].photo);

  // (opcional) mantener <img> sincronizada si existe
  if (imgEl) imgEl.src = members[next].photo;

  jindex = next;

  card.classList.add("swapping");
  setTimeout(() => card.classList.remove("swapping"), 160);
});

//Animación con el Three JS
let scene, camera, renderer, mesh, tex, faceMat, sideMat, clock;
let spinning = false, spinTarget = 0, spinMid = 0, swapped = false, pendingSrc = null;
const photo3d = document.getElementById('photo3d');

const AXIS = 'z';

function initThree(startSrc){
  const W = photo3d.clientWidth, H = photo3d.clientHeight;

  scene   = new THREE.Scene();
  camera  = new THREE.PerspectiveCamera(28, W/H, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  photo3d.innerHTML = '';
  photo3d.appendChild(renderer.domElement);

  // Luces
  const amb = new THREE.AmbientLight(0xffffff, 0.6);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9); dir.position.set(2,3,4);
  const rim = new THREE.DirectionalLight(0xffffff, 0.25); rim.position.set(-3,-2,-2);
  scene.add(amb, dir, rim);

  // Geometría: cilindro delgado (moneda)
  const geo = new THREE.CylinderGeometry(1, 1, 0.08, 64, 1, false);

  // Materiales
  tex     = new THREE.TextureLoader().load(startSrc);
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI / 2;
  faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.2 });
  sideMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.7, metalness: 0.1 });

  // Orden Cylinder: [lateral, tapa arriba, tapa abajo]
  mesh = new THREE.Mesh(geo, [sideMat, faceMat, faceMat]);

  mesh.rotation.x = Math.PI / 2;

  scene.add(mesh);

  clock = new THREE.Clock();

  function tick(){
    const dt = clock.getDelta();

    if (!spinning) {
      // balanceo leve en reposo, muy sutil
      mesh.rotation[AXIS] += dt * 0.25;
    } else {
      const speed = 6.0; // rad/s
      mesh.rotation[AXIS] = Math.min(mesh.rotation[AXIS] + speed * dt, spinTarget);

      if (AXIS === 'z') {
        // Para giro frontal
        if (mesh.rotation[AXIS] >= spinTarget) {
          if (pendingSrc) changeTexture(pendingSrc);
          spinning = false; pendingSrc = null; swapped = false;
        }
      } else {
        // Para giro lateral
        const prev = mesh.rotation[AXIS];
        if (!swapped && prev < spinMid && mesh.rotation[AXIS] >= spinMid && pendingSrc){
          changeTexture(pendingSrc);
          swapped = true;
        }
        if (mesh.rotation[AXIS] >= spinTarget){
          spinning = false; swapped = false; pendingSrc = null;
        }
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // Responsive
  window.addEventListener('resize', () => {
    const w = photo3d.clientWidth, h = photo3d.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  });
}

function changeTexture(src){
  new THREE.TextureLoader().load(src, (newTex) => {
    if (tex) tex.dispose();
    newTex.center.set(0.5, 0.5);
    newTex.rotation = Math.PI / 2;
    tex = newTex;
    faceMat.map = tex;
    faceMat.needsUpdate = true;
  });
}

function spinToNextTexture(src){
  if (spinning) return; // evita solapar giros
  spinning   = true;
  pendingSrc = src;

  if (AXIS === 'z') {
    // Giro frontal: swap al final
    spinTarget = mesh.rotation[AXIS] + Math.PI * 2; // 360°
  } else {
    // Giro lateral: swap a mitad
    spinTarget = mesh.rotation[AXIS] + Math.PI * 2; // 360°
    spinMid    = mesh.rotation[AXIS] + Math.PI;     // 180°
    swapped    = false;
  }
}
