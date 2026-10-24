const point =  {x: 40, y : 80, z : 200}
const focalLength = 400

const canvas = document.getElementById("3denv")
const bg = "#000"
const pointcolor = '#F00'
const forecolor = "#50FF50"
canvas.style.backgroundColor = bg
canvas.width = 800
canvas.height = 800
const horizon = canvas.height-200

function lineToHorizon() {
  ctx.lineTo(canvas.width/2,horizon)
}

const ctx = canvas.getContext("2d")
ctx.strokeStyle = forecolor

function project(point) {
  const projectX = (point.x * focalLength) / point.z
  const projectY = (point.y * focalLength) / point.z

  const middleX = (canvas.width/2) + projectX
  const middleY = (canvas.height/2) - projectY

  return {x: middleX, y:middleY}
}

// function middle() {
//   ctx.lineTo(200,400)
// }

ctx.beginPath()

ctx.moveTo(0, 0)
lineToHorizon()
// Top Right to Center
ctx.moveTo(canvas.width, 0)
lineToHorizon()
// Bottom Left to Center
ctx.moveTo(0, canvas.height)
lineToHorizon()
// Bottom Right to Center
ctx.moveTo(canvas.width, canvas.height)
lineToHorizon()
ctx.stroke()

const point2d = project(point)
console.log(point2d)
ctx.fillStyle = pointcolor
ctx.fillRect(point2D.x - 4, point2D.y - 4, 8, 8)
