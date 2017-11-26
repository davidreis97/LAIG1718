/**
* MyCircularAnimation
* @constructor
*/
function MyCircularAnimation(args, speed) {	
	var ANG_TO_RAD = Math.PI/180;

	this.centerX = args[0];
	this.centerY = args[1];
	this.centerZ = args[2];
	this.radius = args[3];
	this.startAng = args[4] * ANG_TO_RAD;
	this.rotAng = args[5] * ANG_TO_RAD;

	this.speed = speed;
	
	this.previousTime;

	this.init();
};

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyAnimation;

MyCircularAnimation.prototype.init = function() { //Initial Calculations
	this.previousTime = 0;
	this.delta = 0;

	this.transformMatrix = mat4.create();

	this.finished = false;

	this.angSpeed = this.speed / this.radius;
	this.maximumTime = this.rotAng * 1000 / this.angSpeed;
}

MyCircularAnimation.prototype.update = function(currentTime) {
	if(this.previousTime == 0){
		this.previousTime = currentTime;
	}else if(!this.finished){
		this.transformMatrix = mat4.create();

		this.delta += currentTime - this.previousTime;
		this.previousTime = currentTime;

		var angle = this.startAng + this.angSpeed * (this.delta/1000);

		if(angle > this.rotAng){
			this.finished = true;
			angle = this.rotAng;
		}

		mat4.translate(this.transformMatrix,this.transformMatrix,[this.centerX,this.centerY,this.centerZ]);
		mat4.rotateY(this.transformMatrix, this.transformMatrix, this.startAng + angle);
		mat4.translate(this.transformMatrix,this.transformMatrix,[this.radius,0,0]);
	}

	return;
}
