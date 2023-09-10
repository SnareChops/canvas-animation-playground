import { Bounds } from "./bounds";

export class ImageSprite {
    bounds: Bounds = new Bounds();
    image: CanvasImageSource;

    constructor(url: string) {
        const self = this;
        this.image = new Image();
        this.image.src = url;
        this.image.addEventListener('load', x => {
            const target = x.target as HTMLImageElement;
            self.bounds.width = target.naturalWidth;
            self.bounds.height = target.naturalHeight;
        });
    }

    Image(): CanvasImageSource {
        return this.image;
    }
}
