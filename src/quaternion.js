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

function Quaternion() {
  this._x = 0;
  this._y = 0;
  this._z = 0;
  this._w = 1;


  Quaternion.prototype.magnitude = function () {
    return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );
  };

  Quaternion.prototype.normalized = function() {
    var result = new Vector();
    var mag = this.magnitude();
    result._x = this._x / mag;
    result._y = this._y / mag;
    result._z = this._z / mag;
    result._w = this._w / mag;
    return result;
  };

  Quaternion.prototype.toMatrix = function() {
    var result = new Matrix();

    //normalize the quaternion.
    var q = this.normalized();
  
    var x2 = q._x + q._x;
    var y2 = q._y + q._y;
    var z2 = q._z + q._z;
    
    var yy2 = q._y * y2;
    var xy2 = q._x * y2;
    var xz2 = q._x * z2;
    var yz2 = q._y * z2;
    var zz2 = q._z * z2;
    var wz2 = q._w * z2;
    var wy2 = q._w * y2;
    var wx2 = q._w * x2;
    var xx2 = q._x * x2;

    result.setVal( 0, 0, - yy2 - zz2 + 1 );
    result.setVal( 1, 0, xy2 + wz2 );
    result.setVal( 2, 0, xz2 - wy2 );
    result.setVal( 3, 0, 0 );
    
    result.setVal( 0, 1, xy2 - wz2 );
    result.setVal( 1, 1, - xx2 - zz2 + 1 );
    result.setVal( 2, 1, yz2 + wx2 );
    result.setVal( 3, 1, 0 );
    
    result.setVal( 0, 2, xz2 + wy2 );
    result.setVal( 1, 2, yz2 - wx2 );
    result.setVal( 2, 2, - xx2 - yy2 + 1 );
    result.setVal( 3, 2, 0 );
    
    result.setVal( 0, 3, 0 );
    result.setVal( 1, 3, 0 );
    result.setVal( 2, 3, 0 );
    result.setVal( 3, 3, 1 );

    return result;
  };


};



function multiplyQuaternion ( A, B ) {
  result = new Quaternion();
  result._x = A._w * B._x + A._x * B._w + A._y * B._z - A._z * B._y;
  result._y = A._w * B._y + A._y * B._w + A._z * B._x - A._x * B._z;
  result._z = A._w * B._z + A._z * B._w + A._x * B._y - A._y * B._x;
  result._w = A._w * B._w - A._x * B._x - A._y * B._y - A._z * B._z;
  return result;
};

function quaternionFromAngleAxis ( angle, axisX, axisY, axisZ ) {
  var result = new Quaternion();

  // convert angle to radians
  angle *= (3.141/180.0);
  angle *= 0.5;
  var sinAngle = Math.sin(angle);
  
  // Normallize the vector
  var magnitude = 1.0/Math.sqrt( axisX*axisX + axisY*axisY + axisZ*axisZ );
  var xn = axisX * magnitude;
  var yn = axisY * magnitude;
  var zn = axisZ * magnitude;
  
  result._x = ( xn * sinAngle);
  result._y = ( yn * sinAngle);
  result._z = ( zn * sinAngle);
  result._w = Math.cos(angle);
  
  return result;
};

// This does not work... Find out why.
/*
function quaternionFromEulerAngles ( x, y, z ) {
  var sX = Math.sin( x/2 );
  var cX = Math.cos( x/2 );

  var sY = Math.sin( y/2 );
  var cY = Math.cos( y/2 );

  var sZ = Math.sin( z/2 );
  var cZ = Math.cos( z/2 );

  var result = new Quaternion();
  result._x = cZ*cX*cY + sZ*sX*sY;
  result._y = sZ*cX*cY - cZ*sX*sY;
  result._z = cZ*sX*cY + sZ*cX*sY;
  result._w = cZ*cX*sY - sZ*sX*cY;
  
  return result;
};
*/