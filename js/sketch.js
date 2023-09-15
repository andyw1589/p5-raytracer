const CANVAS_SIZE = 400;

// Due to the way p5 loads, can't call createVector when the script loads
// Lazily evaluate instead
// Return the ka and kd coefficient (in this case they are equal) of the given colour
function getColour(colourName) {
    let colours = {
        "red": createVector(1, 0, 0),
        "orange": createVector(1, 0.5, 0),
        "yellow": createVector(1, 1, 0),
        "green": createVector(0, 1, 0),
        "blue": createVector(0, 0, 1),
        "purple": createVector(1, 0, 1),
        "white": createVector(0.8, 0.8, 0.8),
        "black": createVector(0.1, 0.1, 0.1)
    };
    return colours[colourName];
}

// Return the ks, km, and phong_exponent of given material
function getMaterial(materialName) {
    let materials = {
        "plastic": {
            "ks": createVector(0.8, 0.8, 0.8),
            "km": createVector(0.05, 0.05, 0.05),
            "phong_exponent": 40
        },
        "metal": {
            "ks": createVector(0.8, 0.8, 0.8),
            "km": createVector(0.95, 0.95, 0.95),
            "phong_exponent": 2500
        },
        "matte": {
            "ks": createVector(0.06, 0.06, 0.06),
            "km": createVector(0.01, 0.01, 0.01),
            "phong_exponent": 30
        }
    };
    return materials[materialName];
}

// Render the darn thing using raycasting
function render() {
    // reset the canvas
    background(0);

    // set up the initial grid
    let resolution = select("#resolution-slider").value();
    let cellSize = CANVAS_SIZE / resolution;

    // get lighting
    let lightingX = select("#lighting-x").value();
    let lightingY = select("#lighting-y").value();
    let lightingZ = select("#lighting-z").value();
    let lighting = createVector(lightingX, lightingY, lightingZ);

    // set up the camera
    let distance = select("#distance-slider").value();
    let mainCamera = new Camera(createVector(0, 0, distance), lighting);

    // add the balls from the html
    // use jquery instead of p5 here because p5 includes text nodes
    let balls = $("#balls").children();
    balls.each(function() {
        // get the ball's id and the ball information
        let i = this.id.substring(5);
        let centre = createVector($(`#ball-${i}-x`).val(), $(`#ball-${i}-y`).val(), $(`#ball-${i}-z`).val());
        let radius = $(`#ball-${i}-radius`).val();
        let colour = getColour($(`#ball-${i}-colour`).val());
        let material = getMaterial($(`#ball-${i}-material`).val());

        let actualMaterial = {"ka": colour, "kd": colour, ...material};
        mainCamera.addBall(new Ball(centre, radius, actualMaterial));
    });

    // draw the cell grid, raycast for each grid
    noStroke();
    for (let x = 0; x < resolution; x++) {
        for (let y = 0; y < resolution; y++) {
            fill(mainCamera.raycastFromCamera(createVector(x, y)));
            square(x * cellSize, (resolution - y - 1) * cellSize, cellSize);  // canvas is upside down by default
        }
    }
}

// Set up a given slider (make its corresponding label change as its value changes)
function setupSlider(sliderName) {
    let slider = select(`#${sliderName}-slider`);
    let label = select(`label[for=${`${sliderName}-slider`}]`);

    slider.input(() => {
        label.html(`${sliderName}: ${slider.value()}`);
    });
}

function setup() {
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    canvas.parent("canvas");
    canvas.class("border");

    // the draw button will start the raycasting
    let drawButton = select("#draw");
    drawButton.mouseClicked(render);

    // set up all the sliders
    setupSlider("resolution");
    setupSlider("distance");

    noLoop();  // stop from looping
}