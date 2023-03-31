// Свайпер + смена фона страницы
var swiper = new Swiper(".mySwiper", {
  initialSlide: 5,
  mousewheel: true,
  cardsEffect: {
    perSlideOffset: 12,
    rotate: false,
    slideShadows: false,
  },
  loop: true,
  effect: "cards",
  grabCursor: true,
  speed: 500,
  parallax: true,
  breakpoints: {
    1439: {
      cardsEffect: {
        perSlideOffset: 11,
        rotate: false,
        slideShadows: false,
      },
    },
    1365: {
      cardsEffect: {
        perSlideOffset: 10,
        rotate: false,
        slideShadows: false,
      },
    },
    1068: {
      cardsEffect: {
        perSlideOffset: 8,
        rotate: false,
        slideShadows: false,
      },
    },
    767: {
      cardsEffect: {
        perSlideOffset: 7,
        rotate: false,
        slideShadows: false,
      },
    },
    414: {
      cardsEffect: {
        perSlideOffset: 5,
        rotate: false,
        slideShadows: false,
      },
    },
  },
  on: {
    slideChange: function() {
      var slideIndex = this.activeIndex;
      var slideColor = $('.swiper-slide:eq(' + slideIndex + ')').data('background-color');
      $('body').css({
        'background-color': slideColor,
        'transition': 'background-color 1s ease-in-out'
      });
    }
  }
});

// Счетчик карточек
const numberEl = document.querySelector('.swiper-counter__number');
const totalEl = document.querySelector('.swiper-counter__total');

swiper.on('slideChange', () => {
  const activeIndex = swiper.activeIndex;
  const cardNumber = swiper.slides[activeIndex].getAttribute('data-card-number');
  numberEl.textContent = cardNumber;
});

totalEl.textContent = swiper.slides.length.toString().padStart(2, '0');

// Переход на игры
  swiper.changeDirection('vertical');

  function goToPage1() {
    window.location.href = "games/tetris.html";
  }
  
  function goToPage2() {
    window.location.href = "games/snake.html";
  }
  
  function goToPage3() {
    window.location.href = "games/breakout.html";
  }
  
  function goToPage4() {
    window.location.href = "games/hockey.html";
  }
// Курсор + трэйл эффект
  $(document).ready(function() {
    var mouseX = -100, mouseY = -100;
    var trailLength = 25;
    var trailX = [];
    var trailY = [];
  
    $(document).mousemove(function(event) {
      mouseX = event.pageX;
      mouseY = event.pageY;
    });
  
    setInterval(function() {
      $(".custom-cursor").css({
        "transform": "translate3d(" + (mouseX - 15) + "px, " + (mouseY - 15) + "px, 0)"
      });
  
      trailX.push(mouseX);
      trailY.push(mouseY);
  
      if (trailX.length > trailLength) {
        trailX.shift();
        trailY.shift();
      }

      var trail = document.getElementById("trail");
      trail.innerHTML = "";
      for (var i = 0; i < trailX.length; i++) {
        var size = (i + 1) * 2;
        var x = trailX[i] - size / 2;
        var y = trailY[i] - size / 2;
        var alpha = i / trailX.length;
        var trailElement = document.createElement("div");
        trailElement.classList.add("trail-element");
        trailElement.style.left = x + "px";
        trailElement.style.top = y + "px";
        trailElement.style.width = size + "px";
        trailElement.style.height = size + "px";
        trailElement.style.opacity = alpha;
        trail.appendChild(trailElement);
      }

      while (trail.childNodes.length > trailLength) {
        trail.removeChild(trail.firstChild);
      }
    }, 15);
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      tetrominoSequence.push(name);
    }
  }
  
  // Очередь тетрамино
  function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
      generateSequence();
    }
  
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
  
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  
    const row = name === 'I' ? -1 : -2;
  
    return {
      name: name,      
      matrix: matrix,  
      row: row,        
      col: col         
    };
  }
  
  // Поворот
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
  
    return result;
  }
  
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  // Помещение тетрамино
  function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
  
          if (tetromino.row + row < 0) {
            return showGameOver();
          }
  
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }
  
    for (let row = playfield.length - 1; row >= 0; ) {
      if (playfield[row].every(cell => !!cell)) {
  
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }
  
    tetromino = getNextTetromino();
  }
  
  const canvas = document.getElementById('tetris');
  const context = canvas.getContext('2d');
  const grid = 32;
  const tetrominoSequence = [];
  
  // Игровое поле
  const playfield = [];
  
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
  
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
  
  // Создание тетрамино
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };
  
  // Цвета тетрамино
  const colors = {
    'I': '#9263D5',
    'O': '#FBB404',
    'T': '#E8D41A',
    'S': '#F16A28',
    'Z': '#9263D5',
    'J': '#FBB404',
    'L': '#E8D41A',
  };
  
  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null; 
  let gameOver = false;
  
  // Игровой цикл
  function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
  
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (playfield[row][col]) {
          const name = playfield[row][col];
          context.fillStyle = colors[name];
  
          context.fillRect(col * grid, row * grid, grid-1, grid-1);
        }
      }
    }
  
  
    // Появляющийся тетрамино
    if (tetromino) {
  
      if (++count > 35) {
        tetromino.row++;
        count = 0;
  
        // Помещение тетрамино при столкновении
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
  
      context.fillStyle = colors[tetromino.name];
  
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
  
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }
  
// Хотел сделать небольшой тильт эффект, но подумал, что будет слишком
//   const tilt = document.querySelectorAll(".tilt");

// // VanillaTilt.init(tilt, {

// // 	max: 2,
// // 	speed: 100,
// //   axis: "x",
// // 	glare: true,
// // 	perspective: 1000,
// // 	transition: true,
// // 	"max-glare": 0.45,
// // 	"glare-prerender": false,
// // 	gyroscope: true,
// // 	gyroscopeMinAngleX: -45,
// // 	gyroscopeMaxAngleX: 45,
// // 	gyroscopeMinAngleY: -45,
// // 	gyroscopeMaxAngleY: 45
// // });