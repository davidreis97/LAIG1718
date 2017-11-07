/**
 * MyUnitCubeQuad
 * @constructor
 */
 function MyCube(scene, args) {
 	CGFobject.call(this, scene);

 	this.scene = scene;
  	
  	this.minX = args[0];
  	this.minY = args[1];
  	this.minZ = args[2];
  	this.maxX = args[3];
  	this.maxY = args[4];
  	this.maxZ = args[5];

  	this.rectangle1 = new MyRectangle(this.scene, [this.maxX, this.maxY, this.minZ, this.minX, this.minY, this.minZ]);
  	this.rectangle2 = new MyRectangle(this.scene, [this.minX, this.minY, this.minZ, this.maxX, this.minY, this.maxZ]);
  	this.rectangle3 = new MyRectangle(this.scene, [this.minX, this.minY, this.minZ, this.minX, this.maxY, this.maxZ]);
  	this.rectangle4 = new MyRectangle(this.scene, [this.maxX, this.minY, this.maxZ, this.maxX, this.maxY, this.minZ]);
  	this.rectangle5 = new MyRectangle(this.scene, [this.minX, this.maxY, this.minZ, this.maxX, this.maxY, this.maxZ]);
  	this.rectangle6 = new MyRectangle(this.scene, [this.minX, this.minY, this.maxZ, this.maxX, this.maxY, this.maxZ]);
  	
 };

 MyCube.prototype = Object.create(CGFobject.prototype);
 MyCube.prototype.constructor = MyCube;

 MyCube.prototype.display = function() {

 	this.scene.pushMatrix();
	 	this.scene.rotate(Math.PI, 1, 0, 0);
	 	this.scene.translate(0, -this.maxY, 0);
	 	this.rectangle1.display();
 	this.scene.popMatrix();

	this.rectangle2.display();
 	
 	this.scene.pushMatrix();
	 	this.scene.rotate(Math.PI, 0, 0, 1);
	 	this.scene.translate(0, -this.maxY, 0);
 		this.rectangle3.display();
 	this.scene.popMatrix();

	this.scene.pushMatrix();
	 	this.scene.rotate(Math.PI, 0, 0, 1);
	 	this.scene.translate(-2 * this.maxX, -this.maxY, 0);
	 	this.rectangle4.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	 	this.scene.rotate(Math.PI, 0, 0, 1);
	 	this.scene.translate(-this.maxX, -2 * this.maxY, 0);
	 	this.rectangle5.display();
	this.scene.popMatrix();

 	this.scene.pushMatrix();
	 	this.rectangle6.display();	
 	this.scene.popMatrix();
 }

 MyCube.prototype.setTexScale = function (tex_scale_values) {
 	this.rectangle1.setTexScale(tex_scale_values);
 	this.rectangle2.setTexScale(tex_scale_values);
 	this.rectangle3.setTexScale(tex_scale_values);
 	this.rectangle4.setTexScale(tex_scale_values);
 	this.rectangle5.setTexScale(tex_scale_values);
 	this.rectangle6.setTexScale(tex_scale_values);
 }

