var allPosts;
var aggregateReturned;
var start;
var stop;

chrome.runtime.onMessage.addListener(
  function(request, sender) {
    console.log("Message on the event page received.");
    console.log(request);
    console.log(sender);
    if (sender.url.search("/timeline") < 0) { // This is from page
      start = request.start;
      stop = request.stop;
      allPosts = [];
      handleMainPosts(request);
    } else {
      handleAggregatedPosts(request);
    }
  });

function handleMainPosts(request) {
  let tmpPosts = deserializePosts(request.posts);
  addUniquePosts(tmpPosts);
  let aggregateUrls = request.aggregate;
  if (aggregateUrls.length === 0) {
    download();
    return;
  }
  initAggregateReturned(aggregateUrls.length);
  let ids = [];
  for (let i = 0; i < aggregateUrls.length; i++) {
    chrome.tabs.create({ url:  aggregateUrls[i]}, function(tab) {
      console.log("Opening tab");
      console.log(tab);
      chrome.tabs.executeScript(tab.id, {file: "util.js"});
      chrome.tabs.executeScript(tab.id, {file: "aggregate_collect.js"});
      ids.push(tab.id);
    });
  }
  setTimeout(function() {
  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    chrome.tabs.sendMessage(id, {start: start, stop: stop, id: i});
  }
  }, 2000);
}

function initAggregateReturned(size) {
  aggregateReturned = [];
  for (let i = 0; i < size; i++) {
    aggregateReturned.push(false);
  }
}

function handleAggregatedPosts(request) {
  console.log("Aggregate page " + request.id + " returned");
  console.log(request);
  let posts = deserializePosts(request.posts);
  addUniquePosts(posts);
  aggregateReturned[request.id] = true;
  if (aggregateReturned.every(x => x)) {
    download();
  }
}

function download() {
  let postStr = JSON.stringify(serializePosts(allPosts));
  let downloadStr = "data:text/json;charset=utf8," + encodeURIComponent(postStr);
  chrome.downloads.download({url: downloadStr, filename: "fb.json"});
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
