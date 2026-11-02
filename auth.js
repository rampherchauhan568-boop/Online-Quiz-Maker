let registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            alert("Email already registered! Please login.");
            return;
        }

        let newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");

        window.location.href = "login.html";

    });

}


// LOGIN CODE

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let user = users.find(function(user) {
            return user.email === email &&
                   user.password === password;
        });

        if (user) {

            localStorage.setItem("loggedInUser", JSON.stringify(user));

            alert("Login successful!");

            window.location.href = "index.html";

        } else {

            alert("Invalid email or password!");

        }

    });

}

// Show logged-in user information

let userInfo = document.getElementById("userInfo");

if (userInfo) {

    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (loggedInUser) {

        userInfo.innerHTML =
            "<button onclick='logout()'>Logout</button>";

    } else {

        userInfo.innerHTML =
            "<a href='login.html'>Login</a> | " +
            "<a href='register.html'>Register</a>";

    }

}


// Logout function

function logout() {

    localStorage.removeItem("loggedInUser");

    alert("Logout successful!");

    window.location.href = "login.html";

}
function viewScores() {

    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    let allScores = JSON.parse(
        localStorage.getItem("quizScores")
    ) || [];

    let userScores = allScores.filter(function(item) {
        return item.userEmail === loggedInUser.email;
    });

    let scoresSection = document.getElementById("scoresSection");

    let scoresList = document.getElementById("scoresList");

    scoresSection.style.display = "block";

    scoresList.innerHTML = "";

    if (userScores.length === 0) {

        scoresList.innerHTML = "<p>No quiz scores available yet!</p>";

        return;
    }

    userScores.forEach(function(item) {

        let scoreCard = document.createElement("div");

        scoreCard.className = "dashboard-card";

        scoreCard.innerHTML = `
            <h3>${item.quizTitle}</h3>
            <p>Score: ${item.score} / ${item.totalQuestions}</p>
            <p>Percentage: ${item.percentage}%</p>
            <p>Date: ${item.date}</p>
        `;

        scoresList.appendChild(scoreCard);

    });

}