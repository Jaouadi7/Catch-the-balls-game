// GAME
class Game {

  constructor ( ) {

    this.init(); // AUTO EXECUTE

  }

  // INIT THE GAME
  init ( ) {

    // SELECTORS
    this.gameWelcomPanel = document.querySelector('.game-welcome');
    this.gameBoxs =  document.querySelectorAll('.game-details, .game-settings');
    this.playerScore = document.querySelector('.current-score');
    this.highScore = document.querySelector('.record');
    this.playerLifeChancesElem = document.querySelector('.life-chances');
    this.countDown = document.querySelector('.time-counter');
    this.topPlayersElm = document.querySelector('.top-players');
    this.gameContainer = document.querySelector('.game-container')

    // INIT FUNCTIONS
    this.getPlayerName(); // THE PLAYER NAME FORM
    this.topPlayers(); // TOP PLAYERS RECORDS

  }

  // GET PLAYER NAME
  getPlayerName ( ) {

    // SELECTORS
    const playerForm = document.getElementById('player-form'); // FORM
    const playerName = document.getElementById('player-name'); // INPUT 
    const formMsg = document.getElementById('form-msg'); // FOM MSG

    let errorMsg = '';  // ERROR MESSAGE STARTS EMPTY VALUE

    // ON SUBMITTING PLAYER NAME FORM
    playerForm.addEventListener('submit', (e) => {

      e.preventDefault();  // STOP REDIRECTING THE PAGE AFTER SUBMITING THE FORM

      // FORM RULES
      errorMsg = playerName.value.length < 3 ? 'Player name can not be empty or characters must be more than 2' : '';

      // ERROR / VALID FORM CASES
      if ( errorMsg ) {

        // DISPLAY THE ERROR IN THE DOM
        formMsg.textContent = errorMsg;

      } else {

        // STORE THE PLAYER NAME
        const playerNameValue = playerName.value;

        // PLAYER OBJECT WITH STATED VALUES
        this.playerDetails = {
          name: playerNameValue,
          score: 0,
          highScore: 0,
          lifeChances: 5
        };

        // STORE PLAYER DATA IN LOCAL STORAGE
        const localStorage = window.localStorage;

        // CLEAR STORAGE TO UPDATE IT WITH NEW VALUE OF PLAYER NAME
        if ( localStorage.getItem('playerName') !== null ) { localStorage.clear(); }

        // STORE PLAYER NAME AND HIGH SCORE WITH DEFAULT VALUE IN LOCALSTORAGE
        localStorage.setItem('playerName', playerNameValue);
        localStorage.setItem('highScore', 0);

        // START THE GAME
        this.startGame();

      }
    });
  }

  // START GAME
  startGame ( ) {

    console.log('START GAME');
    
    // HIDE THE WELCOME PAGE
    this.gameWelcomPanel.classList.add('is-hidden');

    // DISPLAY THE GAME DETAILS AND GAME SETTING ON THE GAME SCREEN
    this.gameBoxs.forEach((elem) => elem.classList.remove('is-hidden'));

    // GET PLAYER INFO AND DISPLAY IT ON THE GAME SCREEN
    this.player();

    // PLAY BACKGEOUND GAME MUSIC
    this.playMusic();

    //  OPTION : CHANGE GAME BACKGROUND IMAGE
    this.changeBackgroundImg();

    // GAME COUNTDOWN
    this.gameCountDown();

    //  DROP BALLS
    this.droptheBalls();

  }

  // PLAYER INFO
  player ( ) {

    // DOM SELECTORS
    const playerName = document.querySelector('.player-name');

    // DISPLAY PLAYER DETAILS ON THE GAME SCREEN
    playerName.textContent = localStorage.getItem('playerName');
    this.playerScore.textContent = this.playerDetails.score + ' Pts';
    this.highScore.textContent = this.playerDetails.highScore + ' Pts';

    this.lifeChances();

  }

  // PLAY GAME BACKGROUND MUSIC
  playMusic ( ) {

    this.backgroundMusic = document.getElementById('bg-sound');   //SOUND

    this.backgroundMusic.play();  // PLAY MUSIC

    this.backgroundMusic.setAttribute('loop', true);     // LOOPED MUSIC

    document.querySelector('.btn-mute').addEventListener('click', () => (this.backgroundMusic.muted = true));  // MUSIC MUTED

    document.querySelector('.btn-unmuted').addEventListener('click', () => (this.backgroundMusic.muted = false));  //  MUSIC UNMUTED

  }

  //  SETTINGS : CHANGE GAME BACKGROUND IMAGE
  changeBackgroundImg ( ) {

    // DOM SELECTOR
    const changeBg = document.querySelector('.change-background-btn');
    const defaultBgContainer = document.getElementById('game');

    let imgId = 1; // START SHOW IMAGE 1 TO 5

    // SET BACKGROUND CSS PROPS
  
    defaultBgContainer.style.backgroundImage = `url('./assets/imgs/backgrounds/underwater-background-${imgId}.jpg')`;
    defaultBgContainer.style.backgroundRepeat = 'no-repeat';
    defaultBgContainer.style.backgroundPosition = 'bottom center';
    defaultBgContainer.style.backgroundSize = 'cover';

    // CHANGE BACKGROUND IMGS
    changeBg.addEventListener('click', ( ) => {

      imgId += 1;

      if ( imgId <= 5 ) {

        defaultBgContainer.style.backgroundImage = `url('./assets/imgs/backgrounds/underwater-background-${imgId}.jpg')`;

      } else {

        imgId = 1;
        defaultBgContainer.style.backgroundImage = `url('./assets/imgs/backgrounds/underwater-background-${imgId}.jpg')`;

      }
    });

  }

  // GAME COUNTDOWN
  gameCountDown(  ) {

    this.timeInSeconds = 20;

    const timer = setInterval(() => {

      let mins = Math.floor(this.timeInSeconds / 60);
      let seconds = Math.floor(this.timeInSeconds % 60);

      // FIX ISSUE : ADD 0 TO NUMBERS THAT ARE LESS THAN 10
      const addZero = (number) => { return number < 10 ? (number = '0' + number) : number; };

      // COUNTDOWN
      if (this.timeInSeconds >= 0) {

        this.timeInSeconds -= 1;
        this.countDown.textContent = addZero(mins) + ':' + addZero(seconds);

      } else {

        clearInterval(timer);

        this.endGame();

      }

    }, 1000);

  }

  // TOP TEN PLAYERS TABLE
  topPlayers ( ) {

    // SHOW TOP PLAYERS TABLE
    document.querySelectorAll('.top-player-btn, .back-btn').forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.gameWelcomPanel.classList.toggle('is-hidden');
        this.topPlayersElm.classList.toggle('is-hidden');
      });
    });

    // FETCH THE TOP PLAYERS DATA
    const xhr = new XMLHttpRequest();
    const dataFileURL = 'assets/js/data/top-player.json';

    xhr.open('GET', dataFileURL, true);

    xhr.onload = () => {

      if (xhr.status === 200 && xhr.readyState === 4) {

        this.playersList = JSON.parse(xhr.response);
        const playerContainerElem = document.getElementById('player-info-container');

        let output = '';
        let ranking = 1;

        // DISPLAY DATA IN THE DOM
        for (let i = 0; i < this.playersList.length; i++) {
          output += `<tr><td>${ranking}</td><td>${this.playersList[i].name}</td><td>${this.playersList[i].score} Pts</td></tr>`;
          ranking += 1;
        }

        playerContainerElem.innerHTML = output;

      }

    };

    xhr.send();

  }

  createBall ( type='ball' ) {
    
    const ball = document.createElement('div'); // CREATE BALL ELEMENT

    if ( type === 'boom-ball' ) {

      ball.classList.add('boom-ball');

    } else {

      ball.classList.add('ball');
      // RANDOM BALL BACKGROUND
      const y = Math.floor(Math.random() * 256);
      const z = Math.floor(Math.random() * 256);

      ball.style.backgroundColor = `rgb(255, ${y}, ${z})`; // 255 NOT CHANGE : TRYING TO KEEP BACKGROUND  MORE LIGHTER

      // RANDOM POINTS BETWEEN 1  - 99
      let randomPoints = Math.floor(Math.random() * 100);

      ball.setAttribute('data-points', randomPoints); // SET DATA POINTS ATTR
      ball.textContent = randomPoints; // DISPLAY BALL POINTS

    }

    this.gameContainer.append(ball);

    // MOVE THE BALL FROM TOP TO BOTTOM
    (function dropBall() {

      const horPostion = Math.floor(Math.random() * 100);
      const endMoveBall = document.getElementById('game').offsetHeight + 100;
      const randomSpeed = Math.floor(Math.random() * (10 - 5 + 1) + 5);
      let currentTop = 0;

      // RANDOM LEFT POSTION %
      ball.style.left = horPostion + '%';

      const interval = setInterval(() => {
        if (currentTop === endMoveBall) {
          clearInterval(interval);
          ball.remove();
        } else {
          currentTop++;
          ball.style.top = currentTop + 'px';
        }
      }, randomSpeed);

    })();

    if ( type === 'ball' ) {

      ball.addEventListener('click', (event) => this.shootingBall(event));

    } else {

        ball.addEventListener('mouseenter', (event) => this.hoveOnBoomBall(event), { once: true });

    }

  }

  // DROP MANY BALLS
  droptheBalls ( ) {

    this.dropBalls = true;

    // DROP A BALL ON EACH 1 SECONDS
    this.interv = setInterval(() => {

      this.createBall('ball');

    }, 1000);

     // DROP A BOOM BALL ON EACH 2.5 SECONDS
    this.interv2 = setInterval(() => {

      this.createBall('boom-ball');

    }, 2500);


  }

  // WHEN CLICK ON THE BALL
  shootingBall(event) {

    const selectedBall = event.target;

    this.playerDetails.score += parseInt(
      selectedBall.getAttribute('data-points')
    ); // BALL POINTS
    this.playerScore.textContent = `${this.playerDetails.score.toString()} pts`; // DISPLAY THE SCORE

    // PLAY CATCH AUDIO
    this.catchSound = document.getElementById('catch-ball');
    this.catchSound.play();

    // ADD HIDE-BALE CLASS ( TO DISPLAY HIDDEN ANIMATION )
    selectedBall.classList.add('hide-bale');

    // DELAY REMOVE BALL FROM GAME CONTAINER 500ms TO SHOW HIDDEN ANIMATION
    setTimeout(() => {
      selectedBall.remove();
    }, 500);

  }

  // WHEN HOVER ON THE BOOM BALL
  hoveOnBoomBall(event) {

    const isHoveBoomBall = event.target;

    // DECREMENT ONE HEART FROM PLAYER LIFE CHANCES
    this.playerDetails.lifeChances -= 1;

    // DISPLAY THE CUREENT HEARTS
    this.lifeChances();

    // PLAY CATCH AUDIO
    this.mistake = document.getElementById('mistake');
    this.mistake.play();

    // ADD HIDE-BALE CLASS ( TO DISPLAY HIDDEN ANIMATION )
    isHoveBoomBall.classList.add('hide-bale');

    // DELAY REMOVE BALL FROM GAME CONTAINER 500ms TO SHOW HIDDEN ANIMATION
    setTimeout(() => {
      isHoveBoomBall.remove();
    }, 500);

  }

  // PLAYER LIFE CHANCES
  lifeChances ( ) {

    // DISPLAY LIFE HEARTS ICONS
    this.lifeHearts = '';

    for (let i = 0; i < this.playerDetails.lifeChances; i++) {
      this.lifeHearts += '<img class="life-heart" src="./assets/imgs/icons/life-heart.ico" alt="life hear game">';
    }

    this.playerLifeChancesElem.innerHTML = this.lifeHearts;

    // STOP GAME IF THERE IS NO LIFE CHANCES
    if (this.playerDetails.lifeChances <= 0) {

      this.endGame();
       
    }

  }

  // STOP THE GAME
  endGame ( ) {

    clearInterval(this.interv); // STOP DROPING THE BALLS
    clearInterval(this.interv2); // STOP DROPING THE BALLS

    if ( this.playerDetails.lifeChances <= 0 ) {

      this.timeInSeconds = -1; // STOP GAME TIMER

      document.querySelector('#game-status h3').textContent = 'Game is over';

      console.log('END BECAUSE LOSE HEARTS');

    } else {
      
      document.querySelector('#game-status h3').textContent = 'Time is out';
      console.log('END BECAUSE TIME IS OVER');

    }

    this.countDown.textContent = 'Time out'; // SHOW TIME OUT MESSAGE
    this.playerLifeChancesElem.textContent = 'Game Over';

    this.backgroundMusic.muted = true; // MUTED

    this.dropBalls = false;

    this.gameResult( );
 
  }

  // GAME RESULT
  gameResult ( ) {

    // HIDE THE GAME DETAILS AND GAME SETTING ON THE GAME SCREEN
    this.gameBoxs.forEach((elem) => elem.classList.add('is-hidden'));

    // HIDE BALLS WITH OPACITY ANIMATION
    document.querySelectorAll('.ball, .boom-ball').forEach((elem) => {
      elem.classList.add('opacity-0');
      setTimeout(() => {
        elem.remove();
      }, 500);
     });
    

    // DISPLAY RESULT
    const gameResultElem = document.getElementById('game-status');
    gameResultElem.classList.remove('is-hidden');


    this.checkTopPlayer();

    // START THE GAME AGAIN IF CLICK ON PLAY AGAIN BUTTON
     document.querySelector('.btn-play').addEventListener('click', () => {

      this.backgroundMusic.muted = false;
      this.playerDetails.score = 0;
      this.playerDetails.lifeChances = 5;
      this.playerScore.textContent = `${this.playerDetails.score.toString()} pts`; // DISPLAY THE SCORE
      gameResultElem.classList.add('is-hidden');
      this.gameBoxs.forEach((elem) => elem.classList.remove('is-hidden'));

      if ( this.dropBalls === false ) {
        this.startGame();
      }
     
    });
  }
  

  // TOP 10 PLAYERS CHECKER
  checkTopPlayer ( ) {
    this.playerEndScore = this.playerDetails.score;
    let playerHighScore = this.playerDetails.highScore

    // NEW TOP 10 PLAYER
    if (this.playersList[9].score < this.playerEndScore) {

      this.playersList.pop(); // REMOVE PLAYER 10 FROM THE LIST
      this.playersList.push({ name: localStorage.getItem('playerName'), score: this.playerEndScore, }); // ADD NEW PLAYER

      // REORDER CLASSMENT
      const playersByScore = this.playersList.sort(function (a, b) {
        return b.score - a.score;
      });

      const list = JSON.stringify(playersByScore);

      const xhr = new XMLHttpRequest();
      
      cosnt updateFileUrl = document.location.pathname + 'update.php';

      xhr.open('POST', updateFileUrl, true);

      xhr.setRequestHeader('Content-type', 'application/json');

      xhr.send(list);

      this.playerDetails.highScore = this.playerEndScore;

      localStorage.setItem('highScore', this.playerEndScore);

      this.highScore.textContent = playerHighScore + ' Pts';

      document.querySelector('#win').innerHTML =
        '<img src="./assets/imgs/trophy.jpeg" alt="celebration icon" ><h4>You are a master! Congrats!, Your name stored in Top 10 Players List.</h4>';
      document.querySelector('#game-status .player-score').textContent =
        'Your new high score is: ' + this.playerEndScore + ' pts';

      // SHOW TOP PLAYERS TABLE
      const playersListBtn = document.querySelector('.top-player-show-btn');
      playersListBtn.classList.toggle('is-hidden');

      playersListBtn.addEventListener('click', (e) => {

        e.preventDefault();
        document.getElementById('game-status').classList.toggle('is-hidden');
        this.topPlayersElm.classList.toggle('is-hidden');

      });

    } else {

      //  HIGH SCORE
      if ( ( this.playerEndScore >= playerHighScore ) &&  ( this.playerEndScore > 0 ) ) {

        this.playerDetails.highScore = this.playerEndScore;
        localStorage.setItem('highScore', this.playerEndScore);
        this.highScore.textContent = playerHighScore + ' Pts';

        document.querySelector('#win').innerHTML =
          '<img src="./assets/imgs/celebration.jpeg" alt="celebration icon" ><h4>Congrats! You beat yourself, You have a new record.</h4>';
        document.querySelector('#game-status .player-score').textContent =
          'Your new high score is: ' + this.playerEndScore + ' pts';

      } else {

        document.querySelector('#win').textContent = '';
        document.querySelector('#game-status .player-score').textContent = 'Your score is: ' + this.playerEndScore + ' pts';

      }

    }

  }
}

new Game();
