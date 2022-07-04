/*
    MuW201: Tangible Computing
    Week 02 TenThousandX Assignment Examples

*/


function setup(){

  createCanvas(800,800)
  TenThousandX()

}


// Example 2 

function TenThousandX(){

  let step = width/10000
  // noFill()

  // stroke(0,100) 

  for (var x = 0; x < 10000; x++){

    let a = step*x 
    let b = cos(x*0.1)*(x/25)
    ellipse(a,b+width/2,1,1)

  }

}

// Advanced

// function TenThousandX(){

//   stroke(0,100)
//   noFill()

//   let stepW = width/10000
//   let stepH = height/10000

//   for (var x = 0; x < 10000; x++){

//     let a = stepW*x 
//     let b = cos(x*0.1)*(x/25)
//     let c = stepH*x
//     ellipse(a,b+width/2,1,1)
//     ellipse(width-a,b+width/2,1,1)
//     ellipse(b+width/2,c,1,1)
//     ellipse(b+width/2,height-c,1,1)

//   }

// }
