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
				<div class="count-card p-2 rounded-3 shadow">
					<div class="d-flex align-items-center bg-yp-custom text-white p-2 rounded">
						<div class="d-flex align-items-center justify-content-center bg-white rounded-2 me-3" style="width: 48px; height: 48px;">
							<img src="${main_view.asset_url}/images/default/default-user.png" alt="Icon" style="width: 100%; height: auto;">
						</div>
						<div class="flex-fill text-center">
							<span class="fw-semibold fs-5 text-white px-3 py-1 border border-warning shadow bg-yp-custom rounded-2 d-inline-block">
								${d.members?.total ?? 0}
							</span>
							<div class="text-white mt-2 fw-semibold">Member Count</div>
							<div class="text-white mt-1" style="font-size: 13px;">
							</div>
						</div>
					</div>
				</div>
			</div>
		<div class="col-sm-3">
				<div class="count-card p-2 rounded-3 shadow">
					<div class="d-flex align-items-center bg-yp-custom text-white p-2 rounded">
						<div class="d-flex align-items-center justify-content-center bg-white rounded-2 me-3" style="width: 48px; height: 48px;">
							<img src="${main_view.asset_url}/images/yavpheng/CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
						</div>
						<div class="flex-fill text-center">
							<span class="fw-semibold fs-5 text-white px-3 py-1 border border-warning shadow bg-yp-custom rounded-2 d-inline-block">
								${d.graves?.small ?? 0}
							</span>
							<div class="text-white mt-2 fw-semibold">Grave S</div>
							<div class="text-white mt-1" style="font-size: 13px;">
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-sm-3">
				<div class="count-card p-2 rounded-3 shadow">
					<div class="d-flex align-items-center bg-yp-custom text-white p-2 rounded">
						<div class="d-flex align-items-center justify-content-center bg-white rounded-2 me-3" style="width: 48px; height: 48px;">
							<img src="${main_view.asset_url}/images/yavpheng/CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
						</div>
						<div class="flex-fill text-center">
							<span class="fw-semibold fs-5 text-white px-3 py-1 border border-warning shadow bg-yp-custom rounded-2 d-inline-block">
								${d.graves?.medium ?? 0}
							</span>
							<div class="text-white mt-2 fw-semibold">Grave M</div>
							<div class="text-white mt-1" style="font-size: 13px;">
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-sm-3">
				<div class="count-card p-2 rounded-3 shadow">
					<div class="d-flex align-items-center bg-yp-custom text-white p-2 rounded">
						<div class="d-flex align-items-center justify-content-center bg-white rounded-2 me-3" style="width: 48px; height: 48px;">
							<img src="${main_view.asset_url}/images/yavpheng/CYPA_logo.png" alt="Icon" style="width: 100%; height: auto;">
						</div>
						<div class="flex-fill text-center">
							<span class="fw-semibold fs-5 text-white px-3 py-1 border border-warning shadow bg-yp-custom rounded-2 d-inline-block">
								${d.graves?.large ?? 0}
							</span>
							<div class="text-white mt-2 fw-semibold">Grave L</div>
							<div class="text-white mt-1" style="font-size: 13px;">
							</div>
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
				<h5 class="text-center text-white mb-3">Yeav Pheng History</h5>

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
				<h5 class="text-center text-yp-custom mb-3">Grave Slot Map</h5>
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
