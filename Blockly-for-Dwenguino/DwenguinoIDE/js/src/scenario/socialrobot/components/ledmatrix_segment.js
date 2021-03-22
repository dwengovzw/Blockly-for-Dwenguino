import { RobotComponent } from './robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js'

export { SocialRobotLedMatrixSegment, DisplayDataTypesEnum }

/**
 * The supported robot component types
 * @readonly
 * @enum {string}
 */
const DisplayDataTypesEnum = {
    DISPLAY: 'display',
    SEGMENT: 'segment',
  };
  Object.freeze(DisplayDataTypesEnum);

/**
 * @extends RobotComponent
 */
class SocialRobotLedMatrixSegment extends RobotComponent{
    constructor(eventBus, id, dataPin, csPin, clkPin, visible, x, y, offsetLeft, offsetTop, htmlClasses){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.LEDMATRIXSEGMENT;
        this._x = x;
        this._y = y;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._dataPin = dataPin;
        this._csPin = csPin;
        this._clkPin = clkPin;
        console.log('state adjusted');
        this._state = SocialRobotLedMatrixSegment.getEmptyLedMatrix();
        this._canvasId = 'sim_ledmatrixsegment_canvas' + this._id; 
        this._ledSvg = new Image();
        this._ledSvg.src = './DwenguinoIDE/img/socialrobot/led_matrix_on.svg';
        this._ledOffsets = { 
            'left' : 15,
            'led_x' : 1.14, 
            'led_y' : 1.25,
            'led_between_x' : 8.65,
            'led_between_y' : 8.53,
            'led_radius' : 6.35 };  
        this._ledmatrixBackground = new Image();
        this._ledmatrixBackground.src = './DwenguinoIDE/img/socialrobot/led_matrix_1x1.svg';

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    static getEmptyLedMatrix(){
        let emptyMatrix =   
            [   [   [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0] ],
                [   [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0] ],
                [   [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0] ],
                [   [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0], 
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0] ]];
        return emptyMatrix;
    }

    toString(){
        return 'LED MATRIX';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',[this.getType()]) + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");

        let simLedMatrix = document.getElementById('sim_'+this.getType() + this.getId());

        simLedMatrix.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(DwenguinoBlocklyLanguageSettings.translate(['ledmatrixOptions']));
            this.showDialog();
        });
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();
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

        data = data.concat(" DataPin='", this.getDataPin(), "'");
        data = data.concat(" CsPin='", this.getCsPin(), "'");
        data = data.concat(" ClkPin='", this.getClkPin(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this.setX(0);
        this.setY(0);
        let dataObject = {
            "dataType": DisplayDataTypesEnum.DISPLAY,
            "data": SocialRobotLedMatrixSegment.getEmptyLedMatrix()
        }
        this.setState(dataObject);
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_ledmatrix' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_ledmatrix' + this.getId()).css('visibility', 'hidden');
        }
    }

    showDialog(){
        $("#componentOptionsModal").modal('show');
    }
    
    removeDialog(){
        $('div').remove('#componentOptionsModal');
        $('.modal-backdrop').remove();
    }

    createComponentOptionsModalDialog(headerTitle){
        this.removeDialog();
    
        $('#db_body').append('<div id="componentOptionsModal" class="modal fade" role="dialog"></div>');
        $('#componentOptionsModal').append('<div id="componentOptionsModalDialog" class="modal-dialog"></div>');
    
        $('#componentOptionsModalDialog').append('<div id="componentOptionsModalContent" class="modal-content"></div>');
    
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalHeader" class="modal-header"></div>');
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalBody" class="modal-body container"></div>');
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalFooter" class="modal-footer"></div>');
    
        $('#componentOptionsModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#componentOptionsModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');

        this.createPinOptionsInModalDialog();
    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsDataPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsDataPin').append('<div class="col-md-2">'+'Data pin'+'</div>');
        $('#componentOptionsDataPin').append('<div id="dataPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsCsPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsCsPin').append('<div class="col-md-2">'+'Cs pin'+'</div>');
        $('#componentOptionsCsPin').append('<div id="csPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsClkPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsClkPin').append('<div class="col-md-2">'+'Clk pin'+'</div>');
        $('#componentOptionsClkPin').append('<div id="clkPin" class="col-md-10"></div>');
    
        let dataPin = this.getPossibleDataPin();
        let csPin = this.getPossibleCsPin();
        let clkPin = this.getPossibleClkPin();

        $('#dataPin').append('<button type="button" id=dataPin'+dataPin+' name='+dataPin+' class="col-md-1 ml-2 mb-2 dataPinButton pinButton option_button_enabled">'+dataPin+'</button>');
        $('#dataPin' + dataPin).addClass('option_button_selected');

        $('#csPin').append('<button type="button" id=csPin'+csPin+ ' name='+csPin+' class="col-md-1 ml-2 mb-2 csPinButton pinButton option_button_enabled">'+csPin+'</button>');
        $('#csPin' + csPin).addClass('option_button_selected');
        
        $('#clkPin').append('<button type="button" id=clkPin'+clkPin+ ' name='+clkPin+ ' class="col-md-1 ml-2 mb-2 clkPinButton pinButton option_button_enabled">'+clkPin+'</button>');
        $('#clkPin' + clkPin).addClass('option_button_selected');

    }


    getPossibleDataPin(){
        return '2';
    }

    getPossibleCsPin(){
        return '10';
    }

    getPossibleClkPin(){
        return '13';
    }

    getId(){
        return this._id;
    }

    getType(){
        return this._type;
    }

    setX(x){
        this._x = x;
    }

    getX(){
        return this._x;
    }

    setY(y){
        this._y = y;
    }

    getY(){
        return this._y;
    }

    setOffset(offset){
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    setDataPin(dataPin){
        this._dataPin = dataPin;
    }
    
    getDataPin() {
        return this._dataPin;
    }

    setCsPin(csPin){
        this._csPin = csPin;
    }

    getCsPin() {
        return this._csPin;
    }

    setClkPin(clkPin){
        this._clkPin = clkPin;
    }

    getClkPin(){
        return this._clkPin;
    }

    setState(state){
        if(state["dataType"] == DisplayDataTypesEnum.DISPLAY){
            for(var i = 0; i < 4; i++ ){
                this._state[i] = state["data"][i];
            }
        } else if(state["dataType"] == DisplayDataTypesEnum.SEGMENT){
            let segmentNumber = state["data"][0];
            this._state[segmentNumber] = state["data"][1];
        }
    }

    getState(){
        return this._state;
    }

    getCanvasId(){
        return this._canvasId;
    }

    getLedSvg(){
        return this._ledSvg;
    }

    getLedOffsets(){
        return this._ledOffsets;
    }

    getLedmatrixBackground(){
        return this._ledmatrixBackground;
    }
}