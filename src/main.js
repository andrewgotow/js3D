// create the canvas controller
controller = new CanvasController();

// initialize the camera
controller._projectionMatrix = perspectiveMatrix( 60.0, controller._canvas.width / controller._canvas.height, controller._cameraNearClip, controller._cameraFarClip );

// make a little object.
var testObject = new GameObject();
testObject._vertices = model_head_vertices;
testObject._triangles = model_head_triangles;
testObject.calculateNormals();

//testObject._position._y = -2;
testObject._position._z = 1;

// first call to update loop.
updateLoop();


function updateLoop () {
  // rotate our object.
  testObject._rotation = multiplyQuaternion( testObject._rotation, quaternionFromAngleAxis( 1, 0,1,0 ) );

  // draw
  controller.clearBuffers();
  controller.drawObject( testObject );
  controller.refreshCanvas();

  setTimeout( "updateLoop()", 16 );//33);
}