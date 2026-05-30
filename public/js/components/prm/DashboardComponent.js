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
					<div class="card border border-primary rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Total Zones</h5>
									<h2 class="fw-bold text-dark mb-3">120</h2>
									<small class="text-success">+1 from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/home_zone.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-success rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Active Zones</h5>
									<h2 class="fw-bold text-dark mb-3">90</h2>
									<small class="bg-success rounded-4 px-2 py-1 text-white">Operational</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/active_zone.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-warning rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Security Level</h5>
									<h2 class="fw-bold text-dark mb-3">Normal</h2>
									<small class="d-none text-success">+1 from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/security.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-danger rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Electricity Usage</h5>
									<h2 class="fw-bold text-danger mb-3">282.3 kW</h2>
									<small class="text-success">+5.2% from last hour</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/electricity.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row gy-3 mt-1">
				<div class="col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header text-primary-custom border-0 fw-semibold" style="background-color: #E7E7E7;">Building Occupancy</div>
						<div class="card-body" style="height:300px;">
							<canvas id="chartOccupancy"></canvas>
						</div>
					</div>
				</div>

				<div class="col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header text-primary-custom border-0 fw-semibold" style="background-color: #E7E7E7;">Annual Electricity Consumption</div>
						<div class="card-body" style="height:300px;">
							<canvas id="chartElectricity"></canvas>
						</div>
					</div>
				</div>
			</div>

			<div class="row gy-3 mt-1">
				<div class="col-12 col-md-6 col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header bg-white border-0 fw-semibold">Facility Health Status</div>
						<div class="card-body small">
							<div class="mb-2">HVAC Systems <span class="float-end">92%</span>
								<div class="progress"><div class="progress-bar bg-primary" style="width:92%"></div></div>
							</div>
							<div class="mb-2">Plumbing Systems <span class="float-end">87%</span>
								<div class="progress"><div class="progress-bar bg-info" style="width:87%"></div></div>
							</div>
							<div class="mb-2">Electrical Systems <span class="float-end">95%</span>
								<div class="progress"><div class="progress-bar bg-success" style="width:95%"></div></div>
							</div>
							<div class="mb-2">Structural Elements <span class="float-end">98%</span>
								<div class="progress"><div class="progress-bar bg-warning" style="width:98%"></div></div>
							</div>
							<div>Network Infrastructure <span class="float-end">85%</span>
								<div class="progress"><div class="progress-bar bg-danger" style="width:85%"></div></div>
							</div>
						</div>
					</div>
				</div>
			</div>`;

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

		mThis.initCharts();
	};

	mThis.initCharts = () => {
		if (typeof Chart === "undefined") return;

		// Electricity Line Chart
		new Chart(document.getElementById("chartElectricity"), {
			type: 'line',
			data: {
				labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				datasets: [
					{ label:"Consumption", data:[40,55,60,75,65,85,70,60,55,68,72,90], borderColor:"#0d6efd", backgroundColor:"rgba(13,110,253,0.1)", fill:true, tension:0.3 },
					{ label:"Cost", data:[35,50,65,70,60,80,65,58,60,70,78,88], borderColor:"#dc3545", backgroundColor:"rgba(220,53,69,0.1)", fill:true, tension:0.3 }
				]
			},
			options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
		});

		new Chart(document.getElementById("chartOccupancy"), {
			type: 'bar',
			data: {
				labels: ["Floor 1","Floor 2","Floor 3","Floor 4","Floor 5","Floor 6"],
				datasets: [
					{ label:"Semester 1", data:[70,60,85,90,65,75], backgroundColor:"rgba(26,22,71,0.85)", borderRadius:6, maxBarThickness:20 },
					{ label:"Semester 2", data:[60,55,80,85,60,70], backgroundColor:"rgba(246,214,115,0.85)", borderRadius:6, maxBarThickness:20 }
				]
			},
			options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}, scales:{x:{grid:{display:false}}, y:{grid:{color:"#f1f3f5"}, ticks:{stepSize:20}}}}
		});
	};

	mThis.show = function () {
		main_view.setContentView(mThis.self, mThis.title_prop);
		mThis.renderDashboard();
	};

	return mThis;
})();
