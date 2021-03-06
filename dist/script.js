colorScale = d3.scaleOrdinal(d3.schemeCategory10);
format = d3.format(",d");
height = 600;
width = 900;

treemap = data => d3.treemap()
//.tile(tile)
.size([width, height]).
padding(1).
round(true)(
d3.hierarchy(data).
sum(d => d.value).
sort((a, b) => b.value - a.value));

document.addEventListener('DOMContentLoaded', d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json").
then(data => {
  const root = treemap(data);

  // select the svg //
  const svg = d3.select("svg").
  attr("viewBox", [0, 0, width, height]).
  style("font", "10px sans-serif");

  // create the leaves //
  const leaf = svg.selectAll("g").
  data(root.leaves()).
  join("g").
  attr("transform", d => `translate(${d.x0},${d.y0})`);


  // Define body
  const main = d3.select(".main");

  // Define the div for the tooltip
  const tooltip = main.append("div").
  attr("class", "tooltip").
  attr("id", "tooltip").
  style("opacity", 0);

  // apend the rectangles //
  leaf.append("rect").
  attr("class", "tile").
  attr("data-name", d => d.data.name).
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  attr("id", d => "id").
  attr("fill", d => {while (d.depth > 1)
    d = d.parent;
    return colorScale(d.data.name);
  }).
  attr("fill-opacity", 0.6).
  attr("width", d => d.x1 - d.x0).
  attr("height", d => d.y1 - d.y0).
  on('mouseover', d => {
    tooltip.transition().
    duration(200).
    style('opacity', .9);
    tooltip.html(
    'Name: ' + d.data.name +
    '<br>Category: ' + d.data.category +
    '<br>Value: ' + d.data.value).

    attr("data-value", d.data.value).
    style("left", d3.event.pageX + 10 + "px").
    style("top", d3.event.pageY - 28 + "px");

  }).
  on('mouseout', () => {
    tooltip.transition().
    duration(200).
    style('opacity', 0);
  });



  leaf.append("clipPath").
  attr("id", d => "clip path id").
  append("use");

  leaf.append("text").
  attr("clip-path", d => d.clipUid).
  selectAll("tspan").
  data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))).
  join("tspan").
  attr("x", 3).
  attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`).
  attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null).
  text(d => d);



  // legend //
  const legend = d3.select(".main").
  append("svg");

  legendValues = colorScale.domain().map(c => c);

  const x = d3.scaleOrdinal()
  //.domain([0, 100])
  .range([0, 300]);

  legend.attr("id", "legend").
  attr("transform", "translate(0,0)").
  selectAll("rect").
  data(legendValues).
  enter().
  append("rect").
  attr("class", "legend-item").
  attr("x", (d, i) => i >= 6 ? i >= 12 ? 200 : 100 : 0).
  attr("y", (d, i) => i >= 6 ? i >= 12 ? i % 12 * 20 : i % 6 * 20 : i * 20).
  attr("width", d => 20).
  attr("height", d => 20).
  attr("fill", d => colorScale(d));


  legend.selectAll("text").
  data(legendValues).
  enter().
  append("text").
  text(d => d).
  attr("x", (d, i) => i >= 6 ? i >= 12 ? 200 + 25 : 100 + 25 : 0 + 25).
  attr("y", (d, i) => i >= 6 ? i >= 12 ? i % 12 * 20 + 15 : i % 6 * 20 + 15 : i * 20 + 15);






}));