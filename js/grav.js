// The code that handles the gravity body relations was pulled
// from Brian Cruz's open source Gravity Simulator found here
// http://justfound.co/gravity/
// The code was stripped down HEAVILY and largely repurposed.
// Any of remnants of his code are below, and comments describe any
// changes we have made to them.


// Some established constants
var steps = 0;
var startTime;
var endTime;
var fps;
var particles = new Array();
// Both the mass and gravity constant were altered
var mass = 16; 
var gravityConstant = 0.49;
var xOffset = 0;
var yOffset = 0;
var initOffset = 0;
var initYOffset = 0;
var zoomScale = 0.3;
var running = true;

// Type parameter was added to allow for naming satellite bodies
// Color removed and radius to mass ratio altered
function Particle(t,m, v, x, y) {
	this.type = t;
	this.mass = m;
	this.velocity = v;
	this.x = x;
	this.y = y;
	this.absorb = absorbParticle;
	this.update = updateParticle;
	this.radius = Math.cbrt(500*this.mass);
}

function newParticle(t,m, v, x, y) {
	var p = new Particle(t, m, v, x, y);
	particles[particles.length] = p;
}

function getRadius() {
	return Math.sqrt(this.mass) / 2;
}

function Vector(x, y) {
	this.x = x;
	this.y = y;
}

// Function added at end to update tracking options after particle removed
// This function handles particle collision
function absorbParticle(p) {
	this.velocity.x = (this.velocity.x * this.mass + p.velocity.x * p.mass) / (this.mass + p.mass);
	this.velocity.y = (this.velocity.y * this.mass + p.velocity.y * p.mass) / (this.mass + p.mass);
	this.x = (this.x * this.mass + p.x * p.mass) / (this.mass + p.mass);
	this.y = (this.y * this.mass + p.y * p.mass) / (this.mass + p.mass);
	this.mass += p.mass;
	this.radius = Math.cbrt(500*this.mass);
	updateTrackers();
}


function updateCanvas(p) {
	// Update gravitational body particles
	for (var i = 0; i < p.length; i++) {
		p[i].update();
	}
	
}


// Adjusts particle speeds based on the effects of neighboring
function gravityCalc(p) {
	for (var i = 1; i < p.length; i++) {
		forceSum = new Vector(0, 0);
		for (var j = 0; j < p.length; j++) {
			if (j != i) {
				var xDist = p[i].x - p[j].x;
				var yDist = p[i].y - p[j].y;
				var distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
				if (distance < p[i].radius + p[j].radius) {
					p[j].absorb(p[i]);
					p.splice(i, 1);
					updateTrackers();
				} else {
					var forceMag = gravityConstant * (p[i].mass * p[j].mass) / Math.pow(distance, 2);
					var nextStep = forceMag / p[i].mass + forceMag / p[j].mass;
					if (distance < nextStep) {
					  p[j].absorb(p[i]);
					  p.splice(i, 1);
					} else {
  					forceSum.x -= Math.abs(forceMag * (xDist / distance)) * Math.sign(xDist);
  					forceSum.y -= Math.abs(forceMag * (yDist / distance)) * Math.sign(yDist);
					}
				}
			}
		}

		p[i].velocity.x += forceSum.x / p[i].mass;
		p[i].velocity.y += forceSum.y / p[i].mass;
	}
	for (var i = 0; i < p.length; i++) {
		p[i].x += p[i].velocity.x / 10;
		p[i].y += p[i].velocity.y / 10;
	}
}

// Centers display on an object
function center(p) {
	x = p[trackIndex].x * zoomScale;
	y = p[trackIndex].y * zoomScale;
	xOffset = $(window).width() / 2 - x;
	yOffset = $(window).height() / 2 - y;
}

function clean(p) {
	for (var i = 0; i < p.length; i ++) {
		var x = p[i].x * zoomScale + xOffset;
		var y = p[i].y * zoomScale + yOffset;
		if (x < 0 || x > $(window).width() || y < 0 || y > $(window).height()) {
			p.splice(i, 1);
		}
	}
}

// This updates the display at an increment of time for animation
$(document).ready(function (e) {
	xOffset = $(window).width() / 2;
	yOffset = $(window).height() / 2;
	mouseInitX = e.clientX;
	mouseInitY = e.clientY;
	ctx = $("#canvas")[0].getContext("2d");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	var startTime = new Date;
	t  = setInterval(function() {
		endTime = new Date;
		fps = 1000 / (endTime - startTime);
		startTime = endTime;
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		updateCanvas(particles);
		if (running) {
			gravityCalc(particles);
			steps ++;
		}
		if (tracking) {
			center(particles);
		}
	}, 10);
});