import { AND, OR, NOT } from "./gates"
import { Switch, Bulb } from "./components"

let scaleFactor = 1
let translate = {x: 0, y: 0}
// let moveBtn = document.querySelector('.move-btn')
// let moveBtnPressed = false
// const flipMove = () => {
//     moveBtnPressed = !moveBtnPressed
//     moveBtn.classList.toggle('active')
//     if (moveBtnPressed) {
//         canvas.style.cursor = 'grab'
//     } else {
//         canvas.style.cursor = 'default'
//     }
// }
// moveBtn.onclick = () => flipMove()


let gates = [] // stores all the gates in the canvas
let powerSwitch = new Switch(50, 50, 70, 40)
let bulb = new Bulb(800, 200, 25)
gates.push(new AND(300, 400))
gates.push(new NOT(600, 200))


let contextMenu = document.querySelector('.context-menu')
let gatesMenu = [
    {name: 'AND', create: (pos) => gates.push(new AND(pos.x, pos.y))},
    {name: 'OR', create: (pos) => gates.push(new OR(pos.x, pos.y))},
    {name: 'NOT', create: (pos) => gates.push(new NOT(pos.x, pos.y))},
    // {name: 'NAND'},
    // {name: 'NOR'},
    // {name: 'XOR'}
]
gatesMenu.forEach(menu => {
    let option = document.createElement('div')
    option.classList.add('option')
    option.innerText = menu.name
    option.onclick = (e) => {
        menu.create({x: e.clientX - translate.x, y: e.clientY- translate.y})
        hideContextMenu()
    }
    contextMenu.appendChild(option)
})



var canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
canvas.width = window.innerWidth*window.devicePixelRatio
canvas.height = window.innerHeight*window.devicePixelRatio



let pair = []
let prev={x:0, y:0}
let selector = {x: 0, y: 0, width: 0, height: 0}
let selectedArray = []
let mousePressed = false
canvas.addEventListener('mousedown', (e) => { 
    // animate() // rerender everytime the mouse is down
    let x = e.clientX
    let y = e.clientY
    prev = {x, y}
    selector.x = x - translate.x
    selector.y = y - translate.y
    mousePressed = true

    // setting offset for multiple gates inside the selector
    for (let i = 0; i < selectedArray.length; i++) {
        let mouseInsideGate = selectedArray[i].checkMouse(x - translate.x, y - translate.y)
        
        // if mouse is inside one of the selected gate, offset each selected gate w.r.t x,y
        if (mouseInsideGate) {
            console.log('mouseInsideGate', mouseInsideGate);
            if (e.ctrlKey) { // if ctrl is pressend when clicking on the selected gate, remove it from the selectedArray
                selectedArray[i].border = false
                selectedArray.splice(i, 1)
            }
            else { // else offset each selected gate w.r.t x,y
                selectedArray.forEach(s => {
                    s.offset.x = x - s.x
                    s.offset.y = y - s.y
                })
            }
            return // return if mouse is inside the gates included in selector
        }
    }

    // reset -> if the selectedArray is not empty and the mouse was not inside any of its gates
    if (!e.ctrlKey && selectedArray.length != 0) {
        selectedArray.forEach(selected => selected.border = false)
        selectedArray = []
    }

    // check if mouse is inside the power switch output node
    let mouseInsidePowerSwitchOutput =  powerSwitch.output.checkMouse(x - translate.x, y - translate.y)
    if (mouseInsidePowerSwitchOutput) {
        checkPairing(powerSwitch.output)
    }

    // check if mouse is inside the power switch output node
    bulb.inputs.forEach(input => {
        let mouseInsideBulbInput =  input.checkMouse(x - translate.x, y - translate.y)
        if (mouseInsideBulbInput) {
            checkPairing(input)
        }
    })

    let selectedIndex = null
    // setting offset for single gates selected
    for (let i = gates.length - 1; i >= 0; i--) {
        // check whether the mouse is withing a gate
        let mouseInsideGate = gates[i].checkMouse(x - translate.x, y - translate.y)

        if (mouseInsideGate) { // for single movement of 
            gates[i].offset.x = x - gates[i].x
            gates[i].offset.y = y - gates[i].y
            gates[i].border = true
            selectedArray.push(gates[i])
            selectedIndex = i
            break
        }

        // check whether the mouse is withing a gate's input/output node
        gates[i].nodes.forEach(node => {
            let mouseInsideGateNode = node.checkMouse(x - translate.x, y - translate.y)
            if (mouseInsideGateNode) {
                checkPairing(node)
            }
        })
        
    }

    // delete the selected from the array and push it at the end
    // if (selectedIndex != null) {
    //     gates.splice(selectedIndex, 1)
    //     gates.push(selectedArray[0])
    // }
    
})

function checkPairing(node) {
    pair.push(node)
    if (pair.length > 1) {
        if (pair[0].type != pair[1].type) {
            let inputNode = pair[0].type == 'IN'? pair[0] : pair[1]
            let outputNode = pair[0].type == 'OUT'? pair[0] : pair[1]
            
            // if the input node does not already has a source
            if (!inputNode.getSource()) {
                inputNode.setSource(outputNode)
                outputNode.setDestination(inputNode)
            }

            powerSwitch.startExecution() // start execution from the switch
            pair = [] // after forming the connection, empty the pair list
        }
        else pair.length = 1
    }
}
// console.log(gates[0].setInputNodes());

canvas.addEventListener('mousemove', (e) => {
    // animate() // rerender everytime the mouse moves
    let x = e.clientX
    let y = e.clientY
    
    if (mousePressed && e.ctrlKey) { // first priority given to move canvas + ctrl
        translate.x += x - prev.x
        translate.y += y - prev.y
        prev = {x, y}
        canvas.style.cursor = 'grabbing'
    } 
    else if (mousePressed && selectedArray.length != 0) { // second priority given to move gates
        canvas.style.cursor = 'grabbing'
        selectedArray.forEach(selected => {
            selected.x = x - selected.offset.x
            selected.y = y - selected.offset.y
        })
    }
    else if (mousePressed) {
        selector.width = x - selector.x - translate.x
        selector.height = y - selector.y - translate.y
    }
})

canvas.addEventListener('mouseup', (e) => {
    // animate() // rerender everytime the mouse is up
    let x = e.clientX
    let y = e.clientY
    mousePressed = false
    canvas.style.cursor = 'default'

    for (let i = gates.length - 1; i >= 0; i--) {
        // check whether the gate is withing a selector
        let gateInsideSelector = gates[i].checkSelector(selector)
        if (gateInsideSelector) {
            gates[i].border = true
            selectedArray.push(gates[i])
        }
    }

    selector = {x: 0, y: 0, width: 0, height: 0}
})


window.addEventListener('wheel', (e) => {
    let x = e.deltaX
    let y = e.deltaY
    translate.x -= x
    translate.y -= y
})

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    showContextMenu({ x: e.clientX, y: e.clientY })
})

canvas.addEventListener('click', () => {
    hideContextMenu()
})


window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key == 'a') {
        selectedArray = [...gates]
        selectedArray.forEach(selected => selected.border = true)
    }
    if (e.key == 'Escape') {
        selectedArray.forEach(selected => selected.border = false)
        selectedArray = [] 
    }
    if (e.keyCode == 37) addKeysToSelectedGates('LEFT')
    if (e.keyCode == 39) addKeysToSelectedGates('RIGHT')
    if (e.keyCode == 38) addKeysToSelectedGates('UP')
    if (e.keyCode == 40) addKeysToSelectedGates('DOWN')
})
window.addEventListener('keyup', (e) => {
    if (e.keyCode == 37) removeKeysToSelectedGates('LEFT')
    if (e.keyCode == 39) removeKeysToSelectedGates('RIGHT')
    if (e.keyCode == 38) removeKeysToSelectedGates('UP')
    if (e.keyCode == 40) removeKeysToSelectedGates('DOWN')
})

const addKeysToSelectedGates = (key) => selectedArray.forEach(selected => selected.keys.add(key))
const removeKeysToSelectedGates = (key) => selectedArray.forEach(selected => selected.keys.delete(key))


function showContextMenu(pos) {
    contextMenu.style.left = pos.x + 'px'
    contextMenu.style.display = 'block'

    let bottomY = pos.y + contextMenu.getBoundingClientRect().height
    let rightX = pos.x + contextMenu.getBoundingClientRect().width
    let bottomCondition = bottomY > window.innerHeight
    let rightCondition = rightX > window.innerWidth

    // checking the condition whether the contextMenu is beyond height and beyond width of the screen
    contextMenu.style.top = bottomCondition? 'unset': pos.y + 'px'
    contextMenu.style.bottom = bottomCondition? (window.innerHeight - pos.y) + 'px' : 'unset'
    contextMenu.style.left = rightCondition? 'unset': pos.x + 'px'
    contextMenu.style.right = rightCondition? (window.innerWidth - pos.x) + 'px' : 'unset'
}

function hideContextMenu() {
    contextMenu.style.display = 'none'
}



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(window.devicePixelRatio*scaleFactor, window.devicePixelRatio*scaleFactor)
    ctx.translate(translate.x, translate.y)

    // drawing all the gates in the gates list
    gates.forEach(gate => {
        gate.update()
        gate.draw(ctx)
    })
    powerSwitch.draw(ctx)
    bulb.draw(ctx)

    if (selector.width != 0 && selector.height != 0) {
        ctx.strokeStyle = '#6965db'
        ctx.strokeRect(
            selector.x, 
            selector.y, 
            selector.width, 
            selector.height)
    }


    ctx.restore()
    requestAnimationFrame(animate)
}
animate()