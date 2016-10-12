library(XML)
library(RCurl)

##########################
#     Download Files     #
##########################
# only for windows
# signatures <- system.file("CurlSSL", cainfo="cacert.pem", package="RCurl")

#### Get the last page Number

# MAC
lastpage <- unlist(xpathSApply(htmlParse( getURL(paste0("https://www.ptt.cc/bbs/Food/index.html"))),  "//div[@class='btn-group btn-group-paging']/a",xmlGetAttr, "href"))[[2]]
# windows
# lastpage <- unlist(xpathSApply(htmlParse( getURL(paste0("https://www.ptt.cc/bbs/CVS/index.html", cainfo = signatures))),  "//div[@class='btn-group btn-group-paging']/a",xmlGetAttr, "href"))[[2]]
lastpage <- gsub(".*index", "", lastpage)
lastpage <- as.numeric(gsub("[.]*html", "", lastpage))+1


#### Get link form each pages
link.Food <- NULL
for( i in (lastpage-99):lastpage){ # 先抓最新的100篇
  url <- paste0("https://www.ptt.cc/bbs/Food/index", i, ".html")
  html <- htmlParse(getURL(url))
  url.list <- xpathSApply(html, "//div[@class='title']/a[@href]", xmlAttrs)
  link.Food <- c(link.Food, paste('https://www.ptt.cc', url.list, sep=''))
  print(paste("Get url from the billboard's(Food) page :", i))
}


#### Write a function to save documents
getdoc <- function(link, path){
  doc <- xpathSApply(htmlParse(getURL(link), encoding="UTF-8"), "//div[@id='main-content']", xmlValue)
  name <- strsplit(link, '/')[[1]][6]
  write(doc, file=file.path(path,gsub('html', 'txt', name)))  
}

#### Set the path where you want to save documents
system.time(sapply(1:100, function(i) getdoc(link.Food[i], path="~/Desktop/Food/")))

# system.time(sapply(1:length(link.CVS), function(i) getdoc(link.CVS[i], path="~/Desktop/CVS document/")))


##########################
#       Read Files       #
##########################
library(tmcn)      # require tm 0.5-10 version

#### Put the documents' directory
d.corpus <- Corpus(DirSource("~/Desktop/Food/"), list(language = NA))


##########################
#    Text Processing     #
##########################
library(NLP)
library(tmcn)
library(Rwordseg)

#### Remove Punctuation and Numbers from corpus
d.corpus <- tm_map(d.corpus, removePunctuation)
d.corpus <- tm_map(d.corpus, removeNumbers)

#### Using Rwordseg or jiebaR package to break down Chines. Here, we using Rwordseg
d.corpus <-  sapply(1:length(d.corpus), function(u) { 
  segmentCN(as.String(unlist(d.corpus[u])), nosymbol=F)})

Sentence <- sapply(1:length(d.corpus), function(u) paste(d.corpus[[u]], collapse=" "))

d.corpus <- Corpus(VectorSource(d.corpus))

#### Set the stopwords and rmove them
myStopWords <- c(toTrad(stopwordsCN()), stopwords("english"), "編輯", "時間", "標題", "發信", "實業", "作者")
d.corpus <- tm_map(d.corpus, removeWords, myStopWords)

#### Building bag of words model(TF-IDF)

tdm <- TermDocumentMatrix(d.corpus, 
                          control = list(wordLengths = c(2, Inf),
                                         weighting =function(x) 
                                           weightTfIdf(x, normalize = FALSE)))
tdm

#### Get the Freq
findFreqTerms(tdm, lowfreq = 100)

#### Find association terms
findAssocs(tdm, "蛋黃", 0.9)

#### Wordcloud
library(wordcloud)
m <- as.matrix(tdm)
v <- sort(rowSums(m), decreasing = TRUE)
d <- data.frame(word = names(v), freq = v)

par(family = "STKaiti") ## only for Mac OS
wordcloud(d$word, d$freq, min.freq = 50, random.order = F, ordered.colors = F, 
          colors = rainbow(length(row.names(m))))

#### you can using rWordCloud package for D3 wordcloud
library(rWordCloud)
d3Cloud(text = d$word, size = d$freq)


##########################
#       Collocations     #
##########################
# devtools::install_github("kbenoit/quanteda")
library(quanteda)
library(data.table)

# source("collocation2.R")
# Windows 版請打開collocation2_Win.R後全選執行

C_words<- collocations2(unlist(Sentence), method = "all")

C_words <- C_words[C_words$pmi>3,]

C_words <- paste0(C_words$word1, C_words$word2)
C_words

#### you can using following code to insert words to directory
# insertWords(toTrad(words, rev = T))

##########################
#     Text Clustering    #
##########################
tdm_corpus <- removeSparseTerms(tdm, sparse=0.7)
dist_tdm_corpus <- dist(as.matrix(tdm_corpus))
fit <- hclust(dist_tdm_corpus, method="ward")
par(family = "STKaiti") ## only for Mac OS
plot(fit)

