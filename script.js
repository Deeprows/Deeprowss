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
              (post.embedUrl || "") +
            '" ' +
            'data-title="' +
              (post.title || "Video") +
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
              (post.title ||
               "Football Highlight") +
            '</h3>' +


            '<p>' +
              (post.description || "") +
            '</p>' +


            '<div class="post-date">' +
              formatPostDate(
                post.publishedAt
              ) +
            '</div>' +


            '<button ' +
              'data-url="' +
                (post.embedUrl || "") +
              '" ' +
              'data-title="' +
                (post.title || "Highlight") +
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
              (post.category || "MOVIE") +
            '</span>' +

          '</div>' +


          '<div class="movie-info">' +

            '<h3>' +
              (post.title || "Movie") +
            '</h3>' +


            '<p>' +
              formatPostDate(
                post.publishedAt
              ) +
            '</p>' +


            '<button ' +
              'data-url="' +
                (post.embedUrl || "") +
              '" ' +
              'data-title="' +
                (post.title || "Movie") +
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
     VIDEO BUTTONS
     OPEN VIDEO ON SEPARATE PAGE
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


          if (!url) {

            console.error(
              "No embed URL found for this post."
            );

            return;

          }


          /*
           * Open a new browser tab.
           */

          var videoPage =
            window.open(
              "",
              "_blank"
            );


          if (!videoPage) {

            alert(
              "Please allow pop-ups for this site to watch the video."
            );

            return;

          }


          /*
           * Build the separate video page.
           */

          videoPage.document.open();


          videoPage.document.write(
            '<!DOCTYPE html>' +

            '<html lang="en">' +

            '<head>' +

              '<meta charset="UTF-8">' +

              '<meta name="viewport" ' +
                'content="width=device-width, initial-scale=1.0">' +

              '<title>' +
                escapeHtml(
                  title || "Deeprowss Video"
                ) +
              '</title>' +

              '<style>' +

                'html, body {' +
                  'margin: 0;' +
                  'padding: 0;' +
                  'width: 100%;' +
                  'height: 100%;' +
                  'background: #000;' +
                  'overflow: hidden;' +
                '}' +

                'iframe {' +
                  'display: block;' +
                  'width: 100%;' +
                  'height: 100%;' +
                  'border: 0;' +
                  'margin: 0;' +
                  'padding: 0;' +
                '}' +

              '</style>' +

            '</head>' +

            '<body>' +

              '<iframe ' +

                'src="' +
                  escapeAttribute(url) +
                '" ' +

                'allowfullscreen ' +

                'allow="autoplay; fullscreen; encrypted-media" ' +

                'frameborder="0" ' +

                'scrolling="no" ' +

                'title="' +
                  escapeAttribute(
                    title || "Deeprowss Video"
                  ) +
                '">' +

              '</iframe>' +

            '</body>' +

            '</html>'
          );


          videoPage.document.close();

        };

    }

  }



  /* =====================================
     ESCAPE HTML
  ===================================== */

  function escapeHtml(value) {

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }



  /* =====================================
     ESCAPE URL / ATTRIBUTE
  ===================================== */

  function escapeAttribute(value) {

    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

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

    menuToggle.onclick =
      function () {

        mainNav.classList.toggle(
          "open"
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
