function wordcloud(){
  d3.csv("./Food.csv", function(data) {
  console.log(data);

  d3.wordcloud()
  .size([800, 400])
  .selector('#wordcloud')
  .words(data)
  .start();
  });
}