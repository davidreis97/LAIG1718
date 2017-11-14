/**
 * MyAnimationFactory class, representing a leaf in the scene graph.
 * @constructor
**/

function MyAnimationFactory(graph) {
	this.graph = graph;
}

MyAnimationFactory.prototype.generateAnim = function(args){
	var anim = null;

	console.log(args);

	switch(args[0]){
		case "linear":
			anim = new MyLinearAnimation(args[1],args[2]);
			break;
		case "circular":
			anim = new MyCircularAnimation(args[1],args[2]);
			break;
		case "bezier":
			anim = new MyBezierAnimation(args[1],args[2]);
			break;
		case "combo":
			{
				var animRefs = args[1];
				var anims = [];
				for(var i = 0; i < animRefs.length; i++){
					anims.push(this.generateAnim(this.graph.animations[animRefs[i]]));
				}
				anim = new MyComboAnimation(anims);
				break;
			}
		default:
			console.error("Unknown anim type in animation factory '" + args[0] + "'");
			break;
	}

	return anim;
}

