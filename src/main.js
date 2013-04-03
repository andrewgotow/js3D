// create the canvas controller
controller = new CanvasController();

// initialize the camera
controller._projectionMatrix = perspectiveMatrix( 60.0, controller._canvas.width / controller._canvas.height, 1.0, 100.0 );

// make a little object.
var testObject = new GameObject();
testObject._vertices = model_teapot_vertices;
testObject._triangles = model_teapot_triangles;

testObject._position._y = -2;
testObject._position._z = 5;

// first call to update loop.
updateLoop();


function updateLoop () {
  // rotate our object.
  testObject._rotation = multiplyQuaternion( testObject._rotation, quaternionFromAngleAxis( 1, 0,1,0 ) );

  // draw
  controller.clearBuffers();
  controller.drawObject( testObject );

  setTimeout( "updateLoop()", 33);
}