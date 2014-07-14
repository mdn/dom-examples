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

function imgLoad(imgJSON) {
// return a promise for an image loading
return new Promise(function(resolve, reject) {	  
  var request = new XMLHttpRequest();
  request.open('GET', imgJSON.url);
  request.responseType = 'blob';
  
  request.onload = function() {
	    if (request.status == 200) {
	      var arrayResponse = [];
	      arrayResponse[0] = request.response;
	      arrayResponse[1] = imgJSON;
	      resolve(arrayResponse);
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
  for(i = 0; i<=Gallery.images.length-1; i++) {
    imgLoad(Gallery.images[0]).then(function(response) {
      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');
      var imageURL = window.URL.createObjectURL(response[0]);

	  myImage.src = imageURL;
      myImage.setAttribute('alt', response[1].alt);
      myCaption.innerHTML = response[1].name + ': Taken by ' + response[1].credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

	}, function(Error) {
	  console.log(Error);
	});
  };
};