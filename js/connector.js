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

    drawCurve(ctx, node, curveDistance=30) {
        ctx.strokeStyle = '#aaa8'
        let lastpoint = {x: this.x, y: this.y}
        let point = {x: node.x, y: node.y}

        let distX = point.x - lastpoint.x
        let distY = point.y - lastpoint.y
        let flipX = distX > 0? 1: -1
        let flipY = distY > 0? 1: -1

        // // console.log(distX);
        // if (distX < 0) {
        //     let relPosY = point.y - node.gate.y
            
        //     // calculate vertical & horizontal mid
        //     let midX = (point.x + lastpoint.x)/2
        //     let midY = (point.y + lastpoint.y)/2
    
        //     let corner1 = {x: lastpoint.x + curveDistance, y: lastpoint.y}
        //     // let corner1 = {x: midX, y: point.y}
        //     let corner2 = {x: midX, y: lastpoint.y}
        //     let curevDist = Math.min(curveDistance, Math.abs(corner1.y - midY))
    
        //     let corner11 = {x: lastpoint.x, y: lastpoint.y + curveDistance}
        //     let corner12 = {x: corner1.x, y: corner1.y - curevDist*flipY}
        //     let corner21 = {x: corner2.x - curevDist*flipX, y: corner2.y}
        //     let corner22 = {x: corner2.x, y: corner2.y + curevDist*flipY}
    
        //     ctx.beginPath()
        //     ctx.moveTo(lastpoint.x, lastpoint.y)
        //     ctx.quadraticCurveTo(corner1.x, corner1.y, corner1.x, corner1.y + curveDistance)
        //     ctx.lineTo(corner1.x, point.y + relPosY*2)
        //     let corner2Y = point.y + relPosY*2 + curveDistance
        //     ctx.quadraticCurveTo(corner1.x, corner2Y, corner1.x - curveDistance, corner2Y)
        //     // ctx.lineTo(corner12.x, corner12.y)
        //     // ctx.quadraticCurveTo(corner1.x, corner1.y, corner11.x, corner11.y)
        //     // ctx.lineTo(point.x, point.y)
        //     // ctx.lineTo(point.x, point.y)
        //     ctx.stroke()
        // }
        // else {
            // calculate vertical & horizontal mid
            let midX = (point.x + lastpoint.x)/2
            let midY = (point.y + lastpoint.y)/2
    
            let corner1 = {x: midX, y: point.y}
            let corner2 = {x: midX, y: lastpoint.y}
            let curevDist = Math.min(curveDistance, Math.abs(corner1.y - midY))
    
            let corner11 = {x: corner1.x + curevDist*flipX, y: corner1.y}
            let corner12 = {x: corner1.x, y: corner1.y - curevDist*flipY}
            let corner21 = {x: corner2.x - curevDist*flipX, y: corner2.y}
            let corner22 = {x: corner2.x, y: corner2.y + curevDist*flipY}
    
            ctx.beginPath()
            ctx.moveTo(lastpoint.x, lastpoint.y)
            // ctx.lineTo(lastpoint.x, lastpoint.y)
            ctx.lineTo(corner21.x, corner21.y)
            ctx.quadraticCurveTo(corner2.x, corner2.y, corner22.x, corner22.y)
            ctx.lineTo(corner12.x, corner12.y)
            ctx.quadraticCurveTo(corner1.x, corner1.y, corner11.x, corner11.y)
            // ctx.lineTo(point.x, point.y)
            ctx.lineTo(point.x, point.y)
            ctx.stroke()

        // }

    }

    draw(ctx) {
        // drawing the line from this output -> next inputs
        // this.getDestination().forEach(node => {if (node.type == 'OUT') this.drawPath(ctx, node)})

        // draw the curveline
        this.getDestination().forEach(node => {if (node.type == 'OUT') this.drawCurve(ctx, node)})
        
        this.setContextProperty(ctx)

        // ctx.fillStyle='#fff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
    }
}