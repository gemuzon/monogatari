define( [ 'core/Common', 
          'core/Math', 
          'core/Timer', 
          'collection/Map', 
          'component/Base' ], function( _Common, _Math, _Timer, _Map, _Base ) {

  var GameObject = function( id, update, position, rotation, scale ) {
    this.uid = _Common.createUniqueId();
    this.id = id || this.uid;

    this.position = ( position ) ? position : new THREE.Vector3( 0, 0, 0 );
    this.rotation = ( rotation ) ? rotation : new THREE.Vector3( 0, 1, 0 ); // new THREE.Euler()
    this.scale = ( scale ) ? scale : new THREE.Vector3( 1, 1, 1 );

    // the Y is flipped to calculate properly according to the engine orthographic camera
    this.axis = new THREE.Vector3( 0, -1, 0 );

    this.components = new _Map();
    this.componentsIt = this.components.iterator();

    this.children = [];

    this.isVisible = true;
    this.isActive = true;

    this.lastUpdate = 0;

    this.update = ( update && typeof ( update ) === 'function' ) ? update : function() {};
  };

  GameObject.prototype.postUpdate = function() {
    //this.lastUpdate = _Timer.getTime();
    //if( this.isActive ) {
      this.updateComponents();
    //}
  };

  GameObject.prototype.getEulerRotation = function() {
    var angle = this.rotation.angleTo( this.axis );
    return ( this.rotation.y * this.axis.x > this.rotation.x * this.axis.y ) ? angle : -angle;
  };

  GameObject.prototype.lookAt = function( target ) {
    var t = target.clone();
    this.rotation = t.sub( this.position );
    this.rotation.normalize();
  };

  GameObject.prototype.getEulerRotationToTarget = function( target ) {
    var rotation = this.rotation.clone();
    var t = target.clone();

    rotation = t.sub( this.position );
    rotation.normalize();

    var angle = rotation.angleTo( this.axis );

    return ( rotation.y * this.axis.x > rotation.x * this.axis.y ) ? angle : -angle;
  };

  GameObject.prototype.addComponent = function( component ) {
    this.components.put( component.componentType, component );
  };

  GameObject.prototype.findComponent = function( type ) {
    return this.components.get( type );
  };

  GameObject.prototype.removeComponent = function( type ) {
    this.components.remove( type );
  };

  GameObject.prototype.clearComponents = function() {
    this.components.clear();
  };

  GameObject.prototype.hasComponent = function( type ) {
    return ( this.components.contains( type ) ) ? true : false;
  };

  GameObject.prototype.listRenderableComponents = function() {
    var list = [];
    var c;
    this.componentsIt.first();
    while ( this.componentsIt.hasNext() ) {
      c = this.componentsIt.next();
      if ( c.isRenderable ) {
        list.push( c );
      }
    }
    return list;
  };

  GameObject.prototype.updateComponents = function() {
    var rigidBody = this.findComponent( _Base.RIGID_BODY );

    // update object position from Box2D to Monogatari based on physics simulation (if applicable)
    // only affect X and Y for safety reasons, messing with Z on 2D is probably not expected
    if( rigidBody ) {
      this.position.x = rigidBody.body.GetPosition().x * rigidBody.conversionFactor;
      this.position.y = rigidBody.body.GetPosition().y * rigidBody.conversionFactor;
    }

    var component;

    this.componentsIt.first();
    while ( this.componentsIt.hasNext() ) {
      component = this.componentsIt.next();
      // if is a component to be rendered, need to update engine transformations to Three.js transformations
      if ( component.isRenderable && typeof ( component.getMesh ) === 'function' ) {
        component.getMesh().position.set( this.position.x, this.position.y, this.position.z);
        component.getMesh().rotation.z = this.getEulerRotation();
        component.getMesh().scale.set( this.scale.x, this.scale.y, this.scale.z );
      }
    }
  };

  GameObject.prototype.equals = function( go ) {
    return ( go.id === this.id ) ? true : false;
  };

  GameObject.prototype.updateAll = function() {

    for( var i = 0, len = this.children.length; i < len; i++){
      this.children[i].updateAll();
    }

    this.update();
    this.postUpdate();
  };

  return GameObject;

} );
