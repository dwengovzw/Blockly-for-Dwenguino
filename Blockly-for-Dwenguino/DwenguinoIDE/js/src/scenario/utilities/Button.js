export { Button as Button }

/**
 * Example usage:
 * 
 * this.button = new Button('unique_id', 'parent_id', 'My label', 'extra_css_class_for_label');
 *  
 * var self = this;
 * let buttonElement = button.getButtonElement();
 * 
 * // When the button is clicked
 * buttonElement.onclick = function() {
 *    
 *    // Do stuff before updating the button layout
 * 
 *    self.button.update();
 * 
 *    if(self.button.isActive()){
 *      // Do other stuff after updating the button state 
 *    }
 * }
 * 
 */
class Button {
    /***
     * @param {String} id | unique id for the button
     * @param {String} parentId | css id of the parent element for the slider
     * @param {String} label | label to put above the button
     * @param {String} labelClasses | extra css classes for the button label div separated by spaces
     */
    constructor(id, parentId, label='', labelClasses = ''){

        this._id = id;
        this._parentId = parentId;

        this._label = label;
        
        this._buttonLabelId = 'button_' + this._id + '_label';
        this._buttonId = 'button_' + this._id + '_button';

        this._labelClasses = labelClasses;

        this._activeClasses = "dwenguino_button dwenguino_button_pushed";
        this._inactiveClasses = "dwenguino_button";

        this.insert();
    }

    toString(){
        return 'sonar';
    }

    insert(){
        if(!document.getElementById(this.getButtonId())) {
            if(this.getLabel() != ''){
                $('#' + this.getParentId()).append('<div id="' + this.getButtonLabelId() + '" class="' + this.getLabelClasses() + '">' + this.getLabel() + '</div>');
            }
            $('#' + this.getParentId()).append('<div id="' + this.getButtonId() + '" class="' + this.getInactiveClasses() + '"></div>');
        } else {
            console.log('A button with id ', this.getButtonId(), ' already exists.');
        }
    }

    update() {
        if (this.isInactive()) {
            this.getButtonElement().className = this.getActiveClasses();
        } else {
            this.getButtonElement().className = this.getInactiveClasses();
        }
    }

    remove(){
        $('#' + this.getButtonLabelId()).remove();
        $('#' + this.getButtonId()).remove();
    }

    getParentId(){
        return this._parentId;
    }

    /**
     * Get the correct input element from the current document to observe button changes
     */
    getButtonElement(){
        return document.getElementById(this.getButtonId());
    }
    
    getLabel(){
        return this._label;
    }

    getButtonLabelId(){
        return this._buttonLabelId;
    }
    
    getButtonId(){
        return this._buttonId;
    }

    getLabelClasses(){
        return this._labelClasses;
    }

    getInactiveClasses(){
        return this._inactiveClasses;
    }

    getActiveClasses(){
        return this._activeClasses;
    }

    isInactive(){
        return this.getButtonElement().className === this.getInactiveClasses();
    }

    isActive(){
        return this.getButtonElement().className === this.getActiveClasses();
    }

}