// The below code covers some miscellaneous features added

var trackIndex = 0;
var tracking = false;
var bodyCount;
var ctx;

var imageEarth = new Image();
imageEarth.src = './img/earth.png';

var imageISS = new Image();
imageISS.src = './img/iss.png';

var imageGEO = new Image();
imageGEO.src = './img/sat.png';

// The following are scaling functions to transform
// Altitude values (miles) and velocity (mph) to canvas
// distances
var altitude = d3.scale.linear()
    .range([170, 1000]).domain([249,22236]);

var velocity = d3.scale.linear()
	.range([5.275,12.75]).domain([6877.8,17100]);

// Select a particle by its index to track on display
function track(val) {
    tracking = true;
    trackIndex = val;
}

function zoom(val) {
    zoomScale = val;
}

// This function handles actually creating the visual particles.
// Earth is drawn as an image with a gradient overlay,
// and the ISS and Satellites have their respective images.
function updateParticle() {
	var ctx = $("#canvas")[0].getContext("2d");
	ctx.beginPath();
	ctx.font="24px Verdana";
	ctx.fillStyle = "rgba(235, 255, 255, 0.5)";
	if (this.type == "EARTH") {
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

// This is not an original function, it was added
function updateTrackers() {
	var allButtons = '';
	    particles.forEach(function (d,i) {
	    	if (i < 6) {
	    		allButtons += '<button class="btn btn-primary btn-lg outline" type="button" onclick="track('+i+')"> '+d.type+' </button>';
	    	}
	    })
	$('#btns').html(allButtons);
}



