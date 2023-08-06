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
});
