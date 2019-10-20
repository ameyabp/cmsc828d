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

stateFips2Names = {
     1: "Alabama",
     2: "Alaska",
     4: "Arizona",
     5: "Arkansas",
     6: "California",
     8: "Colorado",
     9: "Connecticut",
    10: "Delaware",
    11: "District of Columbia",
    12: "Florida",
    13: "Georgia",
    15: "Hawaii",
    16: "Idaho",
    17: "Illinois",
    18: "Indiana",
    19: "Iowa",
    20: "Kansas",
    21: "Kentucky",
    22: "Lousiana",
    23: "Maine",
    24: "Maryland",
    25: "Massachusetts",
    26: "Michigan",
    27: "Minnesota",
    28: "Mississippi",
    29: "Missouri",
    30: "Montana",
    31: "Nebraska",
    32: "Nevada",
    33: "New Hampshire",
    34: "New Jersey",
    35: "New Mexico",
    36: "New York",
    37: "North Carolina",
    38: "North Dakota",
    39: "Ohio",
    40: "Oklahoma",
    41: "Oregon",
    42: "Pennsylvania",
    44: "Rhode Island",
    45: "South Carolina",
    46: "South Dakota",
    47: "Tennessee",
    48: "Texas",
    49: "Utah",
    50: "Vermont",
    51: "Virginia",
    53: "Washington",
    54: "West Virginia",
    55: "Wisconsin",
    56: "Wyoming",
    81: "LAKE ST CLAIR",
    84: "HAWAII WATERS",
    85: "GULF OF MEXICO",
    86: "E PACIFIC",
    87: "ATLANTIC SOUTH",
    88: "ATLANTIC NORTH",
    89: "GULF OF ALASKA",
    90: "LAKE HURON",
    91: "LAKE MICHIGAN",
    92: "LAKE SUPERIOR",
    93: "ST LAWRENCE R",
    94: "LAKE ONTARIO",
    95: "LAKE ERIE",
    96: "Virgin Islands",
    97: "American Samoa",
    98: "Guam",
    99: "Puerto Rico"
}


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
        //console.log(data);
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
d3.select("#slider-text").text(1990 + " - " + 1995);
slider.onChange(function(newRange) {
    if (newRange.begin != rangeBegin || newRange.end != rangeEnd) {
        //console.log(newRange);
        d3.select("#slider-text").text(newRange.begin + " - " + newRange.end);
        rangeBegin = newRange.begin
        rangeEnd = newRange.end
        updateMap(rangeBegin, rangeEnd);
    }
});

var radioChoice = d3.select('input[name="dependentVariable"]:checked').node().value;
console.log("init radio value: " + radioChoice);
d3.selectAll(".checkbox")
  .on("change", function() {
        radioChoice = d3.select('input[name="dependentVariable"]:checked').node().value;
        console.log(radioChoice + " selected");
});