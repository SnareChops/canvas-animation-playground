export function pointAtAngleWithDistance(x: number, y: number, angle: number, dist: number): [number, number] {
    return [
        x + dist * Math.cos(angle),
        y + dist * Math.sin(angle),
    ];
}

export function angleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
    const result = Math.atan2(y2 - y1, x2 - x1)
    if (result < 0) {
        return result + 2 * Math.PI
    }
    return result
}