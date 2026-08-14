document.addEventListener("DOMContentLoaded", function () {

  console.log("Deeprowss script loaded");

  /* =====================================
     CONTAINERS
  ===================================== */

  var liveContainer =
    document.getElementById("livePosts");

  var highlightContainer =
    document.getElementById("highlightPosts");

  var movieContainer =
    document.getElementById("moviePosts");

  var allPostsContainer =
    document.getElementById("allPosts");


  /* =====================================
     LOAD POSTS
  ===================================== */

  var xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    "posts.json?v=" + Date.now(),
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

        if (!Array.isArray(posts)) {
          throw new Error("posts.json must contain an array.");
        }

        posts.sort(function (a, b) {

          return (
            new Date(b.publishedAt || 0).getTime() -
            new Date(a.publishedAt || 0).getTime()
          );

        });

        console.log(
          "Deeprowss posts loaded:",
          posts
        );

        displayLivePosts(posts);
        displayHighlightPosts(posts);
        displayMoviePosts(posts);

        /*
         * Used by football/highlights pages
         * when they load all-posts.js separately.
         */
        if (allPostsContainer) {
          displayAllPosts(posts);
        }

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

    if (allPostsContainer) {

      allPostsContainer.innerHTML =
        '<div class="empty-posts">' +
        'Unable to load posts.' +
        '</div>';

    }

  }


  /* =====================================
     ESCAPE HTML
  ===================================== */

  function escapeHTML(value) {

    if (
      value === undefined ||
      value === null
    ) {
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

      return date.toString();

    }

  }


  /* =====================================
     CREATE THUMBNAIL
     
     IMPORTANT:
     Direct image element is used instead
     of relying on background-image.
  ===================================== */

  function createThumbnail(
    thumbnail,
    altText,
    className
  ) {

    var wrapper =
      document.createElement("div");

    wrapper.className =
      className || "media-thumb";


    if (thumbnail) {

      var image =
        document.createElement("img");

      image.className =
        "post-thumbnail";

      image.src =
        String(thumbnail).trim();

      image.alt =
        altText || "Thumbnail";

      image.loading =
        "lazy";

      image.decoding =
        "async";

      /*
       * If the image actually fails,
       * hide the image and show the
       * normal fallback background.
       */
      image.addEventListener(
        "error",
        function () {

          image.remove();

          wrapper.classList.add(
            "thumbnail-fallback"
          );

        }
      );

      wrapper.classList.add(
        "has-thumbnail"
      );

      wrapper.appendChild(
        image
      );

    }

    return wrapper;

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

              escapeHTML(status) +

            '</span>' +

            '<span>' +

              escapeHTML(
                post.category || "Football"
              ) +

            '</span>' +

          '</div>' +

          '<div class="teams">' +

            '<strong>' +
              escapeHTML(
                post.home || "Team 1"
              ) +
            '</strong>' +

            '<span>vs</span>' +

            '<strong>' +
              escapeHTML(
                post.away || "Team 2"
              ) +
            '</strong>' +

          '</div>' +

          '<div class="match-meta">' +

            escapeHTML(
              post.description || ""
            ) +

          '</div>' +

          '<div class="post-date">' +

            formatPostDate(
              post.publishedAt
            ) +

          '</div>' +

          '<button ' +
            'type="button" ' +
            'class="watch-btn post-watch-button" ' +
            'data-url="' +
              escapeHTML(
                post.embedUrl || ""
              ) +
            '" ' +
            'data-title="' +
              escapeHTML(
                post.title || "Football"
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

      html +=

        '<article class="media-card">' +

          '<div class="media-thumb football-thumb ' +
            (
              post.thumbnail
                ? "has-thumbnail"
                : ""
            ) +
          '">' +

            (
              post.thumbnail
                ?
                  '<img ' +
                    'class="post-thumbnail" ' +
                    'src="' +
                      escapeHTML(
                        post.thumbnail
                      ) +
                    '" ' +
                    'alt="' +
                      escapeHTML(
                        post.title ||
                        "Football Highlight"
                      ) +
                    '" ' +
                    'loading="lazy" ' +
                    'decoding="async" ' +
                  '>'
                :
                  ''
            ) +

            '<span class="play">▶</span>' +

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
              'type="button" ' +
              'class="post-watch-button" ' +
              'data-url="' +
                escapeHTML(
                  post.embedUrl || ""
                ) +
              '" ' +
              'data-title="' +
                escapeHTML(
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

    /*
     * Important:
     * Handle broken thumbnails after
     * the HTML has been inserted.
     */
    attachThumbnailFallbacks();

    attachVideoButtons();

  }


  /* =====================================
     MOVIES
     
     MOVIE THUMBNAILS ARE HANDLED
     SEPARATELY FROM HIGHLIGHTS.
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

    /*
     * Build cards with DOM nodes.
     * This avoids the previous thumbnail
     * problem on movies.html.
     */

    movieContainer.innerHTML = "";

    movies.forEach(function (post) {

      var article =
        document.createElement("article");

      article.className =
        "movie-card";


      /* ==============================
         POSTER
      ============================== */

      var poster =
        document.createElement("div");

      poster.className =
        "poster poster-one";


      if (post.thumbnail) {

        poster.classList.add(
          "has-thumbnail"
        );

        var img =
          document.createElement("img");

        img.className =
          "post-thumbnail";

        img.src =
          String(
            post.thumbnail
          ).trim();

        img.alt =
          post.title || "Movie";

        img.loading =
          "lazy";

        img.decoding =
          "async";

        /*
         * Do NOT replace the movie card
         * if an image fails.
         */
        img.addEventListener(
          "error",
          function () {

            console.warn(
              "Movie thumbnail failed:",
              post.thumbnail
            );

            img.remove();

            poster.classList.remove(
              "has-thumbnail"
            );

            poster.classList.add(
              "thumbnail-fallback"
            );

          }
        );

        poster.appendChild(
          img
        );

      }


      /* ==============================
         CATEGORY
      ============================== */

      var category =
        document.createElement("span");

      category.className =
        "poster-category";

      category.textContent =
        post.category || "MOVIE";

      poster.appendChild(
        category
      );


      /* ==============================
         MOVIE INFO
      ============================== */

      var info =
        document.createElement("div");

      info.className =
        "movie-info";


      var title =
        document.createElement("h3");

      title.textContent =
        post.title || "Movie";


      var date =
        document.createElement("p");

      date.textContent =
        formatPostDate(
          post.publishedAt
        );


      var button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "post-watch-button";

      button.textContent =
        "View";

      button.setAttribute(
        "data-url",
        post.embedUrl || ""
      );

      button.setAttribute(
        "data-title",
        post.title || "Movie"
      );


      info.appendChild(
        title
      );

      info.appendChild(
        date
      );

      info.appendChild(
        button
      );


      article.appendChild(
        poster
      );

      article.appendChild(
        info
      );


      movieContainer.appendChild(
        article
      );

    });


    attachVideoButtons();

  }


  /* =====================================
     THUMBNAIL FALLBACKS
  ===================================== */

  function attachThumbnailFallbacks() {

    var images =
      document.querySelectorAll(
        ".post-thumbnail"
      );

    for (
      var i = 0;
      i < images.length;
      i++
    ) {

      images[i].addEventListener(
        "error",
        function () {

          this.style.display =
            "none";

          var parent =
            this.parentElement;

          if (parent) {

            parent.classList.add(
              "thumbnail-fallback"
            );

          }

        },
        {
          once: true
        }
      );

    }

  }


  /* =====================================
     ALL POSTS
  ===================================== */

  function displayAllPosts(posts) {

    if (!allPostsContainer) {
      return;
    }

    /*
     * Determine which page we're on.
     */

    var page =
      window.location.pathname
        .toLowerCase();

    var wantedType = null;

    if (
      page.indexOf("football.html") !== -1
    ) {

      wantedType = "live";

    } else if (
      page.indexOf("highlights.html") !== -1
    ) {

      wantedType = "highlight";

    } else if (
      page.indexOf("movies.html") !== -1
    ) {

      wantedType = "movie";

    }

    var filtered =
      wantedType
        ? posts.filter(function (post) {
            return post.type === wantedType;
          })
        : posts;


    if (filtered.length === 0) {

      allPostsContainer.innerHTML =
        '<div class="empty-posts">' +
        'No content available.' +
        '</div>';

      return;

    }


    /*
     * MOVIES
     */

    if (wantedType === "movie") {

      movieContainer &&
        displayMoviePosts(filtered);

      return;

    }


    /*
     * HIGHLIGHTS
     */

    if (wantedType === "highlight") {

      highlightContainer
        ? displayHighlightPosts(filtered)
        : renderHighlightGrid(
            filtered,
            allPostsContainer
          );

      return;

    }


    /*
     * FOOTBALL
     */

    if (wantedType === "live") {

      liveContainer
        ? displayLivePosts(filtered)
        : renderFootballGrid(
            filtered,
            allPostsContainer
          );

      return;

    }

  }


  /* =====================================
     FALLBACK FOOTBALL GRID
  ===================================== */

  function renderFootballGrid(
    posts,
    container
  ) {

    var html = "";

    posts.forEach(function (post) {

      html +=

        '<article class="live-card">' +

          '<div class="match-top">' +

            '<span class="' +
              (
                post.status === "LIVE"
                  ? "live-badge"
                  : "upcoming-badge"
              ) +
            '">' +

              escapeHTML(
                post.status || "UPCOMING"
              ) +

            '</span>' +

            '<span>' +
              escapeHTML(
                post.category || "Football"
              ) +
            '</span>' +

          '</div>' +

          '<div class="teams">' +

            '<strong>' +
              escapeHTML(
                post.home || "Team 1"
              ) +
            '</strong>' +

            '<span>vs</span>' +

            '<strong>' +
              escapeHTML(
                post.away || "Team 2"
              ) +
            '</strong>' +

          '</div>' +

          '<div class="match-meta">' +
            escapeHTML(
              post.description || ""
            ) +
          '</div>' +

          '<div class="post-date">' +
            formatPostDate(
              post.publishedAt
            ) +
          '</div>' +

          '<button ' +
            'type="button" ' +
            'class="watch-btn post-watch-button" ' +
            'data-url="' +
              escapeHTML(
                post.embedUrl || ""
              ) +
            '" ' +
            'data-title="' +
              escapeHTML(
                post.title || "Football"
              ) +
          '">' +

            'Watch' +

          '</button>' +

        '</article>';

    });

    container.innerHTML =
      html;

    attachVideoButtons();

  }


  /* =====================================
     FALLBACK HIGHLIGHT GRID
  ===================================== */

  function renderHighlightGrid(
    posts,
    container
  ) {

    container.innerHTML = "";

    posts.forEach(function (post) {

      var article =
        document.createElement("article");

      article.className =
        "media-card";


      var thumb =
        document.createElement("div");

      thumb.className =
        "media-thumb football-thumb";


      if (post.thumbnail) {

        thumb.classList.add(
          "has-thumbnail"
        );

        var image =
          document.createElement("img");

        image.className =
          "post-thumbnail";

        image.src =
          post.thumbnail;

        image.alt =
          post.title || "Highlight";

        image.loading =
          "lazy";

        image.decoding =
          "async";

        thumb.appendChild(
          image
        );

      }


      var play =
        document.createElement("span");

      play.className =
        "play";

      play.textContent =
        "▶";


      thumb.appendChild(
        play
      );


      var info =
        document.createElement("div");

      info.className =
        "media-info";


      info.innerHTML =

        '<span class="tag">HIGHLIGHT</span>' +

        '<h3>' +
          escapeHTML(
            post.title || "Highlight"
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
        '</div>';


      var button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "post-watch-button";

      button.textContent =
        "Watch highlight";

      button.setAttribute(
        "data-url",
        post.embedUrl || ""
      );

      button.setAttribute(
        "data-title",
        post.title || "Highlight"
      );


      info.appendChild(
        button
      );

      article.appendChild(
        thumb
      );

      article.appendChild(
        info
      );

      container.appendChild(
        article
      );

    });


    attachVideoButtons();

  }


  /* =====================================
     VIDEO BUTTONS
  ===================================== */

  function attachVideoButtons() {

    var buttons =
      document.querySelectorAll(
        ".post-watch-button, .watch-btn"
      );

    for (
      var i = 0;
      i < buttons.length;
      i++
    ) {

      /*
       * Avoid attaching the same handler
       * more than once.
       */

      if (
        buttons[i].dataset.bound === "true"
      ) {
        continue;
      }

      buttons[i].dataset.bound =
        "true";


      buttons[i].addEventListener(
        "click",
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

        }
      );

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


      if (
        !modal ||
        !embedArea
      ) {

        console.warn(
          "Video modal elements not found."
        );

        return;

      }


      if (modalTitle) {

        modalTitle.textContent =
          title || "Video";

      }


      /*
       * Completely clear previous iframe.
       */

      embedArea.innerHTML =
        "";


      /*
       * Remove previous controls.
       */

      var oldControls =
        modal.querySelector(
          ".video-controls"
        );

      if (oldControls) {
        oldControls.remove();
      }


      /*
       * CREATE IFRAME
       */

      if (url) {

        var iframe =
          document.createElement(
            "iframe"
          );

        iframe.src =
          String(url).trim();

        iframe.className =
          "video-iframe";

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
          "no-referrer-when-downgrade"
        );

        embedArea.appendChild(
          iframe
        );

      } else {

        embedArea.innerHTML =

          '<div class="embed-placeholder">' +

            '<strong>' +
              'Video unavailable' +
            '</strong>' +

            '<span class="embed-note">' +
              'No video URL has been added to this post.' +
            '</span>' +

          '</div>';

      }


      /*
       * FULLSCREEN BUTTON
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

      fullscreenButton.textContent =
        "Tap to watch in Fullscreen";

      fullscreenButton.setAttribute(
        "aria-label",
        "Tap to watch in Fullscreen"
      );


      controls.appendChild(
        fullscreenButton
      );

      embedArea.insertAdjacentElement(
        "afterend",
        controls
      );


      /*
       * OPEN MODAL
       */

      modal.classList.add(
        "open"
      );

      modal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "modal-open"
      );

      document.body.style.overflow =
        "hidden";

    };


  /* =====================================
     CLOSE VIDEO
     
     FIXED:
     Works from the X button,
     backdrop, ESC and fullscreen.
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
       * Exit fullscreen first.
       */

      if (
        document.fullscreenElement
      ) {

        try {

          await document.exitFullscreen();

        } catch (error) {

          console.warn(
            "Could not exit fullscreen:",
            error
          );

        }

      }


      /*
       * Unlock orientation if supported.
       */

      if (
        screen.orientation &&
        typeof screen.orientation.unlock ===
          "function"
      ) {

        try {

          screen.orientation.unlock();

        } catch (error) {

          console.warn(
            "Could not unlock orientation:",
            error
          );

        }

      }


      /*
       * Destroy iframe completely.
       *
       * This stops the embedded page/video
       * rather than merely hiding it.
       */

      if (embedArea) {

        var iframe =
          embedArea.querySelector(
            "iframe"
          );

        if (iframe) {

          iframe.src =
            "about:blank";

          iframe.remove();

        }

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
       * CLOSE MODAL
       */

      modal.classList.remove(
        "open"
      );

      modal.setAttribute(
        "aria-hidden",
        "true"
      );


      document.body.classList.remove(
        "modal-open"
      );

      document.body.style.overflow =
        "";

    };


  /* =====================================
     X BUTTON
     
     EVENT DELEGATION
     
     This guarantees the close button
     works even if the modal is changed
     by other code.
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
        event.stopPropagation();

        closeEmbed();

        return;

      }


      /*
       * Backdrop close.
       */

      if (
        event.target.classList &&
        event.target.classList.contains(
          "modal-backdrop"
        )
      ) {

        event.preventDefault();

        closeEmbed();

      }

    }
  );


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

          }

          if (
            screen.orientation &&
            typeof screen.orientation.lock ===
              "function"
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

        }

      } else {

        if (button) {

          button.textContent =
            "Tap to watch in Fullscreen";

          button.setAttribute(
            "aria-label",
            "Tap to watch in Fullscreen"
          );

        }

        if (
          screen.orientation &&
          typeof screen.orientation.unlock ===
            "function"
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

    menuToggle.addEventListener(
      "click",
      function () {

        var isOpen =
          mainNav.classList.toggle(
            "open"
          );

        menuToggle.setAttribute(
          "aria-expanded",
          isOpen
            ? "true"
            : "false"
        );

      }
    );

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
