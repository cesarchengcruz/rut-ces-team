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
scene.background = new THREE.Color( '#E7C6F8' );


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

//

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const geometry = new THREE.PlaneGeometry( 100, 100 );
geometry.rotateX( - Math.PI / 2 );

const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
scene.add( plane );

objects.push( plane );

const ambientLight = new THREE.AmbientLight( 0x606060 );
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
scene.add( directionalLight );

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.11);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene   
scene.add(hemiLight);

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

// Models

const model01 = new GLTFLoader();
model01.load(
    'models/flat-module.glb',
    function (gltf) {

      const model = gltf.scene;
      model.position.setX(30);
      model.position.setZ(70);
      scene.add(model)
    },
)



let glTFGeometry;

const model02 = new GLTFLoader()
model02.load(
    'models/roof-module.glb',
    function (gltf) {

        const model = gltf.scene;
        model.position.setX(30);
        model.position.setZ(70);

        gltf.scene.traverse( function ( child ) {

          if ( child.isMesh ) {

              //Setting the buffer geometry
              glTFGeometry = child.geometry;

          }

      } );

        scene.add(model)
    },
)


const model03 = new GLTFLoader()
model03.load(
    'models/stair-module.glb',
    function (gltf) {

      const model = gltf.scene;
      model.position.setX(30);
      model.position.setZ(70);
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

/**
 * Camera
 */
// Base camera



const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 50, 80, 130 );
camera.lookAt( 0, 0, 0 );
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// Select Option

let new_mtl;

new_mtl = new THREE.MeshLambertMaterial({
  color: parseInt("0x000050"),
});

$('#roof').click(() => {
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0xA65F21"),
  });
})

$('#stairs').click(() => {
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0xFF6B31"),
  });
})

$('#room').click(() => {
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0xBF9A56"),
  });
})

$('#connector').click(() => {
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0x59271C"),
  });
})

$('#bamboo').click(() => {
  new_mtl = new THREE.MeshLambertMaterial({
    color: parseInt("0x83A605"),
  });
})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true, preserveDrawingBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
// container.appendChild( stats.domElement );

document.addEventListener( 'pointermove', onPointerMove );
document.addEventListener( 'pointerdown', onPointerDown );
document.addEventListener( 'keydown', onDocumentKeyDown );
document.addEventListener( 'keyup', onDocumentKeyUp );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function onPointerMove( event ) {

    pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( objects, false );

    if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];

        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

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

            // create cube
            

        } else if (event.button == 0) {

            const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
            
            if (voxel.position.y < 13) {
              scene.add( voxel );
              objects.push( voxel );
            }

            else {
              alert("Bamboo construction not permitted")
            }


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