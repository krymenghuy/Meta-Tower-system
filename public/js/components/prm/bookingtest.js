"use strict";

var ReservationComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Schedule & Manage Your Property Reservations";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_reservation_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnSpace");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_space");
    mThis.elBuilding = mThis.self.querySelector('#building_id');
    mThis.elFloor = mThis.self.querySelector('#floor_id');
    mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.elSearch = mThis.self.querySelector("#_search_space");
    let div = mThis.self.querySelector("#_space_list");

    mThis.divSummary = mThis.self.querySelector('#_reservation_div_summary');

    // Data
    mThis.buildings = [
        { id: 1, name: 'Bakheng', location: '2nd Floor', capacity: 150 },
        { id: 2, name: 'Mekong', location: '5th Floor', capacity: 80 },
        { id: 3, name: 'Apsara', location: '9th Floor', capacity: 200 },
        { id: 4, name: 'Bayon', location: '7th Floor', capacity: 60 }
    ];

    mThis.reservations = [
        { id: 1, buildingId: 1, date: '2026-02-15', startTime: '14:00', endTime: '18:00', renterName: 'Sarah Mitchell', event: 'Corporate Workshop', attendees: 45 },
        { id: 2, buildingId: 2, date: '2026-02-18', startTime: '10:00', endTime: '15:00', renterName: 'James Chen', event: 'Wedding Reception', attendees: 75 },
        { id: 3, buildingId: 1, date: '2026-02-22', startTime: '09:00', endTime: '12:00', renterName: 'Emma Davis', event: 'Art Exhibition', attendees: 30 }
    ];

    const now = new Date();
    mThis.currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
    mThis.selectedBuilding = null;
    mThis.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            mThis.openBookingModal();
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => { mThis.renderAll(); };
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => { mThis.renderAll(); }, 250);
        });

        mThis.initAlready = true;
    };

    // Utility Functions
    mThis.formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    mThis.formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    mThis.getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
        return days;
    };

    mThis.getReservationsForDate = (date, buildingId = null) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        return mThis.reservations.filter(res => {
            const matchesDate = res.date === dateStr;
            const matchesBuilding = buildingId ? res.buildingId === buildingId : true;
            return matchesDate && matchesBuilding;
        });
    };

    mThis.checkTimeConflict = (buildingId, date, startTime, endTime, excludeId = null) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const dayReservations = mThis.reservations.filter(res =>
            res.buildingId === buildingId && res.date === dateStr && res.id !== excludeId
        );
        return dayReservations.some(res => startTime < res.endTime && endTime > res.startTime);
    };

    mThis.setDataSummary = () => {
        let html = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

            /* ✅ Force parent containers to allow scroll */
            #_main_reservation_component,
            #_reservation_div_summary {
                overflow: visible !important;
                height: auto !important;
                max-height: none !important;
            }

            .rsv-wrap * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

            .rsv-wrap {
                padding: 1.5rem 0.5rem 3rem;
                background: #f5f3ef;
            }

            .rsv-grid {
                display: grid;
                grid-template-columns: 300px 1fr;
                gap: 1.5rem;
                align-items: start;
            }

            /* ── Sidebar ── */
            .rsv-sidebar { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 1rem; }

            .rsv-card {
                background: #ffffff;
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 2px 12px rgba(15,18,51,0.06), 0 1px 3px rgba(15,18,51,0.04);
                border: 1px solid rgba(201,169,110,0.12);
            }

            .rsv-card-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.25rem;
                font-weight: 600;
                color: #0f1233;
                letter-spacing: 0.01em;
                margin: 0 0 1.1rem 0;
                display: flex;
                align-items: center;
                gap: 0.6rem;
            }

            .rsv-card-title .title-icon {
                width: 32px; height: 32px;
                background: linear-gradient(135deg, #0f1233 0%, #c9a96e 100%);
                border-radius: 8px;
                display: flex; align-items: center; justify-content: center;
                color: white; font-size: 0.75rem;
                flex-shrink: 0;
            }

            /* Room buttons */
            .room-btn {
                display: flex;
                align-items: center;
                gap: 0.85rem;
                width: 100%;
                padding: 0.85rem 1rem;
                border-radius: 10px;
                border: 1.5px solid transparent;
                cursor: pointer;
                text-align: left;
                margin-bottom: 0.5rem;
                transition: all 0.22s ease;
                background: #faf9f7;
                position: relative;
                overflow: hidden;
            }

            .room-btn::before {
                content: '';
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 3px;
                background: linear-gradient(to bottom, #c9a96e, #0f1233);
                opacity: 0;
                transition: opacity 0.2s;
            }

            .room-btn:hover { background: #f0ede8; border-color: rgba(201,169,110,0.3); transform: translateX(3px); }
            .room-btn:hover::before { opacity: 1; }

            .room-btn.active {
                background: linear-gradient(135deg, #0f1233 0%, #1e2560 100%);
                border-color: transparent;
                color: white;
                box-shadow: 0 6px 20px rgba(15,18,51,0.25);
                transform: translateX(4px);
            }

            .room-btn.active::before { opacity: 0; }

            .room-icon {
                width: 36px; height: 36px;
                border-radius: 8px;
                background: rgba(201,169,110,0.15);
                display: flex; align-items: center; justify-content: center;
                font-size: 0.8rem;
                color: #c9a96e;
                flex-shrink: 0;
                transition: all 0.2s;
            }

            .room-btn.active .room-icon {
                background: rgba(201,169,110,0.25);
                color: #f0c878;
            }

            .room-info { flex: 1; min-width: 0; }
            .room-name { font-weight: 500; font-size: 0.9rem; color: #0f1233; margin-bottom: 0.2rem; }
            .room-btn.active .room-name { color: #fff; }
            .room-meta { font-size: 0.75rem; color: #8a8399; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .room-btn.active .room-meta { color: rgba(255,255,255,0.65); }

            .room-cap {
                font-size: 0.72rem;
                font-weight: 600;
                padding: 0.2rem 0.5rem;
                border-radius: 20px;
                background: rgba(201,169,110,0.15);
                color: #a07840;
                flex-shrink: 0;
            }
            .room-btn.active .room-cap { background: rgba(201,169,110,0.25); color: #f0c878; }

            /* Upcoming items */
            .upcoming-item {
                padding: 0.9rem 1rem;
                background: #faf9f7;
                border-radius: 10px;
                border-left: 3px solid #c9a96e;
                margin-bottom: 0.6rem;
                cursor: pointer;
                transition: all 0.2s;
            }
            .upcoming-item:hover { background: #f0ede8; transform: translateX(4px); box-shadow: 0 4px 12px rgba(15,18,51,0.08); }
            .upcoming-room { font-weight: 500; font-size: 0.88rem; color: #0f1233; margin-bottom: 0.3rem; }
            .upcoming-detail { font-size: 0.78rem; color: #8a8399; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.18rem; }

            /* ── Main content ── */
            .rsv-main { display: flex; flex-direction: column; gap: 1.5rem; }

            /* Calendar */
            .cal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .cal-month {
                font-family: 'Cormorant Garamond', serif;
                font-size: 2rem;
                font-weight: 500;
                color: #0f1233;
                margin: 0;
                letter-spacing: -0.01em;
            }

            .cal-nav { display: flex; gap: 0.5rem; }

            .nav-btn {
                display: flex; align-items: center; gap: 0.4rem;
                padding: 0.5rem 1.1rem;
                border: 1.5px solid #0f1233;
                border-radius: 8px;
                background: transparent;
                color: #0f1233;
                font-size: 0.82rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                font-family: 'DM Sans', sans-serif;
            }
            .nav-btn:hover { background: #0f1233; color: white; }

            .cal-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.4rem;
            }

            .cal-day-header {
                text-align: center;
                font-size: 0.72rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #c9a96e;
                padding: 0.5rem 0;
                border-bottom: 2px solid #f0ede8;
                margin-bottom: 0.25rem;
            }

            .cal-day {
                min-height: 72px;
                padding: 0.6rem 0.5rem;
                border-radius: 10px;
                background: #faf9f7;
                border: 1.5px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }
            .cal-day:hover { background: #f0ede8; border-color: rgba(201,169,110,0.4); transform: scale(1.04); z-index: 5; box-shadow: 0 4px 14px rgba(15,18,51,0.1); }
            .cal-day.today { border-color: #0f1233; background: #fff; box-shadow: inset 0 0 0 1px rgba(15,18,51,0.08); }
            .cal-day.empty { background: transparent; border-color: transparent; cursor: default; }
            .cal-day.empty:hover { transform: none; box-shadow: none; }

            .cal-day-num {
                font-size: 0.9rem;
                font-weight: 500;
                color: #2c2840;
                margin-bottom: 0.35rem;
            }
            .cal-day.today .cal-day-num {
                font-weight: 700;
                color: #0f1233;
            }

            .cal-day-today-dot {
                display: inline-flex;
                width: 22px; height: 22px;
                border-radius: 50%;
                background: #0f1233;
                color: white;
                font-size: 0.78rem;
                font-weight: 700;
                align-items: center;
                justify-content: center;
            }

            .cal-event-pill {
                font-size: 0.65rem;
                padding: 0.18rem 0.45rem;
                background: linear-gradient(135deg, #0f1233, #1e2560);
                color: white;
                border-radius: 4px;
                margin-bottom: 0.2rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 500;
            }

            .cal-more { font-size: 0.65rem; color: #c9a96e; font-weight: 600; margin-top: 0.1rem; }

            /* Reservations list */
            .rsv-list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.25rem;
            }

            .rsv-list-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.6rem;
                font-weight: 500;
                color: #0f1233;
                margin: 0;
            }

            .rsv-badge {
                font-size: 0.75rem;
                font-weight: 600;
                padding: 0.35rem 0.85rem;
                border-radius: 20px;
                background: #0f1233;
                color: #c9a96e;
                letter-spacing: 0.04em;
            }

            .rsv-item {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 1rem;
                align-items: center;
                padding: 1.25rem 1.25rem;
                background: #faf9f7;
                border-radius: 12px;
                border: 1.5px solid transparent;
                margin-bottom: 0.75rem;
                transition: all 0.22s;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .rsv-item::before {
                content: '';
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 4px;
                background: linear-gradient(to bottom, #c9a96e 0%, #0f1233 100%);
            }

            .rsv-item:hover {
                background: #f0ede8;
                border-color: rgba(201,169,110,0.25);
                transform: translateX(5px);
                box-shadow: 0 6px 20px rgba(15,18,51,0.1);
            }

            .rsv-item-icon {
                width: 44px; height: 44px;
                border-radius: 10px;
                background: linear-gradient(135deg, #0f1233 0%, #2a3080 100%);
                display: flex; align-items: center; justify-content: center;
                color: #c9a96e;
                font-size: 1rem;
                flex-shrink: 0;
            }

            .rsv-item-event {
                font-weight: 600;
                font-size: 0.95rem;
                color: #0f1233;
                margin-bottom: 0.3rem;
                display: flex;
                align-items: center;
                gap: 0.6rem;
                flex-wrap: wrap;
            }

            .rsv-building-tag {
                font-size: 0.72rem;
                font-weight: 600;
                padding: 0.18rem 0.6rem;
                background: rgba(201,169,110,0.15);
                color: #a07840;
                border-radius: 20px;
                letter-spacing: 0.04em;
            }

            .rsv-item-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                font-size: 0.8rem;
                color: #7a7390;
            }

            .rsv-meta-pill {
                display: flex;
                align-items: center;
                gap: 0.35rem;
            }

            .btn-delete {
                width: 36px; height: 36px;
                border-radius: 8px;
                border: 1.5px solid #fce8ea;
                background: #fff5f5;
                color: #dc3545;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
                font-size: 0.82rem;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .btn-delete:hover { background: #dc3545; color: white; border-color: #dc3545; transform: scale(1.1); }

            .rsv-empty {
                text-align: center;
                padding: 4rem 2rem;
            }
            .rsv-empty-icon { font-size: 2.5rem; color: #e0dbd4; margin-bottom: 1rem; }
            .rsv-empty-text { color: #a09ab0; font-size: 0.95rem; }

            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent);
                margin: 0.25rem 0 0.75rem;
            }
        </style>

        <div class="rsv-wrap">
            <div class="rsv-grid">

                <!-- ── SIDEBAR ── -->
                <aside class="rsv-sidebar">

                    <!-- Meeting Rooms -->
                    <div class="rsv-card">
                        <h3 class="rsv-card-title">
                            <span class="title-icon"><i class="fa-solid fa-building"></i></span>
                            Meeting Rooms
                        </h3>
                        <div class="divider"></div>
                        <div id="roomList"></div>
                    </div>

                    <!-- Upcoming -->
                    <div class="rsv-card">
                        <h3 class="rsv-card-title">
                            <span class="title-icon"><i class="fa-solid fa-clock-rotate-left"></i></span>
                            Upcoming
                        </h3>
                        <div class="divider"></div>
                        <div id="upcomingList"></div>
                    </div>

                </aside>

                <!-- ── MAIN ── -->
                <div class="rsv-main">

                    <!-- Calendar -->
                    <div class="rsv-card">
                        <div class="cal-header">
                            <h2 class="cal-month" id="calendarMonth"></h2>
                            <div class="cal-nav">
                                <button class="nav-btn" id="prevMonth">
                                    <i class="fa-solid fa-chevron-left"></i> Prev
                                </button>
                                <button class="nav-btn" id="nextMonth">
                                    Next <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <div class="cal-grid" id="calendarGrid"></div>
                    </div>

                    <!-- Reservations list -->
                    <div class="rsv-card">
                        <div class="rsv-list-header">
                            <h3 class="rsv-list-title" id="reservationsTitle">All Reservations</h3>
                            <span class="rsv-badge" id="reservationCount">0 Reservations</span>
                        </div>
                        <div class="divider"></div>
                        <div id="reservationsList" style="padding-right:0.25rem;"></div>
                    </div>

                </div>
            </div>
        </div>`;

        mThis.divSummary.innerHTML = html;

        document.getElementById('prevMonth').addEventListener('click', () => {
            mThis.currentDate = new Date(mThis.currentDate.getFullYear(), mThis.currentDate.getMonth() - 1, 1);
            mThis.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            mThis.currentDate = new Date(mThis.currentDate.getFullYear(), mThis.currentDate.getMonth() + 1, 1);
            mThis.renderCalendar();
        });
    };

    // ── Render: Buildings ──
    mThis.renderBuildings = () => {
        const roomList = document.getElementById('roomList');
        if (!roomList) return;

        const allActive = !mThis.selectedBuilding;
        let html = `
            <button class="room-btn ${allActive ? 'active' : ''}" data-building-id="">
                <span class="room-icon"><i class="fa-solid fa-layer-group"></i></span>
                <span class="room-info">
                    <div class="room-name">All Meeting Rooms</div>
                    <div class="room-meta">${mThis.buildings.length} venues available</div>
                </span>
            </button>`;

        const icons = ['fa-archway', 'fa-water', 'fa-star', 'fa-landmark'];
        mThis.buildings.forEach((building, i) => {
            const isActive = mThis.selectedBuilding?.id === building.id;
            html += `
                <button class="room-btn ${isActive ? 'active' : ''}" data-building-id="${building.id}">
                    <span class="room-icon"><i class="fa-solid ${icons[i] || 'fa-building'}"></i></span>
                    <span class="room-info">
                        <div class="room-name">${building.name}</div>
                        <div class="room-meta"><i class="fa-solid fa-location-dot" style="font-size:0.65rem;margin-right:3px;"></i>${building.location}</div>
                    </span>
                    <span class="room-cap"><i class="fa-solid fa-users" style="font-size:0.65rem;margin-right:3px;"></i>${building.capacity}</span>
                </button>`;
        });

        roomList.innerHTML = html;

        roomList.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const buildingId = btn.dataset.buildingId;
                mThis.selectedBuilding = buildingId ? mThis.buildings.find(b => b.id === parseInt(buildingId)) : null;
                mThis.renderAll();
            });
        });
    };

    // ── Render: Upcoming ──
    mThis.renderUpcoming = () => {
        const upcomingList = document.getElementById('upcomingList');
        if (!upcomingList) return;

        const filtered = mThis.selectedBuilding
            ? mThis.reservations.filter(res => res.buildingId === mThis.selectedBuilding.id)
            : mThis.reservations;

        const upcoming = filtered.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

        if (!upcoming.length) {
            upcomingList.innerHTML = `<div class="rsv-empty"><div class="rsv-empty-icon"><i class="fa-regular fa-calendar"></i></div><div class="rsv-empty-text">No upcoming reservations</div></div>`;
            return;
        }

        let html = '';
        upcoming.forEach(res => {
            const building = mThis.buildings.find(b => b.id === res.buildingId);
            html += `
                <div class="upcoming-item">
                    <div class="upcoming-room">${building.name} <span style="font-size:0.72rem;color:#c9a96e;font-weight:600;margin-left:4px;">${res.event}</span></div>
                    <div class="upcoming-detail"><i class="fa-regular fa-calendar"></i>
                        ${new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div class="upcoming-detail"><i class="fa-regular fa-clock"></i>
                        ${mThis.formatTime(res.startTime)} – ${mThis.formatTime(res.endTime)}
                    </div>
                </div>`;
        });

        upcomingList.innerHTML = html;
    };

    // ── Render: Calendar ──
    mThis.renderCalendar = () => {
        const calendarMonth = document.getElementById('calendarMonth');
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarMonth || !calendarGrid) return;

        calendarMonth.textContent = `${mThis.monthNames[mThis.currentDate.getMonth()]} ${mThis.currentDate.getFullYear()}`;

        const days = mThis.getDaysInMonth(mThis.currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let gridHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map(d => `<div class="cal-day-header">${d}</div>`).join('');

        gridHTML += days.map(date => {
            if (!date) return '<div class="cal-day empty"></div>';

            const dayRes = mThis.getReservationsForDate(date, mThis.selectedBuilding?.id);
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = date.toISOString().split('T')[0];

            let dayHTML = `
                <div class="cal-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <div class="cal-day-num">
                        ${isToday ? `<span class="cal-day-today-dot">${date.getDate()}</span>` : date.getDate()}
                    </div>`;

            dayRes.slice(0, 2).forEach(res => {
                const b = mThis.buildings.find(b => b.id === res.buildingId);
                dayHTML += `<div class="cal-event-pill">${b.name.substring(0, 10)}${b.name.length > 10 ? '…' : ''}</div>`;
            });

            if (dayRes.length > 2) {
                dayHTML += `<div class="cal-more">+${dayRes.length - 2} more</div>`;
            }

            dayHTML += '</div>';
            return dayHTML;
        }).join('');

        calendarGrid.innerHTML = gridHTML;

        calendarGrid.querySelectorAll('.cal-day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                mThis.openBookingModal(day.dataset.date);
            });
        });
    };

    // ── Render: Reservations List ──
    mThis.renderReservations = () => {
        const reservationsList = document.getElementById('reservationsList');
        const reservationsTitle = document.getElementById('reservationsTitle');
        const reservationCount = document.getElementById('reservationCount');
        if (!reservationsList) return;

        const filtered = mThis.selectedBuilding
            ? mThis.reservations.filter(res => res.buildingId === mThis.selectedBuilding.id)
            : mThis.reservations;

        if (reservationsTitle)
            reservationsTitle.textContent = mThis.selectedBuilding ? `${mThis.selectedBuilding.name} — Reservations` : 'All Reservations';
        if (reservationCount)
            reservationCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'Reservation' : 'Reservations'}`;

        if (!filtered.length) {
            reservationsList.innerHTML = `
                <div class="rsv-empty">
                    <div class="rsv-empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
                    <div class="rsv-empty-text">No reservations found</div>
                </div>`;
            return;
        }

        const eventIcons = {
            'wedding': 'fa-heart', 'conference': 'fa-briefcase', 'workshop': 'fa-chalkboard-user',
            'exhibition': 'fa-image', 'default': 'fa-calendar-check'
        };

        const getIcon = (event) => {
            const lower = event.toLowerCase();
            return Object.keys(eventIcons).find(k => lower.includes(k))
                ? eventIcons[Object.keys(eventIcons).find(k => lower.includes(k))]
                : eventIcons.default;
        };

        let html = '';
        filtered.forEach(res => {
            const building = mThis.buildings.find(b => b.id === res.buildingId);
            html += `
                <div class="rsv-item" data-id="${res.id}">
                    <div class="rsv-item-icon">
                        <i class="fa-solid ${getIcon(res.event)}"></i>
                    </div>
                    <div>
                        <div class="rsv-item-event">
                            ${res.event}
                            <span class="rsv-building-tag">${building.name}</span>
                        </div>
                        <div class="rsv-item-meta">
                            <span class="rsv-meta-pill"><i class="fa-regular fa-calendar"></i>${mThis.formatDate(res.date)}</span>
                            <span class="rsv-meta-pill"><i class="fa-regular fa-clock"></i>${mThis.formatTime(res.startTime)} – ${mThis.formatTime(res.endTime)}</span>
                            <span class="rsv-meta-pill"><i class="fa-regular fa-user"></i>${res.renterName}</span>
                            <span class="rsv-meta-pill"><i class="fa-solid fa-users"></i>${res.attendees} attendees</span>
                        </div>
                    </div>
                    <button class="btn-delete" data-id="${res.id}" title="Cancel reservation">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>`;
        });

        reservationsList.innerHTML = html;

        reservationsList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                mThis.deleteReservation(parseInt(btn.dataset.id));
            });
        });
    };

    mThis.renderAll = () => {
        mThis.renderBuildings();
        mThis.renderUpcoming();
        mThis.renderCalendar();
        mThis.renderReservations();
    };

    mThis.deleteReservation = (id) => {
        cv_interact.confirm('Delete this Reservation?', {
            title: 'Delete Reservation',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (confirmed) {
            if (confirmed) {
                mThis.reservations = mThis.reservations.filter(res => res.id !== id);
                cv_interact.success('Reservation cancelled successfully!');
                mThis.renderAll();
            }
        });
    };

    mThis.openBookingModal = (dateStr = '') => {
        const op = {
            id: null,
            date: dateStr,
            onClose: (success) => { if (success) mThis.renderAll(); }
        };
        ReservationDialog.show(op);
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            building_id: mThis.elBuilding.value,
            floor_id: mThis.elFloor.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            p[el.dataset.field] = el.value;
        });
        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/building-space/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'space_status', true, 'Statuses', null);
                VSUtil.setComboItems(mThis.elBuilding, d.buildings, 'id', 'building', true, 'All Building', null);
                VSUtil.setComboItems(mThis.elSpaceType, d.space_types, 'id', 'space_type', true, 'All Space Type', null);
                if (typeof onFinish === 'function') onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.setDataSummary();
            mThis.renderAll();
        });
    };

    return mThis;
})();


// ── ReservationDialog ──
const ReservationDialog = (() => {
    const self = {};

    self.show = (op) => {
        const selectedDate = op.date || '';

        const dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <style>
                    .rsv-dialog-field { margin-bottom: 1rem; }
                    .rsv-dialog-label {
                        display: block;
                        font-size: 0.78rem;
                        font-weight: 600;
                        letter-spacing: 0.06em;
                        text-transform: uppercase;
                        color: #6b6380;
                        margin-bottom: 0.4rem;
                        padding-left: 2px;
                    }
                    .rsv-dialog-input {
                        width: 100%;
                        padding: 0.7rem 0.9rem;
                        border: 1.5px solid #e8e4f0;
                        border-radius: 8px;
                        font-size: 0.88rem;
                        color: #0f1233;
                        background: #faf9f7;
                        transition: border-color 0.2s, box-shadow 0.2s;
                        font-family: 'DM Sans', sans-serif;
                        outline: none;
                    }
                    .rsv-dialog-input:focus {
                        border-color: #c9a96e;
                        box-shadow: 0 0 0 3px rgba(201,169,110,0.15);
                        background: #fff;
                    }
                </style>
                <div class="row g-2">
                    <div class="col-12 rsv-dialog-field">
                        <label class="rsv-dialog-label">Building <span style="color:#dc3545;">*</span></label>
                        <select class="data-input rsv-dialog-input" data-field="building_id" required>
                            <option value="">Select a building…</option>
                        </select>
                    </div>
                    <div class="col-12 rsv-dialog-field">
                        <label class="rsv-dialog-label">Date <span style="color:#dc3545;">*</span></label>
                        <input type="date" class="data-input rsv-dialog-input" data-field="date" required />
                    </div>
                    <div class="col-6 rsv-dialog-field">
                        <label class="rsv-dialog-label">Start Time <span style="color:#dc3545;">*</span></label>
                        <input type="time" class="data-input rsv-dialog-input" data-field="start_time" required />
                    </div>
                    <div class="col-6 rsv-dialog-field">
                        <label class="rsv-dialog-label">End Time <span style="color:#dc3545;">*</span></label>
                        <input type="time" class="data-input rsv-dialog-input" data-field="end_time" required />
                    </div>
                    <div class="col-12 rsv-dialog-field">
                        <label class="rsv-dialog-label">Renter Name <span style="color:#dc3545;">*</span></label>
                        <input type="text" class="data-input rsv-dialog-input" data-field="renter_name" placeholder="Full name" required />
                    </div>
                    <div class="col-12 rsv-dialog-field">
                        <label class="rsv-dialog-label">Event Type <span style="color:#dc3545;">*</span></label>
                        <input type="text" class="data-input rsv-dialog-input" data-field="event" placeholder="e.g., Wedding, Conference…" required />
                    </div>
                    <div class="col-12 rsv-dialog-field">
                        <label class="rsv-dialog-label">Expected Attendees <span style="color:#dc3545;">*</span></label>
                        <input type="number" class="data-input rsv-dialog-input" data-field="attendees" min="1" placeholder="Number of attendees" required />
                    </div>
                </div>`,

            contentCreated: (me) => {
                // Header styling
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');
                const btnClose = header.querySelector('button');
                if (btnClose) btnClose.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 16px !important;';

                const wrapper = document.createElement('div');
                wrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                wrapper.appendChild(headerTitle);
                header.innerHTML = '';
                header.appendChild(wrapper);

                // Populate buildings
                const buildingSelect = me.controls.building_id;
                ReservationComponent.buildings.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b.id;
                    opt.textContent = `${b.name} — ${b.location} (Cap. ${b.capacity})`;
                    buildingSelect.appendChild(opt);
                });

                // ✅ Set date using closure variable — always correct
                const today = new Date().toISOString().split('T')[0];
                me.controls.date.min = today;
                if (selectedDate) {
                    me.controls.date.value = selectedDate;
                }
            },

            prepareFormOptions: {
                createTitle: "New Reservation",
                modifyTitle: "Edit Reservation",
                targetProp: "reservation_details",
            },

            onPrepareForm: (me, data) => {},

            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn-vs-cancel',
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span>Create Reservation</span>',
                    cssClass: 'btn-vs-save',
                    click: (me) => {
                        const data = me.getData();

                        if (!data.building_id || !data.date || !data.start_time || !data.end_time ||
                            !data.renter_name || !data.event || !data.attendees) {
                            cv_interact.error('Please fill in all required fields');
                            return;
                        }

                        if (data.start_time >= data.end_time) {
                            cv_interact.error('End time must be after start time');
                            return;
                        }

                        const hasConflict = ReservationComponent.checkTimeConflict(
                            parseInt(data.building_id), data.date, data.start_time, data.end_time
                        );
                        if (hasConflict) {
                            cv_interact.error('Time slot conflict! This building is already booked during this time.');
                            return;
                        }

                        const building = ReservationComponent.buildings.find(b => b.id === parseInt(data.building_id));
                        if (parseInt(data.attendees) > building.capacity) {
                            cv_interact.warning(`Attendees (${data.attendees}) exceed building capacity (${building.capacity})`);
                        }

                        ReservationComponent.reservations.push({
                            id: Date.now(),
                            buildingId: parseInt(data.building_id),
                            date: data.date,
                            startTime: data.start_time,
                            endTime: data.end_time,
                            renterName: data.renter_name,
                            event: data.event,
                            attendees: parseInt(data.attendees)
                        });

                        cv_interact.success('Reservation created successfully!');
                        me.hide(true);
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();