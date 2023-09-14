// helper function to perform the quadratic equation
function quadEquation(a, b, c, disc, sign) {
    return (-b + sign * Math.sqrt(disc)) / (2 * a);
}

class Ball {
    /*
     * Create a mathematically perfect 3D sphere.
     *
     * centre: A p5 vector representing the ball's centre
     * radius: The ball's radius
     * colour: The ball's surface colour
     */
    constructor(centre, radius, colour) {
        this.centre = centre;
        this.radius = radius;
        this.colour = colour;

        // TODO: add all the coefficients and stuff when doing shading
    }

    // Intersect this ball with the given ray and return if intersection exists, the parameter of intersection, and surface normal
    // Also given minimum parametrization
    intersectRay(ray, minT) {
        let t;
        let normal;

        // cribbed from an assignment I wrote for computer graphics class (CSC317)
        // find intersection of ray and sphere
        let A = ray.direction.dot(ray.direction);
	    let B = 2 * ray.direction.dot(p5.Vector.sub(ray.origin, this.centre));
	    let C = p5.Vector.sub(ray.origin, this.centre).dot(p5.Vector.sub(ray.origin, this.centre)) - this.radius * this.radius;

        // discriminant
        let disc = B * B - 4 * A * C;

        if (disc < 0) {
            return [false, 0, null];
        } else if (disc < 0.005) {
            // fuzzy-equal here because of floating-point stuff
            let candidate = quadEquation(A, B, C, disc, 1);
            t = Math.max(minT, candidate);
        } else {
            // two solutions
            let candidate1 = quadEquation(A, B, C, disc, 1);
            let candidate2 = quadEquation(A, B, C, disc, -1);

            let minCandidate = Math.min(candidate1, candidate2);
            let maxCandidate = Math.max(candidate1, candidate2);

            // both are behind the ray's origin
            if (maxCandidate < minT) {
                return [false, 0, null];
            } else if (minCandidate < minT) {
                // only one is behind minT so return the other one
                t = maxCandidate;
            } else {
                // both are after minT, so return the closer one
                t = minCandidate;
            }
        }

        // find the normal
        let contactPoint = p5.Vector.add(ray.origin, p5.Vector.mult(ray.direction, t));
        normal = p5.Vector.sub(contactPoint, this.centre);
        normal.normalize();

        return [true, t, normal];
    }
}