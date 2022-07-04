let socket;


function setup() {
    createCanvas(600,600);
    background(52);

    socket = io.connect('http://localhost:3000')
    socket.on('mouse', newDrawing);
}

function newDrawing(data){
    noStroke();
    fill(212, 0, 12)
    ellipse(data.x, data.y, 26, 26)
}

function mouseDragged() {
    console.log('Sending: ' + mouseX + ',' + mouseY);

    const data = {
        x: mouseX, 
        y: mouseY
    }
    socket.emit('mouse', data);

    noStroke();
    fill(212)
    ellipse(mouseX, mouseY, 26, 26)
}

