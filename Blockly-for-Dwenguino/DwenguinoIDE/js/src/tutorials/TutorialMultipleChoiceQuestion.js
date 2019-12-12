
function TutorialMultipleChoiceQuestion(name, questionText, answers, correctAnswer){
    if (!(this instanceof TutorialMultipleChoiceQuestion)){
      return new TutorialMultipleChoiceQuestion();
    }

    this.name = name;
    this.questionText = questionText;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
};


TutorialMultipleChoiceQuestion.prototype.getHtml = function(){
    var html = "<div class='container'><form id='myform' onsubmit='return false'>";

    html = html
        + "<div class='row'>"
        + this.questionText
        + "</div>";

    var numberOfAnswers = this.answers.length;
    for (var i = 0; i < numberOfAnswers; i++) {
        html = html 
            + "<div class='row'>"
            + "<input type='radio' id='"+ this.answers[i].id + "' name='" + this.name + "' + value='" + this.answers[i].text + "'>" 
            + this.answers[i].text
            + "</div>";
    }
        
    html = html 
        + "<div class='row'>"
        + "<button id='"+ this.name +"'>"+MSG.tutorialMenu['checkAnswer']+"</button>"
        + "</div>"
        + "</form></div>";

    return html;    
}

TutorialMultipleChoiceQuestion.prototype.addEventHandler = function(){
    var self = this;
    $("#"+this.name).click(function(e){
        e.preventDefault();
        self.checkAnswer();
        return false;
    });
}

TutorialMultipleChoiceQuestion.prototype.checkAnswer = function(){
    this.removePreviousFeedback();
    var answerText = $('input[name='+this.name+']:checked').val();

    if(this.correctAnswer.text.localeCompare(answerText) === 0){
        $("#myform").append("<div id='reply' class='row tutorial_correct_answer'>"+MSG.tutorialMenu['correctAnswer']+"</div>");
    } else {
        $("#myform").append("<div id= 'reply' class='row tutorial_wrong_answer'>"+MSG.tutorialMenu['wrongAnswer']+"</div>");
    }
}

TutorialMultipleChoiceQuestion.prototype.removePreviousFeedback = function(){
    $("#reply").remove();
}