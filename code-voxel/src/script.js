import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";

var container, stats;
var mouse2D,
  mouse3D,
  ray,
  rollOveredFace,
  isShiftDown = false,
  theta = 45,
  isCtrlDown = false;
let rollOverGeo;
var rollOverMesh,
  rollOverMaterial,
  voxelPosition = new THREE.Vector3(),
  tmpVec = new THREE.Vector3();
var cubeGeo, cubeMaterial;
var i, intersector;

const objects = [];

let gui,
  voxelConfig = {
    orthographicProjection: false,
  };

/**
 * Base
 */
// Debug
gui = new dat.GUI();
gui.add(voxelConfig, "orthographicProjection").onChange(function () {
  if (voxelConfig.orthographicProjection) {
    camera.toOrthographic();
    camera.position.x = 1000;
    camera.position.y = 707.106;
    camera.position.z = 1000;
    theta = 90;
  } else {
    camera.toPerspective();
    camera.position.y = 800;
  }
});

gui.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color("#E7C6F8");
// scene.fog = new THREE.Fog( 'skyblue', 250, 300 );

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Test cube
 */

// Progress
rollOverGeo = new THREE.BoxGeometry(5, 5, 5);
rollOverMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
scene.add(rollOverMesh);

// Added


cubeGeo = new THREE.BoxGeometry(5, 5, 5);
cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xfeb74c }); //map: new THREE.TextureLoader().load( '/textures/bamboo.jpg'


// Bamboo Forest

// random functions

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


  var myArray = [-45,-40,-35,-30,-25,-20,-15,-10,-5
    ,5,10,15,20,25,30,35,40,45
  ];
  
  function randomItem (){
   return myArray[Math.floor(Math.random()*myArray.length)];
  }


  //Create random bamboo forest


var loader = new GLTFLoader();
loader.crossOrigin = true;
loader.load( 'models/bamboo.glb', function ( data ) {

  var count = 25; // getRndInteger(0, 50)
  for(var i = -count; i < count - 1; i++) {
    
    var object = data.scene
    if(count > 1) {
      object = data.scene.clone();
    }
     object.position.set(randomItem(i)-2.5, 0, randomItem(i)-2.5);

    scene.add( object );
  }

});


// avatar

const avatar01 = new GLTFLoader()

avatar01.load(
    'models/character.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(70);
        model.position.setZ(-30);
        // model.rotateY(Math.PI / 2);
        model.position.set(0, 50, -100);
        scene.add(model)
    },
)



const avatar02 = new GLTFLoader()

avatar02.load(
    'models/character2.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(70);
        model.position.setZ(-30);
        model.rotateY(Math.PI / 2);
        model.position.set(-100, 30, 0);
        scene.add(model)
    },
)

// ASSERTS LOAD

const model01 = new GLTFLoader();
model01.load(
    'models/flat-module.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(0);
        model.position.setZ(70);
        scene.add(model)
    },
)

const model02 = new GLTFLoader()
model02.load(
    'models/roof-module.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(30);
        model.position.setZ(70);
        scene.add(model)
    },
)


const model03 = new GLTFLoader()
model03.load(
    'models/stair-module.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(-30);
        model.position.setZ(70);
        scene.add(model)
    },
)


// test sphere

const geometry1 = new THREE.SphereGeometry( 15, 32, 16 );
const material1 = new THREE.MeshBasicMaterial( { color: "blue" } );
const sphere = new THREE.Mesh( geometry1, material1 );
sphere.position.set(100, 50, 0);
scene.add( sphere );


// grid

const gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);

// // forest





//     const forest = new THREE.BoxGeometry(5, 5, 5);
//     const material = new THREE.MeshBasicMaterial({color:0x222222, wireframe:true});
    
//     scene.colliders = [];
    
//     for (let x=-50; x<50; x+=5){
//         for (let z=-50; z<50; z+=5){

//             //random
//             if (x > getRndInteger(-50, 50) || z < getRndInteger(-50, 50)) continue;
//             const box = new THREE.Mesh(forest, material);
//             box.position.set(x+2.5, 2.5, z+2.5);
//             scene.add(box);
//             scene.colliders.push(box);
//         }
//     }


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const geometry = new THREE.PlaneGeometry(100, 100);
geometry.rotateX(-Math.PI / 2);

const plane = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ visible: true })
);
scene.add(plane);

objects.push(plane);

const ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 0.75, 0.5).normalize();
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(1, 0.75, 0.5).normalize();
scene.add(directionalLight);


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(65, 100, 150);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: true
  
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor( 0x000000, 0 ); // the default

// vector.multiplyMatrix4()
// vector.applyMatrix4( matrix )

function save() {
  window.open(renderer.domElement.toDataURL("image/png"), "mywindow");
}

const colors = [
  {
    color: "66533C",
  },
  {
    color: "173A2F",
  },
  {
    color: "153944",
  },
  {
    color: "27548D",
  },
  {
    color: "438AAC",
  },
];

const TRAY = document.getElementById("js-tray-slide");

// Function - Build Colors
function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray__swatch");

    swatch.style.background = "#" + color.color;
    

    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener("click", selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0x" + color.color),
  });
  return new_mtl;
}

console.log("hellw");

// let tempMat = selectSwatch(e)

// cubeMaterial

// container.appendChild( renderer.domElement );

stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = "0px";
// container.appendChild( stats.domElement );

document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("keydown", onDocumentKeyDown);
document.addEventListener("keyup", onDocumentKeyUp);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position
      .divideScalar(5)
      .floor()
      .multiplyScalar(5)
      .addScalar(2.5);

    render();
  }
}

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // delete cube

    if (event.button == 2) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);

        objects.splice(objects.indexOf(intersect.object), 1);
      }

      // create cube
    } else if (event.button == 0) {
    
      const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
      voxel.position.copy(intersect.point).add(intersect.face.normal);
      voxel.position.divideScalar(5).floor().multiplyScalar(5).addScalar(2.5);
      scene.add(voxel);

      objects.push(voxel);
    } else {
      console.log("Press Mouse Button");
    }

    render();
  }
}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = true;
      break;
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = false;
      break;
  }
}

function render() {
  renderer.render(scene, camera);
}
