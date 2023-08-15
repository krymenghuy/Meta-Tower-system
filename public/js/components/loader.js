// Create a loading animation element
var loadingAnimation = document.createElement('div');
let html = `<div class="loader">
<div class="hexagon" aria-label="Animated hexagonal ripples">
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
        <div class="hexagon__group">
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
            <div class="hexagon__sector"></div>
        </div>
    </div>
    <p aria-label="Loading">Loading</p>
    </div>`;

document.querySelector("#vs_loading").innerHTML = html;
document.body.style.display = 'block';
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("#vs_loading").innerHTML = html;
    } else {
        document.querySelector("#vs_loading").innerHTML = null;
    }
};

// document.body.style.display='none';
// loadingAnimation.innerHTML = html;

// // Append the loading animation element to the body
// document.body.appendChild(loadingAnimation);
// // Hide the loading animation when the DOM is loaded
// window.onload = function() { 
//   document.body.style.display='block';
//   loadingAnimation.remove();
// };

