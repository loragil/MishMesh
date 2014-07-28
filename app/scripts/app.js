'use strict'
var MishMesh = MishMesh || {};

MishMesh.Scene = function(params){
	this.container = document.querySelector(params.container);

	this.camera = null;
	this.scene = null;
	this.renderer = null; 
  	this.geometry = null;
 	this.material = null;
 	this.mesh = null;

 	this.init();
 	this.animate();
};

MishMesh.Scene.prototype = {
	init: function () {
		'use strict'

	    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000);
	    this.camera.position.z = 1000;

	    this.scene = new THREE.Scene();

	    this.geometry = new THREE.BoxGeometry(200, 200, 200);
	    this.material = new THREE.MeshBasicMaterial({
	        color: 0xff0000,
	        wireframe: true
	    });

	    this.mesh = new THREE.Mesh(this.geometry, this.material);
	    this.scene.add(this.mesh);	   	   
    
	    //detect webGL support
	    var webgl = ( function () { 
	      try { 
	        return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
	      } catch( e ) {
	        return false; 
	      } 
	    })();

    	this.renderer = webgl ? new THREE.WebGLRenderer({antialias:true}) : new THREE.CanvasRenderer();
	    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

	    this.container.appendChild(this.renderer.domElement);
	},

	animate: function() {
		'use strict'

	    // note: three.js includes requestAnimationFrame shim
	    requestAnimationFrame(MishMesh.Scene.prototype.animate);

	    this.mesh.rotation.x += 0.01;
	    this.mesh.rotation.y += 0.02;

	    this.renderer.render(this.scene, this.camera);

	}
}

MishMesh.start = function () {
	var stage,
		params = {
			container:'body'
		};

	//var stage = new MishMesh.Scene(params);
	MishMesh.Scene(params);
};

MishMesh.start();