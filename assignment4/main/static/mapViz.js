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

        // Get names of cereals, for dropdown
        var states = Object.keys(names2StateFips);

        var dropdown = d3.select("#map")
                         .insert("select", "svg")
                         .attr("class", "dd")
                         .on("change", dropdownChange);

        dropdown.selectAll("option")
                .data(states)
                .enter().append("option")
                .attr("value", function (d) { return d; })
                .text(function (d) { return d; });

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
               .title("Number of " + radioChoice);

    svgMap.append("g")
          .attr("transform", "translate(" + 24*width/25 + ", " + 2*height/5 + ")")
          .call(legend)


    svgMap.selectAll("path").data(geoFeatures)
     .enter().append("path")
     .attr("d", path)
     .attr("id", function(d) {
        return "fip"+parseInt(d.id);
     })
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

        if (parseInt(d.id) in dataDict && dataDict[parseInt(d.id)] != 0) {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + dataDict[parseInt(d.id)] + " " + radioChoice +  "<br />" + "<br />" + "Click to view breakdown")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
        else {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + "No " + radioChoice)
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }

        if (bLog) {
          loggerDate = new Date();
          logs.push("hover_" + loggerDate.getTime() + "\n");
        }
     })
     .on("mousemove", function(d) {
        if (parseInt(d.id) in dataDict && dataDict[parseInt(d.id)] != 0) {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + dataDict[parseInt(d.id)] + " " + radioChoice +  "<br />" + "<br />" + "Click to view breakdown")
           .style("left", (d3.event.pageX + 10) + "px")     
           .style("top", (d3.event.pageY + 10) + "px"); 
        }
        else {
          tt.html(stateFips2Names[parseInt(d.id)] + "<br />" + "No " + radioChoice)
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

// Handler for dropdown value change
function dropdownChange() {
    //console.log("Selected state", d3.select(this).property('value'))
    var newState = d3.select(this).property('value');
    var newFips = names2StateFips[newState];

    // highlight the state for 2 seconds
    svgMap.select("#fip"+newFips).style("fill", "red").transition().duration(5000).style("fill", colorScaleInstances(dataDict[parseInt(newFips)]));

    if (bLog) {
      loggerDate = new Date();
      logs.push("Dropdown used_" + loggerDate.getTime() + "\n");
    }

    // update the bar chart
    updateD3BarsDropdown(newFips);
};

function updateMapRadio() {
  //console.log("update map with radio", radioChoice)
    d3.json("/getMap", {
        method: "POST",
        body: JSON.stringify({
            what: radioChoice,
            start: rangeBegin,
            end: rangeEnd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(data) {
        //console.log(data);
        updateD3Map(data);
    });
}