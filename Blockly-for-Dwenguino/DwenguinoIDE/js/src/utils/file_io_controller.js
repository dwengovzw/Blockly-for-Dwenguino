class FileIOController {
    constructor() {

    }
    /**
     * Downloads a file with the name "filename" and contents "text" to the user his/her computer.
     * @param {string} filename - the name under which the file should be saved 
     * @param {string} text - the contents of the file 
     */
    static download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    /**
     * Displays a dialog to upload a text (text) file
     * @returns a promise which returns the contents of the file
     */
    static uploadTextFile() {
        return new Promise((res, rej) => {
            let text = "";
            if (window.File && window.FileReader && window.FileList && window.Blob) {

                $('#dropzoneModal .modal-header').empty();
                $('#dropzoneModal .modal-header').append('<h4 class="modal-title">Upload</h4>');
                $('#dropzoneModal .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                $('#dropzoneModal .modal-body .message').empty();
                $('#dropzoneModal .modal-body .message').append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('dropzone',['dictSelectFile']) + '</p>');
                $('#dropzoneModal .modal-body .message').append('<label for="fileInput" class="form-label">Choose file </label><input type="file" id="fileInput" class="form-control">');
                $('#dropzoneModal .modal-body .message').append('<div id="filedrag">' + DwenguinoBlocklyLanguageSettings.translateFrom('dropzone',['dictDefaultMessage']) + '</div>');
                $('#dropzoneModal .modal-body .message').append('<pre id="fileDisplayArea"></pre>');
                $('#dropzoneModal .modal-footer').empty();
                $('#dropzoneModal .modal-footer').append('<button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>');

                $("#dropzoneModal").modal('show');

                var processFile = function (file) {
                    var textType = /text.*/;

                    if (file.type.match(textType)) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            fileDisplayArea.innerText = file.name;
                            text = reader.result;
                        }

                        reader.readAsText(file);
                    } else {
                        fileDisplayArea.innerText = DwenguinoBlocklyLanguageSettings.translateFrom('dropzone',['dictFileNotSupported']);
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
                    if (target.is("button.close") || target.is("div#dropzoneModal.modal.fade")){
                        rej("Dialog closed without result");
                    }
                });

                $("#submit_upload_modal_dialog_button").click(function () {
                    res(text);
                });

            } else {
                rej("File IO libraries not supported");
            }
        });
    }
}

export default FileIOController;