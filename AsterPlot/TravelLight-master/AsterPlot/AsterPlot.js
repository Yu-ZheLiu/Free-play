var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return 1; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
  });
//以下是縮放功能
  var zoom = d3.zoom().on("zoom",function(){
    svg.attr("transform",d3.event.transform)
  });
 
//縮放功能結束

var arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score /6000.0) + innerRadius; 
  });

var outlineArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var svg = d3.select("div").append("svg")
    .attr("width", height)
    .attr("class", "solidArc")
    .attr("height", width)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    

svg.call(tip);

d3.csv('https://yu-zheliu.github.io/Free-play/AsterPlot/TravelLight-master/AsterPlot/restaurant/Restaurant.csv', function(error, data) {
  data.forEach(function(d) {
    d.score  = +d.score;
    d.label  =  d.label;
  });
  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
    var getRandomColor=function(){
        return (function(m,s,c){
        return (c ? arguments.callee(m,s,c-1) : '#') +
        s[m.floor(m.random() * 16)]
      })(Math,'0123456789abcdef',5)
    };
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", getRandomColor)
      .attr("class", "solidArc")
      .attr("stroke", "gray")
      .attr("d", arc)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  


  // calculate the weighted mean score
  var score = 
    data.reduce(function(a, b) {
      //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
      return a + (b.score ); 
    }, 0) / 
    data.reduce(function(a, b) { 
      return a ; 
    }, 0);
});