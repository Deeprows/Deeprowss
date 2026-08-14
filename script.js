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
     ESCAPE HTML
  ===================================== */

  function escapeHtml(value) {

    if (value === null || value === undefined) {
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

              escapeHtml(
                post.status || "UPCOMING"
              ) +

            '</span>' +

            '<span>' +
              escapeHtml(
                post.category || "Football"
              ) +
            '</span>' +

          '</div>' +


          '<div class="teams">' +

            '<strong>' +
              escapeHtml(
                post.home || "Team 1"
              ) +
            '</strong>' +

            '<span>vs</span>' +

            '<strong>' +
              escapeHtml(
                post.away || "Team 2"
              ) +
            '</strong>' +

          '</div>' +


          '<div class="match-meta">' +
            escapeHtml(
              post.description || ""
            ) +
          '</div>' +


          '<div class="post-date">' +
            formatPostDate(
              post.publishedAt
            ) +
          '</div>' +


          '<button ' +
            'class="watch-btn" ' +
            'data-url="' +
              escapeHtml(
                post.embedUrl || ""
              ) +
            '" ' +
            'data-title="' +
              escapeHtml(
                post.title || "Video"
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
        post.thumbnail || "";


      var thumbnailHtml = "";


      if (thumbnail) {

        thumbnailHtml =
          '<img ' +
            'class="media-image" ' +
            'src="' +
              escapeHtml(thumbnail) +
            '" ' +
            'alt="' +
              escapeHtml(
                post.title || "Football Highlight"
              ) +
            '" ' +
            'loading="lazy" ' +
            'onerror="this.parentElement.classList.add(\'image-failed\'); this.remove();">' +

          '<span class="play">' +
            '▶' +
          '</span>';

      } else {

        thumbnailHtml =
          '<div class="media-placeholder football-thumb">' +

            '<span class="play">' +
              '▶' +
            '</span>' +

          '</div>';

      }


      html +=

        '<article class="media-card">' +

          '<div class="media-thumb">' +

            thumbnailHtml +

          '</div>' +


          '<div class="media-info">' +

            '<span class="tag">' +
              'HIGHLIGHT' +
            '</span>' +


            '<h3>' +
              escapeHtml(
                post.title ||
                "Football Highlight"
              ) +
            '</h3>' +


            '<p>' +
              escapeHtml(
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
                escapeHtml(
                  post.embedUrl || ""
                ) +
              '" ' +
              'data-title="' +
                escapeHtml(
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

      var thumbnail =
        post.thumbnail || "";


      var thumbnailHtml = "";


      if (thumbnail) {

        thumbnailHtml =
          '<img ' +
            'class="movie-thumbnail" ' +
            'src="' +
              escapeHtml(thumbnail) +
            '" ' +
            'alt="' +
              escapeHtml(
                post.title || "Movie"
              ) +
            '" ' +
            'loading="lazy" ' +
            'onerror="this.parentElement.classList.add(\'image-failed\'); this.remove();">';

      } else {

        thumbnailHtml =
          '<div class="movie-placeholder">' +

            '<span>' +
              escapeHtml(
                post.category || "MOVIE"
              ) +
            '</span>' +

          '</div>';

      }


      html +=

        '<article class="movie-card">' +

          '<div class="movie-poster">' +

            thumbnailHtml +

          '</div>' +


          '<div class="movie-info">' +

            '<span class="tag">' +
              escapeHtml(
                post.category || "MOVIE"
              ) +
            '</span>' +


            '<h3>' +
              escapeHtml(
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
                escapeHtml(
                  post.embedUrl || ""
                ) +
              '" ' +
              'data-title="' +
                escapeHtml(
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
          title || "Video";

      }


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
          "autoplay; fullscreen; encrypted-media"
        );


        iframe.setAttribute(
          "loading",
          "lazy"
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


        embedArea.appendChild(
          iframe
        );

      }


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

          } else {

            console.log(
              "Fullscreen API is not supported."
            );

            return;

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


      if (document.fullscreenElement) {

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


      if (
        screen.orientation &&
        screen.orientation.unlock
      ) {

        try {

          screen.orientation.unlock();

        } catch (error) {

          console.log(
            "Could not unlock orientation:",
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
     CLOSE MODAL WITH BACKDROP
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

          closeEmbed();

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
