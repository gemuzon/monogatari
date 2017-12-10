var Base = require('component/Base');
var Box2D = require('link/Box2D');

/**
 * Component used for interaction with the {@link https://github.com/kripken/box2d.js/|box2d.js Emscripten port}. <br>
 * <br>
 * Box2D has been tuned to work well with moving objects between 0.1 and 10 meters.
 * So this means objects between soup cans and buses in size should work well.
 * Static objects may be up to 50 meters big without too much trouble.
 * Box2D is tuned for meters, kilograms, and seconds.
 *
 * @param {b2BodyDef} bodyDef - Box2D physics body definition
 * @param {b2FixtureDef} materialDef - Box2D physics material definition
 * @param {Number} conversionFactor - Multiplies the position from physics world (meters) to screen coordinates (pixels). Defaults to 64
 * @extends component/Base
 * @exports component/RigidBody
 */
var RigidBody = function (bodyDef, materialDef, conversionFactor) {
  Base.call(this, Base.TYPE.RIGID_BODY);

  // [ b2BodyDef ] http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2BodyDef.html
  // [ b2FixtureDef ] http://www.box2dflash.org/docs/2.1a/reference/Box2D/Dynamics/b2FixtureDef.html

  this.conversionFactor = (conversionFactor) ? conversionFactor : 64;
  this.bodyDef = (bodyDef) ? bodyDef : new Box2D.b2BodyDef();
  this.materialDef = (materialDef) ? materialDef : new Box2D.b2FixtureDef();

  this.body = null;
};

RigidBody.prototype = Object.create(Base.prototype);

/**
 * Enumeration of rigid body types.
 * @type {Number}
 * @enum
 */
RigidBody.TYPE = {
  /** A <b>static body</b> is a body which isn’t affected by world forces it does not react to collisions. It can’t be moved. */
  STATIC: 1,
  /** A <b>kinematic body</b> is an hybrid body which is not affected by forces and collisions like a static body but can moved with a linear velocity like a dynamic body. */
  KINEMATIC: 2,
  /** A <b>dynamic body</b> is a body which is affected by world forces and react to collisions. */
  DYNAMIC: 3
};

/**
 * Sets the density of the material.
 * @param {number} density - Density in kg/m^2
 */
RigidBody.prototype.setDensity = function (density) {
  this.materialDef.set_density(density);
};

/**
 * Sets the friction of the material.
 * @param {number} friction - Usually in the range [0,1]
 */
RigidBody.prototype.setFriction = function (friction) {
  this.materialDef.set_friction(friction);
};

/**
 * Sets the bounciness of the material
 * @param {number} bounciness - Usually in the range [0,1]
 */
RigidBody.prototype.setBounciness = function (bounciness) {
  this.materialDef.set_restitution(bounciness);
};

/**
 * Sets the setPosition of the body, in the physics world, NOT in pixels or game world, a proper scale is required to draw.
 * @param {Number} x Coordinate X
 * @param {Number} y Coordinate Y
 */
RigidBody.prototype.setPosition = function (x, y) {
  this.bodyDef.get_position().set_x(x);
  this.bodyDef.get_position().set_y(y);
};

/**
 * Sets the angle (rotation) of the body.
 * @param {number} angle - Rotation angle in radians
 */
RigidBody.prototype.setRotation = function (angle) {
  this.bodyDef.angle.set_angle(angle);
};

/**
 * Sets geometrical shape of this RigidBody.
 * @param {b2Shape} shape - This is mandatory to use the component
 */
RigidBody.prototype.setShape = function (shape) {
  this.materialDef.set_shape(shape);
};

/**
 * Prevents the collision to be resolved by Box2D, but retains collision information.
 * @param {boolean} isSensor
 */
RigidBody.prototype.setSensor = function (isSensor) {
  this.materialDef.set_isSensor(isSensor);
};

/**
 * Prevents the collision to be resolved through other objects.
 * <b>Expensive! Use with care.</b>
 * @param {boolean} preventTunneling
 */
RigidBody.prototype.setPreventTunneling = function (preventTunneling) {
  this.bodyDef.set_bullet(preventTunneling);
};

/**
 * Sets this body {@link module:component.RigidBody.TYPE|type}.
 * @param {module:component.RigidBody.TYPE} type - The body type
 */
RigidBody.prototype.setType = function (type) {
  switch (type) {
    case RigidBody.TYPE.STATIC:
      this.bodyDef.set_type(Box2D.b2_staticBody);
      break;
    case RigidBody.TYPE.KINEMATIC:
      this.bodyDef.set_type(Box2D.b2_kinematicBody);
      break;
    case RigidBody.TYPE.DYNAMIC:
      this.bodyDef.set_type(Box2D.b2_dynamicBody);
      break;
    default:
      this.bodyDef.set_type(Box2D.b2_staticBody);
      break;
  }
};

/**
 * Prevents or allows the rotation on this RigidBody.
 * @param {boolean} allowRotation
 */
RigidBody.prototype.setAllowRotation = function (allowRotation) {
  this.bodyDef.set_fixedRotation(!allowRotation);
};

/**
 * Creates the fixture on the body of the physics world.
 */
RigidBody.prototype.createFixture = function () {
  if (this.body && this.materialDef) {
    this.body.CreateFixture(this.materialDef);
  }
};

/**
 * Allows to store a data (in the means of a pointer) of an object to work with the internal memory of the Box2D.
 * It is (kinda) bugged on emscripten port, but can be {@link https://github.com/kripken/box2d.js/issues/35|worked around}.
 * @param {Object} userData
 */
RigidBody.prototype.setUserData = function (userData) {
  this.materialDef.set_userData(userData);
};

/**
 * Returns the Box2D.BodyDef from this component, null if not set.
 * @return {b2BodyDef} Body Definition from Box2D
 */
RigidBody.prototype.getBodyDef = function () {
  return this.bodyDef;
};

/**
 * Returns the Material (Box2D.FixtureDef)from this component, null if not set.
 * @return {b2FixtureDef} Fixture Definition from Box2D
 */
RigidBody.prototype.getMaterialDef = function () {
  return this.materialDef;
};

/**
 * Returns the Physics Body (Box2D.BodyDef) from this component, null if not set.
 * @return {b2Body} Body from Box2D
 */
RigidBody.prototype.getPhysicsBody = function () {
  return this.body;
};

/**
 * Returns a new instance of a RigidBody with the same values.
 * @return {module:component/RigidBody} a clone of this RigidBody
 */
RigidBody.prototype.clone = function () {
  return new RigidBody(this.conversionFactor, this.bodyDef, this.materialDef);
};

module.exports = RigidBody;