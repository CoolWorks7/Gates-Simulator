export class Connector{
    constructor(x, y, node) {
        this.x = x
        this.y = y
        this.node = node
        this.r = 10
    }

    setContextProperty(ctx) {
        ctx.fillStyle='#fff3'
    }

    update() {
        this.x = this.node.x
        this.y = this.node.y
    }

    draw(ctx) {
        this.setContextProperty(ctx)

        // ctx.fillStyle='#fff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}