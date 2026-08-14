document.addEventListener("DOMContentLoaded", function () {

  var liveContainer = document.getElementById("livePosts");
  var highlightContainer = document.getElementById("highlightPosts");
  var movieContainer = document.getElementById("moviePosts");

  console.log("Deeprowss script loaded");


  /*
   * LOAD POSTS
   */

  fetch("posts.json?v=" + new Date().getTime())

    .then(function (response) {

      if (!response.ok) {
        throw new Error("Could not load posts.json");
      }

      return response.json();

    })

    .then(function (posts) {

      console.log("Posts loaded:", posts);


      /*
       * NEWEST POSTS FIRST
       */

      posts.sort(function (a, b) {

        return new Date(b.publishedAt) -
               new Date(a.publishedAt);

      });


      displayLivePosts(posts);

      displayHighlightPosts(posts);

      displayMoviePosts(posts);

    })

    .catch(function (error) {

      console.error(
        "Deeprowss error:",
        error
      );


      if (liveContainer) {

        liveContainer.innerHTML =
          '<div class="empty-posts">Unable to load football posts.</div>';

      }


      if (highlightContainer) {

        highlightContainer.innerHTML =
          '<div class="empty-posts">Unable to load highlights.</div>';

      }


      if (movieContainer) {

        movieContainer.innerHTML =
          '<div class="empty-posts">Unable to load movies.</div>';

      }

    });



  /*
   * FORMAT VISITOR LOCAL TIME
   */

  function formatPostDate(dateString) {

    if (!dateString) {
      return "";
    }

    var date = new Date(dateString);

    if (isNaN(date.getTime())) {
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



  /*
   * FOOTBALL LIVE
   */

  function displayLivePosts(posts) {

    if (!liveContainer) {
      return;
    }


    var livePosts = posts.filter(function (post) {

      return post.type === "live";

    });


    if (livePosts.length === 0) {

      liveContainer.innerHTML =
        '<div class="empty-posts">No football posts yet.</div>';

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

            formatPostDate(post.publishedAt) +

          '</div>' +


          '<button class="watch-btn" ' +

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


    liveContainer.innerHTML = html;


    attachVideoButtons();

  }



  /*
   * HIGHLIGHTS
   */

  function displayHighlightPosts(posts) {

    if (!highlightContainer) {
      return;
    }


    var highlights = posts.filter(function (post) {

      return post.type === "highlight";

    });


    if (highlights.length === 0) {

      highlightContainer.innerHTML =
        '<div class="empty-posts">No highlights yet.</div>';

      return;

    }


    var html = "";


    highlights.forEach(function (post) {

      html +=

        '<article class="media-card">' +

          '<div class="media-thumb football-thumb">' +

            '<span class="play">▶</span>' +

          '</div>' +


          '<div class="media-info">' +

            '<span class="tag">HIGHLIGHT</span>' +

            '<h3>' +
              (post.title || "Football Highlight") +
            '</h3>' +

            '<p>' +
              (post.description || "") +
            '</p>' +

            '<div class="post-date">' +
              formatPostDate(post.publishedAt) +
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


    highlightContainer.innerHTML = html;


    attachVideoButtons();

  }



  /*
   * MOVIES
   */

  function displayMoviePosts(posts) {

    if (!movieContainer) {
      return;
    }


    var movies = posts.filter(function (post) {

      return post.type === "movie";

    });


    if (movies.length === 0) {

      movieContainer.innerHTML =
        '<div class="empty-posts">No movies yet.</div>';

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
              formatPostDate(post.publishedAt) +
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


    movieContainer.innerHTML = html;


    attachVideoButtons();

  }



  /*
   * VIDEO BUTTONS
   */

  function attachVideoButtons() {

    var buttons =
      document.querySelectorAll("[data-url]");


    for (
      var i = 0;
      i < buttons.length;
      i++
    ) {

      buttons[i].onclick = function () {

        var url =
          this.getAttribute("data-url");

        var title =
          this.getAttribute("data-title");


        openEmbed(title, url);

      };

    }

  }



  /*
   * OPEN VIDEO
   */

  window.openEmbed = function (title, url) {

    var modal =
      document.getElementById("embedModal");

    var modalTitle =
      document.getElementById("modalTitle");

    var embedArea =
      document.getElementById("embedArea");


    if (!modal) {
      return;
    }


    modalTitle.textContent =
      title || "Video";


    if (url) {

      embedArea.innerHTML =

        '<iframe ' +

          'src="' +
            url +
          '" ' +

          'allowfullscreen ' +

          'loading="lazy">' +

        '</iframe>';

    } else {

      embedArea.innerHTML =

        '<div class="embed-placeholder">' +

          '<strong>' +
            'Video not available yet' +
          '</strong>' +

          '<p>' +
            'Add an authorized external embed URL to this post.' +
          '</p>' +

        '</div>';

    }


    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

  };



  /*
   * CLOSE VIDEO
   */

  window.closeEmbed = function () {

    var modal =
      document.getElementById("embedModal");

    var embedArea =
      document.getElementById("embedArea");


    if (!modal) {
      return;
    }


    modal.classList.remove("open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    if (embedArea) {

      embedArea.innerHTML = "";

    }

  };



  /*
   * MOBILE MENU
   */

  var menuToggle =
    document.getElementById("menuToggle");

  var mainNav =
    document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.onclick = function () {

      mainNav.classList.toggle("open");

    };

  }



  /*
   * COPYRIGHT YEAR
   */

  var year =
    document.getElementById("year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
