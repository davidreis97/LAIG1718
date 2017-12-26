/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem, scene, type, args) {
    this.graph = graph;

    this.scene = scene;
    this.type = type;
	this.args = args;

	var tex_scale_factor = [1,1];

	switch(this.type){
		case "triangle":
			this.primitive = new MyTriangle(this.scene,this.args);
			break;
		case "rectangle":
			this.primitive =  new MyRectangle(this.scene,this.args);
			break;
		case "cylinder":
			this.primitive = new MyCylinder(this.scene, this.args);
			break;
		case "sphere":
			this.primitive =  new MySphere(this.scene,this.args);
			break;
		case "patch":
			this.primitive = new MyPatch(this.scene, this.args);
			break;
		case "tabuleiro":
			this.primitive = new MyTabuleiro(this.scene, this.args);
			break;
		default:
			break;
	}
}


MyGraphLeaf.prototype.display = function(tex_scale_factor){
	if(this.type == "triangle" || this.type == "rectangle"){
		this.primitive.setTexScale(tex_scale_factor);
	}
	
	if(!this.scene.pickMode || this.type == "tabuleiro"){
		this.primitive.display();
	}
}

MyGraphLeaf.prototype.updateAnim = function (currTime){
	if (this.type == "tabuleiro"){
		this.primitive.updateAnim(currTime)
	}
}

