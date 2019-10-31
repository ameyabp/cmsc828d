var margin = {top: 30, right: 50, bottom: 20, left: 200};
var width = Math.round(Number(d3.select("#barChart").style('width').slice(0, -2))) - margin.left - margin.right;
var height = Math.round(Number(d3.select("#barChart").style('height').slice(0, -2))) - margin.top - margin.bottom;
var barPadding = 1;
var misc = {yLabel: 7, xLabelH: 15, title: 20};
var color = {"instances":"#3D476A", "injuries":"#7B7D41", "deaths":"#87435A"};

function initD3Bars(data, stateFips, radioChoice, start, end) {
    if (data.length == 0) {
      //console.log(data);
      return;
    }

    var yScale = d3.scaleBand()
            .domain(data.map(d=> d.eventtype))
            .range([0, height])
            .paddingInner(0.1);

    var xScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) {return d.value;})])
                   .range([0, width]);

    // remove old svg element
    d3.select("#barChart").select("svg").remove();

    // add new svg element and barChart
    var svg = d3.select("#barChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("id", "barChartPlot");

    svg.append("text")
       .attr("x", (width+margin.left+margin.right)/2)
       .attr("y", misc.title)
       .attr("class", "title")
       .attr("text-anchor", "middle")
       .text("Number of " + radioChoice + " per event in " + stateFips2Names[parseInt(stateFips)] + " from " + start + " to " + end);

    var plot = svg.append("g")
                  .attr("transform", "translate(" + margin.left + "," + (margin.top + misc.yLabel) + ")");

    plot.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("width", function(d) {return xScale(d.value);})
        .attr("y", function(d) {return yScale(d.eventtype);})
        .attr("height", yScale.bandwidth())
        .attr("fill", color[radioChoice]);

    // value labels
    plot.selectAll("valuetext")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d.value;})
        .attr("text-anchor", "middle")
        .attr("x", function(d) {return xScale(d.value) + misc.xLabelH;})
        .attr("y", function(d, i) {return yScale(d.eventtype) + 0.2 * i + yScale.bandwidth()/2;});

    // add y labels to chart - event type
    plot.selectAll("eventtext")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d.eventtype;})
        .attr("text-anchor", "end")
        .attr("x", function(d) {return -misc.xLabelH;})
        .attr("y", function(d, i) {return yScale(d.eventtype) + 0.2 * i + yScale.bandwidth()/2;});
}

function updateD3Bars(d, i) {
  stateFipGlobal = d.id;
  //console.log("update bars for state with fips", stateFipGlobal);
      d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            stateFips: stateFipGlobal,
            radio: radioChoice,
            start: rangeBegin,
            end: rangeEnd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        //console.log(data);
        initD3Bars(data, stateFipGlobal, radioChoice, rangeBegin, rangeEnd);
      });
}

function updateD3BarsRadioSlider() {
  //console.log("update bars for state with fips", stateFipGlobal);
      d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            stateFips: stateFipGlobal,
            radio: radioChoice,
            start: rangeBegin,
            end: rangeEnd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        //console.log(data);
        initD3Bars(data, stateFipGlobal, radioChoice, rangeBegin, rangeEnd);
      });
}

function updateD3BarsDropdown(newFips) {
  stateFipGlobal = newFips;
  //console.log("update bars for state with fips", stateFipGlobal);
      d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            stateFips: stateFipGlobal,
            radio: radioChoice,
            start: rangeBegin,
            end: rangeEnd
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        //console.log(data);
        initD3Bars(data, stateFipGlobal, radioChoice, rangeBegin, rangeEnd);
      });
}