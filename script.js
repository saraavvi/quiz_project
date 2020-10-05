class GameSetup { 
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
                let quizArray = [];
                for(let i = 0; i < this.numOfQuestions; i++){
                    quizArray.push(data[i]);
                }
                let newQuestions = new Questions(quizArray); 
                newQuestions.nextQuestion();
            });
    }

    //dölj "startsida" och visa quizet
    displayGame = () => {

        let heading = document.getElementById('heading');
        heading.innerText = "Player Name: " + this.playerName;

        let startDisplay = document.getElementById('startDisplay');
        startDisplay.classList.toggle('hideElement');
         }
}

class Questions { //byt namn på class
    constructor(quizArray){ // tar emot arrayen med frågor så att dessa kan användas här.
        this.quizArray = quizArray;
        console.log(this.quizArray);
        this.numberOfCorrectAnswers = 0; // håller reda på hur många rätt spelar har hittills
        this.questionNumber = 0; // håller reda på vilken av de 10 frågor i arrayen vi är på just nu.
        
        //hämtar och synliggör nästaknappen samt ger den en eventlistener så att de två metoderna då körs.
        let nextBtn = document.getElementById('nextBtn'); 
        //nextBtn.classList.toggle('hideElement');
        nextBtn.addEventListener ('click', (e) => {
            if(this.questionNumber >= quizArray.length){
                this.printResult();
            }else{
                nextBtn.classList.toggle('hideElement');
                this.removeAll();
                this.nextQuestion();
            }          
        })
    }

    //ta bort alternativen och tillhörande submitknapp. Nya kommer skapas för nästa fråga.
    removeAll(){

        let choiceElements = document.querySelectorAll('p');
        choiceElements.forEach(function(element){
            element.remove();
        })

        let inputElements = document.querySelector('.submitButton');
        inputElements.remove();

        
    }
     //skriver ut nästa fråga
     //kollar hur hur många alternativ frågan har och skriver ut dessa med tillhörande checkbox.
    nextQuestion(){

        //hämtar "rätt" fråga från arrayen genom att använda det index som qustionNumber nu är på. 
        //ökar sedan questionNumber tillnästa runda.
        let currentQuestion = this.quizArray[this.questionNumber];
        console.log(currentQuestion);

        this.questionNumber++;
        //console.log('nästa frågan som skrivs ut är följande nummer från arrayen:' + this.questionNumber);

        //hämtar divarna som ska innehålla alla element: frågor och alternativ.
        let quizContainer = document.getElementById('quizContainer');
        let questionContainer = document.getElementById('questionContainer');
        let displayCurrQuestion = document.getElementById('displayCurrQuestion');
        displayCurrQuestion.innerText = 'Question ' + this.questionNumber + '/ ' + this.quizArray.length;


        //skriver ut frågan i rubriken
        questionContainer.innerText = currentQuestion.question;
        
        //loopar igenom objektet för skapa element av de svarsalternativ som inte är null
        //checkbox skapas till varje svarsalternativ, de läggs också i en array som används senare för att kontrollera svar.
        //correct kommer innehålla siffra för detta antal. Denna siffra kommer att användas senare för att kontrollera svar. 
        let checkboxes = [];
        let correct = 0;
        for(let value in currentQuestion.answers){
            if(currentQuestion.answers[value] !== null){
                correct++;
                //console.log(currentQuestion.answers[value])

                let choice = document.createElement('p');
                quizContainer.append(choice);
                choice.innerText = currentQuestion.answers[value];
                
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox')
                choice.append(checkbox);
                checkboxes.push(checkbox);
            }
        }
        console.log('rätt svarsnummer:' + correct);
        //console.log(checkboxes);

        //Till sist läggs en submitknapp till. Denna ska tryckas på när man checkat i alternativ så att svaren kan kontrolleras
        let submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'button');
        submitButton.innerText = 'submit';
        submitButton.className = "submitButton";
        quizContainer.append(submitButton);

        //skapa en array med alla true/false answers för att kunna jämföra med checkboxarna 
        let trueOrFalse = [];
        for(let answer in currentQuestion.correct_answers){
            trueOrFalse.push(currentQuestion.correct_answers[answer]);
        }
        console.log(trueOrFalse);
        //när sublitknappen trycks ska correct metoden köras som tar in tre parametrar som behövs för att kontrollera.
        submitButton.addEventListener('click', () => {
            this.correct(trueOrFalse, checkboxes, correct);
            submitButton.disabled = true;
           
        }); 
    }
    //metod som kontrollerar om användaren har avarat rätt eller inte
    correct(trueOrFalse, checkboxes, correct){

        nextBtn.classList.toggle('hideElement');
   
        //loopa igenom checkboxarna och jämför med trueOrFalse:
        //om checkboxen är icheckad OCH answer = true: quesscorrect++
        //om checkboxen inte är ichekad OCH answer = false: guesscorrect++;
        //sedan jämför correct med guesscorrect (correct === guesscorrect)för att se om användaren har rätt. 
        let guessCorrect = 0 // kommer hålla reda på om användaren klickat i rätt eller inte.
        for(let i = 0; i < correct; i++){
            if(checkboxes[i].checked && trueOrFalse[i] === "true" ){
                guessCorrect++;
            }
            if(!checkboxes[i].checked && trueOrFalse[i] === "false"){
                guessCorrect++;
            }
        }
        console.log('användarens svarsnummer: ' + guessCorrect);
        //nu kan de rätta alternativen jämföras med användarens val. (måste vara samma siffra)
        //om svaret är correct så kommer numberOfCorrectAnswers att öka med 1. 
        if(correct === guessCorrect){
            this.numberOfCorrectAnswers++;
            
        }
       console.log('antal rätt hittills: ' + this.numberOfCorrectAnswers); 
       

    }
    printResult(){
        let heading = document.getElementById('heading');
        heading.innerText = "Result";

        let displayCurrQuestion = document.getElementById('displayCurrQuestion');
        displayCurrQuestion.classList.toggle('hideElement');

        nextBtn.classList.toggle('hideElement');
        this.removeAll()
        questionContainer.innerText = this.numberOfCorrectAnswers + ' av ' + this.quizArray.length; // kanske inte ska heta questionContainer eftersom den även innehåller annat (resultnumbers):

        //skapa en playagain-knapp. om den trycks kommer man tillbaks till "start" 
        let playAgainBtn = document.createElement('button');
        playAgainBtn.innerHTML = "Play Again";
        quizContainer.append(playAgainBtn);
        playAgainBtn.addEventListener('click', function(e){
            location.reload();
        });
    }
}

//todo:
// flytta över vissa variabler som finns i nextQuestion till contructorn som passar bättre där?

let startBtn = document.getElementById('startBtn').addEventListener('click', function(){

game = new GameSetup();

});



