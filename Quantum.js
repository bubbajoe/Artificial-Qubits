/*
This is Artificial Quantum Computing Mechanics (AQCM) created by Joe Williams(shadowkingbubba)

This displays my understanding of quantum physics.. Even though most of it is simplified. :(

FIXES NEEDED: Entanglement errors, Add the possibility vectors, Make random value (1/sqrt)

@author shadowkingbubba
*/

function setup() {
  var arr1 = [];
  var arr2 = [];
  run(100, function(q) {
    // n qubits : q[n-1]                -H-||||||-H-
    // Example Deutsch's Algorithm -    -H-||||||---
    var qb1 = createQubit();
    var qb2 = createQubit();
    qb1.cH(.5);       // Spin right
    qb2.cH(-.5);      // Spin left
    //BLOCK
    //qb2.cNOT(qb1);   //          -H-|-.---|-H-
    //qb2.NOT();    //          -H-|-+-+-|---
    //BLOCK
    qb1.H();         // reads sets

    arr1.push(qb1.M());
    arr2.push(qb2.M());
  });
  var avg1 = 0.00; var avg2 =0.00;
  for(var i = 0; i < arr1.length; i++) { avg1 += arr1[i]; console.log(arr1[i]); }
  for(var i = 0; i < arr2.length; i++) { avg2 += arr2[i]; console.log(arr2[i]); }
  console.log((avg1/arr1.length)+" AND "+(avg2/arr2.length));
}

function Qubit() {
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
    if(this.psi < 0){
      var x = this.psi - -.5;
      this.psi -= x;
    }
    else {
      var x = this.psi - .5;
      this.psi -= x;
    }
  }
  // Controlled not gate
  this.cNOT = function cNOT(q) {
    q.psi = -q.psi;
    if(collapse(this.psi) == 1)
      this.NOT();
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
    this.psi = collapse(this.psi);
    return this.psi;
  }
}

// Run( Number of times run , Amount of Qubits, the function to repeat)
function run(times, qasm) {
  for(var i = 0; i < times; i++) qasm(this.q);
}

function createQubit() {
  return new Qubit();
}

// Qubit value flush, pushes the value to either 1 or 0
function collapse(p) {
  // for instance : p = .5 : p = 50%
  r = random(1)
  if(p < 0)
    if(abs(p) > r)
      return 1; else return 0;
  else
    if(p > r)
      return 1; else return 0;
}
/*
absolute value of X
function abs(x) {
  return Math.abs(x);
}
// Square root of X
function sqrt(x) {
  return Math.sqrt(x);
}
*/
