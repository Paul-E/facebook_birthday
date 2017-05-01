function getWallPosts() {
  var start = document.getElementsByName("start")[0].valueAsDate;
  var stop = document.getElementsByName("stop")[0].valueAsDate;
  // if (start > stop) {
  //   return;
  // }
  chrome.tabs.executeScript(null, {file: "util.js"});
  chrome.tabs.executeScript(null, {file: "collect.js"});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, {start: start.toJSON(),
                                         stop: stop.toJSON()});
  });
}

function addListener(element, eventName, handler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false);
  }
  else if (element.attachEvent) {
    element.attachEvent('on' + eventName, handler);
  }
  else {
    element['on' + eventName] = handler;
  }
}

function removeListener(element, eventName, handler) {
  if (element.addEventListener) {
    element.removeEventListener(eventName, handler, false);
  }
  else if (element.detachEvent) {
    element.detachEvent('on' + eventName, handler);
  }
  else {
    element['on' + eventName] = null;
  }
}

window.addEventListener("load", function() { 
  addListener(document.getElementsByName("collect")[0], "click", getWallPosts);
});

