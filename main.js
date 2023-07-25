let game_size = [288, 512];
let game_running = false;
let ground_level;
let pipe = [500, 100];
let pipe_gap = 80;
let pipe_speed = 10;
let bird = [90, game_size[1] / 2];
let jump = 0;
let lives = 5;
let points = 0;
let bestScore = 0; // Add a variable to store the best score
let BACKGROUND, BASE, BOTTOM_PIPE, TOP_PIPE, BIRD, GAMEOVER, MESSAGE;
let DIE, HIT, WING;

function preload() {
  // images
  BACKGROUND = loadImage("images/secondary-background.jpg");
  BASE = loadImage("images/base.png");
  TOP_PIPE = loadImage("images/pipe-red-flipped.png");
  BOTTOM_PIPE = loadImage("images/pipe-red.png");
  BIRD = loadImage("images/flappybird-animation.gif");
  GAMEOVER = loadImage("images/gameover.png");
  MESSAGE = loadImage("images/start.png");

  // sounds
  POINT = loadSound("sounds/point.mp3");
  DIE = loadSound("sounds/die.mp3");
  HIT = loadSound("sounds/hit.mp3");
  WING = loadSound("sounds/wing.mp3");

  // volumes for the sound
  POINT.setVolume(0.1);
  DIE.setVolume(0.1);
  HIT.setVolume(0.1);
  WING.setVolume(0.1);

  // get bestscore
  const savedBestScore = localStorage.getItem("bestScore");
  if (savedBestScore !== null) {
    bestScore = parseInt(savedBestScore);
  }
}

function setup() {
  createCanvas(game_size[0], game_size[1]);
  frameRate(30);
  ground_level = game_size[1] - BASE.height;
}

function is_collision(im1, x1, y1, im2, x2, y2) {
  return !(
    x1 + im1.width < x2 ||
    x1 > x2 + im2.width ||
    y1 + im1.height < y2 ||
    y1 > y2 + im2.height
  );
}

function play() {
  pipe[0] -= pipe_speed;
  if (pipe[0] < -TOP_PIPE.width) {
    pipe[0] = game_size[0];
    pipe[1] = random(100, game_size[1] - 250 - pipe_gap);
    pipe_gap = 100 + random(100);
    points += 1;

    POINT.play();
  }
  image(TOP_PIPE, pipe[0], pipe[1] - TOP_PIPE.height);
  image(BOTTOM_PIPE, pipe[0], pipe[1] + pipe_gap);

  if (mouseIsPressed && !WING.isPlaying()) {
    jump = 20;
    WING.play();
  }
  if (jump > -20) {
    jump -= 2;
  }
  bird[1] -= jump;
  // makes sure bird cannot go beyond the canvas
  if (bird[1] < 0) {
    bird[1] = 0;
  }

  if (bird[1] > ground_level) {
    bird[1] = ground_level;
    jump = 0;

    pipe[0] = game_size[0];
    pipe[1] = random(100, game_size[1] - 250 - pipe_gap);

    bird = [50, game_size[1] / 2];

    pipe_gap = 100 + random(100);
    lives -= 1;
    if (lives < 0) {
      game_running = false;
      DIE.play();
      // update best score and save it in local storage
      if (points > bestScore) {
        bestScore = points;
        localStorage.setItem("bestScore", bestScore);
      }
    } else {
      HIT.play();
    }
  }

  image(BIRD, bird[0], bird[1]);

  if (
    is_collision(
      BIRD,
      bird[0],
      bird[1],
      TOP_PIPE,
      pipe[0],
      pipe[1] - TOP_PIPE.height
    ) ||
    is_collision(
      BIRD,
      bird[0],
      bird[1],
      BOTTOM_PIPE,
      pipe[0],
      pipe[1] + pipe_gap
    )
  ) {
    pipe[0] = game_size[0];
    pipe[1] = 50 + random(game_size[1] - 250 - pipe_gap);
    pipe_gap = 100 + random(100);
    lives -= 1;
    if (lives < 0) {
      game_running = false;
      DIE.play();

      if (points > bestScore) {
        bestScore = points;
        localStorage.setItem("bestScore", bestScore);
      }
    } else {
      HIT.play();
    }
  }
  textSize(12);
  fill("#ded895");
  textFont("Rajdhani");
  text(`Hits: ${lives}`, 30, 30);
  text(`PTS: ${points}`, game_size[0] - 30, 30);
}

function draw() {
  image(BACKGROUND, 0, 0);

  // draw the pipes first
  if (game_running) {
    play();
  }
  image(BASE, 0, game_size[1] - BASE.height);

  textSize(20);
  fill("#ded895");
  text(`Best Score: ${bestScore}`, 145, 30); // display the best score at 150

  if (!game_running) {
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);

    // Show restart instead of start when the user dies
    if (lives < 0) {
      image(GAMEOVER, game_size[0] / 6, game_size[1] / 4);
      textFont("Rajdhani");
      fill("#ded895");
      text("Restart", game_size[0] / 2, (game_size[1] * 5) / 10);
      bird = [50, game_size[1] / 2];
    } else {
      textFont("Rajdhani");
      textSize(20);
      image(MESSAGE, game_size[0] / 6, game_size[1] / 6);
    }

    if (mouseIsPressed) {
      game_running = true;
      lives = 4; // reset lives to 5, it says 4 but its actually 5 lives
      points = 0;
    }
  }
}
