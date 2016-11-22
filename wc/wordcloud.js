function FOODwordcloud(){
  d3.csv("./Food.csv", function(data) {
  console.log(data);

  d3.wordcloud()
  .size([800, 400])
  .selector('#wordcloud')
  .fill(d3.scale.ordinal().range(["#884400", "#448800", "#888800", "#444400"]))
  .words(data)
  .start();
  });
}