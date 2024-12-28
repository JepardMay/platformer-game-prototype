addEventListener('keydown', (evt) => {
  switch (evt.code) {
    case 'KeyW':
      keys.w.pressed = true;
      break;
    case 'KeyA':
      keys.a.pressed = true;
      keys.lastKey = 'a';
      break;
    case 'KeyD':
      keys.d.pressed = true;
      keys.lastKey = 'd';
      break;
    default:
      break;
  }
});

addEventListener('keyup', (evt) => {
  switch (evt.code) {
    case 'KeyW':
      keys.w.pressed = false;
      break;
    case 'KeyA':
      keys.a.pressed = false;
      break;
    case 'KeyD':
      keys.d.pressed = false;
      break;
    default:
      break;
  }
});