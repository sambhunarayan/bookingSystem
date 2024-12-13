$(document).ready(function () {
	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		$('#myModal').hide();
		$('#modalMain').html('');
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none';
			$('#modalMain').html('');
		}
	};
});
let validation = true;
// function to view slots
function viewSlots() {
	bookingDate = $('#bookingDate').val();
	if (!bookingDate) {
		displayMessage('Enter booking date', false);
		return false;
	}
	// Parse the input date and the current date
	const inputDate = new Date(bookingDate);
	const currentDate = new Date();
	// Remove time part for accurate comparison
	currentDate.setHours(0, 0, 0, 0);

	// Check if the date is in the past
	if (inputDate < currentDate) {
		displayMessage('Booking date must not be in the past', false);
		return;
	}
	$.ajax({
		url: '/slots',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			bookingDate: bookingDate,
		}),
		success: function (response) {
			if (!response.success) {
				displayMessage(response.msg, false);
			} else {
				slotWindow(response.data);
				displayMessage(response.msg, true);
			}
		},
		error: function (xhr, status, error) {
			console.error('Error:', error);
			$('#slotButton').prop('disabled', false);
			displayMessage(xhr.responseText || 'An error occurred', false);
		},
	});
}
// function to display messages as popups
function displayMessage(message, isSuccess) {
	$('#responseMessage').text(message);
	$('#responseMessage').css(
		'background-color',
		isSuccess ? '#28a745' : '#dc3545',
	);
	$('#responseMessage').fadeIn(400).delay(3000).fadeOut(400);
}
function slotWindow(data) {
	$('#myModal').show();
	$('#modalHeading').text('Booking slot for ' + data.bookingDate);
	const slotsHtml = `<div id="slotDetail" >
                           <div class="formHeading">
                                    <h4 class="primaryHeading">Morning Slots (10:00 AM - 01:00 PM)</h4>
                            </div>
                           <div class="slotRow" id="morningSlot"> 
                           </div>
                             <div class="formHeading">  
                                    <h4 class="primaryHeading">Break time (01:00 PM - 02:00 PM)</h4>
                            </div>
                            <div class="formHeading">
                                    <h4 class="primaryHeading">Evening slots (02:00 PM - 05:00 PM)</h4>
                            </div>
                            <div class="slotRow" id="eveningSlot">
                           </div>
                        </div>`;
	$('#modalMain').html(slotsHtml);
	createButtons(data.morningIntervals, 'morningSlot');
	createButtons(data.eveningIntervals, 'eveningSlot');
	$('#slotDetail').css('height', '300px');
	$('#slotDetail').css('overflow', 'auto');
}
// function to create buttons
function createButtons(intervals, containerId) {
	const container = document.getElementById(containerId);
	intervals.forEach(interval => {
		const button = document.createElement('button');
		button.textContent = interval;
		button.style.margin = '5px';
		button.onclick = function () {
			console.log(checkAvailability(interval));

			(async () => {
				const isAvailable = await checkAvailability(interval);
				if (isAvailable) {
					bookingForm(interval);
				} else {
					displayMessage('Slot not available', false);
				}
			})();
		};
		container.appendChild(button);
	});
}
// function to book slot
function bookNow() {
	let bookName = $('#bookName').val();
	let phone = $('#phone').val();
	let slot = $('#slot').val();
	console.log('slot', slot);
	if (!bookName) {
		displayMessage('Enter your name', false);
		return false;
	} else if (!phone) {
		displayMessage('Enter your phone number', false);
		return false;
	} else if (!validatePhone(phone)) {
		displayMessage('Enter 10 digit phone number', false);
		return false;
	} else {
		$.ajax({
			url: '/book',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				bookName: bookName,
				phone: phone,
				slot: slot,
			}),
			success: function (response) {
				if (!response.success) {
					displayMessage(response.msg, false);
				} else {
					displayMessage(response.msg, true);
					$('#modal').hide();
				}
			},
			error: function (xhr, status, error) {
				console.error('Error:', error);
				$('#bookButton').prop('disabled', false);
				displayMessage(xhr.responseText || 'An error occurred', false);
			},
		});
	}
}
// slot booking form
function bookingForm(slot) {
	console.log(slot);
	const formattedDateTime = moment(slot, 'DD/MM/YYYY HH:mm').format(
		'YYYY-MM-DDTHH:mm',
	);
	console.log(formattedDateTime);
	$('#myModal').show();
	$('#modalHeading').text('Booking form');
	$('#modalMain').html(
		'<div class="modalForm">\
         <div class="inputContainer">\
           <label for="bookName">Booking Time</label>\
                                <input\
                                    class="inputTag"\
                                    id="slot"\
                                    value="' +
			formattedDateTime +
			'"\
                                    type="datetime-local"\
                                    readonly\
                                    name="slot"\
                                />\
                            </div>\
                            <div class="inputContainer">\
                            <label for="bookName">Name</label>\
                                <input\
                                    class="inputTag"\
                                    id="bookName"\
                                    type="text"\
                                    name="bookName"\
                                />\
                            </div>\
                            <div class="inputContainer">\
                            <label for="phone">Phone </label>\
                                <input\
                                    class="inputTag"\
                                    id="phone"\
                                    type="text"\
                                    maxlength="10"\
                                    name="phone"\
                                />\
                            </div>\
                            <div class="buttonContainer">\
                                <button onclick="bookNow()" class="primaryButton" id="bookButton">\
                                    Book Now\
                                </button>\
                            </div>\
</div>',
	);
}
// validate phone number
function validatePhone(phone) {
	var phoneRegex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$/;
	return phoneRegex.test(phone);
}
// check availability
async function checkAvailability(slot) {
	const formattedDateTime = moment(slot, 'DD/MM/YYYY HH:mm').format(
		'YYYY-MM-DDTHH:mm',
	);
	try {
		const response = await $.ajax({
			url: '/checkSlot',
			type: 'GET',
			contentType: 'application/json',
			data: { slot: formattedDateTime },
		});
		console.log('response', response);
		return response.success;
	} catch (error) {
		console.error('Error:', error);
		displayMessage('Error checking slot availability', false);
		return false;
	}
}
