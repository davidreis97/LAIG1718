/**
* MyLinearAnimation
* @constructor
*/
function MyLinearAnimation(ctrl_points, speed) {
	this.ctrl_points = ctrl_points;
	this.speed = speed;

	this.ANG_TO_RAD = Math.PI/180;

	this.distances;
	this.durations;

	this.previousTime;
	this.totalTime;

	this.finished;
	this.finalAngle;

	this.init();
};

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyAnimation;

MyLinearAnimation.prototype.interpolate = function(start,finish,t) {
	var x = 0;
	var y = 1;
	var z = 2;

	var point = [];

	point[x] = start[x] + ((finish[x] - start[x]) * t);
	point[y] = start[y] + ((finish[y] - start[y]) * t);
	point[z] = start[z] + ((finish[z] - start[z]) * t);

	return point;
}

MyLinearAnimation.prototype.init = function() { //Initial Calculations
	var x = 0;
	var y = 1;
	var z = 2;

	this.transformMatrix = mat4.create();

	this.distances = [];
	this.durations = [];

	this.finished = false;

	var totalTime = 0;

	for(var i = 0; i + 1 < this.ctrl_points.length; i++){
		this.distances.push(Math.sqrt(Math.pow(this.ctrl_points[i + 1][x] - this.ctrl_points[i][x],2) + Math.pow(this.ctrl_points[i + 1][y] - this.ctrl_points[i][y],2) + Math.pow(this.ctrl_points[i + 1][z] - this.ctrl_points[i][z],2)));
		totalTime += (this.distances[i]/this.speed) * 1000;
		this.durations.push(totalTime);
	}

	this.previousTime = 0;
	this.totalTime = 0;
}

MyLinearAnimation.prototype.update = function(currentTime) {
	this.transformMatrix = mat4.create();

	if(this.previousTime == 0){
		this.previousTime = currentTime;
	}else if(!this.finished){
		var delta = currentTime - this.previousTime;
		this.previousTime = currentTime;
		this.totalTime += delta;

		var start = null;
		var finish;
		var t;

		for(var i = 0; i < this.durations.length; i++){
			if (this.totalTime < this.durations[i]){
				var start = this.ctrl_points[i];
				var finish = this.ctrl_points[i+1];

				if (i == 0){
					t = this.totalTime/this.durations[i];
				}else{
					t = (this.totalTime-this.durations[i-1])/(this.durations[i]-this.durations[i-1]);
				}

				break;
			}
		}

		if(start == null){
			this.finished = true;
			var point = this.ctrl_points[this.ctrl_points.length - 1]
			mat4.translate(this.transformMatrix, this.transformMatrix, [point[0],point[1],point[2]]);
			mat4.rotateY(this.transformMatrix, this.transformMatrix, this.finalAngle);

			return;
		}

		var point = this.interpolate(start,finish,t); 

		var angle = Math.atan2(start[0] - finish[0], start[2] - finish[2]); //TODO - Double check if correct value. TODO - Move to init and create array to avoid calculations on every loop
		this.finalAngle = angle; 
		
		mat4.translate(this.transformMatrix, this.transformMatrix, [point[0],point[1],point[2]]);
		mat4.rotateY(this.transformMatrix, this.transformMatrix, angle);

	}else{
		var point = this.ctrl_points[this.ctrl_points.length - 1]
		mat4.translate(this.transformMatrix, this.transformMatrix, [point[0],point[1],point[2]]);
		mat4.rotateY(this.transformMatrix, this.transformMatrix, this.finalAngle);
	}

	return;
}
