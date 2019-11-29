//const StatesEnum = {"plain":0, "eye":1, "mouth":2, "righthand":3, "lefthand":4};
const StatesEnum = {
    PLAIN: 'plain', 
    EYE: 'eye', 
    MOUTH: 'mouth',
    RIGHTHAND: 'righthand',
    LEFTHAND: 'lefthand'
  };
Object.freeze(StatesEnum);

function DwenguinoScenarioUtils(scenario){
    this.scenario = scenario;
}

/**
 * Clear all canvases in the simulator that are part
 * of the "sim_canvas" class.
 */
DwenguinoScenarioUtils.prototype.saveScenario = function(data){
    if (window.dwenguinoBlocklyServer){
        console.log('save scenario with server');
        window.dwenguinoBlocklyServer.saveScenario(data);
    } else {
        console.log('save scenario');
        DwenguinoBlockly.download("scenario.xml", data);
    }
    DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("downloadScenarioClicked", ""));
}

DwenguinoScenarioUtils.prototype.loadScenario = function(scenario){
    var self = this; 
    if (window.dwenguinoBlocklyServer){
        console.log('load scenario with server');
        this.scenario.xml = window.dwenguinoBlocklyServer.loadScenario();
        this.scenario.loadFromXml();
    } else{
        console.log('load scenario');
        if (window.File && window.FileReader && window.FileList && window.Blob) {

            // reset form
            $('div').remove('#dropzoneModal');

            $('#blocklyDiv').append('<div id="dropzoneModal" class="modal fade" role="dialog"></div>');
            $('#dropzoneModal').append('<div id="modalDialog" class="modal-dialog"></div>');
            $('#modalDialog').append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Upload</h4></div>');
            $('#modalDialog').append('<div class="modal-body">Selecteer een bestand.<input type="file" id="fileInput"><div id="filedrag">of zet ze hier neer</div><pre id="fileDisplayArea"><pre></div>');
            $('#modalDialog').append('<div class="modal-footer"><button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button></div>');

            $("#dropzoneModal").modal('show');

            var processFile = function(file){
              var textType = /text.*/;
    
              if (file.type.match(textType)) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                  fileDisplayArea.innerText = file.name;
                  self.scenario.xml = reader.result;
                }
    
                reader.readAsText(file);
              } else {
                fileDisplayArea.innerText = "File not supported!"
              }
            }
    
            var fileInput = document.getElementById('fileInput');
            var fileDisplayArea = document.getElementById('fileDisplayArea');
    
            fileInput.addEventListener('change', function(e) {
              var file = fileInput.files[0];
              processFile(file);
            });
    
            // file drag hover
            var FileDragHover = function(e) {
              e.stopPropagation();
              e.preventDefault();
              e.target.className = (e.type == "dragover" ? "hover" : "");
            };
    
            // file selection
            var FileSelectHandler = function(e) {
              // cancel event and hover styling
              FileDragHover(e);
              // fetch FileList object
              var files = e.target.files || e.dataTransfer.files;
              var file = files[0];
              processFile(file);
            };
    
            var filedrag = document.getElementById("filedrag");
            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
            filedrag.style.display = "block";

            $("#submit_upload_modal_dialog_button").click(function(){
                self.scenario.loadFromXml();
            });

        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }
}

// DwenguinoScenarioUtils.prototype.setBackgroundImage = function(){
//     var self = this; 
//     if (window.File && window.FileReader && window.FileList && window.Blob) {

//         // reset form
//         $('div').remove('#dropzoneModal');

//         $('#blocklyDiv').append('<div id="dropzoneModal" class="modal fade" role="dialog"></div>');
//         $('#dropzoneModal').append('<div id="modalDialog" class="modal-dialog"></div>');
//         $('#modalDialog').append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Upload</h4></div>');
//         $('#modalDialog').append('<div class="modal-body">Selecteer een bestand.<input type="file" id="fileInput"><div id="filedrag">of zet ze hier neer</div><pre id="fileDisplayArea"><pre></div>');
//         $('#modalDialog').append('<div class="modal-footer"><button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button></div>');

//         $("#dropzoneModal").modal('show');

//         var processFile = function(file){

//             // TODO implement change of background image
//         }

//         var fileInput = document.getElementById('fileInput');
//         var fileDisplayArea = document.getElementById('fileDisplayArea');

//         fileInput.addEventListener('change', function(e) {
//             var file = fileInput.files[0];
//             processFile(file);
//         });

//         // file drag hover
//         var FileDragHover = function(e) {
//             e.stopPropagation();
//             e.preventDefault();
//             e.target.className = (e.type == "dragover" ? "hover" : "");
//         };

//         // file selection
//         var FileSelectHandler = function(e) {
//             // cancel event and hover styling
//             FileDragHover(e);
//             // fetch FileList object
//             var files = e.target.files || e.dataTransfer.files;
//             var file = files[0];
//             processFile(file);
//         };

//         var filedrag = document.getElementById("filedrag");
//         filedrag.addEventListener("dragover", FileDragHover, false);
//         filedrag.addEventListener("dragleave", FileDragHover, false);
//         filedrag.addEventListener("drop", FileSelectHandler, false);
//         filedrag.style.display = "block";

//         $("#submit_upload_modal_dialog_button").click(function(){
//             self.scenario.loadFromXml();
//         });

//     } else {
//         alert('The File APIs are not fully supported in this browser.');
//     }
// }

DwenguinoScenarioUtils.prototype.textToDom = function(text){
    var oParser = new DOMParser();
    var dom = oParser.parseFromString(text, 'text/xml');
    // The DOM should have one and only one top-level node, an XML tag.
    if (!dom || !dom.firstChild ||
        dom.firstChild.nodeName.toLowerCase() != 'xml' ||
        dom.firstChild !== dom.lastChild) {
      // Whatever we got back from the parser is not XML.
      goog.asserts.fail('Blockly.Xml.textToDom did not obtain a valid XML tree.');
    }
    return dom.firstChild;
}

DwenguinoScenarioUtils.prototype.contextMenuBackground = function(){
    // var self = this;
    // $(function(){
    //     $.contextMenu({
    //         selector: '#sim_background',
    //         trigger: 'right', 
    //         callback: function(itemKey, opt, e) {
    //             var m = "global: " + itemKey;
    //             window.console && console.log(m) || alert(m); 
    //         },
    //         items: {
    //             "image": {
    //                 name: "Change image", 
    //                 callback: function(itemKey, opt, e) {
    //                     self.setBackgroundImage();
    //                 }
    //             }
    //         }
    //     });
    // });  
}

DwenguinoScenarioUtils.prototype.contextMenuServo = function(){
    var self = this;
    $(function(){
        $.contextMenu({
            selector: '.sim_element_servo',
            trigger: 'right', 
            callback: function(itemKey, opt, e) {
                var m = "global: " + itemKey;
                window.console && console.log(m) || alert(m); 
            },
            items: {
                "plain": {
                    name: MSG.socialrobot['plain'],
                    callback: function(itemKey, opt, e) {
                        var simServoId = this.attr('id');
                        var i = simServoId.replace(/\D/g,'');
                        self.scenario.setServoState(i, StatesEnum.PLAIN);
                    }
                },
                // "eye": {
                //     name: MSG.socialrobot['eye'], 
                //     // superseeds "global" callback
                //     callback: function(itemKey, opt, e) {
                //         var simServoId = this.attr('id');
                //         var i = simServoId.replace(/\D/g,'');
                //         self.scenario.setServoState(i, StatesEnum.EYE);
                //     }
                // },
                // "mouth": {name: MSG.socialrobot['mouth'],},
                "righthand": {
                    name: MSG.socialrobot['righthand'],
                    callback: function(itemKey, opt, e) {
                        var simServoId = this.attr('id');
                        var i = simServoId.replace(/\D/g,'');
                        self.scenario.setServoState(i, StatesEnum.RIGHTHAND);
                    }
                },
                "lefthand": {
                    name: MSG.socialrobot['lefthand'],
                    callback: function(itemKey, opt, e) {
                        var simServoId = this.attr('id');
                        var i = simServoId.replace(/\D/g,'');
                        self.scenario.setServoState(i, StatesEnum.LEFTHAND);
                    }
                }//,
                //"sep1": "---------",
                //"quit": {name: "Quit"}
            }
        });
    });  
}

DwenguinoScenarioUtils.prototype.contextMenuLed = function(){
    var self = this;
    $(function(){
        $.contextMenu.types.label = function(item, opt, root) {
            // this === item.$node
            $('<span>Color<ul>'
                + '<li class="label1" title="yellow">yellow'
                + '<li class="label2" title="red">red'
                + '<li class="label3" title="blue">blue'
                + '<li class="label4" title="green">green')
                .appendTo(this)
                .on('click', 'li', function() {
                    // do some funky stuff
                    //console.log('Clicked on ' + $(this).text());
                    // hide the menu
                    root.$menu.trigger('contextmenu:hide');
                });
    
            this.addClass('labels').on('contextmenu:focus', function(e) {
                // setup some awesome stuff
            }).on('contextmenu:blur', function(e) {
                // tear down whatever you did
            }).on('keydown', function(e) {
                // some funky key handling, maybe?
            });
        };
    
        /**************************************************
         * Context-Menu with custom command "label"
         **************************************************/
        $.contextMenu({
            selector: '.sim_element_led', 
            callback: function(itemKey, opt, rootMenu, originalEvent) {
            },
            items: {
                label: {
                    type: "label", 
                    customName: "Color",
                    
                    callback: function(itemKey, opt, e) {
                        var simLedId = this.attr('id');
                        var i = simLedId.replace(/\D/g,'');
                        var color = $(e.target).text(); 
                        self.scenario.setLedColor(i, color);
                    }
                }
            }
        });
    });

}

