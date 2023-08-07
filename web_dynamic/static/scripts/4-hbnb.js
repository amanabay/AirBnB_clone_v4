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

  $.ajax({
    url: 'http://127.0.0.1:5001/api/v1/status',
    method: 'GET',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    },
    error: function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url: 'http://127.0.0.1:5001/api/v1/places_search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({}),
    success: function (data) {
      display(data);
    },
    error: function (error) {
      console.log(error);
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

    $('button').click(event => {
      const amenities = Object.keys(checkedAmenities);

      $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/places_search',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ amenities }),
        success: function (data) {
          $('section.places').html('');
          display(data);
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
  };
});
