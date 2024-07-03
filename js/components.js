import { Node } from "./gateNode"

export class Switch{
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.output = new Node('OUT', this.x + this.width/2 + 5, this.y, this)
        this.value = 1
    }

    startExecution() {
        this.output.value = this.value

        this.output.getDestination().forEach(node => {
            node.value = this.output.value
            node.gate.startExecution()
        })
    }

    draw(ctx) {
        this.output.draw(ctx)

        let pad = 5
        let r = .4
        ctx.fillStyle = '#f2f2f2'
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 , this.width, this.height)
        
        // ctx.fillStyle = '#f24040'
        ctx.fillStyle = '#27bb47'
        ctx.fillRect(this.x - this.width/2 + this.width*(1 - r) - pad, this.y - this.height/2 + pad , this.width*r, this.height - 10)

        ctx.fillStyle = '#333'
        ctx.lineWidth = .1
        ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
        ctx.lineWidth = 1
    }
}


export class Bulb {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.width = r
        this.height = r
        this.value = 0
        this.inputs = [new Node('IN', x - this.width - 6, y , this)]
    }

    startExecution() {
        this.inputs.forEach(input => {
            this.value = input.getSource().value
            // if (input.value == 1) this.value = 1
        })


        // this.output.value = this.value

        // this.output.getDestination().forEach(node => {
        //     node.value = this.output.value
        //     node.gate.startExecution()
        // })
    }

    setContextProperty(ctx) {
        ctx.lineWidth = 1
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
    }

    draw(ctx) {
        this.setContextProperty(ctx)
        this.inputs.forEach(input => {
            input.draw(ctx, false)
        })

        ctx.fillStyle = this.value? '#FFEA00' : '#C2B280'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        
    }

}