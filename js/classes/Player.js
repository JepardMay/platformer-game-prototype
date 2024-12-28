class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    objects,
    imageSrc,
    frames,
    animations
  }) {
    super({ imageSrc, frames });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0
    };
    this.gravity = 0.2;
    this.speed = {
      x: 6,
      y: 10
    };
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox;
    this.animations = animations;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }

    this.cameraBox;
    this.collectedSparkles = 0;
  }

  handleDirections({ keys, canvas, camera, objects }) {
    this.velocity.x = 0;

    if (keys.a.pressed && keys.lastKey === 'a') {
      this.switchSprite('walkLeft');
      this.velocity.x = -this.speed.x;
      this.shouldPanCameraToTheRight({ canvas, camera });
    } else if (keys.d.pressed && keys.lastKey === 'd') {
      this.switchSprite('walkRight');
      this.velocity.x = this.speed.x;
      this.shouldPanCameraToTheLeft({ canvas, camera });
    } else if (this.velocity.y === 0) {
      if (keys.lastKey === 'a') {
        this.switchSprite('idleLeft');
      } else {
        this.switchSprite('idleRight');
      }
    }

    if (this.velocity.y < 0) {
      this.shouldPanCameraDown({ canvas, camera });
      if (keys.lastKey === 'a') {
        player.switchSprite('jumpLeft');
      } else {
        player.switchSprite('jumpRight');
      }
    } else if (this.velocity.y > 0) {
      this.shouldPanCameraUp({ canvas, camera });
      if (keys.lastKey === 'a') {
        player.switchSprite('fallLeft');
      } else {
        player.switchSprite('fallRight');
      }
    }

    if (keys.w.pressed && this.velocity.y === 0) {
      this.velocity.y = -this.speed.y;
    }

    if (objects.length) this.checkForObjects(objects);
  }

  checkForObjects(objects) {
    this.updateHitbox();
    for (let i = objects.length - 1; i >= 0; i--) {
      const object = objects[i];

      if (checkObjectCollision({
        rectangle1: this.hitbox,
        rectangle2: object
      })) {
        objects.splice(i, 1);
        this.collectedSparkles += 1;
        document.querySelector('#collectedSparkles').textContent = this.collectedSparkles;
      }
    }
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.frames.current = 0;
    this.image = this.animations[key].image;
    this.frames.rate = this.animations[key].frames.rate;
    this.frames.buffer = this.animations[key].frames.buffer;
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCameraBox();
    this.checkForHorizontalCanvasCollision();

    // draws out the image
    // ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draws out the hitbox
    // ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    // ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

    // draws out the cameraBox
    // ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    // ctx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);


    this.draw();

    this.position.x += this.velocity.x;

    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 24,
        y: this.position.y + 34
      },
      width: 84,
      height: 62
    }
  }

  updateCameraBox() {
    this.cameraBox = {
      position: {
        x: this.position.x - 280,
        y: this.position.y - 140,
      },
      width: 700,
      height: 400
    };
  }

  checkForHorizontalCanvasCollision() {
    if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= backgroundSize.width || this.hitbox.position.x + this.velocity.x - 3 <= 0) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;

    if (cameraBoxRightSide >= backgroundSize.width) return;

    if (cameraBoxRightSide >= canvas.width + Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({ camera }) {
    const cameraBoxLeftSide = this.cameraBox.position.x;

    if (cameraBoxLeftSide <= 0) return;

    if (cameraBoxLeftSide <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({ camera }) {
    const cameraBoxTop = this.cameraBox.position.y;

    if (cameraBoxTop + this.velocity.y <= 0) return;

    if (cameraBoxTop <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({ canvas, camera }) {
    const cameraBoxDown = this.cameraBox.position.y + this.cameraBox.height;

    if (cameraBoxDown + this.velocity.y >= backgroundSize.height) return;

    if (cameraBoxDown >= Math.abs(camera.position.y) + canvas.height) {
      camera.position.y -= this.velocity.y;
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (checkRectangularCollision({
        rectangle1: this.hitbox,
        rectangle2: collisionBlock
      })) {
        if (this.velocity.x > 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x;

          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (checkRectangularCollision({
        rectangle1: this.hitbox,
        rectangle2: collisionBlock
      })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // platform collision blocks
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = platformCollisionBlocks[i];

      if (checkPlatformCollision({
        rectangle1: this.hitbox,
        rectangle2: platformCollisionBlock
      })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
