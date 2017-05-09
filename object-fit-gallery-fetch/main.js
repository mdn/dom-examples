var thumbs = document.querySelectorAll('.thumb');
var mainImg = document.querySelector('.main');

for(var i = 1; i <= thumbs.length ; i++) {
  var requestObj = 'images/pic' + i + '.jpg';
  retrieveImage(requestObj, i - 1);
}

function retrieveImage(requestObj, imageNo) {
  fetch(requestObj)
  .then(response => response.blob())
  .then(blob => displayImage(imageNo, blob));
}

function displayImage(imageNo, blob) {
  var objectURL = URL.createObjectURL(blob);
  thumbs[imageNo].setAttribute('src', objectURL);
  thumbs[imageNo].onclick = function() {
    mainImg.setAttribute('src', objectURL);
    mainImg.className = 'blowup';
    for(var i = 0; i < thumbs.length; i++) {
      thumbs[i].className = 'thumb darken';
    }
  }
}

// The XHR version follows: much more complex

// function retrieveImage(requestObj,imageNo) {
//   var request = new XMLHttpRequest();
//   request.open('GET', requestObj, true);
//   request.responseType = 'blob';
//   request.send();

//   request.onload = function() {
//     var objectURL = URL.createObjectURL(request.response);
//     thumbs[imageNo].setAttribute('src',objectURL);
//     thumbs[imageNo].onclick = function() {
//       mainImg.setAttribute('src',objectURL);
//       mainImg.className = 'blowup';
//         for(i = 0; i < thumbs.length; i++) {
//           thumbs[i].className = 'thumb darken';
//         }
//     }
//   }
// }

mainImg.onclick = function() {
  mainImg.className = 'main';
  for(var i = 0; i < thumbs.length; i++) {
    thumbs[i].className = 'thumb';
  }
}
