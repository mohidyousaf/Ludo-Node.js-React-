
const ws= new WebSocket(`ws://localhost:8080`)

const delay = (sec) =>{
    return new Promise (resolv=>{
        setTimeout(resolv,sec*1000)
    })
}



const Ludo = () => {
    const [board,setBoard]= React.useState([])
    const [diceVal,setDiceVal]= React.useState(0)
    const [color,setColor]= React.useState(``)
    const [state,setState]= React.useState(``)
    const [warning,setWarning]=React.useState(`No warnings`)
    const [win,setWin] = React.useState(`Win : None`)
    

    ws.onmessage = (event)=>{
        const messageComponent= JSON.parse(event.data)
        if (messageComponent.type === 'newboard'){
            setBoard(messageComponent.board)
            console.log(messageComponent.board)
        }

        if (messageComponent.type === 'dice'){
            setDiceVal(messageComponent.dice_val)
            console.log(`dice val is ${messageComponent.dice_val}`)
            }

        if (messageComponent.type === 'playerColor'){
            setColor(messageComponent.color)
            console.log(messageComponent.color)
        }

        
        if (messageComponent.type === 'ColorTurn'){
            setState(messageComponent.message)
            console.log(messageComponent.message)
        }

        if (messageComponent.type === 'win'){
            setWin(messageComponent.message)
            console.log(messageComponent.message)
        }



    }

    const checkSprite=(x,y,z,sprite)=>{

        console.log(x)
        console.log(y)
        console.log(z)
        console.log(sprite)

        const SpriteComponent ={
            type : `CoordinateUpdate`,
            board: board,
            color: sprite,
            x : x,
            y:  y,
            z: z
        }

        ws.send(JSON.stringify(SpriteComponent))
        console.log(`her is ${diceVal}`)

        ws.send(JSON.stringify({
            type: `Turn`,
        }))

        if(sprite!=state){
            setWarning(`warning not your turn`)
        }

        if(sprite==state){
            setWarning(``)
        }

    }
    
  

    return(

        <div>
            <div class='text_box'>
                <p>{win} </p>
            </div>

             <div class='text_box'>
                <p>{warning} </p>
            </div>

            <div class='text_box'>
                <p>This is "{state}" Turn </p>
            </div>

            <div className={color}>
            </div>

            <div className="dice" style={{textAlign: ''}}>
                {diceVal} 
            </div>

             

            <br/><br/><br/><br/><br/><br/><br/><br/>
        
            <div>{
                board.map((array, index)=>(   
                    <div key={index}>   
                    {
                
                        array.map((sub_array,sub_index)=>(
                            <div key={`${index}${sub_index}`} className={`cell${index}${sub_index}`}>
                            {
                                sub_array.map((element,index2)=>(
                                    <div key={`${index}${sub_index}${index2}`} className={element} onClick={()=>{checkSprite(`${index}`,`${sub_index}`,`${index2}`,element)}} > </div>

                                ))
                            }

                            </div> 
                        ))
                    }
                    
                    </div>
                    
                ))
                }
            </div>

            
        </div>
        
    )
}


const App= ()=>{
    return(
        <div>   
            <Ludo/>,
        </div>        
    )
}


ReactDOM.render(<App /> ,document.querySelector(`#root`))  




 