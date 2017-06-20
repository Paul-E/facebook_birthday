var allPosts;
var aggregateReturned;
var start;
var stop;
var profile_name;

chrome.runtime.onMessage.addListener(
  function(request, sender) {
    console.log("Message on the event page received.");
    console.log(request);
    console.log(sender);
    start = request.start;
    stop = request.stop;
    profile_name = request.profile_name;
    allPosts = [];
    handleMainPosts(request);

  });

function handleMainPosts(request) {
  console.log("Deserializing " + request.posts.length + " posts");
  let tmpPosts = deserializePosts(request.posts);
  // addUniquePosts(tmpPosts);
  // console.log("Found " + allPosts.length + " unqiue posts");
  allPosts = tmpPosts;
  download();
}

function download() {
  console.log("Downloading " + allPosts.length + " posts");
  let postStr = JSON.stringify(serializePosts(allPosts));
  let downloadStr = "data:text/json;charset=utf8," + encodeURIComponent(postStr);
  let date_str = new Date().toISOString().slice(0,10);
  let filename = profile_name + "_" + date_str + ".json";
  chrome.downloads.download({url: downloadStr, filename: filename});
}

function addUniquePosts(posts) {
  for (let i = 0; i < posts.length; i++) {
    let current = posts[i];
    let include = true;
    for (let j = 0; j < allPosts.length; j++) {
      let saved = allPosts[j];
      if (current.message === saved.message &&
          current.senderName === saved.senderName &&
          current.time.getTime() === saved.time.getTime()) {
        include = false;
        break;
      }
    }
    if (include) {
      allPosts.push(current);
    }
  }
}
