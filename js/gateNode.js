import { nanoid } from "nanoid"

export class Node{
    #source
    #destination = []

    constructor(type, x, y, gate) {
        this.type = type
        this.x = x
        this.y = y
        this.gate = gate
        this.r = 3
        this.id = nanoid()
        this.value = 0
    }

    setSource(inpNode) {
        if (this.type == 'IN') this.#source = inpNode
    }
    getSource() {
        if (this.type == 'IN') return this.#source
        else return false
    }

    setDestination(outNode) {
        if (this.type == 'OUT') this.#destination.push(outNode)
    }
    getDestination() {
        if (this.type == 'OUT') return this.#destination
        else return false
    }
    

    checkMouse(x, y) {
        let xMax = this.x + this.r*3
        let xMin = this.x - this.r*3
        let yMax = this.y + this.r*3
        let yMin = this.y - this.r*3

        return (x < xMax && x > xMin) && (y < yMax && y > yMin)
    }

    draw(ctx, line = true) {
        if (line) {
            ctx.beginPath()
            ctx.moveTo(this.gate.x - this.gate.width/2, this.y)
            ctx.lineTo(this.x, this.y)
            ctx.closePath()
            ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(this.x + this.r, this.y, this.r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // drawing the line from this output -> next inputs
        this.#destination.forEach(node => {
            ctx.strokeStyle = '#333'
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(node.x, node.y)
            ctx.closePath()
            ctx.stroke()
        })
    }
}