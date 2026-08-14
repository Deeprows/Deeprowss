```javascript
document.addEventListener("DOMContentLoaded", function () {

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");


  console.log("Deeprowss script loaded");


  /* =====================================
     LOAD POSTS
  ===================================== */

  var xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    "posts.json?v=" + new Date().getTime(),
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


        console.log(
          "Deeprowss posts loaded:",
          posts
        );


        /* Newest posts first */

        posts.sort(function (a, b) {

          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );

        });


        displayLivePosts(posts);

        displayHighlightPosts(posts);

        displayMoviePosts(posts);


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
     FORMAT VISITOR LOCAL TIME
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

      var statusClass =
        post.status === "LIVE"
          ? "live-badge"
          : "upcoming-badge";


      html +=

        '<article class="live-card">' +

          '<div class="match-top">' +

            '<span class="' +
              statusClass +
            '">' +

              (post.status || "UPCOMING") +

            '</span>' +

            '<span>' +
              (post.category || "Football") +
            '</span>' +

          '</div>' +


          '<div class="teams">' +

            '<strong>' +
              (post.home || "Team 1") +
            '</strong>' +

            '<span>vs</span>' +

            '<strong>' +
              (post.away || "Team 2") +
            '</strong>' +

          '</div>' +


          '<div class="match-meta">' +
            (post.description || "") +
          '</div>' +


          '<div class="post-date">' +
            formatPostDate(
              post.publishedAt
            ) +
          '</div>' +


          '<button ' +
            'class="watch-btn" ' +
            'data-url="' +
              escapeAttribute(post.embedUrl || "") +
            '" ' +
            'data-title="' +
              escapeAttribute(post.title || "Video") +
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

      html +=

        '<article class="media-card">' +

          '<div class="media-thumb football-thumb">' +

            '<span class="play">' +
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
                post.description || ""
              ) +
            '</p>' +


            '<div class="post-date">' +
              formatPostDate(
                post.publishedAt
              ) +
            '</div>' +


            '<button ' +
              'data-url="' +
                escapeAttribute(post.embedUrl || "") +
              '" ' +
              'data-title="' +
                escapeAttribute(
                  post.title || "Highlight"
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

      html +=

        '<article class="movie-card">' +

          '<div class="poster poster-one">' +

            '<span>' +
              escapeHTML(
                post.category || "MOVIE"
              ) +
            '</span>' +

          '</div>' +


          '<div class="movie-info">' +

            '<h3>' +
              escapeHTML(
                post.title || "Movie"
              ) +
            '</h3>' +


            '<p>' +
              formatPostDate(
                post.publishedAt
              ) +
            '</p>' +


            '<button ' +
              'data-url="' +
                escapeAttribute(post.embedUrl || "") +
              '" ' +
              'data-title="' +
                escapeAttribute(
                  post.title || "Movie"
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
     ESCAPE HTML
  ===================================== */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }



  /* =====================================
     ESCAPE ATTRIBUTE
  ===================================== */

  function escapeAttribute(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

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
     OPEN VIDEO ON SEPARATE PAGE
  ===================================== */

  window.openEmbed =
    function (title, url) {

      /*
       * No video URL
       */

      if (!url) {

        alert(
          "Video not available yet."
        );

        return;

      }


      /*
       * Open a new browser tab/page
       */

      var videoWindow =
        window.open(
          "",
          "_blank"
        );


      /*
       * Browser blocked popup
       */

      if (!videoWindow) {

        alert(
          "Please allow pop-ups for Deeprowss."
        );

        return;

      }


      /*
       * Safely prepare title
       */

      var safeTitle =
        escapeHTML(
          title || "Deeprowss Video"
        );


      /*
       * Safely prepare URL
       */

      var safeURL =
        escapeAttribute(url);


      /*
       * Build separate video page
       */

      videoWindow.document.open();


      videoWindow.document.write(

        '<!DOCTYPE html>' +

        '<html lang="en">' +

        '<head>' +

          '<meta charset="UTF-8">' +

          '<meta name="viewport" ' +
            'content="width=device-width, ' +
            'initial-scale=1.0">' +

          '<title>' +
            safeTitle +
            ' — Deeprowss' +
          '</title>' +


          '<style>' +

            '* {' +

              'box-sizing:border-box;' +

            '}' +


            'html,' +
            'body {' +

              'margin:0;' +

              'padding:0;' +

              'width:100%;' +

              'height:100%;' +

              'background:#000;' +

              'overflow:hidden;' +

              'font-family:Arial,sans-serif;' +

            '}' +


            '.video-page {' +

              'width:100%;' +

              'height:100%;' +

              'display:flex;' +

              'flex-direction:column;' +

              'background:#000;' +

            '}' +


            '.video-header {' +

              'height:50px;' +

              'min-height:50px;' +

              'display:flex;' +

              'align-items:center;' +

              'gap:8px;' +

              'padding:0 10px;' +

              'background:#08090d;' +

              'color:#fff;' +

            '}' +


            '.back-button {' +

              'border:0;' +

              'background:transparent;' +

              'color:#fff;' +

              'font-size:14px;' +

              'padding:8px 10px;' +

              'cursor:pointer;' +

            '}' +


            '.video-title {' +

              'font-size:14px;' +

              'font-weight:700;' +

              'white-space:nowrap;' +

              'overflow:hidden;' +

              'text-overflow:ellipsis;' +

            '}' +


            '.iframe-container {' +

              'width:100%;' +

              'height:calc(100% - 50px);' +

              'background:#000;' +

              'overflow:hidden;' +

            '}' +


            'iframe {' +

              'display:block;' +

              'width:100%;' +

              'height:100%;' +

              'border:0;' +

              'margin:0;' +

              'padding:0;' +

            '}' +


            '@media (max-width:600px) {' +

              '.video-header {' +

                'height:44px;' +

                'min-height:44px;' +

                'padding:0 5px;' +

              '}' +

              '.iframe-container {' +

                'height:calc(100% - 44px);' +

              '}' +

              '.video-title {' +

                'font-size:13px;' +

              '}' +

            '}' +

          '</style>' +

        '</head>' +


        '<body>' +

          '<div class="video-page">' +

            '<div class="video-header">' +

              '<button ' +
                'class="back-button" ' +
                'onclick="history.back()">' +

                '← Back' +

              '</button>' +

              '<div class="video-title">' +
                safeTitle +
              '</div>' +

            '</div>' +


            '<div class="iframe-container">' +

              '<iframe ' +

                'src="' +
                  safeURL +
                '" ' +

                'allowfullscreen ' +

                'allow="' +
                  'autoplay; fullscreen; ' +
                  'encrypted-media; ' +
                  'picture-in-picture"' +

                'loading="eager" ' +

                'frameborder="0" ' +

                'scrolling="no" ' +

                'title="' +
                  safeTitle +
                '">' +

              '</iframe>' +

            '</div>' +

          '</div>' +

        '</body>' +

        '</html>'

      );


      videoWindow.document.close();


      /*
       * Focus new page
       */

      try {

        videoWindow.focus();

      } catch (error) {

        console.log(
          "Could not focus video page."
        );

      }

    };



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


        menuToggle.setAttribute(
          "aria-expanded",
          mainNav.classList.contains(
            "open"
          )
        );

      };

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
```
