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
        container.append(panel);
    }
}

export default GripperControlPanel;
