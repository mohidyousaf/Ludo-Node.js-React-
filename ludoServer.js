
// Note : Winning Conditions are applied, but we have to click on any sprite to show.

const http = require(`http`)
const fs= require(`fs`)
const Websocket = require('ws')
const { cli } = require('webpack')

const step = (color, ox, oy, steps) => {
    const transform = ([ox,oy]) => ({'blue': [+ox,+oy], 'green': [-ox,-oy], 'red': [-oy,+ox], 'yellow': [+oy,-ox]}[color])
    const path = ['-7,-7', '-1,-6', '-1,-5', '-1,-4', '-1,-3', '-1,-2', '-2,-1', '-3,-1', '-4,-1', '-5,-1', '-6,-1', '-7,-1', '-7,0', '-7,1', '-6,1', '-5,1', '-4,1', '-3,1', '-2,1', '-1,2', '-1,3', '-1,4',
    '-1,5', '-1,6', '-1,7', '0,7', '1,7', '1,6', '1,5', '1,4', '1,3',
    '1,2', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '7,0', '7,-1', '6,-1', '5,-1', '4,-1', '3,-1', '2,-1', '1,-2', '1,-3', '1,-4', '1,-5',
    '1,-6', '1,-7', '0,-7', '0,-6', '0,-5', '0,-4', '0,-3', '0,-2', '0,-1']
    const [x,y] =
    transform(transform(transform(path[path.indexOf(transform([ox-7, oy-
    7]).join(','))+steps].split(','))))
    return [x+7,y+7]
    }

const iskilled = (ox, oy) => (ox-7)*(ox-7)+(oy-7)*(oy-7) == 98

const readFile =  (filename)=>{
    return new Promise ((resolv,reject)=>{
        fs.readFile(filename,(err,filecontents)=>{
            if(err){
                reject(err)
            }
            else{
                resolv(filecontents)
            }
        })
    })
}

const server = http.createServer(async(req,resp)=>{
    console.log(`a browser contacted me and want ${req.url}`)

    if(req.url == `/mydoc`){
        const clientHtml = await readFile(`ludo.html`)
        resp.end(`${clientHtml}`)
    }

    
    else if(req.url == `/myjs`){
        const clientJs= await readFile(`ludoClient.js`)
        resp.end(clientJs)
    }

    else if(req.url == `/mycs`){
        const clientJs= await readFile(`ludo.css`)
        resp.end(clientJs)
    }

    else{
        resp.end(`not found`)
    }


})

server.listen(8000)

const wss= new Websocket.Server({port:8080})
let sprite_list=['color blue','color red', 'color green','color yellow']
let i=1
let turn= ['blue','red', 'green','yellow']
let j=0

wss.on(`connection`, ws=>{
    console.log("user is connected")
    var a = Math.floor(Math.random()*6)+1
    
    ws.on(`message`,message=>{

            console.log(`message received: ${message}`)
            const component = JSON.parse(message)
            board = component.board

            if (component.type === 'CoordinateUpdate'){
                a = Math.floor(Math.random()*6)+1

                let win_blue=board[7][6]
                var blue_len= win_blue.length
                let win_red=board[6][7]
                var red_len= win_red.length
                let win_green=board[7][8]
                let green_len= win_green.length
                let win_yellow=board[8][7]
                let yellow_len= win_yellow.length
                var concat = parseInt(`${component.x}${component.y}`)
                console.log(`concat is ${concat}`)
                

                if(blue_len===4){
                    wss.clients.forEach(ws=>{
                        if(ws.readyState=== Websocket.OPEN){
                            ws.send(JSON.stringify({
                                type : 'win',
                                message: 'blue wins'

                            }))
                        }
                    })
                }

                else if(red_len===4){
                    wss.clients.forEach(ws=>{
                        if(ws.readyState=== Websocket.OPEN){
                            ws.send(JSON.stringify({
                                type : 'win',
                                message: 'red wins'

                            }))
                        }
                    })
                }

                else if(green_len===4){
                    wss.clients.forEach(ws=>{
                        if(ws.readyState=== Websocket.OPEN){
                            ws.send(JSON.stringify({
                                type : 'win',
                                message: 'green wins'

                            }))
                        }
                    })
                }

                else if(yellow_len===4){
                    wss.clients.forEach(ws=>{
                        if(ws.readyState=== Websocket.OPEN){
                            ws.send(JSON.stringify({
                                type : 'win',
                                message: 'yellow wins'

                            }))
                        }
                    })
                }

               

                else if(component.color==='blue' && concat + a  >  76  && (concat===70 || concat===71|| concat===72|| concat===73|| concat===74|| concat===75 || concat===76)){
                    console.log(`component color is ${component.color}`)
                    console.log(`dice val is ${a}`)
                    
                    wss.clients.forEach(ws => {
                        if (ws.readyState === Websocket.OPEN) {

                            ws.send(JSON.stringify({
                                type: `newboard`,
                                board: board,
                            }))

                            ws.send(JSON.stringify({
                                type: 'dice',
                                dice_val: a
                            }))
                        }
                    })
                }
                
                else if(component.color==='red' && (concat + (a*10)  >  67) && (concat===7 || concat===17|| concat===27|| concat===37|| concat===47|| concat===57  || concat===67)){
                    wss.clients.forEach(ws => {
                        if (ws.readyState === Websocket.OPEN) {

                            ws.send(JSON.stringify({
                                type: `newboard`,
                                board: board,
                            }))

                            ws.send(JSON.stringify({
                                type: 'dice',
                                dice_val: a
                            }))
                        }
                    })
                }
                
                else if(component.color==='green' && (concat===714 || concat===713 || concat===712|| concat===711|| concat===710|| concat===79 || concat===78 )){
                    if (concat + a  >  78 ){
                        wss.clients.forEach(ws=>{
                            if(ws.readyState=== Websocket.OPEN){
                        
                                ws.send(JSON.stringify({
                                    type: `newboard`,
                                    board: board,
                                }))
    
                                ws.send(JSON.stringify({
                                    type:'dice',
                                    dice_val: a
                                }))
                            }
                        }) 
                    
                    }
                }
                
                else if(component.color==='yellow' && (concat - (a*10)   <  87) && (concat===147 || concat===137 || concat===127 || concat===117 || concat===107 || concat===97 || concat===87 )){
                    
                    wss.clients.forEach(ws => {
                        if (ws.readyState === Websocket.OPEN) {

                            ws.send(JSON.stringify({
                                type: `newboard`,
                                board: board,
                            }))

                            ws.send(JSON.stringify({
                                type: 'dice',
                                dice_val: a
                            }))
                        }
                    })
                }



                else{
                    
                    const check = iskilled(component.x, component.y)
                    if (check && a==6){
                        board[component.x][component.y].splice(component.z, 1);
                        const new_x = step(component.color,component.x,component.y,1)
                        board[new_x[0]][new_x[1]].splice(-1, 0, component.color);
                    }
                    if (!check){
                        board[component.x][component.y].splice(component.z, 1);
                        const new_x = step(component.color,component.x,component.y,a)

                        let kill =[]
                    
                        fatal_len = new_x.length
                        console.log(`fatal length is ${fatal_len}`)
                        let len = 0

                        
                        var concat2 = parseInt(`${new_x[0]}${new_x[1]}`)
                        console.log(`new x[0] is ${new_x[0]}`)
                        console.log(`new x[0] is ${new_x[1]}`)
                        len = board[new_x[0]][new_x[1]].length

                        console.log(`length is ${len}`)
                        if (len != 0) {
                            for (var x = 0; x < len; x++) {
                                if (component.color != board[new_x[0]][new_x[1]][x] && concat2 != 612 && concat2 != 813 && concat2 != 128 && concat2 != 136 && concat2 != 82 && concat2 != 61 && concat2 != 26 && concat2 != 18) {
                                    kill.push(board[new_x[0]][new_x[1]][x])
                                }
                            }
                        }

                        for (var x = 0; x < kill.length; x++) {
                            board[new_x[0]][new_x[1]].splice(kill[x], 1);

                            if (kill[x] == 'blue') {
                                board[0][0].splice(-1, 0, kill[x])
                            }
                            if (kill[x] == 'red') {
                                board[0][14].splice(-1, 0, kill[x])
                            }
                            if (kill[x] == 'green') {
                                board[14][14].splice(-1, 0, kill[x])
                            }
                            if (kill[x] == 'yellow') {
                                board[14][0].splice(-1, 0, kill[x])
                            }

                        }


                        console.log(`you need to kill ${kill}`)


                        board[new_x[0]][new_x[1]].splice(-1, 0, component.color);

     
                    }
                    
                    wss.clients.forEach(ws=>{
                        if(ws.readyState=== Websocket.OPEN){
                    
                            ws.send(JSON.stringify({
                                type: `newboard`,
                                board: board,
                            }))

                            ws.send(JSON.stringify({
                                type:'dice',
                                dice_val: a
                            }))
                        }
                    })   
                    
                    
                }
            }

            if (component.type === 'Turn'){

                wss.clients.forEach(ws=>{
                    if(ws.readyState=== Websocket.OPEN){

                        ws.send(JSON.stringify({
                            type: 'ColorTurn',
                            message: turn[j]
                        }))
                    }
                })
                
                j+=1
                if(j==4){
                    j= j%4
                    
                }
            }
        })


    if(i!=4){
        ws.send(JSON.stringify({
            type: 'playerColor',
            color: sprite_list.splice(0,1)
        }))
        i+=1
        console.log(`value of i is ${i}`)
    }

    else{


        wss.clients.forEach(ws=>{
            if(ws.readyState=== Websocket.OPEN){
                ws.send(JSON.stringify({
                    type: 'ColorTurn',
                    message: turn[j]
                }))
            }
        })

        j+=1

        ws.send(JSON.stringify({
            type: 'playerColor',
            color: sprite_list.splice(0,1)
        }))
        
        wss.clients.forEach(ws=>{
            if(ws.readyState=== Websocket.OPEN){

                ws.send(JSON.stringify({
                    type: `newboard`,
                    board: [[['blue','blue','blue','blue'],[],[],[],[],[],[],[],[],[],[],[],[],[]
                    ,['red','red','red','red']],[[],[],[],[],[],[],[],[],[],[],[],[],[],[]
                    ,[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[]
                    ,[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[
                    ],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[
                    ],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],
                    [],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],
                    [],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[]
                    ,[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[]
                    ,[],[],[],[],[],[],[],[],[],[]],[[],[],[],[],[],[],[],[],[],[],[],[],[
                    ],[],[]],[['yellow','yellow','yellow','yellow'],[],[],[],[],[],[],[],[
                    ],[],[],[],[],[],['green','green','green','green']]],
                }) )

                
                ws.send(JSON.stringify({
                    type:'dice',
                    dice_val: a
                }))
            }
        })

    }
})
