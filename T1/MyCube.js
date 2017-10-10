/**
 * MyUnitCubeQuad
 * @constructor
 */
 function MyCube(scene, args, tex_scale_values) {
 	CGFobject.call(this, scene);
  	
  	this.minX = this.args[0];
  	this.minY = this.args[1];
  	this.minZ = this.args[2];
  	this.maxX = this.args[3];
  	this.maxY = this.args[4];
  	this.maxZ = this.args[5];
  	
 };

 MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
 MyUnitCubeQuad.prototype.constructor = MyUnitCubeQuad;

 MyUnitCubeQuad.prototype.display = function() {
 	
 	this.rectangle1 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle1.display();

 	this.rectangle2 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle2.display();

 	this.rectangle3 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle3.display();

 	this.rectangle4 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle4.display();

 	this.rectangle5 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle5.display();

 	this.rectangle6 = new MyRectangle(minX, minY, minZ, maxX, maxY, minZ);
 	this.rectangle6.display();	


 }

