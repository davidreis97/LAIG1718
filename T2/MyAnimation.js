/**
* MyAnimation
* @constructor
*/
function MyAnimation(scene) {
	this.scene = scene;
};

MyAnimation.prototype.constructor = MyAnimation;

MyAnimation.prototype.init = function() { //Initial Calculations
	throw new Error("Init is a abstract method!");
}

MyAnimation.prototype.update = function(currentTime) { //Initial Calculations
	throw new Error("Update is a abstract method!");
}
