const VIEWPORT_DISTANCE = 1;  // distance from viewpoint to camera's origin is fixed
const VIEWPORT_SIZE = 2;
const MAX_T = 500;  // max parametrization for a ray

// Reflect the incoming vector v about the normal vector n
function reflect(v, n) {
    return p5.Vector.sub(v, p5.Vector.mult(n, 2 * v.dot(n)));
}

class Camera {
    /*
     * Create a basic camera for basic raycasting, forward is the negative z direction.
     *
     * origin: A p5 vector representing the camera's centre
     * lighting: A p5 vector representing the directional light (doesn't have to be normalized)
     */
    constructor(origin, lighting) {
        this.origin = origin;
        this.lighting = lighting;
        this.lighting.normalize();
        this.scene = [];  // an array of balls
    }

    // Add a ball to the camera's scene
    addBall(ball) {
        this.scene.push(ball);
    }

    // Return a random p5 colour
    randomColour() {
        return color([Math.random() * 255, Math.random() * 255, Math.random() * 255]);
    }

    // The following were cribbed from an assignment I wrote in CSC317 about raytracing

    // Raycast, return the intersected ball (if any), t, and normal
    raycast(ray) {
        let intersectedBall = null;
        let minT = MAX_T;
        let minNormal;

        // Find which ball is intersecting
        for (const ball of this.scene) {
            let [intersected, t, normal] = ball.intersectRay(ray, 0);
            if (!intersected) continue;
            if ((t < minT) && (t > 0.001)) {  // ray should not hit things at or behind origin
                minT = t;
                minNormal = normal;
                intersectedBall = ball;
            }
        }

        return [intersectedBall, minT, minNormal];
    }

    // Calculate Blinn-Phong shading model, return colour as a VECTOR on 0-1 scale
    blinnPhongShading(ray, hitBall, t, n) {
        let colour = p5.Vector.mult(hitBall.material.ka, 0.1);

        // calculate the intersection point of the ray with hitBall
        let normalBuffer = p5.Vector.mult(n, 0.01);
        let intersection = p5.Vector.add(ray.origin, p5.Vector.mult(ray.direction, t))
        intersection.add(normalBuffer);

        // raycast towards the directional light
        let toLight = p5.Vector.mult(this.lighting, -1);
        let shadowRay = new Ray(intersection, toLight);

        // check if the shadow ray hit anything
        let [shadowHit, shadowT, shadowNormal] = this.raycast(shadowRay);

        if (shadowHit) return colour;  // shadow hit, no need to add anything to the colour

        // calculate the diffuse intensity
        let diffuseIntensity = p5.Vector.mult(hitBall.material.kd, Math.max(0, n.dot(toLight)));

        // calculate the specular intensity
        let reflectedLight = reflect(p5.Vector.mult(toLight, -1), n);
        let toCamera = p5.Vector.sub(this.origin, intersection);
        toCamera.normalize();
        let shininess = hitBall.material.phong_exponent;

        let specularIntensity = p5.Vector.mult(hitBall.material.ks, Math.pow(Math.max(0, toCamera.dot(reflectedLight)), shininess));
        colour.add(diffuseIntensity);
        colour.add(specularIntensity); 

        return colour;
    }

    // Helper function that raycasts and calculates the actual colour using recursion
    raycolor(ray, depth) {
        // invoke helper function to find the first thing this ray hits
        let [hitBall, t, normal] = this.raycast(ray);

        if (!hitBall) return color(0);

        // represent colour as a vector, in the end convert to p5 colour
        let collectedColor = this.blinnPhongShading(ray, hitBall, t, normal);

        // if the hit ball is a mirror, recurse
        if ((hitBall.material.km.magSq() > 0) && (depth < 5)) {
            // send out a reflected ray

            // calculate the intersection point of the ray with hitBall
            let normalBuffer = p5.Vector.mult(normal, 0.01);
            let intersection = p5.Vector.add(ray.origin, p5.Vector.mult(ray.direction, t))
            intersection.add(normalBuffer);

            let mirrorDirection = reflect(ray.direction, normal);
            let mirrorRay = new Ray(intersection, mirrorDirection);

            let mirrorColour = this.raycolor(mirrorRay, depth + 1);  // if this doesn't hit anything it contributes black
            let mirrorColourVec = createVector(red(mirrorColour) / 255, green(mirrorColour) / 255, blue(mirrorColour) / 255);
            collectedColor.add(p5.Vector.mult(mirrorColourVec, hitBall.material.km));
        }

        return color(collectedColor.x * 255, collectedColor.y * 255, collectedColor.z * 255);
    }

    // Perform raycast from centre to the given canvas grid coordinates
    raycastFromCamera(coords) {
        // convert grid coordinates to physical viewport coordinates
        let x = coords.x
        let y = coords.y
        let resolution = select("#resolution-slider").value();
        let viewportGridSize = VIEWPORT_SIZE / resolution;
        let viewportX = x * viewportGridSize + (viewportGridSize / 2) - VIEWPORT_SIZE / 2;
        let viewportY = y * viewportGridSize + (viewportGridSize / 2) - VIEWPORT_SIZE / 2;  // shoot ray into centre of the grid cell
        
        // the corresponding point on the viewport
        let viewportGridPoint = createVector(viewportX, viewportY, this.origin.z - VIEWPORT_DISTANCE);
        let rayDirection = p5.Vector.sub(viewportGridPoint, this.origin);
        rayDirection.normalize();
    
        return this.raycolor(new Ray(viewportGridPoint, rayDirection), 0);
    }
}