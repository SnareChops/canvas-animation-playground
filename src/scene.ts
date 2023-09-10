import { ParticleEmitter } from './particle';
import { createCanvas } from './util';
import { Sprite, Renderer } from './renderer';
import { Cursor } from './cursor';
import { ImageSprite } from './sprite';
import * as trig from './trig';

export interface Scene {
    update(delta: number);
    draw(ctx: CanvasRenderingContext2D);
}

export class TestScene {
    emitter: ParticleEmitter;
    renderer: Renderer = new Renderer();
    cursor: Cursor = new Cursor();
    sprite: Sprite = new ImageSprite("Sprite-0001.png");
    angle: number = 0;

    init(): this {
        const [canvas, ctx] = createCanvas(4, 4);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 4, 4);

        this.emitter = new ParticleEmitter().init(1000, [canvas])
        this.emitter.setLife(100, 200);
        this.emitter.setVelocity(.2, .5);
        this.emitter.setDensity(30);
        this.emitter.setAngle(0, 2 * Math.PI);
        this.renderer.addEffect(this.emitter);
        this.sprite.bounds.setVec2(0, 0);
        this.renderer.addToScreen(this.sprite);
        this.angle = trig.angleBetweenPoints(0, 0, 1920, 1080);
        return this;
    }

    update(delta: number) {
        if (this.cursor.clicked) {
            this.emitter.bounds.setVec2(this.cursor.x, this.cursor.y);
            this.emitter.start(100);
        }
        let [x, y] = this.sprite.bounds.vec2();
        let [dx, dy] = trig.pointAtAngleWithDistance(x, y, this.angle, delta);
        this.sprite.bounds.setVec2(dx, dy);
        this.emitter.update(delta);
        this.cursor.update();
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.renderer.draw(ctx);
    }
}
