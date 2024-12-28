const checkRectangularCollision = ({rectangle1, rectangle2, offset1 = {x: 0, y: 0}}) => {
  return (rectangle1.position.x + offset1.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y + offset1.y <= rectangle2.position.y + rectangle2.height);
};

const checkPlatformCollision = ({ rectangle1, rectangle2, offset1 = { x: 0, y: 0 } }) => {
  return (
    rectangle1.position.x + offset1.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y + rectangle1.height + offset1.y <= rectangle2.position.y + rectangle2.height);
};

const checkObjectCollision = ({ rectangle1, rectangle2, offset1 = { x: 0, y: 0 } }) => {
  return (rectangle1.position.x + offset1.x <= rectangle2.position.x + rectangle2.width / 2 &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x + rectangle2.width / 2 &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y + rectangle2.height / 2 &&
    rectangle1.position.y + offset1.y <= rectangle2.position.y + rectangle2.height / 2);
};
