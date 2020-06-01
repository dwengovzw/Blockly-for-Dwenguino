export { Costume }

class Costume{
    constructor(type){
        this._type = type;
      
        if (this.toString === undefined) {
          throw new Error('You have to implement the method toString');
        }
    }

    getType(){
        return this._type;
    }

}