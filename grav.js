function Particle(t,m, v, x, y) {
	this.type = t;
	this.mass = m;
	this.velocity = v;
	this.x = x;
	this.y = y;
	this.color = new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
	this.absorb = absorbParticle;
	this.paint = paintParticle;
	this.radius = Math.cbrt(500*this.mass);
}

function getRadius() {
	return Math.sqrt(this.mass) / 2;
}

function absorbParticle(p) {
	if (this.mass < p.mass) {
		this.color = p.color;
	}
	this.velocity.x = (this.velocity.x * this.mass + p.velocity.x * p.mass) / (this.mass + p.mass);
	this.velocity.y = (this.velocity.y * this.mass + p.velocity.y * p.mass) / (this.mass + p.mass);
	this.x = (this.x * this.mass + p.x * p.mass) / (this.mass + p.mass);
	this.y = (this.y * this.mass + p.y * p.mass) / (this.mass + p.mass);
	this.mass += p.mass;
	this.radius = Math.cbrt(500*this.mass);
}

function paintParticle() {
	var ctx = $("#canvas")[0].getContext("2d");
	ctx.beginPath();
	ctx.font="24px Verdana";
	ctx.fillStyle = "rgba(235, 255, 255, 0.5)";
	if (this.type == "EARTH") {
		// ctx.arc(this.x * zoomScale + xOffset, this.y * zoomScale + yOffset, this.radius * zoomScale, 0, 2 * Math.PI, false);
		
		ctx.drawImage(imageEarth,this.x * zoomScale + xOffset- zoomScale*this.radius, this.y * zoomScale + yOffset-zoomScale*this.radius,zoomScale*this.radius*2,zoomScale*this.radius*2);
		ctx.arc(this.x * zoomScale + xOffset, this.y * zoomScale + yOffset, this.radius * zoomScale, 0, 2 * Math.PI, false)
		var my_gradient=ctx.createRadialGradient(this.x * zoomScale + xOffset,this.y * zoomScale + yOffset,this.radius * zoomScale*0.33,this.x * zoomScale + xOffset,this.y * zoomScale + yOffset,this.radius * zoomScale);
		my_gradient.addColorStop(0,"rgba(0,250,0,0.2)");
		my_gradient.addColorStop(1,"rgba(0,0,250,0.3)");
		ctx.fillStyle = my_gradient;
		ctx.fill();
		ctx.fillStyle="#3F3E40";
		ctx.fillText(this.type, this.x * zoomScale + xOffset - 40, this.y * zoomScale + yOffset+5);
	} else if (this.type == "ISS") {
		ctx.drawImage(imageISS,this.x * zoomScale + xOffset - 10, this.y * zoomScale + yOffset - 5,zoomScale*15,zoomScale*15);
		ctx.fillText(this.type, this.x * zoomScale + xOffset, this.y * zoomScale + yOffset - 10);
	} else {
		ctx.drawImage(imageGEO,this.x * zoomScale + xOffset - 10, this.y * zoomScale + yOffset - 5,zoomScale*5,zoomScale*5);
		ctx.fillText(this.type, this.x * zoomScale + xOffset, this.y * zoomScale + yOffset - 5);
	}
}

function paintParticles(p) {
	for (var i = 0; i < p.length; i++) {
		p[i].paint();
	}
}

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
