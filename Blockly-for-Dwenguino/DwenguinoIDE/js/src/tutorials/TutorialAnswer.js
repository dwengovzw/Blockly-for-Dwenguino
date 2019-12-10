function TutorialAnswer(id, text){
    if (!(this instanceof TutorialAnswer)){
      return new TutorialAnswer();
    }

    this.id = id;
    this.text = text;
}
  