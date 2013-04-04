function CanvasController() {
  this._canvas = document.getElementById("mainCanvas");
  this._context = this._canvas.getContext("2d");

  this._bufferWidth = this._canvas.width;
  this._bufferHeight = this._canvas.height;

  // Depth buffer values are reversed. Zero is the far clip plane, and 255 is the near clip plane.
  this._depthBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );
  this._colorBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );

  this._cameraNearClip = 1;
  this._cameraFarClip = 100;

  this._projectionMatrix = new Matrix();

  // Ensure that we've properly initialized the canvas.
  if ( this._canvas == null )
    alert( "ERROR: Canvas element could not be found." );
  if ( this._context == null )
    alert( "ERROR: Canvas context could not be initialized." );


  CanvasController.prototype.writePixel = function( scrnX, scrnY, depth, red, green, blue ) {
    scrnX = Math.round( scrnX );
    scrnY = Math.round( scrnY );
    var pixelInset = (scrnY * this._colorBuffer.width + scrnX) * 4;

    var depthBuffVal = depth / this._cameraFarClip * 255;

    // Depth test
    if ( this._depthBuffer.data[ pixelInset + 0 ] < depthBuffVal ) {
      // Only write the red channel of the depth buffer... we don't need the rest.
      this._depthBuffer.data[ pixelInset + 0 ] = depthBuffVal;//((this._cameraFarClip-depth) / this._cameraFarClip) * 255;
      // now write the color buffer.
      this._colorBuffer.data[ pixelInset + 0 ] = red;
      this._colorBuffer.data[ pixelInset + 1 ] = green;
      this._colorBuffer.data[ pixelInset + 2 ] = blue;
      this._colorBuffer.data[ pixelInset + 3 ] = 255;
    }
  };

  CanvasController.prototype.clearBuffers = function() {
    //Easiest way to clear the buffer, is just to wipe everything and realloc.
    this._depthBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );
    this._colorBuffer = this._context.createImageData( this._bufferWidth, this._bufferHeight );
    //this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );
  };

  CanvasController.prototype.refreshCanvas = function () {
    this._context.putImageData( this._colorBuffer, 0, 0 );
  };

  CanvasController.prototype.drawObject = function ( gameObject ) {
    var normalMat = gameObject.getNormalMatrix();
    var modelviewMat = gameObject.getTransform();
    var modelviewProjectionMat = multiplyMatrix( modelviewMat, this._projectionMatrix );

    // for each triangle in the gameObject
    for ( var t = 0; t < gameObject._triangles.length/3; t ++ ) {
      var indexA = gameObject._triangles[t*3+0];
      var indexB = gameObject._triangles[t*3+1];
      var indexC = gameObject._triangles[t*3+2];

      var A = new Vector();
      A.set( gameObject._vertices[ indexA*3 + 0 ], gameObject._vertices[ indexA*3 + 1 ], gameObject._vertices[ indexA*3 + 2 ] );

      var B = new Vector();
      B.set( gameObject._vertices[ indexB*3 + 0 ], gameObject._vertices[ indexB*3 + 1 ], gameObject._vertices[ indexB*3 + 2 ] );
     
      var C = new Vector();
      C.set( gameObject._vertices[ indexC*3 + 0 ], gameObject._vertices[ indexC*3 + 1 ], gameObject._vertices[ indexC*3 + 2 ] );
     
      var NormalA = new Vector();
      NormalA.set( gameObject._normals[ indexA*3 + 0 ], gameObject._normals[ indexA*3 + 1 ], gameObject._normals[ indexA*3 + 2 ] );
      var NormalB = new Vector();
      NormalB.set( gameObject._normals[ indexB*3 + 0 ], gameObject._normals[ indexB*3 + 1 ], gameObject._normals[ indexB*3 + 2 ] );
      var NormalC = new Vector();
      NormalC.set( gameObject._normals[ indexC*3 + 0 ], gameObject._normals[ indexC*3 + 1 ], gameObject._normals[ indexC*3 + 2 ] );


      var color = new Vector();
      color.set( 255, 0, 0 );
      //color.set( gameObject._colors[ t*4 + 0 ], gameObject._colors[ t*4 + 1 ], gameObject._colors[ t*4 + 2 ] );

      // Make the draw call.
      this.drawTriangle( modelviewProjectionMat, normalMat, A, B, C, NormalA, NormalB, NormalC, color );
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

  CanvasController.prototype.drawTriangle = function ( mvpMat, nMat, vertA, vertB, vertC, normalA, normalB, normalC, color ) {
      //debugger
      var vA = mvpMat.transformVector( vertA );
      var vB = mvpMat.transformVector( vertB );
      var vC = mvpMat.transformVector( vertC );

      var nA = nMat.transformVector( normalA ).normalized();
      //var nB = mvMat.transformVector( normalB ).normalized();
      //var nC = mvMat.transformVector( normalC ).normalized();

      // Homogenous coordinates must be scaled by internal W component in order for perspective to make sense... See this page... http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/
      vA.scale( 1/vA._w );
      vB.scale( 1/vB._w );
      vC.scale( 1/vC._w );

      var sA = this.viewportToScreen( vA );
      var sB = this.viewportToScreen( vB );
      var sC = this.viewportToScreen( vC );

      // Simple lighting.
      // take the dot product of the view vector, and the normal vector, and make that the color.
      var viewDir = new Vector(); viewDir.set( 0, 0, 1 );
      var dot = Math.abs( viewDir.dot( nA ) );
      this.rasterizeTriangle( sA, sB, sC, Math.round( 255.0 * dot ), 0, 0 );
    };

  CanvasController.prototype.rasterizeTriangle = function ( vertA, vertB, vertC, red, green, blue ) {
    // Test implementation of scanline rendering...
    // define the rectangle that this triangle is contained in.
    var startX = Math.min( Math.min( vertA._x, vertB._x ), vertC._x );
    var startY = Math.min( Math.min( vertA._y, vertB._y ), vertC._y );
    var endX = Math.max( Math.max( vertA._x, vertB._x ), vertC._x );
    var endY = Math.max( Math.max( vertA._y, vertB._y ), vertC._y );

    // now iterate accross that rectangle, and determine if a pixel need be shaded or not.
    for ( var x = startX; x <= endX; x ++ ) {
      for ( var y = startY; y <= endY; y ++ ) {
        if ( this.pointInTriangle( x, y, vertA, vertB, vertC ) ) {
          //var z = vertA._z; // temporary
          // calculate fragment depth over interpolation.
          var interpVals = this.triangleInterpolateCoefficients( x, y, vertA, vertB, vertC );
          var z = vertA._z * interpVals._x + vertB._z * interpVals._y + vertC._z * interpVals._z;

          this.writePixel( x, y, z, red, green, blue );
        }
      }
    }

  };


  CanvasController.prototype.triangleInterpolateCoefficients = function ( x, y, A, B, C ) {
    var diffAx = A._x - x;
    var diffAy = A._y - y;
    var diffBx = B._x - x;
    var diffBy = B._y - y;
    var diffCx = C._x - x;
    var diffCy = C._y - y;

    var diffAsqr = diffAx * diffAx + diffAy * diffAy;
    var diffBsqr = diffBx * diffBx + diffBy * diffBy;
    var diffCsqr = diffCx * diffCx + diffCy * diffCy;
    var diffSum = diffAsqr + diffBsqr + diffCsqr;

    var aVal = diffAsqr / diffSum;
    var bVal = diffBsqr / diffSum;
    var cVal = diffCsqr / diffSum;

    var interpCoef = new Vector();
    interpCoef.set( aVal, bVal, cVal );
    return interpCoef;
  }


  // Algorithm taken from here: http://stackoverflow.com/questions/2049582/how-to-determine-a-point-in-a-triangle
  CanvasController.prototype.pointInTriangle = function ( testX, testY, a, b, c ) {
      var as_x = testX-a._x;
      var as_y = testY-a._y;

      var s_ab = (b._x-a._x)*as_y-(b._y-a._y)*as_x > 0;

      if((c._x-a._x)*as_y-(c._y-a._y)*as_x > 0 == s_ab) return false;

      if((c._x-b._x)*(testY-b._y)-(c._y-b._y)*(testX-b._x) > 0 != s_ab) return false;

      return true;
  }


};