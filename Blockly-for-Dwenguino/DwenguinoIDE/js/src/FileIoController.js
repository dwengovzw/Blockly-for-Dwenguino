export default class FileIOController {
    constructor() {

    }
    /**
     * Downloads a file with the name "filename" and contents "text" to the user his/her computer.
     * @param {the name under which the file should be saved} filename 
     * @param {the contents of the file} text 
     */
    download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    /**
     * Displays a dialog to upload a text file
     * @returns a promise which returns the contents of the file
     */
    uploadXml() {
        return new Promise((res, rej) => {
            let xml = "";
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
                console.log("yay, files supported");

                // reset form
                $('div').remove('#dropzoneModal');

                $('#blocklyDiv').append('<div id="dropzoneModal" class="modal fade" role="dialog"></div>');
                $('#dropzoneModal').append('<div id="modalDialog" class="modal-dialog"></div>');
                $('#modalDialog').append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Upload</h4></div>');
                $('#modalDialog').append('<div class="modal-body">' + MSG.dropzone['dictSelectFile'] + '<input type="file" id="fileInput"><div id="filedrag">' + MSG.dropzone['dictDefaultMessage'] + '</div><pre id="fileDisplayArea"><pre></div>');
                $('#modalDialog').append('<div class="modal-footer"><button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button></div>');

                $("#dropzoneModal").modal('show');

                var processFile = function (file) {
                    var textType = /text.*/;

                    if (file.type.match(textType)) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            fileDisplayArea.innerText = file.name;
                            xml = reader.result;
                        }

                        reader.readAsText(file);
                    } else {
                        fileDisplayArea.innerText = "File not supported!"
                    }
                }

                var fileInput = document.getElementById('fileInput');
                var fileDisplayArea = document.getElementById('fileDisplayArea');

                fileInput.addEventListener('change', function (e) {
                    var file = fileInput.files[0];
                    processFile(file);
                });

                // file drag hover
                var FileDragHover = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    e.target.className = (e.type == "dragover" ? "hover" : "");
                };

                // file selection
                var FileSelectHandler = function (e) {
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

                $("#dropzoneModal").on('click',(e) => {
                    let target  = $(e.target);
                    console.log(target);
                    if (target.is("button.close") || target.is("div#dropzoneModal.modal.fade")){
                        console.log("closed");
                        rej("Dialog closed without result");
                    }
                });

                $("#submit_upload_modal_dialog_button").click(function () {
                    res(xml);
                });

            } else {
                rej("File IO libraries not supported");
            }
        });
    }
}