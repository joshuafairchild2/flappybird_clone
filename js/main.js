
var mainState = {

  preload: function() {
    game.load.image('bird','assets/bird.png');
    game.load.image('pipe','assets/pipe.png');
    game.load.audio('jump','assets/jump.wav');
  },

  create: function() {
    if (localStorage.hiScore === undefined) {
      localStorage.hiScore = 0;
    }

    game.stage.backgroundColor = '#71c5cf';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bird = game.add.sprite(100,245,'bird');
    this.bird.anchor.setTo(-0.2, 0.5);
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    var spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacekey.onDown.add(this.jump, this);

    this.pipes = game.add.group();

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = -1;
    this.scoreLabel = game.add.text(20,20, '0', {font: '30px Arial', fill: '#ffffff'});
    this.hiScoreBanner = game.add.text(240, 24, 'High score: ', {font: '22px Arial', fill: '#ffffff'});
    this.hiScoreLabel = game.add.text(360, 20, parseInt(localStorage.hiScore), {font: '30px Arial', fill: '#ffffff'});

    this.jumpSound = game.add.audio('jump');
  },

  update: function() {
    if (this.bird.y < 0 || this.bird.y > (490 - this.bird.height)) {
      this.restartGame();
    }

    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    if (this.bird.angle < 20) {
      this.bird.angle++;
    }
  },

  jump: function() {
    if (!this.bird.alive) {
      return;
    }

    this.bird.body.velocity.y = -350;
    game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.jumpSound.play();
  },

  restartGame: function() {
    game.state.start('main');
  },

  addOnePipe: function(x,y) {
    var pipe = game.add.sprite(x,y,'pipe');
    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i * 60 + 10);
      }
    }
    this.score += 1;
    this.scoreLabel.text = this.score;

    if (this.score > parseInt(localStorage.hiScore)) {
      localStorage.hiScore = this.score;
    }
    this.hiScoreLabel.text = localStorage.hiScore;
  },

  hitPipe: function() {
    if (this.bird.alive == false) {
      return;
    }

    this.bird.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEach(function(pipe) {
      pipe.body.velocity.x = 0;
    }, this);
  }

};

var game = new Phaser.Game(400,490);

game.state.add('main', mainState);

game.state.start('main');
