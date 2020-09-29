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
    constructor(quizArray){ // array innehåller alla hämtade objekt
        this.quizArray = quizArray;
        console.log(this.quizArray);
        this.questionNumber = 0;
        //när next klickas ska nästa fråga skrivas ut.
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.addEventListener ('click', (e) => {
            this.nextQuestion();
        })
        console.log(nextBtn);

    }
    nextQuestion(){
        let currentQuestion = this.quizArray[this.questionNumber];
        console.log(currentQuestion);
        this.questionNumber++;
        console.log(this.questionNumber);
    }
    //håller reda på frågorna med alternativen, hur många alternativ, vilket/vilka som är rätt
    //skriver ut en fråga med alternativ

    //loop går igenom array med frågor. Skapar ett element för frågan och skriver ut den. Kollar varje fråga 
    //hur många alernativ den har och skapar samma antal element som innehåller alternativen och skriver ut dem på skärmen.

    //när "nästa" knappen trycks (kan endast tryckas när alternativ är valt) ska nästa fråga med alternativ skrivas ut
    //när spelet är slut ska användaren kunna välja att starta ett nytt spel med nya frågor
}


//när man klickar på starta-knappen hämtas alla frågor mm från api, sparas i array och skrickas till class questions
let startBtn = document.getElementById('startBtn').addEventListener('click', function(){
  
fetch('https://quizapi.io/api/v1/questions?apiKey=7XRH2oR7PfuWCijQLCYIFvRXdtIDwumiF1eyWpbg&limit=10')
.then(response => response.json())
.then(data => { 
    let quizArray = []; 
    for(let i = 0; i < 10; i++)
    quizArray.push(data[i]); 
    let newQuestions = new Questions(quizArray); 
    newQuestions.nextQuestion();
});


});











