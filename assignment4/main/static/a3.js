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

names2StateFips = {
    "Alabama": "1",
    "Alaska": "2",
    "Arizona": "4",
    "Arkansas": "5",
    "California": "6",
    "Colorado": "8",
    "Connecticut": "9",
    "Delaware": "10",
    "District of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Lousiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56"
    //"Virgin Islands": 96,
    //"American Samoa": 97,
    //"Guam": 98,
    //"Puerto Rico": 99
}

// render the time slider and init time variables
var rangeBegin = 1990;
var rangeEnd = 2000;
var stateFipGlobal = "1";

// logger stuff
var logs = [];
var loggerDate;
var bLog = false;

var sliderTimeLog = 0;
var slider = createD3RangeSlider(1950, 2019, "#slider");
slider.range(rangeBegin, rangeEnd);
d3.select("#slider-text").text(rangeBegin + " - " + rangeEnd);
slider.onChange(function(newRange) {
    if (newRange.begin != rangeBegin || newRange.end != rangeEnd) {
        //console.log(newRange);
        d3.select("#slider-text").text(newRange.begin + " - " + newRange.end);
        rangeBegin = newRange.begin
        rangeEnd = newRange.end
        updateMap(rangeBegin, rangeEnd);
        //updateD3BarsRadioSlider()
        if (bLog) {
            loggerDate = new Date();
            if (loggerDate.getTime() - sliderTimeLog >= 3000)
                logs.push("slider_" + loggerDate.getTime() + "\n");
            sliderTimeLog = loggerDate.getTime();
        }
    }
});

// init radio choice variables
var radioChoice = d3.select('input[name="dependentVariable"]:checked').node().value;
d3.selectAll(".checkbox")
  .on("change", function() {
        radioChoice = d3.select('input[name="dependentVariable"]:checked').node().value;
        updateMapRadio();
        updateD3BarsRadioSlider();
        if (bLog) {
            loggerDate = new Date();
            logs.push("radio_" + loggerDate.getTime() + "\n");
        }
});

// init visualizations
initMap();
initBarChart();

function initMap() {
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
        initD3Map(data);
    });
}

function initBarChart() {
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

function updateMap(beginYear, endYear) {
    d3.json("/getMap", {
        method: "POST",
        body: JSON.stringify({
            what: radioChoice,
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

function startLogging() {
    //console.log("Start clicked")
    bLog = true;
    loggerDate = new Date();
    logs.push("start_" + loggerDate.getTime() + "\n");
}

function stopLogging() {
    //console.log("Stop clicked")
    bLog = false;
    loggerDate = new Date();
    logs.push("stop_" + loggerDate.getTime());
    for (i=0;i<logs.length;i++) {
       console.log(logs[i]);
    }
    logs.length = 0;
}