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

function scrapePosts(startDate, stopDate) {
  let posts = document.getElementsByClassName("fbUserContent");
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
