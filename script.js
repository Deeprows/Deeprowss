document.addEventListener("DOMContentLoaded", function () {

  console.log("Deeprowss script loaded");

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");

  var allPostsContainer =
    document.getElementById("allPosts");


  /* =====================================
     ESCAPE HTML
  ===================================== */

  function escapeHTML(value) {

    if (value === undefined || value === null) {
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
     DATE
  ===================================== */

  function formatPostDate(dateString) {

    if (!dateString) {
      return "";
    }

    var date = new Date(dateString);

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
     THUMBNAIL
  ===================================== */

  function createThumbnail(
    thumbnail,
    altText,
    extraClass
  ) {

    var safeAlt =
      escapeHTML(
        altText || "Thumbnail"
      );

    var safeThumbnail =
      thumbnail
        ? String(thumbnail).trim()
        : "";

    var classes =
      "post-thumb " +
      (extraClass || "") +
      (safeThumbnail
        ? " has-thumbnail"
        : " no-thumbnail");


    /* No thumbnail */

    if (!safeThumbnail) {

      return (
        '<div class="' +
          classes +
        '">' +

          '<div class="thumbnail-placeholder">' +

            '<span>' +
              'DEE<span>PROWSS</span>' +
            '</span>' +

          '</div>' +

        '</div>'
      );

    }


    /* Real thumbnail */

    return (

      '<div class="' +
        classes +
      '">' +

        '<img ' +

          'class="post-thumbnail" ' +

          'src="' +
            escapeHTML(safeThumbnail) +
          '" ' +

          'alt="' +
            safeAlt +
          '" ' +

          'loading="lazy" ' +

          'decoding="async" ' +

          'onerror="' +
            "this.parentElement.classList.add('image-error');" +
            "this.parentElement.classList.remove('has-thumbnail');" +
            "this.remove();" +
          '"' +

        '>' +

      '</div>'

    );

  }


  /* =====================================
     MOVIE DOWNLOAD BUTTON
  ===================================== */

  function createMovieDownloadButton(post) {

    var downloadUrl =
      post.downloadUrl
        ? String(post.downloadUrl).trim()
        : "";


    if (!downloadUrl) {
      return "";
    }


    var title =
      post.title ||
      "Movie";


    return (

      '<a ' +

        'class="movie-download-btn" ' +

        'href="' +
          escapeHTML(downloadUrl) +
        '" ' +

        'target="_blank" ' +

        'rel="noopener noreferrer" ' +

        'aria-label="Download ' +
          escapeHTML(title) +
        '" ' +

        'title="Download">' +


        '<svg ' +

          'viewBox="0 0 24 24" ' +

          'aria-hidden="true" ' +

          'focusable="false">' +


          '<path d="M12 3v11"></path>' +

          '<path d="m7 10 5 5 5-5"></path>' +

          '<path d="M5 21h14"></path>' +


        '</svg>' +


      '</a>'

    );

  }


  /* =====================================
     LOAD POSTS.JSON
  ===================================== */

  var xhr =
    new XMLHttpRequest();


  xhr.open(
    "GET",
    "posts.json?v=" + Date.now(),
    true
  );


  xhr.onreadystatechange =
    function () {

      if (xhr.readyState !== 4) {
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


          if (!Array.isArray(posts)) {

            throw new Error(
              "posts.json must contain an array."
            );

          }


          posts.sort(
            function (a, b) {

              return (
                new Date(
                  b.publishedAt || 0
                ).getTime() -

                new Date(
                  a.publishedAt || 0
                ).getTime()
              );

            }
          );


          console.log(
            "Deeprowss posts loaded:",
            posts
          );


          displayLivePosts(posts);

          displayHighlightPosts(posts);

          displayMoviePosts(posts);

          displayAllPosts(posts);


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
     FOOTBALL LIVE
  ===================================== */

  function displayLivePosts(posts) {

    if (!liveContainer) {
      return;
    }


    var livePosts =
      posts.filter(
        function (post) {

          return post.type === "live";

        }
      );


    if (livePosts.length === 0) {

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
            post.status || "UPCOMING"
          ).toUpperCase();


        var statusClass =
          status === "LIVE"
            ? "live-badge"
            : "upcoming-badge";


        html +=

          '<article class="live-card">' +


            createThumbnail(
              post.thumbnail,
              post.title ||
              (
                (post.home || "Team 1") +
                " vs " +
                (post.away || "Team 2")
              ),
              "live-thumbnail"
            ) +


            '<div class="live-card-content">' +


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

                'data-alt-url="' +

                  escapeHTML(
                    post.embedUrlAlt ||
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


            '</div>' +


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

  function displayHighlightPosts(posts) {

    if (!highlightContainer) {
      return;
    }


    var highlights =
      posts.filter(
        function (post) {

          return post.type === "highlight";

        }
      );


    if (highlights.length === 0) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
          'No highlights yet.' +
        '</div>';

      return;

    }


    var html = "";


    highlights.forEach(
      function (post) {

        html +=

          '<article class="media-card">' +


            createThumbnail(
              post.thumbnail,
              post.title ||
              "Football Highlight",
              "highlight-thumbnail"
            ) +


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

                'class="media-watch-btn" ' +

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

  function displayMoviePosts(posts) {

    if (!movieContainer) {
      return;
    }


    var movies =
      posts.filter(
        function (post) {

          return post.type === "movie";

        }
      );


    if (movies.length === 0) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
          'No movies yet.' +
        '</div>';

      return;

    }


    var html = "";


    movies.forEach(
      function (post) {

        html +=

          '<article class="movie-card">' +


            createThumbnail(
              post.thumbnail,
              post.title ||
              "Movie",
              "movie-thumbnail"
            ) +


            '<div class="movie-info">' +


              '<span class="tag">' +

                escapeHTML(
                  post.category ||
                  "MOVIE"
                ) +

              '</span>' +


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


              '<div class="movie-actions">' +


                '<button ' +

                  'type="button" ' +

                  'class="movie-watch-btn" ' +

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


                createMovieDownloadButton(
                  post
                ) +


              '</div>' +


            '</div>' +


          '</article>';

      }
    );


    movieContainer.innerHTML =
      html;


    attachVideoButtons();

  }


  /* =====================================
     ALL POSTS
  ===================================== */

  function displayAllPosts(posts) {

    if (!allPostsContainer) {
      return;
    }


    var path =
      window.location.pathname
        .toLowerCase();


    var filteredPosts =
      posts;


    if (
      path.indexOf("football.html") !== -1
    ) {

      filteredPosts =
        posts.filter(
          function (post) {

            return post.type === "live";

          }
        );

    }


    else if (
      path.indexOf("highlights.html") !== -1
    ) {

      filteredPosts =
        posts.filter(
          function (post) {

            return post.type === "highlight";

          }
        );

    }


    else if (
      path.indexOf("movies.html") !== -1
    ) {

      filteredPosts =
        posts.filter(
          function (post) {

            return post.type === "movie";

          }
        );

    }


    if (filteredPosts.length === 0) {

      allPostsContainer.innerHTML =
        '<div class="empty-posts">' +
          'No content available.' +
        '</div>';

      return;

    }


    var html = "";


    filteredPosts.forEach(
      function (post) {

        if (post.type === "live") {

          html +=
            createLiveGridCard(post);

        }

        else if (
          post.type === "highlight"
        ) {

          html +=
            createHighlightGridCard(post);

        }

        else if (
          post.type === "movie"
        ) {

          html +=
            createMovieGridCard(post);

        }

      }
    );


    allPostsContainer.innerHTML =
      html;


    attachVideoButtons();

  }


  /* =====================================
     LIVE GRID CARD
  ===================================== */

  function createLiveGridCard(post) {

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


        createThumbnail(
          post.thumbnail,
          post.title ||
          "Football",
          "live-thumbnail"
        ) +


        '<div class="live-card-content">' +


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


          '<p class="match-meta">' +

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

            'class="watch-btn" ' +

            'data-url="' +

              escapeHTML(
                post.embedUrl ||
                ""
              ) +

            '" ' +

            'data-alt-url="' +

              escapeHTML(
                post.embedUrlAlt ||
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


        '</div>' +


      '</article>'

    );

  }


  /* =====================================
     HIGHLIGHT GRID CARD
  ===================================== */

  function createHighlightGridCard(post) {

    return (

      '<article class="media-card">' +


        createThumbnail(
          post.thumbnail,
          post.title ||
          "Highlight",
          "highlight-thumbnail"
        ) +


        '<div class="media-info">' +


          '<span class="tag">' +
            'HIGHLIGHT' +
          '</span>' +


          '<h3>' +

            escapeHTML(
              post.title ||
              "Highlight"
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

            'class="media-watch-btn" ' +

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


      '</article>'

    );

  }


  /* =====================================
     MOVIE GRID CARD
  ===================================== */

  function createMovieGridCard(post) {

    return (

      '<article class="movie-card">' +


        createThumbnail(
          post.thumbnail,
          post.title ||
          "Movie",
          "movie-thumbnail"
        ) +


        '<div class="movie-info">' +


          '<span class="tag">' +

            escapeHTML(
              post.category ||
              "MOVIE"
            ) +

          '</span>' +


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


          '<div class="movie-actions">' +


            '<button ' +

              'type="button" ' +

              'class="movie-watch-btn" ' +

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


            createMovieDownloadButton(
              post
            ) +


          '</div>' +


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
        ".watch-btn, .media-watch-btn, .movie-watch-btn"
      );


    buttons.forEach(
      function (button) {

        button.onclick =
          function (event) {

            event.preventDefault();


            var url =
              this.getAttribute(
                "data-url"
              ) || "";


            var altUrl =
              this.getAttribute(
                "data-alt-url"
              ) || "";


            var title =
              this.getAttribute(
                "data-title"
              ) || "Video";


            openEmbed(
              title,
              url,
              altUrl
            );

          };

      }
    );

  }


  /* =====================================
     OPEN VIDEO
  ===================================== */

  window.openEmbed =
    function (title, url, altUrl) {

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

        console.warn(
          "Video modal not found on this page."
        );

        return;

      }


      if (modalTitle) {

        modalTitle.textContent =
          title || "Video";

      }


      /* =================================
         DESTROY PREVIOUS IFRAME
      ================================= */

      embedArea.innerHTML = "";


      /* Remove old controls */

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
          String(url).trim();


        iframe.setAttribute(
          "allowfullscreen",
          ""
        );


        iframe.setAttribute(
          "allow",
          "autoplay; fullscreen; encrypted-media; picture-in-picture; orientation-lock"
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
          title || "Video"
        );


        iframe.setAttribute(
          "webkitallowfullscreen",
          ""
        );


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
         STREAM CONTROLS
      ================================= */

      var controls =
        document.createElement(
          "div"
        );


      controls.className =
        "video-controls";


      /*
       * MAIN SCREEN BUTTON
       */

      var mainButton =
        document.createElement(
          "button"
        );


      mainButton.type =
        "button";


      mainButton.className =
        "stream-button active";


      mainButton.textContent =
        "Main Screen";


      mainButton.setAttribute(
        "aria-label",
        "Switch to main screen"
      );


      /*
       * ALTERNATIVE BUTTON
       */

      var alternativeButton =
        document.createElement(
          "button"
        );


      alternativeButton.type =
        "button";


      alternativeButton.className =
        "stream-button";


      alternativeButton.textContent =
        "Alternative";


      alternativeButton.setAttribute(
        "aria-label",
        "Switch to alternative screen"
      );


      /*
       * MAIN SCREEN
       */

      mainButton.onclick =
        function () {

          if (!url) {
            return;
          }


          var currentIframe =
            embedArea.querySelector(
              "iframe"
            );


          if (!currentIframe) {
            return;
          }


          currentIframe.src =
            String(url).trim();


          mainButton.classList.add(
            "active"
          );


          alternativeButton.classList.remove(
            "active"
          );

        };


      /*
       * ALTERNATIVE SCREEN
       */

      alternativeButton.onclick =
        function () {

          if (!altUrl) {
            return;
          }


          var currentIframe =
            embedArea.querySelector(
              "iframe"
            );


          if (!currentIframe) {
            return;
          }


          currentIframe.src =
            String(altUrl).trim();


          alternativeButton.classList.add(
            "active"
          );


          mainButton.classList.remove(
            "active"
          );

        };


      controls.appendChild(
        mainButton
      );


      /*
       * Only show Alternative when
       * an alternative URL exists.
       */

      if (altUrl) {

        controls.appendChild(
          alternativeButton
        );

      }


      embedArea.insertAdjacentElement(
        "afterend",
        controls
      );


      /* =================================
         FULLSCREEN CONTROL
      ================================= */

      var fullscreenButton =
        document.createElement(
          "button"
        );


      fullscreenButton.type =
        "button";


      fullscreenButton.className =
        "fullscreen-btn";


      fullscreenButton.textContent =
        "Tap to watch in Landscape Fullscreen";


      fullscreenButton.setAttribute(
        "aria-label",
        "Tap to watch in Landscape Fullscreen"
      );


      controls.appendChild(
        fullscreenButton
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
     CLOSE VIDEO MODAL
  ===================================== */

  async function closeVideoModal() {

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


    /* =================================
       EXIT FULLSCREEN
    ================================= */

    if (
      document.fullscreenElement &&
      document.exitFullscreen
    ) {

      try {

        await document.exitFullscreen();

      } catch (error) {

        console.warn(
          "Could not exit fullscreen:",
          error
        );

      }

    }


    /* =================================
       UNLOCK ORIENTATION
    ================================= */

    if (
      screen.orientation &&
      typeof screen.orientation.unlock ===
      "function"
    ) {

      try {

        screen.orientation.unlock();

      } catch (error) {

        console.warn(
          "Could not unlock orientation:",
          error
        );

      }

    }


    /* =================================
       DESTROY IFRAME
    ================================= */

    if (embedArea) {

      var iframe =
        embedArea.querySelector(
          "iframe"
        );


      if (iframe) {

        iframe.src =
          "about:blank";

        iframe.remove();

      }


      embedArea.innerHTML =
        "";

    }


    /* =================================
       REMOVE FULLSCREEN / STREAM CONTROLS
    ================================= */

    var controls =
      modal.querySelector(
        ".video-controls"
      );


    if (controls) {

      controls.remove();

    }


    /* =================================
       CLOSE MODAL
    ================================= */

    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    /* =================================
       RESET TITLE
    ================================= */

    var modalTitle =
      document.getElementById(
        "modalTitle"
      );


    if (modalTitle) {

      modalTitle.textContent =
        "Video";

    }

  }


  window.closeEmbed =
    closeVideoModal;


  /* =====================================
     CLOSE BUTTON + BACKDROP
  ===================================== */

  document.addEventListener(
    "click",
    function (event) {

      var closeButton =
        event.target.closest(
          ".modal-close"
        );


      if (closeButton) {

        event.preventDefault();

        event.stopPropagation();

        closeVideoModal();

        return;

      }


      if (
        event.target.classList &&
        event.target.classList.contains(
          "modal-backdrop"
        )
      ) {

        event.preventDefault();

        closeVideoModal();

      }

    }
  );


  /* =====================================
     ESC KEY
  ===================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" ||
        event.key === "Esc"
      ) {

        var modal =
          document.getElementById(
            "embedModal"
          );


        if (
          modal &&
          modal.classList.contains(
            "open"
          )
        ) {

          event.preventDefault();

          closeVideoModal();

        }

      }

    }
  );


  /* =====================================
     FULLSCREEN + LANDSCAPE
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


      event.preventDefault();


      var embedArea =
        document.getElementById(
          "embedArea"
        );


      if (!embedArea) {
        return;
      }


      var iframe =
        embedArea.querySelector(
          "iframe"
        );


      if (!iframe) {

        console.warn(
          "Fullscreen iframe not found."
        );

        return;

      }


      /* =================================
         EXIT FULLSCREEN
      ================================= */

      if (document.fullscreenElement) {

        try {

          await document.exitFullscreen();

        } catch (error) {

          console.warn(
            "Could not exit fullscreen:",
            error
          );

        }

        return;

      }


      /* =================================
         ENTER IFRAME FULLSCREEN
      ================================= */

      try {

        if (
          typeof iframe.requestFullscreen !==
          "function"
        ) {

          console.warn(
            "Fullscreen is not supported by this browser."
          );

          return;

        }


        /*
         * The iframe itself becomes fullscreen.
         */

        await iframe.requestFullscreen();


        /* =================================
           REQUEST LANDSCAPE
        ================================= */

        if (
          screen.orientation &&
          typeof screen.orientation.lock ===
          "function"
        ) {

          try {

            await screen.orientation.lock(
              "landscape"
            );


            console.log(
              "Landscape orientation locked."
            );

          } catch (orientationError) {

            console.warn(
              "Landscape orientation could not be locked:",
              orientationError
            );

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

     Unlock orientation when the user
     exits fullscreen using Android/browser
     controls.
  ===================================== */

  document.addEventListener(
    "fullscreenchange",
    function () {

      if (!document.fullscreenElement) {

        if (
          screen.orientation &&
          typeof screen.orientation.unlock ===
          "function"
        ) {

          try {

            screen.orientation.unlock();

            console.log(
              "Screen orientation unlocked."
            );

          } catch (error) {

            console.warn(
              "Could not unlock orientation:",
              error
            );

          }

        }

      }

    }
  );


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

    menuToggle.onclick =
      function () {

        mainNav.classList.toggle(
          "open"
        );


        var isOpen =
          mainNav.classList.contains(
            "open"
          );


        menuToggle.setAttribute(
          "aria-expanded",
          isOpen
            ? "true"
            : "false"
        );

      };


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
     COPYRIGHT
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
