var formatAsInteger = d3.format(",");

var margin = {top: 20, right: 5, bottom: 20, left: 50};
var width = 960;
var height = 600;
var path = d3.geoPath();
var svgMap = d3.select("svg#map")
var colorScaleInstances;

var colorScaleInjuries = d3.scaleSequential()
                            .domain([0, 22879])
                            .interpolator(d3.interpolateBlues);

var colorScaleDeaths = d3.scaleSequential()
                            .domain([0, 1908])
                            .interpolator(d3.interpolateBlues);

var geoMeshFilter;
var geoObj;
var geoFeatures;
var dataDict;

function initD3Map(data) {

    d3.json("https://d3js.org/us-10m.v1.json")
      .then(function(us_map) {

        geoMeshFilter = (a,b) => a!== b;
        geoObj = topojson.mesh(us_map, us_map.objects.states, geoMeshFilter);
        geoFeatures = topojson.feature(us_map, us_map.objects.states).features;

        dataDict = data.reduce((a, d) => {a[d.statefips] = d.value; return a;}, {});

        colorScaleInstances = d3.scaleSequential()
                            .domain([
                                d3.min(data.map(d => d.value)),
                                d3.max(data.map(d => d.value))
                              ])
                            .interpolator(d3.interpolateBlues);

        updateD3Map(data);
      });
}

function updateD3Map(data) {
    //console.log("updating map");
    if (data.length == 0)
      return;

    dataDict = data.reduce((a, d) => {a[d.statefips] = d.value; return a;}, {});

    colorScaleInstances = d3.scaleSequential()
                    .domain([
                        d3.min(data.map(d => d.value)),
                        d3.max(data.map(d => d.value))
                      ])
                    .interpolator(d3.interpolateBlues);
    
    // remove old colors
    svgMap.selectAll("path").remove();

    svgMap.selectAll("path").data(geoFeatures)
     .enter().append("path")
     //.attr("class", "us-states")
     .attr("d", path)
     .attr("fill", d => {
        if (d.id in dataDict) {
          //console.log("present:", d.id);
          return colorScaleInstances(dataDict[d.id]);
        }
        else {
          //console.log("mising:", d.id);
          return colorScaleInstances(0);
        }
     })
     .on("click", updateD3Bars)    // handle mouse click
     .on("mouseover", function(d) {
        d3.select(this)
          .transition().duration(200)
          .style("fill", "red");
     })
     .on("mouseout", function() {
        d3.select(this)
          .transition().duration(200)
          .style("fill", function(d) {
            return colorScaleInstances(dataDict[d.id]);
          });
     });
     
     //.append("title")
     //.text("Map visualization");

  svgMap.append("path")
    .attr("class","state-borders")
    .attr("d",path(geoObj));

}

/*
    var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(0);

    // -- for animation --
    var arcFinal = d3.arc()
                     .innerRadius(innerRadiusFinal)
                     .outerRadius(outerRadius);

    var arcFinal2 = d3.arc()
                      .innerRadius(innerRadiusFinal2)
                      .outerRadius(outerRadius);
    // -------------------

    var pie = d3.pie()
                .value(function(d) {return d.count;});

    var arcs = viz.selectAll("g.slice")
                  .data(pie)
                  .enter()
                  .append("svg:g")
                  .attr("class", "slice")
                  .on("mouseover", mouseover)
                  .on("mouseout", mouseout)
                  .on("click", up);

    arcs.append("svg:path")
        .attr("fill", function(d, i) {return color(i);})
        .attr("d", arc)
        .append("svg:title")
        .text(function(d) {return d.state + ": " + formatAsInteger(d.count)});

    d3.selectAll("g.slice")
      .selectAll("path")
      .transition()
      .duration(750)
      .delay(10)
      .attr("d", arcFinal)

    // add label to the larger arcs, translated to the arc centroid and rotated
    arcs.filter(function(d) {return d.endAngle - d.startAngle > 0.2;})
        .append("svg:text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {return "translate(" + arcFinal.centroid(d) + ")";})
        .text(function(d) {return d.state;});

    // pie chart title
    viz.append("svg:text")
       .attr("dy", "0.35em")
       .attr("text-anchor", "middle")
       .text("Storm instances in states")
       .attr("class", "title");
}
*/


function mouseover() {
    d3.select(this).select("path").transition()
      .duration(750)
      .attr("d", arcFinal2);
}

function mouseout() {
    d3.select(this).select("path").transition()
      .duration(750)
      .attr("d", arcFinal);
}

function up(d,i) {
    updateBarChart(d.state, color(i), data)
}