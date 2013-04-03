function GameObject() {
  this._position = new Vector();
  this._rotation = new Quaternion();

  this._vertices = [-0.5, -0.5, 0.0,
                    0.5, -0.5, 0.0,
                    0, 0.5, 0.0];

  this._triangles = [ 0, 1, 2 ];

  // Colors are defined per-triangle, rather than per vertex. (gradients are hard :| )
  this._colors = [1.0, 0.0, 0.0, 1.0];


  GameObject.prototype.getTransform = function() {
    var transMat = new Matrix().translate( this._position._x, this._position._y, this._position._z );
    var rotMat = this._rotation.toMatrix();

    return multiplyMatrix( rotMat, transMat );
  };

};