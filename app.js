// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw-test/sw.js', {
    scope: '/*'
  }).then(function() {
    // registration worked
    console.log('Registration succeeded.');
  }).catch(function() {
    // registration failed
    console.log('Registration failed.');
  });
}

// function for loading each image via XHR

function imgLoad(url) {
// return a promise for an image loading
return new Promise(function(resolve, reject) {	  
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'blob';
  
  request.onload = function() {
	    if (request.status == 200) {
	      resolve(request.response);
	    } else {
	      reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
	    }
  };

    request.onerror = function() {
      reject(Error('There was a network error.'));
  };
  
  // Send the request
  request.send();
  });
};

// load each set of image, alt text and caption

var imgSection = document.querySelector('section');

window.onload = function() {
  var imgJSON = Gallery.images[i];
  for(i = 0; i<=imgJSON.length-1; i++) {
    imgLoad(imgJSON.url).then(function(response) {

      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');

      var imageURL = window.URL.createObjectURL(response);
	  myImage.src = imageURL;
      myImage.setAttribute('alt', imgJSON.alt);
      myCaption.innerHTML = imgJSON.name + ': Taken by ' + imgJSON.credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

	}, function(Error) {
	  console.log(Error);
	});
  };
};