document.addEventListener("DOMContentLoaded", function () {

  console.log("Deeprowss script loaded");


  /* =====================================
     CONTAINERS
  ===================================== */

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");

  var allPostsContainer =
    document.getElementById("allPosts");

  var searchInput =
    document.getElementById("siteSearch");

  var searchStatus =
    document.getElementById("searchStatus");

  var noResults =
    document.getElementById("noResults");


  var allPosts = [];



  /* =====================================
     LOAD POSTS
  ===================================== */

  var xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    "posts.json?v=" + Date.now(),
    true
  );


  xhr.onreadystatechange = function () {

    if (xhr.readyState !== 4) {
      return;
    }


    if (xhr.status >= 200 && xhr.status < 300) {

      try {

        var posts =
          JSON.parse(xhr.responseText);


        if (!Array.isArray(posts)) {
          throw new Error("posts.json must contain an array.");
        }


        allPosts = posts;


        /* Newest first */

        allPosts.sort(function (a, b) {

          return (
            getPostTime(b) -
            getPostTime(a)
          );

        });


        console.log(
          "Deeprowss posts loaded:",
          allPosts
        );


        displayLivePosts(allPosts);

        displayHighlightPosts(allPosts);

        displayMoviePosts(allPosts);

        displayAllPosts(allPosts);

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


  xhr.onerror = function () {

    console.error(
      "Network error loading posts.json"
    );

    showError();

  };


  xhr.send();



  /* =====================================
     POST DATE
  ===================================== */

  function getPostTime(post) {

    if (!post) {
      return 0;
    }


    var dateValue =
      post.publishedAt ||
      post.date;


    if (!dateValue) {
      return 0;
    }


    var time =
      new Date(dateValue).getTime();


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


    if (allPostsContainer) {

      allPostsContainer.innerHTML =
        '<div class="empty-posts">' +
        'Unable to load posts.' +
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
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }



  /* =====================================
     FORMAT DATE
  ===================================== */

  function formatPostDate(dateString) {

    if (!dateString) {
      return "";
    }


    var date =
      new Date(dateString);


    if (isNaN(date.getTime())) {
      return "";
    }


    try {

      return date.toLocaleString();

    } catch (error) {

      return date.toString();

    }

  }



  /* =====================================
     THUMBNAIL URL CHECK
  ===================================== */

  function isValidThumbnailUrl(url) {

    if (!url) {
      return false;
    }


    var value =
      String(url).trim();


    if (!value) {
      return false;
    }


    /*
     * These are webpage URLs, not image files.
     */

    if (
      value.indexOf("deviantart.com/") !== -1 &&
      !/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(value)
    ) {

      return false;

    }


    if (
      value.indexOf("YOUR_") === 0
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

    var safeAlt =
      escapeHTML(
        altText || "Thumbnail"
      );


    if (
      !isValidThumbnailUrl(thumbnail)
    ) {

      return "";

    }


    var safeThumbnail =
      escapeHTML(
        String(thumbnail).trim()
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
     THUMBNAIL FALLBACK
  ===================================== */

  function createThumbnailClass(thumbnail) {

    return isValidThumbnailUrl(thumbnail)
      ? "has-thumbnail"
      : "thumbnail-fallback";

  }



  /* =====================================
     FOOTBALL LIVE
  ===================================== */

  function displayLivePosts(posts) {

    if (!liveContainer) {
      return;
    }


    var livePosts =
      posts.filter(function (post) {

        return post.type === "live";

      });


    if (livePosts.length === 0) {

      liveContainer.innerHTML =
        '<div class="empty-posts">' +
        'No football posts yet.' +
        '</div>';

      return;

    }


    var html = "";


    livePosts.forEach(function (post) {

      var status =
        String(
          post.status || "UPCOMING"
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

              escapeHTML(status) +

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
              post.description || ""
            ) +

          '</div>' +


          '<div class="post-date">' +

            formatPostDate(
              post.publishedAt ||
              post.date
            ) +

          '</div>' +


          '<button ' +

            'type="button" ' +

            'class="watch-btn" ' +

            'data-url="' +
              escapeHTML(
                post.embedUrl || ""
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

    });


    liveContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     HIGHLIGHTS
  ===================================== */

  function displayHighlightPosts(posts) {

    if (!highlightContainer) {
      return;
    }


    var highlights =
      posts.filter(function (post) {

        return post.type === "highlight";

      });


    if (highlights.length === 0) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
        'No highlights yet.' +
        '</div>';

      return;

    }


    var html = "";


    highlights.forEach(function (post) {

      var thumbnail =
        createThumbnail(
          post.thumbnail,
          post.title ||
          "Football Highlight"
        );


      html +=

        '<article class="media-card">' +

          '<div class="media-thumb football-thumb ' +
            createThumbnailClass(
              post.thumbnail
            ) +
          '">' +

            thumbnail +

            '<span class="play">▶</span>' +

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
                post.description || ""
              ) +

            '</p>' +


            '<div class="post-date">' +

              formatPostDate(
                post.publishedAt
              ) +

            '</div>' +


            '<button ' +

              'type="button" ' +

              'class="watch-highlight" ' +

              'data-url="' +
                escapeHTML(
                  post.embedUrl || ""
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

    });


    highlightContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     MOVIES
  ===================================== */

  function displayMoviePosts(posts) {

    if (!movieContainer) {
      return;
    }


    var movies =
      posts.filter(function (post) {

        return post.type === "movie";

      });


    if (movies.length === 0) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
        'No movies yet.' +
        '</div>';

      return;

    }


    var html = "";


    movies.forEach(function (post) {

      var hasThumbnail =
        isValidThumbnailUrl(
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

          /*
           * IMPORTANT:
           * Keep the poster area intact even
           * when there is no thumbnail.
           */

          '<div class="poster poster-one ' +

            (
              hasThumbnail
                ? "has-thumbnail"
                : "thumbnail-fallback"
            ) +

          '">' +

            thumbnailHTML +


            '<div class="poster-placeholder">' +

              '<span>' +

                escapeHTML(
                  post.category ||
                  "MOVIE"
                ) +

              '</span>' +

            '</div>' +


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

              'class="watch-movie" ' +

              'data-url="' +
                escapeHTML(
                  post.embedUrl || ""
                ) +
              '" ' +

              'data-title="' +
                escapeHTML(
                  post.title ||
                  "Movie"
                ) +
              '">' +

              'View' +

            '</button>' +

          '</div>' +

        '</article>';

    });


    movieContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     ALL POSTS PAGE
  ===================================== */

  function displayAllPosts(posts) {

    if (!allPostsContainer) {
      return;
    }


    var page =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    var filtered =
      posts;


    if (page === "football.html") {

      filtered =
        posts.filter(function (post) {

          return post.type === "live";

        });

    }


    if (page === "highlights.html") {

      filtered =
        posts.filter(function (post) {

          return post.type === "highlight";

        });

    }


    if (page === "movies.html") {

      filtered =
        posts.filter(function (post) {

          return post.type === "movie";

        });

    }


    if (filtered.length === 0) {

      allPostsContainer.innerHTML =
        '<div class="empty-posts">' +
        'No posts available.' +
        '</div>';

      return;

    }


    var html = "";


    filtered.forEach(function (post) {

      if (post.type === "live") {

        html += createLiveCard(post);

      }

      else if (post.type === "highlight") {

        html += createHighlightCard(post);

      }

      else if (post.type === "movie") {

        html += createMovieCard(post);

      }

    });


    allPostsContainer.innerHTML =
      html;


    attachVideoButtons();

  }



  /* =====================================
     LIVE CARD FOR ALL POSTS
  ===================================== */

  function createLiveCard(post) {

    var status =
      String(
        post.status ||
        "UPCOMING"
      ).toUpperCase();


    var statusClass =
      status === "LIVE"
        ? "live-badge"
        : "upcoming-badge";


    return (

      '<article class="live-card">' +

        '<div class="match-top">' +

          '<span class="' +
            statusClass +
          '">' +

            escapeHTML(status) +

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
            post.description || ""
          ) +

        '</div>' +


        '<div class="post-date">' +

          formatPostDate(
            post.publishedAt ||
            post.date
          ) +

        '</div>' +


        '<button ' +

          'type="button" ' +

          'class="watch-btn" ' +

          'data-url="' +
            escapeHTML(
              post.embedUrl || ""
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

      '</article>'

    );

  }



  /* =====================================
     HIGHLIGHT CARD
  ===================================== */

  function createHighlightCard(post) {

    return (

      '<article class="media-card">' +

        '<div class="media-thumb football-thumb ' +

          createThumbnailClass(
            post.thumbnail
          ) +

        '">' +

          createThumbnail(
            post.thumbnail,
            post.title ||
            "Football Highlight"
          ) +

          '<span class="play">▶</span>' +

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
              post.description || ""
            ) +

          '</p>' +

          '<div class="post-date">' +

            formatPostDate(
              post.publishedAt
            ) +

          '</div>' +

          '<button ' +

            'type="button" ' +

            'class="watch-highlight" ' +

            'data-url="' +
              escapeHTML(
                post.embedUrl || ""
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

      '</article>'

    );

  }



  /* =====================================
     MOVIE CARD
  ===================================== */

  function createMovieCard(post) {

    var hasThumbnail =
      isValidThumbnailUrl(
        post.thumbnail
      );


    return (

      '<article class="movie-card">' +

        '<div class="poster poster-one ' +

          (
            hasThumbnail
              ? "has-thumbnail"
              : "thumbnail-fallback"
          ) +

        '">' +

          createThumbnail(
            post.thumbnail,
            post.title ||
            "Movie"
          ) +

          '<div class="poster-placeholder">' +

            '<span>' +

              escapeHTML(
                post.category ||
                "MOVIE"
              ) +

            '</span>' +

          '</div>' +

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

            'class="watch-movie" ' +

            'data-url="' +
              escapeHTML(
                post.embedUrl || ""
              ) +
            '" ' +

            'data-title="' +
              escapeHTML(
                post.title ||
                "Movie"
              ) +
            '">' +

            'View' +

          '</button>' +

        '</div>' +

      '</article>'

    );

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
        function (event) {

          event.preventDefault();


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
     OPEN EMBED
  ===================================== */

  window.openEmbed =
    function (title, url) {

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


      if (!modal || !embedArea) {
        return;
      }


      if (modalTitle) {

        modalTitle.textContent =
          title ||
          "Video";

      }


      /*
       * Always completely remove the
       * previous iframe before opening
       * another one.
       */

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
         CREATE IFRAME
      ================================= */

      if (url) {

        var iframe =
          document.createElement(
            "iframe"
          );


        iframe.src =
          url;


        iframe.setAttribute(
          "allowfullscreen",
          ""
        );


        iframe.setAttribute(
          "allow",
          "autoplay; fullscreen; encrypted-media; picture-in-picture"
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


        iframe.style.width =
          "100%";


        iframe.style.height =
          "100%";


        iframe.style.border =
          "0";


        embedArea.appendChild(
          iframe
        );

      }

      else {

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
         FULLSCREEN BUTTON
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


      fullscreenButton.textContent =
        "Tap to watch in Fullscreen";


      fullscreenButton.setAttribute(
        "aria-label",
        "Tap to watch in Fullscreen"
      );


      fullscreenButton.setAttribute(
        "title",
        "Tap to watch in Fullscreen"
      );


      controls.appendChild(
        fullscreenButton
      );


      embedArea.insertAdjacentElement(
        "afterend",
        controls
      );



      /* =================================
         OPEN MODAL
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
     CLOSE EMBED
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
            "Orientation unlock unavailable."
          );

        }

      }



      /*
       * MOST IMPORTANT:
       * Destroy the iframe completely.
       */

      if (embedArea) {

        embedArea.innerHTML =
          "";

      }



      /*
       * Remove fullscreen controls.
       */

      var controls =
        modal.querySelector(
          ".video-controls"
        );


      if (controls) {
        controls.remove();
      }



      /*
       * Close modal.
       */

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
     CLOSE BUTTON
  ===================================== */

  var closeButton =
    document.querySelector(
      ".modal-close"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        event.stopPropagation();

        closeEmbed();

      }
    );

  }



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
        event.key !== "Escape"
      ) {
        return;
      }


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
  );



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

        if (!document.fullscreenElement) {

          if (
            modalBox.requestFullscreen
          ) {

            await modalBox.requestFullscreen();

          }


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
                "Orientation lock unavailable."
              );

            }

          }

        }

        else {

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


      if (!button) {
        return;
      }


      if (
        document.fullscreenElement
      ) {

        button.textContent =
          "Exit Fullscreen";


        button.setAttribute(
          "aria-label",
          "Exit Fullscreen"
        );

      }

      else {

        button.textContent =
          "Tap to watch in Fullscreen";


        button.setAttribute(
          "aria-label",
          "Tap to watch in Fullscreen"
        );

      }

    }
  );



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
          this.value
        );

      }
    );


    /*
     * Also support Enter.
     */

    searchInput.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          performSearch(
            this.value
          );

        }

      }
    );

  }



  function performSearch(query) {

    var value =
      String(query || "")
        .trim()
        .toLowerCase();


    if (!value) {

      if (searchStatus) {
        searchStatus.innerHTML = "";
      }


      if (noResults) {
        noResults.classList.remove(
          "show"
        );
      }


      displayLivePosts(allPosts);

      displayHighlightPosts(allPosts);

      displayMoviePosts(allPosts);


      if (allPostsContainer) {
        displayAllPosts(allPosts);
      }


      return;

    }


    var results =
      allPosts.filter(function (post) {

        var text = [

          post.title,

          post.home,

          post.away,

          post.category,

          post.description,

          post.status,

          post.type

        ].join(" ").toLowerCase();


        return text.indexOf(value) !== -1;

      });


    /*
     * Search results should be shown
     * according to the current page.
     */

    var page =
      window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


    if (page === "football.html") {

      results =
        results.filter(function (post) {

          return post.type === "live";

        });

    }


    if (page === "highlights.html") {

      results =
        results.filter(function (post) {

          return post.type === "highlight";

        });

    }


    if (page === "movies.html") {

      results =
        results.filter(function (post) {

          return post.type === "movie";

        });

    }


    if (searchStatus) {

      searchStatus.innerHTML =

        '<p class="search-result-text">' +

          '<strong>' +
            results.length +
          '</strong> ' +

          (
            results.length === 1
              ? "result"
              : "results"
          ) +

          ' found for "' +

          escapeHTML(query) +

          '"' +

        '</p>';

    }


    if (results.length === 0) {

      if (noResults) {

        noResults.classList.add(
          "show"
        );

      }


      if (liveContainer) {
        liveContainer.innerHTML = "";
      }


      if (highlightContainer) {
        highlightContainer.innerHTML = "";
      }


      if (movieContainer) {
        movieContainer.innerHTML = "";
      }


      if (allPostsContainer) {

        allPostsContainer.innerHTML =

          '<div class="empty-posts">' +

            'No matching content found.' +

          '</div>';

      }


      return;

    }


    if (noResults) {

      noResults.classList.remove(
        "show"
      );

    }


    /*
     * Render only the correct section.
     */

    if (page === "football.html") {

      displayAllPosts(results);

    }

    else if (page === "highlights.html") {

      displayAllPosts(results);

    }

    else if (page === "movies.html") {

      displayAllPosts(results);

    }

    else {

      /*
       * Homepage:
       * update all three horizontal sections.
       */

      displayLivePosts(results);

      displayHighlightPosts(results);

      displayMoviePosts(results);

    }

  }



  /* =====================================
     MOBILE MENU
  ===================================== */

  var menuToggle =
    document.getElementById(
      "menuToggle"
    );


  var mainNav =
    document.getElementById(
      "mainNav"
    );


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

      }
    );


    /*
     * Close menu after selecting
     * a navigation link.
     */

    mainNav.addEventListener(
      "click",
      function (event) {

        if (
          event.target.tagName === "A"
        ) {

          mainNav.classList.remove(
            "open"
          );


          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }
    );

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
