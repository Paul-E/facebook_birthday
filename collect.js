console.log("Collection script loaded");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let start = new Date(request["start"]);
    let stop = new Date(request["stop"]);
    let profile_name = location.pathname.replace(/^\/([^\/]*).*$/, '$1');
    console.log("start: " + start);
    console.log("stop: " + stop);
    loadPosts(start)
      .then(loadAggregate)
      .then(waitTime)
      .then(function() {
        console.log("Done scrolling");
        let posts = scrapePosts(start, stop);
        let toSend = {posts: serializePosts(posts),
                      start: request["start"],
                      stop: request["stop"],
                      profile_name: profile_name};
        console.log("Sending " + posts.length + " posts to event page");
        chrome.runtime.sendMessage(toSend);
    });
  });

async function loadAggregate() {
  let show_all = document.getElementsByClassName("showAll");
  while (show_all.length !== 0) {
    console.log("Loading aggregated posts.");
    let show_all_links = show_all[0].getElementsByTagName("a");
    show_all_links[0].click();
    await waitTime();
    show_all = document.getElementsByClassName("showAll");
  }
}

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
      if (lastPost.message.length === 0) {
	// There is no message, so not wall post or not loaded.
	continue;
      }
      console.log(lastPost.time);
      return lastPost.time;      
    } catch (err) {
      console.log("error parsing post: " + posts[i]);
    }
  }
  return new Date();
}

async function loadPosts(startDate) {
  while (startDate < earliestPostDate()) {
    console.log("Loading posts");
    window.scrollTo(0,document.body.scrollHeight);
    await waitTime();
  }
  console.log("Finished loading posts.")
}
