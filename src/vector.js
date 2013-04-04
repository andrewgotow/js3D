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