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
	if (!this.finished){
		for (var index = 0; index < this.animations.length; index++) {
			if(!this.animations[index].finished) {
				this.animations[index].update(currentTime);
				if (!isIdentity(this.animations[index].transformMatrix)){
					this.transformMatrix = this.animations[index].transformMatrix;
				}	
				break;
			}
			this.transformMatrix = this.animations[index].transformMatrix;
		}

		if (index == this.animations.length) {
			this.finished = true;
		}
	}
	
}

function isIdentity(a) {
	return (a[0] == 1 && a[1] == 0 && a[2] == 0 && a[3] == 0 &&
			a[4] == 0 && a[5] == 1 && a[6] == 0 && a[7] == 0 &&
			a[8] == 0 && a[9] == 0 && a[10] == 1 && a[11] == 0 &&
			a[12] == 0 && a[13] == 0 && a[14] == 0 && a[15] == 1);
}