var dataRollx = 0;
var dataRolly = 0;
var dataRollz = 0;
var dataRollxArray = [];
var dataRollyArray = [];
var dataRollzArray = [];
var accuracy = 2;
var container;
var camera, scene, renderer;
var cube, plane;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// Connect to socket.io:
var io = io();
var socket = io.connect("http://localhost:3000");

console.log("socket connected to: ");

// Read IMU data:
socketClient();

// Initialize three.js:
init();

// Enter animation loop:
animate();

/* Description of data package:
 *
 *
 *  (ts, roll_x, roll_y, roll_z, lin_x, lin_y, lin_z, deg_, deg_, deg_)
 *
 *
 */




function socketClient() {
        socket.on('imu_update', function(data) {
            //if (data.charAt(0) === 'O') 
            {
                var dataArray = data.toString('utf8').split(/, /);

                // set x
                dataRollx = dataArray[1];

                // set y
                dataRolly = dataArray[2];
                
                // set z
                //.toFixed(accuracy);
                dataRollz = dataArray[3];

                console.log(dataRollx + ", " + dataRolly + ", " + dataRollz);
            }
        });
}


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'IMU Visualizer';
    info.setAttribute('id', 'pourHeading');
    container.appendChild( info );

    $("#pourHeading").append("<div id='subHeading'></div>");

    // Set up camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;

    scene = new THREE.Scene();

    // Create cube
    var geometry = new THREE.BoxGeometry( 200, 50, 200 );

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.y = 150;
    scene.add(cube);

    // Create background plane
    var geometry = new THREE.PlaneBufferGeometry( 400, 200 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
    plane = new THREE.Mesh( geometry, material );
    scene.add(plane);


    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize( window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth/2.;
    windowHalfY = window.innerHeight/2.;

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    cube.rotation.x = -dataRollx;
    cube.rotation.y = -dataRollz;
    cube.rotation.z = -dataRolly;

    renderer.render(scene, camera);
}
