/**
* MyComboAnimation
* @constructor
*/
function MyComboAnimation(animations) {
	this.animations = animations;

	this.currentAnimation;

	this.transformMatrix;

	this.init();
};

MyComboAnimation.prototype = Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyAnimation;

MyComboAnimation.prototype.init = function() { //Initial Calculations
	this.finished = false;

	this.transformMatrix = mat4.create();

	this.currentAnimation = 0;
}

MyComboAnimation.prototype.update = function(currentTime) {
	this.transformMatrix = mat4.create();
	
	if(!this.finished){
		var anim = this.animations[this.currentAnimation];
		if (anim.finished){
			this.currentAnimation++;
			if(this.currentAnimation >= this.animations.length){
				this.finished = true;
				return;
			}else{
				this.update(currentTime);
			}
		}else{
			anim.update(currentTime);
			this.transformMatrix = anim.transformMatrix;
		}
	}
	
}
