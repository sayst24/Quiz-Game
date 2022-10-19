const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progress');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const progressBarStreak = document.getElementById('progress-bar-streak');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("questions.json")
  .then(res=>{
    return res.json();
  })
  .then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };
      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
      answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);
      answerChoices.forEach((choice,index) => {
        formattedQuestion["choice"+(index+1)] = choice;
      });
      return formattedQuestion;
    });
    startGame();
  })
  .catch(err=>{
    console.error(err);
    alert('something is wrong. Try reloading');
  })

const CORRECT_BONUS = 10;
const INCORRECT_POINTS = -5;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

getNewQuestion = () => {
  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign("end.html");
  }
  questionCounter ++;
  //progress Bar
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${100*(questionCounter/MAX_QUESTIONS)}%`;
  progressBarStreak.style.width = `${100*(bonusCount/questionCounter)}%`
  if(bonusCount === 1){
    progressBarStreak.style.display = "none";
  }else if (lastAnswer[0]==='incorrect'){
    console.log(lastAnswer);
    progressBarStreak.style.display = "block";
    progressBarStreak.style.backgroundImage = 'linear-gradient(to right, rgba(256,0,0,0), rgba(256,0,0,0.75), rgba(256,0,0,1))';
  }else{
    progressBarStreak.style.display = "block";
    progressBarStreak.style.backgroundImage = 'linear-gradient(to right, rgba(65,184,131,0), rgba(65,184,131,0.75), rgba(65,184,131,1))';
  }

  const questionIndex = Math.floor(Math.random()*availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];

  //show question
  question.style.textAlign = 'left';
  question.style.color = 'black';
  question.innerText = currentQuestion.question;

  //style question
  styleQ = () =>{
    question.style.fontSize = '4.2rem';
    let font = parseFloat(question.style.fontSize)*10;
    while(question.scrollHeight > question.clientHeight){
      font--;
      question.style.fontSize = font/10 + 'rem';
    };
  };
  setTimeout(styleQ, 1);
  startTimer();


  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice'+number];
  })
  availableQuestions.splice(questionIndex,1);
  acceptingAnswers = true;
};


let bonusCount = 1;
let lastAnswer = [bonusCount];
choices.forEach(choice=>{
  choice.addEventListener('click', e=> {
    if(!acceptingAnswers) return;

      localStorage.setItem('scoreThen', score);

      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];

      //checks if answer is correct
      const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

      if(classToApply==='correct'){
        timesUp('something');
      }else{
        timesUp();
      }

      if(!lastAnswer[1]){
        bonusScores(classToApply);
      }else{
        if(classToApply==lastAnswer[0]){
          bonusCount++;
        }else{
          bonusCount = 1;
        }
        bonusScores(classToApply);
      }


      selectedChoice.parentElement.classList.add(classToApply);
      answerSound(classToApply);

      //show how many points added
      localStorage.setItem('scoreNow', score);
      let scoreDif = JSON.parse(localStorage.getItem('scoreNow')) - JSON.parse(localStorage.getItem('scoreThen'));
      let timeBonus = JSON.parse(localStorage.getItem('timeBonus'));
      //style + or -
      if(scoreDif > 0){
        question.innerHTML = `+${(scoreDif - timeBonus)} pts  <span> + ${timeBonus}pts time Bonus</span>`;
        question.style.color = "rgb(65,184,131)";
      }else{
        question.innerText = `${scoreDif} pts`;
        question.style.color = 'red';
      }
      question.style.textAlign = 'center';

      //remove class once clicked
      setTimeout(()=>{
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}


bonusScores = (classToApply)=> {
  if(lastAnswer.length == 1){
    lastAnswer.unshift(classToApply);
    if(classToApply=='correct'){
      incrementScore(CORRECT_BONUS);
    }else{
      incrementScore(INCORRECT_POINTS);
    }
  }else{
    lastAnswer.shift();
    lastAnswer.unshift(classToApply);
    lastAnswer.pop();
    lastAnswer.push(bonusCount);
    if(classToApply=='correct'){
      incrementScore((CORRECT_BONUS*bonusCount));

    }else {
      incrementScore(INCORRECT_POINTS*bonusCount);
    }
  }
}


// audio
  //hover
  const options = document.getElementsByClassName('choice-container');
  Array.from(options).forEach(option => {
    option.addEventListener('mouseover',()=>{makeSound('hover');});
  });
  //correct/incorrect
  function answerSound(classToApply){
  const right = document.getElementById('right');
  const wrong = document.getElementById('wrong');
  if(body.classList.contains('muted')){
    right.muted=true;
    wrong.muted=true;
  }else{
    if(classToApply === 'correct'){
      right.muted=false;
      right.load();
    }else{
      wrong.load();
      wrong.muted=false;
    };
  };
};



//timer
  const timer = document.getElementById('timer-time');
  const TIME_LIMIT = 10;
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;

  timer.innerText = timeLeft;

  let timerInterval;

  function startTimer (){
    path.removeAttribute('class');
    path.classList.add(pathColor);
    path.style.transition = "none";
    timer.innerText = TIME_LIMIT;
    path.setAttribute('stroke-dasharray', 164);
    //ticking function
    function ticking(){
      let tick = document.getElementById('tick');
      makeSound('tick');
      console.log('tick');
      setTimeout(()=>{
        tick.muted = true;
        console.log(tick);
      },500);
    }
    timerInterval = setInterval(()=>{
      ticking();
      path.style.transition = "1s linear all";
      timePassed++;
      timeLeft = TIME_LIMIT - timePassed;
      localStorage.setItem('timeLeft', timeLeft);
      timer.innerText = timeLeft;
      circleTimer();
      setPathColor(timeLeft);
      if(timeLeft === 0){
        console.log('yo');
        timesUp();
        const tooLate= 'incorrect';
        if(!lastAnswer[1]){
          bonusScores(tooLate);
        }else{
          if(tooLate==lastAnswer[0]){
            bonusCount++;
          }else{
            bonusCount = 1;
          };
        };
        bonusScores(tooLate);
        choices.forEach(choice =>{
          choice.parentElement.classList.add(tooLate);
        answerSound(tooLate);
        //remove class once clicked
        setTimeout(()=>{
          choice.parentElement.classList.remove(tooLate);
          }, 1000);
          });
          setTimeout(()=>{
            getNewQuestion();
          },1000);
        };
      }, 1000);
  };

  function timesUp(something){
    document.getElementById('tick').muted = true;
    clearInterval(timerInterval);
    path.style.transition = "none";
    if(something){
      localStorage.setItem('timeBonus',timeLeft);
      incrementScore(timeLeft);
    }else{
      let scoreDif = JSON.parse(localStorage.getItem('scoreNow')) - JSON.parse(localStorage.getItem('scoreThen'));
      question.innerText = `${scoreDif} pts`;
      question.style.color = 'red';
      question.style.textAlign = 'center';
    };
    timeLeft = TIME_LIMIT;
    timePassed = 0;
    timeOver = 'yes';
  }

  const ALERT = 7;
  const WARNING = 5;
  const DANGER = 3;

  const COLOR_CODES = {
    info: {
      color: 'green'
    },
    alert: {
      color: 'yellow',
      threshold: ALERT
    },
    warning: {
      color: 'orange',
      threshold: WARNING
    },
    danger: {
      color: 'red',
      threshold: DANGER
    }
  };

  let pathColor = COLOR_CODES.info.color;
  let path = document.getElementById('time-remaining');

  function calculateTime(){
    let fraction = timeLeft/TIME_LIMIT;
    return fraction - (1/TIME_LIMIT) * (1-fraction);
  };

  function circleTimer(){
    const circleDashArray = `${
      (calculateTime()*164).toFixed(0)
    } 164`;
    path.setAttribute('stroke-dasharray',circleDashArray);
  }

  function setPathColor(timeLeft){
    const {danger, warning, alert, info } = COLOR_CODES;

    if(timeLeft <= danger.threshold){
      path.classList.remove(warning.color);
      path.classList.add(danger.color);
    }else if (timeLeft <= warning.threshold){
      path.classList.remove(alert.color);
      path.classList.add(warning.color);
    }else if (timeLeft <= alert.threshold){
      path.classList.remove(info.color);
      path.classList.add(alert.color);
    }else{
      path.removeAttribute('class');
      path.classList.add(info.color);
    }
  };
