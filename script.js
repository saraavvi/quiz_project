class QuizSetup { 
    constructor(){
    this.playerName = document.getElementById('playerName').value;
    this.numOfQuestions = Number(document.getElementById('numOfQuestions').value); 
    this.displayGame();
    this.fetchQuestions();
    }

    fetchQuestions(){

        //hämtar alla frågor mm från api, sparas i data och skrickas till class questions samt första frågan skrivs ut.
        fetch('https://quizapi.io/api/v1/questions?apiKey=7XRH2oR7PfuWCijQLCYIFvRXdtIDwumiF1eyWpbg&limit=10')
            .then(response => response.json())
            .then(data => { 
                let dataArray = [] // sparar så många frågor som användaren valt.
                for(let i = 0; i < this.numOfQuestions; i++){
                    dataArray.push(data[i]);
                }
                let quizArray = dataArray.map((obj) =>{ // gör en ny array med objact om endast inehåller de egenskaper vi behöver. 
                    return new Question(obj.question, obj.answers, obj.correct_answers);
                });
                let newQuestions = new QuizGame(quizArray); 
                newQuestions.nextQuestion();
            });
    }

    //dölj "startsida" och visa quizet
    displayGame(){
        let nextBtn = document.getElementById('nextBtn'); 
        nextBtn.classList.toggle('hideElement');
        nextBtn.disabled = true;

        let heading = document.getElementById('heading');
        heading.innerText = "Player Name: " + this.playerName;

        let startDisplay = document.getElementById('startDisplay');
        startDisplay.classList.toggle('hideElement');
         }
}

class Question{
    constructor(question, answers, correct_answers){
        this.question = question;
        this.answers = answers;
        this.correct_answers = correct_answers;
    }
}

class QuizGame { 
    constructor(quizArray){ 
        this.quizArray = quizArray;
        this.numberOfCorrectAnswers = 0; // håller reda på hur många rätt spelar har hittills
        this.questionNumber = 0; // håller reda på vilken av de 10 frågor i arrayen vi är på just nu.
        console.log(this.quizArray);
        
        //get nästaknappen en eventlistener så att när den klickas skrivs antingen nästa fråga ut eller resultatet.
        this.nextBtn = document.getElementById('nextBtn') 
        this.nextBtn.addEventListener ('click', (e) => {
            if(this.questionNumber >= quizArray.length){
                this.printResult();
            }else{
                this.removePrevious();
                this.nextQuestion();
            }          
        });
    }

    //ta bort alternativen och tillhörande submitknapp. Nya kommer skapas för nästa fråga.
    removePrevious(){

        let choiceElements = document.querySelectorAll('p');
        choiceElements.forEach(function(element){
            element.remove();
        });

        let inputElements = document.querySelector('.submitButton');
        inputElements.remove();

        
    }
     //skriver ut nästa fråga
    nextQuestion(){

        this.nextBtn.disabled = true;

        //hämtar "rätt" fråga från arrayen genom att använda det index som qustionNumber nu är på. ökar sedan questionNumber tillnästa runda.
        let currentQuestion = this.quizArray[this.questionNumber];
        console.log(currentQuestion);
        this.questionNumber++;

        //hämtar element för att kunna ändra på befintliga, och appenda nya element som skapas.
        let quizContainer = document.getElementById('quizContainer');
        let questionContainer = document.getElementById('questionContainer');
        let displayCurrQuestion = document.getElementById('displayCurrQuestion');

        displayCurrQuestion.innerText = 'Question ' + this.questionNumber + '/ ' + this.quizArray.length;
        questionContainer.innerText = currentQuestion.question;
        
        //loopar igenom svaren för skapa element av de svarsalternativ som inte är null
        //correct kommer innehålla siffra för detta antal. Denna siffra kommer att användas senare för att kontrollera svar. 
        //checkbox skapas till varje svarsalternativ, de läggs också i checkboses som används senare för att kontrollera svar.
        let checkboxes = [];
        let correct = 0;
        for(let value in currentQuestion.answers){
            if(currentQuestion.answers[value] !== null){ 
                correct++;

                let choice = document.createElement('p');
                quizContainer.append(choice);
                choice.innerText = currentQuestion.answers[value];
                
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                choice.append(checkbox);
                checkboxes.push(checkbox);
            }
        }
        console.log('rätt svarsnummer:' + correct);

        //skapa en array med alla true/false answers för att kunna jämföra med checkboxarna 
        let trueOrFalse = [];
        for(let answer in currentQuestion.correct_answers){
            trueOrFalse.push(currentQuestion.correct_answers[answer]);
        }
        console.log(trueOrFalse);

        //Till sist läggs en submitknapp till. Denna ska tryckas på när man checkat i alternativ så att svaren kan kontrolleras
        let submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.innerText = 'submit';
        submitButton.className = "submitButton";
        quizContainer.append(submitButton);

        //när submitknappen trycks ska correct metoden köras som tar in tre argument som behövs för att kontrollera.
        submitButton.addEventListener('click', () => {
            this.correct(trueOrFalse, checkboxes, correct);
            nextBtn.disabled = false;
            submitButton.disabled = true; 
        }); 
    }
    //metod som kontrollerar om användaren har svarat rätt eller inte
    correct(trueOrFalse, checkboxes, correct){
   
        //loopa igenom checkboxarna och jämför med trueOrFalse:
        //om checkboxen är icheckad OCH answer = true: quesscorrect++
        //om checkboxen inte är ichekad OCH answer = false: guesscorrect++;
        //sedan jämför correct med guesscorrect (correct === guesscorrect)för att se om användaren har rätt. 
        let guessCorrect = 0; // kommer hålla reda på om användaren klickat i rätt eller inte.
        for(let i = 0; i < correct; i++){
            if(checkboxes[i].checked && trueOrFalse[i] === "true" ){
                guessCorrect++;
            }
            if(!checkboxes[i].checked && trueOrFalse[i] === "false"){
                guessCorrect++;
            }
        }
        console.log('användarens svarsnummer: ' + guessCorrect);

        //om svaret är rätt så kommer det registreras i numberOfCorrectAnswers 
        if(correct === guessCorrect){
            this.numberOfCorrectAnswers++;  
        }
       console.log('antal rätt hittills: ' + this.numberOfCorrectAnswers); 
    }

    printResult(){
        let heading = document.getElementById('heading');
        heading.innerText = "Result:";

        let displayCurrQuestion = document.getElementById('displayCurrQuestion');
        displayCurrQuestion.classList.toggle('hideElement');

        this.nextBtn.classList.toggle('hideElement');

        this.removePrevious();

        let questionContainer = document.getElementById('questionContainer');
        questionContainer.innerText = this.numberOfCorrectAnswers + ' av ' + this.quizArray.length; 

        //skapa en playagain-knapp. om den trycks kommer man tillbaks till "start" 
        let playAgainBtn = document.createElement('button');
        playAgainBtn.innerHTML = "Play Again";
        quizContainer.append(playAgainBtn);
        playAgainBtn.addEventListener('click', function(e){
            location.reload();
        });
    }
}



let startBtn = document.getElementById('startBtn').addEventListener('click', function(){

game = new QuizSetup();

});



