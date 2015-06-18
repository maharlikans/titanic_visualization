var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .3);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#38BDFF", "#FF9E2E"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/train.csv", function(error, data) {  
  // shape data into desired form 
  var titanic_data = {};
  var total = 0,
      female = 0,
      male = 0,
      total_survivors = 0,
      female_survivors = 0,
      male_survivors = 0;

  data.forEach(count_data);

  function count_data(d) {
    total += 1;

    if (d.Survived == 1) {
      total_survivors++;
    }

    if (d.Sex == 'female') {
      female++;
      if (d.Survived == 1) {
        female_survivors++;
      }
    } else {
      male++;
      if (d.Survived == 1) {
        male_survivors++;
      }
    }
  }

  titanic_data = {
    total: total,
    female: female,
    male: male,
    total_survivors: total_survivors,
    female_survivors: female_survivors,
    male_survivors: male_survivors
  };

  male_titanic_data = {
    sex: 'male',
    data: [
      // TODO begin here, restructure this so that the error disappears from
      {name: 'survivors', value: male_survivors},
      {name: 'deaths', value: (male - male_survivors)}
    ]
  };

  female_titanic_data = {
    sex: 'female',
    data: [
      {name: 'survivors', value: female_survivors},
      {name: 'deaths', value: (female - female_survivors)}
    ]
  };

  titanic_total = [
    male_titanic_data,
    female_titanic_data
  ];

  x0.domain(['male', 'female']);
  x1.domain(['survivors', 'deaths']).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(titanic_total, function(d) { return d3.max(d.data, function(e) { return e.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Count");

  var sex = svg.selectAll(".sex")
      .data(titanic_total)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.sex) + ",0)"; });

  sex.selectAll("rect")
      .data(function(d) { return d.data; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .style("fill", function(d) { return color(d.name); })
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", function(d) { console.log(y(d.value)); return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  var legend = svg.selectAll(".legend")
      .data(['survivors', 'deaths'].slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  svg.append("text")
      .attr("x", ((width)/ 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .attr("class", "title")
      .style("font-size", "16px") 
      .text("Deaths on the Titanic Disaster by Sex");
});
