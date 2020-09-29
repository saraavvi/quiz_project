class Game {
    constructor(){

    }
    //håller reda på: 
    //spelarens namn
    //antal frågor kvar 
    //totala poäng
    //skriv ut totala poäng när spelet är slut
    //kanske lägga en del av detta i en klass "Result" sen istället. 

}
class Questions {
    constructor(){

    }
   
    nextQuestion(){

    }
    //håller reda på frågorna med alternativen, hur många alternativ, vilket/vilka som är rätt
    //skriver ut en fråga med alternativ

    //loop går igenom array med frågor. Skapar ett element för frågan och skriver ut den. Kollar varje fråga 
    //hur många alernativ den har och skapar samma antal element som innehåller alternativen och skriver ut dem på skärmen.

    //när "nästa" knappen trycks (kan endast tryckas när alternativ är valt) ska nästa fråga med alternativ skrivas ut
    //när spelet är slut ska användaren kunna välja att starta ett nytt spel med nya frågor
}

class Question {
    constructor(question, choices, currQuestion){
        this.question = question;
        this.choices = choices;
        this.currQuestion = currQuestion;
    
    }
    printQuestion(){
        console.log(this.question);
        console.log(this.choices);
        console.log(this.currQuestion);
        this.currQuestion++;
    }

}
//när man klickar på starta-knappen hämtas alla frågor mm från api, sparas i array och skrickas till class questions

let currQuestion = 0;
let startBtn = document.getElementById('startBtn').addEventListener('click', function(){
    currQuestion++;
fetch('https://quizapi.io/api/v1/questions?apiKey=7XRH2oR7PfuWCijQLCYIFvRXdtIDwumiF1eyWpbg&limit=10')
.then(response => response.json())
.then(data => { 
    console.log(data) 
    let question = data[currQuestion].question;
    let choices = data[currQuestion].answers;
    newQuestion = new Question(question, choices, currQuestion);
    newQuestion.printQuestion();
});

});

let nextBtn = document.getElementById('nextBtn').addEventListener('click', function(){
    let newQuestion = new Question(question, choices, currQuestion);
    newQuestion.printQuestion();
});







