"use strict";

var HomeComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Welcome To Yeav Pheng Association";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_home_component");
    mThis.slideContainer = mThis.self.querySelector('#slideContainer');
    mThis.boxGraveMap = mThis.self.querySelector('#boxGraveMap');
   this.init = () => {
        if(mThis.initAlready) return;
        
        mThis.initAlready = true;
    }
    this.renderSlide = () => {
    let html = '';
    html = [`
        <div class="slides">
        <img src="${main_view.asset_url}/images/yavpheng/History001.jpg" class="active">
        <img src="${main_view.asset_url}/images/yavpheng/History002.jpg">
        <img src="${main_view.asset_url}/images/yavpheng/History003.jpg">
        <img src="${main_view.asset_url}/images/yavpheng/History004.jpg">
        <img src="${main_view.asset_url}/images/yavpheng/History005.jpg">
        <img src="${main_view.asset_url}/images/yavpheng/History006.jpg">

      </div>

      <div class="buttons">
        <span class="next">&#10095;</span>
        <span class="prev">&#10094;</span>
      </div>

      <div class="dotsContainer">
            ${[...Array(6)].map((_, i) =>
                `<div class="dot${i === 0 ? ' active' : ''}" attr="${i}"></div>`
            ).join('')}
        </div>

        `].join('');
        mThis.slideContainer.innerHTML = html;
       mThis.setupSlider();

    }
    this.renderGraveMap = () => {

    let html = '';
	html = [`
		<div class="box-map">
			<img src="${main_view.asset_url}/images/yavpheng/GraveYard_map.jpg" style="width:100%; height: 380px; object-fit: cover;">
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
						<img class="img--size" src="${main_view.asset_url}/images/yavpheng/CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
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
		</div>
	`].join('');

	this.boxGraveMap.innerHTML = html;
};

    mThis.setupSlider = () => {
		const slideImages = mThis.slideContainer.querySelectorAll('.slides img');
		const next = mThis.slideContainer.querySelector('.next');
		const prev = mThis.slideContainer.querySelector('.prev');
		const dots = mThis.slideContainer.querySelectorAll('.dot');
		const container = mThis.slideContainer;

		let counter = 0;
		let autoPlay = setInterval(slideNext, 3000);

		next.addEventListener('click', slideNext);
		prev.addEventListener('click', slidePrev);
		container.addEventListener('mouseover', () => clearInterval(autoPlay));
		container.addEventListener('mouseout', () => autoPlay = setInterval(slideNext, 3000));

		dots.forEach(dot =>
			dot.addEventListener('click', () => gotoSlide(+dot.getAttribute('attr')))
		);

		function slideNext() {
			changeSlide((counter + 1) % slideImages.length);
		}

		function slidePrev() {
			changeSlide((counter - 1 + slideImages.length) % slideImages.length);
		}

		function gotoSlide(index) {
			if (index !== counter) changeSlide(index);
		}

		function changeSlide(index) {
			slideImages[counter].classList.remove('active');
			dots[counter].classList.remove('active');
			counter = index;
			slideImages[counter].classList.add('active');
			dots[counter].classList.add('active');
		}
	};

   
mThis.loadCards = (onFinish) => {
    mThis.renderSlide();
    mThis.renderGraveMap();
    if (typeof onFinish === "function") onFinish();
};

mThis.prepareFormOptions = (data, onFinish) => {
    mThis.loadCards(onFinish);
};
    
 
mThis.show = function () {
    main_view.setContentView(mThis.self, mThis.title_prop);
    mThis.prepareFormOptions(null, () => {});
};
    return mThis;
})();




