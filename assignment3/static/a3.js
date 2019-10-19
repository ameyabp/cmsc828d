/*var tuples = [{"czmtype":"C","count":"1039183"},{"czmtype":"M","count":"7513"},{"czmtype":"Z","count":"516660"}];

console.log(tuples);

var xBand = d3.scaleBand()
            .domain(tuples.map(d=> d.czmtype))
            .range([100, 750])
            .paddingInner(0.1);

var hScale = d3.scaleLinear()
            .domain([0, Math.max(...tuples.map(d=>parseInt(d.count)))])
            //.domain([0, 1100000])
            .range([550,50]);

d3.select("#viz").selectAll("rect")
        .data(tuples)
        .enter()
        .append("rect")
        .attr("width", xBand.bandwidth())
        .attr("height", d => 550-hScale(parseInt(d.count)))
        .attr("x", d => xBand(d.czmtype) + "px")
        .attr("y", d=>hScale(parseInt(d.count)) + "px")
        .attr("fill", "blue");

// only applies to the axes!!!!
d3.select("#viz").append("g")
                .attr("transform", "translate(0, 550)")
                .call(d3.axisBottom(xBand))

d3.select("#viz").append("g")
                .attr("transform", "translate(100,0)")
                .call(d3.axisLeft(hScale));
                */

/*

queue()
    .defer(d3.json, mapVizUrl)
    .defer(d3.json, barChartUrl)
    .await(ready);
    
function ready(error, dataset) {
    d3MapViz(dataset);
    d3BarChart(dataset);
}
*/

// init visualizations
initMap(1990, 1995);
//initBarChart('ALASKA');

function initMap(beginYear, endYear) {
    d3.json("/getMap", {
        method: "POST",
        body: JSON.stringify({
            start: beginYear,
            end: endYear
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(data) {
        //console.log(data);
        initD3Map(data);
    });
}

function initBarChart(state) {
    d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            place: state
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        console.log(data);
        initD3Bars(data);
      });
}

function updateMap(beginYear, endYear) {
    d3.json("/getMap", {
        method: "POST",
        body: JSON.stringify({
            start: beginYear,
            end: endYear
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(function(data) {
        console.log(data);
        updateD3Map(data);
    });
}

function updateBarChart(state) {
    d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            place: state
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        console.log(data);
        updateD3Bars(data);
      });
}

// render the time slider
var rangeBegin = 0;
var rangeEnd = 0;
var slider = createD3RangeSlider(1950, 2019, "#slider");
slider.range(1990, 1995);
slider.onChange(function(newRange) {
    if (newRange.begin != rangeBegin || newRange.end != rangeEnd) {
        //console.log(newRange);
        d3.select("#slider-text").text(newRange.begin + " - " + newRange.end);
        rangeBegin = newRange.begin
        rangeEnd = newRange.end
        updateMap(rangeBegin, rangeEnd);
    }
});