(function () {
    'use strict';

    var activeCalendars = new WeakMap();
    var calendarPopup = null;
    var currentInput = null;
    var lastOpenTime = 0;

    function getOrCreatePopup() {
        if (!calendarPopup) {
            calendarPopup = document.createElement('div');
            calendarPopup.className = 'persian-date-popup';
            // بالاترین z-index ممکن برای اینکه هیچ‌وقت زیر کیبورد یا المان دیگری نرود
            calendarPopup.style.cssText = 'position:absolute;z-index:9999999;display:none;';
            document.body.appendChild(calendarPopup);
        }
        return calendarPopup;
    }

    function positionPopup(input) {
        var popup = getOrCreatePopup();
        if (popup.parentNode !== document.body) {
            document.body.appendChild(popup);
        }

        var rect = input.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        var targetTop = rect.bottom + scrollTop + 8;
        var targetLeft = rect.left + scrollLeft;

        popup.style.top = targetTop + 'px';
        popup.style.left = targetLeft + 'px';

        setTimeout(function () {
            var popupRect = popup.getBoundingClientRect();
            if (popupRect.right > window.innerWidth) {
                popup.style.left = (window.innerWidth - popupRect.width - 15 + scrollLeft) + 'px';
            }
            if (popupRect.bottom > window.innerHeight) {
                var newTop = rect.top + scrollTop - popupRect.height - 8;
                popup.style.top = newTop + 'px';
            }
        }, 0);
    }

    function isCalendarOpen() {
        return calendarPopup && calendarPopup.style.display !== 'none';
    }

    function parseExistingRange(val) {
        if (!val) return { startDate: null, endDate: null };
        var matches = val.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g);
        var startDate = null;
        var endDate = null;

        if (matches && matches.length > 0) {
            var p1 = matches[0].split(/[\/\-]/);
            startDate = {
                year: parseInt(p1[0], 10),
                month: parseInt(p1[1], 10),
                day: parseInt(p1[2], 10)
            };
        }
        if (matches && matches.length > 1) {
            var p2 = matches[1].split(/[\/\-]/);
            endDate = {
                year: parseInt(p2[0], 10),
                month: parseInt(p2[1], 10),
                day: parseInt(p2[2], 10)
            };
        }
        return { startDate: startDate, endDate: endDate };
    }

    function showCalendar(displayInput, realInput) {
        if (!realInput) realInput = displayInput;
        if (typeof PersianElementorCalendar === 'undefined') {
            console.error('Persian Elementor: PersianElementorCalendar not loaded');
            return;
        }

        suppressFlatpickr(realInput);

        // جلوگیری از باز شدن کیبورد موبایل هنگام نمایش تقویم
        if (displayInput && typeof displayInput.blur === 'function') {
            displayInput.blur();
        }

        if (isCalendarOpen() && currentInput !== displayInput) {
            hideCalendar();
        }

        if (isCalendarOpen() && currentInput === displayInput) {
            return;
        }

        var popup = getOrCreatePopup();
        document.body.appendChild(popup);

        currentInput = displayInput;
        lastOpenTime = Date.now();

        if (activeCalendars.has(popup)) {
            var oldCalendar = activeCalendars.get(popup);
            if (oldCalendar && typeof oldCalendar.destroy === 'function') {
                oldCalendar.destroy();
            }
            activeCalendars.delete(popup);
        }
        popup.innerHTML = '';

        var isEditorControl = realInput.hasAttribute('data-setting') ||
                             (realInput.closest && realInput.closest('.elementor-control-input-wrapper, .elementor-control'));
        
        var existingVal = realInput.value ? realInput.value.trim() : '';
        var parsedRange = parseExistingRange(existingVal);

        var selectedDate = new Date();
        if (parsedRange.startDate) {
            var g = PersianElementorDateConverter.jalaliToGregorian(parsedRange.startDate.year, parsedRange.startDate.month, parsedRange.startDate.day);
            if (g[0] > 0) {
                selectedDate = new Date(g[0], g[1] - 1, g[2]);
            }
        }

        var calendar = new PersianElementorCalendar(popup, {
            selectedDate: selectedDate,
            startDate: parsedRange.startDate,
            endDate: parsedRange.endDate,
            title: 'انتخاب تاریخ اقامت',
            showCloseButton: true,
            onDateSelect: function (dateInfo) {
                var weekDaysName = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
                var getDayName = function(y, m, d) {
                    var g = PersianElementorDateConverter.jalaliToGregorian(y, m, d);
                    var jsDate = new Date(g[0], g[1] - 1, g[2]);
                    return weekDaysName[jsDate.getDay()];
                };

                var standardValue = '';
                var formattedWithDays = '';

                if (dateInfo.startDate && dateInfo.endDate) {
                    var startDayName = getDayName(dateInfo.startDate.year, dateInfo.startDate.month, dateInfo.startDate.day);
                    var endDayName = getDayName(dateInfo.endDate.year, dateInfo.endDate.month, dateInfo.endDate.day);
                    
                    var sDateStr = dateInfo.startDate.year + '/' + String(dateInfo.startDate.month).padStart(2, '0') + '/' + String(dateInfo.startDate.day).padStart(2, '0');
                    var eDateStr = dateInfo.endDate.year + '/' + String(dateInfo.endDate.month).padStart(2, '0') + '/' + String(dateInfo.endDate.day).padStart(2, '0');
                    
                    standardValue = sDateStr + ' الی ' + eDateStr;
                    formattedWithDays = startDayName + ' ' + sDateStr + ' الی ' + endDayName + ' ' + eDateStr;
                } else if (dateInfo.startDate) {
                    var sDayName = getDayName(dateInfo.startDate.year, dateInfo.startDate.month, dateInfo.startDate.day);
                    var sDateStr = dateInfo.startDate.year + '/' + String(dateInfo.startDate.month).padStart(2, '0') + '/' + String(dateInfo.startDate.day).padStart(2, '0');
                    
                    standardValue = sDateStr;
                    formattedWithDays = sDayName + ' ' + sDateStr;
                }

                realInput.value = standardValue;
                if (isEditorControl || displayInput !== realInput) {
                    displayInput.value = standardValue;
                }

                var resultBox = document.getElementById('night-count-result');
                if (resultBox) {
                    if (dateInfo.startDate && dateInfo.endDate) {
                        var g1 = PersianElementorDateConverter.jalaliToGregorian(dateInfo.startDate.year, dateInfo.startDate.month, dateInfo.startDate.day);
                        var g2 = PersianElementorDateConverter.jalaliToGregorian(dateInfo.endDate.year, dateInfo.endDate.month, dateInfo.endDate.day);
                        var date1 = new Date(g1[0], g1[1] - 1, g1[2]);
                        var date2 = new Date(g2[0], g2[1] - 1, g2[2]);
                        var diffDays = Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

                        resultBox.innerHTML = 'مدت اقامت انتخابی: ' + PersianElementorDateConverter.toPersianDigits(diffDays) + ' شب (' + formattedWithDays + ')';
                        resultBox.style.display = 'block';
                    } else {
                        resultBox.style.display = 'none';
                    }
                }

                var eventInput = new Event('input', { bubbles: true });
                var eventChange = new Event('change', { bubbles: true });
                realInput.dispatchEvent(eventInput);
                realInput.dispatchEvent(eventChange);

                if (window.jQuery) {
                    window.jQuery(realInput).trigger('input').trigger('change');
                }

                if (dateInfo.endDate) {
                    hideCalendar();
                }
            },
            onClose: function () {
                hideCalendar();
            }
        });

        activeCalendars.set(popup, calendar);
        popup.style.fontFamily = 'VazirMatn, Vazir, Vazirmatn, VazirmatnVF, sans-serif';

        ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(function (event) {
            popup.addEventListener(event, function (e) {
                e.stopPropagation();
            });
        });

        popup.style.display = 'block';
        positionPopup(displayInput);
        displayInput.setAttribute('data-calendar-open', 'true');
        attachAllIframeListeners();
    }

    function hideCalendar() {
        if (calendarPopup) {
            calendarPopup.style.display = 'none';
            calendarPopup.innerHTML = '';
        }
        if (currentInput) {
            currentInput.removeAttribute('data-calendar-open');
            currentInput = null;
        }
    }

    function suppressFlatpickr(input) {
        if (!input) return;
        if (input._flatpickr) {
            try {
                input._flatpickr.close();
                if (input._flatpickr.calendarContainer) {
                    input._flatpickr.calendarContainer.style.display = 'none';
                }
            } catch (ex) {}
        }
    }

    function initPersianDateField(inputOrId) {
        var realInput = typeof inputOrId === 'string' ?
            document.getElementById(inputOrId) : inputOrId;

        if (!realInput || realInput.hasAttribute('data-persian-date-initialized')) return false;
        if (realInput.hasAttribute('data-persian-display-input')) return false;

        realInput.setAttribute('data-persian-date-initialized', 'true');
        var displayInput = realInput;

        var isEditorControl = realInput.hasAttribute('data-setting') ||
                              (realInput.closest && realInput.closest('.elementor-control-input-wrapper, .elementor-control'));

        if (isEditorControl && realInput.parentNode) {
            displayInput = document.createElement('input');
            displayInput.type = 'text';
            displayInput.className = realInput.className + ' persian-datepicker-display';
            displayInput.placeholder = realInput.placeholder || '';
            if (realInput.hasAttribute('readonly')) {
                displayInput.setAttribute('readonly', 'readonly');
            }
            displayInput.setAttribute('data-persian-display-input', 'true');
            displayInput.setAttribute('data-persian-date-initialized', 'true');

            realInput.style.display = 'none';
            realInput.parentNode.insertBefore(displayInput, realInput);

            if (realInput.value) {
                displayInput.value = realInput.value;
            }

            realInput.addEventListener('change', function () {
                displayInput.value = realInput.value;
            });
        }

        suppressFlatpickr(realInput);

        var blockAction = function (e) {
            e.preventDefault();
            suppressFlatpickr(realInput);
            if (isCalendarOpen() && currentInput === displayInput) {
                hideCalendar();
            } else {
                showCalendar(displayInput, realInput);
            }
        };

        displayInput.addEventListener('focus', function(e) {
            e.preventDefault();
            if (typeof displayInput.blur === 'function') {
                displayInput.blur();
            }
        }, true);

        displayInput.addEventListener('mousedown', function(e) {
            e.preventDefault();
        }, true);

        displayInput.addEventListener('click', blockAction);
        displayInput.addEventListener('touchend', blockAction);

        return true;
    }

    function initAllDateFields() {
        var selectorList = [
            'input[name*="checkin"]:not([data-persian-date-initialized])',
            'input[id*="checkin"]:not([data-persian-date-initialized])',
            'input[data-persian-date]:not([data-persian-date-initialized])',
            'input.persian-date-input:not([data-persian-date-initialized])'
        ];
        
        var selector = selectorList.join(',');
        var fields = document.querySelectorAll(selector);
        fields.forEach(function (field) {
            initPersianDateField(field);
        });
    }

    function handleOutsideClick(e) {
        if (!isCalendarOpen()) return;
        if (Date.now() - lastOpenTime < 100) return;
        if (calendarPopup && calendarPopup.contains(e.target)) return;
        if (currentInput && (e.target === currentInput || currentInput.contains(e.target))) return;
        hideCalendar();
    }

    function handleIframeInteraction() {
        if (!isCalendarOpen()) return;
        if (Date.now() - lastOpenTime < 100) return;
        hideCalendar();
    }

    function attachAllIframeListeners() {
        try {
            var iframes = document.querySelectorAll('iframe');
            iframes.forEach(function (iframe) {
                try {
                    var iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                    if (iframeDoc) {
                        ['pointerdown', 'mousedown', 'click', 'touchstart'].forEach(function (evt) {
                            iframeDoc.removeEventListener(evt, handleIframeInteraction, true);
                            iframeDoc.addEventListener(evt, handleIframeInteraction, true);
                        });
                    }
                    iframe.removeEventListener('load', attachAllIframeListeners);
                    iframe.addEventListener('load', attachAllIframeListeners);
                } catch (ex) {}
            });
        } catch (e) {}
    }

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('pointerdown', handleOutsideClick, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initAllDateFields();
            attachAllIframeListeners();
        });
    } else {
        initAllDateFields();
        attachAllIframeListeners();
    }

    var observer = new MutationObserver(function (mutations) {
        if (isCalendarOpen() && currentInput && !document.body.contains(currentInput)) {
            hideCalendar();
        }

        var shouldReinit = false;
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'IFRAME' || (node.querySelector && node.querySelector('iframe'))) {
                            attachAllIframeListeners();
                        }
                        var hasMatch = false;
                        if (node.matches && (node.matches('input[name*="checkin"]') || node.matches('input[id*="checkin"]'))) hasMatch = true;
                        if (!hasMatch && node.querySelector && (node.querySelector('input[name*="checkin"]') || node.querySelector('input[id*="checkin"]'))) hasMatch = true;
                        if (hasMatch) shouldReinit = true;
                    }
                });
            }
        });

        if (shouldReinit) {
            initAllDateFields();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.initPersianDateField = initPersianDateField;
    window.initAllPersianDateFields = initAllDateFields;
    window.hidePersianCalendar = hideCalendar;

    if (typeof window !== 'undefined' && window.jQuery) {
        window.jQuery(document).on('elementor/popup/show', function(event, id, instance) {
            if (instance && instance.$element) {
                instance.$element.find('input[name*="checkin"], input[id*="checkin"]').removeAttr('data-persian-date-initialized');
                initAllDateFields();
            }
        });
        window.jQuery(document).on('jet-popup/show-event', function(event, $popup) {
            if ($popup) {
                $popup.find('input[name*="checkin"], input[id*="checkin"]').removeAttr('data-persian-date-initialized');
                initAllDateFields();
            }
        });
    }

})();