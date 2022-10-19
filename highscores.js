const highScoresList = document.getElementById('highscore-list');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const newScore = JSON.parse(localStorage.getItem('newScore'));

highScoresList.innerHTML = highScores.map(score=>{
  return`
  <tr class="high-score">
    <td class="rank">${highScores.indexOf(score) + 1}</td>
    <td class="name">${score.name}</td>
    <td>${score.score}</td>
  </tr>
  `;
}).join("");

let counter = 1;
highScores.map(score=>{
  if(JSON.stringify(score) === JSON.stringify(newScore)){
    let rank = highScores.indexOf(score);
    highScoresList.rows[rank].style.animation = 'newScore 2s forwards';
    setTimeout(()=>{makeSound('boom');},500);
  }else{
    counter++;
  }
  if(counter > highScores.length){
    highScoresList.innerHTML +=
      ` <tr id="placeholder">
        </tr>
        <tr id = "new-score">
          <td></td>
          <td class="name">${newScore.name}</td>
          <td class="score">${newScore.score}</td>
        </tr>
        `
  }
});

//delete new score after exit
window.addEventListener('unload',()=>{
  localStorage.removeItem('newScore');
})
