function updateBarChart(state, colorChosen, data) {
    var basics = d3BarChartBase();
    var margin = basics.margin;
    var width = basics.width;
    var height = basics.height;
    var colorBar = basics.colorBar;
    var barPadding = basics.barPadding;
    var misc = basics.misc;

    var xScale = d3.scaleLinear()
                   .domain([0, data.length])
                   .range([0, width])

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d) {return d.value;})])
                   .range([height, 0])

    var svg = d3.select("#barChart svg");

    //Title
    svg.selectAll("text.title")
       .attr("x", (width + margin.left + margin.right)/2)
       .attr("y", misc.title)
       .attr("class", "title")
       .attr("text-anchor", "middle")
       .text("Kahan kitna hua");

    var plot = d3.select("#barChartPlot")
                 .datum(data);

    plot.selectAll("rect")
        .data(data)
        .transition()
        .duration(750)
        .attr("x", function(d,i) {return xScale(i);})
        .attr("width", width / data.length - barPadding)
        .attr("y", function(d) {return yScale(d.value);})
        .attr("height", function(d) {return height-yScale(d.value);})
        .attr("fill", colorChosen);

    plot.selectAll("text.yAxis")
        .data(data)
        .transition()
        .duration(750)
        .attr("x", function(d,i) {return (i * width/data.length + ((width/data.length - barPadding)/2));})
        .attr("y", function(d) {return yScale(d.value) - misc.yLabel;})
        .text(function(d) {return formatAsInteger(d.value);})
        .attr("class", "yAxis");
}