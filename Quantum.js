/*
This is Artificial Quantum Computing Mechanics (AQCM) created by Joe Williams(shadowkingbubba)

This displays my understanding of quantum physics.. Even though most of it is simplified.

Each Qubit has 2 basic values the probability and a random number between 1 and 0;

Basically what I did was break down the gates.

          "xFlip"
__________________   /   "xyflip" 0 > (x*y)
          0
          |           | "yFlip"
          |           |
-.5_______|_______.5  |
          |           |
          |           |
         +-1          |
                      \"flipXy" x * y

FIXES NEEDED: Entanglement errors, Add the possibility vectors, Make random value (1/sqrt), add parallel programming

The meaning of this code is to narrow down the probability to specify a certain value using "Artificial Quantum Physics"

@author shadowkingbubba
*/

var values = [];

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  var arr1 = [];
  var arr2 = [];
  run(5000, function(q) {
    // n qubits : q[n-1]                -H-||||||-H-
    // Example Deutsch's Algorithm -    -H-||||||---
    var qb1 = new Qubit();
    var qb2 = new Qubit();
    qb1.cH(.5);       // Spin right
    qb2.cH(-.5);      // Spin left
    //BLOCK
    qb2.cNOT(qb1);   //          -H-|-.---|-H-
    qb2.NOT();    //          -H-|-+-+-|---
    //BLOCK
    qb1.H();         // reads sets

    arr1.push(qb1.M());
    arr2.push(qb2.M());
  });
  var avg1 = 0.00; var avg2 =0.00;
  for(var i = 0; i < arr1.length; i++) { avg1 += arr1[i];}
  for(var i = 0; i < arr2.length; i++) { avg2 += arr2[i];}
  values[0] = (avg1/arr1.length);
  values[1] = (avg2/arr2.length);
}

function draw() {
  background(0);
  fill(155,23,12);
  textSize(50);
  text(values[0], width/2, (1.5*height)/4);
  text(values[1], width/2, (2.5*height)/4);
}

function Qubit() {
  this.p = random(1);
  this.psi = 0; // value between -1 and 1

// Set to the default super position and takes it out
  this.H = function H() {
    if((this.psi == 1) || (this.psi == 0)) { // If the gate is collapsed, we will put it in a super position
      this.psi = .5; // 50% probability
    } else if (this.psi >= 0) {
      return 0;
    } else
      return 1;
  }

  // p = superposition's position/probability "add more properties"
  this.cH = function cH(p) {
    this.psi = p;
  }

  this.sqrtNOT = function sqrtNOT() {
    this.NOT();
    this.psi = sqrt(this.psi);
  }

  // Tie to another qubit to entangle
  this.NOT = function NOT() {
    this.xFlip();
  }

  // Controlled not gate "Add Entanglement"
  this.cNOT = function cNOT(q) {
    q.yFlip();
    if(this.entangle(q)) {

    }
  }
  // Swaps the gate value
  this.SWAP = function(q) {
    var qpsi = q.psi;
    var psi = this.psi;
    q.psi = psi;
    this.psi = qpsi;
  }
  // Measures the value of the qubit and flushes the value
  this.M = this.measure = function M() {
    this.psi = this.collapse();
    return this.psi;
  }
  this.entangle = function entangle(q,s) {
    if(q.psi >= 0)
      if(s == 1) {
        this.p = q.p;
      } else if (s == 0) {
        this.p = q.p;
        this.yFlip();
      }
    else
      if (s == 1) {
        this.p = q.p;
      } else if (s == 0) {
        this.yFlip();
      }
  }

  this.xFlip = function xFlip() {
    if(this.psi < 0){
      var x = this.psi - -.5;
      this.psi -= x;
    } else {
      var x = this.psi - .5;
      this.psi -= x;
    }
  }

  this.yFlip = function yFlip() {
    this.psi = -this.psi;
  }

  this.xyFlip = function xyflip() {
    if(this.psi == .75 || this.psi == -.25 )
      return this.psi;
    if(this.psi < .5) { // Set the axis to -.25
      var x = this.psi - -.25;
      this.psi = -x + -.25;
    } else { // Set the axis to .75
      var x = this.psi - .75;
      this.psi = -x + .75;
    }
  }

  this.flip = function flip() {
    if(this.psi == -.75 || this.psi == .25 )
      return this.psi;
    if(this.psi < -.5) { // Set the axis to -.25
      var x = this.psi - .25;
      this.psi = -x + .25;
    } else { // Set the axis to .75
      var x = this.psi - -.75;
      this.psi = -x + -.75;
    }
  }

  // Qubit value flush, pushes the value to either 1 or 0
  this.collapse = function collapse() {
    // for instance : p = .5 : p = 50%
    var r = this.p;
    var p = this.psi;
    if(p <= 0)
      if(abs(p) > r)
        return 1;
      else return 0;
    else
      if(p > r)
        return 1;
      else return 0;
  }
}

// Run( Number of times run , Amount of Qubits, the function to repeat)
function run(times, qasm) {
  for(var i = 0; i < times; i++) qasm(this.q);
}
