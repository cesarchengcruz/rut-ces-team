let socket;
//socket = io.connect('http://localhost:3000') // Connect client to server in socket
socket = io()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene();
// Base camera

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(95, 90, 150);
camera.lookAt(0, 0, 0);
scene.add(camera);

// const stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.top = '0px';
// // container.appendChild( stats.domElement );

// Controls

const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas, antialias: true, preserveDrawingBuffer: true, alpha: true
})

renderer.shadowMap.enabled = true;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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

const objects = [];

class Cube{
  constructor(){

    /**
     * Test cube
     */

    // Progress
    this.rollOverGeo = new THREE.BoxGeometry( 5, 5, 5 );
    this.rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    this.rollOverMesh = new THREE.Mesh( this.rollOverGeo, this.rollOverMaterial );
    scene.add( this.rollOverMesh );

    // Added
    this.cubeGeo = new THREE.BoxGeometry( 5, 5, 5 );
    this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c } ); //map: new THREE.TextureLoader().load( '/textures/bamboo.jpg'

    // grid

    this.gridHelper = new THREE.GridHelper( 100, 20 );
    scene.add( this.gridHelper );

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.geometry = new THREE.PlaneGeometry( 100, 100 );
    this.geometry.rotateX( - Math.PI / 2 );

    this.plane = new THREE.Mesh( this.geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( this.plane );

    objects.push( this.plane );

    // let bulbLight, bulbMat;

    // const bulbGeometry = new THREE.SphereGeometry( 0.02, 16, 8 );
    // bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );

    // bulbMat = new THREE.MeshStandardMaterial( {
    //   emissive: 0xffffee,
    //   emissiveIntensity: 1.25,
    //   color: 0x000000
    // } );
    // bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );

    // bulbLight.castShadow = true;
    // bulbLight.position.set( 2.5, 14, 2.5 );
    // scene.add( bulbLight );

    // bulbLight.power = 25;

    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( this.ambientLight );

    this.directionalLight = new THREE.DirectionalLight( 0xe8c37b, .5 );
    this.directionalLight.position.set(110,35,-100);
    scene.add( this.directionalLight );

    this.sunLight = new THREE.DirectionalLight(0xe8c37b, 1.55);
    this.sunLight.position.set(-110,30,104);
    scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xe8c37b, 0.25);
    this.hemiLight.position.set(0, 20, 0);
    // Add hemisphere light to scene   
    scene.add(this.hemiLight);


    //calculation function

    this.counter = { 
      roof : 0,
      room: 0,
      connector: 0,
      bamboo:15,
      stairs: 0,
    }

    function calcNeu(c){
      let upCalc = (c.room + c.stairs + c.roof + c.connector )
      var calc = c.bamboo / upCalc

      // console.log( "The bamboo ratio is  " + calc)
      // console.log( counter)
      return calc 

    }



    function addBox (label) {
      switch(label){
        case "roof":
          this.counter.roof +=1
          break
        case "room":
          this.counter.room +=1
          break
        case "connector":
          this.counter.connector +=1
          break
        case "bamboo":
          this.counter.bamboo +=1
          break
        case "stairs":
          this.counter.stairs +=1
          break
      }
    // console.log(counter)
    calcNeu(this.counter)

    }

    function updateCount(e) {
      this.data = calcNeu(this.counter)
      this.answer = document.getElementById('calculated-area');
      
      this.area = calcNeu(this.counter);
      // Restrict the area to 2 decimal points.
      this.rounded_area = Math.round(this.area * 100) / 100;
      this.answer.innerHTML = `<p><strong>${this.rounded_area}</strong></p><p>neutrality ratio</p>`;
      
    }

    // Bamboo Forest

    // random functions

    function getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    }


    this.myArray = [-45,-40,-35,-30,-25,-20,-15,-10,-5
      ,5,10,15,20,25,30,35,40,45
    ];

    function randomItem (){
    return this.myArray[Math.floor(Math.random()*myArray.length)];
    }


    //Create random bamboo forest

    this.loader = new THREE.GLTFLoader();
    this.loader.crossOrigin = true;
    this.loader.load( 'models/module-bamboo.glb', function ( data ) {
  
      this.count = 25; // getRndInteger(0, 50)
    for(var i = -this.count; i < this.count - 1; i++) {
      
      this.bamObject = data.scene
      this.bamObject.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      if(this.count > 1) {
        this.bamObject = data.scene.clone();
      }
      this.bamObject.position.set(randomItem(i)-2.5, 0, randomItem(i)-2.5);

      scene.add( this.bamObject );
      this.cBamboo = this.bamObject;
    }

    });

    // Aavatars


    // const avatar01 = new THREE.GLTFLoader()

    // avatar01.load(
    //     'models/character.glb',
    //     function (gltf) {

    //         const model = gltf.scene;
    //         // model.rotateY(Math.PI / 12);
    //         model.position.set(0, 40, -100);
    //         scene.add(model)
    //     },
    // )

    // const avatar02 = new THREE.GLTFLoader()

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
    this.model01 = new THREE.GLTFLoader();
    this.model01.load(
        'models/module-room.glb',
        function (gltf) {

            this.model = gltf.scene;
            gltf.scene.traverse((o) => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
              }
            });
            this.model.position.setX(0);
            this.model.position.setZ(70);
            scene.add(this.model)
            this.cRoom = this.model;
            
        },
    )

    this.model02 = new THREE.GLTFLoader()
    this.model02.load(
        'models/module-roof.glb',
        function (gltf) {

            this.model = gltf.scene;
            gltf.scene.traverse((o) => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
              }
            });
            this.model.position.setX(30);
            this.model.position.setZ(70);
            this.model.name = "roof-object"
            scene.add(this.model)
            this.cRoof = this.model;
            
        },
    )


    this.model03 = new THREE.GLTFLoader()
    this.model03.load(
        'models/module-stairs.glb',
        function (gltf) {

            this.model = gltf.scene;
            gltf.scene.traverse((o) => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
              }
            });
            this.model.position.setX(-30);
            this.model.position.setZ(70);
            scene.add(this.model)
            this.cStairs = this.model;
        },
    )
    this.model04 = new THREE.GLTFLoader()
    this.model04.load(
        'models/module-connector.glb',
        function (gltf) {

          this.model = gltf.scene;
            gltf.scene.traverse((o) => {
              if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
              }
            });
            this.model.position.setX(0 -2.5);
            this.model.position.setZ(0-2.5);
            scene.add(this.model)
            this.cConnector = this.model;

        },
    )
    // Select Option

    this.new_mtl = {
      material: new THREE.MeshLambertMaterial({
        color: parseInt("0x000050"), opacity: 0.0, transparent: true}),
      label: null

    }

    this.numeric = 1; 


    $('#roof').click(() => {
      this.new_mtl.material = new THREE.MeshLambertMaterial({
        color: parseInt("0xA65F21"), opacity: 0.0, transparent: true
        
      });
      this.new_mtl.label = "roof"
    })

    $('#stairs').click(() => {
      this.new_mtl.material = new THREE.MeshLambertMaterial({
        color: parseInt("0xFF6B31"), opacity: 0.0, transparent: true
      });
      this.new_mtl.label = "stairs"
    })

    $('#room').click(() => {
      this.new_mtl.material = new THREE.MeshLambertMaterial({
        color: parseInt("0xBF9A56"), opacity: 0.0, transparent: true
      });
      this.new_mtl.label = "room"
    })

    $('#connector').click(() => {
      this.new_mtl.material = new THREE.MeshLambertMaterial({
        color: parseInt("0x59271C"), opacity: 0.0, transparent: true
      });
      this.new_mtl.label = "connector"
    })

    $('#bamboo').click(() => {
      this.new_mtl.material = new THREE.MeshLambertMaterial({
        color: parseInt("0x83A605"), opacity: 0.0, transparent: true
      });
      this.new_mtl.label = "bamboo"
    })

    document.addEventListener("pointermove", event => {

      this.pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

      this.raycaster.setFromCamera( this.pointer, camera );

      const intersects = this.raycaster.intersectObjects( objects, false );

      if ( intersects.length > 0 ) {

        const intersect = intersects[ 0 ];

        this.rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        this.rollOverMesh.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );

        this.animate();

      }

    })


    // Recursive function - this function calls itself again, when isContainer is undefined/false passing its parent as new child

    // function getContainerObjByChild(child) {
      
    //   if(obj.userData.isContainer) return obj

    //   else if(obj.parent != null) return this.getContainerObjByChild(obj.parent)

    //   else return null
    // }


    document.addEventListener("pointerdown", event => {

      this.pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

      this.raycaster.setFromCamera( this.pointer, camera );

      // const intersects = raycaster.intersectObjects( objects, false );
      const intersects = this.raycaster.intersectObjects( objects, true );
      if ( intersects.length > 0 ) {
        
        
        const intersect = intersects[ 0 ];
        console.log("interesects")
        console.log(intersects)
        var objectGroup = intersects[2]
        console.log(objectGroup)
        

        // delete cube

        if ( event.button == 2 ) {

          if ( intersect.object !== plane ) {
                  
            this.selectedObject = scene.getObjectByName(intersect.object.name);
            console.log (this.selectedObject.parent.parent.name)

            const parentRemove  = this.selectedObject.parent;
            // console.log ("object to remove")
            // console.log (parentRemove)

            // var children_to_remove = [];
            // scene.traverse(function(child){
                
            //     if(child.name == parentRemove.name){
            //        children_to_remove.push(child);
            //     }
            // });

            // console.log(children_to_remove.length)
            
            // children_to_remove.forEach(function(group){
            //     console.log(group.children)
            //     scene.remove(group);
            // });


            // scene.remove( intersect.object );

            objects.splice( objects.indexOf( intersect.object ), 1 );

          }

          //test create a model

          // create cube

        } if ( event.button == 0 ) {
      

          /// model ///
          this.voxel = new THREE.Mesh( this.cubeGeo, this.new_mtl.material );
          
          if (this.new_mtl.label == "roof") {
            this.voxelR = this.cRoof.clone();
          } else if (this.new_mtl.label == "room") {
            this.voxelR = this.cRoom.clone();
          } else if (this.new_mtl.label == "bamboo") {
            this.voxelR = this.cBamboo.clone();
          } else if (this.new_mtl.label == "stairs") {
            this.voxelR = this.cStairs.clone();
          } else if (this.new_mtl.label == "connector") {
            this.voxelR = this.cConnector.clone();
          } else {
            this.voxelR = this.cRoom.clone();
          }
          
          console.log(this.new_mtl.label)

          this.voxelR.position.copy( intersect.point ).add( intersect.face.normal );
          this.voxelR.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );
          this.voxelR.position.setY(this.voxelR.position.y - 2.5)
          this.voxelR.name = "test" + getRndInteger(1, 5000)

          scene.add(this.voxelR);
          objects.push(this.voxelR);

          console.log(objects)

          
          this.voxel.position.copy( intersect.point ).add( intersect.face.normal );
          this.voxel.position.divideScalar( 5 ).floor().multiplyScalar( 5 ).addScalar( 2.5 );
          // voxel.position.setY(-.1)
          if (this.voxel.position.y < 13) {
            scene.add(this.voxel);
            objects.push(this.voxel);
            
          }
          else {
            alert("Bamboo construction restricts to 3 storeys")
          }

          addBox(this.new_mtl.label)
          updateCount(event)

        } else {
          console.log("Press Mouse Button")
        }

        this.animate();

      }

      var data = {
        x: this.voxelR.position.x,
        y: this.voxelR.position.y,
        z: this.voxelR.position.z,
        idCube: i
    }
    // And send it to the server with 'Get positions' message
    socket.emit('Get positions', data)

    });

    document.addEventListener("keydown", event => {

      switch ( event.keyCode ) {

        case 16: isShiftDown = true; break;

      }

    })

    document.addEventListener("keyup", event => {

      switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;

      }

    })

  }

    animate(){

      controls.update()
      renderer.render(scene, camera);
    }

}

// Instantiate (call) a class (it will draw cube on a canvas when server is launched 1st time)
let newbox = new Cube()

socket.on('Redraw figure', (data)=>{
  // Recieve 'Redraw figure' message from server with data and move the cube according to the recieved data
  newbox.box.position.set(data.x, data.y, data.z)
})