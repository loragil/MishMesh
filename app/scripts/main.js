'use strict'

var MishMesh = MishMesh || {};


MishMesh.params = {
	container:'body',
	color:'#b19b6d'
};

MishMesh.master = {
	container: document.querySelector(MishMesh.params.container),
	controls: null,
	camera: null,
	scene: null,
	renderer: null, 
	geometry: null,
	material: null,
	mesh: null
};

MishMesh.init = function () {
	MishMesh.master.camera = new THREE.PerspectiveCamera(75, MishMesh.master.container.clientWidth / MishMesh.master.container.clientHeight, 1, 10000);
	MishMesh.master.camera.position.z = 1000;

	MishMesh.master.controls = new THREE.TrackballControls( MishMesh.master.camera );
	MishMesh.master.controls.noPan = true;
	MishMesh.master.controls.addEventListener( 'change', MishMesh.render );

	MishMesh.master.scene = new THREE.Scene();	   	

 	// Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    MishMesh.master.scene.add(light);

	var ambientLight = new THREE.AmbientLight(0x101010, 1.0);
  	MishMesh.master.scene.add(ambientLight);

    //detect webGL support
    var webgl = ( function () { 
    	try { 
    		return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
    	} catch( e ) {
    		return false; 
    	} 
    })();

    MishMesh.master.renderer = webgl ? 
							    new THREE.WebGLRenderer({antialias:true, alpha: true}) : 
							    new THREE.CanvasRenderer({alpha: true});
    MishMesh.master.renderer.setClearColor(0x000000, 0);
    MishMesh.master.renderer.setSize(MishMesh.master.container.clientWidth, MishMesh.master.container.clientHeight);

    MishMesh.master.container.appendChild(MishMesh.master.renderer.domElement);

    // handle window resize events
    var winResize	= new THREEx.WindowResize(MishMesh.master.renderer, MishMesh.master.camera);
};

MishMesh.render = function () {		
	/*
	MishMesh.master.mesh.rotation.x += 0.01;
	MishMesh.master.mesh.rotation.y += 0.02;
	*/

	MishMesh.master.renderer.render(MishMesh.master.scene, MishMesh.master.camera);
};

MishMesh.animate = function () {
	MishMesh.master.controls.update();
	MishMesh.render();	
	requestAnimationFrame(MishMesh.animate);
};

MishMesh.handleFiles = function(files) {
	console.log('files loaded', files);
	var objectURL = window.URL.createObjectURL(files[0]);

	var loader = new THREE.JSONLoader();
	loader.load(objectURL, function (geometry, material) {
		MishMesh.master.geometry = geometry;
		MishMesh.master.geometry.dynamic  = true;// ?
		//MishMesh.master.geometry.dirty  = true;// ?
		//MishMesh.master.geometry.overdraw  = true;// ?
		MishMesh.master.material = material;
		
		MishMesh.loadModel();

        MishMesh.animate();
    });

    //need to explicitly clear objectURL from memory
	window.URL.revokeObjectURL(objectURL);
};

MishMesh.loadModel = function () {
	//var object3d = new THREE.Object3D();
	if(MishMesh.master.scene.children.length){
		for (var i = 0; i < MishMesh.master.scene.children.length; i++) {
			MishMesh.master.scene.remove(MishMesh.master.scene.children[i]);
		};
	}

	MishMesh.master.material.vertexColors =  THREE.VertexColors;
	//MishMesh.master.material.vertexColors =  THREE.FaceColors;
	MishMesh.master.mesh = new THREE.Mesh(
		MishMesh.master.geometry, 
		new THREE.MeshFaceMaterial(MishMesh.master.material)
		);
	//object3d.add(MishMesh.master.mesh);
	MishMesh.master.scene.add(MishMesh.master.mesh);	
};

MishMesh.toggleWireframe = function (toggledTo) {
	//TODO: change loop to array.map ?
	for (var i = 0; i < MishMesh.master.material.length; i++) {
		MishMesh.master.material[i].wireframe = toggledTo;
	};
};

MishMesh.setModelColor = function (color) {
	color = color.replace('#', '0x');
	//MishMesh.master.material[0].color.setHex( color);
	//TODO: change loop to array.map ?
	for (var i = 0; i < MishMesh.master.mesh.geometry.vertices.length; i++) {
		MishMesh.master.mesh.geometry.faces[i].color.setHex( color);
	};

	/*for (var i = 0; i < MishMesh.master.material.length; i++) {
		MishMesh.master.material[i].color.setHex( color);
	};*/
	MishMesh.master.geometry.colorsNeedUpdate = true;
	//MishMesh.master.geometry.colorsNeedUpdate = true;
	MishMesh.master.mesh.geometry.__dirtyColors = true;
	MishMesh.master.mesh.geometry.__dirtyVertices = true;
}

//kickstart app
MishMesh.init();
//MishMesh.animate();

