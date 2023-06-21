import { EVENT_NAMES } from "../../logging/event_names.js"
import { EventsEnum } from "./scenario_event.js";
import interact from 'interactjs';

/**
 * This class is responsible to make the social robot components in the scenario draggable 
 * within their container.
 * @requires interact.js
 */
class DwenguinoSimulationDraggable {
  socialRobotScenario = null;

  /**
   * @constructs
   * @param {Object} socialRobotScenario - The social robot scenario in which the components become draggable.
   * @param {Object} eventBus - The eventBus that can be used to monitor certain events in the simulator.
   */
  constructor(socialRobotScenario, eventBus){
    this.socialRobotScenario = socialRobotScenario;
    this._eventBus = eventBus;
    this.setupInteract();

    // this is used later in the resizing and gesture demos
    window.dragMoveListener = this.dragMoveListener;
  }


  setupInteract(){
    let self = this;
    // target elements with the "draggable" class
    interact('.draggable')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrict({
          restriction: 'parent', 
          //elementRect: { left: 0, right: 0, top: 0, bottom: 0 },
          endOnly: true
        })
      ],
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: this.dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                    Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
        self._eventBus.dispatchEvent(EventsEnum.SAVE);
        var data = {
          "id": event.target.id
        }
        data = JSON.stringify(data);
        self.socialRobotScenario.logger.recordEvent(self.socialRobotScenario.logger.createEvent(EVENT_NAMES.moveRobotComponent, data));
      }
    })
  }

  dragMoveListener(event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    const parentWidth = event.currentTarget.parentElement.getBoundingClientRect().width;
    const parentHeight = event.currentTarget.parentElement.getBoundingClientRect().height;
    var x = (event.rect.left - event.currentTarget.parentElement.getBoundingClientRect().left)/parentWidth*100
    var y = (event.rect.top - event.currentTarget.parentElement.getBoundingClientRect().top)/parentHeight*100
  
    target.style.left = x + '%'
    target.style.top = y + '%'
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

  fireCustomEvent(eventName, element, data) {
    'use strict';
    var event;
    data = data || {};
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
    }
  
    event.eventName = eventName;
    event = $.extend(event, data);
  
    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {
        element.fireEvent("on" + event.eventType, event);
    }
  }
}

export default DwenguinoSimulationDraggable;

