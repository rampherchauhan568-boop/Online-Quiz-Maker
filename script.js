let questions = [];
let questionCount = 1;
function showCreateQuiz() {
    let loggedInUser =localStorage.getItem("loggedInUser");
if(!loggedInUser){
    alert("Please login first");

    window.location.href = "login.html";
    return;
}

    document.getElementById("createQuiz").style.display = "block";

    document.querySelector(".home").style.display = "none";
}

function showTakeQuiz() {

     let loggedInUser =localStorage.getItem("loggedInUser");
    if(!loggedInUser){
    alert("Please login first");

    window.location.href = "login.html";
    return;
}
    document.getElementById("takeQuiz").style.display = "block";

    document.querySelector(".home").style.display = "none";

    document.getElementById("createQuiz").style.display = "none";

    displayQuizzes();
}

function displayQuizzes() {

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    let quizList = document.getElementById("quizList");

    quizList.innerHTML = "";

    if (savedQuizzes.length === 0) {
        quizList.innerHTML = "<p>No quizzes available yet!</p>";
        return;
    }

    savedQuizzes.forEach(function(quiz, index) {

        quizList.innerHTML += `
            <div class="quiz-card">

                <h3>${quiz.title}</h3>

                <p>${quiz.questions.length} Questions</p>

                <button onclick="startQuiz(${index})">
                    Start Quiz
                </button>

                <button onclick="editQuiz(${index})">
                    Edit Quiz
                </button>

                <button onclick="deleteQuiz(${index})">
                    Delete Quiz
                </button>

            </div>
        `;

    });
}
let editingQuizIndex = null;

function editQuiz(index) {

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    let quiz = savedQuizzes[index];

    editingQuizIndex = index;

    document.getElementById("quizTitle").value = quiz.title;

    questions = [...quiz.questions];

    questionCount = questions.length + 1;

    document.getElementById("questionsContainer").innerHTML = "";

    document.getElementById("createQuiz").style.display = "block";

    document.getElementById("takeQuiz").style.display = "none";

    document.querySelector(".home").style.display = "none";

    questions.forEach(function(question, i) {

        addQuestion();

        let questionBox = document.querySelectorAll(".question-box")[i];

        questionBox.querySelector(".question").value = question.question;

        let options = questionBox.querySelectorAll(".option");

        options[0].value = question.options[0];
        options[1].value = question.options[1];
        options[2].value = question.options[2];
        options[3].value = question.options[3];

        questionBox.querySelector(".correctAnswer").value = question.correctAnswer;

    });

}
function startQuiz(index) {

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    currentQuiz = savedQuizzes[index];

    if (!currentQuiz) {
        alert("Quiz not found!");
        return;
    }

    currentQuestionIndex = 0;
    score = 0;

    document.getElementById("takeQuiz").style.display = "none";

    document.getElementById("quizPlaying").style.display = "block";

    document.getElementById("playingQuizTitle").textContent =
        currentQuiz.title;

    showQuestion();

}
function deleteQuiz(index) {

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    let confirmDelete = confirm("Are you sure you want to delete this quiz?");

    if (confirmDelete) {

        savedQuizzes.splice(index, 1);

        localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

        displayQuizzes();

        alert("Quiz deleted successfully!");

    }

}

function showQuestion() {

    let question = currentQuiz.questions[currentQuestionIndex];

    selectedAnswer = null;

    document.getElementById("questionNumber").textContent =
        "Question " + (currentQuestionIndex + 1) +
        " of " + currentQuiz.questions.length;

    document.getElementById("playingQuestion").textContent =
        question.question;

    let answerOptions = document.getElementById("answerOptions");

    answerOptions.innerHTML = "";

    question.options.forEach(function(option, index) {

        let button = document.createElement("button");

        button.textContent = option;

        button.onclick = function() {

            selectedAnswer = index + 1;

            let buttons = answerOptions.querySelectorAll("button");

            buttons.forEach(function(btn) {
                btn.style.background = "white";
            });

            button.style.background = "#d9ccff";
        };

        answerOptions.appendChild(button);

    });

    document.getElementById("nextButton").textContent =
        currentQuestionIndex === currentQuiz.questions.length - 1
        ? "Submit Quiz"
        : "Next Question";
}

function nextQuestion() {

    if (selectedAnswer === null) {
        alert("Please select an answer!");
        return;
    }

    let question = currentQuiz.questions[currentQuestionIndex];

    // Check correct answer
    if (selectedAnswer == question.correctAnswer) {
        score++;
    }

    currentQuestionIndex++;

    // Check if quiz is completed
    if (currentQuestionIndex < currentQuiz.questions.length) {

        showQuestion();

    } else {

        showResult();

    }
}

function showResult() {

    document.getElementById("quizPlaying").style.display = "none";

    let resultSection = document.getElementById("quizResult");

    resultSection.style.display = "block";

    let totalQuestions = currentQuiz.questions.length;

    let percentage = (score / totalQuestions) * 100;

    document.getElementById("finalScore").textContent =
        score + " / " + totalQuestions;

    document.getElementById("resultMessage").textContent =
        "You have completed the quiz!";

    document.getElementById("percentage").textContent =
        "Percentage: " + percentage + "%";

    if (percentage >= 50) {

        document.getElementById("passFail").textContent =
            "Congratulations! You Passed!";

    } else {

        document.getElementById("passFail").textContent =
            "Sorry! You Failed. Try Again!";

    }
   // Save quiz score

    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    let allScores = JSON.parse(
        localStorage.getItem("quizScores")
    ) || [];

    let scoreData = {

        userEmail: loggedInUser.email,

        quizTitle: currentQuiz.title,

        score: score,

        totalQuestions: totalQuestions,

        percentage: percentage,

        date: new Date().toLocaleDateString()

    };

    allScores.push(scoreData);

    localStorage.setItem(
        "quizScores",
        JSON.stringify(allScores)
    );

}
function saveQuiz() {

    let quizTitle = document.getElementById("quizTitle").value;

    if (quizTitle === "") {
        alert("Please enter quiz title!");
        return;
    }

    if (questions.length === 0) {
        alert("Please add at least one question!");
        return;
    }

    let quiz = {
        title: quizTitle,
        questions: questions
    };

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    // Check whether we are editing an existing quiz
    if (editingQuizIndex !== null) {

        // Update the existing quiz
        savedQuizzes[editingQuizIndex] = quiz;

        alert("Quiz updated successfully!");

        // Reset edit mode
        editingQuizIndex = null;

    } else {

        // Save as a new quiz
        savedQuizzes.push(quiz);

        alert("Quiz saved successfully!");
    }

    // Save quizzes in localStorage
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

    // Reset form
    questions = [];

    questionCount = 1;

    document.getElementById("quizTitle").value = "";

    document.getElementById("questionsContainer").innerHTML = "";

    document.getElementById("createQuiz").style.display = "none";

    document.getElementById("takeQuiz").style.display = "block";

    document.querySelector(".home").style.display = "block";

    // Display updated quizzes
    displayQuizzes();
}
function playAgain() {

    document.getElementById("quizResult").style.display = "none";

    document.getElementById("quizPlaying").style.display = "block";

    currentQuestionIndex = 0;

    score = 0;

    showQuestion();

}

function goHome() {

    document.getElementById("quizResult").style.display = "none";

    document.getElementById("quizPlaying").style.display = "none";

    document.getElementById("takeQuiz").style.display = "none";

    document.getElementById("createQuiz").style.display = "none";

    document.querySelector(".home").style.display = "flex";

}
function addQuestion() {

    let question = document.getElementById("question").value;

    let option1 = document.getElementById("option1").value;
    let option2 = document.getElementById("option2").value;
    let option3 = document.getElementById("option3").value;
    let option4 = document.getElementById("option4").value;

    let correctAnswer = document.getElementById("correctAnswer").value;

    if (question === "" || option1 === "" ||
        option2 === "" || option3 === "" ||
        option4 === "" || correctAnswer === "") {

        alert("Please fill all question fields!");
        return;
    }

    questions.push({
        question: question,
        options: [option1, option2, option3, option4],
        correctAnswer: correctAnswer
    });

    alert("Question added successfully!");

    document.getElementById("question").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
    document.getElementById("correctAnswer").value = "";

}