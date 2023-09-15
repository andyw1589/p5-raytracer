// This script controls the ball-adding functionality

let ballId = 1;
// Create a ball-control div for the current number of balls as an html string
function createBallControl(id) {
    let htmlString = `
    <div id="ball-${id}" class="border ball-control">
        <div id="ball-${id}-centre" class="ball-centre">
            <label for="ball-${id}-x">x:</label>
            <input type="number" id="ball-${id}-x" name="ball-${id}-x" class="w-50" value="0">

            <label for="ball-${id}-y">y:</label>
            <input type="number" id="ball-${id}-y" name="ball-${id}-y" class="w-50" value="0">

            <label for="ball-${id}-z">z:</label>
            <input type="number" id="ball-${id}-z" name="ball-${id}-z" class="w-50" value="-5">
        </div>

        <div class="ball-radius">
            <label for="ball-${id}-radius">radius:</label>
            <input type="number" id="ball-${id}-radius" name="ball-${id}-radius" value="3">
        </div>

        <div>
            <label for="ball-${id}-colour">colour:</label>
            <select id="ball-${id}-colour" name="ball-${id}-colour">
                <option value="red" name="red">red</option>
                <option value="orange" name="orange">orange</option>
                <option value="yellow" name="yellow">yellow</option>
                <option value="green" name="green">green</option>
                <option value="blue" name="blue">blue</option>
                <option value="purple" name="purple">purple</option>
                <option value="white" name="white">white</option>
                <option value="black" name="black">black</option>
            </select>
        </div>

        <div>
            <label for="ball-${id}-material">material:</label>
            <select id="ball-${id}-material" name="ball-${id}-material">
                <option value="plastic" name="plastic">plastic</option>
                <option value="metal" name="metal">metal</option>
                <option value="matte" name="matte">matte</option>
            </select>
        </div>

        <button id="ball-${id}-delete">
            delete
        </button>
    </div>
    `;
    let element = $.parseHTML(htmlString);
    $("#balls").append(element);

    // add the delete functionality
    $(`#ball-${id}`).children(`#ball-${id}-delete`).on("click", () => {
        $(`#ball-${id}`).remove();
    });
}

// create the initial ball
createBallControl(ballId);

// add the "add ball" functionality
$("#add-ball").on("click", () => {
    ballId++;
    createBallControl(ballId);
})