const startQuizContainer = document.querySelector(".start-quiz_container"),
    buttonStart = document.querySelector(".button-start"),
    selectCategory = document.querySelector(".select-category [name='category']"),
    category = document.querySelector(".category strong"),
    questionsCount = document.querySelector(".questions-count span"),
    quizQuestion = document.querySelector(".quiz-question"),
    answersArea = document.querySelector(".answers-area"),
    submitButton = document.querySelector(".submit-button"),
    bulletsContainer = document.querySelector(".bullets"),
    counterdowncontainer = document.querySelector(".counterdown-container"),
    buttonDownload = document.querySelector(".button-download");

let = currentIndex = 0;
let = rightAnswers = 0;
let = counterDownIntervale = null;

buttonStart.addEventListener("click", () => {
    startQuizContainer.remove();
    counterDown(20);
});

// startQuizContainer.style.display = "none"

// select category default value
category.innerHTML = `${selectCategory.value} <img src='./assets/icons/html.svg'>`
selectCategory.addEventListener("change", () => {
    let jsonFiles = null;

    // switch questions category
    if (selectCategory.value == "CSS") {
        jsonFiles = './json/css_question.json';
        category.innerHTML = `${selectCategory.value} <img src='./assets/icons/css.svg'>`;
    } else if (selectCategory.value == "JS") {
        jsonFiles = './json/js_question.json';
        category.innerHTML = `${selectCategory.value} <img src='./assets/icons/js.svg'>`;
    } else {
        jsonFiles = './json/html_question.json';
        category.innerHTML = `${selectCategory.value} <img src='./assets/icons/html.svg'>`;
    }

    quizQuestion.innerHTML = "";
    answersArea.innerHTML = "";

    getDataFromJson(jsonFiles);
    handleMediaQuery(mediaQuery);
});

function getDataFromJson(link) {
    const myRequeste = new XMLHttpRequest();
    myRequeste.open("GET", link);
    myRequeste.send();

    myRequeste.onreadystatechange = function () {
        if (this.status === 200 && this.readyState === 4) {
            let dataObj = JSON.parse(this.responseText);
            let ObjCount = dataObj.length;

            questionsCount.textContent = ObjCount;

            createBullets(ObjCount);

            loopFromDumyData(dataObj[currentIndex], ObjCount);

            submitButton.onclick = () => {

                let rightAnswer = dataObj[currentIndex].right_answer;

                currentIndex++;

                checkAnswer(rightAnswer, ObjCount);

                quizQuestion.innerHTML = "";
                answersArea.innerHTML = "";

                loopFromDumyData(dataObj[currentIndex], ObjCount);

                handleBullets();

                showResults(ObjCount);

                clearInterval(counterDownIntervale);

                counterDown(20);

                counterdowncontainer.style.borderColor = "var(--clr-blue)";

                if (currentIndex == ObjCount) {
                    clearInterval(counterDownIntervale);
                }
            }
        }
    }
};

getDataFromJson('./json/html_question.json');

function loopFromDumyData(obj, count) {
    if (currentIndex < count) {
        // create questions
        let h1Question = document.createElement("h1");
        h1Question.append(document.createTextNode(obj.title));
        quizQuestion.appendChild(h1Question);

        for (let i = 1; i <= 4; i++) {
            // create answers

            // create main div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            // create input element
            let inputRadio = document.createElement("input");
            inputRadio.type = "radio";
            inputRadio.name = "question";
            inputRadio.id = `answers_${i}`;
            inputRadio.dataset.answer = obj[`answer_${i}`];

            // create label element
            let label = document.createElement("label");
            label.htmlFor = inputRadio.id;
            label.innerHTML = `<span tabindex="${i}"></span>`;

            label.children[0].onkeyup = () => {
                inputRadio.checked = true
            }

            // create strong element
            let strong = document.createElement("strong");
            strong.appendChild(document.createTextNode(obj[`answer_${i}`]));
            label.appendChild(strong);

            // append element in main div
            mainDiv.append(inputRadio, label);

            // append all create element in HTML
            answersArea.appendChild(mainDiv);

            if (i == 1) {
                inputRadio.checked = true;
            }
        }
    }
};

function createBullets(count) {
    bulletsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
        let bullet = document.createElement("span");
        bullet.className = "bullet";

        if (i == 0) {
            bullet.className = "bullet on";
        }

        bulletsContainer.appendChild(bullet);
    }
};

function handleBullets() {
    let bulletsOfSpan = document.querySelectorAll(".bullets .bullet");
    let bulletsOfArray = Array.from(bulletsOfSpan);

    bulletsOfArray.forEach((bullet, index) => {
        if (currentIndex === index) {
            bullet.className = "bullet on";
        }
    });
};

function checkAnswer(rAnswer, count) {
    let answer = document.getElementsByName("question");
    let theSelectAnswer = null;

    for (let i = 0; i < answer.length; i++) {
        if (answer[i].checked) {
            theSelectAnswer = answer[i].dataset.answer;
        }
    };

    if (theSelectAnswer === rAnswer) {
        rightAnswers++;
    }
};

function showResults(count) {
    let results = document.createElement("div");
    results.className = "results";

    results.innerHTML = `<div class='result-center'>
    <div class='recent-results'></div>
        <button class='button-reload'>reload <img src='./assets/icons/reload.svg'></button>
    </div>`;

    if (currentIndex === count) {
        answersArea.closest(".quiz-area").remove();
        bulletsContainer.closest("footer").remove();
        submitButton.remove();

        document.querySelector(".app-quiz").appendChild(results);

        document.querySelector(".button-reload").onclick = () => {
            window.location.reload();
        };

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            results.children[0].firstElementChild.innerHTML = `
            <strong id='good'>Good</strong>, ${rightAnswers} From ${count} is Good
            <br>
            <img style='margin-block:1em;' alt='good' src ='assets/icons/emoji-good.svg'>
        `;
        } else if (rightAnswers === count) {
            results.children[0].firstElementChild.innerHTML = `
                <strong id='perfect'>Perfect</strong>, ${rightAnswers} From ${count}  All Anssers is Good
                <br>
                <img style='margin-block:1em;' alt='perfect' src ='assets/icons/emoji-perfect.svg'>
            `;
        } else {
            results.children[0].firstElementChild.innerHTML = `
                <strong id='bad'>Bad</strong>, ${rightAnswers} From ${count}
                <br>
                <img style='margin-block:1em;' alt='bad' src ='assets/icons/emoji-bad.svg'>
            `;
        }
    }
};

function counterDown(duration) {
    let counterdown = counterdowncontainer.children[0]
    let minuts = null;
    let seconds = null;

    counterDownIntervale = setInterval(() => {
        minuts = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minuts = minuts < 10 ? `0${minuts}` : minuts;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        counterdown.textContent = `${minuts}:${seconds}`

        if (duration == 15) {
            // console.log("15");
            counterdowncontainer.style.borderTopColor = "var(--clr-green)";
            counterdowncontainer.classList.add('animate');

            counterdowncontainer.addEventListener("animationend", () => {
                counterdowncontainer.classList.remove('animate');
            });

        } else if (duration == 10) {
            // console.log("10");
            counterdowncontainer.style.borderRightColor = "var(--clr-green)";
            counterdowncontainer.classList.add('animate');

        } else if (duration == 5) {
            // console.log("5");
            counterdowncontainer.style.borderBottomColor = "var(--clr-green)";
            counterdowncontainer.classList.add('animate');

        } else if (duration <= 0) {
            clearInterval(counterDownIntervale);
            counterdowncontainer.style.borderColor = "var(--clr-red)";
            counterdowncontainer.classList.add('animate');
            submitButton.click();
        }

        duration--;

    }, 1000);
};

buttonDownload.addEventListener("click", () => {
    let downloadLink = document.createElement("a");
    downloadLink.href = './app/app.rar';
    downloadLink.download = 'app.rar';
    downloadLink.click();
});

const mediaQuery = window.matchMedia("(max-width:500px)");

function handleMediaQuery(e) {
    const maxWidth = e.matches;

    if (maxWidth === true) {
        category.firstChild.textContent = "";
    } else {
        category.firstChild.textContent = "HTML";
    }
};

handleMediaQuery(mediaQuery);
mediaQuery.addListener(handleMediaQuery);