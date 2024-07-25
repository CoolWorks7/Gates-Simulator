import { Node } from "./gateNode"

export class Connector extends Node{
    #source
    #destination = []

    constructor(type, x, y, gate, node, theme, r = 7) {
        super(type, x, y, gate, theme, r)
        this.node = node
    }

    setContextProperty(ctx) {
        ctx.fillStyle='#fff3'
    }

    update() {
        this.x = this.node.x
        this.y = this.node.y
    }

    drawPath(ctx, node) {
        ctx.strokeStyle = '#ddd'
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(node.x, node.y)
        ctx.closePath()
        ctx.stroke()
    }

    draw(ctx) {
        // drawing the line from this output -> next inputs
        this.getDestination().forEach(node => this.drawPath(ctx, node))
        
        this.setContextProperty(ctx)

        // ctx.fillStyle='#fff'
        ctx.beginPath()
        this.node.gate.name == 'SWITCH'? ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI) : ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}