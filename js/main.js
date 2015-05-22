function draw(geo_data) {
    "use strict";
    var margin = 75,
        width = 1400 - margin,
        height = 600 - margin;

    var center_x = (width + margin)/2;
    var center_y = (height + margin)/2;
    var main_radius = 200;
    var default_duration = 300;
    var fade_duration = 500;
    var font = 'Oswald';
    var title_font_size = 30;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'map');

    var years = [];

    for(var i = 1930; i < 2015; i += 4) {
      if(i !== 1942 && i !== 1946) {
        years.push(i);
      };
    }

    var titantic_title = [
      'Who lived and who died',
      'on the Titanic shipwreck?'
    ];

    var main_navigation = svg.append('g')
                             .attr('class', 'main')
                             .style('opacity', 0);

    main_navigation.append('circle')
                   .attr('r', main_radius)
                   .attr('cx', center_x)
                   .attr('cy', center_y)
                   .style('fill', '#38BDFF')
                   .style('stroke', 'black')
                   .style('stroke-width', 0.5);

    main_navigation.selectAll('text')
                   .data(titantic_title)
                   .enter()
                   .append('text')
                   .attr('x', center_x)
                   .attr('y', function(d, i) {
                     return center_y + i*title_font_size;
                   })
                   .attr('font-family', font)
                   .attr('font-size', title_font_size + 'px')
                   .attr('fill', 'black')
                   .style('text-anchor', 'middle')
                   .text(function(d){return d;});

    main_navigation.on('mouseover', function() {
      main_navigation
        .transition()
        .duration(default_duration)
        .style('opacity', 1);
      
      svg.select('circle')
         .transition()
         .duration(default_duration)
         .style('stroke-width', 3);
    });

    main_navigation.on('mouseout', function() {
      main_navigation
        .transition()
        .duration(default_duration)
        .style('opacity', .5);

      svg.select('circle')
         .transition()
         .duration(default_duration)
         .style('stroke-width', 1);
    });

    main_navigation.on('click', function() {
      main_navigation
         .transition()
         .duration(default_duration)
         .style('opacity', 0)
         .remove();
    });

    window.setTimeout(function() {
      main_navigation
        .transition()
        .duration(fade_duration)
        .style('opacity', .5);
    }, fade_duration);

    function explode() {
      var rotation_radius = 400;

    }
  
};
