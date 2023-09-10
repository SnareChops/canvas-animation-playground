(() => {
  // src/bounds.ts
  var Bounds = class {
    constructor(width = 0, height = 0) {
      this.width = width;
      this.height = height;
    }
    vector = { x: 0, y: 0, z: 0 };
    vec2() {
      return [this.vector.x, this.vector.y];
    }
    setVec2(x, y) {
      this.vector.x = x;
      this.vector.y = y;
    }
    vec3() {
      return [this.vector.x, this.vector.y, this.vector.z];
    }
    setVec3(x, y, z) {
      this.vector.x = x;
      this.vector.y = y;
      this.vector.z = z;
    }
  };

  // src/random.ts
  function intn(n) {
    return Math.floor(Math.random() * n);
  }
  function floatn(n) {
    return Math.random() * n;
  }

  // src/trig.ts
  function pointAtAngleWithDistance(x, y, angle, dist) {
    return [
      x + dist * Math.cos(angle),
      y + dist * Math.sin(angle)
    ];
  }
  function angleBetweenPoints(x1, y1, x2, y2) {
    const result = Math.atan2(y2 - y1, x2 - x1);
    if (result < 0) {
      return result + 2 * Math.PI;
    }
    return result;
  }

  // src/particle.ts
  var ParticleEmitter = class {
    bounds = new Bounds();
    particles = [];
    images = [];
    minVelocity = 0;
    maxVelocity = 0;
    minAngle = 0;
    maxAngle = 0;
    minLife = 0;
    maxLife = 0;
    density = 0;
    duration = 0;
    init(poolSize, images) {
      this.images = images;
      this.particles = Array(poolSize);
      for (let i = 0; i < this.particles.length; i++) {
        const idx = Math.floor(Math.random() * this.images.length);
        const image = this.images[idx];
        this.particles[i] = new Particle();
        this.particles[i].image = image;
      }
      return this;
    }
    setVelocity(min, max) {
      this.minVelocity = min;
      this.maxVelocity = max;
    }
    setAngle(min, max) {
      this.minAngle = min;
      this.maxAngle = max;
    }
    setLife(min, max) {
      this.minLife = min;
      this.maxLife = max;
    }
    setDensity(density) {
      this.density = density;
    }
    start(duration) {
      this.duration = duration;
    }
    update(delta) {
      this.duration -= delta;
      if (this.duration <= 0) {
        this.duration = 0;
      }
      let desired = delta / 10 * this.density;
      for (let particle of this.particles) {
        if (particle.active) {
          particle.update(delta);
        } else {
          if (desired > 0 && this.duration > 0) {
            particle.start(
              this.bounds.vector.x,
              this.bounds.vector.y,
              intn(this.maxLife - this.minLife) + this.minLife,
              floatn(this.maxVelocity - this.minVelocity) + this.minVelocity,
              floatn(this.maxAngle - this.minAngle) + this.minAngle
            );
            desired -= 1;
          }
        }
      }
    }
  };
  var Particle = class {
    bounds = new Bounds();
    image;
    active = false;
    life = 0;
    velocity = 0;
    angle = 0;
    start(x, y, life, velocity, angle) {
      this.active = true;
      this.life = life;
      this.velocity = velocity;
      this.angle = angle;
      this.bounds.vector.x = x;
      this.bounds.vector.y = y;
    }
    update(delta) {
      if (!this.active) {
        return;
      }
      this.life -= delta;
      if (this.life <= 0) {
        this.active = false;
        return;
      }
      const [x, y] = pointAtAngleWithDistance(this.bounds.vector.x, this.bounds.vector.y, this.angle, this.velocity * delta);
      this.bounds.setVec2(x, y);
    }
    Image() {
      if (this.active) {
        return this.image;
      }
      return void 0;
    }
  };

  // src/util.ts
  function createCanvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    return [canvas, canvas.getContext("2d")];
  }

  // src/renderer.ts
  var Renderer = class {
    background = [];
    effects = [];
    screen = [];
    addToBackground(sprite) {
      if (this.background.includes(sprite))
        return;
      this.screen.push(sprite);
    }
    removeFromBackground(sprite) {
      const i = this.background.indexOf(sprite);
      if (i > -1)
        this.background.splice(i, 1);
    }
    addEffect(effect) {
      if (this.effects.includes(effect))
        return;
      this.effects.push(effect);
    }
    removeEffect(effect) {
      const i = this.effects.indexOf(effect);
      if (i > -1)
        this.effects.splice(i, 1);
    }
    addToScreen(sprite) {
      if (this.screen.includes(sprite))
        return;
      this.screen.push(sprite);
    }
    removeFromScreen(sprite) {
      const i = this.screen.indexOf(sprite);
      if (i > -1)
        this.screen.splice(i, 1);
    }
    draw(ctx2) {
      for (let effect of this.effects) {
        for (let particle of effect.particles) {
          const image = particle.Image();
          if (!!image) {
            ctx2.drawImage(image, ...particle.bounds.vec2());
          }
        }
      }
      this.screen.sort((a, b) => {
        const [ax, ay, az] = a.bounds.vec3();
        const [bx, by, bz] = b.bounds.vec3();
        return az - bz;
      });
      for (const item of this.screen) {
        const image = item.Image();
        if (!!image) {
          ctx2.drawImage(image, ...item.bounds.vec2());
        }
      }
    }
  };

  // src/cursor.ts
  var Cursor = class {
    clicked = false;
    x = 0;
    y = 0;
    constructor() {
      document.addEventListener("click", (event) => {
        this.clicked = true;
        this.x = event.clientX;
        this.y = event.clientY;
      });
    }
    update() {
      this.clicked = false;
    }
  };

  // src/sprite.ts
  var ImageSprite = class {
    bounds = new Bounds();
    image;
    constructor(url) {
      const self = this;
      this.image = new Image();
      this.image.src = url;
      this.image.addEventListener("load", (x) => {
        const target = x.target;
        self.bounds.width = target.naturalWidth;
        self.bounds.height = target.naturalHeight;
      });
    }
    Image() {
      return this.image;
    }
  };

  // src/scene.ts
  var TestScene = class {
    emitter;
    renderer = new Renderer();
    cursor = new Cursor();
    sprite = new ImageSprite("Sprite-0001.png");
    angle = 0;
    init() {
      const [canvas, ctx2] = createCanvas(4, 4);
      ctx2.fillStyle = "red";
      ctx2.fillRect(0, 0, 4, 4);
      this.emitter = new ParticleEmitter().init(1e3, [canvas]);
      this.emitter.setLife(100, 200);
      this.emitter.setVelocity(0.2, 0.5);
      this.emitter.setDensity(30);
      this.emitter.setAngle(0, 2 * Math.PI);
      this.renderer.addEffect(this.emitter);
      this.sprite.bounds.setVec2(0, 0);
      this.renderer.addToScreen(this.sprite);
      this.angle = angleBetweenPoints(0, 0, 1920, 1080);
      return this;
    }
    update(delta) {
      if (this.cursor.clicked) {
        this.emitter.bounds.setVec2(this.cursor.x, this.cursor.y);
        this.emitter.start(100);
      }
      let [x, y] = this.sprite.bounds.vec2();
      let [dx, dy] = pointAtAngleWithDistance(x, y, this.angle, delta);
      this.sprite.bounds.setVec2(dx, dy);
      this.emitter.update(delta);
      this.cursor.update();
    }
    draw(ctx2) {
      this.renderer.draw(ctx2);
    }
  };

  // src/index.ts
  var $body = document.querySelector("body");
  var $canvas = document.createElement("canvas");
  var ctx = $canvas.getContext("2d");
  $canvas.width = 1920;
  $canvas.height = 1080;
  $body.append($canvas);
  var Engine = class {
    constructor(context) {
      this.context = context;
    }
    prev = 0;
    scene;
    start(scene) {
      this.scene = scene;
      this.prev = +/* @__PURE__ */ new Date();
      window.requestAnimationFrame(this.tick.bind(this));
    }
    tick() {
      const now = +/* @__PURE__ */ new Date();
      const delta = now - this.prev;
      this.scene.update(delta);
      this.context.reset();
      this.scene.draw(this.context);
      this.prev = now;
      window.requestAnimationFrame(this.tick.bind(this));
    }
    loadScene(scene) {
      this.scene = scene;
    }
  };
  var engine = new Engine(ctx);
  engine.start(new TestScene().init());
})();
