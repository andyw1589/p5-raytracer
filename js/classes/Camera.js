const VIEWPORT_DISTANCE = 5;  // distance from viewpoint to camera's origin is fixed

class Camera {
    /*
     * Create a basic camera for basic raycasting, forward is the negative z direction.
     *
     * origin: A p5 vector representing the camera's centre
     * z: The camera's distance from the viewport
     * viewportSize: The (square) viewport's side length
     */
    constructor(origin, viewportSize) {
        this.origin = origin;
        this.viewportSize = viewportSize;
        this.scene = [];  // an array of balls
    }

    // Set the camera's light direction to the given unit vector
    setLighting(direction) {
        this.lighting = direction;
    }

    // Add a ball to the camera's scene
    addBall(ball) {
        this.scene.push(ball);
    }

    // Return a random p5 colour
    randomColour() {
        return color([Math.random() * 255, Math.random() * 255, Math.random() * 255]);
    }

    // Perform raycast from centre to the given canvas grid coordinates
    raycast(coords) {
        let intersectedBall;
        let minT = 500;
        let minNormal;

        // convert grid coordinates to physical viewport coordinates
        let x = coords.x
        let y = coords.y
        let resolution = select("#resolution-slider").value();
        let viewportGridSize = this.viewportSize / resolution;
        let viewportX = x * viewportGridSize + (viewportGridSize / 2) - this.viewportSize / 2;
        let viewportY = y * viewportGridSize + (viewportGridSize / 2) - this.viewportSize / 2;  // shoot ray into centre of the grid cell
        
        // the corresponding point on the viewport
        let viewportGridPoint = createVector(viewportX, viewportY, this.origin.z - VIEWPORT_DISTANCE);
        let rayDirection = p5.Vector.sub(viewportGridPoint, this.origin);
        rayDirection.normalize();
        let ray = new Ray(viewportGridPoint, rayDirection);

        // Find which ball is intersecting
        for (const ball of this.scene) {
            let [intersected, t, normal] = ball.intersectRay(ray, 0);
            if (!intersected) continue;
            if (t < minT) {
                minT = t;
                minNormal = normal;
                intersectedBall = ball;
            }
        }

        return intersectedBall? intersectedBall.colour : color(0);
    }
}