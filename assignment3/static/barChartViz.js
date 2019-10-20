var group = "All";

function initD3Bars(data, stateFips) {
    //var basics = d3BarChartBase();
    var margin = {top: 30, right: 5, bottom: 20, left: 50};
    var width = Math.round(Number(d3.select("#barChart").style('width').slice(0, -2))) - margin.left - margin.right;
    var height = Math.round(Number(d3.select("#barChart").style('height').slice(0, -2))) - margin.top - margin.bottom;
    var colorBar = d3.scaleOrdinal(d3.schemeCategory10);
    var barPadding = 1;
    var misc = {yLabel: 7, xLabelH: 5, title: 11};

    var xScale = d3.scaleBand()
            .domain(data.map(d=> d.year))
            .range([0, width])
            .paddingInner(0.1);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) {return d.value;})])
                   .range([height, 0]);

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
       .text("Number of instances per year for " + stateFips2Names[parseInt(stateFips)]);

    var plot = svg.append("g")
                  .attr("transform", "translate(" + margin.left + "," + (margin.top + misc.yLabel) + ")");

    plot.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {return xScale(d.year);})
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) {return yScale(d.value);})
        .attr("height", function(d) {return height-yScale(d.value);})
        .attr("fill", "#123456");

    plot.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {return d.value;})
        .attr("text-anchor", "middle")
        .attr("x", function(d,i) {return (i*(width/data.length) + ((width/data.length - barPadding)/2));})
        .attr("y", function(d) {return (yScale(d.value) - misc.yLabel);})
        .attr("class", "yAxis");

    // add xlabels to chart
    var xLabels = svg.append("g")
                     .attr("transform", "translate(" + margin.left + "," + (margin.top + height + misc.xLabelH) + ")");

    xLabels.selectAll("text.xAxis")
           .data(data)
           .enter()
           .append("text")
           .text(function(d) {return d.year;})
           .attr("text-anchor", "middle")
           .attr("x", function(d,i) {return (i * (width/data.length) + ((width/data.length - barPadding)/2));})
           .attr("y", 15)
           .attr("class", "xAxis")
           .selectAll("text")
           .attr("transform", "rotate(-90)");
}

function updateD3Bars(d, i) {
  console.log("update bars for state with fips", d.id);
      d3.json("/getBars", {
        method: "POST",
        body: JSON.stringify({
            stateFips: d.id
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
      .then(function(data) {
        console.log(data);
        initD3Bars(data, d.id);
      });
}