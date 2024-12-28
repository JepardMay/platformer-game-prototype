class Sprite {
  constructor({
    position,
    imageSrc,
    frames = { rate: 1, buffer: 3 }
  }) {
    this.position = position;
    this.loaded = false;
    this.frames = {
      rate: frames.rate,
      current: 0,
      buffer: frames.buffer,
      elapsed: 0
    };
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width / this.frames.rate;
      this.height = this.image.height;
      this.loaded = true;
    }
    this.image.src = imageSrc;
  }

  draw() {
    if (!this.image) return;

    const cropbox = {
      position: {
        x: this.frames.current * (this.image.width / this.frames.rate),
        y: 0,
      },
      width: this.image.width / this.frames.rate,
      height: this.image.height
    };

    ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  updateFrames() {
    this.frames.elapsed++;

    if (this.frames.elapsed % this.frames.buffer === 0) {
      if (this.frames.current < this.frames.rate - 1) {
        this.frames.current++;
      } else {
        this.frames.current = 0;
      }
    }
  }

  update() {
    this.draw();
    this.updateFrames();
  }
}