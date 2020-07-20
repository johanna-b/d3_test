
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


// Load data
d3.json("data/airports.json", function(data) {

    // Specify force simulation
    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-10))
        .force("link", d3.forceLink(data.links).distance(30))
        .force("center", d3.forceCenter().x(width/2).y(height/2));

    // Draw the edges (SVG lines)
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link");

    // Draw the nodes (SVG circles)
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", function(d){
            if(d.country == "United States")
                return "blue";
            else
                return "red";
        })
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));


//Define drag event functions
    function dragStarted(d) {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragging(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragEnded(d) {
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Append a <title>-tag to each node (browser tooltips)
    node.append("title")
        .text(function(d) { return d.name; });

    // Update the coordinates on every tick (force layout -> physical simulation)
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
});
