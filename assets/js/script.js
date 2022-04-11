/* VARIABLES DELACRE AREA */
const quizContainerEl = document.querySelector(".quiz-container");
const quizAreaEl = document.querySelector(".quiz-area");
// placeholder for question we are currently quizin
let currentQuestion = {};
let askingQueue = [];
const quizTime = 20;
let timer = 0;
const timerDisplayEl = document.querySelector(".progressBar");
const quizBank = [];
const choices = ["a", "b", "c", "d"];
let userScore = 0;
const questionBarEl = document.querySelector(".questionsBar");
let questionBarTracker = 0;
const userScoreEl = document.querySelector(".userScore");
const stopWatchButton = document.querySelector("#stopWatch");
stopWatchButton.addEventListener("click", timeWatcher);

// sample questions
const q1 = {
  prompt: "What is my fav food?",
  answers: {
    a: "Pizza",
    b: "Tacos",
    c: "Pho",
    d: "Sanwiches",
  },
  correct: "c",
};

const q2 = {
  prompt: "question 2",
  answers: {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
  },
  correct: "c",
};

// this function will load/retrieve quizbank from local storage and shuffle the question order
function dataHandler() {
  // note: JSON doesnt save methods of object

  // quizBank.push(q1);
  /*  quizBank.push(q2);
      localstorage setter -- quizBank
      localStorage.setItem("quizBank", JSON.stringify(quizBank)); */

  // localstorage geter -- quizBank
  const localQuizBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  console.log("LOCAL QUIZ BANK");
  // console.table(localQuizBank);
  askingQueue = localQuizBank;
  shuffleArray(askingQueue);
  console.table(askingQueue);
}

/* QUIZ FORM - DISPLAY + INPUT HANDLING */
function displayCurrentQuestion(pCurrentQuestion) {
  // this function will take a question - Object -
  // console.log(currentQuestion);
  if (Object.keys(pCurrentQuestion).length !== 0) {
    // shuffle answers' order - example [b,c,d,a]
    const answerOrder = shuffleAnswers();

    // crafting template literal with currentquestion data
    let htmlTemplate = `
         <pre class='animate__animated animate__lightSpeedInLeft' style="font-size:1.3rem;line-height:1.5;">${pCurrentQuestion.prompt}</pre>
         <hr class='animate__animated animate__lightSpeedInLeft'/>
         <div class='multipleChoices'>
     `;
    for (let i = 0; i < answerOrder.length; i++) {
      htmlTemplate += `
         <button class='userPick button animate__animated animate__lightSpeedInLeft' 
         data-selected='${answerOrder[i]}'>
         ${pCurrentQuestion.answers[answerOrder[i]]}
         </button>
         </br>
         `;
    }
    htmlTemplate += `</div>`;

    // display to the HTML's .quiz-area
    quizAreaEl.innerHTML = htmlTemplate;
  } else {
    return;
  }
}

// listen to the whole container of current question and answers
quizAreaEl.addEventListener("click", submitAnswerHandler);
// Get user's answer - class activity 19 week 4 logic
function submitAnswerHandler(event) {
  let element = event.target;
  // validate only if user click on a button in this container
  if (element.matches("button")) {
    //grab user's choice
    let choice = element.dataset.selected;
    // console.log(choice);

    if (isCorrect(choice)) {
      // console.log("Correct answer - handle logic when user pick right answer.");
      // display feedback right
      // reward user 2s
      // update score
      // queue in the next question

      displayUserScore("correct", 5, 10);
      questionBarEl.children[questionBarTracker].classList.add("greenBG");
      questionBarTracker++;
      askingQueue.shift();
      askQuestion();
    } else {
      // console.log("wrong answer - handle logic when user picks wrong answers");
      // display "wrong"
      // minus 5s on the time counter
      // updatescore
      // queue in the next question
      questionBarEl.children[questionBarTracker].classList.add("redBG");
      questionBarTracker++;
      displayUserScore("wrong", 2, 5);
      askingQueue.shift();
      askQuestion();
    }
  }
}

// this will return an array of answer but in random order
function shuffleAnswers() {
  let pChoices = choices;
  for (let i = pChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pChoices[i], pChoices[j]] = [pChoices[j], pChoices[i]];
  }
  return pChoices;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isCorrect(input) {
  return input === currentQuestion.correct ? true : false;
}

function askQuestion() {
  if (askingQueue.length !== 0 && timer > 0) {
    currentQuestion = askingQueue[0];
    displayCurrentQuestion(currentQuestion);
  } else {
    quizAreaEl.innerHTML = "<h2>Holla! You answer very quick!</h2>";
    timer=1;
    questionBarTracker = 0;
  }
}

function finalScoreDisplay() {
  let pHTMLtemplate =`
  <form id="username-form">
  <label for="username-text" class="${userScore>=0? 'green':'red'}"> You scored ${userScore} pts! </label> <br/>
  <input type="text" placeholder="Enter your name" name="username" id="username-text" />
  <hr style='margin: 30px auto;'/>
  ${userScore>0? '<h3 class="green">Keep it up!</h3>':'<h3 class="red">TRY AGAIN! Practice makes perfect!</h3>'}
  
  </form>
  `;
  quizAreaEl.innerHTML = pHTMLtemplate;
  document.querySelector('#username-form').addEventListener('submit',function(e){
    e.preventDefault();
    let username = document.querySelector('#username-text');
    let localRank = JSON.parse(localStorage.getItem('ranks')) || [];
    localRank.push([username.value,userScore]);
    localStorage.setItem('ranks',JSON.stringify(localRank));
    username.value = '';
    quizAreaEl.innerHTML = `<div class='green'><p>Your score has been saved!</p> <p>Click the ranking button to see the records!</p></div>`;
    return;
  });

}


function init() {
  updateTimerDisplay(0, 0, false);
  dataHandler();
  askQuestion();
}

init();

function displayUserScore(op = "", ptime = 0, pscore = 0) {
  if (op == "correct") {
    userScore += pscore;
    timer += ptime;
  } else if (op == "wrong") {
    userScore -= pscore;
    timer -= ptime;
  }
  userScoreEl.innerHTML = `<div class='scoreDiv'><p>Scores</p><div class='animate__animated animate__tada ${
    userScore >= 0 ? "green" : "red"
  }'>${userScore} ${
    userScore == 1 || userScore == 0 ? " pt" : " pts"
  }</div></div>`;
}

/* TIMER / COUNTER - Time handling*/

const stopWatchIcon = document.querySelector(".fa-solid.fa-stopwatch");
function timeWatcher() {
  stopWatchButton.disabled = true;
  stopWatchIcon.className += " fa-beat";
  timer = quizTime;
  userScore = 0;
  hideAbsoluteEl(viewRankViewEl);
  hideAbsoluteEl(addQuestioFormEl);
  hideAbsoluteEl(listQuesitonViewEl);
  showAbsoluteEl(quizAreaEl);

  dataHandler();
  askQuestion();
  displayUserScore();
  //update the number of question bar
  let questionBarHTML = ``;
  for (let i = 0; i < askingQueue.length; i++) {
    questionBarHTML += `<div class="qfill">.</div>`;
  }
  questionBarEl.innerHTML = questionBarHTML;
  const questionBarCSSStyle = `visibility:visible; grid-template-columns: repeat(${askingQueue.length},1fr)`;
  questionBarEl.setAttribute("style", questionBarCSSStyle);

  const everyMinute = setInterval(() => {
    timer--;
    updateTimerDisplay(quizTime, timer, true);

    if (timer <= 0) {
      updateTimerDisplay(quizTime, timer, false);
      finalScoreDisplay();
      clearInterval(everyMinute);
      stopWatchIcon.className = "fa-solid fa-stopwatch";
      questionBarTracker = 0;
    }
  }, 1000);
}
function updateTimerDisplay(maxTime, timeLeft, isRunning) {
  let htmlTemplate = ``;
  if (isRunning == true) {
    htmlTemplate = `
      <label for='timer' class='${
        timeLeft > (quizTime * 2) / 3
          ? "green"
          : timeLeft > quizTime / 3
          ? "yellow"
          : "red"
      }' style="width:80px;">
        <span style='font-size:2rem;'>${timeLeft}</span> 
        <i class="fa-solid fa-hourglass animate__animated animate__rotateIn"></i> 
      </label>
      <progress id='timer' value='${timeLeft}' max='${maxTime}'></progress>
    `;
  } else {
    htmlTemplate = `<p> <-- Click to play again</p`;
    stopWatchButton.disabled = false;
  }
  timerDisplayEl.innerHTML = htmlTemplate;
}

/* ADDING QUESTION FORM */
document
  .querySelector("#addQuestion")
  .addEventListener("click", addQuestionToBank);

function addQuestionToBank() {
  // target all the form's inputs and get their value
  const q = document.querySelector("#addPrompt").value;
  const a = document.querySelector("#addAnswerA").value;
  const b = document.querySelector("#addAnswerB").value;
  const c = document.querySelector("#addAnswerC").value;
  const d = document.querySelector("#addAnswerD").value;
  // except this one because we need to clear it later with seletedIndex,
  // it will be more efficient if we only get element ( not its direct value)
  const correct = document.querySelector("#correctAnswer");

  // create a new question object based on whatever user put into the form
  const newQuestion = {
    prompt: q,
    answers: {
      a: a,
      b: b,
      c: c,
      d: d,
    },
    correct: correct.value,
  };
  /* // add question to the localstorage by 
          retreiving/parsing localstoreage string, 
          adding question to array, 
          stringtify and store it back to localstorage
  */
  let localBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  localBank.push(newQuestion);
  localStorage.setItem("quizBank", JSON.stringify(localBank));

  // clear or reset input values
  const inputs = document.querySelectorAll(".addQuestionForm input");
  // console.log(inputs);
  inputs.forEach((input) => {
    input.value = "";
  });
  document.querySelector('#addPrompt').value = "";
  correct.selectedIndex = 0;
  // end clearing
}
const viewRankViewEl = document.querySelector(".viewRankView");
const addQuestioFormEl = document.querySelector(".addQuestionForm");
const listQuesitonViewEl = document.querySelector('.listQuestionView');

document
  .querySelector(".addQuestionButton")
  .addEventListener("click", showAddQuestionForm);
function showAddQuestionForm() {
  timer = 0;
  hideAbsoluteEl(viewRankViewEl);
  hideAbsoluteEl(quizAreaEl);
  hideAbsoluteEl(listQuesitonViewEl);
  showAbsoluteEl(addQuestioFormEl);
}
document.querySelector('.listQuestionsButton').addEventListener('click',displayAllQuestions);
function displayAllQuestions(){
  timer = 0;
  hideAbsoluteEl(viewRankViewEl);
  hideAbsoluteEl(quizAreaEl);
  hideAbsoluteEl(addQuestioFormEl);
  showAbsoluteEl(listQuesitonViewEl);

  let pHTMLtemplate=``;
  let localQuizBank = JSON.parse(localStorage.getItem('quizBank')) || [];
  if(localQuizBank.length!=0){
    for( let i =0; i< localQuizBank.length;i++){
      pHTMLtemplate += `
      <hr/>
      <section style='display:flex; gap:2rem; align-items:start; padding: 10px 5px;'>
      <button class='button red trashQuestionButton' style="margin-top:0px;" data-index='${i}'><i class="fa-regular fa-trash-can" data-index='${i}'></i></button>    
      <header style='min-width:200px;'><p class='green'>${localQuizBank[i].prompt}</p></header>
          <ul>
            <li>A. ${localQuizBank[i].answers.a}</li>
            <li>B. ${localQuizBank[i].answers.b}</li>
            <li>C. ${localQuizBank[i].answers.c}</li>
            <li>D. ${localQuizBank[i].answers.d}</li>
          </ul>
          
      </section>    
      `;
    }
  }
  else{
    pHTMLtemplate=`<h2>There is nothing to see here!!!</h2>
    <p>Click the + button to add questions onto quiz bank.</p>
    `;
  }
  listQuesitonViewEl.innerHTML =pHTMLtemplate;
  document.querySelector('.listQuestionView').addEventListener('click',function(e){
      let pElement = e.target;  
    if(pElement.matches('.trashQuestionButton') || pElement.matches('.trashQuestionButton i')){
      localQuizBank.splice(pElement.dataset.index,1);
      localStorage.setItem('quizBank',JSON.stringify(localQuizBank));    
    }
    displayAllQuestions();
      return;
  });

}



document
  .querySelector(".viewRanksButton")
  .addEventListener("click", displayRanksView);
function displayRanksView() {
  timer=0;
  hideAbsoluteEl(addQuestioFormEl);
  hideAbsoluteEl(quizAreaEl);
  hideAbsoluteEl(listQuesitonViewEl);
  showAbsoluteEl(viewRankViewEl);
  let pHTMLtemplate=`<p style='font-size:2rem; font-weight:400; margin-bottom:10px;'>Ranking</p><hr/>`;
  let ranks = JSON.parse(localStorage.getItem('ranks')) || [['You will be the first!',0]];
  ranks.sort(function(a,b){
    return b[1]-a[1];
  });
  for (let i = 0; i<ranks.length;i++) {
    pHTMLtemplate += `<div style='display:flex; justify-content: space-between;padding:10px;${i%2==0?'background-color:#292b2b;':''} '> 
    <div>${ranks[i][0]} </div> <div class='${ranks[i][1]>0?'green':'red'}'>${ranks[i][1]}  pts</div>
    
    </div>`
  }

  viewRankViewEl.innerHTML = pHTMLtemplate;
}

function hideAbsoluteEl(pElement) {
  pElement.classList.remove("animate__backInUp");
  pElement.classList.add("animate__backOutDown");
  pElement.setAttribute("style", "display:none;");
}
function showAbsoluteEl(pElement) {
  pElement.setAttribute("style", "display:block;");
  // pElement.setAttribute('style','left:0;');
  pElement.classList.remove("animate__backOutDown");
  pElement.classList.add("animate__backInUp");
}

document.querySelector(".stopButton").addEventListener("click", function () {
  timer = 0;
});
