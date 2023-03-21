// Get the video and canvas elements
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');

// Get access to the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // Set the video element to display the stream from the camera
    video.srcObject = stream;
  })
  .catch(error => {
    console.error(`Error accessing user's camera: ${error}`);
  });

// Function to take a still picture from the video stream
function takePicture() {
  // Set the canvas to be the same size as the video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current frame from the video onto the canvas
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas as a data URL
  const imageDataUrl = canvas.toDataURL();

  // Do something with the image data, like display it on the page or upload it to a server
  console.log(imageDataUrl);
}

// Add an event listener to the button to take a picture
document.querySelector('button').addEventListener('click', takePicture);