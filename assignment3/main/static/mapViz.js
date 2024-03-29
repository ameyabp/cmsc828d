var path = d3.geoPath();
var width = Math.round(Number(d3.select("#map").style('width').slice(0, -2)));
var height = Math.round(Number(d3.select("#map").style('height').slice(0, -2)));
var svgMap = d3.select("#map").append("svg").attr("width", width).attr("height", height);

// Append Div for tooltip to BODY and not to SVG!!!
var tt = d3.select("body").append("div")   
                .attr("class", "tooltip")           
                .style("opacity", 0);

var colorScaleInstances;
var legend;

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

        updateD3Map(data);
      });
}

function updateD3Map(data) {
    //console.log("updating map");
    if (data.length == 0) {
      //console.log(data);
      return;
    }

    dataDict = data.reduce((a, d) => {a[d.statefips] = d.value; return a;}, {});

    colorScaleInstances = d3.scaleSequential()
                    .domain([
                        d3.min(data.map(d => d.value)),
                        d3.max(data.map(d => d.value))
                      ])
                    .interpolator(d3.interpolateGreys);

    // remove old colors
    svgMap.selectAll("path").remove();
    svgMap.selectAll("g").remove();

    legend = d3.legendColor()
               .scale(colorScaleInstances)
               .orient("vertical")
               .shapeWidth(60)
               .shapeHeight(40)
               .title("Number of instances");

    svgMap.append("g")
          .attr("transform", "translate(" + 24*width/25 + ", " + 2*height/5 + ")")
          .call(legend)


    svgMap.selectAll("path").data(geoFeatures)
     .enter().append("path")
     .attr("d", path)
     .attr("fill", d => {
        if (parseInt(d.id) in dataDict) {
          //console.log("present:", d.id);
          return colorScaleInstances(dataDict[parseInt(d.id)]);
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

        if (parseInt(d.id) in dataDict) {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + dataDict[parseInt(d.id)] + " instances" +  "<br />" + "<br />" + "Click to view breakdown")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
        else {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + "No instances")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
     })
     .on("mousemove", function(d) {
        if (parseInt(d.id) in dataDict) {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + dataDict[parseInt(d.id)] + " instances" +  "<br />" + "<br />" + "Click to view breakdown")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
        else {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + "No instances")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
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

  svgMap.append("path")
    .attr("class","state-borders")
    .attr("d",path(geoObj));

}
