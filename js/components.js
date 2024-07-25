import { Node } from "./gateNode"
import { Gates } from "./gates"

export class Switch extends Gates {
    constructor(x, y, r, theme) {
        super(x, y, theme)
        this.name = 'SWITCH'
        this.r = r
        this.width = r*2
        this.height = r*2
        this.actualWidth = 0
        this.output = new Node('OUT', x, y, this, this.theme, 3)
        this.value = 1
        this.nodes = [this.output]
    }

    startExecution() {
        this.output.value = this.value

        // propogate the output value of switch to all its destinations
        this.output.getDestination().forEach(node => {
            node.value = this.output.value
            setTimeout(() => {
                node.startExecution()
                // node.gate.startExecution()
            }, 50)
        })
    }

    checkMouse(x, y) {
        let xMax = this.x + this.r
        let xMin = this.x - this.r
        let yMax = this.y + this.r
        let yMin = this.y - this.r

        return (x < xMax && x > xMin) && (y < yMax && y > yMin)
    }

    updateNodes() {
        this.output.x = this.x + this.r*1.5
        this.output.y = this.y
    }

    setContextProperty(ctx) {
        ctx.lineWidth = 1
        if (this.theme == 'light') {
            ctx.fillStyle = '#fff'
            ctx.strokeStyle = '#000'
        }
        else if (this.theme == 'dark') {
            ctx.fillStyle = '#131313'
            ctx.strokeStyle = '#fff'
        }
        else {
            ctx.fillStyle = '#0000'
            ctx.strokeStyle = '#0000'
        }
    }

    draw(ctx) {
        super.draw(ctx, this.width, true)

        ctx.strokeStyle = '#fff'
        ctx.fillStyle = '#131313'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = this.value? '#ffec21' : ctx.fillStyle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r*0.7, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()

        // ctx.strokeRect(this.x - this.r, this.y - this.r, this.width, this.height)
    }
}


export class Bulb extends Gates {
    constructor(x, y, w, h, theme) {
        super(x, y, theme)
        this.name = 'BULB'
        this.width = w*1.5
        this.height = h
        this.actualWidth = w
        this.theme = theme
        this.value = 0
        this.inputs = [new Node('IN', x - this.width/2 - 3, y , this, this.theme)]
        this.nodes = [...this.inputs]
    }

    startExecution() {
        this.inputs.forEach(input => {
            this.value = input.getSource().value
            if (input.value == 1) this.value = 1
        })
    }

    updateNodes() {
        for (let i = 0; i < this.inputs?.length; i++) {
            let h = this.height/(this.inputs.length*2)
            let x = this.x - this.actualWidth/2 - 3
            let y = (this.y - this.height/2) + (2*i+1)*h
            this.inputs[i].x = x
            this.inputs[i].y = y
        }
    }

    setContextProperty(ctx) {
        ctx.lineWidth = 1
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = this.value? '#333' : '#fff'
    }

    draw(ctx) {
        super.draw(ctx, this.width, false)

        let offColor = this.theme == 'light'? '#fff' : this.theme == 'dark'? '#131313' : '#0000'
        let onnColor = '#ffec21'
        ctx.fillStyle = this.value? onnColor : offColor
        
        ctx.beginPath()
        ctx.moveTo(this.x - this.actualWidth/2, this.y - this.height/2)
        ctx.lineTo(this.x + this.actualWidth/2 - this.height/2, this.y - this.height/2)
        ctx.arc(this.x + this.actualWidth/2 - this.height/2, this.y, this.height/2, -Math.PI/2, Math.PI/2)
        ctx.lineTo(this.x - this.actualWidth/2, this.y + this.height/2)
        ctx.lineTo(this.x - this.actualWidth/2, this.y - this.height/2)
        ctx.closePath()

        ctx.fill()
        ctx.stroke()
    }
}