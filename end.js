const username = document.getElementById('username');
const saveScoreButton = document.getElementById('saveScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const finalScore = document.getElementById('finalScore');
const highscores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

localStorage.setItem('match', false);
let match = localStorage.getItem('match');

finalScore.innerText = mostRecentScore;

usernameInput = () =>{
  username.addEventListener('keyup',()=>{
    saveScoreButton.disabled = !username.value;
    for(let i=0; i<highscores.length; i++){
      if(highscores[i].name === username.value){
        match = true;
        break;
      }else{
        match = false;
      };
    };
  });
};
usernameInput();
saveHighScore = (e) => {
  e.preventDefault();
  if(match){
    alert('This username already exists. Please pick a new username.');
    username.value = '';
    usernameInput();
  }else{
    const score = {
      score: mostRecentScore,
      name: username.value
    };
    localStorage.setItem('newScore',JSON.stringify(score));
    highscores.push(score);
    highscores.sort((a,b) => b.score - a.score);
    highscores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highscores));
    makeSound('click');
    setTimeout(()=>{window.location.assign("highscores.html");},1000)
  }
};

//audio
window.addEventListener('load',()=>{
  makeSound('final');
});
username.addEventListener('keydown',()=>{
  makeSound('type');
})
saveScoreButton.addEventListener('mouseover', ()=>{
  if(saveScoreButton.disabled == false){
    makeSound('hover');
  };
})
