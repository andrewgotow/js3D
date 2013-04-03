function CanvasController() {
  this._canvas = document.getElementById("mainCanvas");
  this._context = this._canvas.getContext("2d");

  this._bufferWidth = 256;
  this._bufferHeight = 256;
  this._depthBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );
  this._colorBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );

  this._projectionMatrix = new Matrix();

  // Ensure that we've properly initialized the canvas.
  if ( this._canvas == null )
    alert( "ERROR: Canvas element could not be found." );
  if ( this._context == null )
    alert( "ERROR: Canvas context could not be initialized." );


  CanvasController.prototype.writePixel = function( scrnX, scrnY, depth, color ) {
    // Only write the red channel of the depth buffer... we don't need the rest.
    this._depthBuffer.data[ (scrnY * this._bufferWidth + scrnX) * 4 ] = depth;

    // now writ the color buffer.
    this._colorBuffer.data[ (scrnY * this._bufferWidth + scrnX) * 4 + 0 ] = color._r;
    this._colorBuffer.data[ (scrnY * this._bufferWidth + scrnX) * 4 + 1 ] = color._g;
    this._colorBuffer.data[ (scrnY * this._bufferWidth + scrnX) * 4 + 2 ] = color._b;
  };

  CanvasController.prototype.clearBuffers = function() {
    // doesn't do anything yet.
    this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );
  };

  CanvasController.prototype.refreshCanvas = function () {
    //this._canvas.putImageData( this._colorBuffer, 0, 0 );
   // this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );

  };

  CanvasController.prototype.drawObject = function ( gameObject ) {
    var mvpMat = multiplyMatrix( gameObject.getTransform(), this._projectionMatrix );

    // for each triangle in the gameObject
    for ( var t = 0; t < gameObject._triangles.length/3; t ++ ) {
      var indexA = gameObject._triangles[t*3+0];
      var indexB = gameObject._triangles[t*3+1];
      var indexC = gameObject._triangles[t*3+2];

      // get the vertex positions.
      // var Ax = gameObject._vertices[ indexA*3 + 0 ];
      // var Ay = gameObject._vertices[ indexA*3 + 1 ];
      // var Az = gameObject._vertices[ indexA*3 + 2 ];
      var A = new Vector();
      A.set( gameObject._vertices[ indexA*3 + 0 ], gameObject._vertices[ indexA*3 + 1 ], gameObject._vertices[ indexA*3 + 2 ] );

      var B = new Vector();
      B.set( gameObject._vertices[ indexB*3 + 0 ], gameObject._vertices[ indexB*3 + 1 ], gameObject._vertices[ indexB*3 + 2 ] );
     
      var C = new Vector();
      C.set( gameObject._vertices[ indexC*3 + 0 ], gameObject._vertices[ indexC*3 + 1 ], gameObject._vertices[ indexC*3 + 2 ] );
     
      var color = new Vector();
      color.set( gameObject._colors[ t*4 + 0 ], gameObject._colors[ t*4 + 1 ], gameObject._colors[ t*4 + 2 ] );

      // Make the draw call.
      this.drawTriangle( this._colorBuffer, mvpMat, A, B, C, color );
    }
  };

  CanvasController.prototype.viewportToScreen = function ( vec ) {
    var result = new Vector();
    var halfWidth = this._canvas.width / 2.0;
    var halfHeight = this._canvas.height / 2.0;

    result._x = (vec._x * halfWidth) + halfWidth;
    result._y = (vec._y * halfHeight) + halfHeight;
    result._z = vec._z;
    return result;
  };

CanvasController.prototype.drawTriangle = function ( buffer, mvpMat, vertA, vertB, vertC, color ) {
    //debugger
    var vA = mvpMat.transformVector( vertA );
    var vB = mvpMat.transformVector( vertB );
    var vC = mvpMat.transformVector( vertC );

    // Homogenous coordinates must be scaled by internal W component in order for perspective to make sense... See this page... http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
    vA.scale( 1/vA._w );
    vB.scale( 1/vB._w );
    vC.scale( 1/vC._w );


    var sA = this.viewportToScreen( vA );
    var sB = this.viewportToScreen( vB );
    var sC = this.viewportToScreen( vC );

    /*
    // NOTE, THIS FUNCITON DOES NOT YET USE THE BUFFERS, BUT DRAWS DIRECTLY TO THE CANVAS.
    // We can draw a gradient for each vertex interpolation... soo... interesting!
    var aGradient = this._context.createLinearGradient( sA._x, sA._y, sB._x, sB._y );
    aGradient.addColorStop(0.0, "rgba(255,0,0,1)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");
    aGradient.addColorStop(1.0, "rgba(0,255,0,1)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");
    
    var bGradient = this._context.createLinearGradient( sB._x, sB._y, sC._x, sC._y );
    aGradient.addColorStop(0.0, "rgba(0,255,0,1)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");
    aGradient.addColorStop(1.0, "rgba(0,0,255,0)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");

    var cGradient = this._context.createLinearGradient( sC._x, sC._y, sA._x, sA._y );
    aGradient.addColorStop(0.0, "rgba(0,0,255,1)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");
    aGradient.addColorStop(1.0, "rgba(255,0,0,0)");//"rgba("+colorA._x+","+colorA._y+","+colorA._z+",1)");

    // A-B color.
    this._context.fillStyle = aGradient;
    */
    //this._context.fillStyle = "rgba(" + color._x * 255 + "," + color._y * 255 + "," + color._z * 255 + ",1)" ;
    this._context.beginPath();
    this._context.moveTo( sA._x, sA._y );
    this._context.lineTo( sB._x, sB._y );
    this._context.lineTo( sC._x, sC._y );
    this._context.stroke(); // fill();

  };

/* OLD IMPLEMENTATION DRAWS DIRECTLY TO CONTEXT. NEW ONE DRAWS TO BUFFERS.
  CanvasController.prototype.drawTriangle = function ( buffer, mvpMat, vertA, vertB, vertC ) {
    //debugger
    var vA = mvpMat.transformVector( vertA );
    var vB = mvpMat.transformVector( vertB );
    var vC = mvpMat.transformVector( vertC );

    // Homogenous coordinates must be scaled by internal W component in order for perspective to make sense... See this page... http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
    vA.scale( 1/vA._w );
    vB.scale( 1/vB._w );
    vC.scale( 1/vC._w );


    var sA = this.viewportToScreen( vA );
    var sB = this.viewportToScreen( vB );
    var sC = this.viewportToScreen( vC );

    // NOTE, THIS FUNCITON DOES NOT YET USE THE BUFFERS, BUT DRAWS DIRECTLY TO THE CANVAS.
    this._context.beginPath();
    this._context.moveTo( sA._x, sA._y );
    this._context.lineTo( sB._x, sB._y );
    this._context.lineTo( sC._x, sC._y );
    this._context.fill();

  };
  */

  //CanvasController.prototype.

};