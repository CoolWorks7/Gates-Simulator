import { nanoid } from "nanoid"
import { Node } from "./gateNode"

export class Gates {
    constructor(x, y, theme) {
        this.x = x
        this.y = y
        this.theme = theme
        this.height = 60
        this.actualWidth = 120
        this.width = 70
        this.offset = {x: 0, y: 0}
        this.speed = 5
        this.keys = new Set()
        this.id = nanoid()
    }

    createNodes(input, output) {
        this.inputs = []
        for (let i = 0; i < input; i++) {
            let h = this.height/(input*2)
            let x = this.x - this.actualWidth/2
            let y = (this.y - this.height/2) + (2*i+1)*h
            this.inputs.push(new Node('IN', x, y, this, this.theme))
        }
        this.output = new Node('OUT', this.x + this.actualWidth/2, this.y, this, this.theme)
        this.nodes = [...this.inputs, this.output]
    }

    updateNodes() {
        for (let i = 0; i < this.inputs?.length; i++) {
            let h = this.height/(this.inputs.length*2)
            let x = this.x - this.actualWidth/2
            let y = (this.y - this.height/2) + (2*i+1)*h
            this.inputs[i].x = x
            this.inputs[i].y = y
        }
        if (this.output) {
            this.output.x = this.x + this.actualWidth/2
            this.output.y = this.y
        }
    }

    startExecution() {
        let res = this.TRUTH_TABLE // read the truth table
        this.inputs.forEach(input => {
            res = res[input.value]
        })
        this.output.value = res // store the gates result

        this.output.getDestination().forEach(node => {
            node.value = this.output.value
            setTimeout(() => {
                node.startExecution()
                // if (node.type == 'OUT') node.startExecution()
                // else node.gate.startExecution()
            }, 50)
        })
    }

    checkMouse(x, y) {
        let xMax = this.x + this.width/2
        let xMin = this.x - this.width/2
        let yMax = this.y + this.height/2
        let yMin = this.y - this.height/2

        return (x < xMax && x > xMin) && (y < yMax && y > yMin)
    }

    checkSelector(s) {
        let xMax = s.x + s.width
        let xMin = s.x
        let yMax = s.y + s.height
        let yMin = s.y

        return ((this.x < xMax && this.x > xMin) && (this.y < yMax && this.y > yMin) || 
                (this.x < xMin && this.x > xMax) && (this.y < yMin && this.y > yMax))
    }

    draw(ctx, width, line=true) {
        this.updateNodes()
        this.showBorder(ctx, width)
        this.setContextProperty(ctx)
        this.drawNodes(ctx, line)
    }

    drawNodes(ctx, line=true) {
        this.inputs && this.inputs.forEach(input => {
            input.draw(ctx, line)
        })
        this.output && this.output.draw(ctx, line)
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

    showBorder(ctx, width=this.actualWidth) {
        if (!this.border) return
        
        let pad = 10
        ctx.strokeStyle = '#4e8cd7'
        ctx.lineWidth = 1

        ctx.beginPath()
        ctx.moveTo(this.x-width/2 - pad, this.y - this.height/2 + pad)
        ctx.lineTo(this.x-width/2 - pad, this.y - this.height/2 - pad)
        ctx.lineTo(this.x-width/2 + pad, this.y - this.height/2 - pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x+width/2 + pad, this.y - this.height/2 + pad)
        ctx.lineTo(this.x+width/2 + pad, this.y - this.height/2 - pad)
        ctx.lineTo(this.x+width/2 - pad, this.y - this.height/2 - pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x-width/2 - pad, this.y + this.height/2 - pad)
        ctx.lineTo(this.x-width/2 - pad, this.y + this.height/2 + pad)
        ctx.lineTo(this.x-width/2 + pad, this.y + this.height/2 + pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x+width/2 + pad, this.y + this.height/2 - pad)
        ctx.lineTo(this.x+width/2 + pad, this.y + this.height/2 + pad)
        ctx.lineTo(this.x+width/2 - pad, this.y + this.height/2 + pad)
        ctx.stroke()

    }

    update() {
        if (this.keys.has('LEFT')) this.x -= this.speed
        if (this.keys.has('RIGHT')) this.x += this.speed
        if (this.keys.has('UP')) this.y -= this.speed
        if (this.keys.has('DOWN')) this.y += this.speed
    }
}

export class AND extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'AND'
        this.createNodes(2, 1)
        this.TRUTH_TABLE = [
            [0, 0],
            [0, 1]
        ]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y - this.height/2)
        ctx.lineTo(this.x + this.width/2 - this.height/2, this.y - this.height/2)
        ctx.arc(this.x + this.width/2 - this.height/2, this.y, this.height/2, -Math.PI/2, Math.PI/2)
        ctx.lineTo(this.x - this.width/2, this.y + this.height/2)
        ctx.lineTo(this.x - this.width/2, this.y - this.height/2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}


export class OR extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'OR'
        this.createNodes(2, 1)
        this.TRUTH_TABLE = [
            [0, 1],
            [1, 1]
        ]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/1.8, this.y + this.height/2)
        ctx.quadraticCurveTo(this.x - this.width/3 , this.y, this.x - this.width/1.8, this.y - this.height/2)
        ctx.bezierCurveTo(
            this.x + this.width/1.2, this.y - this.height/2.3, 
            this.x + this.width/1.2, this.y + this.height/2.3,
            this.x - this.width/1.8, this.y + this.height/2
        )
        ctx.fill()
        ctx.stroke()
    }
}

export class NOT extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'NOT'
        this.width = this.height
        this.actualWidth = 110
        this.createNodes(1, 1)
        this.TRUTH_TABLE = [1, 0]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y + this.height/2)
        ctx.lineTo(this.x - this.width/2, this.y - this.height/2)
        ctx.lineTo(this.x + this.width/2.5, this.y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x + this.width/2, this.y, 5, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

export class NAND extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'NAND'
        this.createNodes(2, 1)
        this.TRUTH_TABLE = [
            [1, 1],
            [1, 0]
        ]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y - this.height/2)
        ctx.lineTo(this.x + this.width/2 - this.height/2, this.y - this.height/2)
        ctx.arc(this.x + this.width/2 - this.height/2, this.y, this.height/2, -Math.PI/2, Math.PI/2)
        ctx.lineTo(this.x - this.width/2, this.y + this.height/2)
        ctx.lineTo(this.x - this.width/2, this.y - this.height/2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x + this.width/1.75, this.y, 5, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

export class NOR extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'NOR'
        this.createNodes(2, 1)
        this.TRUTH_TABLE = [
            [1, 0],
            [0, 0]
        ]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/1.8, this.y + this.height/2)
        ctx.quadraticCurveTo(this.x - this.width/3 , this.y, this.x - this.width/1.8, this.y - this.height/2)
        ctx.bezierCurveTo(
            this.x + this.width/1.2, this.y - this.height/2.3, 
            this.x + this.width/1.2, this.y + this.height/2.3,
            this.x - this.width/1.8, this.y + this.height/2
        )
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x + this.width/1.75, this.y, 5, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}

export class XOR extends Gates{
    constructor(x, y, theme) {
        super(x, y, theme)
        this.name = 'XOR'
        this.width = this.height
        this.actualWidth = 110
        this.createNodes(2, 1)
        this.TRUTH_TABLE = [
            [0, 1],
            [1, 0]
        ]
    }

    draw(ctx) {
        super.draw(ctx)

        // ctx.strokeRect(this.x - this.actualWidth/2, this.y - this.height/2, this.actualWidth, this.height)
        ctx.beginPath()
        ctx.moveTo(this.x - this.width/1.8, this.y + this.height/2)
        ctx.quadraticCurveTo(this.x - this.width/3 , this.y, this.x - this.width/1.8, this.y - this.height/2)
        ctx.bezierCurveTo(
            this.x + this.width/1.2, this.y - this.height/2.3, 
            this.x + this.width/1.2, this.y + this.height/2.3,
            this.x - this.width/1.8, this.y + this.height/2
        )
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x - this.width/1.5, this.y + this.height/2)
        ctx.quadraticCurveTo(this.x - this.width/2.5 , this.y, this.x - this.width/1.5, this.y - this.height/2)
        ctx.stroke()
        
    }
}