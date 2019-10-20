var formatAsInteger = d3.format(",");

var margin = {top: 20, right: 5, bottom: 20, left: 50};
//var width = 960;
//var height = 600;
var path = d3.geoPath();
var svgMap = d3.select("svg#map");
// Append Div for tooltip to BODY and not to SVG!!!
var tt = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);
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
        tt.transition()        
           .duration(200)      
           .style("opacity", .9);   

        tt.text(stateFips2Names[parseInt(d.id)])
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px"); 
     })
     .on("mousemove", function(d) {
        tt.text(stateFips2Names[parseInt(d.id)])
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");  
     })
     .on("mouseout", function() {
        d3.select(this)
          .transition().duration(200)
          .style("fill", function(d) {
            return colorScaleInstances(dataDict[d.id]);
          });
        tt.transition()        
           .duration(500)      
           .style("opacity", 0); 
     });
     
     //.append("title")
     //.text("Map visualization");

  svgMap.append("path")
    .attr("class","state-borders")
    .attr("d",path(geoObj));

}