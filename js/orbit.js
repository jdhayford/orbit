// Create initial Earth, ISS and Satcom particles
// Velocities and altitudes are set to their scaled actual properties
newParticle("EARTH",5900,new Vector(0,0), 0, 0);
newParticle("ISS",1,new Vector(0,velocity(17100)),altitude(249),2);
newParticle("SATCOM",1,new Vector(0,velocity(6877.8)),altitude(22236),0);
var bodyCount = particles.length;


$(document).ready(function(){
	var minAlt= $('#altInput').prop('min');
	var maxAlt = $('#altInput').prop('max');
	var alt = $('#altInput');

	var minVel= $('#velInput').prop('min');
	var maxVel = $('#velInput').prop('max');
	var vel = $('#velInput');

    $('#altText').text('Intended Altitude');

    // Change slider sub-text to indicate current value selected
    alt.on('input change', function () {
        $('#altText').text(function () {
        	if (alt.val() == minAlt ) {return 'Altitude of ISS';}
        	else if (alt.val() == maxAlt) {return 'Altitude of GEO';}
        	else { return numberWithCommas(alt.val())+" miles"; }
        });
    });

    $('#velText').text('Intended Velocity');

    vel.on('input change', function () {
        $('#velText').text(function () {
        	if (vel.val() == minVel ) {return 'Velocity of GEO';}
        	else if (vel.val() == maxVel) {return 'Velocity of ISS';}
        	else { return numberWithCommas(vel.val())+" mph"; }
        });
    });

    $("#add").click(function(){
        $("#instructions").slideToggle();
    });

    // Code handles the insertion of a new satellite.
    // First the particle is created, then the trackers are updated
    // and finally the feedback is altered based on how the orbit 
    // compares to the goal.
    $("#insert").click(function() {
    	bodyCount += 1;
    	if (particles.length == 6) { 
    		particles.splice(3,1);
    	}   
        var newSat = "SAT-" + bodyCount;
    	newParticle(newSat ,1,new Vector(0,velocity(vel.val())),altitude(alt.val()),0);
    	updateTrackers();
        $("#feedback").html(function() {
            var altRes = alt.val() <= 12550 ? Math.round(100*alt.val()/12550) + "%" : "Too high";
            var velRes = vel.val() <= 8640 ? Math.round(100*vel.val()/8640) + "%" : "Too fast";
            var success = "";
            if (altRes.slice(0,-1)*1 > 95) {
                if (velRes.slice(0,-1)*1 > 95) {
                    success = "<span style='color: #83F52C; font-size: 34px; text-decoration: blink;'> SUCCESS </span>";
                }   else {
                    success = (isNaN(velRes.slice(0,-1)*1) ? "Slow down!" : "Speed Up!");;
                }
            }   else {
                console.log(altRes.slice(0,-1)*1 > 95);
                success = (isNaN(altRes.slice(0,-1)*1) ? "Lower your altitude!" : "Raise your altitude!");
            }
            // var success = (altRes.slice(0,-1)*1 > 95 & velRes.slice(0,-1)*1 > 95) ? "<span style='color: #83F52C; font-size: 34px; text-decoration: blink;'> SUCCESS </span>" : "";
            return  "Satellite Designation: " + newSat + "<br />" +
                "Orbital Altitude: " + altRes + "<br />" +
                "Satellite Velocity: " + velRes + "<br />" + 
                success;
        })
    })

});

// Credit to Elias Zamaria from StackOverflow
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

