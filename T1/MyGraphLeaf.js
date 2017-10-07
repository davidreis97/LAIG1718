/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem, scene, type, args) {
    this.graph = graph;

    this.scene = scene;
    this.type = type;
    this.args = args;
}


MyGraphLeaf.prototype.display = function(){
	switch(this.type){
		case "triangle":
			var triangle = new MyTriangle(this.scene,this.args[0],this.args[1],this.args[2],this.args[3],this.args[4],this.args[5],this.args[6],this.args[7],this.args[8]);
			triangle.display();
			break;
		case "rectangle":
			var rectangle = new MyRectangle(this.scene,this.args[0],this.args[1],this.args[2],this.args[3]);
			rectangle.display();
			break;
		case "cylinder":
			var cylinder = new MyCylinder(this.scene, this.args);
			cylinder.display();
			break;
		case "sphere":
			var sphere = new MySphere(this.scene,this.args[0],this.args[1],this.args[2]);
			sphere.display();
			break;
		default:
			break;
	}
}

