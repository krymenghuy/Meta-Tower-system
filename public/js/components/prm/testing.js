"use strict";

var ReservationComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Schedule & Manage Your Property Reservations";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_reservation_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnSpace");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_reservation");
    mThis.elFloor = mThis.self.querySelector('#floor_id');
    mThis.elSearch = mThis.self.querySelector("#_search_reservation");

    mThis.divSummary = mThis.self.querySelector('#_reservation_list');
    
    // Data
    mThis.buildings = [
        
        { id: 1, name: 'Bakheng', location: '2nd Floor', capacity: 15 },
        { id: 2, name: 'Mekong', location: '5th Floor', capacity: 80 },
        { id: 3, name: 'Apsara', location: '9th Floor', capacity: 20 },
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
            el.onchange = () => {
                mThis.renderAll();
            };
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.renderAll();
            }, 250);
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

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

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
            res.buildingId === buildingId &&
            res.date === dateStr &&
            res.id !== excludeId
        );

        return dayReservations.some(res => {
            const resStart = res.startTime;
            const resEnd = res.endTime;
            return (startTime < resEnd && endTime > resStart);
        });
    };

    

    // Render Functions
    mThis.renderReservations = () => {
        const roomList = document.getElementById('roomList');
        if (!roomList) return;

        let html = `
            <button class="building-btn ${!mThis.selectedBuilding ? 'active' : ''}" 
                    style="padding: 1rem; border-radius: 8px; cursor: pointer; width: 100%; text-align: left; 
                           margin-bottom: 0.75rem; border: 2px solid #e8dfd7; 
                           background: ${!mThis.selectedBuilding ? 'linear-gradient(135deg, #1a1647 0%, #9d6b53 100%)' : '#f9f6f3'}; 
                           color: ${!mThis.selectedBuilding ? 'white' : '#2c2419'}; 
                           transition: all 0.3s;">
                <div style="font-weight: 600;">All Meeting Rooms</div>
            </button>`;

        mThis.buildings.forEach(building => {
            const isActive = mThis.selectedBuilding?.id === building.id;
            html += `
                <button class="building-btn ${isActive ? 'active' : ''}" 
                        data-building-id="${building.id}"
                        style="padding: 1rem; border-radius: 8px; cursor: pointer; width: 100%; text-align: left; 
                               margin-bottom: 0.75rem; border: ${isActive ? 'none' : '2px solid #e8dfd7'}; 
                               background: ${isActive ? 'linear-gradient(135deg, #1a1647 0%, #9d6b53 100%)' : '#f9f6f3'}; 
                               color: ${isActive ? 'white' : '#1a1647'}; 
                               transition: all 0.3s;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${building.name}</div>
                    <div style="font-size: 0.85rem; opacity: ${isActive ? '0.9' : '0.6'};">
                        <i class="fa-solid fa-location-dot me-1"></i>${building.location} • 
                        <i class="fa-solid fa-users ms-1 me-1"></i>Cap. ${building.capacity}
                    </div>
                </button>`;
        });

        roomList.innerHTML = html;

        // Add click handlers and hover effects
        roomList.querySelectorAll('.building-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const buildingId = btn.dataset.buildingId;
                mThis.selectedBuilding = buildingId ? mThis.buildings.find(b => b.id === parseInt(buildingId)) : null;
                mThis.renderAll();
            });

            // Hover effect for inactive buttons
            if (!btn.classList.contains('active')) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateX(5px)';
                    btn.style.borderColor = '#1a1647';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateX(0)';
                    btn.style.borderColor = '#e8dfd7';
                });
            }
        });
    };

    mThis.renderUpcoming = () => {
        const upcomingList = document.getElementById('upcomingList');
        if (!upcomingList) return;

        const filteredReservations = mThis.selectedBuilding
            ? mThis.reservations.filter(res => res.buildingId === mThis.selectedBuilding.id)
            : mThis.reservations;

        const upcoming = filteredReservations
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        let html = '';
        upcoming.forEach(res => {
            const building = mThis.buildings.find(b => b.id === res.buildingId);
            html += `
                <div class="upcoming-item" style="padding: 1rem; background: #f9f6f3; border-radius: 8px; 
                                                   border-left: 4px solid #1a1647; margin-bottom: 0.75rem; 
                                                   transition: all 0.3s; cursor: pointer;">
                    <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem; color: #1a1647;">${building.name}</div>
                    <div style="font-size: 0.85rem; color: #8b7355; margin-bottom: 0.25rem;">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style="font-size: 0.85rem; color: #8b7355;">
                        <i class="fa-regular fa-clock me-1"></i>
                        ${mThis.formatTime(res.startTime)} - ${mThis.formatTime(res.endTime)}
                    </div>
                </div>`;
        });

        upcomingList.innerHTML = html || '<p style="color: #8b7355; text-align: center; padding: 2rem 0;">No upcoming reservations</p>';

        // Add hover effects
        upcomingList.querySelectorAll('.upcoming-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.boxShadow = '0 4px 12px rgba(26, 22, 71, 0.15)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = 'none';
            });
        });
    };

    mThis.renderCalendar = () => {
        const calendarMonth = document.getElementById('calendarMonth');
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarMonth || !calendarGrid) return;

        calendarMonth.textContent = `${mThis.monthNames[mThis.currentDate.getMonth()]} ${mThis.currentDate.getFullYear()}`;

        const days = mThis.getDaysInMonth(mThis.currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for occurate comparison

        let gridHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .map(day => `<div style="padding: 0.75rem; text-align: center; font-weight: 600; 
                                     font-size: 0.9rem; color: #8b7355; border-bottom: 2px solid #e8dfd7;">${day}</div>`)
            .join('');

        gridHTML += days.map(date => {
            if (!date) return '<div style="background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px;"></div>';

            const dayReservations = mThis.getReservationsForDate(date, mThis.selectedBuilding?.id);
            const isToday = date.toDateString() === today.toDateString();
            const dateStr = date.toISOString().split('T')[0];

            let dayHTML = `
                <div class="calendar-day" data-date="${dateStr}" 
                     style="min-height: 50px; padding: 0.75rem; background: ${isToday ? '#fff9f5' : '#fafafa'}; 
                            border: ${isToday ? '2px solid #1a1647' : '1px solid #e8dfd7'}; 
                            border-radius: 8px; cursor: pointer; position: relative; 
                            transition: all 0.3s;">
                    <div style="font-weight: ${isToday ? '700' : '500'}; font-size: 1.1rem; 
                                color: ${isToday ? '#1a1647' : '#2c2419'}; margin-bottom: 0.5rem;">
                        ${date.getDate()}
                    </div>`;

            dayReservations.slice(0, 2).forEach(res => {
                const building = mThis.buildings.find(b => b.id === res.buildingId);
                dayHTML += `
                    <div style="font-size: 0.7rem; padding: 0.25rem 0.5rem; background: #1a1647; 
                                color: white; border-radius: 4px; margin-bottom: 0.25rem; 
                                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${building.name.substring(0, 12)}${building.name.length > 12 ? '...' : ''}
                    </div>`;
            });

            if (dayReservations.length > 2) {
                dayHTML += `
                    <div style="font-size: 0.7rem; color: #8b7355; font-weight: 600;">
                        +${dayReservations.length - 2} more
                    </div>`;
            }

            dayHTML += '</div>';
            return dayHTML;
        }).join('');

        calendarGrid.innerHTML = gridHTML;

        // Add click handlers and hover effects to calendar days
        calendarGrid.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', () => {
                const dateStr = day.dataset.date;
                mThis.openBookingModal(dateStr);
            });

            day.addEventListener('mouseenter', () => {
                day.style.transform = 'scale(1.05)';
                day.style.boxShadow = '0 4px 12px rgba(26, 22, 71, 0.15)';
                day.style.zIndex = '10';
            });

            day.addEventListener('mouseleave', () => {
                day.style.transform = 'scale(1)';
                day.style.boxShadow = 'none';
                day.style.zIndex = '1';
            });
        });

        
    };

    mThis.renderReservations = () => {
        const reservationsList = document.getElementById('reservationsList');
        const reservationsTitle = document.getElementById('reservationsTitle');
        const reservationCount = document.getElementById('reservationCount');
        if (!reservationsList || !reservationsTitle) return;

        const filteredReservations = mThis.selectedBuilding
            ? mThis.reservations.filter(res => res.buildingId === mThis.selectedBuilding.id)
            : mThis.reservations;

        reservationsTitle.textContent = `All Reservations${mThis.selectedBuilding ? ` - ${mThis.selectedBuilding.name}` : ''}`;
        
        if (reservationCount) {
            reservationCount.textContent = `${filteredReservations.length} Reservation${filteredReservations.length !== 1 ? 's' : ''}`;
        }

        let html = '';
        filteredReservations.forEach((res, index) => {
            const building = mThis.buildings.find(b => b.id === res.buildingId);
            html += `
                <div class="reservation-item" style="padding: 1.5rem; background: #f9f6f3; border-radius: 8px; 
                                                     display: grid; grid-template-columns: 1fr auto; gap: 1rem; 
                                                     align-items: center; border-left: 4px solid #1a1647; 
                                                     margin-bottom: 1rem; transition: all 0.3s; cursor: pointer;"
                     data-index="${index}">
                    <div>
                        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem; flex-wrap: wrap; align-items: center;">
                            <div style="font-weight: 600; font-size: 1.1rem; color: #1a1647;">${res.event}</div>
                            <div style="padding: 0.25rem 0.75rem; background: #1a1647; color: white; 
                                        border-radius: 20px; font-size: 0.85rem;">
                                ${building.name}
                            </div>
                        </div>
                        <div style="display: flex; gap: 1.5rem; font-size: 0.95rem; color: #8b7355; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-regular fa-calendar"></i>
                                ${mThis.formatDate(res.date)}
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-regular fa-clock"></i>
                                ${mThis.formatTime(res.startTime)} - ${mThis.formatTime(res.endTime)}
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-regular fa-user"></i>
                                ${res.renterName}
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-users"></i>
                                ${res.attendees} attendees
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete-reservation btn btn-sm" 
                            data-id="${res.id}"
                            style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; 
                                   border-radius: 6px; transition: all 0.3s;">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>`;
        });

        reservationsList.innerHTML = html || `
            <div style="text-align: center; padding: 4rem 2rem;">
                <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: #e8dfd7; margin-bottom: 1rem;"></i>
                <p style="color: #8b7355; font-size: 1.1rem;">No reservations found</p>
            </div>`;

        // Add delete handlers and hover effects
        reservationsList.querySelectorAll('.btn-delete-reservation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                mThis.deleteReservation(id);
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.background = '#c82333';
                btn.style.transform = 'scale(1.1)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = '#dc3545';
                btn.style.transform = 'scale(1)';
            });
        });

        // Add hover effects to reservation items
        reservationsList.querySelectorAll('.reservation-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.boxShadow = '0 4px 16px rgba(26, 22, 71, 0.15)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = 'none';
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
            onClose: (success) => {
                if (success) {
                    mThis.renderAll();
                }
            }
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
            const f = el.dataset.field;
            p[f] = el.value;
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
            mThis.setDataList();
            mThis.renderAll();
        });
    };

    return mThis;
})();

const ReservationDialog = (() => {
    const self = {};

    self.show = (op) => {
        // Create a NEW dialog every time — no caching
        const dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12">
                            <label style="padding-left:6px;">Meeting Room Name</label>
                            <div class="material-input outlined">
                                <input type="text" name="name" required class="data-input form-control" data-field="amenity_name" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;">Category</label>
                            <div class="material-input outlined">
                                <input type="text" name="category" required class="data-input form-control" data-field="category" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;">Floor</label>
                            <div class="material-input outlined">
                                <input type="text" name="floor" required class="data-input form-control" data-field="floor" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="padding-left:6px;">Location Detail</label>
                            <div class="material-input outlined">
                                <input type="text" name="location" required class="data-input form-control" data-field="location_detail" placeholder=" " />
                            </div>
                        </div>
                        <div class="col-12">
                            <label style="padding-left:6px;">Description</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for="access_level">Access Level</label>
                            <div class="material-input outlined">
                                <select name ="access_level" class="data-input form-control" data-field="access_level" placeholder=" ">
                                    <option value="All Tenants">All Tenants</option>
                                    <option value="Management Only">Management Only</option>
                                    <option value="Staff Only">Staff Only</option>
                                    <option value="Admin Only">Admin Only</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;">Max Capacity</label>
                            <div class="material-input outlined">
                                <input type="number" name="capacity" required class="data-input form-control" data-field="max_capacity" min="0" value="0 " placeholder=" " />
                            </div>
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for ="requires_booking">Requires Booking</label>
                            <div class="material-input outlined">
                                <select name="requirebooking" class="data-input form-control" data-field="requires_booking" placeholder=" ">
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                            </div>    
                        </div>
                        <div class="col-6">
                            <label style="padding-left:6px;" for="is_available">Available</label>
                            <div class="material-input outlined">
                                <select name="available" class="data-input form-control" data-field="is_available" placeholder=" ">
                                    <option value="1">Available</option>
                                    <option value="0">Unavailable</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="d-none material-input outlined">
                                <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                <label>Status ID</label>
                            </div>
                        </div>
                    </div>`;
            },

            contentCreated: (me) => {
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');
                const btnClose = header.querySelector('button');

                btnClose.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);
                header.innerHTML = '';
                header.appendChild(headerWrapper);

                // Populate building dropdown
                const buildingSelect = me.controls.building_id;
                ReservationComponent.buildings.forEach(building => {
                    const option = document.createElement('option');
                    option.value = building.id;
                    option.textContent = `${building.name} - ${building.location} (Cap. ${building.capacity})`;
                    buildingSelect.appendChild(option);
                });

                // Set minimum date to today
                const today = new Date().toISOString().split('T')[0];
                me.controls.date.min = today;

                // Set clicked date — works because this is a fresh dialog every time
                if (me.dataOptions && me.dataOptions.date) {
                    me.controls.date.value = me.dataOptions.date;
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
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span>Create Reservation</span>',
                    cssClass: 'btn-vs-save',
                    click: (me, btn) => {
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
                            parseInt(data.building_id),
                            data.date,
                            data.start_time,
                            data.end_time
                        );

                        if (hasConflict) {
                            cv_interact.error('Time slot conflict! This building is already booked during this time.');
                            return;
                        }

                        const building = ReservationComponent.buildings.find(b => b.id === parseInt(data.building_id));
                        if (parseInt(data.attendees) > building.capacity) {
                            cv_interact.warning(`Warning: Number of attendees (${data.attendees}) exceeds building capacity (${building.capacity})`);
                        }

                        const newReservation = {
                            id: Date.now(),
                            buildingId: parseInt(data.building_id),
                            date: data.date,
                            startTime: data.start_time,
                            endTime: data.end_time,
                            renterName: data.renter_name,
                            event: data.event,
                            attendees: parseInt(data.attendees)
                        };

                        ReservationComponent.reservations.push(newReservation);
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