let image = new Image();
image.src = 'Tiles_32x32.png';
const tileWidth = 32, tileHeight = 32;
const mapRows = 8, mapColumns = 18;
const sourceWidth = 256, sourceHeight = 256;

let tiles = new Array(mapColumns * mapRows);
let mapHeight = mapRows * tileHeight;
let mapWidth = mapColumns * tileWidth;
let sourceX, sourceY, sourceTile;
let canvas = document.getElementById('myCanvas');
let context = canvas.getContext('2d');
let mouseDown;

canvas.addEventListener('mousedown', doMouseDown);
document.addEventListener('contextmenu', event => event.preventDefault());
canvas.addEventListener('mousemove', doMouseMove);
canvas.addEventListener('click', doMouseClick);
canvas.addEventListener('mouseup', doMouseUp);
image.addEventListener('load', redrawSource);
// draw the grid
 
for (let i = 0; i <= mapColumns; i++) {
  context.moveTo(i * tileWidth, 0);
  context.lineTo(i * tileWidth, mapHeight);
}
context.stroke();
for (let i = 0; i <= mapRows; i++) {
  context.moveTo(0, i * tileHeight);
  context.lineTo(mapWidth, i * tileHeight);
}
context.stroke();
 
function redrawSource() {
  context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, mapHeight, sourceWidth, sourceHeight);
}
 
function doMouseUp(e) {
  mouseDown = false;
  // update the string    
  let string = 'let tiles = [';
  for (let i = 0; i < mapColumns * mapRows; i++) {
    if (tiles[i] != undefined) string = string + tiles[i];
    string = string + ',';
  }
  string = string + '];';
  document.getElementById('result').innerHTML = string;
}
 
function doMouseDown(e) {
  mouseDown = true;
  let x = e.clientX;
  let y = e.clientY;
  let gridX = Math.floor(x / tileWidth) * tileWidth;
  let gridY = Math.floor(y / tileHeight) * tileHeight;
 
  if (y > mapHeight && y < (mapHeight + sourceHeight) && x < sourceWidth) { // source
    let tileX = Math.floor(x / tileWidth);
    let tileY = Math.floor((y - mapHeight) / tileHeight);
    sourceTile = tileY * (sourceWidth / tileWidth) + tileX;
    sourceX = gridX;
    sourceY = gridY - mapHeight;
    redrawSource();
    drawBox();
  }
}
 
function doMouseMove(e) {
  let x = e.clientX;
  let y = e.clientY;
  let gridX, gridY;
  gridX = Math.floor(x / tileWidth) * tileWidth;
  gridY = Math.floor(y / tileHeight) * tileHeight;
 
 
  if (y > mapHeight && y < (mapHeight + sourceHeight) && x < sourceWidth) { // source
    context.clearRect(0, mapHeight, sourceWidth, sourceHeight);
    redrawSource();
    context.beginPath();
    context.strokeStyle = 'blue';
    context.rect(gridX, gridY, tileWidth, tileHeight);
    context.stroke();
    drawBox();
 
  }
 
  if (mouseDown == true) drawTile(e);
}
 
function drawBox() {
  context.beginPath();
  context.strokeStyle = 'red';
  context.rect(sourceX, sourceY + mapHeight, tileWidth, tileHeight);
  context.stroke();
}
 
function doMouseClick(e) {
  drawTile(e);
}
 
function drawTile(e) {
  let x = e.clientX;
  let y = e.clientY;
  let gridX, gridY;
  gridX = Math.floor(x / tileWidth) * tileWidth;
  gridY = Math.floor(y / tileHeight) * tileHeight;
  if (y < mapHeight && x < mapWidth) { // target
    context.clearRect(gridX, gridY, tileWidth, tileHeight);
    context.drawImage(image, sourceX, sourceY, tileWidth, tileHeight, gridX, gridY, tileWidth, tileHeight);
    let tileX = Math.floor(x / tileWidth);
    let tileY = Math.floor(y / tileHeight);
    let targetTile = tileY * mapColumns + tileX;
    tiles[targetTile] = sourceTile;
    if (e.button == 2) {
      context.clearRect(gridX, gridY, tileWidth, tileHeight);
      context.beginPath();
      context.strokeStyle = 'black';
      context.rect(gridX, gridY, tileWidth, tileHeight);
      context.stroke();
      tiles[targetTile] = null
    };
  }
}