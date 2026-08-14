document.addEventListener("DOMContentLoaded", function () {

  "use strict";

  /*
   * DEEPROWSS UNIVERSAL VIDEO SYSTEM
   *
   * Works across:
   * - Homepage
   * - View All pages
   * - Section pages
   * - Dynamically created posts
   * - Future posts loaded from posts.json
   *
   * Any Watch/View control using:
   * data-url
   * data-embed-url
   * data-video-url
   *
   * will open the video in a NEW BROWSER PAGE/TAB.
   *
   * The video is NOT opened inside a modal.
   */

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");


  console.log(
    "Deeprowss: Universal video system loaded."
  );


  /* =========================================================
     UNIVERSAL VIDEO CLICK HANDLER
  ========================================================= */

  if (!window.deeprowssVideoSystemAttached) {

    window.deeprowssVideoSystemAttached = true;

    document.addEventListener(
      "click",
      function (event) {

        var button =
          event.target.closest(
            "[data-url], [data-embed-url], [data-video-url]"
          );


        if (!button) {
          return;
        }


        /*
         * Do not intercept fullscreen controls.
         */

        if (
          button.classList.contains(
            "fullscreen-btn"
          )
        ) {
          return;
        }


        /*
         * Only treat actual Watch/View controls
         * as video controls.
         */

        var tagName =
          button.tagName
            ? button.tagName.toLowerCase()
            : "";


        var isVideoControl =
          tagName === "button" ||
          tagName === "a" ||
          button.classList.contains("watch-btn") ||
          button.classList.contains("video-btn") ||
          button.classList.contains("watch-button");


        if (!isVideoControl) {
          return;
        }


        /*
         * Stop the normal link/button action.
         */

        event.preventDefault();


        /*
         * Get video URL.
         */

        var url =
          button.getAttribute("data-url") ||
          button.getAttribute("data-embed-url") ||
          button.getAttribute("data-video-url") ||
          "";


        url =
          String(url).trim();


        /*
         * Get video title.
         */

        var title =
          button.getAttribute("data-title") ||
          button.getAttribute("data-video-title") ||
          "";


        title =
          String(title).trim();


        if (!title) {

          title =
            button.textContent
              .replace(/\s+/g, " ")
              .trim() ||
            "Deeprowss Video";

        }


        /*
         * Do not attempt to open a missing URL.
         */

        if (!url) {

          console.error(
            "Deeprowss: Watch/View button has no video URL:",
            button
          );

          return;

        }


        console.log(
          "Deeprowss: Opening video in new page:",
          {
            title: title,
            url: url,
            page: window.location.href
          }
        );


        /*
         * Open the video in a completely separate page.
         */

        openVideoPage(
          title,
          url
        );

      },
      false
    );

  }


  /* =========================================================
     OPEN VIDEO IN NEW PAGE
     
     IMPORTANT:
     Clicking Watch/View from the homepage, View All page,
     section page, or any future post opens a separate page.
     
     It does NOT use #embedModal.
     It does NOT open inside the homepage.
     It does NOT depend on modal HTML.
  ========================================================= */

  function openVideoPage(
    title,
    url
  ) {

    /*
     * Open a blank page immediately while this function
     * is still running from the visitor's click.
     */

    var videoPage =
      window.open(
        "",
        "_blank"
      );


    /*
     * If the browser blocks the new page,
     * do not replace or navigate the current page.
     */

    if (!videoPage) {

      console.error(
        "Deeprowss: Browser blocked the new video page."
      );

      return;

    }


    /*
     * Safely prepare title and URL.
     */

    var safeTitle =
      escapeHTML(
        title || "Deeprowss Video"
      );


    var safeURL =
      escapeAttribute(
        url
      );


    /*
     * Build the completely separate video page.
     */

    videoPage.document.open();

    videoPage.document.write(

      "<!DOCTYPE html>" +

      '<html lang="en">' +

      "<head>" +

        '<meta charset="UTF-8">' +

        '<meta name="viewport" ' +
          'content="width=device-width, initial-scale=1.0">' +

        "<title>" +
          safeTitle +
        "</title>" +

        "<style>" +

          "html,body{" +
            "margin:0;" +
            "padding:0;" +
            "width:100%;" +
            "height:100%;" +
            "background:#000;" +
            "overflow:hidden;" +
          "}" +

          "body{" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
          "}" +

          "iframe{" +
            "display:block;" +
            "width:100%;" +
            "height:100%;" +
            "border:0;" +
            "margin:0;" +
            "padding:0;" +
            "background:#000;" +
          "}" +

        "</style>" +

      "</head>" +

      "<body>" +

        '<iframe ' +

          'src="' +
            safeURL +
          '" ' +

          'allowfullscreen ' +

          'allow="' +
            "autoplay; fullscreen; encrypted-media; " +
            "picture-in-picture" +
          '" ' +

          'frameborder="0" ' +

          'scrolling="no" ' +

          'referrerpolicy="strict-origin-when-cross-origin" ' +

          'title="' +
            safeTitle +
          '">' +

        "</iframe>" +

      "</body>" +

      "</html>"

    );

    videoPage.document.close();


    /*
     * Focus the newly opened video page.
     */

    try {

      videoPage.focus();

    } catch (error) {

      console.log(
        "Deeprowss: Could not focus video page.",
        error
      );

    }

  }


  /* =========================================================
     OPEN EMBED COMPATIBILITY
     
     Other existing scripts can still call:
     
       openEmbed(title, url)
     
     It now opens the video in a separate page too.
  ========================================================= */

  window.openEmbed =
    function (
      title,
      url
    ) {

      if (!url) {

        console.error(
          "Deeprowss: openEmbed called without a URL."
        );

        return;

      }


      openVideoPage(
        title || "Video",
        url
      );

    };


  /* =========================================================
     LOAD POSTS
  ========================================================= */

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
              "posts.json must contain an array of posts."
            );

          }


          console.log(
            "Deeprowss: Posts loaded:",
            posts
          );


          /*
           * Newest posts first.
           */

          posts.sort(
            function (a, b) {

              return (
                new Date(
                  b.publishedAt
                ).getTime() -

                new Date(
                  a.publishedAt
                ).getTime()
              );

            }
          );


          /*
           * Render every section.
           */

          displayLivePosts(
            posts
          );


          displayHighlightPosts(
            posts
          );


          displayMoviePosts(
            posts
          );


        } catch (error) {

          console.error(
            "Deeprowss: Could not read posts.json:",
            error
          );


          showError();

        }

      } else {

        console.error(
          "Deeprowss: Could not load posts.json. Status:",
          xhr.status
        );


        showError();

      }

    };


  xhr.onerror =
    function () {

      console.error(
        "Deeprowss: Network error loading posts.json."
      );


      showError();

    };


  xhr.send();


  /* =========================================================
     ERROR
  ========================================================= */

  function showError() {

    if (liveContainer) {

      liveContainer.innerHTML =
        '<div class="empty-posts">' +
        "Unable to load football posts." +
        "</div>";

    }


    if (highlightContainer) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
        "Unable to load highlights." +
        "</div>";

    }


    if (movieContainer) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
        "Unable to load movies." +
        "</div>";

    }

  }


  /* =========================================================
     FORMAT LOCAL DATE
  ========================================================= */

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

      return date.toLocaleString();

    } catch (error) {

      return date.toString();

    }

  }


  /* =========================================================
     FOOTBALL LIVE
  ========================================================= */

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
            String(
              post.type || ""
            ).toLowerCase() ===
            "live"
          );

        }
      );


    if (
      livePosts.length === 0
    ) {

      liveContainer.innerHTML =
        '<div class="empty-posts">' +
        "No football posts yet." +
        "</div>";

      return;

    }


    var html =
      "";


    livePosts.forEach(
      function (post) {

        var status =
          post.status ||
          "UPCOMING";


        var statusClass =
          String(status)
            .toUpperCase() ===
          "LIVE"
            ? "live-badge"
            : "upcoming-badge";


        var title =
          post.title ||
          "Video";


        var url =
          getPostVideoURL(
            post
          );


        html +=

          '<article class="live-card">' +

            '<div class="match-top">' +

              '<span class="' +
                statusClass +
              '">' +

                escapeHTML(
                  status
                ) +

              "</span>" +

              "<span>" +

                escapeHTML(
                  post.category ||
                  "Football"
                ) +

              "</span>" +

            "</div>" +


            '<div class="teams">' +

              "<strong>" +

                escapeHTML(
                  post.home ||
                  "Team 1"
                ) +

              "</strong>" +

              "<span>vs</span>" +

              "<strong>" +

                escapeHTML(
                  post.away ||
                  "Team 2"
                ) +

              "</strong>" +

            "</div>" +


            '<div class="match-meta">' +

              escapeHTML(
                post.description ||
                ""
              ) +

            "</div>" +


            '<div class="post-date">' +

              formatPostDate(
                post.publishedAt
              ) +

            "</div>" +


            '<button ' +

              'type="button" ' +

              'class="watch-btn" ' +

              'data-url="' +

                escapeAttribute(
                  url
                ) +

              '" ' +

              'data-title="' +

                escapeAttribute(
                  title
                ) +

              '">' +

              "Watch" +

            "</button>" +

          "</article>";

      }
    );


    liveContainer.innerHTML =
      html;

  }


  /* =========================================================
     HIGHLIGHTS
  ========================================================= */

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
            String(
              post.type || ""
            ).toLowerCase() ===
            "highlight"
          );

        }
      );


    if (
      highlights.length === 0
    ) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">' +
        "No highlights yet." +
        "</div>";

      return;

    }


    var html =
      "";


    highlights.forEach(
      function (post) {

        var title =
          post.title ||
          "Football Highlight";


        var url =
          getPostVideoURL(
            post
          );


        html +=

          '<article class="media-card">' +

            '<div class="media-thumb football-thumb">' +

              '<span class="play">' +
                "▶" +
              "</span>" +

            "</div>" +


            '<div class="media-info">' +

              '<span class="tag">' +
                "HIGHLIGHT" +
              "</span>" +


              "<h3>" +

                escapeHTML(
                  title
                ) +

              "</h3>" +


              "<p>" +

                escapeHTML(
                  post.description ||
                  ""
                ) +

              "</p>" +


              '<div class="post-date">' +

                formatPostDate(
                  post.publishedAt
                ) +

              "</div>" +


              '<button ' +

                'type="button" ' +

                'class="watch-btn" ' +

                'data-url="' +

                  escapeAttribute(
                    url
                  ) +

                '" ' +

                'data-title="' +

                  escapeAttribute(
                    title
                  ) +

                '">' +

                "Watch highlight" +

              "</button>" +

            "</div>" +

          "</article>";

      }
    );


    highlightContainer.innerHTML =
      html;

  }


  /* =========================================================
     MOVIES
  ========================================================= */

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
            String(
              post.type || ""
            ).toLowerCase() ===
            "movie"
          );

        }
      );


    if (
      movies.length === 0
    ) {

      movieContainer.innerHTML =
        '<div class="empty-posts">' +
        "No movies yet." +
        "</div>";

      return;

    }


    var html =
      "";


    movies.forEach(
      function (post) {

        var title =
          post.title ||
          "Movie";


        var url =
          getPostVideoURL(
            post
          );


        html +=

          '<article class="movie-card">' +

            '<div class="poster poster-one">' +

              "<span>" +

                escapeHTML(
                  post.category ||
                  "MOVIE"
                ) +

              "</span>" +

            "</div>" +


            '<div class="movie-info">' +

              "<h3>" +

                escapeHTML(
                  title
                ) +

              "</h3>" +


              "<p>" +

                formatPostDate(
                  post.publishedAt
                ) +

              "</p>" +


              '<button ' +

                'type="button" ' +

                'class="watch-btn" ' +

                'data-url="' +

                  escapeAttribute(
                    url
                  ) +

                '" ' +

                'data-title="' +

                  escapeAttribute(
                    title
                  ) +

                '">' +

                "View" +

              "</button>" +

            "</div>" +

          "</article>";

      }
    );


    movieContainer.innerHTML =
      html;

  }


  /* =========================================================
     POST VIDEO URL
     
     Every future post can use any of these:
     
       embedUrl
       embedURL
       videoUrl
       videoURL
       url
     
     The first available value is used.
  ========================================================= */

  function getPostVideoURL(
    post
  ) {

    if (!post) {
      return "";
    }


    return (
      post.embedUrl ||
      post.embedURL ||
      post.videoUrl ||
      post.videoURL ||
      post.url ||
      ""
    );

  }


  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHTML(
    value
  ) {

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


  /* =========================================================
     ESCAPE ATTRIBUTE
  ========================================================= */

  function escapeAttribute(
    value
  ) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      );

  }


  /* =========================================================
     MOBILE MENU
  ========================================================= */

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
      function (event) {

        event.preventDefault();


        mainNav.classList.toggle(
          "open"
        );

      };

  }


  /* =========================================================
     COPYRIGHT YEAR
  ========================================================= */

  var year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =========================================================
     FINAL STATUS
  ========================================================= */

  console.log(
    "Deeprowss: Universal video handler ACTIVE."
  );


  console.log(
    "Deeprowss: Every Watch/View control with a video URL " +
    "opens its video in a separate page."
  );

});
