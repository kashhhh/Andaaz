//Circles should not go outside screen
const userHeight= window.innerHeight-100;
const userWidth= window.innerWidth-100;

const newGameBtn=document.querySelector('.newGameBtn');
const playAgainBtn=document.querySelector('.playAgainBtn');
const timer=document.querySelector('.timer');
const timeInput=document.querySelector('.timeInput');
const timerDiv=document.querySelector('.giveTime');

//console.log(userWidth,userHeight);

//Will keep track of circle ids
const createdCircleIDs=[]

let createCounter=1;
let score=0;
let d=new Date();
let spawnInt,destroyInt;
let startDate,dateFormula,timeInputSet;

function makeCircles(xCoordinate,yCoordinate){
  const body=document.querySelector('.screen');
  const tempDiv=document.createElement('div');

  //HTML for circles
  tempDiv.innerHTML+=
  `<div class="zeroCircle circle" id='${createCounter}'>
    <div class="oneCircle circle">
      <div class="twoCircle circle">
      </div>
    </div>
  </div>`
  //positions the div according to co-ordinates
  tempDiv.style.position="absolute";
  tempDiv.style.left = xCoordinate+'px';
  tempDiv.style.top = yCoordinate+'px';

  body.appendChild(tempDiv);

  //pushes into id array
  createdCircleIDs.push(createCounter);
  createCounter++;
}

function getBestScore(scr)
{
  let bestScore;
  if(localStorage.getItem('bestScore')===null){
    bestScore=0;
  }
  else{
    bestScore=JSON.parse(localStorage.getItem('bestScore'));
  }
  if(scr>localStorage.getItem('bestScore')){
    localStorage.setItem('bestScore', JSON.stringify(scr));
  }
}

function destroyCircles(){
  gameOver();
  

  //console.log('abc', createdCircleIDs);
  if(document.getElementById(`${createdCircleIDs[0]}`))
  {
    const divToDestroy=document.getElementById(`${createdCircleIDs[0]}`);
    divToDestroy.remove();
    createdCircleIDs.shift();
  }
}

function spawnCircles(){
  updateTimer();
  gameOver();

  //Genereates random height and width and makes circle
  const randomHeight=Math.floor(Math.random()*userHeight);
  const randomWidth=Math.floor(Math.random()*userWidth);

  makeCircles(randomWidth,randomHeight);
}

function addToScore(circleClass)
{
  //Check which class is clicked on
  const scoreBoard=document.querySelector('.score');
  if(circleClass.includes('one'))
  {
    score+=1;
  }
  else if(circleClass.includes('two'))
  {
    score+=2;
  }
  scoreBoard.textContent=`Score: ${score}`;
}

document.addEventListener('click', (e) => {
  //Gets where clicked
  addToScore(e.target.className);
  if(e.target.className.includes('circle'))
  {
    let bigCircle=e.target;
    //Get target down to bigger circle
    while(!bigCircle.className.includes('zeroCircle'))
    {
      bigCircle=bigCircle.parentElement;
    }
    
    //Finds index of id in array and delete
    let circleIndex=createdCircleIDs.indexOf(parseInt(bigCircle.id));
    if(circleIndex>=0)
    {
      createdCircleIDs.splice(circleIndex,1);
    }
    //console.log(createdCircleIDs);
    bigCircle.remove();

  }
});

function updateTimer()
{
  d=new Date();
  dateFormula=Math.floor((d.getTime()-startDate)/1000)
  timer.textContent=`Timer: ${timeInputSet-dateFormula}s`;
}

function gameOver(){
  const scoreDescription= document.querySelector('.modal-body');
  updateTimer();
  if(dateFormula>=timeInputSet)
  {
    getBestScore(score);
    bestScore=localStorage.getItem('bestScore');
    $('#playAgain').modal();
    scoreDescription.textContent=`Score: ${score}`;
    scoreDescription.innerHTML=
    `<div class='currentScore'>Score: ${score}</div>
    <br>
    <div class='bestScore'>Best: ${bestScore}</div>`

    window.clearInterval(spawnInt);
    window.clearInterval(destroyInt);
  }
}

function newGame()
{
  document.querySelectorAll('.zeroCircle').forEach((circle) => {
    circle.remove();
  });
  newGameBtn.remove();
  
  score=0;

  spawnInt=window.setInterval(spawnCircles,500);
  destroyInt=window.setInterval(destroyCircles,3000);
  d=new Date();
  startDate=d.getTime();
  //console.log(startDate);
}


newGameBtn.addEventListener('click',() => {
  timeInputSet=parseInt(timeInput.value);
  if(timeInputSet >= 60)
  {
    timeInputSet=60;
  }
  else if(timeInputSet <= 10)
  {
    timeInputSet =10;
  }
  else{
    timeInputSet=20;
  }
  timerDiv.remove();
  newGame();
});


playAgainBtn.addEventListener('click',newGame);

