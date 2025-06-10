<div id="_main_home_component" class="mt-2" style="display: none;">
<div id="_home_list" class="mt-4 ">
  <div class="slide-map-wrapper">
    <div class="slide-container">
      <div class="slides">
        <img src="{{ asset('assets/images/yavpheng/History001.jpg') }}" class="active">
        <img src="{{ asset('assets/images/yavpheng/History002.jpg') }}">
        <img src="{{ asset('assets/images/yavpheng/History003.jpg') }}">
        <img src="{{ asset('assets/images/yavpheng/History004.jpg') }}">
        <img src="{{ asset('assets/images/yavpheng/History005.jpg') }}">
        <img src="{{ asset('assets/images/yavpheng/History006.jpg') }}">
      </div>

      <div class="buttons">
        <span class="next">&#10095;</span>
        <span class="prev">&#10094;</span>
      </div>

      <div class="dotsContainer">
        <div class="dot active" attr='0' onclick="switchImage(this)"></div>
        <div class="dot" attr='1' onclick="switchImage(this)"></div>
        <div class="dot" attr='2' onclick="switchImage(this)"></div>
        <div class="dot" attr='3' onclick="switchImage(this)"></div>
        <div class="dot" attr='4' onclick="switchImage(this)"></div>
        <div class="dot" attr='5' onclick="switchImage(this)"></div>
      </div>
    </div>

    <div class="box-map">
		<h4 style="text-align: center; background-color: #f5f5f5; color:#27444a; padding: 10px; margin: 0; border-bottom: 1px solid #ddd;">
			Grave Yard Map
		</h4>
		<img src="{{ asset('assets/images/yavpheng/GraveYard_map.jpg') }}" style="width:100%; height: 380px;">
		
	</div>

  </div>
</div>

</div>

  <style>
	/* Wrapper scroll */
#_home_list {
	max-height: 700px; /* ឬក៏ height: 100vh; ប្រសិនបើចង់ scroll ចាប់ពីព្រលប់ទាំងមូល */
	overflow-y: auto;
	padding: 10px;
	box-sizing: border-box;
}

/* Keep structure layout */
.slide-map-wrapper {
	display: flex;
	gap: 20px;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: nowrap;
}

/* Slide box */
.slide-container {
	position: relative;
	width: 800px;
	height: 620px;
	border: 3px solid #ede6d6;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
}

/* Image slide section */
.slides {
	position: relative;
	width: 100%;
	height: calc(100% - 40px);
	overflow: hidden;
}

.slides img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
	transition: opacity 0.5s ease;
}

.slides img.active {
	opacity: 1;
	z-index: 1;
}

/* Map box */
.box-map {
	width: 400px;
	height: 480px;
	border: 3px solid #ede6d6;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
	overflow: hidden;
}

.box-map img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Arrow buttons */
.buttons span {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	padding: 14px;
	color: #eee;
	font-size: 24px;
	font-weight: bold;
	transition: 0.5s;
	border-radius: 3px;
	user-select: none;
	cursor: pointer;
	z-index: 2;
}

span.next {
	right: 20px;
}

span.prev {
	left: 20px;
}

span.next:hover,
span.prev:hover {
	background-color: #ede6d6;
	opacity: 0.8;
	color: #222;
}

/* Navigation dots */
.dotsContainer {
	position: absolute;
	bottom: 5px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 2;
}

.dotsContainer .dot {
	width: 15px;
	height: 15px;
	margin: 0 3px;
	border: 3px solid #bbb;
	border-radius: 50%;
	display: inline-block;
	cursor: pointer;
	transition: background-color 0.6s ease;
}

.dotsContainer .active {
	background-color: #555;
}

  </style>
  <script>
const slideImages = document.querySelectorAll('.slides img');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const dots = document.querySelectorAll('.dot');
const container = document.querySelector('.slide-container');

let counter = 0;
let autoPlay = setInterval(slideNext, 3000);

next.addEventListener('click', slideNext);
prev.addEventListener('click', slidePrev);
container.addEventListener('mouseover', () => clearInterval(autoPlay));
container.addEventListener('mouseout', () => autoPlay = setInterval(slideNext, 3000));
dots.forEach(dot => dot.addEventListener('click', () => gotoSlide(+dot.getAttribute('attr'))));

function slideNext(){
  changeSlide((counter + 1) % slideImages.length);
}
function slidePrev(){
  changeSlide((counter - 1 + slideImages.length) % slideImages.length);
}
function gotoSlide(index){
  if(index !== counter) changeSlide(index);
}
function changeSlide(index){
  slideImages[counter].classList.remove('active');
  dots[counter].classList.remove('active');
  counter = index;
  slideImages[counter].classList.add('active');
  dots[counter].classList.add('active');
}
</script>

