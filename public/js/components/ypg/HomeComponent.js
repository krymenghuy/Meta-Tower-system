"use strict";

var HomeComponent = new (function () {
	const mThis = this;
	mThis.title_prop = "Welcome To Yeav Pheng Association";
	mThis.base_url = main_view.base_url;
	mThis.self = main_view.VSAppContent.querySelector("#_main_home_component");

	mThis.init = () => {
		if (mThis.initAlready) return;
		mThis.initAlready = true;
	};

mThis.renderDashboard = (d) => {
	const div = mThis.self;
	const html = `
		<div class="row gy-3 mt-3">
			<div class="col-sm-3">
				<div class="p-4 rounded-4 shadow bg-white">
					<div class="d-flex justify-content-between align-items-center">
						<div>
							<div class="text-yp-custom" style="font-size: 14px;">
								Member Count
							</div>
							<div class="fs-1 fw-bold text-yp-custom">
								${d.members?.total ?? 0}
							</div>
							<div class="text-muted d-flex align-items-center mt-1" style="font-size: 13px;">
								<i class="bi bi-arrow-up-right-circle-fill me-1"></i>
								Increased from last month
							</div>
						</div>
						<div class="bg-yp-custom fw-bold text-white px-3 py-2 rounded-2 shadow" style="font-size: 16px;">
							<span>MC</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="p-4 rounded-4 shadow bg-white">
					<div class="d-flex justify-content-between align-items-center">
						<div>
							<div class="text-yp-custom" style="font-size: 14px;">
								Grave Small 
							</div>
							<div class="fs-1 fw-bold text-yp-custom">
								${d.graves?.small ?? 0}
							</div>
							<div class="text-muted d-flex align-items-center mt-1" style="font-size: 13px;">
								<i class="bi bi-arrow-up-right-circle-fill me-1"></i>
								Increased from last month
							</div>
						</div>
						<div class="bg-yp-custom fw-bold text-white px-3 py-2 rounded-2 shadow" style="font-size: 16px;">
							<span>S</span>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-3">
				<div class="p-4 rounded-4 shadow bg-white">
					<div class="d-flex justify-content-between align-items-center">
						<div>
							<div class="text-yp-custom" style="font-size: 14px;">
								Grave Medium 
							</div>
							<div class="fs-1 fw-bold text-yp-custom">
								${d.graves?.medium ?? 0}
							</div>
							<div class="text-muted d-flex align-items-center mt-1" style="font-size: 13px;">
								<i class="bi bi-arrow-up-right-circle-fill me-1"></i>
								Increased from last month
							</div>
						</div>
						<div class="bg-yp-custom fw-bold text-white px-3 py-2 rounded-2 shadow" style="font-size: 16px;">
							<span>M</span>
						</div>
					</div>
				</div>
			</div>
				<div class="col-sm-3">
				<div class="p-4 rounded-4 shadow bg-white">
					<div class="d-flex justify-content-between align-items-center">
						<div>
							<div class="text-yp-custom" style="font-size: 14px;">
								Grave Large 
							</div>
							<div class="fs-1 fw-bold text-yp-custom">
								${d.graves?.large ?? 0}
							</div>
							<div class="text-muted d-flex align-items-center mt-1" style="font-size: 13px;">
								<i class="bi bi-arrow-up-right-circle-fill me-1"></i>
								Increased from last month
							</div>
						</div>
						<div class="bg-yp-custom fw-bold text-white px-3 py-2 rounded-2 shadow" style="font-size: 16px;">
							<span>L</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row gy-3 mt-3">
			<div class="col-sm-12 col-lg-6">
				<div class="slide-container" id="slideContainer"></div>
			</div>
			<div class="col-sm-12 col-lg-6">
				<div class="grave-map-container" id="boxGraveMap"></div>
			</div>
		</div>
	`;

	div.innerHTML = html;

	mThis.slideContainer = div.querySelector('#slideContainer');
	mThis.boxGraveMap = div.querySelector('#boxGraveMap');

	mThis.renderSlide();
	mThis.renderGraveMap(d);

	Object.assign(div.style, {
		height: (window.innerHeight - 90) + "px",
		overflow: 'auto'
	});

	window.onresize = () => {
		Object.assign(div.style, {
			height: (window.innerHeight - 90) + "px",
			overflow: 'auto'
		});
	};
};


	mThis.renderSlide = () => {
		const html = `

			<div class="box-slides">
				<h6 class="text-left text-white mb-3">Yeav Pheng History</h6>

			<div class="slides">
				${[1,2,3,4,5,6].map((n, i) => 
					`<img src="${main_view.asset_url}/images/yavpheng/History00${n}.jpg" class="${i === 0 ? 'active' : ''}">`
				).join('')}
			</div>
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
		`;
		mThis.slideContainer.innerHTML = html;
		mThis.setupSlider();
	};

	mThis.renderGraveMap = (data = {}) => {
		const grave = data.graves || { small: 0, medium: 0, large: 0 };
		const member = data.members || { total: 0, active: 0, inactive: 0 };

		let html = `
			<div class="box-map">
				<h6 class="text-left text-white mb-3">Grave Slot Map</h6>
				<img src="${main_view.asset_url}/images/yavpheng/GraveYard_map.jpg">
			</div>
		`;
		mThis.boxGraveMap.innerHTML = html;
	};

	mThis.setupSlider = () => {
		const slides = mThis.slideContainer.querySelectorAll('.slides img');
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
		dots.forEach(dot => dot.addEventListener('click', () => gotoSlide(+dot.getAttribute('attr'))));

		function slideNext() {
			changeSlide((counter + 1) % slides.length);
		}
		function slidePrev() {
			changeSlide((counter - 1 + slides.length) % slides.length);
		}
		function gotoSlide(index) {
			if (index !== counter) changeSlide(index);
		}
		function changeSlide(index) {
			slides[counter].classList.remove('active');
			dots[counter].classList.remove('active');
			counter = index;
			slides[counter].classList.add('active');
			dots[counter].classList.add('active');
		}
	};

	mThis.loadDashBoardData = (filter, onFinish) => {
		vsapi.call(`${main_view.base_url}/ypg/dashboard/data`, {
			agent: null,
			loader: false,
			useCache: true,
			cacheTTL: 3000,
			cluster: main_view.apiCluster
		}).then(res => {
			const data = res.status_code === 200 ? res.data : {};
			console.log("Dashboard Data", data);
			if (typeof onFinish === 'function') onFinish(data);
		});
	};

	mThis.show = function () {
		main_view.setContentView(mThis.self, mThis.title_prop);
		mThis.loadDashBoardData(null, (d) => {
			mThis.renderDashboard(d);
		});
	};

	return mThis;
})();
