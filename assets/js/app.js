////////////////////////////////////////////////////////////////////////////////////////
// Set width and height parameters to be used in the canvas
////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////
var optionListX = ["poverty", "age", "income"];
var optionX = 0;
var optionListY = ["healthcare", "smokes", "obesity"]
var optionY = 0;
var healthData = [];
var optionListXTitle = ["Poverty", "Age", "Income"];
var optionListYTitle = ["Health Care", "Smokes", "Obesity"];
var circleRadius = 14;
var abbrFontSize = "14px";
var abbrYoffset = 4;

////////////////////////////////////////////////////////////////////////////////////////
// Labels
////////////////////////////////////////////////////////////////////////////////////////
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
            .text("Lacks Health Care (%)")
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

let chartTitles = [
                    ["Poverty versus Lacks Health Care", "Poverty versus Smokes", "Poverty versus Obesity"],
                    ["Age versus Lacks Health Care", "Age versus Smokes", "Age versus Obesity"],
                    ["Household Income versus Lacks Health Care", "Household Income versus Smokes", "Household Income versus Obesity"]
                ];
let chartCommentary = [
                        ["There is a correlation between Poverty and Health care. As Poverty increases, one is more likely to Lack Health Care",
                            "There is a correlation between Poverty and Smoking. As Poverty increases, one is more likely to Smoke",
                            "There is a correlation between Poverty and Obesity. As Poverty increases, one is more likely to be Obese"],
                        ["There is a correlation between Age and Health Care. As Age decreases, one is more likely to Lack Health Care",
                            "There is a correlation between Age and Smoking. As Age increases, one is more likely to Smoke",
                            "There is a small correlation between Age and Obesity. As Age increases, one is more likely to be Obese"],
                        ["There is a small correlation between Household Income and Lacks Health Care. As Household Income decreases, one is more likely to Lack Health Care",
                            "There is a correlation between Household Income and Smoking. As Household Income increases, one is less likely to Smoke",
                            "There is a correlation between Household Income and Obesity. As Household Income increases, one is less likely to be Obese"]
                    ];

////////////////////////////////////////////////////////////////////////////////////////
// Function to update the chart
////////////////////////////////////////////////////////////////////////////////////////
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
    var circles = chartGroup.selectAll(".stateCircle")
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
        .attr("r", circleRadius)
        .attr("class", "stateCircle")
        .attr("fill-opacity", 0.1)
        .transition(t)
        .attr("fill-opacity", 1)
        .attr("cy", function(d){ return y(d[optionListY[optionY]]) });

    // Update the text abbreviations
    var abbrevs = chartGroup.selectAll(".stateText")
        .data(healthData);

    // remove the unused text
    abbrevs.exit().transition(t)
        .attr("fill-opacity", 0.1)
        .attr("y", y(0))
        .remove()

    // Update the x/y for the remaining text
    abbrevs.transition(t)
        .attr("x", function(d){ return x(d[optionListX[optionX]]) })
        .attr("y", function(d){ return y(d[optionListY[optionY]]) + abbrYoffset});

    // Add all of the new text
    abbrevs.enter().append("text").transition(t)
        .attr("x", function(d){ return x(d[optionListX[optionX]]) })
        .attr("y", y(0))
        .attr("class", "stateText")
        .style("font-size", abbrFontSize)
        .style("text-anchor", "middle")
        .attr("fill-opacity", 0.1)
        .text(d => d.abbr)
        .transition(t)
        .attr("fill-opacity", 1)
        .attr("y", function(d){ return y(d[optionListY[optionY]]) + abbrYoffset });

    // Update the circles
    var transCircles = chartGroup.selectAll(".stateCircleTrans")
        .data(healthData);

    // Created transparent circles to go on top so tool tips aren't so flaky
    // remove the unused circles
    transCircles.exit().transition(t)
        .attr("fill-opacity", 0.0)
        .attr("cy", y(0))
        .remove();

    // Update the cx/cy for the remaining circles
    transCircles.transition(t)
        .attr("cx", function(d){ return x(d[optionListX[optionX]]) })
        .attr("cy", function(d){ return y(d[optionListY[optionY]]) });

    // Add all of the new circles
    transCircles.enter().append("circle").transition(t)
        .attr("cx", function(d){ return x(d[optionListX[optionX]]) })
        .attr("cy", y(0))
        .attr("r", circleRadius)
        .attr("class", "stateCircleTrans")
        .attr("fill-opacity", 0.0)
        .transition(t)
        .attr("fill-opacity", 0.0)
        .attr("cy", function(d){ return y(d[optionListY[optionY]]) });

    // Set up the tool tip
    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { return `<strong>${d.state}</strong><br>${optionListXTitle[optionX]}: ${d[optionListX[optionX]]}<br>${optionListYTitle[optionY]}: ${d[optionListY[optionY]]}`; });

    // Link the tool tip to the chart
    svg.call(tool_tip);

    // Set up the listeners
    transCircles
            .on("mousemove", function (d) { tool_tip.show(d, this);})
            .on("mouseover", function (d) { tool_tip.show(d, this);})
            .on("mouseout", function (d) { tool_tip.hide(d);});

    // Update the Commentary
    var myHeader = d3.select("#healthHeader");
    myHeader.text(chartTitles[optionX][optionY]);

    var myCommentary = d3.select("#healthCommentary");
    myCommentary.text(chartCommentary[optionX][optionY]);

}

////////////////////////////////////////////////////////////////////////////////////////
// Import Data
////////////////////////////////////////////////////////////////////////////////////////
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

// Reused with some modifications from: https://bl.ocks.org/HarryStevens/be559bed98d662f69e68fc8a7e0ad097
// Calculate a linear regression from the data
// Takes 5 parameters:
// (1) Your data
// (2) The column of data plotted on your x-axis
// (3) The column of data plotted on your y-axis
// (4) The minimum value of your x-axis
// (5) The minimum value of your y-axis
// Returns an object with two points, where each point is an object with an x and y coordinate
function calcLinear(data, x, y, minX, minY) {
    /////////
    //SLOPE//
    /////////

    // Let n = the number of data points
    var n = data.length;

    // Get just the points
    var pts = [];
    data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.mult = obj.x*obj.y;
        pts.push(obj);
    });

    // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
    // Let b equal the sum of all x-values times the sum of all y-values
    // Let c equal n times the sum of all squared x-values
    // Let d equal the squared sum of all x-values
    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;
    pts.forEach(function(pt){
        sum = sum + pt.mult;
        xSum = xSum + pt.x;
        ySum = ySum + pt.y;
        sumSq = sumSq + (pt.x * pt.x);
    });
    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;

    // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
    // slope = m = (a - b) / (c - d)
    var m = (a - b) / (c - d);

    /////////////
    //INTERCEPT//
    /////////////

    // Let e equal the sum of all y-values
    var e = ySum;

    // Let f equal the slope times the sum of all x-values
    var f = m * xSum;

    // Plug the values you have calculated for e and f into the following equation for the y-intercept
    // y-intercept = b = (e - f) / n
    var b = (e - f) / n;

            // Print the equation below the chart
            document.getElementsByClassName("equation")[0].innerHTML = "y = " + m + "x + " + b;
            document.getElementsByClassName("equation")[1].innerHTML = "x = ( y - " + b + " ) / " + m;

    // return an object of two points
    // each point is an object with an x and y coordinate
    return {
        ptA : {
        x: minX,
        y: m * minX + b
        },
        ptB : {
        y: minY,
        x: (minY - b) / m
        }
    }

    }