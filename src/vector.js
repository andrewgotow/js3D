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

function Vector() {
  this._x = 0;
  this._y = 0;
  this._z = 0;
  this._w = 1; // used for internal purposes only.

  // Vector.prototype.Vector = function ( x, y, z ) {
  //   this._x = x;
  //   this._y = y;
  //   this._z = z;
  // };
  Vector.prototype.set = function ( x, y, z ) {
    this._x = x;
    this._y = y;
    this._z = z;
  };

  Vector.prototype.dot = function ( other ) {
    return this._x * other._x + this._y * other._y + this._z * other._z;
  };

  Vector.prototype.cross = function ( other ) {
    var result = new Vector();
    result._x = (this._y * other._z) - (this._z * other._y);
    result._y = (this._z * other._x) - (this._x * other._z);
    result._z = (this._x * other._y) - (this._y * other._x);
    return result;
  };

  Vector.prototype.scale = function( scale ) {
    this._x *= scale;
    this._y *= scale;
    this._z *= scale;
    //this._w *= scale;
    return this;
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z );
  };

  Vector.prototype.normalized = function () {
    var result = new Vector();
    var mag = this.magnitude();
    result._x = this._x / mag;
    result._y = this._y / mag;
    result._z = this._z / mag;
    return result;
  };

};


function lerpVector ( A, B, i ) {
  result = new Vector();
  result._x = A._x * (1.0-i) + B._x * i;
  result._y = A._y * (1.0-i) + B._y * i;
  result._z = A._z * (1.0-i) + B._z * i;
  return result;
};