```javascript
document.addEventListener("DOMContentLoaded", function () {

  var container =
    document.getElementById("allPosts");


  if (!container) {
    return;
  }


  /*
   * LOAD POSTS
   */

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


          /*
           * Newest first
           */

          posts.sort(function (a, b) {

            return (
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
            );

          });


          /*
           * Determine section
           */

          var page =
            window.location.pathname.toLowerCase();


          var type =
            "live";


          if (page.indexOf("highlights") !== -1) {
            type = "highlight";
          }


          if (page.indexOf("movies") !== -1) {
            type = "movie";
          }


          /*
           * Filter posts
           */

          var filteredPosts =
            posts.filter(function (post) {

              return (
                String(post.type || "").toLowerCase() ===
                type
              );

            });


          if (filteredPosts.length === 0) {

            container.innerHTML =
              '<div class="empty-posts">' +
              "No posts available yet." +
              "</div>";

            return;

          }


          /*
           * Render correct section
           */

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


          /*
           * Make the buttons clickable
           */

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



  /*
   * ERROR
   */

  function showError() {

    container.innerHTML =
      '<div class="empty-posts">' +
      "Unable to load posts." +
      "</div>";

  }



  /*
   * DATE
   */

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
   * GET VIDEO URL
   */

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



  /*
   * FOOTBALL
   */

  function displayLivePosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(function (post) {

      var title =
        post.title ||
        "Football Live";


      var url =
        getVideoURL(post);


      var statusClass =
        String(post.status || "").toUpperCase() === "LIVE"
          ? "live-badge"
          : "upcoming-badge";


      html +=

        '<article class="live-card">' +

          '<div class="match-top">' +

            '<span class="' +
              statusClass +
            '">' +

              escapeHTML(
                post.status ||
                "UPCOMING"
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

          '</button>' +

        '</article>';

    });


    container.innerHTML =
      html;

  }



  /*
   * HIGHLIGHTS
   */

  function displayHighlightPosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(function (post) {

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

            '</button>' +

          '</div>' +

        '</article>';

    });


    container.innerHTML =
      html;

  }



  /*
   * MOVIES
   */

  function displayMoviePosts(
    posts
  ) {

    var html =
      "";


    posts.forEach(function (post) {

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

            '</button>' +

          '</div>' +

        '</article>';

    });


    container.innerHTML =
      html;

  }



  /*
   * VIDEO BUTTONS
   *
   * Event delegation means buttons continue
   * working even if posts are re-rendered.
   */

  function attachVideoButtons() {

    if (
      window.deeprowssSectionVideoHandler
    ) {
      return;
    }


    window.deeprowssSectionVideoHandler =
      true;


    document.addEventListener(
      "click",
      function (event) {

        var button =
          event.target.closest(
            "[data-url]"
          );


        if (!button) {
          return;
        }


        if (
          !button.classList.contains(
            "watch-btn"
          )
        ) {
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


        openSectionVideo(
          title,
          url
        );

      }
    );

  }



  /*
   * VIDEO MODAL
   *
   * Creates the modal automatically.
   * No modal HTML is required in football.html.
   */

  function openSectionVideo(
    title,
    url
  ) {

    if (!url) {

      console.error(
        "Deeprowss: Watch button has no video URL."
      );

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
      title ||
      "Video"
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



  /*
   * CREATE MODAL
   */

  function createSectionVideoModal() {

    var modal =
      document.createElement(
        "div"
      );


    modal.id =
      "embedModal";


    modal.className =
      "deeprowss-section-modal";


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

            '&times;' +

          '</button>' +

        '</div>' +

        '<div id="embedArea" class="embed-area"></div>' +

      '</div>';


    document.body.appendChild(
      modal
    );


    addSectionModalStyles();


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



  /*
   * CLOSE VIDEO
   */

  function closeSectionVideo() {

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


    if (embedArea) {

      embedArea.innerHTML =
        "";

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

  }



  /*
   * ESC
   */

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



  /*
   * MODAL CSS
   */

  function addSectionModalStyles() {

    if (
      document.getElementById(
        "deeprowss-section-modal-styles"
      )
    ) {
      return;
    }


    var style =
      document.createElement(
        "style"
      );


    style.id =
      "deeprowss-section-modal-styles";


    style.textContent =

      ".deeprowss-section-modal {" +
        "position:fixed;" +
        "inset:0;" +
        "z-index:999999;" +
        "display:none;" +
        "align-items:center;" +
        "justify-content:center;" +
      "}" +

      ".deeprowss-section-modal.open {" +
        "display:flex;" +
      "}" +

      ".deeprowss-section-modal .modal-backdrop {" +
        "position:absolute;" +
        "inset:0;" +
        "background:rgba(0,0,0,.92);" +
      "}" +

      ".deeprowss-section-modal .modal-box {" +
        "position:relative;" +
        "z-index:2;" +
        "width:min(1100px,96vw);" +
        "height:min(760px,94vh);" +
        "background:#000;" +
        "border-radius:12px;" +
        "overflow:hidden;" +
        "display:flex;" +
        "flex-direction:column;" +
      "}" +

      ".deeprowss-section-modal .modal-header {" +
        "height:52px;" +
        "min-height:52px;" +
        "display:flex;" +
        "align-items:center;" +
        "justify-content:space-between;" +
        "padding:0 14px;" +
        "background:#111;" +
        "color:#fff;" +
      "}" +

      ".deeprowss-section-modal #modalTitle {" +
        "margin:0;" +
        "font-size:16px;" +
        "font-weight:600;" +
        "white-space:nowrap;" +
        "overflow:hidden;" +
        "text-overflow:ellipsis;" +
      "}" +

      ".deeprowss-section-modal .modal-close {" +
        "border:0;" +
        "background:transparent;" +
        "color:#fff;" +
        "font-size:30px;" +
        "line-height:1;" +
        "cursor:pointer;" +
        "padding:4px 8px;" +
      "}" +

      ".deeprowss-section-modal .embed-area {" +
        "position:relative;" +
        "flex:1;" +
        "min-height:0;" +
        "background:#000;" +
      "}" +

      ".deeprowss-section-modal iframe {" +
        "display:block;" +
        "width:100%;" +
        "height:100%;" +
        "border:0;" +
      "}" +

      "@media (max-width:600px) {" +

        ".deeprowss-section-modal .modal-box {" +
          "width:100vw;" +
          "height:100vh;" +
          "border-radius:0;" +
        "}" +

      "}";


    document.head.appendChild(
      style
    );

  }



  /*
   * ESCAPE HTML
   */

  function escapeHTML(
    value
  ) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }



  /*
   * ESCAPE ATTRIBUTE
   */

  function escapeAttribute(
    value
  ) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  }



  /*
   * MOBILE MENU
   */

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

});
```
