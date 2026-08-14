document.addEventListener("DOMContentLoaded", function () {

  var container =
    document.getElementById("allPosts");


  if (!container) {
    return;
  }


  console.log("Deeprowss all-posts.js loaded");


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
            "Deeprowss all posts loaded:",
            posts
          );


          /* =================================
             NEWEST FIRST
          ================================= */

          posts.sort(
            function (a, b) {

              return (
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
              );

            }
          );


          /* =================================
             DETERMINE PAGE TYPE
          ================================= */

          var page =
            window.location.pathname.toLowerCase();


          var type =
            "live";


          if (
            page.indexOf("highlights") !== -1
          ) {

            type =
              "highlight";

          }


          if (
            page.indexOf("movies") !== -1
          ) {

            type =
              "movie";

          }


          /* =================================
             FILTER POSTS
          ================================= */

          var filteredPosts =
            posts.filter(
              function (post) {

                return (
                  String(
                    post.type || ""
                  ).toLowerCase() === type
                );

              }
            );


          /* =================================
             EMPTY STATE
          ================================= */

          if (
            filteredPosts.length === 0
          ) {

            container.innerHTML =
              '<div class="empty-posts">' +
                "No posts available yet." +
              "</div>";

            return;

          }


          /* =================================
             RENDER
          ================================= */

          if (type === "live") {

            displayLivePosts(
              filteredPosts
            );

          }


          if (type === "highlight") {

            displayHighlightPosts(
              filteredPosts
            );

          }


          if (type === "movie") {

            displayMoviePosts(
              filteredPosts
            );

          }


          attachVideoButtons();

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

    container.innerHTML =
      '<div class="empty-posts">' +
        "Unable to load posts." +
      "</div>";

  }



  /* =====================================
     DATE
  ===================================== */

  function formatPostDate(
    dateString
  ) {

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
     VIDEO URL
  ===================================== */

  function getVideoURL(
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
     LIVE FOOTBALL
  ===================================== */

  function displayLivePosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(
      function (post) {

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

              formatPostDate(
                post.publishedAt
              ) +

            '</div>' +


            '<button ' +
              'type="button" ' +
              'class="watch-btn" ' +
              'data-url="' +
                escapeAttribute(url) +
              '" ' +
              'data-title="' +
                escapeAttribute(title) +
              '">' +

              "Watch" +

            '</button>' +

          '</article>';

      }
    );


    container.innerHTML =
      html;

  }



  /* =====================================
     HIGHLIGHTS
  ===================================== */

  function displayHighlightPosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(
      function (post) {

        var title =
          post.title ||
          "Football Highlight";


        var url =
          getVideoURL(post);


        html +=

          '<article class="media-card">' +

            '<div class="media-thumb football-thumb">' +

              '<span class="play">' +
                "▶" +
              '</span>' +

            '</div>' +


            '<div class="media-info">' +

              '<span class="tag">' +
                "HIGHLIGHT" +
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

                formatPostDate(
                  post.publishedAt
                ) +

              '</div>' +


              '<button ' +
                'type="button" ' +
                'class="watch-btn" ' +
                'data-url="' +
                  escapeAttribute(url) +
                '" ' +
                'data-title="' +
                  escapeAttribute(title) +
                '">' +

                "Watch highlight" +

              '</button>' +

            '</div>' +

          '</article>';

      }
    );


    container.innerHTML =
      html;

  }



  /* =====================================
     MOVIES
  ===================================== */

  function displayMoviePosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(
      function (post) {

        var title =
          post.title ||
          "Movie";


        var url =
          getVideoURL(post);


        html +=

          '<article class="movie-card">' +

            '<div class="poster poster-one">' +

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

                formatPostDate(
                  post.publishedAt
                ) +

              '</p>' +


              '<button ' +
                'type="button" ' +
                'class="watch-btn" ' +
                'data-url="' +
                  escapeAttribute(url) +
                '" ' +
                'data-title="' +
                  escapeAttribute(title) +
                '">' +

                "View" +

              '</button>' +

            '</div>' +

          '</article>';

      }
    );


    container.innerHTML =
      html;

  }



  /* =====================================
     VIDEO BUTTONS
     EVENT DELEGATION
  ===================================== */

  function attachVideoButtons() {

    if (
      window.deeprowssAllPostsHandler
    ) {

      return;

    }


    window.deeprowssAllPostsHandler =
      true;


    document.addEventListener(
      "click",
      function (event) {

        var button =
          event.target.closest(
            ".watch-btn[data-url]"
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


        if (!url) {

          console.error(
            "Deeprowss: Watch button has no video URL."
          );

          return;

        }


        openSectionVideo(
          title,
          url
        );

      }
    );

  }



  /* =====================================
     OPEN VIDEO
  ===================================== */

  function openSectionVideo(
    title,
    url
  ) {

    if (!url) {
      return;
    }


    var modal =
      document.getElementById(
        "embedModal"
      );


    if (!modal) {

      createSectionVideoModal();


      modal =
        document.getElementById(
          "embedModal"
        );

    }


    if (!modal) {
      return;
    }


    var modalTitle =
      document.getElementById(
        "modalTitle"
      );


    var embedArea =
      document.getElementById(
        "embedArea"
      );


    if (!embedArea) {
      return;
    }


    if (modalTitle) {

      modalTitle.textContent =
        title ||
        "Video";

    }


    embedArea.innerHTML =
      "";


    removeFullscreenControls(
      modal
    );


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


    iframe.setAttribute(
      "loading",
      "eager"
    );


    embedArea.appendChild(
      iframe
    );


    createFullscreenControls(
      modal
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

  }



  /* =====================================
     CREATE MODAL
  ===================================== */

  function createSectionVideoModal() {

    var modal =
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

        '<h2 id="modalTitle">Video</h2>' +

        '<button ' +
          'type="button" ' +
          'class="modal-close" ' +
          'aria-label="Close video">' +
          '&times;' +
        '</button>' +

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

          closeSectionVideo();

        }

      }
    );

  }



  /* =====================================
     FULLSCREEN BUTTON
  ===================================== */

  function createFullscreenControls(
    modal
  ) {

    removeFullscreenControls(
      modal
    );


    var embedArea =
      modal.querySelector(
        "#embedArea"
      );


    if (!embedArea) {
      return;
    }


    var controls =
      document.createElement(
        "div"
      );


    controls.className =
      "video-controls";


    var button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "fullscreen-btn";


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


    controls.appendChild(
      button
    );


    embedArea.insertAdjacentElement(
      "afterend",
      controls
    );

  }



  /* =====================================
     REMOVE FULLSCREEN CONTROLS
  ===================================== */

  function removeFullscreenControls(
    modal
  ) {

    if (!modal) {
      return;
    }


    var controls =
      modal.querySelector(
        ".video-controls"
      );


    if (controls) {
      controls.remove();
    }

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


      var modalBox =
        document.querySelector(
          "#embedModal .modal-box"
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
          "Deeprowss fullscreen error:",
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



  /* =====================================
     CLOSE VIDEO
  ===================================== */

  async function closeSectionVideo() {

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


    removeFullscreenControls(
      modal
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

  }



  /* =====================================
     ESC
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

        closeSectionVideo();

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


        menuToggle.setAttribute(
          "aria-expanded",
          mainNav.classList.contains("open")
            ? "true"
            : "false"
        );

      };

  }



  /* =====================================
     ESCAPE HTML
  ===================================== */

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



  /* =====================================
     ESCAPE ATTRIBUTE
  ===================================== */

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

});
