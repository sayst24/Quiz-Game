const body = document.querySelector('body');
localStorage.setItem('body',body);
//body.classList.add('muted');
//create buttons to other pages
function linkingButtons(){
  let anchors = Array.from(document.querySelectorAll('a'));
  let ids = anchors.map(anchor => anchor.id);
  anchors.forEach((anchor, index)=>{
    anchor.addEventListener('click',()=>{
      let id = ids[index];
      changeLocation = () =>{
        window.location.assign(id);
      };
      if(body.classList.contains('muted')){
        changeLocation();
      }else{
        document.getElementById('click').load();
        document.getElementById('click').muted=false;
        setTimeout(changeLocation, 500);
      }
    })
  });
}
linkingButtons();
//create audio
let audioDiv = document.createElement('div');
audioDiv.innerHTML= "<audio id='hover' src='audio/hover.mp3' muted='true' autoplay></audio> <audio id='click' src='audio/click.mp3' muted='true' autoplay></audio>";
document.body.appendChild(audioDiv);

//get buttons to add sound
const buttons = Array.from(document.querySelectorAll('a.button'));

function makeSound(id){
  if(Array.from(body.classList)[0] !== 'muted'){
    document.getElementById(id).load();
    document.getElementById(id).muted=false;
  };
}
//add audio to each button
buttons.forEach(button=>{
  //when hover
  button.addEventListener('mouseover', ()=>{
    makeSound('hover');
  });
  //when clicked
  button.addEventListener('click', ()=>{
    makeSound('click');
  });
});

//get mute button
const muteBtn = document.querySelector('.audio-button');
const muteIcon = document.querySelectorAll('.muteIcon');
//hover
muteBtn.addEventListener('mouseover',()=>{
  makeSound('hover');
})
//switch between audio and mute
muteBtn.addEventListener('click', ()=>{
  if(muteIcon[0].classList.contains('hidden')){
    muteIcon[0].classList.remove('hidden');
    muteIcon[1].classList.add('hidden');
    document.getElementById('click').load();
    document.getElementById('click').muted=false;
    localStorage.setItem('mute', false);
    body.classList.remove('muted');
  }else{
    muteIcon[1].classList.remove('hidden');
    muteIcon[0].classList.add('hidden');
    document.getElementById('click').muted=true;
    localStorage.setItem('mute', true);
    body.classList.add('muted');
  };
});

autoMuteBtn = () => {
  let muted = localStorage.getItem('mute');
  if(muted=='true'){
    body.classList.add('muted');
    muteIcon[1].classList.remove('hidden');
    muteIcon[0].classList.add('hidden');
  }else{
  body.classList.remove('muted');
  muteIcon[0].classList.remove('hidden');
  muteIcon[1].classList.add('hidden');
  };
};

window.addEventListener('load',autoMuteBtn);


//make sure audio is loaded
if(window.location.pathname !== '/game.html'){
  window.addEventListener('load', load);
};
function load(){
  let url = document.querySelectorAll('.container div')[1].id;
  document.getElementById(url).classList.remove('hidden');
  document.getElementById('loader').classList.add('hidden');
};
