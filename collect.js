console.log("Collection script loaded");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let start = new Date(request["start"]);
    let stop = new Date(request["stop"]);
    console.log(start);
    loadPosts(start).then(function() {
      console.log("Done scrolling");
      let posts = scrapePosts(start, stop);
      let aggregateUrls = findAggregated();
      let toSend = {posts: serializePosts(posts),
                    aggregate: Array.from(aggregateUrls),
                    start: request["start"],
                    stop: request["stop"]};
      console.log("Sending posts to event page");
      chrome.runtime.sendMessage(toSend);
    });
  });

function findAggregated() {
  let potential = document.getElementsByClassName("fcg");
  let ret = new Set();
  for (let i = 0; i < potential.length; i ++) {
    let current = potential[i];
    if (current.innerText.search("friends posted on your Timeline") >= 0) {
      let link = current.getElementsByTagName("a")[0];
      ret.add(link.href);
    }
  }
  return ret;
}

function loadPosts(startDate) {
  console.log("Loading posts");
  window.scrollTo(0,document.body.scrollHeight); 
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      var posts = document.getElementsByClassName("fbUserContent");
      var lastPost = parsePost(posts[posts.length - 1]);
      if (lastPost.time < startDate) {
        resolve(true);
      } else {
        resolve(loadPosts(startDate));
      }
    }, 2000);
  });
}
