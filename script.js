class Game {
    constructor(){
    //hämtar alla frågor mm från api, sparas i array och skrickas till class questions samt första frågan skrivs ut.
    fetch('https://quizapi.io/api/v1/questions?apiKey=7XRH2oR7PfuWCijQLCYIFvRXdtIDwumiF1eyWpbg&limit=10')
    .then(response => response.json())
    .then(data => { 
    let quizArray = []; 
    for(let i = 0; i < 10; i++)
    quizArray.push(data[i]); 
    let newQuestions = new Questions(quizArray); 
    newQuestions.nextQuestion();
    });

    //spelarens namn hämtas från inputfältet och sparas i en variabel.
    let playerName = document.getElementById('playerName').value;
    this.displayGameStatus();
    let questionsleft = 10;
    }

    displayGameStatus(){
        let startDisplay = document.getElementById('startDisplay');
        startDisplay.classList.toggle('hideElement');
        
    }
    //antal frågor kvar 
    //totala poäng
    //skriv ut totala poäng när spelet är slut
    //kanske lägga en del av detta i en klass "Result" sen istället. 

}
class Questions {
    constructor(quizArray){ // array innehåller alla hämtade objekt
        this.quizArray = quizArray;
        console.log(this.quizArray);
        this.questionNumber = 0; // ska hålla reda på vilken av de 10 frågor i arrayen vi är på.
        //när next klickas ska nuvarande alternativ tas bort och nästa fråga skrivas ut.
        let nextBtn = document.getElementById('nextBtn'); // saker här borde vara i displayGameStatus ist.
        nextBtn.classList.toggle('hideElement');
        nextBtn.addEventListener ('click', (e) => {
            this.removeAll();
            this.nextQuestion();
        })

    }
    //ta bort alternativen. Nya kommer skapas för nästa fråga.
    removeAll(){
        let choiceElements = document.querySelectorAll('p');
        choiceElements.forEach(function(element){
            element.remove();
        })
    }
     //skriver ut frågan, kollar hur hur många alternativ frågan har och skriver ut dessa vad tillhörande checkbox.
    nextQuestion(){
        let currentQuestion = this.quizArray[this.questionNumber];
        console.log(currentQuestion);
        
        //FIXA: om questionNumber >= 11: jämför (i en annan metod)användarens svar med rätt svar.
        //annars questionNumber++
        this.questionNumber++;
        console.log('nästa frågan som skrivs ut är följande nummer från arrayen:' + this.questionNumber);

        let quizContainer = document.getElementById('quizContainer');
        let questionContainer = document.getElementById('questionContainer');

        //skriver ut frågan i rubriken
        questionContainer.innerText = currentQuestion.question;
    
        //loopa igenom objektet för skapa element av de svarsalternativ som inte är null
        for(let value in currentQuestion.answers){
            if(currentQuestion.answers[value] !== null){
                console.log(currentQuestion.answers[value])

                let choice = document.createElement('p');
                quizContainer.append(choice);
                choice.innerText = currentQuestion.answers[value];
                
                let checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox')
                choice.append(checkbox);
            }
        }
    }
    
   //när man har tryckt på starta, ska namnes sparas någonstans. sen kan starta-knappen och namnrutan tas bort
   
   //nästa-knappen ska inte finnas förens startknappen har tryckts och spelet har startats
    //nästa-knappen ska endast gå att trycka på när något alternativ är valt. 

    //när spelet är slut ska användaren få se sitt resultat, och sen kunna välja att starta ett nytt spel med nya frågor
}


//när man klickar på starta-knappen skapas ett nytt game 
let startBtn = document.getElementById('startBtn').addEventListener('click', function(){

game = new Game();

});











