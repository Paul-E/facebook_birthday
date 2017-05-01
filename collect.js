console.log("Collection script loaded");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let start = new Date(request["start"]);
    let stop = new Date(request["stop"]);
    console.log(start);
    loadPosts(start).then(function() {
      console.log("Done scrolling");
      scrapePosts(start, stop);
    });
  });

function parsePost(post) {
  var nameElement = post.getElementsByTagName("a")[2];
  var name = nameElement.innerText;
  var profileLink = nameElement.href;
  
  var timeElement = post.getElementsByTagName("abbr")[0];
  var unixTime = timeElement.dataset.utime;
  var date = new Date(unixTime * 1000);

  var messageElement = post.getElementsByClassName("userContent")[0];
  var messageHtml = messageElement.innerHTML;

  return {senderName: name, senderProfile: profileLink,
          time: date, message: messageHtml};
}

function findAggregated() {
  let potential = document.getElementsByClassName("fcg");
  let ret = new Set();
  for (let i = 0; i < potential.length; i ++) {
    let current = potential[i];
    if (current.innerText.search("friends posted on your Timeline") >= 0) {
      console.log(current);
      let link = current.getElementsByTagName("a")[0];
      ret.add(link.href);
    }
  }
  return ret;
}

function scrapePosts(startDate, stopDate) {
  let posts = document.getElementsByClassName("fbUserContent");
  let parsed = posts.map(parsePost);
  let ret = [];
  for (let i = 0; i < parsed.length; i++) {
    let post = parsed[i];
    if (startDate <= post.time && post.time <= stopDate) {
      ret.push(post);
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

// window.scrollTo(0,document.body.scrollHeight);
// setTimeout(scrape, 2000);

