
var width = 1000,
    height = 600;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);


// Projection-settings for mercator (alternative)

var projection = d3.geoMercator()
    .center([0, 50 ])                 // Where to center the map in degrees
    .scale(160)                       // Zoom-level 
    .rotate([0,0]);                   // Map-rotation

/*
// Projection-settings for orthographic
  var projection = d3.geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate([-59.0, -34.0, -0.2])
      .precision(.1);
*/

// D3 geo path generator (maps geodata to SVG paths)
var path = d3.geoPath()
    .projection(projection);


// Use queue.js to read the two datasets asynchronous
queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/airports.json")
    .await(renderMap);


function renderMap(error, topology, data) {

  // Convert TopoJSON to GeoJSON (target object = 'countries')
  var world = topojson.feature(topology, topology.objects.countries).features;

  // Render the world atlas by using the path generator
  svg.selectAll("path")
      .data(world)
    .enter().append("path")
      .attr("d", path);

  // Create a marker (SVG circle) on the map for each airport
  var node = svg.selectAll(".airport")
      .data(data.nodes)
    .enter().append("circle")
      .attr("class", "airport")
      .attr("r", 5)
      .attr("transform", function(d) {
        return "translate(" + projection([d.longitude,d.latitude]) + ")";
      });

  // Add tooltip
    node.append("title")
        .text(function(d) { return d.name; });

  // Create connections (SVG lines) between the airports
  svg.selectAll(".connection")
      .data(data.links)
    .enter().append("line")
      .attr("class", "connection")
      .attr("x1", function(d) { return projection([data.nodes[d.source].longitude, data.nodes[d.source].latitude])[0]; })  
      .attr("y1", function(d) { return projection([data.nodes[d.source].longitude, data.nodes[d.source].latitude])[1]; }) 
      .attr("x2", function(d) { return projection([data.nodes[d.target].longitude, data.nodes[d.target].latitude])[0]; }) 
      .attr("y2", function(d) { return projection([data.nodes[d.target].longitude, data.nodes[d.target].latitude])[1]; });
}

