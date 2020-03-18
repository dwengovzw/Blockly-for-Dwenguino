
export default class ButtonMap{
    // Should be made private by putting a # befor
    // however, this is only supported in ES2019 so leave it public for now
    static map = {
        "sim_button_N": 0,
        "sim_button_W": 1,
        "sim_button_C": 2,
        "sim_button_E": 3,
        "sim_button_S": 4,
    }

    static pinMap = {
        "SW_N": 0,
        "SW_W": 1, 
        "SW_C": 2,
        "SW_E": 3,
        "SW_S": 4,
    }
    static mapButtonIdToIndex(buttonId){
        return ButtonMap.map[buttonId];
    }

    static mapIndexToButtonId(index){
        for (let key in ButtonMap.map){
            if (ButtonMap.map[key] === index){
                return key;
            }
        }
        return undefined;
    }

    static mapButtonPinNameToIndex(pinName){
        return ButtonMap.pinMap[pinName];
    }

    static mapIndexToButtonPinName(index){
        for (let key in ButtonMap.pinMap){
            if (ButtonMap.pinMap[key] === index){
                return key;
            }
        }
        return undefined;
    }
    
}