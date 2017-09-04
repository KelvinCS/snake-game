window.onload = function () {
  let canvas = document.getElementById('screen');
  let ctx = canvas.getContext('2d');
  let score = document.getElementById('score');

  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  let boxSize = 10;

  let direction = 'right';

  let food = createFood();
  let snake = createSnake();

  let blikFood = true;
  let gameOver = false;

  let time = 90;
  let interval = setInterval(paint, time)

  function restartGame() {
    food = createFood()
    snake = createSnake()
    score.innerText = 0;
    direction = 'right';

  }

  function paint() {
    ctx.fillStyle = '#212121'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)

    paintFood()
    if(gameOver){
      snake.forEach((cell, index) => {
        if (index == 0) {
          paintCell(cell, 'white')
        } else {
          paintCell(cell)
        }
      })
      return
    }
    
    moveSnake(snake, direction)
    snake.forEach((cell, index) => {
      if (index == 0) {
        paintCell(cell, 'white')
      } else {
        paintCell(cell)
      }
    })
  }

  function paintFood() {
    if(blikFood) {
      paintCell(food, 'red')
    } else {
      paintCell(food, 'white', 'white')
    }

    blikFood = !blikFood
    
  }

  function moveSnake(snake, direction) {
    let snakeHeadX = snake[0].x;
    let snakeHeadY = snake[0].y;
    let tail = {};

    if (direction == 'right') snakeHeadX++;
    if (direction == 'left') snakeHeadX--;
    if (direction == 'down') snakeHeadY++;
    if (direction == 'up') snakeHeadY--;

    if(hasCollision(snakeHeadX, snakeHeadY)) {
      gameOver = true
      restartGame();
      return
    }
      
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
      tail.x = food.x;
      tail.y = food.y;

      score.innerText++;

     /*  time -= Math.round(time / 10000);
      console.log(time)
      clearInterval(interval)
      setInterval(paint, time) */
      food = createFood();


    } else {
      tail = snake.pop()

      tail.x = snakeHeadX;
      tail.y = snakeHeadY;
    }

    snake.unshift(tail)
  }

  function createSnake() {
    let snake = [];
    let snakeLength = 1;

    for (let i = snakeLength; i >= 0; i--) {
      snake.push({ x: i, y: 0 })
    }

    return snake
  }

  function hasCollision(snakeHeadX, snakeHeadY) {
    hasCollisionToBody(snake, snakeHeadX, snakeHeadY)
    if (
      (snakeHeadX == -1) || 
      (snakeHeadY == -1) || 
      (snakeHeadX == (canvasWidth/boxSize)) ||
      (snakeHeadY == (canvasHeight/boxSize)) ||
      hasCollisionToBody(snake, snakeHeadX, snakeHeadY)
    ) {
      return true
    } else {
      return false
    }
  }

  function hasCollisionToBody(snake, nextX, nextY) {
    let overlay = false;

    snake.forEach((cell, index) => {
      if(index == 0) return;
      
      if((cell.x == nextX) && (cell.y == nextY)) {
        overlay = true
      }
    })

    return overlay
  }

  function createFood() {
    return {
      x: Math.round(Math.random() * (canvasWidth - boxSize) / boxSize),
      y: Math.round(Math.random() * (canvasHeight - boxSize) / boxSize)
    }
  }

  function paintCell({ x, y }, color = '#76ff03', borderColor = '#212121') {
    let cellWidth = boxSize;

    ctx.fillStyle = color
    ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth)
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1;
    ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth)
  }

  document.addEventListener('keydown', (key) => {
    gameOver = false;
    if (key.code == 'Space') gameOver = true;
    if (key.code == 'ArrowRight') direction = 'right';
    if (key.code == 'ArrowLeft') direction = 'left';
    if (key.code == 'ArrowDown') direction = 'down';
    if (key.code == 'ArrowUp') direction = 'up';
  })
}

