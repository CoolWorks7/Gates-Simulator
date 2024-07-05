import { nanoid } from "nanoid"

export class Node{
    #source
    #destination = []

    constructor(type, x, y, gate, theme, r = 3) {
        this.type = type
        this.x = x
        this.y = y
        this.gate = gate
        this.theme = theme
        this.r = r
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
        if (this.gate.name == 'BULB') {
            let xMax = this.x + this.r/2 + 5
            let xMin = this.x - this.r/2 - 5
            let yMax = this.y + this.gate.height/2 + 5
            let yMin = this.y - this.gate.height/2 - 5
    
            return (x < xMax && x > xMin) && (y < yMax && y > yMin)
        }
        else {
            let xMax = this.x + this.r*3
            let xMin = this.x - this.r*3
            let yMax = this.y + this.r*3
            let yMin = this.y - this.r*3

            return (x < xMax && x > xMin) && (y < yMax && y > yMin)
        }
    }

    draw(ctx, line = true) {
        // drawing the line from this output -> next inputs
        this.#destination.forEach(node => {
            ctx.strokeStyle = '#fff'
            ctx.beginPath()
            ctx.moveTo(this.x + this.r, this.y)
            ctx.lineTo(node.x + node.r, node.y)
            ctx.closePath()
            ctx.stroke()
        })

        if (line) {
            ctx.strokeStyle = this.theme == 'light'? '#333' : this.theme == 'dark'? '#fff' : '#0000'
            ctx.beginPath()
            ctx.moveTo(this.gate.x - this.gate.width/2, this.y)
            ctx.lineTo(this.x, this.y)
            ctx.closePath()
            ctx.stroke()
        }

        if (this.gate.name == 'BULB') {
            ctx.fillStyle = this.theme == 'light'? '#333' : this.theme == 'dark'? '#fff' : '#0000'
            ctx.strokeStyle = this.theme == 'light'? '#333' : this.theme == 'dark'? '#fff' : '#0000'
            ctx.fillRect(this.x - this.r/2, this.y - this.gate.height/2, this.r, this.gate.height)
            ctx.strokeRect(this.x - this.r/2, this.y  - this.gate.height/2, this.r, this.gate.height)
        }
        else if (this.gate.name == 'SWITCH') {
            // ctx.fillStyle = '#131313'
            ctx.strokeStyle = '#fff'
            ctx.beginPath()
            ctx.arc(this.x + this.r, this.y, this.r, 0, Math.PI*2)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
        else {
            ctx.beginPath()
            ctx.arc(this.x + this.r, this.y, this.r, 0, Math.PI*2)
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
        
    }
}