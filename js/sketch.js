const CANVAS_SIZE = 400;

// Render the darn thing using raycasting
function render() {
    // reset the canvas
    background(255);

    // set up the initial grid
    let resolution = select("#resolution-slider").value();
    let cellSize = Math.ceil(CANVAS_SIZE / resolution);

    // set up the camera
    let distance = select("#distance-slider").value();
    let mainCamera = new Camera(
        createVector(0, 0, distance),
        10
    );
    mainCamera.setLighting(createVector(0, -1, 0));

    // hardcode balls for now
    mainCamera.addBall(new Ball(createVector(0, 0, -7), 3, color(255, 0, 0)));
    mainCamera.addBall(new Ball(createVector(5, 1, -8.5), 2, color(0, 255, 0)));
    mainCamera.addBall(new Ball(createVector(-2.5, -1, -5.5), 1.5, color(0, 0, 255)));

    // draw the cell grid, raycast for each grid
    noStroke();
    for (let x = 0; x < resolution; x++) {
        for (let y = 0; y < resolution; y++) {
            fill(mainCamera.raycast(createVector(x, y)));
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