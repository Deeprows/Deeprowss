document.addEventListener("DOMContentLoaded", function () {

  "use strict";


  console.log("Deeprowss script loaded");


  /* =====================================
     ELEMENTS
  ===================================== */

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");

  var searchInput =
    document.getElementById("siteSearch");

  var searchStatus =
    document.getElementById("searchStatus");

  var noResults =
    document.getElementById("noResults");

  var menuToggle =
    document.getElementById("menuToggle");

  var mainNav =
    document.getElementById("mainNav");


  /*
   * Keep the loaded posts available
   * for search and other functionality.
   */

  var allPosts = [];



  /* =====================================
     LOAD POSTS
  ===================================== */

  var xhr =
    new XMLHttpRequest();


  xhr.open(
    "GET",
    "posts.json?v=" +
      new Date().getTime(),
    true
  );


  xhr.onreadystatechange =
    function () {

      if (
        xhr.readyState !== 4
      ) {
        return;
      }


      if (
        xhr.status >= 200 &&
        xhr.status < 300
      ) {

        try {

          var posts =
            JSON.parse(
              xhr.responseText
            );


          if (
            !Array.isArray(posts)
          ) {

            throw new Error(
              "posts.json must contain an array."
            );

          }


          /*
           * Save posts globally.
           */

          allPosts =
            posts.slice();


          /*
           * Newest first.
           */

          allPosts.sort(
            function (a, b) {

              return (
                getPostTime(b) -
                getPostTime(a)
              );

            }
          );


          console.log(
            "Deeprowss posts loaded:",
            allPosts
          );


          /*
           * Homepage sections.
           *
           * These functions simply return
           * when their container doesn't
           * exist.
           */

          displayLivePosts(
            allPosts
          );


          displayHighlightPosts(
            allPosts
          );


          displayMoviePosts(
            allPosts
          );


          /*
           * Search becomes active after
           * posts have loaded.
           */

          setupSearch();


        } catch (error) {

          console.error(
            "Could not read posts.json:",
            error
          );


          showError();

        }

      } else {

        console.error(
          "Could not load posts.json. Status:",
          xhr.status
        );


        showError();

      }

    };


  xhr.onerror =
    function () {

      console.error(
        "Network error loading posts.json"
      );


      showError();

    };


  xhr.send();



  /* =====================================
     DATE
  ===================================== */

  function getPostTime(post) {

    if (
      !post ||
      !post.publishedAt
    ) {

      return 0;

    }


    var time =
      new Date(
        post.publishedAt
      ).getTime();


    return isNaN(time)
      ? 0
      : time;

  }



  /* =====================================
     ERROR
  ===================================== */

  function showError() {

    if (liveContainer) {

      liveContainer.innerHTML =
        '<div class="empty-posts">' +
        'Unable to load football posts.' +
        '</div>';

    }


    if (highlightContainer) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
        'Unable to load highlights.' +
        '</div>';

    }


    if (movieContainer) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
        'Unable to load movies.' +
        '</div>';

    }

  }



  /* =====================================
     ESCAPE HTML
  ===================================== */

  function escapeHTML(value) {

    if (
      value === undefined ||
      value === null
    ) {

      return "";

    }


    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }



  /* =====================================
     FORMAT DATE
  ===================================== */

  function formatPostDate(
    dateString
  ) {

    if (!dateString) {
      return "";
    }


    var date =
      new Date(
        dateString
      );


    if (
      isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    try {

      return date.toLocaleString(
        undefined,
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

    } catch (error) {

      return date.toLocaleString();

    }

  }



  /* =====================================
     THUMBNAIL VALIDATION
  ===================================== */

  function hasThumbnail(
    thumbnail
  ) {

    if (
      thumbnail === undefined ||
      thumbnail === null
    ) {

      return false;

    }


    var value =
      String(thumbnail)
        .trim();


    if (!value) {
      return false;
    }


    /*
     * Don't render placeholder
     * values from posts.json.
     */

    var invalidValues = [
      "YOUR_THUMBNAIL_URL",
      "YOUR_HIGHLIGHT_THUMBNAIL_URL",
      "YOUR_SECOND_HIGHLIGHT_THUMBNAIL_URL",
      "YOUR_SECOND_MOVIE_THUMBNAIL_URL"
    ];


    if (
      invalidValues.indexOf(
        value
      ) !== -1
    ) {

      return false;

    }


    return true;

  }



  /* =====================================
     THUMBNAIL HTML
  ===================================== */

  function createThumbnail(
    thumbnail,
    altText
  ) {

    if (
      !hasThumbnail(
        thumbnail
      )
    ) {

      return "";

    }


    var safeThumbnail =
      escapeHTML(
        String(thumbnail).trim()
      );


    var safeAlt =
      escapeHTML(
        altText ||
        "Thumbnail"
      );


    return (

      '<img ' +

        'class="post-thumbnail" ' +

        'src="' +
          safeThumbnail +
        '" ' +

        'alt="' +
          safeAlt +
        '" ' +

        'loading="lazy" ' +

        'decoding="async" ' +

        'onerror="' +

          'this.style.display=\'none\';' +

          'this.parentElement.classList.add(\'thumbnail-fallback\');' +

        '"' +

      '>'

    );

  }



  /* =====================================
     FOOTBALL LIVE
  ===================================== */

  function displayLivePosts(
    posts
  ) {

    if (!liveContainer) {
      return;
    }


    var livePosts =
      posts.filter(
        function (post) {

          return (
            post &&
            post.type === "live"
          );

        }
      );


    if (
      livePosts.length === 0
    ) {

      liveContainer.innerHTML =
        '<div class="empty-posts">' +
        'No football posts yet.' +
        '</div>';

      return;

    }


    var html = "";


    livePosts.forEach(
      function (post) {

        var status =
          String(
            post.status ||
            "UPCOMING"
          ).toUpperCase();


        var statusClass =
          status === "LIVE"
            ? "live-badge"
            : "upcoming-badge";


        html +=

          '<article class="live-card">' +

            '<div class="match-top">' +

              '<span class="' +
                statusClass +
              '">' +

                escapeHTML(
                  status
                ) +

              '</span>' +

              '<span>' +

                escapeHTML(
                  post.category ||
                  "Football"
                ) +

              '</span>' +

            '</div>' +


            '<div class="teams">' +

              '<strong>' +
                escapeHTML(
                  post.home ||
                  "Team 1"
                ) +
              '</strong>' +

              '<span>vs</span>' +

              '<strong>' +
                escapeHTML(
                  post.away ||
                  "Team 2"
                ) +
              '</strong>' +

            '</div>' +


            '<div class="match-meta">' +

              escapeHTML(
                post.description ||
                ""
              ) +

            '</div>' +


            '<div class="post-date">' +

              formatPostDate(
                post.publishedAt
              ) +

            '</div>' +


            '<button ' +

              'type="button" ' +

              'class="watch-btn" ' +

              'data-url="' +
                escapeHTML(
                  post.embedUrl ||
                  ""
                ) +
              '" ' +

              'data-title="' +
                escapeHTML(
                  post.title ||
                  "Football"
                ) +
              '">' +

              'Watch' +

            '</button>' +

          '</article>';

      }
    );


    liveContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     HIGHLIGHTS
  ===================================== */

  function displayHighlightPosts(
    posts
  ) {

    if (!highlightContainer) {
      return;
    }


    var highlights =
      posts.filter(
        function (post) {

          return (
            post &&
            post.type === "highlight"
          );

        }
      );


    if (
      highlights.length === 0
    ) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
        'No highlights yet.' +
        '</div>';

      return;

    }


    var html = "";


    highlights.forEach(
      function (post) {

        var thumbnailExists =
          hasThumbnail(
            post.thumbnail
          );


        var thumbnailHTML =
          createThumbnail(
            post.thumbnail,
            post.title ||
            "Football Highlight"
          );


        html +=

          '<article class="media-card">' +


            '<div class="media-thumb football-thumb ' +

              (
                thumbnailExists
                  ? "has-thumbnail"
                  : ""
              ) +

            '">' +

              thumbnailHTML +


              '<span class="play" aria-hidden="true">' +
                '▶' +
              '</span>' +

            '</div>' +


            '<div class="media-info">' +

              '<span class="tag">' +
                'HIGHLIGHT' +
              '</span>' +


              '<h3>' +

                escapeHTML(
                  post.title ||
                  "Football Highlight"
                ) +

              '</h3>' +


              '<p>' +

                escapeHTML(
                  post.description ||
                  ""
                ) +

              '</p>' +


              '<div class="post-date">' +

                formatPostDate(
                  post.publishedAt
                ) +

              '</div>' +


              '<button ' +

                'type="button" ' +

                'data-url="' +
                  escapeHTML(
                    post.embedUrl ||
                    ""
                  ) +
                '" ' +

                'data-title="' +
                  escapeHTML(
                    post.title ||
                    "Highlight"
                  ) +
                '">' +

                'Watch highlight' +

              '</button>' +

            '</div>' +

          '</article>';

      }
    );


    highlightContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     MOVIES
  ===================================== */

  function displayMoviePosts(
    posts
  ) {

    if (!movieContainer) {
      return;
    }


    var movies =
      posts.filter(
        function (post) {

          return (
            post &&
            post.type === "movie"
          );

        }
      );


    if (
      movies.length === 0
    ) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
        'No movies yet.' +
        '</div>';

      return;

    }


    var html = "";


    movies.forEach(
      function (post) {

        var thumbnailExists =
          hasThumbnail(
            post.thumbnail
          );


        var thumbnailHTML =
          createThumbnail(
            post.thumbnail,
            post.title ||
            "Movie"
          );


        html +=

          '<article class="movie-card">' +


            '<div class="poster poster-one ' +

              (
                thumbnailExists
                  ? "has-thumbnail"
                  : ""
              ) +

            '">' +

              thumbnailHTML +


              '<span class="poster-category">' +

                escapeHTML(
                  post.category ||
                  "MOVIE"
                ) +

              '</span>' +

            '</div>' +


            '<div class="movie-info">' +

              '<h3>' +

                escapeHTML(
                  post.title ||
                  "Movie"
                ) +

              '</h3>' +


              '<p>' +

                formatPostDate(
                  post.publishedAt
                ) +

              '</p>' +


              '<button ' +

                'type="button" ' +

                'data-url="' +
                  escapeHTML(
                    post.embedUrl ||
                    ""
                  ) +
                '" ' +

                'data-title="' +
                  escapeHTML(
                    post.title ||
                    "Movie"
                  ) +
                '">' +

                'Watch' +

              '</button>' +

            '</div>' +

          '</article>';

      }
    );


    movieContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     VIDEO BUTTONS
  ===================================== */

  function attachVideoButtons() {

    var buttons =
      document.querySelectorAll(
        "[data-url]"
      );


    for (
      var i = 0;
      i < buttons.length;
      i++
    ) {

      buttons[i].onclick =
        function () {

          var url =
            this.getAttribute(
              "data-url"
            );


          var title =
            this.getAttribute(
              "data-title"
            );


          openEmbed(
            title,
            url
          );

        };

    }

  }



  /* =====================================
     VIDEO MODAL
  ===================================== */

  window.openEmbed =
    function (
      title,
      url
    ) {

      var modal =
        document.getElementById(
          "embedModal"
        );


      var modalTitle =
        document.getElementById(
          "modalTitle"
        );


      var embedArea =
        document.getElementById(
          "embedArea"
        );


      if (
        !modal ||
        !embedArea
      ) {

        return;

      }


      if (modalTitle) {

        modalTitle.textContent =
          title ||
          "Video";

      }


      embedArea.innerHTML =
        "";


      var oldControls =
        modal.querySelector(
          ".video-controls"
        );


      if (oldControls) {

        oldControls.remove();

      }



      /* =================================
         IFRAME
      ================================= */

      if (
        url &&
        String(url).trim()
      ) {

        var iframe =
          document.createElement(
            "iframe"
          );


        iframe.src =
          String(url).trim();


        iframe.setAttribute(
          "allowfullscreen",
          ""
        );


        iframe.setAttribute(
          "allow",
          "autoplay; fullscreen; encrypted-media; picture-in-picture"
        );


        iframe.setAttribute(
          "loading",
          "eager"
        );


        iframe.setAttribute(
          "frameborder",
          "0"
        );


        iframe.setAttribute(
          "scrolling",
          "no"
        );


        iframe.setAttribute(
          "title",
          title ||
          "Video"
        );


        embedArea.appendChild(
          iframe
        );


      } else {

        embedArea.innerHTML =

          '<div class="embed-placeholder">' +

            '<strong>' +
              'Video unavailable' +
            '</strong>' +

            '<span class="embed-note">' +
              'No video URL has been added to this post.' +
            '</span>' +

          '</div>';

      }



      /* =================================
         FULLSCREEN CONTROL
      ================================= */

      var controls =
        document.createElement(
          "div"
        );


      controls.className =
        "video-controls";


      var fullscreenButton =
        document.createElement(
          "button"
        );


      fullscreenButton.type =
        "button";


      fullscreenButton.className =
        "fullscreen-btn";


      fullscreenButton.setAttribute(
        "aria-label",
        "Tap to watch in Fullscreen"
      );


      fullscreenButton.setAttribute(
        "title",
        "Tap to watch in Fullscreen"
      );


      fullscreenButton.textContent =
        "Tap to watch in Fullscreen";


      controls.appendChild(
        fullscreenButton
      );


      embedArea.insertAdjacentElement(
        "afterend",
        controls
      );



      /* =================================
         OPEN
      ================================= */

      modal.classList.add(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "false"
      );


      document.body.style.overflow =
        "hidden";

    };



  /* =====================================
     CLOSE VIDEO
  ===================================== */

  window.closeEmbed =
    async function () {

      var modal =
        document.getElementById(
          "embedModal"
        );


      var embedArea =
        document.getElementById(
          "embedArea"
        );


      if (!modal) {
        return;
      }


      /*
       * Exit fullscreen first.
       */

      if (
        document.fullscreenElement
      ) {

        try {

          await document.exitFullscreen();

        } catch (error) {

          console.log(
            "Could not exit fullscreen:",
            error
          );

        }

      }


      /*
       * Unlock orientation.
       */

      if (
        screen.orientation &&
        screen.orientation.unlock
      ) {

        try {

          screen.orientation.unlock();

        } catch (error) {

          console.log(
            "Orientation unlock unavailable:",
            error
          );

        }

      }


      if (embedArea) {

        embedArea.innerHTML =
          "";

      }


      var controls =
        modal.querySelector(
          ".video-controls"
        );


      if (controls) {

        controls.remove();

      }


      modal.classList.remove(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "true"
      );


      document.body.style.overflow =
        "";

    };



  /* =====================================
     FULLSCREEN
  ===================================== */

  document.addEventListener(
    "click",
    async function (event) {

      var button =
        event.target.closest(
          ".fullscreen-btn"
        );


      if (!button) {
        return;
      }


      var modalBox =
        document.querySelector(
          ".modal-box"
        );


      if (!modalBox) {
        return;
      }


      try {

        if (
          !document.fullscreenElement
        ) {

          if (
            modalBox.requestFullscreen
          ) {

            await modalBox.requestFullscreen();

          } else {

            console.log(
              "Fullscreen API is not supported."
            );

            return;

          }


          /*
           * Try landscape on mobile.
           * Some browsers don't allow it.
           */

          if (
            screen.orientation &&
            screen.orientation.lock
          ) {

            try {

              await screen.orientation.lock(
                "landscape"
              );

            } catch (orientationError) {

              console.log(
                "Landscape orientation lock unavailable:",
                orientationError
              );

            }

          }

        } else {

          if (
            document.exitFullscreen
          ) {

            await document.exitFullscreen();

          }

        }

      } catch (error) {

        console.error(
          "Fullscreen error:",
          error
        );

      }

    }
  );



  /* =====================================
     FULLSCREEN CHANGE
  ===================================== */

  document.addEventListener(
    "fullscreenchange",
    function () {

      var button =
        document.querySelector(
          ".fullscreen-btn"
        );


      if (
        document.fullscreenElement
      ) {

        if (button) {

          button.textContent =
            "Exit Fullscreen";


          button.setAttribute(
            "aria-label",
            "Exit Fullscreen"
          );


          button.setAttribute(
            "title",
            "Exit Fullscreen"
          );

        }

      } else {

        if (button) {

          button.textContent =
            "Tap to watch in Fullscreen";


          button.setAttribute(
            "aria-label",
            "Tap to watch in Fullscreen"
          );


          button.setAttribute(
            "title",
            "Tap to watch in Fullscreen"
          );

        }


        if (
          screen.orientation &&
          screen.orientation.unlock
        ) {

          try {

            screen.orientation.unlock();

          } catch (error) {

            console.log(
              "Orientation unlock unavailable:",
              error
            );

          }

        }

      }

    }
  );



  /* =====================================
     MODAL BACKDROP
  ===================================== */

  var modal =
    document.getElementById(
      "embedModal"
    );


  if (modal) {

    modal.addEventListener(
      "click",
      function (event) {

        if (
          event.target === modal ||
          event.target.classList.contains(
            "modal-backdrop"
          )
        ) {

          closeEmbed();

        }

      }
    );

  }



  /* =====================================
     ESC KEY
  ===================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        var currentModal =
          document.getElementById(
            "embedModal"
          );


        if (
          currentModal &&
          currentModal.classList.contains(
            "open"
          )
        ) {

          closeEmbed();

        }

      }

    }
  );



  /* =====================================
     MOBILE MENU
  ===================================== */

  if (
    menuToggle &&
    mainNav
  ) {

    menuToggle.addEventListener(
      "click",
      function () {

        var isOpen =
          mainNav.classList.toggle(
            "open"
          );


        menuToggle.setAttribute(
          "aria-expanded",
          isOpen
            ? "true"
            : "false"
        );


        menuToggle.setAttribute(
          "aria-label",
          isOpen
            ? "Close navigation"
            : "Open navigation"
        );

      }
    );


    /*
     * Close mobile navigation when
     * a navigation link is selected.
     */

    var navLinks =
      mainNav.querySelectorAll(
        "a"
      );


    for (
      var i = 0;
      i < navLinks.length;
      i++
    ) {

      navLinks[i].addEventListener(
        "click",
        function () {

          mainNav.classList.remove(
            "open"
          );


          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );


          menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
          );

        }
      );

    }

  }



  /* =====================================
     SEARCH
  ===================================== */

  function setupSearch() {

    if (!searchInput) {
      return;
    }


    searchInput.addEventListener(
      "input",
      function () {

        performSearch(
          searchInput.value
        );

      }
    );


    /*
     * Search when Enter is pressed.
     */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();


          performSearch(
            searchInput.value
          );

        }

      }
    );

  }



  /* =====================================
     SEARCH
  ===================================== */

  function performSearch(
    query
  ) {

    var search =
      String(
        query || ""
      )
      .trim()
      .toLowerCase();


    /*
     * Empty search restores everything.
     */

    if (!search) {

      clearSearch();

      return;

    }


    var visibleCount = 0;


    /*
     * Search currently rendered cards.
     *
     * This works on homepage sections
     * as well as cards rendered by
     * all-posts.js on separate pages.
     */

    var cards =
      document.querySelectorAll(
        ".live-card, .media-card, .movie-card"
      );


    for (
      var i = 0;
      i < cards.length;
      i++
    ) {

      var card =
        cards[i];


      var text =
        (
          card.textContent ||
          ""
        )
        .toLowerCase();


      var matches =
        text.indexOf(
          search
        ) !== -1;


      card.style.display =
        matches
          ? ""
          : "none";


      if (matches) {
        visibleCount++;
      }

    }


    /*
     * Search status.
     */

    if (searchStatus) {

      searchStatus.textContent =
        visibleCount +
        (
          visibleCount === 1
            ? " result"
            : " results"
        ) +
        " found for \"" +
        query +
        "\"";

    }


    /*
     * No-results message.
     */

    if (noResults) {

      noResults.style.display =
        visibleCount === 0
          ? "block"
          : "none";

    }

  }



  /* =====================================
     CLEAR SEARCH
  ===================================== */

  function clearSearch() {

    var cards =
      document.querySelectorAll(
        ".live-card, .media-card, .movie-card"
      );


    for (
      var i = 0;
      i < cards.length;
      i++
    ) {

      cards[i].style.display =
        "";

    }


    if (searchStatus) {

      searchStatus.textContent =
        "";

    }


    if (noResults) {

      noResults.style.display =
        "none";

    }

  }



  /* =====================================
     COPYRIGHT YEAR
  ===================================== */

  var year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
