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
