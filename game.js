const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const COLS = 12
const ROWS = 20
const SIZE = 20

let score = 0
let highScore = localStorage.getItem("tetrisHighScore") || 0

document.getElementById("highScore").innerText = "Record: " + highScore

let gameInterval = null
let running = false

const board = Array.from({length:ROWS},()=>Array(COLS).fill(0))

const pieces = [

[[1,1,1,1]],

[[1,1],
 [1,1]],

[[0,1,0],
 [1,1,1]],

[[1,1,0],
 [0,1,1]],

[[0,1,1],
 [1,1,0]],

[[1,0,0],
 [1,1,1]],

[[0,0,1],
 [1,1,1]]

]

let player = {
x:4,
y:0,
shape:randomPiece()
}

function randomPiece(){
return pieces[Math.floor(Math.random()*pieces.length)]
}

function drawCell(x,y){

ctx.fillStyle="cyan"
ctx.shadowBlur=10
ctx.shadowColor="cyan"

ctx.fillRect(x*SIZE,y*SIZE,SIZE-1,SIZE-1)

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

for(let y=0;y<ROWS;y++){
for(let x=0;x<COLS;x++){

if(board[y][x]){
drawCell(x,y)
}

}
}

player.shape.forEach((row,y)=>{
row.forEach((value,x)=>{

if(value){
drawCell(player.x+x,player.y+y)
}

})
})

}

function collide(){

for(let y=0;y<player.shape.length;y++){
for(let x=0;x<player.shape[y].length;x++){

if(player.shape[y][x] &&
(board[player.y+y]?.[player.x+x] !== 0)){
return true
}

}
}

return false
}

function merge(){

player.shape.forEach((row,y)=>{
row.forEach((value,x)=>{

if(value){
board[player.y+y][player.x+x] = 1
}

})
})

}

function clearLines(){

for(let y=ROWS-1;y>=0;y--){

if(board[y].every(v=>v===1)){

board.splice(y,1)
board.unshift(Array(COLS).fill(0))

score += 100

document.getElementById("score").innerText = "Score: " + score

if(score > highScore){

highScore = score

localStorage.setItem("tetrisHighScore", highScore)

document.getElementById("highScore").innerText = "Record: " + highScore

}

}

}

}

function drop(){

player.y++

if(collide()){

player.y--

merge()

clearLines()

player.shape = randomPiece()

player.y = 0
player.x = 4

if(collide()){

alert("Game Over")

resetGame()

}

}

draw()

}

function move(dx,dy){

if(!running) return

player.x += dx
player.y += dy

if(collide()){
player.x -= dx
player.y -= dy
}

draw()

}

function rotate(){

if(!running) return

const rotated = player.shape[0].map((_,i)=>
player.shape.map(row=>row[i]).reverse()
)

const old = player.shape

player.shape = rotated

if(collide()){
player.shape = old
}

draw()

}

function startGame(){

if(running) return

running = true

gameInterval = setInterval(drop,700)

}

function pauseGame(){

running = false

clearInterval(gameInterval)

}

function resetGame(){

pauseGame()

board.forEach(row=>row.fill(0))

score = 0

document.getElementById("score").innerText = "Score: 0"

player.shape = randomPiece()
player.x = 4
player.y = 0

draw()

}

document.addEventListener("keydown",e=>{

if(e.key==="ArrowLeft") move(-1,0)

if(e.key==="ArrowRight") move(1,0)

if(e.key==="ArrowDown") move(0,1)

if(e.key==="ArrowUp") rotate()

})

draw()