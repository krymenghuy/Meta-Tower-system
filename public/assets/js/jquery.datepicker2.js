/**
* jQuery DatePicker
* @author biohzrdmx <github.com/biohzrdmx>
* @version 2.0
* @requires jQuery 1.8+
* @license MIT
*/
/** This file is modifed by Mr. Samsethy, so it is not same as nornally downloaded jquery.datepicker2.js. 
THE FLOWWING CHANGES IS ADDED:
   1. This file is customized to depend on method DateHelper.isDate() in DateHelper.js for purpose of Date validation 
   2. Added event handler for "keyup" event and "blur"
   3. Prevent Datepicker widget from being displayed when the Input box is readOnly. See somewhere around line 305 to 307

**/
; (function ($) {
	$.datePicker = {
		defaults: {
			container: 'body',
			mode: 'popup',
			select: 'single',
			theme: 'theme-light',
			show: 'month',
			doubleSize: false,
			restrictDates: false,
			disableAnimations: false,
			strings: {
				months: [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				],
				days: [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday'
				]
			},
			views: {
				decade: {
					show: null,
					selected: [],
					disabled: [],
					forbidden: [],
					enabled: [],
					marked: []
				},
				year: {
					show: null,
					selected: [],
					disabled: [],
					forbidden: [],
					enabled: [],
					marked: []
				},
				month: {
					show: null,
					selected: [],
					disabled: [],
					forbidden: [],
					enabled: [],
					marked: [],
					firstDayOfWeek: 0
				}
			},
			templates: {
				widget: '<div class="jquery-datepicker">',
				header: '<div class="box-row row-header"><div class="header-title">{title}</div><div class="header-actions"><div class="header-action action-down"></div><div class="header-action action-up"></div></div></div>'
			},
			callbacks: {
				onCreate: function (calendar) {
					// Do nothing
				},
				onShow: function (calendar) {
					// Do nothing
				},
				onViewDecade: function (calendar, date) {
					return true;
				},
				onViewYear: function (calendar, date) {
					return true;
				},
				onViewMonth: function (calendar, date) {
					return true;
				},
				onChangeDecade: function (calendar, date, direction) {
					return true;
				},
				onChangeYear: function (calendar, date, direction) {
					return true;
				},
				onChangeMonth: function (calendar, date, direction) {
					return true;
				},
				onChangeDay: function (calendar, date, direction) {
					//$(this).options.element.trigger('change');
					return true;
				},
				onCheckCell: function (cell, date, type) {
					return false;
				},
				onRenderCell: function (cell, date, type) {
					// Do nothing
				},
				onHide: function (calendar) {
					// Do nothing
				}
			},
			animate: function (el, anim, callback) {
				if (this.disableAnimations) {
					callback(el);
				} else {
					switch (anim) {
						case 'fadeOut':
							el.css({ opacity: 1 }).animate({ opacity: 0 }, {
								duration: 150,
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideLeftOut':
							el.css({ opacity: 1 }).animate({ opacity: 0, translateX: 8 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateX') {
										el.css('transform', 'translateX(' + now + 'px)');
									}
								},
								complete: function () {
									el.css('transform', 'translateX(0)');
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideRightOut':
							el.css({ opacity: 1 }).animate({ opacity: 0, translateX: -8 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateX') {
										el.css('transform', 'translateX(' + now + 'px)');
									}
								},
								complete: function () {
									el.css('transform', 'translateX(0)');
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideDownOut':
							el.css({ opacity: 1 }).animate({ opacity: 0, translateY: 0 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateY') {
										el.css('transform', 'translateY(' + (8 - now) + 'px)');
									}
								},
								complete: function () {
									el.css('transform', 'translateY(0)');
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideUpOut':
							el.css({ opacity: 1 }).animate({ opacity: 0, translateY: 0 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateY') {
										el.css('transform', 'translateY(' + -(8 - now) + 'px)');
									}
								},
								complete: function () {
									el.css('transform', 'translateY(0)');
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'fadeIn':
							el.css({ opacity: 0 }).animate({ opacity: 1 }, {
								duration: 150,
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideLeftIn':
							el.css({ opacity: 0, transform: 'translateX(8px)' }).animate({ opacity: 1, translateX: 0 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateX') {
										el.css('transform', 'translateX(' + (-now) + 'px)');
									}
								},
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideRightIn':
							el.css({ opacity: 0, transform: 'translateX(-8px)' }).animate({ opacity: 1, translateX: 0 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateX') {
										el.css('transform', 'translateX(' + (-now) + 'px)');
									}
								},
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideUpIn':
							el.css({ opacity: 0, transform: 'translateY(8px)' }).animate({ opacity: 1, translateY: 8 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateY') {
										el.css('transform', 'translateY(' + (8 - now) + 'px)');
									}
								},
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
						case 'slideDownIn':
							el.css({ opacity: 0, transform: 'translateY(-8px)' }).animate({ opacity: 1, translateY: 8 }, {
								duration: 150,
								step: function (now, tween) {
									if (tween.prop == 'translateY') {
										el.css('transform', 'translateY(' + -(8 - now) + 'px)');
									}
								},
								complete: function () {
									if (!!callback) {
										callback(el);
									}
								}
							});
							break;
					}
				}
			},
			dateFormat: function (date) {
				return [this.pad(date.getDate(), 2), '-', date.toLocaleString('default', { month: 'short' }), '-', date.getFullYear()].join('');
				//return [this.pad(date.getDate(), 2), '-',this.pad(date.getMonth() + 1, 2), '-' , date.getFullYear()].join('');
			},
			dateParse: function (string) {
				return $.datePicker.api.date(string);
			},
			pad: function (n, width, z) {
				z = z || '0';
				n = n + '';
				return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
			}
		},
		api: {
			date: function (string) {
				let date = null;
				if (string instanceof Date) {
					date = new Date(string);
				} else {
					let parts = string.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
					if (parts && parts.length == 4) {
						date = new Date(parts[3], parts[1] - 1, parts[2]);
					}
				}
				return date;
			},
			show: function (options) {
				let other = $('.jquery-datepicker.is-popup'),
					widget = $.datePicker.api.createWidget(options);
				if (other.length) {
					$.datePicker.api.hide(other);
				}
				/* Check if the input field is Readonly then Do not show Select Date view */
				if (options.element.prop('readOnly') == true) return;

				widget.addClass('is-open');
				widget.options.originalValue = widget.options.element.val();
				widget.options.animate(widget, widget.hasClass('tip-above') ? 'slideDownIn' : 'slideUpIn', function () {
					widget.options.callbacks.onShow(widget);

				});
				return widget;
			},
			hide: function (widget) {
				widget = widget || $('.jquery-datepicker.is-popup');
				widget = widget.length ? widget.eq(0) : null;
				if (widget.length && widget.is(':visible')) {
					widget.options = widget.data('options');
					widget.options.animate(widget, widget.hasClass('tip-above') ? 'slideUpOut' : 'slideDownOut', function () {
						widget.removeClass('is-open');
						widget.options.callbacks.onHide(widget);
						widget.remove();

						//Fire input's Change event when the Datepicker widger is closed
						let newVal = widget.options.element.val();
						if (widget.options.originalValue != newVal) widget.options.element.trigger('change');
					});
				}
				return widget;
			},
			createWidget: function (options) {
				let opts = $.extend(true, {}, $.datePicker.defaults, options),
					widget = $(opts.templates.widget);
				// Check container instance
				opts.container = opts.container instanceof jQuery ? opts.container : $(opts.container);
				opts.element = opts.element instanceof jQuery ? opts.element : $(opts.element);
				// Set default initial values
				opts.views.decade.show = !opts.views.decade.show ? new Date() : opts.dateParse(opts.views.decade.show);
				opts.views.year.show = !opts.views.year.show ? new Date() : opts.dateParse(opts.views.year.show);
				opts.views.month.show = !opts.views.month.show ? new Date() : opts.dateParse(opts.views.month.show);
				// Create components
				widget.data('options', opts);
				widget.options = opts;
				widget.views = {};
				widget.views.decade = $.datePicker.api.createDecadeView(opts);
				widget.views.year = $.datePicker.api.createYearView(opts);
				widget.views.month = $.datePicker.api.createMonthView(opts);
				widget.append(widget.views.decade);
				widget.append(widget.views.year);
				widget.append(widget.views.month);
				// Show active view
				switch (opts.show) {
					case 'decade':
						widget.views.decade.addClass('is-active');
						break;
					case 'year':
						widget.views.year.addClass('is-active');
						break;
					case 'month':
						widget.views.month.addClass('is-active');
						break;
				}
				// Add widget to container
				opts.container.append(widget);
				switch (opts.mode) {
					case 'inline':
						widget.addClass('is-open').addClass('is-inline');
						break;
					case 'popup':
						if (opts.element.length) {
							let offset = opts.element.offset(),
								viewportWidth = window.innerWidth;
							elementSize = { x: opts.element.outerWidth(), y: opts.element.outerHeight() },
								widgetSize = { x: widget.outerWidth(), y: widget.outerHeight() };
							if (offset.top > (widgetSize.y + 15)) {
								widget.addClass('tip-below');
								widget.css('top', (offset.top - widgetSize.y - 15) + 'px');
							} else {
								widget.addClass('tip-above');
								widget.css('top', (offset.top + elementSize.y + 15) + 'px');
							}
							if (offset.left < viewportWidth / 2) {
								widget.addClass('tip-left');
								widget.css('left', offset.left + 'px');
							} else {
								widget.addClass('tip-right');
								widget.css('left', ((offset.left + elementSize.x) - widgetSize.x) + 'px');
							}
						}
						widget.addClass('is-popup');
						//
						$(document).on('mouseup', function (e) {
							if (!widget.is(e.target) // if the target of the click isn't the container...
								&& widget.has(e.target).length === 0) // ... nor a descendant of the container
							{
								$(document).off('mouseup');
								$.datePicker.api.hide(widget);
							}
						});
						break;
				}
				// Bind decade viewer events
				widget.views.decade.on('click', '.header-title', function (e) {
					let el = $(this);
					e.preventDefault();
				});
				widget.views.decade.on('click', '.action-down', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeDecade(widget, new Date(opts.views.decade.show), 'down')) {
						opts.animate(widget.views.decade, 'slideLeftOut', function () {
							widget.views.decade.empty();
							opts.views.decade.show.setYear(opts.views.decade.show.getFullYear() - 10);
							$.datePicker.api.createDecadeView(opts, widget.views.decade);
							opts.animate(widget.views.decade, 'slideRightIn');
						});
					}
				});
				widget.views.decade.on('click', '.action-up', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeDecade(widget, new Date(opts.views.decade.show), 'up')) {
						opts.animate(widget.views.decade, 'slideRightOut', function () {
							widget.views.decade.empty();
							opts.views.decade.show.setYear(opts.views.decade.show.getFullYear() + 10);
							$.datePicker.api.createDecadeView(opts, widget.views.decade);
							opts.animate(widget.views.decade, 'slideLeftIn');
						});
					}
				});
				widget.views.decade.on('click', '.cell-day', function (e) {
					let cell = $(this),
						date = cell.data('date');
					e.preventDefault();
					if (!cell.hasClass('cell-grayed')) {
						if (opts.callbacks.onChangeYear(widget, $.datePicker.api.date(date), false)) {
							widget.views.year.empty();
							opts.views.year.show = $.datePicker.api.date(date);
							$.datePicker.api.createYearView(opts, widget.views.year);
						}
						if (opts.callbacks.onViewYear(widget, $.datePicker.api.date(date))) {
							opts.animate(widget.views.decade, 'fadeOut', function () {
								widget.views.decade.removeClass('is-active');
								widget.views.year.addClass('is-active');
								opts.animate(widget.views.year, 'fadeIn');
							});
						}
					}
				});
				// Bind year viewer events
				widget.views.year.on('click', '.header-title', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onViewDecade(widget, opts.views.decade.show)) {
						opts.animate(widget.views.year, 'fadeOut', function () {
							// Regenerate decades viewer if required
							if (opts.views.decade.show.getFullYear() != opts.views.year.show.getFullYear()) {
								widget.views.decade.empty();
								opts.views.decade.show.setYear(opts.views.year.show.getFullYear());
								$.datePicker.api.createDecadeView(opts, widget.views.decade);
							}
							// Show decades viewer
							widget.views.year.removeClass('is-active');
							widget.views.decade.addClass('is-active');
							opts.animate(widget.views.decade, 'fadeIn');
						});
					}
				});
				widget.views.year.on('click', '.action-down', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeYear(widget, new Date(opts.views.year.show), 'down')) {
						opts.animate(widget.views.year, 'slideLeftOut', function () {
							widget.views.year.empty();
							opts.views.year.show.setYear(opts.views.year.show.getFullYear() - 1);
							$.datePicker.api.createYearView(opts, widget.views.year);
							opts.animate(widget.views.year, 'slideRightIn');
						});
					}
				});
				widget.views.year.on('click', '.action-up', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeYear(widget, new Date(opts.views.year.show), 'up')) {
						opts.animate(widget.views.year, 'slideRightOut', function () {
							widget.views.year.empty();
							opts.views.year.show.setYear(opts.views.year.show.getFullYear() + 1);
							$.datePicker.api.createYearView(opts, widget.views.year);
							opts.animate(widget.views.year, 'slideLeftIn');
						});
					}
				});
				widget.views.year.on('click', '.cell-day', function (e) {
					let cell = $(this),
						date = cell.data('date');
					e.preventDefault();
					if (!cell.hasClass('cell-grayed')) {
						if (opts.callbacks.onChangeMonth(widget, $.datePicker.api.date(date), false)) {
							widget.views.month.empty();
							opts.views.month.show = $.datePicker.api.date(date);
							$.datePicker.api.createMonthView(opts, widget.views.month);
						}
						if (opts.callbacks.onViewMonth(widget, $.datePicker.api.date(date))) {
							opts.animate(widget.views.year, 'fadeOut', function () {
								widget.views.year.removeClass('is-active');
								widget.views.month.addClass('is-active');
								opts.animate(widget.views.month, 'fadeIn');
							});
						}
					}
				});
				// Bind month viewer events
				widget.views.month.on('click', '.header-title', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onViewYear(widget, opts.views.year.show)) {
						opts.animate(widget.views.month, 'fadeOut', function () {
							// Regenerate years viewer
							if (opts.views.year.show.getFullYear() != opts.views.month.show.getFullYear()) {
								widget.views.year.empty();
								opts.views.year.show.setYear(opts.views.month.show.getFullYear());
								$.datePicker.api.createYearView(opts, widget.views.year);
							}
							// Show years viewer
							widget.views.month.removeClass('is-active');
							widget.views.year.addClass('is-active');
							opts.animate(widget.views.year, 'fadeIn');
						});
					}
				});
				widget.views.month.on('click', '.action-down', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeMonth(widget, new Date(opts.views.month.show), 'down')) {
						opts.animate(widget.views.month, 'slideLeftOut', function () {
							let otherMonth = opts.views.month.show.getMonth() - 1;
							if (otherMonth < 0) {
								opts.views.month.show.setYear(opts.views.month.show.getFullYear() - 1);
								otherMonth = 11;
							}
							widget.views.month.empty();
							opts.views.month.show.setMonth(otherMonth);
							$.datePicker.api.createMonthView(opts, widget.views.month);
							opts.animate(widget.views.month, 'slideRightIn');
						});
					}
				});
				widget.views.month.on('click', '.action-up', function (e) {
					let el = $(this);
					e.preventDefault();
					if (opts.callbacks.onChangeMonth(widget, new Date(opts.views.month.show), 'up')) {
						opts.animate(widget.views.month, 'slideRightOut', function () {
							let otherMonth = opts.views.month.show.getMonth() + 1;
							if (otherMonth > 11) {
								opts.views.month.show.setYear(opts.views.month.show.getFullYear() + 1);
								otherMonth = 0;
							}
							widget.views.month.empty();
							opts.views.month.show.setMonth(otherMonth);
							$.datePicker.api.createMonthView(opts, widget.views.month);
							opts.animate(widget.views.month, 'slideLeftIn');
						});
					}
				});
				widget.views.month.on('click', '.cell-day', function (e) {
					let cell = $(this),
						date = cell.data('date');
					e.preventDefault();
					if (!cell.hasClass('cell-grayed') && !cell.hasClass('cell-forbidden')) {
						if (opts.callbacks.onChangeDay(widget, $.datePicker.api.date(date))) {
							// For single selection mode, deselect everything first
							if (opts.select == 'single') {
								opts.views.month.selected = [];
								widget.views.month.find('.cell-day').removeClass('cell-selected');
								if (opts.mode == 'popup') {
									$.datePicker.api.hide(widget);
									opts.element.val(opts.dateFormat(date));
								}
							}
							cell.addClass('cell-selected');
							opts.views.month.selected.push($.datePicker.api.date(date));
						}
					}
				});
				// Add theme class
				widget.addClass(opts.theme);
				if (opts.doubleSize) {
					widget.addClass('is-2x');
				}
				// Callback
				opts.callbacks.onCreate(widget);
				// Return the widget object
				return widget;
			},
			createHeader: function (title, opts) {
				let ret = $(opts.templates.header.replace('{title}', title));
				return ret;
			},
			createDecadeView: function (opts, box) {
			   box = box || $('<div class="datepicker-box"></div>'),
					settings = opts.views.decade,
					decade = settings.show.getFullYear() - (settings.show.getFullYear() % 10),
					title = decade + '-' + (decade + 9),
					header = $.datePicker.api.createHeader(title, opts),
					values = [];
				// Build values array
				for (let i = 0, v = decade - 3; i < 16; i++, v++) {
					values.push(v);
				}
				header.addClass('js-header-decade');
				box.append(header);
				box.addClass('box-decade');
				// Add rows
				let rows = [];
				for (let i = 0; i < 4; i++) {
					let row = $('<div class="box-row row-week"></div>');
					rows.push(row);
					box.append(row);
				}
				// Today
				let today = new Date();
				today.setMonth(0);
				today.setDate(1);
				// Add months
				for (let i = 0, j = 0, d = 1; i < 16; i++, d++) {
					let row = rows[j],
						day = $('<div class="box-cell cell-day">' + values[i] + '</div>');
					row.append(day);
					if (d > 3) {
						d = 0;
						j++;
					}
					// Save date
					let date = '01-01-' + values[i];
					date = $.datePicker.api.date(date);
					day.data('date', date);
					// Grayed years
					let disabled = false;
					// Use a preset for restricted dates or a custom function
					switch (opts.restrictDates) {
						case 'past':
							disabled = date > today;
							break;
						case 'future':
							disabled = date.toDateString() != today.toDateString() && date < today;
							break;
						case 'custom':
							disabled = !opts.callbacks.onCheckCell(day, date, 'year');
							break;
					}
					if (i < 3 || i >= 16 - 3 || disabled) {
						day.addClass('cell-grayed');
					} else {
						// Today
						if (date.toDateString() == today.toDateString()) {
							day.addClass('cell-today');
						}
					}
					opts.callbacks.onRenderCell(day, date, 'year');
				}
				return box;
			},
			createYearView: function (opts, box) {
				box = box || $('<div class="datepicker-box"></div>'),
					settings = opts.views.year,
					title = settings.show.getFullYear(),
					header = $.datePicker.api.createHeader(title, opts),
					values = [];
				// Build values array
				for (let i = 0; i < 12; i++) {
					values.push(opts.strings.months[i]);
				}
				// Add header
				header.addClass('js-header-year');
				box.append(header);
				box.addClass('box-year');
				// Add rows
				let rows = [];
				for (let i = 0; i < 3; i++) {
					let row = $('<div class="box-row row-week"></div>');
					rows.push(row);
					box.append(row);
				}
				// Today
				let today = new Date();
				today.setDate(1);
				// Add months
				for (let i = 0, j = 0, d = 1; i < 12; i++, d++) {
					let row = rows[j],
						day = $('<div class="box-cell cell-day">' + values[i].substring(0, 3) + '</div>');
					row.append(day);
					if (d > 3) {
						d = 0;
						j++;
					}
					// Save date
					let date = (i + 1) + '-01-' + settings.show.getFullYear();
					date = $.datePicker.api.date(date);
					day.data('date', date);
					// Grayed months
					let disabled = false;
					// Use a preset for restricted dates or a custom function
					switch (opts.restrictDates) {
						case 'past':
							disabled = date > today;
							break;
						case 'future':
							disabled = date.toDateString() != today.toDateString() && date < today;
							break;
						case 'custom':
							disabled = !opts.callbacks.onCheckCell(day, date, 'month');
							break;
					}
					if (disabled) {
						day.addClass('cell-grayed');
					}
					// Today
					if (date.toDateString() == today.toDateString()) {
						day.addClass('cell-today');
					}
					opts.callbacks.onRenderCell(day, date, 'month');
				}
				return box;
			},
			createMonthView: function (opts, box) {
				    box = box || $('<div class="datepicker-box"></div>'),
					settings = opts.views.month,
					title = opts.strings.months[settings.show.getMonth()] + ' ' + settings.show.getFullYear(),
					header = $.datePicker.api.createHeader(title, opts),
					daysInMonth = new Date(settings.show.getFullYear(), settings.show.getMonth() + 1, 0).getDate(),
					firstDayOfMonth = new Date(settings.show.getFullYear(), settings.show.getMonth(), 1).getDay(),
					lastMonth = settings.show.getMonth() == 0 ? 11 : settings.show.getMonth() - 1,
					lastMonthYear = settings.show.getFullYear() - (settings.show.getMonth() == 0 ? 1 : 0),
					nextMonth = settings.show.getMonth() == 11 ? 0 : settings.show.getMonth() + 1,
					nextMonthYear = settings.show.getFullYear() + (settings.show.getMonth() == 11 ? 1 : 0),
					lastDayOfPastMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate(),
					values = [];
				// Build values array
				for (let i = 0; i < daysInMonth; i++) {
					values.push(i + 1);
				}
				// Add header
				header.addClass('js-header-month');
				box.append(header);
				box.addClass('box-month');
				// Offset days of week depending on the first day of week
				settings.firstDayOfWeek = settings.firstDayOfWeek < 0 ? 0 : (settings.firstDayOfWeek > 6 ? 6 : settings.firstDayOfWeek);
				let dayNames = opts.strings.days.slice();
				if (settings.firstDayOfWeek > 0) {
					let plucked = dayNames.splice(0, settings.firstDayOfWeek);
					dayNames = dayNames.concat(plucked);
				}
				let row = $('<div class="box-row row-days"></div>');
				// Add weekdays row
				for (let i = 0; i < 7; i++) {
					row.append('<div class="box-cell cell-day">' + dayNames[i].substring(0, 2) + '</div>');
				}
				box.append(row);
				// Pad month days with extra grayed days
				let daysBefore = firstDayOfMonth - settings.firstDayOfWeek,
					daysAfter = 42 - (daysInMonth + daysBefore);
				if (daysBefore < 0) {
					daysBefore = 7 + daysBefore;
					daysAfter = 42 - (daysInMonth + daysBefore);
				}
				// Prepend days before
				let temp = [];
				for (let i = 1; i <= daysBefore; i++) {
					temp.push(lastDayOfPastMonth - (daysBefore - i));
				}
				values = temp.concat(values);
				// Append days after
				temp = [];
				for (let i = 1; i <= daysAfter; i++) {
					temp.push(i);
				}
				values = values.concat(temp);
				// Add weeks
				let weeks = [];
				for (let i = 0; i < 6; i++) {
					let week = $('<div class="box-row row-week"></div>');
					weeks.push(week);
					box.append(week);
				}
				// Today
				let today = new Date();
				// Add days to weeks
				for (let i = 0, j = 0, d = 1; i < 42; i++, d++) {
					let week = weeks[j],
						day = $('<div class="box-cell cell-day">' + values[i] + '</div>');
					week.append(day);
					if (d > 6) {
						d = 0;
						j++;
					}
					// Save date
					let date = '';
					if (i < daysBefore) {
						date = (lastMonth + 1) + '-' + values[i] + '-' + lastMonthYear;
					} else if (i >= 42 - daysAfter) {
						date = (nextMonth + 1) + '-' + values[i] + '-' + nextMonthYear;
					} else {
						date = (settings.show.getMonth() + 1) + '-' + values[i] + '-' + settings.show.getFullYear();
					}
					date = $.datePicker.api.date(date);
					day.data('date', date);
					// Grayed days
					let disabled = false;
					if (settings.enabled.length) {
						disabled = true;
						// Iterate enabled dates
						for (let n = 0; n < settings.enabled.length; n++) {
							if (!settings.enabled[n].length) continue;
							if (typeof settings.enabled[n] === 'string') settings.enabled[n] = $.datePicker.api.date(settings.enabled[n]);
							if (date.toDateString() == settings.enabled[n].toDateString()) {
								disabled = false;
								break;
							}
						}
					} else {
						// Use a preset for restricted dates or a custom function
						switch (opts.restrictDates) {
							case 'past':
								disabled = date > today;
								break;
							case 'future':
								disabled = date.toDateString() != today.toDateString() && date < today;
								break;
							case 'custom':
								disabled = !opts.callbacks.onCheckCell(day, date, 'day');
								break;
						}
					}
					//
					if (i < daysBefore || i >= 42 - daysAfter || disabled) {
						day.addClass('cell-grayed');
					} else {
						// Today
						if (date.toDateString() == today.toDateString()) {
							day.addClass('cell-today');
						}
						// Disabled
						if (settings.disabled.length) {
							for (let n = 0; n < settings.disabled.length; n++) {
								if (typeof settings.disabled[n] === 'string') settings.disabled[n] = $.datePicker.api.date(settings.disabled[n]);
								if (settings.disabled[n] && date.toDateString() == settings.disabled[n].toDateString()) {
									day.addClass('cell-grayed');
									break;
								}
							}
						}
						// Forbidden
						if (settings.forbidden.length) {
							for (let n = 0; n < settings.forbidden.length; n++) {
								if (typeof settings.forbidden[n] === 'string') settings.forbidden[n] = $.datePicker.api.date(settings.forbidden[n]);
								if (settings.forbidden[n] && date.toDateString() == settings.forbidden[n].toDateString()) {
									day.addClass('cell-forbidden');
									break;
								}
							}
						}
						// Marked
						if (settings.marked.length) {
							for (let n = 0; n < settings.marked.length; n++) {
								if (typeof settings.marked[n] === 'string') settings.marked[n] = $.datePicker.api.date(settings.marked[n]);
								if (settings.marked[n] && date.toDateString() == settings.marked[n].toDateString()) {
									day.addClass('cell-marked');
									break;
								}
							}
						}
						// Selected
						if (settings.selected.length) {
							for (let n = 0; n < settings.selected.length; n++) {
								if (typeof settings.selected[n] === 'string') settings.selected[n] = $.datePicker.api.date(settings.selected[n]);
								if (settings.selected[n] && date.toDateString() == settings.selected[n].toDateString()) {
									day.addClass('cell-selected');
									break;
								}
							}
						}
					}
					opts.callbacks.onRenderCell(day, date, 'day');
				}
				return box;
			}
		}
	};
  
	  window.addEventListener('DOMContentLoaded',function() {
		$("[data-select=datepicker]").each(function(){
			DateTimePicker.init($(this));
		});		
		 
	  });
})(jQuery);

let DateTimePicker = new function(){
	//initDatePicker() initTimePicker()
	//NOTE: $input is jquery object, NOT normal javascript object
	this.init =(input)=>{
		//let input = $(this);
		input.attr('placeholder', 'dd-mm-yyyy');
		input.attr('autocomplete', 'off');
		input.on('click', function () {
			let val = input.val();
			let date = val ? $.datePicker.defaults.dateParse(val) : null;
			let widget = $.datePicker.api.show({
				views: {
					month: {
						show: val ? date : '',
						selected: val ? [date] : []
					}
				},
				element: input
			});

			input.data('widget', widget);
		});

		//$(this).on('keypress',function(e) {
		//	if (e.keyCode != 37)  //arrow left //arrow right = 39
		//	{
		//		return false;
		//	}					
		//})
		let num_lock_key_values = ['`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
		input.on('keyup', function (event, ui) {

			if (event.keyCode == 13) {
				input.trigger('blur');
				return;
			}
			let key = String.fromCharCode(event.keyCode);
			if (!(key >= 0 && key <= 9) && num_lock_key_values.indexOf(key) < 0) $(this).val($(this).val().substr(0, $(this).val().length - 1));
			let value = $(this).val();
			if (value.length == 1 && (event.keyCode == 32 || event.keyCode == 191 || event.keyCode == 220 || event.keyCode == 111)) $(this).val('0' + $(this).val() + '-');

			if (value.length == 2) {
				$(this).val($(this).val() + '-');
			}
			else if (value.length == 4) {
				let st = value.split('-');
				if (parseInt(st[1]) > 1) {
					input.val([st[0], '-', st[1], '-'].join(''));
				}
				else {
					if (event.keyCode == 32) {
						input.val($(this).val() + '-');
					}
				}

			}
			else if (value.length == 5) {
				if (value.slice(-1) != '-')
					$(this).val($(this).val() + '-');
			}
		});

		input.on('blur', function (event, ui) {
			let d = $(this).val();
			let ss = d.split('-');
			let dd = ss[0];
			let mm = ss[1]; //NOTE that mm can be either Month Number or Three-character month name such as jan or Feb or Mar
			let yy = ss[2];
			if (yy == 0) {
				yy = 2000;
			} else if (yy < 99) {
				yy = ['20', yy].join('');
			}

			d = [dd, '-', mm, '-', yy].join('');

			if (DateHelper.isDate(d)) {
				$(this).parent().removeClass('has-error');
				//d = $.datepicker.formatDate('dd-M-yy', new Date(d)); //this is original line: but it convert from, for example: 2-08-2016 to 08-Feb-2016, while the intended format is 02-Aug-2016
				//$(this).val(d);
				$(this).val(DateHelper.formatDate(d));
			} else {
				if ((d + '').toLowerCase() == 'all dates') return;
				$(this).parent().addClass('has-error');
			}
		});
		
	}
}