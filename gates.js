import { nanoid } from "nanoid"

class Gates {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.height = 60
        this.actualWidth = 120
        this.width = 70
        this.color1 = '#6965db'
        this.offset = {x: 0, y: 0}
        this.r = 3
        this.speed = 5
        this.keys = new Set()
        this.id = nanoid()
    }

    createNodes(input, output) {
        this.inputs = {}
        // for (let i = 0; i < input.length; i++) {

        //     this.inputs[i] = new Node('IN')
        // }
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

    setContextProperty(ctx) {
        ctx.lineWidth = 1
        ctx.fillStyle = '#fff'
        ctx.strokeStyle = '#000'
    }

    drawNodes21(ctx) {
        let r = this.r
        ctx.beginPath()
        ctx.moveTo(this.x + this.width/2, this.y)
        ctx.lineTo(this.x + this.actualWidth/2, this.y)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y - this.height/3.5)
        ctx.lineTo(this.x - this.actualWidth/2, this.y - this.height/3.5)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y + this.height/3.5)
        ctx.lineTo(this.x - this.actualWidth/2, this.y + this.height/3.5)
        ctx.closePath()
        ctx.stroke()

        // circles
        ctx.beginPath()
        ctx.arc(this.x + this.actualWidth/2 - r, this.y, r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x - this.actualWidth/2 + r, this.y - this.height/3.5, r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x - this.actualWidth/2 + r, this.y + this.height/3.5, r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    drawNodes11(ctx) {
        let r = this.r
        ctx.beginPath()
        ctx.moveTo(this.x + this.width/2, this.y)
        ctx.lineTo(this.x + this.actualWidth/2, this.y)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x - this.width/2, this.y)
        ctx.lineTo(this.x - this.actualWidth/2, this.y)
        ctx.closePath()
        ctx.stroke()

        //circles
        ctx.beginPath()
        ctx.arc(this.x + this.actualWidth/2 - r, this.y, r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.x - this.actualWidth/2 + r, this.y, r, 0, Math.PI*2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }

    showBorder(ctx) {
        if (!this.border) return
        
        let pad = 10
        ctx.strokeStyle = '#6965db'
        ctx.lineWidth = 2
        ctx.fillStyle = '#fffb'
        // ctx.strokeRect(this.x-this.actualWidth/2 - pad, this.y-this.height/2 - pad, this.actualWidth + 2*pad, this.height + 2*pad)
        ctx.fillRect(this.x-this.actualWidth/2 - pad, this.y-this.height/2 - pad, this.actualWidth + 2*pad, this.height + 2*pad)
    
        ctx.beginPath()
        ctx.moveTo(this.x-this.actualWidth/2 - pad, this.y - this.height/2 + pad)
        ctx.lineTo(this.x-this.actualWidth/2 - pad, this.y - this.height/2 - pad)
        ctx.lineTo(this.x-this.actualWidth/2 + pad, this.y - this.height/2 - pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x+this.actualWidth/2 + pad, this.y - this.height/2 + pad)
        ctx.lineTo(this.x+this.actualWidth/2 + pad, this.y - this.height/2 - pad)
        ctx.lineTo(this.x+this.actualWidth/2 - pad, this.y - this.height/2 - pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x-this.actualWidth/2 - pad, this.y + this.height/2 - pad)
        ctx.lineTo(this.x-this.actualWidth/2 - pad, this.y + this.height/2 + pad)
        ctx.lineTo(this.x-this.actualWidth/2 + pad, this.y + this.height/2 + pad)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.x+this.actualWidth/2 + pad, this.y + this.height/2 - pad)
        ctx.lineTo(this.x+this.actualWidth/2 + pad, this.y + this.height/2 + pad)
        ctx.lineTo(this.x+this.actualWidth/2 - pad, this.y + this.height/2 + pad)
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
    constructor(x, y) {
        super(x, y)
        this.name = 'AND'
        this.createNodes(2, 1)
    }

    draw(ctx) {
        this.showBorder(ctx)
        this.setContextProperty(ctx)
        this.drawNodes21(ctx)

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
    constructor(x, y) {
        super(x, y)
        this.name = 'OR'
    }

    draw(ctx) {
        this.showBorder(ctx)
        this.setContextProperty(ctx)
        this.drawNodes21(ctx)

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
    constructor(x, y) {
        super(x, y)
        this.name = 'NOT'
        this.width = this.height
        this.actualWidth = 110
    }

    draw(ctx) {
        this.showBorder(ctx)
        this.setContextProperty(ctx)
        this.drawNodes11(ctx)

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