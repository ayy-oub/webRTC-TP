


navigator.getUserMedia = navigator.getUserMedia 
                       || navigator.webkitGetUserMedia
  || navigator.mozGetUserMedia;

 

 
  function getsize(){  
    x=document.getElementById("in1").value;
    y=document.getElementById("in2").value;
    z=document.getElementById("in3").value;
    document.getElementById("demo").innerHTML = z;
    
    var video_con = {
      mandatory: {
       
        maxAspectRatio: z,
        },
      optional: []
    };
    navigator.mediaDevices.getUserMedia({ audio: true, video: video_con })
.then(function(stream) {
  var video = document.querySelector('video');
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
  
  
  
  }  


 
