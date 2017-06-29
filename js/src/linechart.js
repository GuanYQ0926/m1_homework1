import d3 from 'd3';


function pad(d){
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function processData(raw_data_target, year, month){
    let data = [];
    for(let d=0; d<raw_data_target.length; d++){
        for(let h=0; h<raw_data_target[0].length; h++){
            const temp_date = year.toString() + pad(month) + pad(d+1)+pad(h+1);
            const temp_dict = {'date': temp_date, 'target':raw_data_target[d][h]};
            data.push(temp_dict);
        }
    }
    return data;
}

export const drawLineChart = (raw_data_target, year, month) => {

    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        margin2 = {top: 300, right: 10, bottom: 20, left: 40},
        width = window.innerWidth - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom,
        height2 = 360 - margin2.top - margin2.bottom;

    var color = d3.scale.ordinal()
            .range(['#4682b4']);//d3.scale.category10();

    var parseDate = d3.time.format('%Y%m%d%H').parse;

    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
        xAxis2 = d3.svg.axis().scale(x2).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');

    var brush = d3.svg.brush()
        .x(x2)
        .on('brush', brush);

    var line = d3.svg.line()
        .defined(function(d) { return !isNaN(d.rain); })
        .interpolate('cubic')
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rain); });

    var line2 = d3.svg.line()
        .defined(function(d) { return !isNaN(d.rain); })
        .interpolate('cubic')
        .x(function(d) {return x2(d.date); })
        .y(function(d) {return y2(d.rain); });

    var svg = d3.select('#linechart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    svg.append('defs').append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);

    var focus = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var context = svg.append('g')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');


    const data = processData(raw_data_target, year, month);

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'date'; }));

    data.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    var sources = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {date: d.date, rain: +d[name]};
            })
        };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([d3.min(sources, function(c) { return d3.min(c.values, function(v) { return v.rain; }); }),
        d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.rain; }); }) ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    var focuslineGroups = focus.selectAll('g')
        .data(sources)
      .enter().append('g');

    var focuslines = focuslineGroups.append('path')
        .attr('class','line')
        .attr('d', function(d) { return line(d.values); })
        .style('stroke', function(d) {return color(d.name);})
        .attr('clip-path', 'url(#clip)');

    focus.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    focus.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    focus.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Precipitation (mm)');


    var contextlineGroups = context.selectAll('g')
        .data(sources)
      .enter().append('g');

    var contextLines = contextlineGroups.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line2(d.values); })
        .style('stroke', function(d) {return color(d.name);})
        .attr('clip-path', 'url(#clip)');

    context.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis2);

    context.append('g')
        .attr('class', 'x brush')
        .call(brush)
      .selectAll('rect')
        .attr('y', -6)
        .attr('height', height2 + 7);



    function brush() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.selectAll('path.line').attr('d',  function(d) {return line(d.values);});
        focus.select('.x.axis').call(xAxis);
        focus.select('.y.axis').call(yAxis);
    }

};
