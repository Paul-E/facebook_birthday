var startDate;
var stopDate;
var id;
var windowReady = false;

chrome.runtime.onMessage.addListener(
  function(request, sender) {
    console.log("Got message from event page");
    startDate = new Date(request["start"]);
    stopDate = new Date(request["stop"]);
    id = request["id"];
    run();
  });

function loadPosts() {
  console.log("Loading posts");
  
  return new Promise(function(resolve, reject) {
    if (!clickShowAll()) {
      resolve(true);
    } else {
      setTimeout(function() {
        resolve(loadPosts());
      }, 1000);
    }
  });
}

function clickShowAll() {
  let more = document.getElementsByClassName("showAll")[0];
  if (typeof more !== "object") {
    return false;
  }
  let link = more.getElementsByTagName("a")[0];
  link.click();
  return true;
}

function run() {
  if (typeof startDate === "object" && windowReady)  {
    loadPosts().then(function() {
    let posts = serializePosts(scrapePosts(startDate, stopDate));
    console.log("Sending to event page");
    console.log(posts);
    chrome.runtime.sendMessage({posts: posts, id: id});
  });
  }
}



window.addEventListener('load', function() {
  windowReady = true;
  run();
});
