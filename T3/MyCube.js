/**
 * MyCube
 * @constructor
 */

function MyCube(scene, args) {
    CGFobject.call(this, scene);

    this.width = args[0]; //x
    this.height = args[1]; //y
    this.depth = args[2]; //z

    this.rectangles = [null,null,null,null,null,null];

    this.initBuffers();
};

MyCube.prototype = Object.create(CGFobject.prototype);
MyCube.prototype.constructor = MyCube;

MyCube.prototype.initBuffers = function () {
    this.rectangles[0] = new MyRectangle(this.scene,[-this.width/2,this.depth/2,this.width/2,-this.depth/2]); //Base
    this.rectangles[1] = new MyRectangle(this.scene,[-this.width/2,this.depth/2,this.width/2,-this.depth/2]); //Top
    this.rectangles[2] = new MyRectangle(this.scene,[-this.height/2,this.depth/2,this.height/2,-this.depth/2]); //Side 1
    this.rectangles[3] = new MyRectangle(this.scene,[-this.height/2,this.depth/2,this.height/2,-this.depth/2]); //Side 2
    this.rectangles[4] = new MyRectangle(this.scene,[-this.width/2,this.height/2,this.width/2,-this.height/2]); //Side 3
    this.rectangles[5] = new MyRectangle(this.scene,[-this.width/2,this.height/2,this.width/2,-this.height/2]); //Side 4
}

MyCube.prototype.setTexScale = function (tex_scale){
    for (var i = 0; i < this.rectangles.length; i++){
        this.rectangles[i].setTexScale(tex_scale);
    }
}

MyCube.prototype.display = function (){
    this.scene.pushMatrix();
        this.scene.translate(0,-this.height/2,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.rectangles[0].display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.translate(0,this.height/2,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.rectangles[0].display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.translate(this.width/2,0,0);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.rectangles[2].display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.translate(-this.width/2,0,0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.rectangles[3].display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.translate(0,0,this.depth/2);
        this.rectangles[4].display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,0,-this.depth/2);
        this.scene.rotate(-Math.PI,1,0,0);
        this.rectangles[5].display();
    this.scene.popMatrix();
}


