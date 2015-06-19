function draw() {
    "use strict";
    var margin = {top: 40, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var center_x = (width + margin.left + margin.right)/2;
    var center_y = (height + margin.top + margin.bottom)/2;
    var main_radius = 200;
    var default_duration = 300;
    var long_duration = default_duration*2;
    var fade_duration = 500;
    var font = 'Lato';
    var orbital_font = 'Lato';
    var orbital_font_size = 18;
    var title_font_size = 24;

    // strings
    var back_text = '<';

    // orbit properties
    var orbit_radius = 50;
    var rotation_radius = 180;
    var num_circles = 3;
    var category_text = ['BY CLASS?', 'BY SEX?', 'BY AGE?'];
    var id_to_category_map = {'class-orbit':'BY CLASS?', 'sex-orbit':'BY SEX?', 'age-orbit':'BY AGE?'};
    var identifiers = ['class-orbit', 'sex-orbit', 'age-orbit'];
    var x_move_offscreen = {'class-orbit':0, 'sex-orbit':1000, 'age-orbit':-1000};
    var y_move_offscreen = {'class-orbit':-1000, 'sex-orbit':1000, 'age-orbit':1000};
    var x_orbit_original = {};
    var y_orbit_original = {};
    var circles = [];
    var radians_in_circle = 2*Math.PI;

    // orbit displaying on chart 
    var orbit_radius_chart = 10;

    // where the clicked circle will sit
    var back_circle_x = width * (7.0/8.0);
    var back_circle_y = 0 + (margin.top/2);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
          .attr('fill', '#FF9E2E')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .transition()
          .duration(1000)
          .attr('r', orbit_radius);

        new_group.append('text')
          .attr('class', 'orbital-circle-text')
          .attr('x', 0)
          .attr('y', orbital_font_size/2)
          .attr('font-size', '0px')
          .attr('fill', 'white')
          .transition()
          .duration(1000)
          .attr('font-family', font)
          .attr('font-size', orbital_font_size + 'px')
          .attr('fill', 'black')
          .style('text-anchor', 'middle')
          .text(category_text[i]);

        // store the original location of this orbit to use later
        x_orbit_original[identifiers[i]] = center_x + new_x;
        y_orbit_original[identifiers[i]] = center_y + new_y;

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
          .call(setClickedOrbitScatterOnClickEvent);

      }

      window.setTimeout(setOrbitMouseEvents, 800);
    }

    function setClickedOrbitScatterOnClickEvent(clicked_orbit) {
      clicked_orbit.on('click', function() {
        var clicked_orbit = d3.select(this);
        var clicked_id = clicked_orbit.attr('id');

        clicked_orbit.transition()
          .duration(long_duration)
          .attr('transform', 'translate(' + back_circle_x + ',' + back_circle_y + ')')
          .each('end', disable_mouse_events);

        clicked_orbit.select('circle.orbital-circle') 
          .transition()
          .duration(default_duration)
          .attr('r', orbit_radius_chart);

        clicked_orbit.select('text.orbital-circle-text')
          .transition()
          .duration(default_duration)
          .text(back_text);

        setClickedOrbitReturnOnClickEvent(clicked_orbit);

        for (var i = 0; i < identifiers.length; i++) {
          if (!(clicked_id == identifiers[i])) {
            var other_orbit = d3.select('g#' + identifiers[i]);
            var current_x = other_orbit.node().getBBox().x;
            var current_y = other_orbit.node().getBBox().y;
            other_orbit.transition()
              .duration(default_duration)
              .attr('transform', 'translate(' + (center_x + current_x + x_move_offscreen[identifiers[i]]) + ',' + (center_y + current_y + y_move_offscreen[identifiers[i]]) + ')')
              .each('end', disable_mouse_events);
          }
        }
      });
    }

    // sets event on clicked orbit to return it and all other orbits to their
    // original locations at the beginning of the visualization
    function setClickedOrbitReturnOnClickEvent(clicked_orbit) {
      clicked_orbit.on('click', function() {
        var clicked_orbit = d3.select(this);

        // for each of the orbits, return them to their original location
        for (var i = 0; i < identifiers.length; i++) {
          var current_orbit_id = identifiers[i];
          var current_orbit = d3.select('g#' + current_orbit_id);
          current_orbit.transition()
            .duration(default_duration)
            .attr('transform', 'translate(' + x_orbit_original[current_orbit_id] + ',' + (y_orbit_original[current_orbit_id]) + ')')
            .each('end', disable_mouse_events);
        }

        var clicked_orbit_id = clicked_orbit.attr('id');

        clicked_orbit.select('text.orbital-circle-text')
          .transition()
          .duration(default_duration)
          .text(id_to_category_map[clicked_orbit_id]);

        clicked_orbit.select('circle.orbital-circle') 
          .transition()
          .duration(default_duration)
          .attr('r', orbit_radius);

        setClickedOrbitScatterOnClickEvent(clicked_orbit);
        
      });
    }

    function polarToCartesianCoordinates(r, theta) {
      var cartesian_coordinates = [];
      var x = r*Math.cos(theta);
      var y = r*Math.sin(theta);
      cartesian_coordinates['x'] = x;
      cartesian_coordinates['y'] = y;
      return cartesian_coordinates;
    }

    function show_sex_chart() {

    }

    function disable_mouse_events() {
      d3.select(this).attr("pointer-events", null);
    }
  
};
