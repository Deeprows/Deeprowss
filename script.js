document.addEventListener("DOMContentLoaded", function () {

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");


  console.log("Deeprowss script loaded");


  /* =====================================
     VIDEO BUTTON HANDLER

     This works on:

       Front page
       Section pages
       View All pages
       Dynamically generated posts

     It does NOT depend on the buttons
     existing when this script first loads.
  ===================================== */

  document.addEventListener("click", function (event) {

    var button =
      event.target.closest(
        "[data-url]"
      );


    if (!button) {
      return;
    }


    /*
     * Only treat actual video buttons
     * as video controls.
     */

    var tagName =
      button.tagName
        ? button.tagName.toLowerCase()
        : "";


    var isVideoButton =
      tagName === "button" ||
      tagName === "a" ||
      button.classList.contains("watch-btn");


    if (!isVideoButton) {
      return;
    }


    event.preventDefault();


    var url =
      button.getAttribute("data-url") || "";


    var title =
      button.getAttribute("data-title") ||
      "Video";


    url =
      String(url).trim();


    title =
      String(title).trim();


    if (!url) {

      console.error(
        "Deeprowss: Watch button has no video URL.",
        button
      );

      return;

    }


    openEmbed(
      title,
      url
    );

  });



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



  /* =====================================
     FORMAT VISITOR LOCAL TIME
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

      return date.toLocaleString();

    } catch (error) {

      return date.toString();

    }

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
          String(status).toUpperCase() === "LIVE"
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

              escapeHTML(
                formatPostDate(
                  post.publishedAt
                )
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

                escapeHTML(
                  formatPostDate(
                    post.publishedAt
                  )
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

                escapeHTML(
                  formatPostDate(
                    post.publishedAt
                  )
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



  /* =====================================
     GET VIDEO URL
  ===================================== */

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



  /* =====================================
     VIDEO MODAL

     IMPORTANT:

     If the page already has #embedModal,
     use it.

     If the page does NOT have #embedModal,
     create it automatically.

     This is what allows section pages
     to use the same Watch buttons as
     the front page.
  ===================================== */

  window.openEmbed =
    function (
      title,
      url
    ) {

      title =
        title ||
        "Video";


      url =
        String(
          url || ""
        ).trim();


      if (!url) {

        console.error(
          "Deeprowss: No video URL supplied."
        );

        return;

      }


      var modal =
        document.getElementById(
          "embedModal"
        );


      /*
       * Section/View All pages may not
       * contain the modal HTML.
       */

      if (!modal) {

        createVideoModal();


        modal =
          document.getElementById(
            "embedModal"
          );

      }


      if (!modal) {

        console.error(
          "Deeprowss: Could not create video modal."
        );

        return;

      }


      var modalTitle =
        modal.querySelector(
          "#modalTitle"
        );


      var embedArea =
        modal.querySelector(
          "#embedArea"
        );


      if (!embedArea) {

        console.error(
          "Deeprowss: #embedArea is missing."
        );

        return;

      }


      /*
       * Set title.
       */

      if (modalTitle) {

        modalTitle.textContent =
          title;

      }


      /*
       * Remove old player.
       */

      embedArea.innerHTML =
        "";


      /*
       * Remove old fullscreen button.
       */

      var oldControls =
        modal.querySelector(
          ".video-controls"
        );


      if (oldControls) {

        oldControls.remove();

      }


      /*
       * Create iframe.
       */

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
        title
      );


      iframe.setAttribute(
        "referrerpolicy",
        "strict-origin-when-cross-origin"
      );


      /*
       * Load immediately after Watch
       * is clicked.
       */

      iframe.setAttribute(
        "loading",
        "eager"
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


      /*
       * Create fullscreen button.
       */

      createFullscreenControls(
        modal,
        embedArea
      );


      /*
       * Open modal.
       */

      modal.classList.add(
        "open"
      );


      modal.setAttribute(
        "aria-hidden",
        "false"
      );


      document.body.style.overflow =
        "hidden";


      /*
       * Focus close button if available.
       */

      var closeButton =
        modal.querySelector(
          ".modal-close"
        );


      if (closeButton) {

        try {

          closeButton.focus();

        } catch (error) {

          console.log(
            "Could not focus close button."
          );

        }

      }

    };



  /* =====================================
     CREATE VIDEO MODAL

     Used automatically when a section
     page does not already contain one.
  ===================================== */

  function createVideoModal() {

    /*
     * Do not create duplicate modals.
     */

    if (
      document.getElementById(
        "embedModal"
      )
    ) {

      return;

    }


    var modal =
      document.createElement(
        "div"
      );


    modal.id =
      "embedModal";


    modal.className =
      "deeprowss-auto-modal";


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    modal.innerHTML =

      '<div class="modal-backdrop"></div>' +

      '<div class="modal-box" role="dialog" aria-modal="true">' +

        '<div class="modal-header">' +

          '<h2 id="modalTitle">Video</h2>' +

          '<button ' +
            'type="button" ' +
            'class="modal-close" ' +
            'aria-label="Close video">' +
            "&times;" +
          "</button>" +

        "</div>" +

        '<div id="embedArea" class="embed-area"></div>' +

      "</div>";


    document.body.appendChild(
      modal
    );


    addVideoModalStyles();

  }



  /* =====================================
     MODAL STYLES

     Only added if the page had to create
     the video modal automatically.
  ===================================== */

  function addVideoModalStyles() {

    if (
      document.getElementById(
        "deeprowss-video-modal-styles"
      )
    ) {

      return;

    }


    var style =
      document.createElement(
        "style"
      );


    style.id =
      "deeprowss-video-modal-styles";


    style.textContent =

      ".deeprowss-auto-modal{" +
        "position:fixed;" +
        "inset:0;" +
        "z-index:999999;" +
        "display:none;" +
        "align-items:center;" +
        "justify-content:center;" +
      "}" +

      ".deeprowss-auto-modal.open{" +
        "display:flex;" +
      "}" +

      ".deeprowss-auto-modal .modal-backdrop{" +
        "position:absolute;" +
        "inset:0;" +
        "background:rgba(0,0,0,.92);" +
      "}" +

      ".deeprowss-auto-modal .modal-box{" +
        "position:relative;" +
        "z-index:2;" +
        "width:min(1100px,96vw);" +
        "height:min(760px,94vh);" +
        "background:#000;" +
        "border-radius:12px;" +
        "overflow:hidden;" +
        "display:flex;" +
        "flex-direction:column;" +
        "box-shadow:0 20px 80px rgba(0,0,0,.7);" +
      "}" +

      ".deeprowss-auto-modal .modal-header{" +
        "height:52px;" +
        "min-height:52px;" +
        "display:flex;" +
        "align-items:center;" +
        "justify-content:space-between;" +
        "padding:0 14px;" +
        "background:#111;" +
        "color:#fff;" +
      "}" +

      ".deeprowss-auto-modal #modalTitle{" +
        "margin:0;" +
        "font-size:16px;" +
        "font-weight:600;" +
        "white-space:nowrap;" +
        "overflow:hidden;" +
        "text-overflow:ellipsis;" +
      "}" +

      ".deeprowss-auto-modal .modal-close{" +
        "border:0;" +
        "background:transparent;" +
        "color:#fff;" +
        "font-size:30px;" +
        "line-height:1;" +
        "cursor:pointer;" +
        "padding:4px 8px;" +
      "}" +

      ".deeprowss-auto-modal .embed-area{" +
        "position:relative;" +
        "flex:1;" +
        "min-height:0;" +
        "background:#000;" +
      "}" +

      ".deeprowss-auto-modal .embed-area iframe{" +
        "display:block;" +
        "width:100%;" +
        "height:100%;" +
        "border:0;" +
        "background:#000;" +
      "}" +

      ".deeprowss-auto-modal .video-controls{" +
        "background:#111;" +
        "padding:10px;" +
        "text-align:center;" +
      "}" +

      ".deeprowss-auto-modal .fullscreen-btn{" +
        "border:0;" +
        "border-radius:8px;" +
        "background:#ff4567;" +
        "color:#fff;" +
        "font-size:15px;" +
        "font-weight:600;" +
        "padding:10px 18px;" +
        "cursor:pointer;" +
      "}" +

      "@media (max-width:600px){" +

        ".deeprowss-auto-modal .modal-box{" +
          "width:100vw;" +
          "height:100vh;" +
          "border-radius:0;" +
        "}" +

        ".deeprowss-auto-modal .modal-header{" +
          "height:48px;" +
          "min-height:48px;" +
        "}" +

      "}";


    document.head.appendChild(
      style
    );

  }



  /* =====================================
     FULLSCREEN BUTTON
  ===================================== */

  function createFullscreenControls(
    modal,
    embedArea
  ) {

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

  }



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


      event.preventDefault();


      var modalBox =
        button.closest(
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
                "Landscape orientation lock unavailable.",
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
     FULLSCREEN STATE
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
              "Orientation unlock unavailable.",
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


      /*
       * Exit fullscreen.
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
            "Could not unlock orientation:",
            error
          );

        }

      }


      /*
       * Remove video.
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


      /*
       * Restore scrolling.
       */

      document.body.style.overflow =
        "";

    };



  /* =====================================
     CLOSE BUTTON + BACKDROP

     Delegated so it also works with the
     automatically-created modal.
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

        closeEmbed();

        return;

      }


      var backdrop =
        event.target.closest(
          ".modal-backdrop"
        );


      if (backdrop) {

        event.preventDefault();

        closeEmbed();

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
      function (event) {

        event.preventDefault();


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


  console.log(
    "Deeprowss video buttons are active on this page."
  );

});
