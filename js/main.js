function draw(geo_data) {
    "use strict";
    var margin = 75,
        width = 1400 - margin,
        height = 600 - margin;

    var center_x = (width + margin)/2;
    var center_y = (height + margin)/2;
    var main_radius = 200;
    var smaller_radius = 80;
    var default_duration = 300;
    var long_duration = default_duration*2;
    var fade_duration = 500;
    var font = 'Lato';
    var orbital_font = 'Lato';
    var title_font_size = 24;

    // orbit properties
    var rotation_radius = 200;
    var num_circles = 3;
    var category_text = ['BY CLASS?', 'BY SEX?', 'BY AGE?'];
    var identifiers = ['class-orbit', 'sex-orbit', 'age-orbit'];
    var x_move = {'class-orbit':0, 'sex-orbit':1000, 'age-orbit':-1000};
    var y_move = {'class-orbit':-1000, 'sex-orbit':1000, 'age-orbit':1000};
    var circles = [];
    var radians_in_circle = 2*Math.PI;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'screen');

    var titantic_title = [
      'WHO LIVED AND WHO DIED',
      'ON THE TITANIC SHIPWRECK?'
    ];

    var main_navigation = svg.append('g')
                             .attr('class', 'main')
                             .attr('transform', 'translate(' + center_x + ',' + center_y + ')')
                             .style('opacity', 0);

    main_navigation.append('circle')
                   .attr('r', main_radius)
                   .attr('cx', 0)
                   .attr('cy', 0)
                   .style('fill', '#38BDFF')
                   .style('stroke', 'black')
                   .style('stroke-width', 0.5);

    main_navigation.selectAll('text')
                   .data(titantic_title)
                   .enter()
                   .append('text')
                   .attr('x', 0)
                   .attr('y', function(d, i) {
                     return i*title_font_size;
                   })
                   .attr('class', 'title-text')
                   .attr('font-family', font)
                   .attr('font-size', title_font_size + 'px')
                   .attr('fill', 'black')
                   .style('text-anchor', 'middle')
                   .text(function(d){return d;});

    main_navigation.on('mouseenter', function() {
      main_navigation
        .transition()
        .duration(default_duration)
        .style('opacity', 0)
        .remove();

      main_navigation.select('circle')
        .transition()
        .duration(default_duration)
        .attr('r', 0);

      main_navigation.selectAll('text.title-text')
        .transition()
        .duration(default_duration)
        .attr('font-size', 0)
        .attr('x', 0)
        .attr('y', 0);

      explode();
    });

    window.setTimeout(function() {
      main_navigation
        .transition()
        .duration(fade_duration)
        .style('opacity', 1);
    }, fade_duration);

    function explode() {

      // form the group element for each of the circles, setting their location,
      // text, and mouse events
      for (var i = 0; i < num_circles; i++) {
        var theta = Math.PI/2 + i*(radians_in_circle/num_circles);
        var cartesian_coordinates = polarToCartesianCoordinates(rotation_radius, theta);
        var current_text = category_text[i];
        var new_x = -cartesian_coordinates['x'];
        var new_y = -cartesian_coordinates['y'];

        var new_group = svg.append('g')
          .attr('class', 'orbit')
          .attr('id', identifiers[i])
          .attr('transform', 'translate(' + center_x + ',' + center_y + ')');

        var circle = new_group.append('circle')
          .attr('class', 'orbital-circle')
          .attr('r', 0)
          .attr('cx', 0)
          .attr('cy', 0)
          .transition()
          .duration(1000)
          .attr('r', smaller_radius);

        new_group.append('text')
          .attr('class', 'orbital-circle-text')
          .attr('x', 0)
          .attr('y', title_font_size/2)
          .attr('font-size', '0px')
          .attr('fill', 'white')
          .transition()
          .duration(1000)
          .attr('font-family', font)
          .attr('font-size', title_font_size + 'px')
          .attr('fill', 'black')
          .style('text-anchor', 'middle')
          .text(category_text[i]);

        new_group.transition()
          .duration(1000)
          .attr('transform', 'translate(' + (center_x + new_x)  + ',' + (center_y + new_y) + ')');
      }

      function setOrbitMouseEvents() {
        svg.selectAll('g.orbit')
          .on('mouseover', function() {
            var orbit = d3.select(this);

            orbit.select('circle.orbital-circle')
              .transition()
              .duration(default_duration)
              .style('stroke-width', 3);

            orbit.select('text.orbital-circle-text')
              .transition()
              .duration(default_duration)
              .attr('fill', 'white');
          })
          .on('mouseout', function() {
            var orbit = d3.select(this);

            orbit.select('circle.orbital-circle')
              .transition()
              .duration(default_duration)
              .style('stroke-width', 1);

            orbit.select('text.orbital-circle-text')
              .transition()
              .duration(default_duration)
              .attr('fill', 'black');
          })
          .on('click', function() {
            var clicked_orbit = d3.select(this);
            var clicked_id = clicked_orbit.attr('id');

            clicked_orbit.transition()
              .duration(long_duration)
              .attr('transform', 'translate(' + center_x + ',' + center_y + ')')
              .transition()
              .duration(long_duration)
              .style('opacity', 0);

            for (var i = 0; i < identifiers.length; i++) {
              if (!(clicked_id == identifiers[i])) {
                var other_orbit = d3.select('g#' + identifiers[i]);
                var current_x = other_orbit.node().getBBox().x;
                var current_y = other_orbit.node().getBBox().y;
                other_orbit.transition()
                  .duration(default_duration)
                  .attr('transform', 'translate(' + (center_x + current_x + x_move[identifiers[i]]) + ',' + (center_y + current_y + y_move[identifiers[i]]) + ')');
              }

            }

          });

      }

      function pullOrbitsOffscreen() {
        // move class 
      }


      window.setTimeout(setOrbitMouseEvents, 500);
    }

    function polarToCartesianCoordinates(r, theta) {
      var cartesian_coordinates = [];
      var x = r*Math.cos(theta);
      var y = r*Math.sin(theta);
      cartesian_coordinates['x'] = x;
      cartesian_coordinates['y'] = y;
      return cartesian_coordinates;
    }
  
};
