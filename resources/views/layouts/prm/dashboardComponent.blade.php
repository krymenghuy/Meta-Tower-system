<div id="_main_dashboard_component" class="mobile-padding p-3" style="display: none">
    <!-- <div class="row my-3 g-3">
      <div class="col-lg-8">
        <div class="slide-container" id="slideContainer">
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
            <div class="dot active" attr="0" onclick="switchImage(this)"></div>
            <div class="dot" attr="1" onclick="switchImage(this)"></div>
            <div class="dot" attr="2" onclick="switchImage(this)"></div>
            <div class="dot" attr="3" onclick="switchImage(this)"></div>
            <div class="dot" attr="4" onclick="switchImage(this)"></div>
            <div class="dot" attr="5" onclick="switchImage(this)"></div>
          </div>
        </div>
      </div>

      <div class="col-lg-4 d-flex flex-column gap-3">
        <div class="box-map">
          <img src="{{ asset('assets/images/yavpheng/GraveYard_map.jpg') }}" alt="Graveyard Map">
        </div>

        <div class="count-card">
          <h5 class="text-center text-white bg-dark p-2 m-0 border-bottom">
            Grave Yard Map
          </h5>
          <div class="d-flex justify-content-around text-center p-2">
            <div>
              <div class="fw-bold">Grave S</div>
              <div class="fs-5">45</div>
            </div>
            <div>
              <div class="fw-bold">Grave M</div>
              <div class="fs-5">30</div>
            </div>
            <div>
              <div class="fw-bold">Grave L</div>
              <div class="fs-5">18</div>
            </div>
          </div>
        </div>

        <div class="count-card p-2">
          <div class="bg-dark text-white d-flex align-items-center p-2 rounded">
            <div class="bg-white d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
              <img src="/assets/images/yavpheng/CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
            </div>
            <div class="flex-fill text-center">
              <span class="fw-semibold fs-5 text-white px-3 py-1 bg-secondary rounded-2 d-inline-block">
                10
              </span>
              <div class="text-white mt-2 fw-semibold">Member Count</div>
            </div>
          </div>
        </div>
      </div>

    </div> -->
</div>
<style>


.slide-map-wrapper {
	display: flex;
	gap: 20px;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: wrap;
}

.slide-container {
	position: relative;
	width: 100%;
	max-width: 1000px;
	height: 100%;
	padding-bottom:10px;
	aspect-ratio: 4 / 3;
	/* border: 3px solid #ede6d6; */
	border-radius:12px;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
	background-color: #ffffff;


}
.box-slides {
	width: 100%;
	height: 100%;
	padding: 15px;
	box-sizing: border-box;
}

.slides {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.slides img {
	position: absolute;
	inset: 0;
	width: 100%;
	height: auto;
	border-radius:6px;
	/* object-fit: cover; */
	opacity: 0;
	transition: opacity 0.5s ease;
}

.slides img.active {
	opacity: 1;
	z-index: 1;
}
.grave-map-container {
	width: 100%;
	max-width: 600px;
	height: auto;
	padding-bottom:10px;
	aspect-ratio: 4 / 3;
	/* border: 3px solid #ede6d6; */
	border-radius: 12px;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
	/* background-color: #fff; */
	background-color: #4a4724;
}
.box-map {
	width: 100%;
	height: auto;
	padding: 15px;
	box-sizing: border-box;
}

.box-map img {
	width: 100%;
	height: auto;
	border-radius: 6px;
	display: block;
}


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

.dotsContainer {
	position: absolute;
	bottom: 40px;
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

@media (max-width: 768px) {
	.slide-container,
	.box-map {
		max-width: 100%;
		aspect-ratio: 4 / 3;
	}

	.buttons span {
		font-size: 20px;
		padding: 10px;
	}

	.dotsContainer .dot {
		width: 12px;
		height: 12px;
		border-width: 2px;
	}
}
</style>