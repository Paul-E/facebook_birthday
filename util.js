/*
 We need to turn the date in the post into a seralizable string.
*/
function serializePosts(posts) {
  let ret = [];
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let date;
      
    let newPost = {senderName: post.senderName,
                   senderProfile: post.senderProfile,
                   time: post.time.toJSON(), message: post.message};
    ret.push(newPost);
  }
  return ret;
}

function deserializePosts(posts) {
  let ret = [];
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let newPost = {senderName: post.senderName,
                   senderProfile: post.senderProfile,
                   time: new Date(post.time), message: post.message};
    ret.push(newPost);
  }
  return ret;
}


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

function filterPosts(posts) {
  var ret = [];
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    if (typeof post.getElementsByClassName("userContent")[0] !== "undefined" &&
	typeof post.getElementsByTagName("abbr")[0] !== "undefined") {
      ret.push(post);
    }
  }
  return ret;
}

function scrapePosts(startDate, stopDate) {
  let posts = filterPosts(document.getElementsByClassName("fbUserContent"));
  let ret = [];
  for (let i = 0; i < posts.length; i++) {
    let postElement = posts[i];
    let post = parsePost(postElement);
    if (startDate <= post.time && post.time <= stopDate) {
      ret.push(post);
    }
  }
  return ret;
}
