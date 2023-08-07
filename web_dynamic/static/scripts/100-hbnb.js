$(document).ready(function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};

  const changeHandler = (checkbox, dataObject, updateFunction) => {
    $(checkbox).change(function (event) {
      if ($(this).is(':checked')) {
        dataObject[$(this).data('id')] = $(this).data('name');
      } else {
        delete dataObject[$(this).data('id')];
      }
      updateFunction();
    });
  };

  const updateAmenities = () => {
    $('.amenities h4').text(Object.values(checkedAmenities).join(', '));
  };

  const updateLocations = () => {
    const locations = [...Object.values(checkedCities), ...Object.values(checkedStates)];
    const content = locations.join(', ');
    $('.locations h4').text(content);
  };

  const display = (places) => {
    const section = $('section.places');

    section.html('');
    places.forEach(place => {
      section.append(
        `
        <article>
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
        </article>
        `
      );
    });
  };

  const fetchPlaces = params => {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(params),
      success: function (data) {
        display(data);
      },
      error: function (error) {
        console.log(error);
      }
    });
  };

  changeHandler('.amenity-checkbox', checkedAmenities,
    updateAmenities);

  $.get('http://127.0.0.1:5001/api/v1/status',
    function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  );

  fetchPlaces({});

  $('button').click(event => {
    const amenities = Object.keys(checkedAmenities);
    const states = Object.keys(checkedStates);
    const cities = Object.keys(checkedCities);

    fetchPlaces({ amenities, states, cities });
  });

  changeHandler('.state-checkbox',
    checkedStates, updateLocations);

  changeHandler('.city-checkbox',
    checkedCities, updateLocations);
});
