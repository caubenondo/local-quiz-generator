/* VARIABLES DELACRE AREA */
const quizContainerEl = document.querySelector(".quiz-container");
const quizAreaEl = document.querySelector(".quiz-area");
const timerDisplayEl = document.querySelector(".progressBar");
const questionBarEl = document.querySelector(".questionsBar");
const userScoreEl = document.querySelector(".userScore");
// placeholder for question we are currently quizin

// const quizBank = [];
// choices array is for answer shuffling purpose
const choices = ["a", "b", "c", "d"];
// Countdown time starter - change it when you need more time
const quizTime = 20;

// VIEW Constants of RANK page, Add question page, All Questions page
const viewRankViewEl = document.querySelector(".viewRankView");
const addQuestioFormEl = document.querySelector(".addQuestionForm");
const listQuesitonViewEl = document.querySelector(".listQuestionView");

const stopWatchButton = document.querySelector("#stopWatch");
stopWatchButton.addEventListener("click", timeWatcher);

// tracker for question pagination bar
let questionBarTracker = 0;
// tracker for user's score
let userScore = 0;
// tracker for stop watch
let timer = 0;
// tracker of current question for question display
let currentQuestion = {};
// tracker of question queue for quizz session - first in first out
let askingQueue = [];

/* // Dummy sample questions to establish a question OBJ
const q1 = {
  prompt: "What is my fav food?",
  answers: {
    a: "Pizza",
    b: "Tacos",
    c: "Pho",
    d: "Sanwiches",
  },
  correct: "c",
  isCorrect:function(input){
    return input === this.correct? true: false;
  }
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
}; */

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
      console.log(questionBarTracker);
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
// shuffle an array by swapping random index
// kinda reverse merge sort - algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// check if the user input match correct answer
// return boolean
function isCorrect(input) {
  return input === currentQuestion.correct ? true : false;
}

// prompt them the 'what your name' prompt form, then store it to local storage
function finalScoreDisplay() {
  let pHTMLtemplate = `
  <form id="username-form">
  <label for="username-text" class="${
    userScore >= 0 ? "green" : "red"
  }"> You scored ${userScore} pts! </label> <br/>
  <input type="text" placeholder="Enter your name" name="username" id="username-text" />
  <hr style='margin: 30px auto;'/>
  ${
    userScore > 0
      ? '<h3 class="green">Keep it up!</h3>'
      : '<h3 class="red">TRY AGAIN! Practice makes perfect!</h3>'
  }
  </form>
  `;
  quizAreaEl.innerHTML = pHTMLtemplate;

  // listen to the form submit button, update the records with user input
  document
    .querySelector("#username-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      let username = document.querySelector("#username-text");
      let localRank = JSON.parse(localStorage.getItem("ranks")) || [];
      localRank.push([username.value, userScore]);
      localStorage.setItem("ranks", JSON.stringify(localRank));
      username.value = "";
      let templateHTML = `<h2>Entries</h2>`;
      for (const i of localRank) {
        templateHTML += `<hr> 
          <section style='display:flex; justify-content: space-between; margin:10px auto; ${
            localRank.indexOf(i) == localRank.length - 1
              ? "background-color: #252525; padding:10px 5px;"
              : ""
          }'>
            <div>${localRank.indexOf(i)+1}. ${i[0]}</div>
            <div>${i[1]} pts</div>
          </section>
        `;
      }
      // render
      quizAreaEl.innerHTML = templateHTML;

      return;
    });
}

// this function will validate if the user choose the right answer in quiz session or not
function displayUserScore(op = "", ptime = 0, pscore = 0) {
  // if correct, reward user. if wrong, punish user
  if (op == "correct") {
    userScore += pscore;
    timer += ptime;
  } else if (op == "wrong") {
    userScore -= pscore;
    timer -= ptime;
  }
  // Render user scores on the nav bar
  userScoreEl.innerHTML = `<div class='scoreDiv'><p>Scores</p><div class='animate__animated animate__tada ${
    userScore >= 0 ? "green" : "red"
  }'>${userScore} ${
    userScore == 1 || userScore == 0 ? " pt" : " pts"
  }</div></div>`;
}

/* TIMER / COUNTER - Time handling
  THIS IS AN IMPORTANT FUNCTION
  It is called when user want to start the quiz
*/

const stopWatchIcon = document.querySelector(".fa-solid.fa-stopwatch");
function timeWatcher() {
  // disable the play/start quiz button, add animation to it
  stopWatchButton.disabled = true;
  stopWatchIcon.className += " fa-beat";
  // assign global const quizTime to global and changing timmer
  // Start Counting down
  timer = quizTime;
  // reset global user score
  userScore = 0;
  // show and hide views
  hideAbsoluteEl(viewRankViewEl);
  hideAbsoluteEl(addQuestioFormEl);
  hideAbsoluteEl(listQuesitonViewEl);
  showAbsoluteEl(quizAreaEl);

  // load the questions to the askingQueue
  dataHandler();
  // load the first question of the askingQueue to currentQuestion
  askQuestion();
  // display userScore
  displayUserScore();
  //update the question pagination (the bar below nav), fill it up with empty divs
  let questionBarHTML = ``;
  for (let i = 0; i < askingQueue.length; i++) {
    questionBarHTML += `<div class="qfill">.</div>`;
  }
  questionBarEl.innerHTML = questionBarHTML;
  //take advantage of css grid to divide the pagination bar evently
  const questionBarCSSStyle = `visibility:visible; grid-template-columns: repeat(${askingQueue.length},1fr)`;
  questionBarEl.setAttribute("style", questionBarCSSStyle);

  // THIS IS THE TIMER - run it every second
  // all it does it updating the timer value
  const everyMinute = setInterval(() => {
    timer--;
    updateTimerDisplay(quizTime, timer, true);

    if (timer <= 0) {
      // if timer = 0, then
      // stop the progress bar and counddownt
      updateTimerDisplay(quizTime, timer, false);
      // show the "enter your name" and score form
      finalScoreDisplay();
      // clear the interval
      clearInterval(everyMinute);
      // remove the animation on the stop watch button
      stopWatchIcon.className = "fa-solid fa-stopwatch";
      // reset the current question index tracker
      questionBarTracker = 0;
    }
  }, 1000);
}
// this function is in charge of the progress bar and timer display
function updateTimerDisplay(maxTime, timeLeft, isRunning) {
  let htmlTemplate = ``;
  if (isRunning == true) {
    // if boolean isRunning is true
    // then render the time left and progress bar
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
    // display a general message when the timer is not running
    htmlTemplate = `<p style='text-align:center;'> Click the STOP WATCH to play!</p`;
    stopWatchButton.disabled = false;
  }
  timerDisplayEl.innerHTML = htmlTemplate;
}

/* ADDING QUESTION FORM */
document
  .querySelector("#addQuestion")
  .addEventListener("click", addQuestionToBank);

// this function take user inputs in the add question form and store new question object to the localstorage quizBank
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
  // grab the quizBank from localstorage
  let localBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  // push the new quesiton object to quizBank array
  localBank.push(newQuestion);
  // store the quizbank back into localstorage
  localStorage.setItem("quizBank", JSON.stringify(localBank));

  // Clear or reset input values on the form
  const inputs = document.querySelectorAll(".addQuestionForm input");
  // console.log(inputs);
  inputs.forEach((input) => {
    input.value = "";
  });
  document.querySelector("#addPrompt").value = "";
  correct.selectedIndex = 0;
  // end clearing
}

/* VIEW PAGE SESSION where we display the particilar page when user click on nav item
    Overall, these functions 
    listen to the nav button click
    reset the timer to 0
    show 1 page view and hide the others
    then render components for that page view
*/
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

document
  .querySelector(".listQuestionsButton")
  .addEventListener("click", displayAllQuestions);
function displayAllQuestions() {
  // show list of Question view, hide the other views
  timer = 0;
  hideAbsoluteEl(viewRankViewEl);
  hideAbsoluteEl(quizAreaEl);
  hideAbsoluteEl(addQuestioFormEl);
  showAbsoluteEl(listQuesitonViewEl);
  // delcare an empty tempalte string
  let pHTMLtemplate = `<h2>Question Bank</h2>`;
  // get data/questions from the local storage
  let localQuizBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  // render if quizBank is not emppty
  if (localQuizBank.length != 0) {
    for (let i = 0; i < localQuizBank.length; i++) {
      // load questions to the HTML string with the delete button to remove the unwanted question
      pHTMLtemplate += `
      <hr/>
      <section style='display:flex; gap:2rem; align-items:start; padding: 10px 5px;'>
      <button class='button red trashQuestionButton' style="margin-top:0px;" data-index='${i}'><i class="fa-regular fa-trash-can" data-index='${i}'></i></button>    
      <header style='min-width:200px;'>
      <p style="font-size:1.5rem; font-weight:400; color:#6f6f6f;">#${
        i + 1
      } </p>
        <pre >${localQuizBank[i].prompt}</pre>
      </header>
          <ul>
            <li>A. ${localQuizBank[i].answers.a}</li>
            <li>B. ${localQuizBank[i].answers.b}</li>
            <li>C. ${localQuizBank[i].answers.c}</li>
            <li>D. ${localQuizBank[i].answers.d}</li>
          </ul>
          
      </section>    
      `;
    }
  } else {
    // this block will handle situation when there is no question in the bank to load
    pHTMLtemplate = `<h2>There is nothing to see here!!!</h2>
    <p>Click the <span><i class="fa-solid fa-folder-plus"></i> </span>button to add questions onto quiz bank.</p>
    `;
  }
  // swap the content of listQuesitonViewEl with our new crafted HTML content
  listQuesitonViewEl.innerHTML = pHTMLtemplate;

  // This will listen to DELETE buttons on list of Question view
  // Notice that I add data-index=quesiton index on both button and icon components of our crafted HTML template
  // It will help us to know which question index needed to remove from quizBank
  document
    .querySelector(".listQuestionView")
    .addEventListener("click", function (e) {
      // listen to the whole list of questions view but only do stuff on button/icon get clicked
      let pElement = e.target;
      if (
        pElement.matches(".trashQuestionButton") ||
        pElement.matches(".trashQuestionButton i")
      ) {
        // get the value data-index=value on button, which we set up earlier
        // then we remove the question with that index of quizBank with .splice(index,1)
        localQuizBank.splice(pElement.dataset.index, 1);
        // the splice operate on localQUizbank, return the removed element, but we dont care about it
        // We just want the OG localQuizBank and put it back to the localstorage
        localStorage.setItem("quizBank", JSON.stringify(localQuizBank));
      }
      // currying - afunction call itself
      // re-render the list of question View Page
      displayAllQuestions();
      // return nothing
      return;
    });
}

document
  .querySelector(".viewRanksButton")
  .addEventListener("click", displayRanksView);
function displayRanksView() {
  // same old trick: show and hide views
  timer = 0;
  hideAbsoluteEl(addQuestioFormEl);
  hideAbsoluteEl(quizAreaEl);
  hideAbsoluteEl(listQuesitonViewEl);
  showAbsoluteEl(viewRankViewEl);
  // establish a string HTML for updating view
  let pHTMLtemplate = `<p style='font-size:2rem; font-weight:400; margin-bottom:10px;'>Leaders Board</p><hr/>`;
  // grab ranks from localstorage, return an array of message if there is none in localstorage
  let ranks = JSON.parse(localStorage.getItem("ranks")) || [
    ["This could be your score! ...if you play...", 100000],
  ];
  // sort the ranks by score point
  ranks.sort(function (a, b) {
    return b[1] - a[1];
  });
  // for each player, render player's name and scores with condition check if their score is possitive or negative
  for (let i = 0; i < ranks.length; i++) {
    pHTMLtemplate += `<div style='display:flex; justify-content: space-between;padding:10px;${
      i % 2 == 0 ? "background-color:#292b2b;" : ""
    } '> 
    <div>${i + 1}. &ensp; ${ranks[i][0]} </div> <div class='${
      ranks[i][1] > 0 ? "green" : "red"
    }'>${ranks[i][1]}  pts</div>
    </div>`;
  }
  // render
  viewRankViewEl.innerHTML = pHTMLtemplate;
}

/* VIEW handler utility functions 
    call this function when we want to get the view of component
    or move them out of the way 
    with Animation tags
*/
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
// listen to STOP button click, reset the timer
document.querySelector(".stopButton").addEventListener("click", function () {
  timer = 0;
});

/* QUIZ prompt and buttons at quizArea component
   This function will
      DISPLAY the current question with muliple answers as button inputs
*/
function displayCurrentQuestion(pCurrentQuestion) {
  // this function will take a question - Object -

  // console.log(currentQuestion);
  // most likely 99% the global var currentQuestion will be an argument
  // guard check if the pCurrentQuestion is not an empty object
  if (Object.keys(pCurrentQuestion).length !== 0) {
    // shuffle order of currentQuestion's answers
    // since each answer in currentQuestion is a property in object (key:value pair), we cant directly shuffle them
    // but we can put all its keys to a temporary array ['a','b','c','d'] and shuffle it to ['b','c',...]-random
    // and then use that array with random key order to display the answers
    const answerOrder = shuffleAnswers();

    // crafting template literal with currentquestion data
    let htmlTemplate = `
         <pre class='animate__animated animate__lightSpeedInLeft' style="font-size:1.3rem;line-height:1.5;">${pCurrentQuestion.prompt}</pre>
         <hr class='animate__animated animate__lightSpeedInLeft'/>
         <div class='multipleChoices'>
     `;
    // the question is loaded to template string
    // now it's timer to load answers
    // notice that the answerOrder array contains 4 keys a,b,c,d of currentQuestion.answers obj but in random order
    for (let i = 0; i < answerOrder.length; i++) {
      // The trick here is to bind the key to data-selected so we can use dataset.selected at eventListener to retrieve the key when user click the answer button
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
    // it's empty when there is no question in quizBank localstorage
    // do nothing
    return;
  }
}

/* this function will check if askingQueue contains any question
      if askingqueue does, 
          it will load the 1st question to currentQuestion 
          and then display currentQuestion to quizAreaEl
      if no question is in askingQueue 
        because there is no question in the localStorage to retrieve, 
        or user answered all the questions
          then speed up the timer to 1s left
          display the message on quizArea view
          reset the question bar (pagination)
*/
function askQuestion() {
  if (askingQueue.length !== 0 && timer > 0) {
    currentQuestion = askingQueue[0];
    displayCurrentQuestion(currentQuestion);
  } else {
    quizAreaEl.innerHTML = "<h2>Holla! You answer very quick!</h2>";
    timer = 1;
    questionBarTracker = 0;
  }
}

// This function will load/retrieve quizbank from local storage  and shuffle the question order to askingQueue
function dataHandler() {
  // note: JSON doesnt save methods of object

  // quizBank.push(q1);
  /*  quizBank.push(q2);
      localstorage setter -- quizBank
      localStorage.setItem("quizBank", JSON.stringify(quizBank)); */

  // localstorage geter -- quizBank - load the localstorage quizbank on to a constant variable
  const localQuizBank = JSON.parse(localStorage.getItem("quizBank")) || [];
  // debug
  //console.log("LOCAL QUIZ BANK");
  // console.table(localQuizBank);

  // assign the quizBank to an App's global variable to keep track of question queue
  // this queue will shift(), or take the first question out, after asking and getting answers from user
  askingQueue = localQuizBank;
  shuffleArray(askingQueue);
  // Debug if the askingQueue is shuffled
  //console.table(askingQueue);
}

/* Initialize the App
  This resets the timer updateTimerDisplay() with 0 quizTime, 0 timeleft, isRunning = false
  This calls dataHandler() to retrieve the 'quizBank' 
  After dataHandler called, the askingQueue is queue up with shuffled questions

*/
function init() {
  updateTimerDisplay(0, 0, false);
  dataHandler();
  askQuestion();
}

init();
