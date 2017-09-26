/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.graph = graph;

    this.type = null;
    this.args = null;
}

MyGraphLeaf.prototype.setTypeArgs = function(type,args) {
    this.type = type;
    this.args = args;
    console.log("Type: " + this.type + " Args: " + this.args);
}

