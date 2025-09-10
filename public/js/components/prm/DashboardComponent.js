"use strict";

var DashboardComponent = new (function () {
	const mThis = this;
	mThis.title_prop = "Dashboard";
	mThis.base_url = main_view.base_url;
	mThis.self = main_view.VSAppContent.querySelector("#_main_dashboard_component");

	mThis.init = () => {
		if (mThis.initAlready) return;
		mThis.initAlready = true;
	};

	mThis.renderDashboard = () => {
		const div = mThis.self;
		const html = `
			<div class="row gy-3 mt-1">
				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border rounded-3 shadow bg-white h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Total Tenants</h5>
									<h2 class="fw-bold text-dark mb-3">142</h2>
									<small class="text-success">+2 from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/main.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border rounded-3 shadow bg-white h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Occupancy Rate</h5>
									<h2 class="fw-bold text-dark mb-3">82%</h2>
									<small class="bg-success rounded-4 px-2 py-1 text-white"></small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/rate.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border rounded-3 shadow bg-white h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Monthly Revenue</h5>
									<h2 class="fw-bold text-dark mb-3">$32,432</h2>
									<small class="d-none text-success">+2% from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/monthly.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border rounded-3 shadow bg-white h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Active Request</h5>
									<h2 class="fw-bold mb-3">24</h2>
									<small class="text-success">12 cleaning, 8 internet, 4 maintenance</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/active.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> `;

		div.innerHTML = html;

		Object.assign(div.style, {
			height: (window.innerHeight - 90) + "px",
			overflow: "auto"
		});
		window.onresize = () => {
			Object.assign(div.style, {
				height: (window.innerHeight - 90) + "px",
				overflow: "auto"
			});
		};
	};

	mThis.show = function () {
		main_view.setContentView(mThis.self, mThis.title_prop);
		mThis.renderDashboard();
	};

	return mThis;
})();
