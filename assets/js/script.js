console.log("script is hooked up");

const quizContainerEl = document.querySelector(".quiz-container");
const quizAreaEl = document.querySelector(".quiz-area");
// placeholder for question we are currently quizin
let currentQuestion = {};
let askingQueue = [];


const quizBank = [];
const choices = ["a", "b", "c", "d"];
const q1 = {
  prompt: "What is my fav food?",
  answers: {
    a: "Pizza",
    b: "Tacos",
    c: "Pho",
    d: "Sanwiches",
  },
  correct: "c"
};

const q2 = {
  prompt: "question 2",
  answers: {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
  },
  correct: "c"
};

function dataHandler() {
  // note: JSON doesnt save methods of object

  quizBank.push(q1);
/*   quizBank.push(q2);

//   localstorage setter -- quizBank
  localStorage.setItem("quizBank", JSON.stringify(quizBank)); */

  // localstorage geter -- quizBank
  const localQuizBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  console.log("LOCAL QUIZ BANK");
  console.table(localQuizBank);
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
      askingQueue.shift();
      askQuestion();

    } else {
      console.log("wrong answer - handle logic when user picks wrong answers");
      // display "wrong"
      // minus 5s on the time counter
      // updatescore
      // queue in the next question
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

function isCorrect(input){
    return input === currentQuestion.correct? true :false;
}

function askQuestion(){
    if(askingQueue.length!==0){
        currentQuestion = askingQueue[0];
        displayCurrentQuestion(currentQuestion);

    }else{
        quizAreaEl.textContent = 'No Question';
    }
}


function init(){
    dataHandler();
    askQuestion();
}

init();



document.querySelector('#addQuestion').addEventListener('click', addQuestionToBank);

function addQuestionToBank(){
    const q = document.querySelector('#addPrompt').value;
    const a = document.querySelector('#addAnswerA').value;
    const b = document.querySelector('#addAnswerB').value;
    const c = document.querySelector('#addAnswerC').value;
    const d = document.querySelector('#addAnswerD').value;
    const correct = document.querySelector('#correctAnswer');
    console.log(correct);

    const newQuestion = {prompt: q,
    answers: {
      'a': a,
      'b':b,
      'c':c,
      'd':d,
    },
    correct: correct.value
  };
  let localBank = JSON.parse(localStorage.getItem('quizBank')) || [];
  localBank.push(newQuestion);
  localStorage.setItem('quizBank', JSON.stringify(localBank));
  const inputs = document.querySelectorAll('.addQuestionForm input');
  console.log(inputs);
  inputs.forEach(input => {
      input.value = '';
  });
  correct.selectedIndex=0;

}