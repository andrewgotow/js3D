/* Matrix data is arranged in the following format
  0,  1,  2,  3,
  4,  5,  6,  7,
  8,  9,  10, 11,
  12, 13, 14, 15
*/

function Matrix() {
  this._values = [1,0,0,0,
                  0,1,0,0,
                  0,0,1,0,
                  0,0,0,1];


  Matrix.prototype.getVal = function ( col, row ) {
    return this._values[ col * 4 + row ];
  };

  Matrix.prototype.setVal = function ( col, row, val ) {
    this._values[ col * 4 + row ] = val;
  };

  Matrix.prototype.scale = function( scale ) {
    //result = new Matrix();
    for ( var rx = 0; rx < 4; rx ++ ) {
      for ( var ry = 0; ry < 4; ry ++ ) {
        this.setVal( rx, ry, this.getVal( rx, ry ) * scale );
      }
    }
    return this;//result;
  };

  Matrix.prototype.translate = function( x, y, z ) {
    this._values[3] += x;
    this._values[7] += y;
    this._values[11] += z;
    return this;
  };

  Matrix.prototype.transformVector = function ( vec ) {
    result = new Vector();

    // Last row is ignored, as transformation matricies are really supposed to be 4x3... consider revision.
    result._x = vec._x * this._values[0] + vec._y * this._values[1] + vec._z * this._values[2] + vec._w * this._values[3];
    result._y = vec._x * this._values[4] + vec._y * this._values[5] + vec._z * this._values[6] + vec._w * this._values[7];
    result._z = vec._x * this._values[8] + vec._y * this._values[9] + vec._z * this._values[10] + vec._w * this._values[11];
    result._w = vec._x * this._values[12] + vec._y * this._values[13] + vec._z * this._values[14] + vec._w * this._values[15];

    return result;
  };

};



function multiplyMatrix ( A, B ) {
    var result = new Matrix();
    // Loop through every space in the result matrix.
    for ( var rx = 0; rx < 4; rx ++ ) {
      for ( var ry = 0; ry < 4; ry ++ ) {
        var v = A.getVal( 0, ry ) * B.getVal( rx, 0 ) + 
            A.getVal( 1, ry ) * B.getVal( rx, 1 ) +
            A.getVal( 2, ry ) * B.getVal( rx, 2 ) + 
            A.getVal( 3, ry ) * B.getVal( rx, 3 );
        result.setVal( rx, ry, v );
      }
    }
    return result;
  };

// stolen from https://www.opengl.org/wiki/GluPerspective_code
function perspectiveMatrix ( fov, aspect, znear, zfar ) {
  var result = new Matrix();

  var ymax = znear * Math.tan(fov * 3.141 / 360.0);
  //ymin = -ymax;
  //xmin = -ymax * aspectRatio;
  var xmax = ymax * aspect;
  result = frustrumMatrix( -xmax, xmax, -ymax, ymax, znear, zfar);

  return result;
};

function frustrumMatrix ( left, right, bottom, top, znear, zfar ) {
  var result = new Matrix();

  var temp = 2.0 * znear;
  var temp2 = right - left;
  var temp3 = top - bottom;
  var temp4 = zfar - znear;

  result._values[0] = temp / temp2;
  result._values[1] = 0.0;
  result._values[2] = 0.0;
  result._values[3] = 0.0;
  result._values[4] = 0.0;
  result._values[5] = temp / temp3;
  result._values[6] = 0.0;
  result._values[7] = 0.0;
  result._values[8] = (right + left) / temp2;
  result._values[9] = (top + bottom) / temp3;
  result._values[10] = (-zfar - znear) / temp4;
  result._values[11] = -1.0;
  result._values[12] = 0.0;
  result._values[13] = 0.0;
  result._values[14] = (-temp * zfar) / temp4;
  result._values[15] = 0.0;

  return result;
};