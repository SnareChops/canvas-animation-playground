import { Scene, TestScene } from './scene';

const $body = document.querySelector<HTMLBodyElement>('body') as HTMLBodyElement;
const $canvas = document.createElement('canvas') as HTMLCanvasElement;
const ctx = $canvas.getContext('2d') as CanvasRenderingContext2D;

$canvas.width = 1920;
$canvas.height = 1080;

$body.append($canvas);

class Engine {
    prev: number = 0;
    scene: Scene;

    constructor(private context: CanvasRenderingContext2D) { }

    start(scene: Scene) {
        this.scene = scene;
        this.prev = +new Date();
        window.requestAnimationFrame(this.tick.bind(this));
    }

    tick() {
        const now = +new Date();
        const delta = now - this.prev;

        this.scene.update(delta);
        this.context.reset();
        this.scene.draw(this.context);
        this.prev = now;
        window.requestAnimationFrame(this.tick.bind(this));
    }

    loadScene(scene: Scene) {
        this.scene = scene;
    }
}

const engine = new Engine(ctx);
engine.start(new TestScene().init());