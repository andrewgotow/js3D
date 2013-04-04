function GameObject() {
  this._position = new Vector();
  this._rotation = new Quaternion();

  this._vertices = [-0.5, -0.5, 0.0,
                    0.5, -0.5, 0.0,
                    0, 0.5, 0.0];

  this._normals = [ 0, 0, 1,
                    0, 0, 1,
                    0, 0, 1];

  this._triangles = [ 0, 1, 2 ];

  // Colors are defined per-triangle, rather than per vertex. (gradients are hard :| )
  this._colors = [1.0, 0.0, 0.0, 1.0,
                  0.0, 1.0, 0.0, 1.0,
                  0.0, 0.0, 1.0, 1.0];


  GameObject.prototype.getTransform = function() {
    var transMat = new Matrix().translate( this._position._x, this._position._y, this._position._z );
    var rotMat = this._rotation.toMatrix();

    return multiplyMatrix( rotMat, transMat );
  };

  GameObject.prototype.getNormalMatrix = function() {
    // basically just the rotation component of the transformation matrix.
    var rotMat = this._rotation.toMatrix();

    return rotMat;
  };

  GameObject.prototype.calculateNormals = function() {
    this._normals = new Array( this._vertices.length );

    // loop through each triangle
    for ( var t = 0; t < this._triangles.length/3; t ++ ) {
      var indexA = this._triangles[t*3+0];
      var indexB = this._triangles[t*3+1];
      var indexC = this._triangles[t*3+2];

      var A = new Vector();
      A.set( this._vertices[ indexA*3 + 0 ], this._vertices[ indexA*3 + 1 ], this._vertices[ indexA*3 + 2 ] );

      var B = new Vector();
      B.set( this._vertices[ indexB*3 + 0 ], this._vertices[ indexB*3 + 1 ], this._vertices[ indexB*3 + 2 ] );
     
      var C = new Vector();
      C.set( this._vertices[ indexC*3 + 0 ], this._vertices[ indexC*3 + 1 ], this._vertices[ indexC*3 + 2 ] );
     
      var AminusB = new Vector(); AminusB.set( A._x - B._x, A._y - B._y, A._z - B._z );
      var AminusC = new Vector(); AminusC.set( A._x - C._x, A._y - C._y, A._z - C._z );
      //AminusB = AminusB.normalized();
      //AminusC = AminusC.normalized();

      var normal = AminusB.cross( AminusC );
      normal = normal.normalized();
      //alert( normal.magnitude() );

      // set the normal values for the indices. assume flat normals for now.
      this._normals[ indexA*3 + 0 ] = normal._x;
      this._normals[ indexA*3 + 1 ] = normal._y;
      this._normals[ indexA*3 + 2 ] = normal._z;
      
      this._normals[ indexB*3 + 0 ] = normal._x;
      this._normals[ indexB*3 + 1 ] = normal._y;
      this._normals[ indexB*3 + 2 ] = normal._z;

      this._normals[ indexC*3 + 0 ] = normal._x;
      this._normals[ indexC*3 + 1 ] = normal._y;
      this._normals[ indexC*3 + 2 ] = normal._z;
    }
  };

};