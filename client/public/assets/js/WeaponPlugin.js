(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("WeaponPlugin", [], factory);
	else if(typeof exports === 'object')
		exports["WeaponPlugin"] = factory();
	else
		root["WeaponPlugin"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Weapon": () => (/* binding */ Weapon),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(77);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(78);
/* harmony import */ var _validateConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(80);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(79);






/**
 * Any Object, as long as it has public `x` and `y` properties,
 * such as {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Geom.Point Point}, `{ x: 0, y: 0 }`, {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Sprite Sprite}, etc
 */

/**
 * The Weapon provides the ability to easily create a bullet pool and manager.
 *
 * Weapons fire {@link Bullet} objects, which are essentially
 * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Sprite Sprites}
 * with a few extra properties. The Bullets are enabled for Arcade Physics.
 * They do not currently work with Impact or Matter Physics.
 *
 * The Bullets are created inside of {@link bullets weapon.bullets}, which is a
 * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Group Group} instance.
 * Anything you can usually do with a Group, like iterate it, etc can be done
 * to the bullets Group too.
 *
 * Bullets can have textures and even animations. You can control the speed at
 * which they are fired, the firing rate, the firing angle, and even set things
 * like gravity for them.
 *
 * @example
 * A small example, using add.weapon, assumed to be running from within a
 * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Types.Scenes.SceneCreateCallback Phaser.Scene.create} method:
 *
 * ```javascript
 * var weapon = this.add.weapon(10, 'bullet');
 * weapon.fireFrom.setPosition(300, 300);
 * this.input.on(Phaser.Input.Events.POINTER_DOWN, weapon.fire, this);
 * ```
 */
class Weapon extends Phaser.Events.EventEmitter {
  /**
   * The scene the Weapon is bound to
   */

  /**
   * Should debug graphics render for physics bodies?
   */

  /**
   * Private var that holds the public {@link bullets} property.
   */

  /**
   * Private var that holds the public {@link autoExpandBulletsGroup} property.
   */

  /**
   * Private var that holds the public {@link autofire} property.
   */

  /**
   * Private var that holds the public {@link shots} property.
   */

  /**
   * Private var that holds the public {@link fireLimit} property.
   */

  /**
   * Private var that holds the public {@link cooldown} property.
   */

  /**
   * Private var that holds the public {@link cooldownVariance} property.
   */

  /**
   * Private var that holds the public {@link fireFrom} property.
   */

  /**
   * Private var that holds the public {@link fireAngle} property.
   */

  /**
   * Private var that holds the public {@link bulletInheritSpriteSpeed} property.
   */

  /**
   * Private var that holds the public {@link bulletAnimation} property.
   */

  /**
   * Private var that holds the public {@link bulletFrameRandom} property.
   */

  /**
   * Private var that holds the public {@link bulletFrameCycle} property.
   */

  /**
   * Private var that holds the public {@link bulletWorldWrap} property.
   */

  /**
   * Private var that holds the public {@link bulletWorldWrapPadding} property.
   */

  /**
   * Private var that holds the public {@link bulletAngleOffset} property.
   */

  /**
   * Private var that holds the public {@link bulletAngleVariance} property.
   */

  /**
   * Private var that holds the public {@link bulletSpeed} property.
   */

  /**
   * Private var that holds the public {@link bulletSpeedVariance} property.
   */

  /**
   * Private var that holds the public {@link bulletLifespan} property.
   */

  /**
   * Private var that holds the public {@link bulletKillDistance} property.
   */

  /**
   * Private var that holds the public {@link bulletGravity} property.
   */

  /**
   * Private var that holds the public {@link bulletRotateToVelocity} property.
   */

  /**
   * Private var that holds the public {@link bulletKey} property.
   */

  /**
   * Private var that holds the public {@link bulletFrame} property.
   */

  /**
   * Private var that holds the public {@link bulletClass} property.
   */

  /**
   * Private var that holds the public {@link bulletCollideWorldBounds} property.
   */

  /**
   * Private var that holds the public {@link bulletKillType} property.
   */

  /**
   * Holds internal data about custom bullet body sizes.
   */

  /**
   * Private var that holds the public {@link bounds} property.
   */

  /**
   * Private var that holds the public {@link bulletBounds} property.
   */

  /**
   * This array stores the frames added via {@link setBulletFrames}.
   */

  /**
   * Private var that holds the public {@link bulletFrameIndex} property.
   */

  /**
   * An internal object that stores the animation data added via {@link addBulletAnimation}.
   */

  /**
   * Private var that holds the public {@link trackedSprite} property.
   */

  /**
   * Private var that holds the public {@link trackedPointer} property.
   */

  /**
   * Private var that holds the public {@link multiFire} property.
   */

  /**
   * Internal multiFire test flag.
   */

  /**
   * Private var that holds the public {@link trackRotation} property.
   */

  /**
   * Private var that holds the public {@link trackOffset} property.
   */

  /**
   * Internal firing rate time tracking variable.
   */

  /**
   * Internal firing rate time tracking variable used by multiFire.
   */

  /**
   * Internal firing rotation tracking point.
   */

  /**
   * Log level for this weapon. Either `warn`, `error` or `off`. `warn` is the default.
   * If you change this, please do so before setting any other properties.
   */

  /**
   * @param scene - A reference to the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Scene Phaser.Scene} instance.
   * @param bulletLimit - The quantity of bullets to seed the Weapon with. If -1 it will set the pool to automatically expand.
   * @param key - The texture cache key of the image that this Sprite will use.
   * @param frame - If the Sprite image contains multiple frames you can specify which one to use here.
   * @param group - Optional Group to add the object to.
   */
  constructor(scene, bulletLimit, key = '', frame = '', group) {
    super();
    this.scene = void 0;
    this.debugPhysics = false;
    this._bullets = void 0;
    this._autoExpandBulletsGroup = false;
    this._autofire = false;
    this._shots = 0;
    this._fireLimit = 0;
    this._cooldown = 100;
    this._cooldownVariance = 0;
    this._fireFrom = new Phaser.Geom.Rectangle(0, 0, 1, 1);
    this._fireAngle = _consts__WEBPACK_IMPORTED_MODULE_3__.Angle.ANGLE_UP;
    this._bulletInheritSpriteSpeed = false;
    this._bulletAnimation = '';
    this._bulletFrameRandom = false;
    this._bulletFrameCycle = false;
    this._bulletWorldWrap = false;
    this._bulletWorldWrapPadding = 0;
    this._bulletAngleOffset = 0;
    this._bulletAngleVariance = 0;
    this._bulletSpeed = 200;
    this._bulletSpeedVariance = 0;
    this._bulletLifespan = 0;
    this._bulletKillDistance = 0;
    this._bulletGravity = new Phaser.Math.Vector2(0, 0);
    this._bulletRotateToVelocity = false;
    this._bulletKey = void 0;
    this._bulletFrame = void 0;
    this._bulletClass = _Bullet__WEBPACK_IMPORTED_MODULE_2__.Bullet;
    this._bulletCollideWorldBounds = false;
    this._bulletKillType = _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_WORLD_BOUNDS;
    this._data = {
      customBody: false,
      width: 0,
      height: 0,
      offsetX: 0,
      offsetY: 0
    };
    this._bounds = new Phaser.Geom.Rectangle();
    this._bulletBounds = void 0;
    this._bulletFrames = [];
    this._bulletFrameIndex = 0;
    this.anims = {};
    this._trackedSprite = void 0;
    this._trackedPointer = void 0;
    this._multiFire = false;
    this._hasFired = false;
    this._trackRotation = false;
    this._trackOffset = new Phaser.Math.Vector2();
    this._nextFire = 0;
    this._tempNextFire = 0;
    this._rotatedPoint = new Phaser.Math.Vector2();
    this.logLevel = 'warn';
    this.scene = scene;
    this._bulletKey = key;
    this._bulletFrame = frame;
    this._bulletBounds = this.scene.physics.world.bounds;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this);
    this.createBullets(bulletLimit, key, frame, group);
  }
  /**
   * This is the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Group Group} that contains all of the bullets managed by this plugin.
   */


  get bullets() {
    return this._bullets;
  }

  set bullets(value) {
    this._bullets = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bullets');
  }
  /**
   * Should the bullet pool run out of bullets (i.e. they are all in flight) then this
   * boolean controls if the Group will create a brand new bullet object or not.
   * @defaultValue false
   */


  get autoExpandBulletsGroup() {
    return this._autoExpandBulletsGroup;
  }

  set autoExpandBulletsGroup(value) {
    this._autoExpandBulletsGroup = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'autoExpandBulletsGroup');
  }
  /**
   * Will this weapon auto fire? If set to true then a new bullet will be fired
   * based on the {@link cooldown} value.
   * @defaultValue false
   */


  get autofire() {
    return this._autofire;
  }

  set autofire(value) {
    this._autofire = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'autofire');
  }
  /**
   * The total number of bullets this Weapon has fired so far.
   * You can limit the number of shots allowed (via {@link fireLimit}), and reset
   * this total via {@link resetShots}.
   * @defaultValue 0
   */


  get shots() {
    return this._shots;
  }

  set shots(value) {
    this._shots = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'shots');
  }
  /**
   * The maximum number of shots that this Weapon is allowed to fire before it stops.
   * When the limit is hit the {@link WEAPON_FIRE_LIMIT} event is dispatched.
   * You can reset the shot counter via {@link resetShots}.
   * @defaultValue 0
   */


  get fireLimit() {
    return this._fireLimit;
  }

  set fireLimit(value) {
    this._fireLimit = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'fireLimit');
  }
  /**
   * The minimum interval between shots, in milliseconds.
   * @defaultValue 100
   */


  get cooldown() {
    return this._cooldown;
  }

  set cooldown(value) {
    this._cooldown = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'cooldown');
  }
  /**
   * This is a modifier that is added to the {@link cooldown} each update to add variety
   * to the firing rate of the Weapon. The value is given in milliseconds.
   * If you've a {@link cooldown} of 200 and a {@link cooldownVariance} of 50 then the actual
   * firing rate of the Weapon will be between 150 and 250.
   * @defaultValue 0
   */


  get cooldownVariance() {
    return this._cooldownVariance;
  }

  set cooldownVariance(value) {
    this._cooldownVariance = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'cooldownVariance');
  }
  /**
   * This is a Rectangle from within which the bullets are fired. By default it's a 1x1
   * rectangle, the equivalent of a Point. But you can change the width and height, and if
   * larger than 1x1 it'll pick a random point within the rectangle to launch the bullet from.
   */


  get fireFrom() {
    return this._fireFrom;
  }

  set fireFrom(value) {
    this._fireFrom = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'fireFrom');
  }
  /**
   * The angle at which the bullets are fired. This can be a const such as {@link Angle.ANGLE_UP ANGLE_UP}
   * or it can be any number from 0 to 360 inclusive, where 0 degrees is to the right.
   * @defaultValue {@link Angle.ANGLE_UP ANGLE_UP}
   */


  get fireAngle() {
    return this._fireAngle;
  }

  set fireAngle(value) {
    this._fireAngle = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'fireAngle');
  }
  /**
   * When a Bullet is fired it can optionally inherit the velocity of the {@link trackedSprite} if set.
   * @defaultValue false
   */


  get bulletInheritSpriteSpeed() {
    return this._bulletInheritSpriteSpeed;
  }

  set bulletInheritSpriteSpeed(value) {
    this._bulletInheritSpriteSpeed = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletInheritSpriteSpeed');
  }
  /**
   * The string based name of the animation that the Bullet will be given on launch.
   * This is set via {@link addBulletAnimation}.
   * @defaultValue ''
   */


  get bulletAnimation() {
    return this._bulletAnimation;
  }

  set bulletAnimation(value) {
    this._bulletAnimation = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletAnimation');
  }
  /**
   * If you've added a set of frames via {@link setBulletFrames} then you can optionally
   * chose for each Bullet fired to pick a random frame from the set.
   * @defaultValue false
   */


  get bulletFrameRandom() {
    return this._bulletFrameRandom;
  }

  set bulletFrameRandom(value) {
    this._bulletFrameRandom = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletFrameRandom');
  }
  /**
   * If you've added a set of frames via {@link setBulletFrames} then you can optionally
   * chose for each Bullet fired to use the next frame in the set. The frame index is then
   * advanced one frame until it reaches the end of the set, then it starts from the start
   * again. Cycling frames like this allows you to create varied bullet effects via
   * sprite sheets.
   * @defaultValue false
   */


  get bulletFrameCycle() {
    return this._bulletFrameCycle;
  }

  set bulletFrameCycle(value) {
    this._bulletFrameCycle = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletFrameCycle');
  }
  /**
   * Should the Bullets wrap around the world bounds? This automatically calls
   * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.World#wrap World.wrap} on the Bullet each frame. See the docs for that method for details.
   * @defaultValue false
   */


  get bulletWorldWrap() {
    return this._bulletWorldWrap;
  }

  set bulletWorldWrap(value) {
    this._bulletWorldWrap = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletWorldWrap');
  }
  /**
   * If {@link bulletWorldWrap} is true then you can provide an optional padding value with this
   * property. It's added to the calculations determining when the Bullet should wrap around
   * the world or not. The value is given in pixels.
   * @defaultValue 0
   */


  get bulletWorldWrapPadding() {
    return this._bulletWorldWrapPadding;
  }

  set bulletWorldWrapPadding(value) {
    this._bulletWorldWrapPadding = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletWorldWrapPadding');
  }
  /**
   * An optional angle offset applied to the Bullets when they are launched.
   * This is useful if for example your bullet sprites have been drawn facing up, instead of
   * to the right, and you want to fire them at an angle. In which case you can set the
   * angle offset to be 90 and they'll be properly rotated when fired.
   * @defaultValue 0
   */


  get bulletAngleOffset() {
    return this._bulletAngleOffset;
  }

  set bulletAngleOffset(value) {
    this._bulletAngleOffset = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletAngleOffset');
  }
  /**
   * This is a variance added to the angle of Bullets when they are fired.
   * If you fire from an angle of 90 and have a {@link bulletAngleVariance} of 20 then the actual
   * angle of the Bullets will be between 70 and 110 degrees. This is a quick way to add a
   * great 'spread' effect to a Weapon.
   * @defaultValue 0
   */


  get bulletAngleVariance() {
    return this._bulletAngleVariance;
  }

  set bulletAngleVariance(value) {
    this._bulletAngleVariance = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletAngleVariance');
  }
  /**
   * The initial velocity of fired bullets, in pixels per second.
   * @defaultValue 200
   */


  get bulletSpeed() {
    return this._bulletSpeed;
  }

  set bulletSpeed(value) {
    this._bulletSpeed = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletSpeed');
  }
  /**
   * This is a variance added to the speed of Bullets when they are fired.
   * If bullets have a {@link bulletSpeed} value of 200, and a {@link bulletSpeedVariance} of 50
   * then the actual speed of the Bullets will be between 150 and 250 pixels per second.
   * @defaultValue 0
   */


  get bulletSpeedVariance() {
    return this._bulletSpeedVariance;
  }

  set bulletSpeedVariance(value) {
    this._bulletSpeedVariance = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletSpeedVariance');
  }
  /**
   * If you've set {@link bulletKillType} to {@link KillType.KILL_LIFESPAN KILL_LIFESPAN} this controls the amount
   * of lifespan the Bullets have set on launch. The value is given in milliseconds.
   * When a Bullet hits its lifespan limit it will be automatically killed.
   * @defaultValue 0
   */


  get bulletLifespan() {
    return this._bulletLifespan;
  }

  set bulletLifespan(value) {
    this._bulletLifespan = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletLifespan');
  }
  /**
   * If you've set {@link bulletKillType} to {@link KillType.KILL_DISTANCE KILL_DISTANCE} this controls the distance
   * the Bullet can travel before it is automatically killed. The distance is given in pixels.
   * @defaultValue 0
   */


  get bulletKillDistance() {
    return this._bulletKillDistance;
  }

  set bulletKillDistance(value) {
    this._bulletKillDistance = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletKillDistance');
  }
  /**
   * This is the acceleration due to {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Body#gravity gravity}
   * added to the Bullets physics body when fired, in pixels per second squared.
   * Total gravity is the sum of this vector and the simulation's gravity.
   */


  get bulletGravity() {
    return this._bulletGravity;
  }

  set bulletGravity(value) {
    this._bulletGravity = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletGravity');
  }
  /**
   * Bullets can optionally adjust their rotation in-flight to match their velocity.
   * This can create the effect of a bullet 'pointing' to the path it is following, for example
   * an arrow being fired from a bow, and works especially well when added to {@link bulletGravity}.
   * @defaultValue false
   */


  get bulletRotateToVelocity() {
    return this._bulletRotateToVelocity;
  }

  set bulletRotateToVelocity(value) {
    this._bulletRotateToVelocity = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletRotateToVelocity');
  }
  /**
   * The Texture Key that the Bullets use when rendering.
   * Changing this has no effect on bullets in-flight, only on newly spawned bullets.
   * @defaultValue ''
   */


  get bulletKey() {
    return this._bulletKey;
  }

  set bulletKey(value) {
    this._bulletKey = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletKey');
  }
  /**
   * The Texture Frame that the Bullets use when rendering.
   * Changing this has no effect on bullets in-flight, only on newly spawned bullets.
   * @defaultValue ''
   */


  get bulletFrame() {
    return this._bulletFrame;
  }

  set bulletFrame(value) {
    this._bulletFrame = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletFrame');
  }
  /**
   * The Class of the bullets that are launched by this Weapon. Defaults to {@link Bullet}, but can be
   * overridden before calling {@link createBullets} and set to your own class type.
   *
   * It should be a class (or constructor function) accepting the same params as {@link Bullet},
   * i.e. `(scene:` {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Scene `Phaser.Scene`}`, x: number, y: number, key: string, frame: string | number)`.
   * @defaultValue Bullet
   */


  get bulletClass() {
    return this._bulletClass;
  }

  set bulletClass(classType) {
    this._bulletClass = classType; // `this.bullets` exists only after createBullets()

    if (this.bullets) {
      this.bullets.classType = this._bulletClass;
    }

    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletClass');
  }
  /**
   * Should bullets collide with the World bounds or not?
   * @defaultValue false
   */


  get bulletCollideWorldBounds() {
    return this._bulletCollideWorldBounds;
  }

  set bulletCollideWorldBounds(value) {
    this._bulletCollideWorldBounds = value;
    this.bullets.children.each(child => {
      child.body.collideWorldBounds = value;
      child.setData('bodyDirty', false);
    });
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletCollideWorldBounds');
  }
  /**
   * This controls how the bullets will be killed. The default is {@link KillType.KILL_WORLD_BOUNDS KILL_WORLD_BOUNDS}.
   *
   * There are 7 different {@link KillType "kill types"} available:
   *
   * * {@linkcode KillType.KILL_NEVER KILL_NEVER}
   * The bullets are never destroyed by the Weapon. It's up to you to destroy them via your own code.
   *
   * * {@linkcode KillType.KILL_LIFESPAN KILL_LIFESPAN}
   * The bullets are automatically killed when their {@link bulletLifespan} amount expires.
   *
   * * {@linkcode KillType.KILL_DISTANCE KILL_DISTANCE}
   * The bullets are automatically killed when they
   * exceed {@link bulletKillDistance} pixels away from their original launch position.
   *
   * * {@linkcode KillType.KILL_WEAPON_BOUNDS KILL_WEAPON_BOUNDS}
   * The bullets are automatically killed when they no longer intersect with the {@link bounds} rectangle.
   *
   * * {@linkcode KillType.KILL_CAMERA_BOUNDS KILL_CAMERA_BOUNDS}
   * The bullets are automatically killed when they no longer intersect with the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Cameras.Scene2D.Camera#getBounds Camera.getBounds} rectangle.
   *
   * * {@linkcode KillType.KILL_WORLD_BOUNDS KILL_WORLD_BOUNDS}
   * The bullets are automatically killed when they no longer intersect with the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.World#bounds World.bounds} rectangle.
   *
   * * {@linkcode KillType.KILL_STATIC_BOUNDS KILL_STATIC_BOUNDS}
   * The bullets are automatically killed when they no longer intersect with the {@link bounds} rectangle.
   * The difference between static bounds and weapon bounds, is that a static bounds will never be adjusted to
   * match the position of a tracked sprite or pointer.
   * @defaultValue {@link KillType.KILL_WORLD_BOUNDS KILL_WORLD_BOUNDS}
   */


  get bulletKillType() {
    return this._bulletKillType;
  }

  set bulletKillType(type) {
    switch (type) {
      case _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_STATIC_BOUNDS:
      case _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_WEAPON_BOUNDS:
        this.bulletBounds = this.bounds;
        break;

      case _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_CAMERA_BOUNDS:
        this.bulletBounds = this.scene.sys.cameras.main.getBounds();
        break;

      case _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_WORLD_BOUNDS:
        this.bulletBounds = this.scene.physics.world.bounds;
        break;
    }

    this._bulletKillType = type;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletKillType');
  }
  /**
   * This Rectangle defines the bounds that are used when determining if a Bullet should be killed or not.
   * It's used in combination with {@link bulletKillType} when that is set to either {@link KillType.KILL_WEAPON_BOUNDS KILL_WEAPON_BOUNDS}
   * or {@link KillType.KILL_STATIC_BOUNDS KILL_STATIC_BOUNDS}. If you are not using either of these kill types then the bounds are ignored.
   * If you are tracking a Sprite or Point then the bounds are centered on that object every frame.
   */


  get bounds() {
    return this._bounds;
  }

  set bounds(value) {
    this._bounds = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bounds');
  }
  /**
   * The Rectangle used to calculate the bullet bounds from.
   */


  get bulletBounds() {
    return this._bulletBounds;
  }

  set bulletBounds(value) {
    this._bulletBounds = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletBounds');
  }
  /**
   * This array stores the frames added via {@link setBulletFrames}.
   */


  get bulletFrames() {
    return this._bulletFrames;
  }

  set bulletFrames(value) {
    this._bulletFrames = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletFrames');
  }
  /**
   * The index of the frame within {@link bulletFrames} that is currently being used.
   * This value is only used if {@link bulletFrameCycle} is set to `true`.
   */


  get bulletFrameIndex() {
    return this._bulletFrameIndex;
  }

  set bulletFrameIndex(value) {
    this._bulletFrameIndex = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'bulletFrameIndex');
  }
  /**
   * The Sprite currently being tracked by the Weapon, if any.
   * This is set via the {@link trackSprite} method.
   */


  get trackedSprite() {
    return this._trackedSprite;
  }

  set trackedSprite(value) {
    this._trackedSprite = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'trackedSprite');
  }
  /**
   * The Pointer currently being tracked by the Weapon, if any.
   * This is set via the {@link trackPointer} method.
   */


  get trackedPointer() {
    return this._trackedPointer;
  }

  set trackedPointer(value) {
    this._trackedPointer = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'trackedPointer');
  }
  /**
   * If you want this Weapon to be able to fire more than 1 bullet in a single
   * update, then set this property to `true`. When `true` the Weapon plugin won't
   * set the shot / firing timers until the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Core.Events.POST_RENDER postRender} phase of the game loop.
   * This means you can call {@link fire} (and similar methods) as often as you like in one
   * single game update.
   * @defaultValue false
   */


  get multiFire() {
    return this._multiFire;
  }

  set multiFire(value) {
    this._multiFire = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'multiFire');
  }
  /**
   * If the Weapon is tracking a Sprite, should it also track the Sprites rotation?
   * This is useful for a game such as Asteroids, where you want the weapon to fire based
   * on the sprites rotation.
   * @defaultValue false
   */


  get trackRotation() {
    return this._trackRotation;
  }

  set trackRotation(value) {
    this._trackRotation = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'trackRotation');
  }
  /**
   * The Track Offset is a Vector2 object that allows you to specify a pixel offset that bullets use
   * when launching from a tracked Sprite or Pointer. For example if you've got a bullet that is 2x2 pixels
   * in size, but you're tracking a Sprite that is 32x32, then you can set `trackOffset.x = 16` to have
   * the bullet launched from the center of the Sprite.
   */


  get trackOffset() {
    return this._trackOffset;
  }

  set trackOffset(value) {
    this._trackOffset = value;
    (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.validateConfig)(this, 'trackOffset');
  }
  /**
   * The x coordinate from which bullets are fired. This is the same as {@link Weapon.fireFrom}.x, and
   * can be overridden by the {@link fire} arguments.
   */


  get x() {
    return this.fireFrom.x;
  }

  set x(value) {
    this.fireFrom.x = value;
  }
  /**
   * The y coordinate from which bullets are fired. This is the same as {@link Weapon.fireFrom}.y, and
   * can be overridden by the {@link fire} arguments.
   */


  get y() {
    return this.fireFrom.y;
  }

  set y(value) {
    this.fireFrom.y = value;
  }
  /**
   * This method performs two actions: First it will check to see if the
   * {@link bullets} Group exists or not, and if not it creates it, adding its
   * children to the `group` given as the 4th argument.
   *
   * Then it will seed the bullet pool with the `quantity` number of Bullets,
   * using the texture key and frame provided (if any).
   *
   * If for example you set the quantity to be 10, then this Weapon will only
   * ever be able to have 10 bullets in-flight simultaneously. If you try to
   * fire an 11th bullet then nothing will happen until one, or more, of the
   * in-flight bullets have been killed, freeing them up for use by the Weapon
   * again.
   *
   * If you do not wish to have a limit set, then pass in -1 as the quantity.
   * In this instance the Weapon will keep increasing the size of the bullet
   * pool as needed. It will never reduce the size of the pool however, so be
   * careful it doesn't grow too large.
   *
   * You can either set the texture key and frame here, or via the
   * {@link bulletKey} and {@link bulletFrame} properties. You can also
   * animate bullets, or set them to use random frames. All Bullets belonging
   * to a single Weapon instance must share the same texture key however.
   *
   * @param quantity - The quantity of bullets to seed the Weapon
   *  with. If -1 it will set the pool to automatically expand.
   * @param key - The texture cache key of the image that this
   *  Sprite will use.
   * @param frame - If the Sprite image contains multiple
   *  frames you can specify which one to use here.
   * @param group - Optional Group to add the object to.
   * @return This Weapon instance.
   */


  createBullets(quantity = 1, key, frame, group, bulletClass) {
    if (bulletClass) {
      this._bulletClass = bulletClass;
    }

    if (!this.bullets || !this.bullets.scene) {
      this.bullets = this.scene.add.group({
        classType: this._bulletClass,
        maxSize: quantity,
        runChildUpdate: true
      });
    }

    if (quantity !== 0) {
      if (quantity === -1) {
        this.autoExpandBulletsGroup = true;
        quantity = 1;
      }

      this.bullets.createMultiple({
        key,
        frame,
        repeat: quantity,
        active: false,
        visible: false
      });
      this.bullets.children.each(child => {
        child.setData('bulletManager', this);
      });

      if (typeof key === 'string') {
        this.bulletKey = key;
      }

      if (typeof frame === 'string') {
        this.bulletFrame;
      }

      if (group) {
        group.addMultiple(this.bullets.children.entries);
      }
    }

    return this;
  }
  /* eslint-disable no-unused-vars */

  /**
   * Call a function on each in-flight bullet in this Weapon.
   *
   * See {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Structs.Set#each Set.each} for more details.
   *
   * @param callback - The function that will be called for each applicable child.
   * The child will be passed as the first argument.
   * @param callbackContext - The context in which the function should be called (usually 'this').
   * @param args - Additional arguments to pass to the callback function, after the child item.
   * @return This Weapon instance.
   */


  forEach(callback, callbackContext, ...args) {
    this.bullets.children.each(child => {
      if (child.active) {
        callback.call(callbackContext, child, args);
      }
    });
    return this;
  }
  /* eslint-enable no-unused-vars */

  /**
   * Sets {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Body#enable Body.enable} to `false` on each bullet in this Weapon.
   * This has the effect of stopping them in-flight should they be moving.
   * It also stops them being able to be checked for collision.
   *
   * @return This Weapon instance.
   */


  pauseAll() {
    this.bullets.children.each(child => {
      child.body.enable = false;
      const timeEvent = child.getData('timeEvent');

      if (timeEvent !== undefined) {
        timeEvent.paused = true;
      }
    }, this);
    return this;
  }
  /**
   * Sets {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Body#enable Body.enable} to `true` on each bullet in this Weapon.
   * This has the effect of resuming their motion should they be in-flight.
   * It also enables them for collision checks again.
   *
   * @return This Weapon instance.
   */


  resumeAll() {
    this.bullets.children.each(child => {
      child.body.enable = true;
      const timeEvent = child.getData('timeEvent');

      if (timeEvent !== undefined) {
        timeEvent.paused = false;
      }
    }, this);
    return this;
  }
  /**
   * Calls {@link Bullet.kill} on every in-flight bullet in this Weapon.
   * Also re-enables their physics bodies, should they have been disabled via {@link pauseAll}.
   *
   * @return This Weapon instance.
   */


  killAll() {
    this.bullets.children.each(child => {
      if (child.active) {
        child.kill();
      }

      child.body.enable = true;
    });
    return this;
  }
  /**
   * Resets the {@link shots} counter back to zero. This is used when you've set
   * {@link fireLimit} and have hit (or just wish to reset) your limit.
   *
   * @param newLimit - Optionally set a new {@link fireLimit}.
   * @return This Weapon instance.
   */


  resetShots(newLimit) {
    this.shots = 0;

    if (newLimit !== undefined) {
      this.fireLimit = newLimit;
    }

    return this;
  }
  /**
   * Sets this Weapon to track the given Sprite, or any {@link ObjectWithTransform Object with x/y coords and optionally rotation}
   * When a Weapon tracks a Sprite it will automatically update its {@link fireFrom} value to match the
   * Sprite's position within the Game World, adjusting the coordinates based on the offset arguments.
   *
   * This allows you to lock a Weapon to a Sprite, so that bullets are always launched from its location.
   *
   * Calling {@link trackSprite} will reset {@link trackedPointer} to undefined, should it have been set, as you can
   * only track _either_ a Sprite, or a Pointer, at once, but not both.
   *
   * @param sprite - The Sprite to track the position of.
   * @param offsetX - The horizontal offset from the Sprites position to be applied to the Weapon.
   * @param offsetY - The vertical offset from the Sprites position to be applied to the Weapon.
   * @param trackRotation - Should the Weapon also track the Sprites rotation?
   * @return This Weapon instance.
   */


  trackSprite(sprite, offsetX = 0, offsetY = 0, trackRotation = false) {
    this.trackedPointer = undefined;
    this.trackedSprite = sprite;
    this.trackRotation = trackRotation;
    this.trackOffset.set(offsetX, offsetY);
    return this;
  }
  /**
   * Sets this Weapon to track the given Pointer.
   * When a Weapon tracks a Pointer it will automatically update its {@link fireFrom} value to match the Pointer's
   * position within the Game World, adjusting the coordinates based on the offset arguments.
   *
   * This allows you to lock a Weapon to a Pointer, so that bullets are always launched from its location.
   *
   * Calling {@link trackPointer} will reset {@link trackedSprite} to undefined, should it have been set, as you can
   * only track _either_ a Pointer, or a Sprite, at once, but not both.
   *
   * @param pointer - The Pointer to track the position of.
   * Defaults to {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Input.InputPlugin#activePointer InputPlugin.activePointer} if not specified.
   * @param offsetX - The horizontal offset from the Pointers position to be applied to the Weapon.
   * @param offsetY - The vertical offset from the Pointers position to be applied to the Weapon.
   * @return This Weapon instance.
   */


  trackPointer(pointer, offsetX = 0, offsetY = 0) {
    if (pointer === undefined && this.scene.input) {
      pointer = this.scene.input.activePointer;
    }

    this.trackedPointer = pointer;
    this.trackedSprite = undefined;
    this.trackRotation = false;
    this.trackOffset.set(offsetX, offsetY);
    return this;
  }
  /**
   * Attempts to fire multiple bullets from the positions defined in the given array.
   *
   * If you provide a `from` argument, or if there is a tracked Sprite or Pointer, then
   * the positions are treated as __offsets__ from the given objects position.
   *
   * If `from` is undefined, and there is no tracked object, then the bullets are fired
   * from the given positions, as they exist in the world.
   *
   * Calling this method sets {@link multiFire} to `true`.
   *
   * If there are not enough bullets available in the pool, and the pool cannot be extended,
   * then this method may not fire from all of the given positions.
   *
   * When the bullets are launched they have their texture and frame updated, as required.
   * The velocity of the bullets are calculated based on Weapon properties like {@link bulletSpeed}.
   *
   * @param positions - An array of positions. Each position can be any Object, as long as it
   * has public `x` and `y` properties, such as {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Geom.Point Point}, { x: 0, y: 0 }, {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Sprite Sprite}
   * @param from Optionally fires the bullets **from** the {@link x} and {@link y} properties of this object,
   * _instead_ of any {@link trackedSprite} or {@link trackedPointer} that is set.
   * @return An array containing all of the fired Bullet objects,
   * if a launch was successful, otherwise an empty array.
   */


  fireMany(positions, from) {
    this.multiFire = true;
    const bullets = [];

    if (from || this.trackedSprite || this.trackedPointer) {
      positions.forEach(offset => {
        const bullet = this.fire(from, null, null, offset.x, offset.y);

        if (bullet) {
          bullets.push(bullet);
        }
      });
    } else {
      positions.forEach(position => {
        const bullet = this.fire(position);

        if (bullet) {
          bullets.push(bullet);
        }
      });
    }

    return bullets;
  }
  /**
   * Attempts to fire a single Bullet from a tracked Sprite or Pointer, but applies an offset
   * to the position first. This is the same as calling {@link fire} and passing in the offset arguments.
   *
   * If there are no more bullets available in the pool, and the pool cannot be extended,
   * then this method returns `undefined`. It will also return `undefined` if not enough time has expired since the last time
   * the Weapon was fired, as defined in the {@link cooldown} property.
   *
   * Otherwise the first available bullet is selected, launched, and returned.
   *
   * When the bullet is launched it has its texture and frame updated, as required. The velocity of the bullet is
   * calculated based on Weapon properties like {@link bulletSpeed}.
   *
   * If you wish to fire multiple bullets in a single game update, then set {@link multiFire} to `true`
   * and you can call this method as many times as you like, per loop. See also {@link fireMany}.
   *
   * @param offsetX - The horizontal offset from the position of the tracked Sprite or Pointer,
   * as set with {@link trackSprite}.
   * @param offsetY - The vertical offset from the position of the tracked Sprite or Pointer,
   * as set with {@link trackSprite}.
   * @return The fired bullet, if a launch was successful, otherwise `undefined`.
   */


  fireOffset(offsetX = 0, offsetY = 0) {
    return this.fire(null, null, null, offsetX, offsetY);
  }
  /**
   * Fires a bullet **at** the given Pointer. The bullet will be launched from the {@link fireFrom} position,
   * or from a Tracked Sprite or Pointer, if you have one set.
   *
   * @param pointer - The Pointer to fire the bullet towards.
   * @return The fired bullet if successful, undefined otherwise.
   */


  fireAtPointer(pointer) {
    var _pointer, _pointer2;

    if (pointer === undefined && this.scene.input) {
      pointer = this.scene.input.activePointer;
    }

    return this.fire(null, (_pointer = pointer) == null ? void 0 : _pointer.x, (_pointer2 = pointer) == null ? void 0 : _pointer2.y);
  }
  /**
   * Fires a bullet **at** the given Sprite. The bullet will be launched from the {@link fireFrom} position,
   * or from a Tracked Sprite or Pointer, if you have one set.
   *
   * @param sprite - The Sprite to fire the bullet towards.
   * @return The fired bullet if successful, undefined otherwise.
   */


  fireAtSprite(sprite) {
    return this.fire(null, sprite == null ? void 0 : sprite.x, sprite == null ? void 0 : sprite.y);
  }
  /**
   * Fires a bullet **at** the given coordinates. The bullet will be launched from the {@link fireFrom} position,
   * or from a Tracked Sprite or Pointer, if you have one set.
   *
   * @param x - The x coordinate, in world space, to fire the bullet towards.
   * @param y - The y coordinate, in world space, to fire the bullet towards.
   * @return The fired bullet if successful, undefined otherwise.
   */


  fireAtXY(x, y) {
    return this.fire(null, x, y);
  }
  /**
   * Attempts to fire a single Bullet. If there are no more bullets available in the pool,
   * and the pool cannot be extended, then this method returns `undefined`. It will also return `undefined`
   * if not enough time has expired since the last time the Weapon was fired,
   * as defined in the {@link cooldown} property.
   *
   * Otherwise the first available bullet is selected, launched, and returned.
   *
   * The arguments are all optional, but allow you to control both where the bullet is launched from, and aimed at.
   *
   * If you don't provide any of the arguments then it uses those set via properties such as {@link trackedSprite},
   * {@link fireAngle} and so on.
   *
   * When the bullet is launched it has its texture and frame updated, as required. The velocity of the bullet is
   * calculated based on Weapon properties like {@link bulletSpeed}.
   *
   * If you wish to fire multiple bullets in a single game update, then set `Weapon.multiFire = true`
   * and you can call {@link fire} as many times as you like, per loop. Multiple fires in a single update
   * only counts once towards the {@link shots} total, but you will still receive an event for each bullet.
   *
   * @emits {@link WEAPON_FIRE}
   * @emits {@link WEAPON_FIRE_LIMIT}
   *
   * @param from Optionally fires the bullet **from** the {@link x} and {@link y} properties of this object.
   * If set this overrides {@link trackedSprite} or {@link trackedPointer}. Pass `null` to ignore it.
   * @param x - The x coordinate, in world space, to fire the bullet **towards**.
   * If left as `undefined`, or `null`, the bullet direction is based on its angle.
   * @param y - The y coordinate, in world space, to fire the bullet **towards**.
   * If left as `undefined`, or `null`, the bullet direction is based on its angle.
   * @param offsetX - If the bullet is fired from a tracked Sprite or Pointer,
   * or the `from` argument is set, this applies a horizontal offset from the launch position.
   * @param offsetY - If the bullet is fired from a tracked Sprite or Pointer,
   * or the `from` argument is set, this applies a vertical offset from the launch position.
   * @return The fired bullet, if a launch was successful, otherwise `undefined`.
   */


  fire(from, x, y, offsetX = 0, offsetY = 0) {
    var _this$trackedSprite;

    if (this.scene.time.now < this._nextFire || this.fireLimit > 0 && this.shots === this.fireLimit) {
      return undefined;
    }

    let speed = this.bulletSpeed; //  Apply +- speed variance

    if (this.bulletSpeedVariance !== 0) {
      speed += Phaser.Math.Between(-this.bulletSpeedVariance, this.bulletSpeedVariance);
    } // Position the fireFrom rectangle


    if (from) {
      // Fire based on passed coordinates
      this.updateFireFrom(from.x, from.y);
    } else if (this.trackedSprite && typeof this.trackedSprite.rotation === 'number') {
      // Fire based on tracked sprite
      if (this.trackRotation) {
        this._rotatedPoint.set(this.trackedSprite.x + this.trackOffset.x, this.trackedSprite.y + this.trackOffset.y);

        Phaser.Math.RotateAround(this._rotatedPoint, this.trackedSprite.x, this.trackedSprite.y, this.trackedSprite.rotation);
        this.updateFireFrom(this._rotatedPoint.x, this._rotatedPoint.y);
      } else {
        this.updateFireFrom(this.trackedSprite.x, this.trackedSprite.y);
      }

      if (this.bulletInheritSpriteSpeed && this.trackedSprite.body) {
        speed += this.trackedSprite.body.speed;
      }
    } else if (this.trackedPointer) {
      // Fire based on tracked pointer
      this.updateFireFrom(this.trackedPointer.x, this.trackedPointer.y);
    } // Take offset into account


    this.fireFrom.x += offsetX;
    this.fireFrom.y += offsetY; // Pick a random coordinate inside the fireFrom rectangle if bigger than 1

    const fromX = this.fireFrom.width > 1 ? this.fireFrom.x + Math.random() * this.fireFrom.width : this.fireFrom.x;
    const fromY = this.fireFrom.height > 1 ? this.fireFrom.y + Math.random() * this.fireFrom.height : this.fireFrom.y;
    let angle = typeof ((_this$trackedSprite = this.trackedSprite) == null ? void 0 : _this$trackedSprite.angle) === 'number' && this.trackRotation ? this.trackedSprite.angle : this.fireAngle; //  The position (in world space) to fire the bullet towards, if set

    if (typeof x === 'number' && typeof y === 'number') {
      angle = Phaser.Math.RadToDeg(Math.atan2(y - fromY, x - fromX));
    } //  Apply +- angle variance


    if (this.bulletAngleVariance !== 0) {
      angle += Phaser.Math.Between(-this.bulletAngleVariance, this.bulletAngleVariance);
    }

    let moveX = 0;
    let moveY = 0; //  Avoid unnecessary sin/cos for right-angled shots

    if (angle === 0 || angle === 180) {
      // Only cos needed
      moveX = Math.cos(Phaser.Math.DegToRad(angle)) * speed;
    } else if (angle === 90 || angle === 270) {
      // Only sin needed
      moveY = Math.sin(Phaser.Math.DegToRad(angle)) * speed;
    } else {
      // Need to calculate both
      moveX = Math.cos(Phaser.Math.DegToRad(angle)) * speed;
      moveY = Math.sin(Phaser.Math.DegToRad(angle)) * speed;
    }

    let bullet; // Attempt to get a bullet instance to use

    if (this.autoExpandBulletsGroup) {
      var _bullet;

      bullet = this.bullets.getFirstDead(true, fromX, fromY, this.bulletKey, this.bulletFrame);
      (_bullet = bullet) == null ? void 0 : _bullet.setData('bulletManager', this);
    } else {
      bullet = this.bullets.getFirstDead(false);
    } // Prepare and fire the bullet


    if (bullet !== undefined) {
      bullet.prepare(fromX, fromY);
      bullet.setData({
        fromX,
        fromY,
        killType: this.bulletKillType,
        killDistance: this.bulletKillDistance,
        rotateToVelocity: this.bulletRotateToVelocity
      }); // Prepare timer for bullet lifespan

      if (this.bulletKillType === _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_LIFESPAN) {
        bullet.setData('timeEvent', this.scene.time.addEvent({
          delay: this.bulletLifespan,
          callback: bullet.kill,
          callbackScope: bullet
        }));
        bullet.lifespan = this.bulletLifespan;
      }

      bullet.angle = angle + this.bulletAngleOffset; //  Frames and Animations

      if (this.bulletAnimation) {
        bullet.anims.play(this.bulletAnimation);
      } else if (this.bulletFrameCycle) {
        // Calculate bullet frame to use
        if (this.bulletFrameIndex >= this.bulletFrames.length) {
          this.bulletFrameIndex = 0;
        }

        bullet.setTexture(this.bulletKey, this.bulletFrameIndex);
        this.bulletFrameIndex++;
      } else if (this.bulletFrameRandom) {
        // Pick a bullet frame at random
        const nextFrame = Math.floor(Math.random() * this.bulletFrames.length);
        bullet.setTexture(this.bulletKey, nextFrame);
      } // Set correct size and position for bullet body


      if (bullet.getData('bodyDirty')) {
        if (this._data.customBody) {
          bullet.body.setSize(this._data.width, this._data.height);
          bullet.body.setOffset(this._data.offsetX, this._data.offsetY);
        }

        bullet.body.collideWorldBounds = this.bulletCollideWorldBounds;
        bullet.setData('bodyDirty', false);
      }

      bullet.body.setVelocity(moveX, moveY);
      bullet.body.setGravity(this.bulletGravity.x, this.bulletGravity.y);
      let next = 0; // Calculate when to fire next bullet, taking into account speed variance

      if (this.bulletSpeedVariance !== 0) {
        let rate = this.cooldown;
        rate += Phaser.Math.Between(-this.cooldownVariance, this.cooldownVariance);

        if (rate < 0) {
          rate = 0;
        }

        next = this.scene.time.now + rate;
      } else {
        next = this.scene.time.now + this.cooldown;
      } // Prepare for next shot


      if (this.multiFire) {
        if (!this._hasFired) {
          //  We only add 1 to the 'shots' count for multiFire shots
          this._hasFired = true;
          this._tempNextFire = next;
          this.shots++;
        }
      } else {
        this._nextFire = next;
        this.shots++;
      } // Emit events


      this.emit(_events__WEBPACK_IMPORTED_MODULE_5__.WEAPON_FIRE, bullet, this, speed);

      if (this.fireLimit > 0 && this.shots === this.fireLimit) {
        this.emit(_events__WEBPACK_IMPORTED_MODULE_5__.WEAPON_FIRE_LIMIT, this, this.fireLimit);
      }
    }

    return bullet;
  }
  /**
   * Set the fireFrom rectangle based on passed coords
   * @private
   * @param x - X coordinate for where to fire from
   * @param y - Y coordinate for where to fire from
   */


  updateFireFrom(x, y) {
    if (this.fireFrom.width > 1) {
      // If size is larger than 1, center on coordinates
      Phaser.Geom.Rectangle.CenterOn(this.fireFrom, x + this.trackOffset.x, y + this.trackOffset.y);
    } else {
      this.fireFrom.x = x + this.trackOffset.x;
      this.fireFrom.y = y + this.trackOffset.y;
    }
  }
  /**
   * You can modify the size of the physics Body the Bullets use to be any dimension you need.
   * This allows you to make it smaller, or larger, than the parent Sprite.
   * You can also control the x and y offset of the Body. This is the position of the
   * Body relative to the top-left of the Sprite _texture_.
   *
   * For example: If you have a Sprite with a texture that is 80x100 in size,
   * and you want the physics body to be 32x32 pixels in the middle of the texture, you would do:
   *
   * `setSize(32 / Math.abs(this.scale.x), 32 / Math.abs(this.scale.y), 24, 34)`
   *
   * Where the first two parameters are the new Body size (32x32 pixels) relative to the Sprite's scale.
   * 24 is the horizontal offset of the Body from the top-left of the Sprites texture, and 34
   * is the vertical offset.
   *
   * @param width - The width of the Body.
   * @param height - The height of the Body.
   * @param offsetX - The X offset of the Body from the top-left of the Sprites texture.
   * @param offsetY - The Y offset of the Body from the top-left of the Sprites texture.
   * @return This Weapon instance.
   */


  setBulletBodyOffset(width, height, offsetX = 0, offsetY = 0) {
    this._data.customBody = true;
    this._data.width = width;
    this._data.height = height;
    this._data.offsetX = offsetX;
    this._data.offsetY = offsetY; //  Update all bullets in the pool

    this.bullets.children.each(child => {
      child.body.setSize(width, height);
      child.body.setOffset(offsetX, offsetY);
      child.setData('bodyDirty', false);
    });
    return this;
  }
  /**
   * Sets the texture frames that the bullets can use when being launched.
   *
   * This is intended for use when you've got numeric based frames, such as
   * those loaded via a Sprite Sheet.
   *
   * It works by calling {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Utils.Array#NumberArray Phaser.Utils.Array.NumberArray} internally, using
   * the min and max values provided. Then it sets the frame index to be zero.
   *
   * You can optionally set the cycle and random booleans, to allow bullets to
   * cycle through the frames when they're fired, or pick one at random.
   *
   * @param min - The minimum value the frame can be. Usually zero.
   * @param max - The maximum value the frame can be.
   * @param selectionMethod - Specifies how the
   *  frame for the fired bullet will be selected. See {@link FrameType consts.FrameType}
   *  for options.
   * @return This Weapon instance.
   */


  setBulletFrames(min, max, selectionMethod = _consts__WEBPACK_IMPORTED_MODULE_3__.FrameType.BULLET_FRAME_STABLE) {
    if (typeof selectionMethod !== 'number' || selectionMethod < _consts__WEBPACK_IMPORTED_MODULE_3__.FrameType.BULLET_FRAME_STABLE || selectionMethod > _consts__WEBPACK_IMPORTED_MODULE_3__.FrameType.BULLET_FRAME_RANDOM) {
      (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.log)(`Invalid bullet frame selection method specified: ${selectionMethod}`, this.logLevel);
    }

    if (min > max) {
      (0,_validateConfig__WEBPACK_IMPORTED_MODULE_4__.log)(`min frame (${min}) must be <= max frame (${max})`, this.logLevel);
    }

    this.bulletFrames = Phaser.Utils.Array.NumberArray(min, max);
    this.bulletFrameIndex = 0;
    this.bulletFrameCycle = selectionMethod === _consts__WEBPACK_IMPORTED_MODULE_3__.FrameType.BULLET_FRAME_CYCLE;
    this.bulletFrameRandom = selectionMethod === _consts__WEBPACK_IMPORTED_MODULE_3__.FrameType.BULLET_FRAME_RANDOM;
    return this;
  }
  /**
   * Adds a new animation under the given key. Optionally set the frames, frame rate and loop.
   * The arguments are all the same as for {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Animations.AnimationManager#add AnimationManager.add}, and work in the same way.
   *
   * {@link bulletAnimation} will be set to this animation after it's created. From that point on, all
   * bullets fired will play using this animation. You can swap between animations by calling this method
   * several times, and then just changing the {@link bulletAnimation} property to the name of the animation
   * you wish to play for the next launched bullet.
   *
   * If you wish to stop using animations at all, set {@link bulletAnimation} to '' (an empty string).
   *
   * @param name - The unique (within the Weapon instance) name for the animation, i.e. "fire", "blast".
   * @param frames - An array of numbers/strings that correspond to the framesto add to this animation
   * and in which order. e.g. [1, 2, 3] or ['run0', 'run1', run2]). If null then all frames will be used.
   * @param frameRate - The speed at which the animation should play.
   * The speed is given in frames per second.
   * @param repeat - Number of times to repeat the animation. Set to -1 to repeat forever.
   * @return This Weapon instance.
   */


  addBulletAnimation(name, frames, frameRate = 60, repeat = 0) {
    if (!this.scene.sys.anims.exists(name)) {
      this.scene.sys.anims.create({
        key: name,
        frames,
        frameRate,
        repeat
      });
      this.anims[name] = this.scene.sys.anims.get(name);
    }

    this.bulletAnimation = name;
    return this;
  }
  /**
   * Internal update method, called by the Weapon Plugin.
   * Used for updating weapon bounds and handling {@link autofire}.
   * @internal
   */


  update() {
    if (this._bulletKillType === _consts__WEBPACK_IMPORTED_MODULE_3__.KillType.KILL_WEAPON_BOUNDS) {
      if (this.trackedSprite) {
        Phaser.Geom.Rectangle.CenterOn(this.bounds, this.trackedSprite.x, this.trackedSprite.y);
      } else if (this.trackedPointer) {
        Phaser.Geom.Rectangle.CenterOn(this.bounds, this.trackedPointer.x, this.trackedPointer.y);
      }
    }

    if (this.autofire) {
      this.fire();
    }
  }
  /**
   * Internal postRender method, called by the Weapon Plugin.
   * Used for instance when multiFire is enabled.
   * @internal
   */


  postRender() {
    if (!this.multiFire || !this._hasFired) {
      return;
    }

    this._hasFired = false;
    this._nextFire = this._tempNextFire;
  }
  /**
   * Destroys this Weapon.
   * You must release everything in here, all references, all objects, free it all up.
   */


  destroy() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.scene = undefined;
    this.bullets.destroy(true);
  }

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Weapon);

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(3);
var addToUnscopables = __webpack_require__(8);
var Iterators = __webpack_require__(50);
var InternalStateModule = __webpack_require__(51);
var defineIterator = __webpack_require__(56);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(4);
var requireObjectCoercible = __webpack_require__(7);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(5);
var classof = __webpack_require__(6);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 6 */
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 7 */
/***/ ((module) => {

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(9);
var create = __webpack_require__(24);
var definePropertyModule = __webpack_require__(29);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var shared = __webpack_require__(11);
var hasOwn = __webpack_require__(15);
var uid = __webpack_require__(17);
var NATIVE_SYMBOL = __webpack_require__(18);
var USE_SYMBOL_AS_UID = __webpack_require__(23);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(12);
var store = __webpack_require__(13);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.18.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = false;


/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var setGlobal = __webpack_require__(14);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);

module.exports = function (key, value) {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toObject = __webpack_require__(16);

var hasOwnProperty = {}.hasOwnProperty;

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};


/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(7);

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 17 */
/***/ ((module) => {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(19);
var fails = __webpack_require__(5);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),
/* 19 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var userAgent = __webpack_require__(20);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 20 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(21);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var isCallable = __webpack_require__(22);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),
/* 22 */
/***/ ((module) => {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument === 'function';
};


/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(18);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(25);
var defineProperties = __webpack_require__(27);
var enumBugKeys = __webpack_require__(47);
var hiddenKeys = __webpack_require__(46);
var html = __webpack_require__(48);
var documentCreateElement = __webpack_require__(31);
var sharedKey = __webpack_require__(49);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(26);

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};


/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : isCallable(it);
};


/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var definePropertyModule = __webpack_require__(29);
var anObject = __webpack_require__(25);
var objectKeys = __webpack_require__(39);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(5);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var IE8_DOM_DEFINE = __webpack_require__(30);
var anObject = __webpack_require__(25);
var toPropertyKey = __webpack_require__(32);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var fails = __webpack_require__(5);
var createElement = __webpack_require__(31);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 31 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var isObject = __webpack_require__(26);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 32 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPrimitive = __webpack_require__(33);
var isSymbol = __webpack_require__(34);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : String(key);
};


/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(26);
var isSymbol = __webpack_require__(34);
var getMethod = __webpack_require__(35);
var ordinaryToPrimitive = __webpack_require__(38);
var wellKnownSymbol = __webpack_require__(9);

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = exoticToPrim.call(input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),
/* 34 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);
var getBuiltIn = __webpack_require__(21);
var USE_SYMBOL_AS_UID = __webpack_require__(23);

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && Object(it) instanceof $Symbol;
};


/***/ }),
/* 35 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aCallable = __webpack_require__(36);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);
var tryToString = __webpack_require__(37);

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),
/* 38 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);
var isObject = __webpack_require__(26);

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = fn.call(input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = fn.call(input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 39 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(40);
var enumBugKeys = __webpack_require__(47);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 40 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(15);
var toIndexedObject = __webpack_require__(3);
var indexOf = __webpack_require__(41).indexOf;
var hiddenKeys = __webpack_require__(46);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIndexedObject = __webpack_require__(3);
var toAbsoluteIndex = __webpack_require__(42);
var lengthOfArrayLike = __webpack_require__(44);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 42 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(43);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 43 */
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};


/***/ }),
/* 44 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toLength = __webpack_require__(45);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),
/* 45 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(43);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 46 */
/***/ ((module) => {

module.exports = {};


/***/ }),
/* 47 */
/***/ ((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 48 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(21);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 49 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(11);
var uid = __webpack_require__(17);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = {};


/***/ }),
/* 51 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(52);
var global = __webpack_require__(10);
var isObject = __webpack_require__(26);
var createNonEnumerableProperty = __webpack_require__(54);
var hasOwn = __webpack_require__(15);
var shared = __webpack_require__(13);
var sharedKey = __webpack_require__(49);
var hiddenKeys = __webpack_require__(46);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 52 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var isCallable = __webpack_require__(22);
var inspectSource = __webpack_require__(53);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 53 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);
var store = __webpack_require__(13);

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 54 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var definePropertyModule = __webpack_require__(29);
var createPropertyDescriptor = __webpack_require__(55);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 55 */
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 56 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(57);
var IS_PURE = __webpack_require__(12);
var FunctionName = __webpack_require__(61);
var isCallable = __webpack_require__(22);
var createIteratorConstructor = __webpack_require__(67);
var getPrototypeOf = __webpack_require__(69);
var setPrototypeOf = __webpack_require__(72);
var setToStringTag = __webpack_require__(71);
var createNonEnumerableProperty = __webpack_require__(54);
var redefine = __webpack_require__(60);
var wellKnownSymbol = __webpack_require__(9);
var Iterators = __webpack_require__(50);
var IteratorsCore = __webpack_require__(68);

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          redefine(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    redefine(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),
/* 57 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var getOwnPropertyDescriptor = __webpack_require__(58).f;
var createNonEnumerableProperty = __webpack_require__(54);
var redefine = __webpack_require__(60);
var setGlobal = __webpack_require__(14);
var copyConstructorProperties = __webpack_require__(62);
var isForced = __webpack_require__(66);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var propertyIsEnumerableModule = __webpack_require__(59);
var createPropertyDescriptor = __webpack_require__(55);
var toIndexedObject = __webpack_require__(3);
var toPropertyKey = __webpack_require__(32);
var hasOwn = __webpack_require__(15);
var IE8_DOM_DEFINE = __webpack_require__(30);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),
/* 60 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var isCallable = __webpack_require__(22);
var hasOwn = __webpack_require__(15);
var createNonEnumerableProperty = __webpack_require__(54);
var setGlobal = __webpack_require__(14);
var inspectSource = __webpack_require__(53);
var InternalStateModule = __webpack_require__(51);
var CONFIGURABLE_FUNCTION_NAME = __webpack_require__(61).CONFIGURABLE;

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;
  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      createNonEnumerableProperty(value, 'name', name);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});


/***/ }),
/* 61 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(28);
var hasOwn = __webpack_require__(15);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),
/* 62 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(15);
var ownKeys = __webpack_require__(63);
var getOwnPropertyDescriptorModule = __webpack_require__(58);
var definePropertyModule = __webpack_require__(29);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),
/* 63 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(21);
var getOwnPropertyNamesModule = __webpack_require__(64);
var getOwnPropertySymbolsModule = __webpack_require__(65);
var anObject = __webpack_require__(25);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(40);
var enumBugKeys = __webpack_require__(47);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports) => {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 66 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(5);
var isCallable = __webpack_require__(22);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 67 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = __webpack_require__(68).IteratorPrototype;
var create = __webpack_require__(24);
var createPropertyDescriptor = __webpack_require__(55);
var setToStringTag = __webpack_require__(71);
var Iterators = __webpack_require__(50);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 68 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(5);
var isCallable = __webpack_require__(22);
var create = __webpack_require__(24);
var getPrototypeOf = __webpack_require__(69);
var redefine = __webpack_require__(60);
var wellKnownSymbol = __webpack_require__(9);
var IS_PURE = __webpack_require__(12);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  redefine(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 69 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(15);
var isCallable = __webpack_require__(22);
var toObject = __webpack_require__(16);
var sharedKey = __webpack_require__(49);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(70);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 70 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(5);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 71 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(29).f;
var hasOwn = __webpack_require__(15);
var wellKnownSymbol = __webpack_require__(9);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !hasOwn(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),
/* 72 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-proto -- safe */
var anObject = __webpack_require__(25);
var aPossiblePrototype = __webpack_require__(73);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 73 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(22);

module.exports = function (argument) {
  if (typeof argument === 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(10);
var DOMIterables = __webpack_require__(75);
var DOMTokenListPrototype = __webpack_require__(76);
var ArrayIteratorMethods = __webpack_require__(2);
var createNonEnumerableProperty = __webpack_require__(54);
var wellKnownSymbol = __webpack_require__(9);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');


/***/ }),
/* 75 */
/***/ ((module) => {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 76 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(31);

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bullet": () => (/* binding */ Bullet),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(79);



/**
 * Bullets are used by the {@link Weapon} class, and are normal
 * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.GameObjects.Sprite Sprites},
 * with a few extra properties in the data manager to handle Weapon specific features.
 */
class Bullet extends Phaser.GameObjects.Sprite {
  /**
   * This Bullet's Physics Body.
   */

  /**
   * If you've set {@link Weapon.bulletKillType} to {@link KillType.KILL_LIFESPAN KILL_LIFESPAN}
   * this property contains the lifespan the Bullets have set on launch. The value is given in milliseconds.
   * When a Bullet hits its lifespan limit it will be automatically killed.
   * @readonly
   */

  /**
   * @param scene - A reference to the currently running scene.
   * @param x - The x coordinate (in world space) to position the Bullet at.
   * @param y - The y coordinate (in world space) to position the Bullet at.
   * @param key - This is the image or texture used by the Particle during rendering.
   * It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Textures.Texture Texture}.
   * @param frame - If this Bullet is using part of a sprite sheet or texture atlas
   * you can specify the exact frame to use by giving a string or numeric index.
   */
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.lifespan = void 0;
    this.scene.physics.add.existing(this);
    this.setDataEnabled();
    this.setData({
      timeEvent: undefined,
      bulletManager: undefined,
      fromX: 0,
      fromY: 0,
      bodyDirty: true,
      rotateToVelocity: false,
      killType: _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_NEVER,
      killDistance: 0,
      bodyBounds: new Phaser.Geom.Rectangle()
    });
  }
  /* eslint-disable no-unused-vars */


  setData(key, data) {
    return super.setData(key, data);
  }

  getData(key) {
    return super.getData(key);
  }
  /* eslint-enable no-unused-vars */

  /**
   * Prepares this bullet to be fired and to interact with the rest
   * of the scene again.
   * @param x - Resets bullet position to this x coordinate
   * @param y - Resets bullet position to this y coordinate
   */


  prepare(x, y) {
    var _this$getData;

    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.body.reset(x, y);
    const debugPhysics = ((_this$getData = this.getData('bulletManager')) == null ? void 0 : _this$getData.debugPhysics) || false;
    this.body.debugShowBody = debugPhysics;
    this.body.debugShowVelocity = debugPhysics;
  }
  /**
   * Kills the Bullet, freeing it up for re-use by the Weapon bullet pool.
   * Also dispatches the {@link BULLET_KILL} event on the {@link Weapon}.
   * @emits {@link BULLET_KILL}
   * @returns This instance of the bullet class
   */


  kill() {
    var _this$getData2;

    // Reproduce Phaser.Physics.Arcade.Components.Enable.disableBody because
    // we can't assume that the bullet class has it built in.
    this.body.stop();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.body.debugShowBody = false;
    this.body.debugShowVelocity = false; // TODO: potentially we don't need to destroy the time event and we can
    // just pause when the bullet is killed and restart it when it's refired.
    // For now though do the simple thing and discard it.
    // Another option would be to use Date.now() and manually process pause
    // events with a flag and some math.
    // Both of those are probably premature optimizations.

    const timeEvent = this.getData('timeEvent');

    if (timeEvent !== undefined) {
      timeEvent.destroy();
      this.setData('timeEvent', undefined);
    }

    (_this$getData2 = this.getData('bulletManager')) == null ? void 0 : _this$getData2.emit(_events__WEBPACK_IMPORTED_MODULE_1__.BULLET_KILL, this, this.getData('bulletManager'));
    return this;
  }
  /**
   * Updates the Bullet, killing as required.
   */


  update() {
    if (!this.active) {
      // this was previously a check to this.exists
      return;
    }

    const bulletManager = this.getData('bulletManager');

    if (this.getData('killType') > _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_LIFESPAN) {
      if (this.getData('killType') === _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_DISTANCE) {
        if (new Phaser.Math.Vector2(this.getData('fromX'), this.getData('fromY')).distance(this) > this.getData('killDistance')) {
          this.kill();
        }
      } else if (!Phaser.Geom.Intersects.RectangleToRectangle(bulletManager.bulletBounds, this.body.getBounds(this.getData('bodyBounds')))) {
        this.kill();
      }
    }

    if (this.getData('rotateToVelocity')) {
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (bulletManager.bulletWorldWrap) {
      this.scene.physics.world.wrap(this, bulletManager.bulletWorldWrapPadding);
    }
  }

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bullet);

/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KillType": () => (/* binding */ KillType),
/* harmony export */   "Angle": () => (/* binding */ Angle),
/* harmony export */   "FrameType": () => (/* binding */ FrameType),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable no-unused-vars */

/**
 * Kill type constants for {@link Weapon.bulletKillType}
 */
var KillType;

(function (KillType) {
  KillType[KillType["KILL_NEVER"] = 0] = "KILL_NEVER";
  KillType[KillType["KILL_LIFESPAN"] = 1] = "KILL_LIFESPAN";
  KillType[KillType["KILL_DISTANCE"] = 2] = "KILL_DISTANCE";
  KillType[KillType["KILL_WEAPON_BOUNDS"] = 3] = "KILL_WEAPON_BOUNDS";
  KillType[KillType["KILL_CAMERA_BOUNDS"] = 4] = "KILL_CAMERA_BOUNDS";
  KillType[KillType["KILL_WORLD_BOUNDS"] = 5] = "KILL_WORLD_BOUNDS";
  KillType[KillType["KILL_STATIC_BOUNDS"] = 6] = "KILL_STATIC_BOUNDS";
})(KillType || (KillType = {}));


/**
 * Angle constants that can be used anywhere you specify angles in degrees, for instance {@link Weapon.fireAngle} and {@link Weapon.bulletAngleOffset}.
 */

var Angle;

(function (Angle) {
  Angle[Angle["ANGLE_UP"] = 270] = "ANGLE_UP";
  Angle[Angle["ANGLE_DOWN"] = 90] = "ANGLE_DOWN";
  Angle[Angle["ANGLE_LEFT"] = 180] = "ANGLE_LEFT";
  Angle[Angle["ANGLE_RIGHT"] = 0] = "ANGLE_RIGHT";
  Angle[Angle["ANGLE_NORTH_EAST"] = 315] = "ANGLE_NORTH_EAST";
  Angle[Angle["ANGLE_NORTH_WEST"] = 225] = "ANGLE_NORTH_WEST";
  Angle[Angle["ANGLE_SOUTH_EAST"] = 45] = "ANGLE_SOUTH_EAST";
  Angle[Angle["ANGLE_SOUTH_WEST"] = 135] = "ANGLE_SOUTH_WEST";
})(Angle || (Angle = {}));


/**
 * Bullet frame type constants for {@link Weapon.setBulletFrames}
 */

var FrameType;

(function (FrameType) {
  FrameType[FrameType["BULLET_FRAME_STABLE"] = 0] = "BULLET_FRAME_STABLE";
  FrameType[FrameType["BULLET_FRAME_CYCLE"] = 1] = "BULLET_FRAME_CYCLE";
  FrameType[FrameType["BULLET_FRAME_RANDOM"] = 2] = "BULLET_FRAME_RANDOM";
})(FrameType || (FrameType = {}));


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  KillType,
  Angle,
  FrameType
});

/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WEAPON_FIRE": () => (/* binding */ WEAPON_FIRE),
/* harmony export */   "WEAPON_FIRE_LIMIT": () => (/* binding */ WEAPON_FIRE_LIMIT),
/* harmony export */   "BULLET_KILL": () => (/* binding */ BULLET_KILL),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This event is dispatched when a weapon is fired.
 *
 * @event WEAPON_FIRE
 *
 * @param {Bullet} bullet - The bullet that was fired
 * @param {Weapon} weapon - The weapon emitting the event
 * @param {number} speed - The speed of the bullet
 */
const WEAPON_FIRE = 'fire';
/**
 * This event is dispatched when the weapon's fire limit is reached.
 *
 * @event WEAPON_FIRE_LIMIT
 *
 * @param {Weapon} weapon - The weapon emitting the event
 * @param {number} fireLimit - The fire limit
 */

const WEAPON_FIRE_LIMIT = 'firelimit';
/**
 * This event is dispatched when a bullet is killed.
 *
 * @event BULLET_KILL
 *
 * @param {Bullet} bullet - The bullet that was killed
 * @param {Weapon} weapon - The weapon emitting the event
 */

const BULLET_KILL = 'kill';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  WEAPON_FIRE,
  WEAPON_FIRE_LIMIT,
  BULLET_KILL
});

/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "validateConfig": () => (/* binding */ validateConfig)
/* harmony export */ });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78);


/**
 * Log text to the console or throw an error
 * @param text - Text to be logged
 * @param logLevel - The log level, either `warn`, `error' or `off`
 */
function log(text, logLevel) {
  if (logLevel === 'warn') {
    /* eslint-disable-next-line no-console */
    console.warn(text);
  } else if (logLevel === 'error') {
    throw new Error(text);
  }
}
/**
 * Check the config of the weapon for common errors and weird configurations.
 * @param weapon - The weapon being validated
 * @param property - The property of the weapon being validated
 */


function validateConfig(weapon, property = 'all') {
  var _weapon$trackedSprite, _weapon$trackedSprite2;

  if ((['bulletWorldWrap', 'bulletKillType'].includes(property) || property === 'all') && weapon.bulletWorldWrap && (weapon.bulletKillType === _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_WORLD_BOUNDS || weapon.bulletKillType === _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_WEAPON_BOUNDS)) {
    log('Warning: KILL_WORLD_BOUNDS and KILL_WEAPON_BOUNDS does not work well with bulletWorldWrap set to true.', weapon.logLevel);
  }

  if ((['bulletKillType', 'bulletLifespan'].includes(property) || property === 'all') && weapon.bulletKillType === _consts__WEBPACK_IMPORTED_MODULE_0__.KillType.KILL_LIFESPAN && weapon.bulletLifespan < 0) {
    log('Invalid bulletLifespan; must be > 0; currently ' + weapon.bulletLifespan, weapon.logLevel);
  }

  if ((['trackRotation', 'trackedSprite'].includes(property) || property === 'all') && weapon.trackRotation === true && (((_weapon$trackedSprite = weapon.trackedSprite) == null ? void 0 : _weapon$trackedSprite.rotation) === undefined || weapon.trackedSprite.angle === undefined)) {
    log('Warning: Weapon cannot track rotation of an object without a rotation and/or angle property.', weapon.logLevel);
  }

  if ((['bulletInheritSpriteSpeed', 'trackedSprite'].includes(property) || property === 'all') && weapon.bulletInheritSpriteSpeed === true && !((_weapon$trackedSprite2 = weapon.trackedSprite) != null && _weapon$trackedSprite2.body)) {
    log('Warning: Bullet cannot inherit speed from a sprite without a body.', weapon.logLevel);
  }

  const shouldBePositive = ['fireLimit', 'cooldown', 'cooldownVariance', 'bulletAngleVariance', 'bulletSpeedVariance', 'bulletKillDistance'];
  /* eslint-disable @typescript-eslint/no-non-null-assertion */

  if (property === 'all') {
    shouldBePositive.forEach(key => {
      if (weapon[key] !== undefined && weapon[key] < 0) {
        log('Invalid ' + property + '; must be >= 0; currently ' + weapon[key], weapon.logLevel);
      }
    });
  } else if (shouldBePositive.includes(property) && weapon[property] !== undefined && weapon[property] < 0) {
    log('Invalid ' + property + '; must be >= 0; currently ' + weapon[property], weapon.logLevel);
  }
}



/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WeaponPlugin": () => (/* binding */ WeaponPlugin),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Weapon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/**
 * @author       Patrick Sletvold
 * @author       jdotr <https://github.com/jdotrjs>
 * @author       Richard Davey
 * @license      {@link https://github.com/16patsle/phaser3-weapon-plugin/blob/master/LICENSE|MIT License}
 */


/**
 * The Weapon Plugin provides the ability to easily create a {@link Weapon} with
 * its own bullet pool and manager.
 * @see {@link Weapon} for a more detailed explanation.
 *
 * @example
 * A small example on how to install the plugin, assumed to be running from within a
 * {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Types.Scenes.SceneCreateCallback Phaser.Scene.create} method:
 *
 * ```javascript
 * // Install it into a scene
 * this.plugins.installScenePlugin(
 *   'WeaponPlugin',
 *   WeaponPlugin,
 *   'weapons',
 *   this
 * );
 * ```
 */
class WeaponPlugin extends Phaser.Plugins.ScenePlugin {
  /**
   * @param scene - A reference to the {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Scene Phaser.Scene} instance.
   * @param pluginManager - A reference to the
   *  {@link https://newdocs.phaser.io/docs/3.55.2/Phaser.Plugins.PluginManager PluginManager} instance.
   * @param pluginKey - The key under which this plugin has been installed into the Scene Systems.
   */
  constructor(scene, pluginManager, pluginKey) {
    super(scene, pluginManager, pluginKey);
    this.weapons = void 0;
    this.weapons = []; // Register our new Game Object type

    pluginManager.registerGameObject('weapon', this.add.bind(this), config => {
      return this.add(config.bulletLimit, config.key, config.frame, config.group, config.weaponClass);
    });
  }
  /**
   *
   * @param bulletLimit - The quantity of bullets to seed the Weapon with. If -1 it will set the pool to automatically expand.
   * @param key - The Game.cache key of the image that this Sprite will use.
   * @param frame - If the Sprite image contains multiple frames you can specify which one to use here.
   * @param group - Optional Group to add the object to.
   * @param weaponClass - Optional custom class for the Weapon.
   * @returns The weapon that was created
   */


  add(bulletLimit, key, frame, group, weaponClass = _Weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon) {
    const weapon = new weaponClass(this.scene, bulletLimit, key, frame, group);
    this.weapons.push(weapon);
    return weapon;
  }
  /**
   * Called by the PluginManager when this plugin is started.
   * If a plugin is stopped, and then started again, this will get called again.
   * Typically called immediately after `BasePlugin.init`.
   */


  start() {
    this.systems.events.on(Phaser.Core.Events.POST_RENDER, this.postRender, this);
  }
  /**
   * If this is a Scene Plugin (i.e. installed into a Scene) then this method is called when the Scene boots.
   * By this point the plugin properties `scene` and `systems` will have already been set.
   * In here you can listen for Scene events and set-up whatever you need for this plugin to run.
   */


  boot() {
    const eventEmitter = this.systems.events;
    eventEmitter.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    eventEmitter.on(Phaser.Core.Events.DESTROY, this.destroy, this);
  }
  /**
   * Internal update method, called by the PluginManager.
   */


  update() {
    this.weapons.forEach(weapon => {
      weapon.update();
    });
  }
  /**
   * Internal update method, called by the PluginManager.
   */


  postRender() {
    this.weapons.forEach(weapon => {
      weapon.postRender();
    });
  }
  /**
   * Destroys this Weapon.
   * You must release everything in here, all references, all objects, free it all up.
   */


  destroy() {
    super.destroy();
    this.weapons.forEach(weapon => {
      weapon.destroy();
    });
  }

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WeaponPlugin);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Weapon": () => (/* reexport safe */ _Weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon),
/* harmony export */   "Bullet": () => (/* reexport safe */ _Bullet__WEBPACK_IMPORTED_MODULE_1__.Bullet),
/* harmony export */   "consts": () => (/* reexport module object */ _consts__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "events": () => (/* reexport module object */ _events__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   "WeaponPlugin": () => (/* reexport safe */ _WeaponPlugin__WEBPACK_IMPORTED_MODULE_4__.WeaponPlugin)
/* harmony export */ });
/* harmony import */ var _Weapon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _Bullet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(77);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(78);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79);
/* harmony import */ var _WeaponPlugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(81);
// Set up shortcuts to the classes and constants







})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=WeaponPlugin.js.map