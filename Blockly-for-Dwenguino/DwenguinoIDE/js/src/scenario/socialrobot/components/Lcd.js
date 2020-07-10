import {RobotComponent } from './RobotComponent.js ';
import { TypesEnum } from '../RobotComponentsFactory.js';

export { SocialRobotLcd as SocialRobotLcd }

class SocialRobotLcd extends RobotComponent{
    constructor(eventBus, id, visible = true, offsetLeft = 5, offsetTop = 5, htmlClasses = ''){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.LCD;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._state = new Array(2);

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'lcd';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_lcd" + this.getId() + "' class='sim_element sim_element_lcd draggable'><div><span class='grippy'></span>Lcd</div></div>");
        $('#sim_lcd' + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_lcd' + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_lcd' + this.getId()).append("<div id='sim_element_lcd_img'></div>");
        $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row0"></div>');
        $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row1"></div>');
    }

    removeHtml(){
        $("#sim_lcd" + this.getId() + "").remove();
    }

    toXml(){
        let data = '';
        
        data = data.concat("<Item ");
        data = data.concat(" Type='", this.getType(), "'");
        data = data.concat(" Id='", this.getId(), "'");

        let simId = '#sim_' + this.getType() + this.getId();
        if ($(simId).attr('data-x')) {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']) + parseFloat($(simId).attr('data-x')), "'");
        } else {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']), "'");
        }
        if ($(simId).attr('data-y')) {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']) + parseFloat($(simId).attr('data-y')), "'");
        } else {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']), "'");
        }

        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_lcd' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_lcd' + this.getId()).css('visibility', 'hidden');
        }
    }

    getId(){
        return this._id;
    }

    getType(){
        return this._type;
    }

    setOffset(offset){
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    setState(row0, row1){
        this._state[0] = row0;
        this._state[1] = row1;
    }

    getState(){
        return this._state;
    }

}