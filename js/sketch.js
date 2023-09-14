const CANVAS_SIZE = 400;

// Render the darn thing using raycasting
function render() {
    // a bunch of structs representing different materials
    // have to put them here because of the way p5 works or something
    const RED_PLASTIC = {
        "ka": createVector(1, 0, 0.2),
        "kd": createVector(1.0, 0.1, 0.2),
        "ks": createVector(0.8, 0.8, 0.8),
        "km": createVector(0.05, 0.05, 0.05),
        "phong_exponent": 50
    };

    const BLUE_MIRROR = {
        "ka": createVector(0.0, 0.0, 0.5),
        "kd": createVector(0.2, 0.2, 0.5),
        "ks": createVector(0.6, 0.75, 0.8),
        "km": createVector(0.95, 0.95, 0.95),
        "phong_exponent": 3000
    };

    const GREEN_PLASTIC = {
        "ka": createVector(0.0, 0.8, 0.0),
        "kd": createVector(0.3, 0.6, 0.2),
        "ks": createVector(0.95, 0.75, 0.8),
        "km": createVector(0.05, 0.05, 0.05),
        "phong_exponent": 75
    };

    const PURPLE_MATTE = {
        "ka": createVector(0.3, 0.0, 0.7),
        "kd": createVector(0.3, 0.0, 0.7),
        "ks": createVector(0.06, 0.0, 0.14),
        "km": createVector(0.01, 0.01, 0.01),
        "phong_exponent": 50
    }

    // reset the canvas
    background(0);

    // set up the initial grid
    let resolution = select("#resolution-slider").value();
    let cellSize = CANVAS_SIZE / resolution;

    // set up the camera
    let distance = select("#distance-slider").value();
    let mainCamera = new Camera(createVector(0, 0, distance), createVector(1, -1, -1));

    // hardcode balls for now
    mainCamera.addBall(new Ball(createVector(0, 0, -5.5), 3, RED_PLASTIC));
    mainCamera.addBall(new Ball(createVector(5, 1, -7), 2, BLUE_MIRROR));
    mainCamera.addBall(new Ball(createVector(3, -1.5, -4), 1.5, BLUE_MIRROR));
    mainCamera.addBall(new Ball(createVector(-3, -1, -3.5), 2, GREEN_PLASTIC));
    mainCamera.addBall(new Ball(createVector(-3, 2, -8.5), 4, PURPLE_MATTE));

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