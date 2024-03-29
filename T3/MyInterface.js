 /**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor 
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * Initializes the interface.
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui
    
    this.gui = new dat.GUI();

    // add a group of controls (and open/expand by defult)
    
    return true;
};

MyInterface.prototype.addSelectables = function() {
    this.gui.add(this.scene, 'selectedNodeID', this.scene.graph.selectableNodes).name('Selectables');

    /*
    obj=this;
    this.gui.add(this.scene, 'wireframe').onChange(function(v)
        { obj.scene.updateWireframe(v)  });

    this.gui.add(this.scene, 'scaleFactor',-50,50).onChange(function(v)
    {
        obj.scene.updateScaleFactor(v);
    });
    */
};

MyInterface.prototype.addSceneries = function() {
    this.gui.add(this.scene, 'selectedScenery', this.scene.graph.sceneries).name('Sceneries');
};

/**
 * Adds a folder containing the IDs of the lights passed as parameter.
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    
    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }
};

MyInterface.prototype.addGameGroup = function(lights) {

    var group = this.gui.addFolder("Game Settings");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    group.add(this.scene, 'whitePlayer', this.scene.playerModes).name('White Player');
    group.add(this.scene, 'blackPlayer', this.scene.playerModes).name('Black Player');

    group.add(this.scene, 'fixedCamera').name('Fixed Camera');

    group.add(this.scene, 'timeLeft', 0, MAX_TIME_LEFT).step(1).name('Time Left').listen();
    group.add(this.scene, 'whiteScore').name('White Score').listen();
    group.add(this.scene, 'blackScore').name('Black Score').listen();

    var group1 = this.gui.addFolder("Debug");

    group1.add(this.scene, 'debug').name('Bound. Boxs.');
};



