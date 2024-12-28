class CollisionBlock {
  static size = 64;

  constructor({ position, height = CollisionBlock.size }) {
    this.position = position;
    this.width = CollisionBlock.size;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
  }
}