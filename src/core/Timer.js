define( function() {

  var Timer = function() {
    this.time = 0;
    this.lastTime = 0;
    this.lastFrameTime = 0;
    this.frameTicks = 0;
    this.fps = 60;

    this.CYCLE_TIME = 1e16;
    this.FRAME_RATE_60FPS = 0.016666666667; // 1.0 second / 60.0 frames
  };

  // This should be accessed ONLY on engine Update
  Timer.prototype.tick = function() {

    // Use Date.now() instead of new Date().getTime(), avoids one object allocation
    var now = Date.now();
    var delta = now - this.lastTime;

    // Used to not overflow time value
    if ( this.time > this.CYCLE_TIME ) {
      this.time = 0;
    }

    this.time += delta;
    this.lastTime = now;

    // Initiates lastFrameTime for first cycle
    if( this.lastFrameTime == 0 ) {
      this.lastFrameTime = this.time;
    }

    var frameDelta = this.time - this.lastFrameTime;

    if ( frameDelta >= 1000 ) {
      // In one second gets the stored frame ticks (FPS) and resets frame ticker
      this.fps = this.frameTicks;
      this.frameTicks = 0;
      this.lastFrameTime = this.time;
    }

    // Stores frame ticks per cycle
    this.frameTicks++;
  };

  // Returns the difference in milliseconds from the given time, to current Monogatari time
  Timer.prototype.compare = function( time ) {
    return ( time > this.time ) ? this.time + this.CYCLE_TIME - time : this.time - time;
  };

  return Timer;

} );
