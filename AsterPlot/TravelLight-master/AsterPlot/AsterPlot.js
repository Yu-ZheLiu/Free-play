var width = parseInt(d3.select(".AsterPlot").style("width"), 10),
    height = 400,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score /12000.0) + innerRadius; 
  })

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius)

var svg = d3.select(".AsterPlot").append("svg")
    .attr("width", width)
    .attr("height", height)
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
      //.on('mouseover', tip.show)
      //.on('mouseover', tip.show)
      //.on('mouseout', tip.hide)
      .on('click', function(d,i) {
        if(d.data.label == "其他美食" )
        {otherFood();}
        if(d.data.label == "日式料理")
        {JapanFood();}
        if(d.data.label =="素食")
        {VegFood();}
        if(d.data.label =="甜食")
        {sweetFood();}
        if(d.data.label =="異國料理")
        {DifFood();}
        if(d.data.label =="中式料理")
        {ChineseFood();}
      });

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);
 
  function wordwrap(text) {
  var lines=text.split(" ")
    return lines
  }
  var text = arc.append("svg:text")
      .attr("transform", function(d) {
          d.outerRadius = outerRadius + 75;
          d.innerRadius = outerRadius + 70;
           return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "black")
      .style("font", "bold 12px Arial")
      .each(function (d, i) {
        var lines = wordwrap(dataSet[i].legendLabel)
        for (var i = 0; i < lines.length; i++) {
          d3.select(this).append("tspan")
            .attr("dy",13)
            .attr("x",function(d) { 
              return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>"; })
              .text(lines[i])
        }
      })


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