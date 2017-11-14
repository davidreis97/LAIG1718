/**
* MyComboAnimation
* @constructor
*/
function MyComboAnimation(scene, animationIds) {
	MyAnimation.call(this,scene);
	this.scene = scene;
	
	this.animationIds = animationIds;

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
		var anim = this.scene.graph.animations[this.animationIds[this.currentAnimation]];
		if (anim.finished){
			this.currentAnimation++;
			if(this.currentAnimation >= this.animationIds.length){
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
