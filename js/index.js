
var CalendarEvents = {
	"monthly": [
	{
		"name": "Telecon with Nishu (HR)",
		"startdate": "2017-05-11",
		"color": "#629e62",
		"url":"#"
	},
	{
		"name": "Interview with Mr. Durga Prasad",
		"startdate": "2017-05-17",
		"color": "#629e62",
		"url":"#"
	},
	]
};
var arr = CalendarEvents.monthly;
$(window).load( function() {
	$('#mycalendar').monthly({
		mode: 'event',
		dataType: 'json',
		events: CalendarEvents
	});
});

$.each( arr, function( i, val ) {
	$('.cards').append('<div class=inner><div class=innerDate>'+val.startdate+'</div><div class=innerTitle>'+val.name+'</div></div>')
});

$('#addTask').click(function(){
	$('.overlay , .addTask').show();
});
$('.overlay, .close').click(function(){
	$('.overlay').hide();
	$('.addTask').hide();
});
$('#submit').click(function(){
	var title = $('#titleSelect').val();
	var date = $('#dateSelect').val();
	if(title != '' && date != ''){
	arr.unshift({
		"name": title,
		"startdate": date,
		"color": "#629e62",
		"url":"#"
	});	
	$('#mycalendar').empty();
	$('#mycalendar').monthly({
		mode: 'event',
		dataType: 'json',
		events: CalendarEvents
	});
	$('.cards').prepend('<div class=inner><div class=innerDate>'+date+'</div><div class=innerTitle>'+title+'</div></div>')
	$('.overlay , .addTask').hide();
	$('.inputBox').val('');
	}
	else{
		alert('Enter All fields');
	}
});
$.fn.extend({
	monthly: function(customOptions) {
		var defaults = {
			dataType: "xml",
			disablePast: false,
			eventList: true,
			events: "",
			jsonUrl: "",
			linkCalendarToEventUrl: false,
			maxWidth: false,
			mode: "event",
			setWidth: false,
			showTrigger: "",
			startHidden: false,
			stylePast: false,
			target: "",
			useIsoDateFormat: false,
			weekStart: 0,
			xmlUrl: ""
		};

		var	options = $.extend(defaults, customOptions),
		uniqueId = $(this).attr("id"),
		parent = "#" + uniqueId,
		currentDate = new Date(),
		currentMonth = currentDate.getMonth() + 1,
		currentYear = currentDate.getFullYear(),
		currentDay = currentDate.getDate(),
		locale = (options.locale || defaultLocale()).toLowerCase(),
		monthNameFormat = options.monthNameFormat || "short",
		weekdayNameFormat = options.weekdayNameFormat || "short",
		monthNames = options.monthNames || defaultMonthNames(),
		dayNames = options.dayNames || defaultDayNames(),
		markupBlankDay = '<div class="m-d monthly-day-blank"><div class="monthly-day-number"></div></div>',
		weekStartsOnMonday = options.weekStart === "Mon" || options.weekStart === 1 || options.weekStart === "1",
		primaryLanguageCode = locale.substring(0, 2).toLowerCase();

		if (options.maxWidth !== false) {
			$(parent).css("maxWidth", options.maxWidth);
		}
		if (options.setWidth !== false) {
			$(parent).css("width", options.setWidth);
		}

		if (options.startHidden) {
			$(parent).addClass("monthly-pop").css({
				display: "none",
				position: "absolute"
			});
			$(document).on("focus", String(options.showTrigger), function (event) {
				$(parent).show();
				event.preventDefault();
			});
			$(document).on("click", String(options.showTrigger) + ", .monthly-pop", function (event) {
				event.stopPropagation();
				event.preventDefault();
			});
			$(document).on("click", function () {
				$(parent).hide();
			});
		}

		_appendDayNames(weekStartsOnMonday);
		$(parent).addClass("monthly-locale-" + primaryLanguageCode + " monthly-locale-" + locale);

		$(parent).prepend('<div class="monthly-header"><div class="monthly-header-title"><a href="#" class="monthly-header-title-date" onclick="return false"></a></div><a href="#" class="monthly-prev"></a><a href="#" class="monthly-next"></a></div>').append('<div class="monthly-event-list"></div>');

		setMonthly(currentMonth, currentYear);

		function daysInMonth(month, year) {
			return month === 2 ? (year & 3) || (!(year % 25) && year & 15) ? 28 : 29 : 30 + (month + (month >> 3) & 1);
		}

		function setMonthly(month, year) {
			$(parent).data("setMonth", month).data("setYear", year);

			var index = 0,
			dayQty = daysInMonth(month, year),
			mZeroed = month - 1,
			firstDay = new Date(year, mZeroed, 1, 0, 0, 0, 0).getDay(),
			settingCurrentMonth = month === currentMonth && year === currentYear;

			$(parent + " .monthly-day, " + parent + " .monthly-day-blank").remove();
			$(parent + " .monthly-event-list, " + parent + " .monthly-day-wrap").empty();
			for(var dayNumber = 1; dayNumber <= dayQty; dayNumber++) {
				var isInPast = options.stylePast && (
					year < currentYear
					|| (year === currentYear && (
						month < currentMonth
						|| (month === currentMonth && dayNumber < currentDay)
						))),
				innerMarkup = '<div class="monthly-day-number">' + dayNumber + '</div><div class="monthly-indicator-wrap"></div>';
				if(options.mode === "event") {
					var thisDate = new Date(year, mZeroed, dayNumber, 0, 0, 0, 0);
					$(parent + " .monthly-day-wrap").append("<div"
						+ attr("class", "m-d monthly-day monthly-day-event"
							+ (isInPast ? " monthly-past-day" : "")
							+ " dt" + thisDate.toISOString().slice(0, 10)
							)
						+ attr("data-number", dayNumber)
						+ ">" + innerMarkup + "</div>");
					$(parent + " .monthly-event-list").append("<div"
						+ attr("class", "monthly-list-item")
						+ attr("id", uniqueId + "day" + dayNumber)
						+ attr("data-number", dayNumber)
						+ '><div class="monthly-event-list-date">' + dayNames[thisDate.getDay()] + "<br>" + dayNumber + "</div></div>");
				} else {
					$(parent + " .monthly-day-wrap").append("<a"
						+ attr("href", "#")
						+ attr("class", "m-d monthly-day monthly-day-pick" + (isInPast ? " monthly-past-day" : ""))
						+ attr("data-number", dayNumber)
						+ ">" + innerMarkup + "</a>");
				}
			}

			if (settingCurrentMonth) {
				$(parent + ' *[data-number="' + currentDay + '"]').addClass("monthly-today");
			}

			$(parent + " .monthly-header-title").html(
				'<a href="#" class="monthly-header-title-date" onclick="return false">' + monthNames[month - 1] + " " + year + "</a>"
				+ (settingCurrentMonth ? "" : '<a href="#" class="monthly-reset"></a>'));

			if(weekStartsOnMonday) {
				if (firstDay === 0) {
					_prependBlankDays(6);
				} else if (firstDay !== 1) {
					_prependBlankDays(firstDay - 1);
				}
			} else if(firstDay !== 7) {
				_prependBlankDays(firstDay);
			}

			var numdays = $(parent + " .monthly-day").length,
			numempty = $(parent + " .monthly-day-blank").length,
			totaldays = numdays + numempty,
			roundup = Math.ceil(totaldays / 7) * 7,
			daysdiff = roundup - totaldays;
			if(totaldays % 7 !== 0) {
				for(index = 0; index < daysdiff; index++) {
					$(parent + " .monthly-day-wrap").append(markupBlankDay);
				}
			}
			if (options.mode === "event") {
				addEvents(month, year);
			}
			var divs = $(parent + " .m-d");
			for(index = 0; index < divs.length; index += 7) {
				divs.slice(index, index + 7).wrapAll('<div class="monthly-week"></div>');
			}
		}

		function addEvent(event, setMonth, setYear) {
			var fullStartDate = _getEventDetail(event, "startdate"),
			fullEndDate = _getEventDetail(event, "enddate"),
			startArr = fullStartDate.split("-"),
			startYear = parseInt(startArr[0], 10),
			startMonth = parseInt(startArr[1], 10),
			startDay = parseInt(startArr[2], 10),
			startDayNumber = startDay,
			endDayNumber = startDay,
			showEventTitleOnDay = startDay,
			startsThisMonth = startMonth === setMonth && startYear === setYear,
			happensThisMonth = startsThisMonth;

			if(fullEndDate) {
				var	endArr = fullEndDate.split("-"),
				endYear = parseInt(endArr[0], 10),
				endMonth = parseInt(endArr[1], 10),
				endDay = parseInt(endArr[2], 10),
				startsInPastMonth = startYear < setYear || (startMonth < setMonth && startYear === setYear),
				endsThisMonth = endMonth === setMonth && endYear === setYear,
				endsInFutureMonth = endYear > setYear || (endMonth > setMonth && endYear === setYear);
				if(startsThisMonth || endsThisMonth || (startsInPastMonth && endsInFutureMonth)) {
					happensThisMonth = true;
					startDayNumber = startsThisMonth ? startDay : 1;
					endDayNumber = endsThisMonth ? endDay : daysInMonth(setMonth, setYear);
					showEventTitleOnDay = startsThisMonth ? startDayNumber : 1;
				}
			}
			if(!happensThisMonth) {
				return;
			}

			var startTime = _getEventDetail(event, "starttime"),
			timeHtml = "",
			eventURL = _getEventDetail(event, "url"),
			eventTitle = _getEventDetail(event, "name"),
			eventClass = _getEventDetail(event, "class"),
			eventColor = _getEventDetail(event, "color"),
			eventId = _getEventDetail(event, "id"),
			customClass = eventClass ? " " + eventClass : "",
			dayStartTag = "<div",
			dayEndTags = "</span></div>";

			if(startTime) {
				var endTime = _getEventDetail(event, "endtime");
				timeHtml = '<div><div class="monthly-list-time-start">' + formatTime(startTime) + "</div>"
				+ (endTime ? '<div class="monthly-list-time-end">' + formatTime(endTime) + "</div>" : "")
				+ "</div>";
			}

			if(options.linkCalendarToEventUrl && eventURL) {
				dayStartTag = "<a" + attr("href", eventURL);
				dayEndTags = "</span></a>";
			}

			var	markupDayStart = dayStartTag
			+ attr("data-eventid", eventId)
			+ attr("title", eventTitle)
			+ (eventColor ? attr("style", "background:" + eventColor + ";color:" + eventColor) : ""),
			markupListEvent = "<a"
			+ attr("href", eventURL)
			+ attr("class", "listed-event" + customClass)
			+ attr("data-eventid", eventId)
			+ (eventColor ? attr("style", "background:" + eventColor) : "")
			+ attr("title", eventTitle)
			+ ">" + eventTitle + " " + timeHtml + "</a>";
			for(var index = startDayNumber; index <= endDayNumber; index++) {
				var doShowTitle = index === showEventTitleOnDay;
				$(parent + ' *[data-number="' + index + '"] .monthly-indicator-wrap').append(
					markupDayStart
					+ attr("class", "monthly-event-indicator" + customClass
						+ (doShowTitle ? "" : " monthly-event-continued")
						)
					+ "><span>" + (doShowTitle ? eventTitle : "") + dayEndTags);
				$(parent + ' .monthly-list-item[data-number="' + index + '"]')
				.addClass("item-has-event")
				.append(markupListEvent);
			}
		}

		function addEvents(month, year) {
			if(options.events) {
				addEventsFromString(options.events, month, year);
			} else {
				var remoteUrl = options.dataType === "xml" ? options.xmlUrl : options.jsonUrl;
				if(remoteUrl) {
					var url = String(remoteUrl).replace("{month}", month).replace("{year}", year);
					$.get(url, {now: $.now()}, function(data) {
						addEventsFromString(data, month, year);
					}, options.dataType).fail(function() {
						console.error("Monthly.js failed to import " + remoteUrl + ". Please check for the correct path and " + options.dataType + " syntax.");
					});
				}
			}
		}

		function addEventsFromString(events, setMonth, setYear) {
			if (options.dataType === "xml") {
				$(events).find("event").each(function(index, event) {
					addEvent(event, setMonth, setYear);
				});
			} else if (options.dataType === "json") {
				$.each(events.monthly, function(index, event) {
					addEvent(event, setMonth, setYear);
				});
			}
		}

		function attr(name, value) {
			var parseValue = String(value);
			var newValue = "";
			for(var index = 0; index < parseValue.length; index++) {
				switch(parseValue[index]) {
					case "'": newValue += "&#39;"; break;
					case "\"": newValue += "&quot;"; break;
					case "<": newValue += "&lt;"; break;
					case ">": newValue += "&gt;"; break;
					default: newValue += parseValue[index];
				}
			}
			return " " + name + "=\"" + newValue + "\"";
		}

		function _appendDayNames(startOnMonday) {
			var offset = startOnMonday ? 1 : 0,
			dayName = "",
			dayIndex = 0;
			for(dayIndex = 0; dayIndex < 6; dayIndex++) {
				dayName += "<div>" + dayNames[dayIndex + offset] + "</div>";
			}
			dayName += "<div>" + dayNames[startOnMonday ? 0 : 6] + "</div>";
			$(parent).append('<div class="monthly-day-title-wrap">' + dayName + '</div><div class="monthly-day-wrap"></div>');
		}

		function defaultLocale() {
			if(navigator.languages && navigator.languages.length) {
				return navigator.languages[0];
			}
			return navigator.language || navigator.browserLanguage;
		}

		function defaultMonthNames() {
			if(typeof Intl === "undefined") {
				return ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			}
			var formatter = new Intl.DateTimeFormat(locale, {month: monthNameFormat});
			var names = [];
			for(var monthIndex = 0; monthIndex < 12; monthIndex++) {
				var sampleDate = new Date(2017, monthIndex, 1, 0, 0, 0);
				names[monthIndex] = formatter.format(sampleDate);
			}
			return names;
		}

		function formatDate(year, month, day) {
			if(options.useIsoDateFormat) {
				return new Date(year, month - 1, day, 0, 0, 0).toISOString().substring(0, 10);
			}
			if(typeof Intl === "undefined") {
				return month + "/" + day + "/" + year;
			}
			return new Intl.DateTimeFormat(locale).format(new Date(year, month - 1, day, 0, 0, 0));
		}
		function defaultDayNames() {
			if(typeof Intl === "undefined") {
				return ["Sunday", "Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday"];
			}
			var formatter = new Intl.DateTimeFormat(locale, {weekday: weekdayNameFormat}),
			names = [],
			dayIndex = 0,
			sampleDate = null;
			for(dayIndex = 0; dayIndex < 7; dayIndex++) {
				sampleDate = new Date(2017, 0, dayIndex + 1, 0, 0, 0);
				names[dayIndex] = formatter.format(sampleDate);
			}
			return names;
		}

		function _prependBlankDays(count) {
			var wrapperEl = $(parent + " .monthly-day-wrap"),
			index = 0;
			for(index = 0; index < count; index++) {
				wrapperEl.prepend(markupBlankDay);
			}
		}

		function _getEventDetail(event, nodeName) {
			return options.dataType === "xml" ? $(event).find(nodeName).text() : event[nodeName];
		}

		function formatTime(value) {
			var timeSplit = value.split(":");
			var hour = parseInt(timeSplit[0], 10);
			var period = "AM";
			if(hour > 12) {
				hour -= 12;
				period = "PM";
			} else if(hour === 0) {
				hour = 12;
			}
			return hour + ":" + String(timeSplit[1]) + " " + period;
		}

		function setNextMonth() {
			var	setMonth = $(parent).data("setMonth"),
			setYear = $(parent).data("setYear"),
			newMonth = setMonth === 12 ? 1 : setMonth + 1,
			newYear = setMonth === 12 ? setYear + 1 : setYear;
			setMonthly(newMonth, newYear);
			viewToggleButton();
		}

		function setPreviousMonth() {
			var setMonth = $(parent).data("setMonth"),
			setYear = $(parent).data("setYear"),
			newMonth = setMonth === 1 ? 12 : setMonth - 1,
			newYear = setMonth === 1 ? setYear - 1 : setYear;
			setMonthly(newMonth, newYear);
			viewToggleButton();
		}

		function viewToggleButton() {
			if($(parent + " .monthly-event-list").is(":visible")) {
				$(parent + " .monthly-cal").remove();
				$(parent + " .monthly-header-title").prepend('<a href="#" class="monthly-cal"></a>');
			}
		}

		$(document.body).on("click", parent + " .monthly-next", function (event) {
			setNextMonth();
			event.preventDefault();
		});

		$(document.body).on("click", parent + " .monthly-prev", function (event) {
			setPreviousMonth();
			event.preventDefault();
		});

		$(document.body).on("click", parent + " .monthly-reset", function (event) {
			$(this).remove();
			setMonthly(currentMonth, currentYear);
			viewToggleButton();
			event.preventDefault();
			event.stopPropagation();
		});

		$(document.body).on("click", parent + " .monthly-cal", function (event) {
			$(this).remove();
			$(parent + " .monthly-event-list").css("transform", "scale(0)");
			setTimeout(function() {
				$(parent + " .monthly-event-list").hide();
			}, 250);
			event.preventDefault();
		});

		$(document.body).on("click touchstart", parent + " .monthly-day", function (event) {
			var whichDay = $(this).data("number");
			if(options.mode === "event" && options.eventList) {
				var	theList = $(parent + " .monthly-event-list"),
				myElement = document.getElementById(uniqueId + "day" + whichDay),
				topPos = myElement.offsetTop;
				theList.show();
				theList.css("transform");
				theList.css("transform", "scale(1)");
				$(parent + ' .monthly-list-item[data-number="' + whichDay + '"]').show();
				theList.scrollTop(topPos);
				viewToggleButton();
				if(!options.linkCalendarToEventUrl) {
					event.preventDefault();
				}
			} else if (options.mode === "picker") {
				var	setMonth = $(parent).data("setMonth"),
				setYear = $(parent).data("setYear");
				if($(this).hasClass("monthly-past-day") && options.disablePast) {
					event.preventDefault();
				} else {
					$(String(options.target)).val(formatDate(setYear, setMonth, whichDay));
					if(options.startHidden) {
						$(parent).hide();
					}
				}
				event.preventDefault();
			}
		});

$(document.body).on("click", parent + " .listed-event", function (event) {
	var href = $(this).attr("href");
	if(!href) {
		event.preventDefault();
	}
});

}
});
