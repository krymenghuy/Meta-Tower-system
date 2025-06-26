<div id="_main_home_component" style="display: none;">
  <div class="slide-map-wrapper mt-5">
    <div class="slide-container" id="slideContainer">
      <!-- <div class="slides">
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
      </div> -->
    </div>
   <div class="d-flex box-hleft" id="boxGraveMap" style="flex-direction: column; gap: 10px;">
		<!-- <div class="box-map">
			<img src="{{ asset('assets/images/yavpheng/GraveYard_map.jpg') }}" style="width:100%; height: 380px; object-fit: cover;">
		</div>
		<div class="count-card" style="border: 3px solid #ede6d6; box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2); padding: 0; background-color: #fefefe;">
			<h5 style="text-align: center; color:#fff; background-color: #4b442b; padding: 10px; margin: 0; border-bottom: 1px solid #ddd;">
				Grave Yard Map
			</h5>
			<div style="padding: 10px; display: flex; justify-content: space-around; font-size: 14px;">
				<div style="text-align: center;">
					<div style="font-weight: bold;">Grave S</div>
					<div style="font-size: 18px;">45</div>
				</div>
				<div style="text-align: center;">
					<div style="font-weight: bold;">Grave M</div>
					<div style="font-size: 18px;">30</div>
				</div>
				<div style="text-align: center;">
					<div style="font-weight: bold;">Grave L</div>
					<div style="font-size: 18px;">18</div>
				</div>
			</div>
		</div>
		<div class="count-card" style="border: 3px solid #ede6d6; box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2); padding: 6px; background-color: #fefefe;">
			<div class="d-flex w-100 flex-column justify-content-between h-100" style="background-color: #4b442b;">
			<div class="d-flex align-items-center p-2">
				<div class="bg--icon d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background-color: #fff;">
					<img class="img--size" src="\assets\images\yavpheng\CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
				</div>
				<div class="ms-3 flex-fill text-center">
					<span class="fw-semibold fs-5 text-white px-3 py-1 border border-white shadow bg-yp-custom rounded-2 d-inline-block">
						10
					</span>
					<div class="text-white mt-3 fw-semibold">
						Member Count
					</div>
				</div>
			</div>
		</div>

		</div> -->
	</div>




  </div>

</div>

  <style>
#_main_home_component {
        display: flex;
        flex-direction: column;
        height: 630px;
        /* background-color: #fff; */
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

.slide-map-wrapper {
	display: flex;
	gap: 20px;
	justify-content: center;
	align-items: flex-start;
	flex-wrap: nowrap;
}

.slide-container {
	position: relative;
	width: 800px;
	height: 620px;
	border: 3px solid #ede6d6;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
}

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

.box-hleft {
	width: 400px;
	height: auto;
}

.box-map {
	width: 400px;
	height: auto;
	border: 3px solid #ede6d6;
	box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.2);
	flex-shrink: 0;
	overflow: hidden;
	padding: 0;
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


