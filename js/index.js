const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

canvas.width = 1024;
canvas.height = 576;

const mapSizeInBlocks = {
  width: 80,
  height: 20
};

const floorCollisions2D = [];
const collisionBlocks = [];

for (let i = 0; i < floorCollisions.length; i += mapSizeInBlocks.width) {
  floorCollisions2D.push(floorCollisions.slice(i, i + mapSizeInBlocks.width));
}

floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !== 0) {
      collisionBlocks.push(new CollisionBlock({
        position: {
          x: x * CollisionBlock.size
          ,
          y: y * CollisionBlock.size
        }
      }));
    }
  });
});

const platformCollisions2D = [];
const platformCollisionBlocks = [];

for (let i = 0; i < platformCollisions.length; i += mapSizeInBlocks.width) {
  platformCollisions2D.push(platformCollisions.slice(i, i + mapSizeInBlocks.width));
}

platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol !== 0) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * CollisionBlock.size,
            y: y * CollisionBlock.size
          },
          height: 36,
        })
      );
    }
  });
});

const objects2D = [];
const objects = [];

for (let i = 0; i < generationSpots.length; i += mapSizeInBlocks.width) {
  objects2D.push(generationSpots.slice(i, i + mapSizeInBlocks.width));
}

objects2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    const isPlacing = Math.random() < 0.5;
    if (symbol !== 0 && isPlacing) {
      objects.push(
        new Sprite({
          position: {
            x: x * CollisionBlock.size,
            y: y * CollisionBlock.size
          },
          imageSrc: 'img/interactables/sparkles.png',
          frames: {
            rate: 5,
            buffer: 10
          },
        })
      );
    }
  });
});

const player = new Player({
  position: {
    x: 10,
    y: 830,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: 'img/cat/cat-idle-left.png',
  frames: {
    rate: 4,
    buffer: 10
  },
  animations: {
    idleRight: {
      imageSrc: 'img/cat/cat-idle-right.png',
      frames: {
        rate: 4,
        buffer: 10
      },
    },
    idleLeft: {
      imageSrc: 'img/cat/cat-idle-left.png',
      frames: {
        rate: 4,
        buffer: 10
      },
    },
    walkRight: {
      imageSrc: 'img/cat/cat-walk-right.png',
      frames: {
        rate: 4,
        buffer: 10
      }, 
    },
    walkLeft: {
      imageSrc: 'img/cat/cat-walk-left.png',
      frames: {
        rate: 4,
        buffer: 10
      },
    },
    jumpRight: {
      imageSrc: 'img/cat/cat-jump-right.png',
      frames: {
        rate: 2,
        buffer: 10
      },
    },
    jumpLeft: {
      imageSrc: 'img/cat/cat-jump-left.png',
      frames: {
        rate: 2,
        buffer: 10
      },
    },
    fallRight: {
      imageSrc: 'img/cat/cat-fall-right.png',
      frames: {
        rate: 2,
        buffer: 10
      },
    },
    fallLeft: {
      imageSrc: 'img/cat/cat-fall-left.png',
      frames: {
        rate: 2,
        buffer: 10
      },
    },
  }
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: 'img/map.png',
});

const backgroundSize = {
  width: 5120,
  height: 1280
};

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
};

const backgroundImageHeight = 1280;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + canvas.height,
  }
};

function animate() {
  const animationId = requestAnimationFrame(animate);

  ctx.fillStyle = 'LightSkyBlue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camera.position.x, camera.position.y);
  background.update();
  objects.forEach((object) => object.update());


  // collisionBlocks.forEach((collisionBlock) => collisionBlock.update());

  // platformCollisionBlocks.forEach((platformCollisionBlock) => platformCollisionBlock.update());

  player.handleDirections({ keys, canvas, camera, objects });
  player.update();

  ctx.restore();
}

animate();
