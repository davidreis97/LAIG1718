/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem, scene, type, args) {
    this.graph = graph;

    this.primitive;

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
		case "cube":
			this.primitive =  new MyCube(this.scene, this.args);
			break;
		case "patch":
			this.primitive = new MyPatch(this.scene, this.args);
			break;
		default:
			break;
	}
}


MyGraphLeaf.prototype.display = function(tex_scale_factor){
	try{
		this.primitive.setTexScaleFactor(tex_scale_factor);
	}catch (e){
		//No problem, primitive has no texScaleFactor
	}

	try{
		this.primitive.display();

	}catch (e){
		console.log(this.primitive);
	}
}

