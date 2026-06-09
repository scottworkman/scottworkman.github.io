$(document).ready(function () {
  // ============================================================
  // Research filtering
  // ============================================================
  const $grid = $("#research-grid");
  const $filters = $("#topic-filters");
  const $search = $(".filter");

  if ($grid.length) {
    const $searchClear = $("#search-clear");
    const $resultsCount = $("#results-count");
    const $noResults = $("#no-results-message");
    const $resetFilters = $("#reset-filters");

    // Unified filter function
    function updateResearchFilter(options = {}) {
      const { updateUrl = true } = options;
      const selected = $filters.find(".topic-pill.active").attr("data-topic") || "all";
      const input = $search.val().trim().toUpperCase();
      let visibleCount = 0;
      const totalCount = $grid.find(".research-card").length;

      // Show/hide clear button
      if (input.length > 0) {
        $searchClear.removeClass("hidden");
      } else {
        $searchClear.addClass("hidden");
      }

      $grid.find(".research-card").each(function () {
        const $card = $(this);

        // Topic match logic
        const cardTopicsRaw = $card.attr("data-topics") || "";
        const cardTopics = cardTopicsRaw
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        const matchesTopic = selected === "all" || cardTopics.includes(selected);

        // Search match logic: matches the text content of the card (title, excerpt, authors, venue)
        const textToMatch = $card.text().toUpperCase();
        const matchesSearch = input.length === 0 || textToMatch.indexOf(input) >= 0;

        // Update visibility
        if (matchesTopic && matchesSearch) {
          visibleCount++;
          if ($card.hasClass("hidden") || $card.css("display") === "none") {
            $card.removeClass("hidden").fadeIn(200);
          }
        } else {
          if (!$card.hasClass("hidden") && $card.css("display") !== "none") {
            $card.fadeOut(200, function () {
              $(this).addClass("hidden");
            });
          }
        }
      });

      // Update count display
      $resultsCount.text(visibleCount);

      // Handle no results message
      if (visibleCount === 0) {
        $grid.addClass("hidden");
        $noResults.removeClass("hidden").fadeIn(200);
      } else {
        $grid.removeClass("hidden");
        $noResults.addClass("hidden");
      }

      // Sync with URL
      if (updateUrl && window.history.pushState) {
        const params = new URLSearchParams(window.location.search);
        if (selected !== "all") params.set("topic", selected);
        else params.delete("topic");
        if (input.length > 0) params.set("q", $search.val().trim());
        else params.delete("q");

        const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({ path: newUrl }, "", newUrl);
      }
    }

    // Initialize from URL
    function initFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const topic = params.get("topic");
      const query = params.get("q");

      if (topic) {
        $filters.find(".topic-pill").removeClass("active");
        $filters.find(`[data-topic="${topic}"]`).addClass("active");
      }
      if (query) {
        $search.val(query);
      }
      updateResearchFilter({ updateUrl: false });
    }

    // Event listeners
    $filters.on("click", ".topic-pill", function () {
      $filters.find(".topic-pill").removeClass("active");
      $(this).addClass("active");
      updateResearchFilter();
    });

    $search.on("keyup input", function () {
      updateResearchFilter();
    });

    $searchClear.on("click", function () {
      $search.val("").focus();
      updateResearchFilter();
    });

    $resetFilters.on("click", function () {
      $filters.find(".topic-pill").removeClass("active");
      $filters.find('[data-topic="all"]').addClass("active");
      $search.val("");
      updateResearchFilter();
    });

    // Run init
    initFromUrl();
  }
});
