$(document).ready(function () {
  // Store the checked Amenity IDs
  const checkedAmenities = {};

  $('.amenity-checkbox').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  });

  $.get('http://127.0.0.1:5001/api/v1/status', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  
  const display = (places) => {
    const section = $('section.places');

    places.forEach(place => {
      const article = $('<article></article>');
      article.html(`
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
      </div>
      <div class="information">
        <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
      </div>
      <div class="user">
        <b></b>
      </div>
      <div class="description">
        ${place.description}
      </div>
    `);

      section.append(article);
    });
  };

  fetch('http://127.0.0.1:5001/api/v1/places_search/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
      display(data);
    })
    .catch(error => {
      console.log(error);
    });

  $('button').click(event => {
  const amenities = Object.keys(checkedAmenities);

  fetch(`http://127.0.0.1:5000/api/v1/places_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amenities })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      $('section.places').html('');
      displayPlaces(data);
    })
    .catch(error => {
      console.log(error);
    });
  });
});
