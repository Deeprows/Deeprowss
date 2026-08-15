document.addEventListener("DOMContentLoaded", function () {

  console.log("Deeprowss script loaded");


  /* =====================================
     DEEPROWSS POPUNDER AD
  ===================================== */

  var popunderScript =
    document.createElement("script");

  popunderScript.src =
    "https://pl28059580.effectivecpmnetwork.com/e6/2f/e8/e62fe8e048d86c5fd05ea7118ec22e8d.js";

  popunderScript.async = true;

  document.body.appendChild(
    popunderScript
  );


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


  /* =====================================
     CACHE-BUSTING HELPER
  ===================================== */

  function freshUrl(url) {

    if (!url) {
      return "";
    }

    var value =
      String(url).trim();

    if (!value) {
      return "";
    }

    /*
      Only automatically cache-bust local
      website files.

      External URLs are left untouched because
      some external URLs contain security tokens
      or signed parameters.
    */

    if (
      value.indexOf("http://") === 0 ||
      value.indexOf("https://") === 0 ||
      value.indexOf("//") === 0 ||
      value.indexOf("data:") === 0 ||
      value.indexOf("blob:") === 0
    ) {

      return value;

    }

    var separator =
      value.indexOf("?") === -1
        ? "?"
        : "&";

    return (
      value +
      separator +
      "_fresh=" +
      Date.now()
    );

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
     DATE
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
     FOOTBALL MATCH TIME
  ===================================== */

  function getMatchTimeInfo(post) {

    if (
      !post ||
      !post.matchTime
    ) {

      return {
        valid: false,
        timestamp: 0
      };

    }

    var matchDate =
      new Date(post.matchTime);

    var timestamp =
      matchDate.getTime();

    if (isNaN(timestamp)) {

      return {
        valid: false,
        timestamp: 0
      };

    }

    return {
      valid: true,
      timestamp: timestamp
    };

  }


  /* =====================================
     LOCAL MATCH TIME
  ===================================== */

  function formatLocalMatchTime(matchTime) {

    if (!matchTime) {
      return "";
    }

    var date =
      new Date(matchTime);

    if (isNaN(date.getTime())) {
      return "";
    }

    try {

      return date.toLocaleString(
        undefined,
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );

    } catch (error) {

      return date.toLocaleString();

    }

  }


  /* =====================================
     COUNTDOWN FORMAT
  ===================================== */

  function formatCountdown(milliseconds) {

    if (milliseconds <= 0) {
      return "LIVE NOW";
    }

    var totalSeconds =
      Math.floor(
        milliseconds / 1000
      );

    var days =
      Math.floor(
        totalSeconds / 86400
      );

    totalSeconds %= 86400;

    var hours =
      Math.floor(
        totalSeconds / 3600
      );

    totalSeconds %= 3600;

    var minutes =
      Math.floor(
        totalSeconds / 60
      );

    var seconds =
      totalSeconds % 60;


    if (days > 0) {

      return (
        days +
        "d " +
        String(hours).padStart(2, "0") +
        "h " +
        String(minutes).padStart(2, "0") +
        "m " +
        String(seconds).padStart(2, "0") +
        "s"
      );

    }


    return (
      String(hours).padStart(2, "0") +
      "h " +
      String(minutes).padStart(2, "0") +
      "m " +
      String(seconds).padStart(2, "0") +
      "s"
    );

  }


  /* =====================================
     UPDATE FOOTBALL COUNTDOWNS
  ===================================== */

  function updateFootballCountdowns() {

    var countdowns =
      document.querySelectorAll(
        ".match-countdown[data-match-time]"
      );

    var now =
      Date.now();


    countdowns.forEach(
      function (element) {

        var matchTime =
          element.getAttribute(
            "data-match-time"
          );


        if (!matchTime) {
          return;
        }


        var matchTimestamp =
          new Date(
            matchTime
          ).getTime();


        if (isNaN(matchTimestamp)) {
          return;
        }


        var difference =
          matchTimestamp - now;


        var card =
          element.closest(
            ".live-card"
          );


        var badge =
          card
            ? card.querySelector(
                ".live-status-badge"
              )
            : null;


        if (difference <= 0) {

          element.textContent =
            "LIVE NOW";


          element.classList.add(
            "match-live"
          );


          if (badge) {

            badge.textContent =
              "LIVE";


            badge.classList.remove(
              "upcoming-badge"
            );


            badge.classList.add(
              "live-badge"
            );

          }

        }

        else {

          element.textContent =
            formatCountdown(
              difference
            );


          element.classList.remove(
            "match-live"
          );


          if (badge) {

            badge.textContent =
              "UPCOMING";


            badge.classList.remove(
              "live-badge"
            );


            badge.classList.add(
              "upcoming-badge"
            );

          }

        }

      }
    );

  }


  /* =====================================
     START COUNTDOWN
  ===================================== */

  setInterval(
    updateFootballCountdowns,
    1000
  );


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


    /*
      Freshen only local images.
      External image URLs remain unchanged.
    */

    var imageUrl =
      freshUrl(
        safeThumbnail
      );


    return (

      '<div class="' +
        classes +
      '">' +

        '<img ' +

          'class="post-thumbnail" ' +

          'src="' +
            escapeHTML(imageUrl) +
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
     LOAD POSTS.JSON - ALWAYS FRESH
  ===================================== */

  var postsRequestUrl =
    "posts.json?_fresh=" +
    Date.now();


  /*
    Use fetch with:
    - cache: no-store
    - unique URL
    - no local browser cache
  */

  function loadPosts() {

    console.log(
      "Deeprowss: requesting fresh posts.json..."
    );


    fetch(
      postsRequestUrl +
      "&reload=" +
      Date.now(),
      {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          "Cache-Control":
            "no-cache, no-store, must-revalidate",
          "Pragma":
            "no-cache",
          "Expires":
            "0"
        }
      }
    )

    .then(
      function (response) {

        if (!response.ok) {

          throw new Error(
            "posts.json returned HTTP " +
            response.status
          );

        }

        return response.text();

      }
    )

    .then(
      function (text) {

        var posts;

        try {

          posts =
            JSON.parse(text);

        } catch (error) {

          throw new Error(
            "posts.json contains invalid JSON."
          );

        }


        if (!Array.isArray(posts)) {

          throw new Error(
            "posts.json must contain an array."
          );

        }


        posts.sort(
          function (a, b) {

            var aDate =
              a.type === "live"
                ? a.matchTime
                : a.publishedAt;

            var bDate =
              b.type === "live"
                ? b.matchTime
                : b.publishedAt;


            return (
              new Date(
                bDate || 0
              ).getTime() -

              new Date(
                aDate || 0
              ).getTime()
            );

          }
        );


        console.log(
          "Deeprowss fresh posts loaded:",
          posts.length,
          "posts"
        );


        displayLivePosts(posts);

        displayHighlightPosts(posts);

        displayMoviePosts(posts);

        displayAllPosts(posts);

        updateFootballCountdowns();

      }
    )

    .catch(
      function (error) {

        console.error(
          "Could not load fresh posts.json:",
          error
        );

        showError();

      }
    );

  }


  /*
    Initial fresh load.
  */

  loadPosts();


  /* =====================================
     REFRESH WHEN PAGE BECOMES VISIBLE
  ===================================== */

  var lastVisibilityRefresh =
    Date.now();


  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.visibilityState !==
        "visible"
      ) {

        return;

      }


      var now =
        Date.now();


      /*
        Prevent repeated requests when the
        visibility event fires rapidly.

        Refresh after the page has been hidden
        for at least 30 seconds.
      */

      if (
        now -
        lastVisibilityRefresh <
        30000
      ) {

        return;

      }


      lastVisibilityRefresh =
        now;


      console.log(
        "Deeprowss: page visible again. Refreshing content..."
      );


      loadPosts();

    }
  );


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


        var matchInfo =
          getMatchTimeInfo(post);


        var localMatchTime =
          matchInfo.valid
            ? formatLocalMatchTime(
                post.matchTime
              )
            : "";


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
                  ' live-status-badge">' +

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

              (
                matchInfo.valid

                  ?

                    '<div class="match-time">' +

                      '<span>Match time:</span> ' +

                      escapeHTML(
                        localMatchTime
                      ) +

                    '</div>'

                  :

                    ''

              ) +

              (
                matchInfo.valid

                  ?

                    '<div ' +

                      'class="match-countdown" ' +

                      'data-match-time="' +

                        escapeHTML(
                          post.matchTime
                        ) +

                      '">' +

                      'Loading...' +

                    '</div>'

                  :

                    ''

              ) +

              '<button ' +

                'type="button" ' +

                'class="watch-btn" ' +

                'data-url="' +
                  escapeHTML(
                    post.embedUrl || ""
                  ) +

                '" ' +

                'data-alt-url="' +
                  escapeHTML(
                    post.alternativeEmbedUrl || ""
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


    updateFootballCountdowns();

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


    updateFootballCountdowns();

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


    var matchInfo =
      getMatchTimeInfo(post);


    var localMatchTime =
      matchInfo.valid
        ? formatLocalMatchTime(
            post.matchTime
          )
        : "";


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
              ' live-status-badge">' +

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

          (
            matchInfo.valid

              ?

                '<div class="match-time">' +

                  '<span>Match time:</span> ' +

                  escapeHTML(
                    localMatchTime
                  ) +

                '</div>'

              :

                ''

          ) +

          (
            matchInfo.valid

              ?

                '<div ' +

                  'class="match-countdown" ' +

                  'data-match-time="' +

                    escapeHTML(
                      post.matchTime
                    ) +

                  '">' +

                  'Loading...' +

                '</div>'

              :

                ''

          ) +

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
                post.alternativeEmbedUrl ||
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


            var isLiveButton =
              this.classList.contains(
                "watch-btn"
              );


            openEmbed(
              title,
              url,
              isLiveButton
                ? altUrl
                : ""
            );

          };

      }
    );

  }


  /* =====================================
     CREATE IFRAME
  ===================================== */

  function createVideoIframe(
    url,
    title
  ) {

    var iframe =
      document.createElement(
        "iframe"
      );


    iframe.src =
      String(url || "").trim();


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


    return iframe;

  }


  /* =====================================
     SWITCH LIVE SCREEN
  ===================================== */

  function switchLiveScreen(
    useAlternative
  ) {

    var modal =
      document.getElementById(
        "embedModal"
      );


    var embedArea =
      document.getElementById(
        "embedArea"
      );


    if (!modal || !embedArea) {
      return;
    }


    var mainUrl =
      modal.getAttribute(
        "data-main-url"
      ) || "";


    var alternativeUrl =
      modal.getAttribute(
        "data-alternative-url"
      ) || "";


    var title =
      modal.getAttribute(
        "data-video-title"
      ) || "Football";


    var selectedUrl =
      useAlternative
        ? alternativeUrl
        : mainUrl;


    if (!selectedUrl) {

      console.warn(
        "The requested screen URL is missing."
      );

      return;

    }


    embedArea.innerHTML = "";


    var iframe =
      createVideoIframe(
        selectedUrl,
        title
      );


    embedArea.appendChild(
      iframe
    );


    modal.setAttribute(
      "data-active-screen",
      useAlternative
        ? "alternative"
        : "main"
    );


    var switchButton =
      modal.querySelector(
        ".screen-switch-btn"
      );


    if (switchButton) {

      if (useAlternative) {

        switchButton.textContent =
          "Main Screen";


        switchButton.setAttribute(
          "aria-label",
          "Switch to Main Screen"
        );

      }

      else {

        switchButton.textContent =
          "Alt Screen";


        switchButton.setAttribute(
          "aria-label",
          "Switch to Alternative Screen"
        );

      }

    }

  }


  /* =====================================
     OPEN VIDEO
  ===================================== */

  window.openEmbed =
    function (
      title,
      url,
      alternativeUrl
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


      modal.setAttribute(
        "data-main-url",
        url || ""
      );


      modal.setAttribute(
        "data-alternative-url",
        alternativeUrl || ""
      );


      modal.setAttribute(
        "data-video-title",
        title || "Video"
      );


      modal.setAttribute(
        "data-active-screen",
        "main"
      );


      embedArea.innerHTML = "";


      var oldControls =
        modal.querySelector(
          ".video-controls"
        );


      if (oldControls) {
        oldControls.remove();
      }


      if (url) {

        var iframe =
          createVideoIframe(
            url,
            title
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


      var controls =
        document.createElement(
          "div"
        );


      controls.className =
        "video-controls";


      if (
        alternativeUrl &&
        url
      ) {

        var screenSwitchButton =
          document.createElement(
            "button"
          );


        screenSwitchButton.type =
          "button";


        screenSwitchButton.className =
          "screen-switch-btn";


        screenSwitchButton.textContent =
          "Alt Screen";


        screenSwitchButton.setAttribute(
          "aria-label",
          "Switch to Alternative Screen"
        );


        screenSwitchButton.addEventListener(
          "click",
          function (event) {

            event.preventDefault();

            event.stopPropagation();


            var activeScreen =
              modal.getAttribute(
                "data-active-screen"
              );


            if (
              activeScreen ===
              "alternative"
            ) {

              switchLiveScreen(
                false
              );

            }

            else {

              switchLiveScreen(
                true
              );

            }

          }
        );


        controls.appendChild(
          screenSwitchButton
        );

      }


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


      embedArea.insertAdjacentElement(
        "afterend",
        controls
      );


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


    if (
      document.fullscreenElement &&
      document.exitFullscreen
    ) {

      try {

        await document.exitFullscreen();

      }

      catch (error) {

        console.warn(
          "Could not exit fullscreen:",
          error
        );

      }

    }


    if (
      screen.orientation &&
      typeof screen.orientation.unlock ===
      "function"
    ) {

      try {

        screen.orientation.unlock();

      }

      catch (error) {

        console.warn(
          "Could not unlock orientation:",
          error
        );

      }

    }


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


    var controls =
      modal.querySelector(
        ".video-controls"
      );


    if (controls) {

      controls.remove();

    }


    modal.removeAttribute(
      "data-main-url"
    );


    modal.removeAttribute(
      "data-alternative-url"
    );


    modal.removeAttribute(
      "data-active-screen"
    );


    modal.removeAttribute(
      "data-video-title"
    );


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


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


      if (document.fullscreenElement) {

        try {

          await document.exitFullscreen();

        }

        catch (error) {

          console.warn(
            "Could not exit fullscreen:",
            error
          );

        }

        return;

      }


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


        await iframe.requestFullscreen();


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

          }

          catch (orientationError) {

            console.warn(
              "Landscape orientation could not be locked:",
              orientationError
            );

          }

        }

      }

      catch (error) {

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

      if (!document.fullscreenElement) {

        if (
          screen.orientation &&
          typeof screen.orientation.unlock ===
          "function"
        ) {

          try {

            screen.orientation.unlock();

          }

          catch (error) {

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
