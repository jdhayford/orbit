
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var axisNames = { 
                    launchMassKg: 'Launch Mass (Kilograms)', 
                    takeoffThrust: 'Takeoff Thrust (Kilonewtons)',  
                    meanAltitude: 'Mean Altitude (Miles)',
                    periodMinutes: 'Period (Minutes)',
                    vehicleLength: 'Vehicle Length (Meters)' 
                };

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#lvscatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("./data/satellite_lv_interactive.txt", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.launchMassKg = +d.launchMassKg;
    d.takeoffThrust = +d.takeoffThrust;
    d.meanAltitude = +d.meanAltitude;
    d.periodMinutes = +d.periodMinutes;
    d.vehicleLength = +d.vehicleLength;
  });

  // Set the axes to the initial and adjust scale accordingly
  var xAxy= 'takeoffThrust';
  var yAxy ='launchMassKg';
  x.domain(d3.extent(data, function(d) { return d.takeoffThrust; })).nice();
  y.domain(d3.extent(data, function(d) { return d.launchMassKg; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Take Off Thrust (Kilonewtons)");

 svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Launch Mass (Kilograms)");

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", function(d) { return x(d.takeoffThrust); })
      .attr("cy", function(d) { return y(d.launchMassKg); })
      .style("fill", function(d) { return color(d.classOfOrbit); });

  // Fall in animation at beginning on load
  svg.selectAll(".dot")
      .transition()
      .duration(function(d,i) {
                return Math.floor(Math.random() * 3000);
              })
      .ease("bounce")
      .delay(function(d,i) {
                return Math.floor(Math.random() * 1000);
              })
      .attr("cy", function(d) { return y(d.launchMassKg); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

        // Toggle which catagories are shown.
  d3.selectAll("[name=v]").on("change", function() {
    var x = d3.scale.linear()
        .range([0, width]).domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();

    var y = d3.scale.linear()
        .range([height, 0]).domain(d3.extent(data, function(d) { return d[yAxy]; })).nice();
      var selected = this.value;
      display = this.checked ? "inline" : "none";

      if (this.checked) {
            svg.selectAll(".dot")
                  .filter(function(d) {return selected == d.classOfOrbit  ;})
                  .attr("display",display)
                  .transition()
                  .duration(function(d,i) {
                    return Math.floor(Math.random() * 1000);
                  })
                  .ease("bounce")
                  .delay(function(d,i) {
                    return Math.floor(Math.random() * 500);
                  })
                  .attr("cy", function(d) { return y(d.launchMassKg); });

          } else {
            svg.selectAll(".dot")
              .filter(function(d) {return selected == d.classOfOrbit  ;})
              .transition()
              .duration(function(d,i) {
                    return Math.floor(Math.random() * 500);
                  })
              .ease("back")
              .delay(function(d,i) {
                    return Math.floor(Math.random() * 500);
                  })
              .attr("cy",height)
              .each("end", function(){
                d3.select(this)
                .attr("display",display)
                .attr("cy",0);});
              };
});
  // Toggle the X and Y axis variables.
  d3.select("[name=xAX]").on("change", function(){
    xAxy = this.value;
    x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();
    svg.select(".x.axis").transition().call(xAxis);
    svg.selectAll(".dot").transition().attr("cx", function(d) { 
        return x(d[xAxy]);
    });
    svg.selectAll(".x.axis").selectAll("text.label").text(axisNames[xAxy]);
  });

  d3.select("[name=yAX]").on("change", function(){
    yAxy = this.value;
    y.domain(d3.extent(data, function(d) { return d[yAxy]; })).nice();
    svg.select(".y.axis").transition().call(yAxis);
    svg.selectAll(".dot").transition().attr("cy", function(d) { 
        return y(d[yAxy]);
    });
    svg.selectAll(".y.axis").selectAll("text.label").text(axisNames[yAxy]);
  });



});

