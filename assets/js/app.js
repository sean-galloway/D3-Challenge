////////////////////////////////////////////////////////////////////////////////////////
// Set width and height parameters to be used in the canvas
var svgWidth = 900;
var svgHeight = 600;

// Set svg margins
var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

////////////////////////////////////////////////////////////////////////////////////////
// Create the width and height based svg margins and parameters to fit chart group within the canvas
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the canvas to append the SVG group that contains the states data
// Give the canvas width and height calling the variables predefined.
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

// Create the chartGroup that will contain the data
// Use transform attribute to fit it within the canvas
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scales
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axes
var xAxisCall = d3.axisBottom(x)
var xAxis = chartGroup.append("g").attr("class", "x-axis").attr("transform", "translate(" + 0 + "," + height + ")");

var yAxisCall = d3.axisLeft(y)
var yAxis = chartGroup.append("g").attr("class", "y-axis");

////////////////////////////////////////////////////////////////////////////////////////
// Global Options
var optionListX = ["poverty", "age", "income"];
var optionX = 0;
var optionListY = ["healthcare", "smokes", "obesity"]
var optionY = 0;
var healthData = [];

////////////////////////////////////////////////////////////////////////////////////////
// Labels
var xAxisLabels = [];
xAxisLabels.push(xAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .attr("y", -46)
            .text("In Poverty (%)"));
xAxisLabels.push(xAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .attr("y", -26)
            .text("Age (Median)"));
xAxisLabels.push(xAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .attr("y", -6)
            .text("Household Income (Median)"));

var yAxisLabels = [];
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 60)
            .text("Lacks Healthcare (%)"));
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 40)
            .text("Smokes (%)"));
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 20)
            .text("Obese (%)"));

////////////////////////////////////////////////////////////////////////////////////////
// Function to update the chart
function updateChart() {
    // Standard transition for our visualization
    var t = d3.transition().duration(750);

    // Update our scales
    x.domain([d3.min(healthData, function(d){ return d[xAxisLabels[optionX]]; }) / 1.05,
        d3.max(data, function(d){ return d[xAxisLabels[optionX]]; }) * 1.05])
    y.domain([d3.min(healthData, function(d){ return d[yAxisLabels[optionY]]; }) / 1.05,
        d3.max(data, function(d){ return d[yAxisLabels[optionY]]; }) * 1.05])

    // Update our axes
    xAxis.transition(t).call(xAxisCall);
    yAxis.transition(t).call(yAxisCall);

    // Update our circles
    var circles = chartGroup.selectAll("circle")
        .data(healthData);

    circles.exit().transition(t)
        .attr("fill-opacity", 0.1)
        .attr("cy", y(0))
        .remove()

    circles.transition(t)
        .attr("cx", function(d){ return x(d[xAxisLabels[optionX]]) })
        .attr("cy", function(d){ return y(d[yAxisLabels[optionY]]) })

    circles.enter().append("circle").transition(t)
        .attr("cx", function(d){ return x(d[xAxisLabels[optionX]]) })
        .attr("cy", y(0))
        .attr("r", 14)
        .classed("stateCircle", true)
        .attr("fill-opacity", 0.1)
        .transition(t)
        .attr("fill-opacity", 1)
        .attr("cy", function(d){ return y(d[yAxisLabels[optionY]]) });

}

////////////////////////////////////////////////////////////////////////////////////////
// Import Data
var file = "assets/data/data.csv"

// Function is called and passes csv data
d3.csv(file).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objects
// If error exist it will be only visible in console
function errorHandle(error) {
    throw err;
}

// Function takes in argument statesData
function successHandle(data) {

    // Assign the local data to the global healthData
    healthData = data;

    // Cast the value to a number for each piece of healthData
    healthData.map(function (element) {
        element.poverty = +element.poverty;
        element.age = +element.age;
        element.income = +element.income;
        element.healthcare = +element.healthcare;
        element.smokes = +element.smokes;
        element.obesity = +element.obesity;
    });

    updateChart();
};
