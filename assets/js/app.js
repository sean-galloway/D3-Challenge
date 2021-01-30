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
            .attr("y", 30)
            .text("In Poverty (%)")
            .on("click", function (d) { optionX = 0; updateChart();}));
xAxisLabels.push(xAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .attr("y", 50)
            .text("Age (Median)")
            .on("click", function (d) { optionX = 1; updateChart();}));
xAxisLabels.push(xAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "translate(" + width/2 + ", 0)")
            .attr("y", 70)
            .text("Household Income (Median)")
            .on("click", function (d) { optionX = 2; updateChart();}));

var yAxisLabels = [];
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 60)
            .text("Lacks Healthcare (%)")
            .on("click", function (d) { optionY = 0; updateChart();}));
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 40)
            .text("Smokes (%)")
            .on("click", function (d) { optionY = 1; updateChart();}));
yAxisLabels.push(yAxis.append("text")
            .attr("class", "inactive")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -margin.left + 20)
            .text("Obese (%)")
            .on("click", function (d) { optionY = 2; updateChart();}));

////////////////////////////////////////////////////////////////////////////////////////
// Function to update the chart
function updateChart() {
    // Standard transition for our visualization
    var t = d3.transition().duration(750);

    console.log(`updateChart X: ${optionX} : ${optionListX[optionX]}`);
    console.log(`updateChart Y: ${optionY} : ${optionListY[optionY]}`);

    // Update the css for the axis's that are selected
    xAxisLabels.forEach(item => item.attr("class", "inactive"));
    yAxisLabels.forEach(item => item.attr("class", "inactive"));
    xAxisLabels[optionX].attr("class", "active");
    yAxisLabels[optionY].attr("class", "active");

    // Update the scales
    x.domain([d3.min(healthData, function(d){ return d[optionListX[optionX]]; }) / 1.05,
        d3.max(healthData, function(d){ return d[optionListX[optionX]]; }) * 1.05])
    y.domain([d3.min(healthData, function(d){ return d[optionListY[optionY]]; }) / 1.05,
        d3.max(healthData, function(d){ return d[optionListY[optionY]]; }) * 1.05])

    // Update the axes
    xAxis.transition(t).call(xAxisCall);
    yAxis.transition(t).call(yAxisCall);

    // Update the circles
    var circles = chartGroup.selectAll("circle")
        .data(healthData);

    // remove the unused circles
    circles.exit().transition(t)
        .attr("fill-opacity", 0.1)
        .attr("cy", y(0))
        .remove();

    // Update the cx/cy for the remaining circles
    circles.transition(t)
        .attr("cx", function(d){ return x(d[optionListX[optionX]]) })
        .attr("cy", function(d){ return y(d[optionListY[optionY]]) });

    // Add all of the new circles
    circles.enter().append("circle").transition(t)
        .attr("cx", function(d){ return x(d[optionListX[optionX]]) })
        .attr("cy", y(0))
        .attr("r", 14)
        .attr("class", "stateCircle")
        .attr("fill-opacity", 0.1)
        .transition(t)
        .attr("fill-opacity", 1)
        .attr("cy", function(d){ return y(d[optionListY[optionY]]) });

    // Update the text abbreviations
    var abbrevs = chartGroup.selectAll()
        .data(healthData);

    // remove the unused text
    abbrevs.exit().transition(t)
        .attr("fill-opacity", 0.1)
        .attr("cy", y(0))
        .remove()

    // Update the x/y for the remaining text
    abbrevs.transition(t)
        .attr("x", function(d){ return x(d[optionListX[optionX]]) })
        .attr("y", function(d){ return y(d[optionListY[optionY]])+4 });

    // Add all of the new text
    abbrevs.enter().append("text").transition(t)
        .attr("x", function(d){ return x(d[optionListX[optionX]]) })
        .attr("y", y(0))
        .attr("class", "stateText")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .attr("fill-opacity", 0.1)
        .text(d => d.abbr)
        .transition(t)
        .attr("fill-opacity", 1)
        .attr("y", function(d){ return y(d[optionListY[optionY]])+4 });

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
