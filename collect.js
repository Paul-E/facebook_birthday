console.log("Collection script loaded");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let start = new Date(request["start"]);
    let stop = new Date(request["stop"]);
    let profile_name = location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    console.log(start);
    loadPosts(start)
      .then(waitTime)
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

function waitTime() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function earliestPostDate() {
  var posts = document.getElementsByClassName("fbUserContent");
  for (let i = posts.length - 1; i >=0; i--) {
    try {
      let lastPost = parsePost(posts[i]);
      console.log(lastPost.time);
      return lastPost.time;      
    } catch (err) {
      console.log("error parsing post: " + posts[i]);
    }
  }
  return undefined;
}

async function loadPosts(startDate) {
  while (startDate < earliestPostDate()) {
    console.log("Loading posts");
    window.scrollTo(0,document.body.scrollHeight);
    await waitTime();
  }
}
