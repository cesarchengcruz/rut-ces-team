import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from 'three/examples/jsm/libs/stats.module'

var container, stats;
var mouse2D, mouse3D, ray,
rollOveredFace, isShiftDown = false,
theta = 45, isCtrlDown = false;
let rollOverGeo
var rollOverMesh, rollOverMaterial, voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3();
var cubeGeo, cubeMaterial;
var i, intersector;

const objects = [];

let gui, voxelConfig = {
    orthographicProjection: false
};



/**
 * Base
 */
// Debug
gui = new dat.GUI()
gui.add(voxelConfig, 'orthographicProjection').onChange(function(){

    if ( voxelConfig.orthographicProjection ) {
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
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color( '#E7C6F8' );


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test cube
 */

// Progress
rollOverGeo = new THREE.BoxGeometry( 5, 5, 5 );
rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
scene.add( rollOverMesh );

// Added
cubeGeo = new THREE.BoxGeometry( 5, 5, 5 );
cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c } ); //map: new THREE.TextureLoader().load( '/textures/bamboo.jpg'



// grid

const gridHelper = new THREE.GridHelper( 100, 20 );
scene.add( gridHelper );

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const geometry = new THREE.PlaneGeometry( 100, 100 );
geometry.rotateX( - Math.PI / 2 );

const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: true } ) );
scene.add( plane );

objects.push( plane );

const ambientLight = new THREE.AmbientLight( 0x404040 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xe8c37b, 1.55 );
directionalLight.position.set(110,35,-100);
scene.add( directionalLight );

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.55);
sunLight.position.set(-110,30,104);
scene.add(sunLight);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xe8c37b, 0.25);
hemiLight.position.set(0, 20, 0);
// Add hemisphere light to scene   
scene.add(hemiLight);


//calculation function

let counter = { 
  roof : 0,
  room: 0,
  connector: 0,
  bamboo:0,
  stairs: 0,
}

function calcNeu(c){
  var calc = c.bamboo - (c.room + c.stairs + c.roof + c.connector )
  console.log( "The bamboo ratio is  " + calc)
  return calc 

}



function addBox (label) {
  switch(label){
    case "roof":
      counter.roof +=1
      break
    case "room":
      counter.room +=1
      break
    case "connector":
      counter.connector +=1
      break
    case "bamboo":
      counter.bamboo +=1
      break
    case "stairs":
    counter.stairs +=1
      break
  }
console.log(counter)
calcNeu(counter)

}

function updateCount(e) {
  const data = calcNeu(counter)
  const answer = document.getElementById('calculated-area');
  
  const area = calcNeu(counter);
  answer.innerHTML = `<p><strong>${area}</strong></p><p>Forest Health</p>`;
  
}



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

let cBamboo;
var loader = new GLTFLoader();
loader.crossOrigin = true;
loader.load( 'models/bamboo.glb', function ( data ) {

var count = 25; // getRndInteger(0, 50)
for(var i = -count; i < count - 1; i++) {
  
  var bamObject = data.scene
  if(count > 1) {
    bamObject = data.scene.clone();
  }
  bamObject.position.set(randomItem(i)-2.5, 0, randomItem(i)-2.5);

  scene.add( bamObject );
  cBamboo = bamObject;
}

});

// Aavatars

// const avatar02 = new GLTFLoader()

// avatar02.load(
//     'models/character2.glb',
//     function (gltf) {

//         const model = gltf.scene;
//         model.position.setX(70);
//         model.position.setZ(-30);
//         model.rotateY(Math.PI / 2);
//         model.position.set(-100, 30, 0);
//         scene.add(model)
//     },
// )

// ASSERTS LOAD

let cRoof, cRoom, cStairs, cConnector;

const model01 = new GLTFLoader();
model01.load(
    'models/flat-module.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(0);
        model.position.setZ(70);
        scene.add(model)
        cRoom = model;
        
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
        cRoof = model;
        
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
        cStairs = model;
    },
)

const model04 = new GLTFLoader()
model04.load(
    'models/composition.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(0 -2.5);
        model.position.setZ(0-2.5);
        scene.add(model)
    },
)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


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
controls.dampingFactor = 0.1;

// Select Option

let new_mtl = {
  material: new THREE.MeshLambertMaterial({
    color: parseInt("0x000050"), opacity: 0.0, transparent: true}),
  label: null

}

let numeric = 1; 


$('#roof').click(() => {
  new_mtl.material = new THREE.MeshLambertMaterial({
    color: parseInt("0xA65F21"), opacity: 0.0, transparent: true
    
  });
  new_mtl.label = "roof"
})

$('#stairs').click(() => {
  new_mtl.material = new THREE.MeshLambertMaterial({
    color: parseInt("0xFF6B31"), opacity: 0.0, transparent: true
  });
  new_mtl.label = "stairs"
})

$('#room').click(() => {
  new_mtl.material = new THREE.MeshLambertMaterial({
    color: parseInt("0xBF9A56"), opacity: 0.0, transparent: true
  });
  new_mtl.label = "room"
})

$('#connector').click(() => {
  new_mtl.material = new THREE.MeshLambertMaterial({
    color: parseInt("0x59271C"), opacity: 0.0, transparent: true
  });
  new_mtl.label = "connector"
})

$('#bamboo').click(() => {
  new_mtl.material = new THREE.MeshLambertMaterial({
    color: parseInt("0x83A605"), opacity: 0.0, transparent: true
  });
  new_mtl.label = "bamboo"
})






/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true, preserveDrawingBuffer: true, alpha: true
})

renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
// container.appendChild( stats.domElement );

document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener( 'pointerdown', onPointerDown );
document.addEventListener( 'keydown', onDocumentKeyDown );
document.addEventListener( 'keyup', onDocumentKeyUp );


function onPointerMove( event ) {

  pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( objects, false );

  if ( intersects.length > 0 ) {

    const intersect = intersects[ 0 ];

    rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
    rollOverMesh.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );

    render();

  }

}

function onPointerDown( event ) {

  pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObjects( objects, false );

  if ( intersects.length > 0 ) {

    const intersect = intersects[ 0 ];

    // delete cube

    if ( event.button == 2 ) {

      if ( intersect.object !== plane ) {

        scene.remove( intersect.object );

        objects.splice( objects.indexOf( intersect.object ), 1 );

      }

      //test create a model

      // create cube

    } if ( event.button == 0 ) {
  

      /// model ///
      const voxel = new THREE.Mesh( cubeGeo, new_mtl.material );

      let voxelR;
      
      if (new_mtl.label == "roof") {
        voxelR = cRoof.clone();
      } else if (new_mtl.label == "room") {
        voxelR = cRoom.clone();
      } else if (new_mtl.label == "bamboo") {
        voxelR = cBamboo.clone();
      } else if (new_mtl.label == "stairs") {
        voxelR = cStairs.clone();
      } else if (new_mtl.label == "connector") {
        voxelR = cStairs.clone();
      } else {
        voxelR = cRoom.clone();
      }
      
      console.log(new_mtl.label)

      voxelR.position.copy( intersect.point ).add( intersect.face.normal );
      voxelR.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );
      voxelR.position.setY(voxelR.position.y - 2.5)

      scene.add(voxelR)
      objects.push(voxelR);

      // console.log(objects)

      
      voxel.position.copy( intersect.point ).add( intersect.face.normal );
      voxel.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );
      // voxel.position.setY(-.1)
      if (voxel.position.y < 13) {
        scene.add(voxel);
        objects.push(voxel);
        
      }
      else {
        alert("Bamboo construction restricts to 3 storeys")
      }

      addBox(new_mtl.label)
      updateCount(event)

    } else {
      console.log("Press Mouse Button")
    }

    render();

  }

}

function onDocumentKeyDown( event ) {

  switch ( event.keyCode ) {

    case 16: isShiftDown = true; break;

  }

}

function onDocumentKeyUp( event ) {

  switch ( event.keyCode ) {

    case 16: isShiftDown = false; break;

  }

}

function render() {

  renderer.render( scene, camera );

}



const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()