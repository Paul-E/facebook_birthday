console.log("Collection script loaded");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let start = new Date(request["start"]);
    let stop = new Date(request["stop"]);
    let profile_name = location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    console.log(start);
    loadPosts(start)
      .then(loadAggregate)
      .then(function() {
        console.log("Done scrolling");
        let posts = scrapePosts(start, stop);
        let toSend = {posts: serializePosts(posts),
                      start: request["start"],
                      stop: request["stop"],
                      profile_name: profile_name};
        console.log("Sending posts to event page");
        chrome.runtime.sendMessage(toSend);
    });
  });


function loadAggregate() {
  console.log("Loading aggregated posts.");
  return new Promise(function(resolve, reject) {
    let show_all = document.getElementsByClassName("showAll");
    if (show_all.length === 0) {
      resolve(true);
    }
    let show_all_links = show_all[0].getElementsByTagName("a");
    show_all_links[0].click();
    setTimeout(function() {
      resolve(loadAggregate());
    }, 2000);
  });
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
