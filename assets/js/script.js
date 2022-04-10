/* VARIABLES DELACRE AREA */
const quizContainerEl = document.querySelector(".quiz-container");
const quizAreaEl = document.querySelector(".quiz-area");
// placeholder for question we are currently quizin
let currentQuestion = {};
let askingQueue = [];
const quizTime = 10;
let timer = 0;
const timerDisplayEl = document.querySelector(".progressBar");
const quizBank = [];
const choices = ["a", "b", "c", "d"];
let userScore = 0;

const userScoreEl = document.querySelector('.userScore');
const stopWatchButton = document.querySelector('#stopWatch');
stopWatchButton.addEventListener('click', timeWatcher);

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
         <h2>${pCurrentQuestion.prompt}</h2>
         <div class='multipleChoices'>
     `;
    for (let i = 0; i < answerOrder.length; i++) {
      htmlTemplate += `
         <button class='userPick button' data-selected='${answerOrder[i]}'>${
        pCurrentQuestion.answers[answerOrder[i]]
      }</button>
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
    console.log(choice);

    if (isCorrect(choice)) {
      console.log("Correct answer - handle logic when user pick right answer.");
      // display feedback right
      // reward user 2s
      // update score
      // queue in the next question
      timer +=5;
      userScore +=10;
      displayUserScore();
      askingQueue.shift();
      askQuestion();
    } else {
      console.log("wrong answer - handle logic when user picks wrong answers");
      // display "wrong"
      // minus 5s on the time counter
      // updatescore
      // queue in the next question
      timer -=2;
      userScore -=5;
      displayUserScore();
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
  if (askingQueue.length !== 0 && timer>0) {
    currentQuestion = askingQueue[0];
    displayCurrentQuestion(currentQuestion);
  } else {
    quizAreaEl.textContent = "No Question";
  }
}

function finalScoreDisplay(){
  quizAreaEl.innerHTML = `
    <p>Display userScore and ask if they want to add to records</p>
  `;
}

function init() {
  updateTimerDisplay(0,0,false);
  dataHandler();
  askQuestion();
  
}

init();

function displayUserScore(){
  userScoreEl.innerHTML = `<h5>Score: ${userScore}</h5>`;
}

/* TIMER / COUNTER - Time handling*/


function timeWatcher() {
  stopWatchButton.disabled = true;
  timer = quizTime;
  userScore = 0;
  askQuestion();
  displayUserScore();
  const everyMinute = setInterval(() => {
    timer--;
    updateTimerDisplay(quizTime, timer,true);

    if (timer <= 0) {
      updateTimerDisplay(quizTime, timer,false);
      finalScoreDisplay()
      clearInterval(everyMinute);
    }
  }, 1000);
}
function updateTimerDisplay(maxTime, timeLeft, isRunning) {
  let htmlTemplate =``
  if (isRunning == true) {
    htmlTemplate = `
      <label for='timer'>${timeLeft} s</label>
      <progress id='timer' value='${timeLeft}' max='${maxTime}'></progress>
    `;
   
  }
  else{
    htmlTemplate = `<p> NO TIME LEFT</p`;
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
  console.log(inputs);
  inputs.forEach((input) => {
    input.value = "";
  });
  correct.selectedIndex = 0;
  // end clearing
}
