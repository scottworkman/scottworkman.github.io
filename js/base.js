$(document).ready(function() {
  // Filters visible cards based on the user's input in the search box
  $(".filter").on("keyup", function() {
    var input = $(this).val().toUpperCase();

    $(".card").each(function() {
      var cardBodyText = $(this).find(".card-title").text().toUpperCase() +
                         $(this).find(".card-text").text().toUpperCase() +
                         $(this).find(".featurette-author").text().toUpperCase() +
                         $(this).find(".featurette-venue").text().toUpperCase();

      var parentCol = $(this).closest(".col");

      if (cardBodyText.indexOf(input) < 0) {
        parentCol.fadeOut(200, function() {
          parentCol.addClass("d-none");
        });
      } else {
        parentCol.removeClass("d-none").fadeIn(200);
      }
    });
  });

  // Trigger the same filtering behavior when the "X" (clear) button is clicked
  $('.filter').on('input', function() {
    var inputVal = $(this).val();

    // When the input is cleared (i.e., the "X" button is clicked)
    if (inputVal.length === 0) {
      // Reset all cards to visible (show them all again)
      $(".col").removeClass("d-none").fadeIn(200);
    }
  });
});
