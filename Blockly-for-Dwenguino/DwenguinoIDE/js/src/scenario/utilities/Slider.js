export { Slider as Slider }

/**
 * Example usage:
 * 
 * this._slider = new Slider('unique_id', 'parent_id', 0, 200, 100, 'My label', '', ' cm', 'extra_css_class');
 *  
 * var self = this;
 * let sliderElement = slider.getSliderElement();
 * 
 * // When the slider is changed
 * sliderElement.oninput = function() {
 *    let id = self.getId();
 *    self._slider.updateValueLabel(this.value);
 * 
 *    // Do other stuff 
 * }
 * 
 */
class Slider {
    /***
     * @param {String} id
     * @param {String} parentId | css id of the parent element for the slider
     * @param {number} minValue | minimum value of the slider
     * @param {number} maxValue | maximum value of the slider
     * @param {number} initialValue | initial value of the slider
     * @param {string} valuePrefix | prefix for the value label
     * @param {string} valueSuffix | suffix for the value label (e.g. a measuring unit)
     * @param {string} classes | extra css classes for the slider container separated by spaces
     */
    constructor(id, parentId, minValue, maxValue, initialValue, label='', valuePrefix='', valueSuffix='', classes = ''){

        this._id = id;
        this._parentId = parentId;

        this._minValue = minValue;
        this._maxValue = maxValue;
        this._initialValue = initialValue;

        this._label = label;
        this._valuePrefix = valuePrefix;
        this._valueSuffix = valueSuffix;

        this._sliderId = 'slider_' + this._id;
        this._sliderLabelId = 'slider_' + this._id + '_label';
        this._sliderValueId = 'slider_' + this._id + '_value';
        this._sliderRangeId = 'slider_' + this._id + '_range';

        this._classes = classes; 

        this.insert();
    }

    toString(){
        return 'sonar';
    }

    insert(){
        if (!document.getElementById(this.getSliderRangeId())) {

            if(this.getLabel() != ''){
               this.insertLabel();
            }
            
            $('#' + this.getParentId()).append('<div id="' + this.getSliderValueId() + '" class="">' + this.getValuePrefix() + this.getInitialValue() + this.getValueSuffix() + '</div>');
            $('#' + this.getParentId()).append('<div id="' + this.getSliderId() + '" class="slidecontainer '+ this.getClasses() + '"></div>');
            $('#' + this.getSliderId()).append('<input id="' + this.getSliderRangeId() + '" type="range" min="'+this.getMinValue()+'" max="'+this.getMaxValue()+'" value="'+this.getInitialValue()+'" class="slider"></input>');
        
        } else {
            console.log('already exists');
        }
    }

    insertLabel(){
        let labelDiv = '' +
            '<div id="' + 
            this.getSliderLabelId() + '" class="slider_label">' + this.getLabel() + 
            '</div>'
        $('#' + this.getParentId()).append(labelDiv);
    }

    updateValueLabel(value) {
        document.getElementById(this.getSliderValueId()).innerHTML = this.getValuePrefix() + value + this.getValueSuffix();;
    }

    remove(){
        $('#' + this.getSliderLabelId()).remove();
        $('#' + this.getSliderValueId()).remove();
        $('#' + this.getSliderId()).remove();
    }


    getParentId(){
        return this._parentId;
    }

    /**
     * Get the correct input element of type "range" from the current document to observe slider value changes
     */
    getSliderElement(){
        return document.getElementById(this.getSliderRangeId());
    }

    getInitialValue(){
        return this._initialValue;
    }

    getMinValue(){
        return this._minValue;
    }

    getMaxValue(){
        return this._maxValue;
    }
    
    getLabel(){
        return this._label;
    }

    getValuePrefix(){
        return this._valuePrefix;
    }

    getValueSuffix(){
        return this._valueSuffix;
    }

    getSliderId(){
        return this._sliderId;
    }

    getSliderLabelId(){
        return this._sliderLabelId;
    }
    
    getSliderValueId(){
        return this._sliderValueId;
    }

    getSliderRangeId(){
        return this._sliderRangeId;
    }

    getClasses(){
        return this._classes;
    }
}