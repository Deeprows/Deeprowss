document.addEventListener("DOMContentLoaded", function () {

  "use strict";


  /* =========================================================
     DEEPROWSS GLOBAL VIDEO SYSTEM
     
     IMPORTANT:
     This handler is delegated to DOCUMENT.
     
     Therefore ANY future element such as:
     
       <button data-url="...">Watch</button>
     
     or:
     
       <a href="#" data-url="...">Watch</a>
     
     will work automatically, even if the element is created
     later by another script.
  ========================================================= */


  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");


  console.log(
    "Deeprowss script loaded successfully."
  );



  /* =========================================================
     UNIVERSAL VIDEO CLICK HANDLER
  ========================================================= */

  if (!window.deeprowssGlobalVideoHandler) {

    window.deeprowssGlobalVideoHandler = true;


    document.addEventListener(
      "click",
      function (event) {

        /*
         * Find a video button even if the user clicks
         * a span, icon, text, etc. inside the button.
         */

        var button =
          event.target.closest(
            "[data-url], [data-embed-url], [data-video-url]"
          );


        /*
         * Nothing to do if this click was not on a
         * video element.
         */

        if (!button) {
          return;
        }


        /*
         * Ignore the fullscreen button.
         */

        if (
          button.classList.contains(
            "fullscreen-btn"
          )
        ) {
          return;
        }


        /*
         * Stop parent links/forms/scripts from hijacking
         * the click.
         */

        event.preventDefault();

        event.stopPropagation();


        /*
         * Support all three possible attribute names.
         */

        var url =
          button.getAttribute(
            "data-url"
          ) ||
          button.getAttribute(
            "data-embed-url"
          ) ||
          button.getAttribute(
            "data-video-url"
          );


        /*
         * Get title.
         */

        var title =
          button.getAttribute(
            "data-title"
          ) ||
          button.getAttribute(
            "data-video-title"
          ) ||
          button.textContent.trim() ||
          "Deeprowss Video";


        /*
         * Clean title.
         */

        title =
          title.trim();


        /*
         * No URL means the post has no video.
         */

        if (!url) {

          console.error(
            "Deeprowss: Watch button has no video URL.",
            button
          );

          return;

        }


        /*
         * Clean URL.
         */

        url =
          url.trim();


        console.log(
          "Deeprowss: Opening video:",
          url
        );


        /*
         * Open video.
         */

        openVideoPage(
          title,
          url
        );

      },
      true
    );

  }



  /* =========================================================
     OPEN VIDEO PAGE
     
     Opens the video in a completely separate page.
     
     This is intentionally NOT dependent on:
     
       #embedModal
       #embedArea
       .modal-box
     
     Therefore section pages don't need the modal HTML.
  ========================================================= */

  function openVideoPage(
    title,
    url
  ) {

    /*
     * Try opening immediately while the browser still considers
     * this to be a direct user click.
     */

    var videoPage =
      window.open(
        "",
        "_blank"
      );


    /*
     * Browser blocked popup.
     */

    if (!videoPage) {

      console.error(
        "Deeprowss: Browser blocked the video window."
      );


      /*
       * Fallback:
       * navigate current page only if opening a new page
       * was blocked.
       */

      return;

    }


    /*
     * Prevent the new page from retaining an old document.
     */

    videoPage.document.open();


    /*
     * Safely escape values before inserting them into HTML.
     */

    var safeTitle =
      escapeHTML(
        title || "Deeprowss Video"
      );


    var safeURL =
      escapeAttribute(
        url
      );


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

          "html, body {" +
            "margin: 0;" +
            "padding: 0;" +
            "width: 100%;" +
            "height: 100%;" +
            "background: #000;" +
            "overflow: hidden;" +
          "}" +

          "body {" +
            "display: flex;" +
            "align-items: center;" +
            "justify-content: center;" +
          "}" +

          "iframe {" +
            "display: block;" +
            "width: 100%;" +
            "height: 100%;" +
            "border: 0;" +
            "margin: 0;" +
            "padding: 0;" +
            "background: #000;" +
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
     * Focus the new video page.
     */

    try {

      videoPage.focus();

    } catch (error) {

      console.log(
        "Could not focus video window:",
        error
      );

    }

  }



  /* =========================================================
     HTML ESCAPE
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


          /*
           * Make sure posts is actually an array.
           */

          if (
            !Array.isArray(posts)
          ) {

            throw new Error(
              "posts.json must contain an array of posts."
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


          /*
           * Render all sections.
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
        "Network error loading posts.json."
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


    var html = "";


    livePosts.forEach(
      function (post) {

        var status =
          post.status ||
          "UPCOMING";


        var statusClass =
          String(status)
            .toUpperCase() === "LIVE"
            ? "live-badge"
            : "upcoming-badge";


        var title =
          post.title ||
          "Video";


        var url =
          post.embedUrl ||
          post.embedURL ||
          post.url ||
          "";


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


    var html = "";


    highlights.forEach(
      function (post) {

        var title =
          post.title ||
          "Football Highlight";


        var url =
          post.embedUrl ||
          post.embedURL ||
          post.url ||
          "";


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


    var html = "";


    movies.forEach(
      function (post) {

        var title =
          post.title ||
          "Movie";


        var url =
          post.embedUrl ||
          post.embedURL ||
          post.url ||
          "";


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
     OPTIONAL MODAL SYSTEM
     
     Kept for compatibility with existing HTML.
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


      /*
       * If the modal doesn't exist, use the universal
       * video page instead.
       */

      if (
        !modal ||
        !embedArea
      ) {

        openVideoPage(
          title ||
          "Video",
          url
        );

        return;

      }


      if (modalTitle) {

        modalTitle.textContent =
          title ||
          "Video";

      }


      embedArea.innerHTML =
        "";


      var oldControls =
        modal.querySelector(
          ".video-controls"
        );


      if (oldControls) {
        oldControls.remove();
      }


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
        title ||
        "Video"
      );


      embedArea.appendChild(
        iframe
      );


      /*
       * Fullscreen controls.
       */

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



  /* =========================================================
     FULLSCREEN
  ========================================================= */

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

      event.stopPropagation();


      var modalBox =
        document.querySelector(
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


          /*
           * Attempt landscape orientation.
           */

          if (
            screen.orientation &&
            screen.orientation.lock
          ) {

            try {

              await screen.orientation.lock(
                "landscape"
              );

            } catch (
              orientationError
            ) {

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



  /* =========================================================
     FULLSCREEN CHANGE
  ========================================================= */

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
              "Orientation unlock unavailable:",
              error
            );

          }

        }

      }

    }
  );



  /* =========================================================
     CLOSE VIDEO MODAL
  ========================================================= */

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
       * Remove iframe.
       */

      if (embedArea) {

        embedArea.innerHTML =
          "";

      }


      /*
       * Remove controls.
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



  /* =========================================================
     MODAL BACKDROP
  ========================================================= */

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
          (
            event.target.classList &&
            event.target.classList.contains(
              "modal-backdrop"
            )
          )
        ) {

          closeEmbed();

        }

      }
    );

  }



  /* =========================================================
     ESC KEY
  ========================================================= */

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
     DEBUG INFORMATION
     
     This helps identify section-page problems.
  ========================================================= */

  console.log(
    "Deeprowss universal video handler is ACTIVE."
  );


  console.log(
    "Any element using [data-url], [data-embed-url], " +
    "or [data-video-url] can now open a video."
  );

});
