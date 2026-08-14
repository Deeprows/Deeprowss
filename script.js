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

  var xhr =
    new XMLHttpRequest();


  xhr.open(
    "GET",
    "posts.json?v=" + new Date().getTime(),
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


          console.log(
            "Deeprowss posts loaded:",
            posts
          );


          /* ===============================
             NEWEST FIRST
          =============================== */

          posts.sort(function (a, b) {

            return (
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
            );

          });


          /* ===============================
             DISPLAY
          =============================== */

          displayLivePosts(posts);

          displayHighlightPosts(posts);

          displayMoviePosts(posts);


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
     GET VIDEO URL
  ===================================== */

  function getVideoURL(post) {

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



  /* =====================================
     GET THUMBNAIL URL
  ===================================== */

  function getThumbnailURL(post) {

    if (!post) {
      return "";
    }


    return (
      post.thumbnail ||
      post.thumbnailUrl ||
      post.thumbnailURL ||
      post.image ||
      post.imageUrl ||
      ""
    );

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

        return String(
          post.type || ""
        ).toLowerCase() === "live";

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

      var title =
        post.title ||
        "Football Live";


      var url =
        getVideoURL(post);


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

            escapeHTML(
              formatPostDate(
                post.publishedAt
              )
            ) +

          '</div>' +


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

            'Watch' +

          '</button>' +

        '</article>';

    });


    liveContainer.innerHTML =
      html;

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

        return String(
          post.type || ""
        ).toLowerCase() === "highlight";

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

      var title =
        post.title ||
        "Football Highlight";


      var url =
        getVideoURL(post);


      var thumbnail =
        getThumbnailURL(post);


      html +=

        '<article class="media-card">' +

          '<div class="media-thumb football-thumb">' +

            (
              thumbnail
                ? '<img ' +
                    'src="' +
                      escapeAttribute(
                        thumbnail
                      ) +
                    '" ' +
                    'alt="' +
                      escapeAttribute(
                        title
                      ) +
                    '" ' +
                    'loading="lazy" ' +
                    'referrerpolicy="no-referrer" ' +
                  '>'
                : ''
            ) +

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
                title
              ) +

            '</h3>' +


            '<p>' +

              escapeHTML(
                post.description ||
                ""
              ) +

            '</p>' +


            '<div class="post-date">' +

              escapeHTML(
                formatPostDate(
                  post.publishedAt
                )
              ) +

            '</div>' +


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

              'Watch highlight' +

            '</button>' +

          '</div>' +

        '</article>';

    });


    highlightContainer.innerHTML =
      html;

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

        return String(
          post.type || ""
        ).toLowerCase() === "movie";

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

      var title =
        post.title ||
        "Movie";


      var url =
        getVideoURL(post);


      var thumbnail =
        getThumbnailURL(post);


      html +=

        '<article class="movie-card">' +

          '<div class="poster poster-one">' +

            (
              thumbnail
                ? '<img ' +
                    'src="' +
                      escapeAttribute(
                        thumbnail
                      ) +
                    '" ' +
                    'alt="' +
                      escapeAttribute(
                        title
                      ) +
                    '" ' +
                    'loading="lazy" ' +
                    'referrerpolicy="no-referrer" ' +
                  '>'
                : ''
            ) +

            '<span>' +

              escapeHTML(
                post.category ||
                "MOVIE"
              ) +

            '</span>' +

          '</div>' +


          '<div class="movie-info">' +

            '<h3>' +

              escapeHTML(
                title
              ) +

            '</h3>' +


            '<p>' +

              escapeHTML(
                formatPostDate(
                  post.publishedAt
                )
              ) +

            '</p>' +


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

              'View' +

            '</button>' +

          '</div>' +

        '</article>';

    });


    movieContainer.innerHTML =
      html;

  }



  /* =====================================
     VIDEO BUTTONS
     EVENT DELEGATION
  ===================================== */

  if (
    !window.deeprowssVideoHandler
  ) {

    window.deeprowssVideoHandler =
      true;


    document.addEventListener(
      "click",
      function (event) {

        var button =
          event.target.closest(
            ".watch-btn"
          );


        if (!button) {
          return;
        }


        event.preventDefault();


        var url =
          button.getAttribute(
            "data-url"
          );


        var title =
          button.getAttribute(
            "data-title"
          );


        openEmbed(
          title,
          url
        );

      }
    );

  }



  /* =====================================
     CREATE MODAL IF NEEDED
  ===================================== */

  function ensureVideoModal() {

    var modal =
      document.getElementById(
        "embedModal"
      );


    if (modal) {
      return modal;
    }


    modal =
      document.createElement(
        "div"
      );


    modal.id =
      "embedModal";


    modal.className =
      "modal";


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    modal.innerHTML =

      '<div class="modal-backdrop"></div>' +

      '<div class="modal-box" role="dialog" aria-modal="true">' +

        '<button ' +

          'type="button" ' +

          'class="modal-close" ' +

          'aria-label="Close video">' +

          '&times;' +

        '</button>' +

        '<h2 id="modalTitle">Video</h2>' +

        '<div id="embedArea" class="embed-area"></div>' +

      '</div>';


    document.body.appendChild(
      modal
    );


    modal.addEventListener(
      "click",
      function (event) {

        if (
          event.target === modal ||
          event.target.classList.contains(
            "modal-backdrop"
          ) ||
          event.target.classList.contains(
            "modal-close"
          )
        ) {

          closeEmbed();

        }

      }
    );


    return modal;

  }



  /* =====================================
     OPEN VIDEO
  ===================================== */

  window.openEmbed =
    function (title, url) {

      if (!url) {

        console.error(
          "Deeprowss: Watch button has no video URL."
        );

        return;

      }


      var modal =
        ensureVideoModal();


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


      /* Remove previous player */

      embedArea.innerHTML =
        "";


      /* Remove previous fullscreen controls */

      var oldControls =
        modal.querySelector(
          ".video-controls"
        );


      if (oldControls) {
        oldControls.remove();
      }


      /* ===============================
         CREATE IFRAME
      =============================== */

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
        title || "Video"
      );


      iframe.setAttribute(
        "referrerpolicy",
        "strict-origin-when-cross-origin"
      );


      /*
       * The iframe is created only after
       * the user clicks Watch/View, so
       * lazy loading is not critical here.
       */

      iframe.setAttribute(
        "loading",
        "eager"
      );


      embedArea.appendChild(
        iframe
      );


      /* ===============================
         FULLSCREEN CONTROLS
      =============================== */

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


      /* ===============================
         OPEN MODAL
      =============================== */

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


          /*
           * Try landscape orientation.
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


      /* Exit fullscreen */

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


      /* Unlock orientation */

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


      /* Remove video */

      if (embedArea) {

        embedArea.innerHTML =
          "";

      }


      /* Remove controls */

      var controls =
        modal.querySelector(
          ".video-controls"
        );


      if (controls) {
        controls.remove();
      }


      /* Close modal */

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
  );



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
