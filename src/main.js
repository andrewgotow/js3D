//==============================================================================
/*
  https://github.com/andrewgotow/js3D

  Copyright (C) 2013, Andrew Gotow <andrewgotow@gmail.com>

  License: The MIT License (http://www.opensource.org/licenses/mit-license.php)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
//==============================================================================

// create the canvas controller
controller = new CanvasController();

// initialize the camera
controller._projectionMatrix = perspectiveMatrix( 60.0, controller._canvas.width / controller._canvas.height, controller._cameraNearClip, controller._cameraFarClip );

// make a little object.
var testObject = new js3DObject();
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