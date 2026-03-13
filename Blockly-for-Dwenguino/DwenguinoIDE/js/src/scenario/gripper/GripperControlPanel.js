/**
 * UI control panel for the gripper simulation.
 * Provides file upload inputs for custom GLB models and JSON kinematics descriptors,
 * plus a reset button to restore the default configuration.
 */
class GripperControlPanel {
    /**
     * Create the control panel and attach it to a container.
     * @param {JQuery} container - jQuery-wrapped container element
     * @param {Object} callbacks - Callback functions:
     *   - onModelUpload(event): Called when a GLB file is selected
     *   - onKinematicsUpload(event): Called when a JSON file is selected
     *   - onReset(): Called when the reset button is clicked
     *   - onToggleGraspableObject(visible): Called when graspable object checkbox changes
     *   - onGraspableShapeChange(shape): Called when shape dropdown changes
     *   - onGraspableSizeChange(size): Called when size slider changes
     *   - onResetGraspableObject(): Called when graspable object reset button is clicked
     */
    setup(container, callbacks) {
        let panel = $("<div>")
            .css({
                "position": "absolute",
                "left": "10px",
                "bottom": "10px",
                "background": "rgba(255,255,255,0.9)",
                "padding": "10px",
                "border-radius": "8px",
                "width": "260px",
                "box-shadow": "0 2px 6px rgba(0,0,0,0.15)",
                "font-size": "12px"
            });

        // GLB model upload
        let modelLabel = $("<div>").text("GLB model");
        let modelInput = $("<input>")
            .attr("type", "file")
            .attr("accept", ".glb");
        modelInput.on("change", (event) => callbacks.onModelUpload(event));

        // Kinematics JSON upload
        let kinematicsLabel = $("<div>").css({ "margin-top": "8px" }).text("Kinematics JSON");
        let kinematicsInput = $("<input>")
            .attr("type", "file")
            .attr("accept", ".json,application/json");
        kinematicsInput.on("change", (event) => callbacks.onKinematicsUpload(event));

        // Reset button
        let resetButton = $("<button>")
            .text("Reset mapping")
            .css({ "margin-top": "8px", "width": "100%" });
        resetButton.on("click", () => callbacks.onReset());

        panel.append(modelLabel);
        panel.append(modelInput);
        panel.append(kinematicsLabel);
        panel.append(kinematicsInput);
        panel.append(resetButton);

        // Graspable object controls (only if callbacks are provided)
        if (callbacks.onToggleGraspableObject) {
            let separator = $("<hr>").css({ "margin": "10px 0 8px" });
            panel.append(separator);

            let objectLabel = $("<div>").css({ "font-weight": "bold" }).text("Graspable Object");

            let toggleRow = $("<div>").css({ "margin-top": "4px" });
            let toggleCheckbox = $("<input>")
                .attr("type", "checkbox")
                .attr("id", "graspable-toggle");
            let toggleText = $("<label>")
                .attr("for", "graspable-toggle")
                .css({ "margin-left": "4px" })
                .text("Show object");
            toggleCheckbox.on("change", function () {
                callbacks.onToggleGraspableObject(this.checked);
            });
            toggleRow.append(toggleCheckbox).append(toggleText);

            panel.append(objectLabel);
            panel.append(toggleRow);

            if (callbacks.onGraspableShapeChange) {
                let shapeRow = $("<div>").css({ "margin-top": "4px" });
                let shapeSelect = $("<select>").css({ "width": "100%" });
                for (const s of ["sphere", "box", "cylinder"]) {
                    shapeSelect.append($("<option>").val(s).text(s));
                }
                shapeSelect.on("change", function () {
                    callbacks.onGraspableShapeChange(this.value);
                });
                shapeRow.append($("<span>").text("Shape: ")).append(shapeSelect);
                panel.append(shapeRow);
            }

            if (callbacks.onGraspableSizeChange) {
                let sizeRow = $("<div>").css({ "margin-top": "4px" });
                let sizeSlider = $("<input>")
                    .attr("type", "range")
                    .attr("min", "5")
                    .attr("max", "50")
                    .attr("value", "15")
                    .css({ "width": "100%" });
                let sizeLabel = $("<span>").text("Size: 15mm");
                sizeSlider.on("input", function () {
                    let sizeVal = parseInt(this.value, 10);
                    sizeLabel.text(`Size: ${sizeVal}mm`);
                    callbacks.onGraspableSizeChange(sizeVal / 1000);
                });
                sizeRow.append(sizeLabel).append(sizeSlider);
                panel.append(sizeRow);
            }

            if (callbacks.onResetGraspableObject) {
                let resetObjBtn = $("<button>")
                    .text("Reset object position")
                    .css({ "margin-top": "6px", "width": "100%" });
                resetObjBtn.on("click", () => callbacks.onResetGraspableObject());
                panel.append(resetObjBtn);
            }
        }

        container.append(panel);
    }
}

export default GripperControlPanel;
