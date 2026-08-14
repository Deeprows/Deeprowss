document.addEventListener("DOMContentLoaded", async function () {

  const liveContainer = document.getElementById("livePosts");
  const highlightContainer = document.getElementById("highlightPosts");
  const movieContainer = document.getElementById("moviePosts");

  console.log("Deeprowss: script loaded");


  /* =========================================
     LOAD POSTS
  ========================================= */

  try {

    const response = await fetch("posts.json?v=" + Date.now());

    if (!response.ok) {
      throw new Error("Could not load posts.json");
    }

    const posts = await response.json();


    /* Newest posts first */

    posts.sort(function (a, b) {

      return new Date(b.publishedAt) - new Date(a.publishedAt);

    });


    console.log("Deeprowss posts:", posts);


    /* =========================================
       VISITOR TIMEZONE
    ========================================= */

    function formatPostDate(dateString) {

      if (!dateString) {
        return "";
      }

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });

    }


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeHTML(value) {

      if (value === undefined || value === null) {
        return "";
      }

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    /* =========================================
       FOOTBALL LIVE
    ========================================= */

    const livePosts = posts.filter(function (post) {

      return post.type === "live";

    });


    if (liveContainer) {

      if (livePosts.length === 0) {

        liveContainer.innerHTML = `
          <div class="empty-posts">
            No football posts yet.
          </div>
        `;

      } else {

        liveContainer.innerHTML = livePosts.map(function (post) {

          return `

            <article class="live-card post-card">

              <div class="match-top">

                <span class="${
                  post.status === "LIVE"
                    ? "live-badge"
                    : "upcoming-badge"
                }">

                  ${escapeHTML(post.status || "UPCOMING")}

                </span>

                <span>
                  ${escapeHTML(post.category || "Football")}
                </span>

              </div>


              <div class="teams">

                <strong>
                  ${escapeHTML(post.home || "Team 1")}
                </strong>

                <span>vs</span>

                <strong>
                  ${escapeHTML(post.away || "Team 2")}
                </strong>

              </div>


              <div class="match-meta">

                ${escapeHTML(post.description || "")}

              </div>


              <div class="post-date">

                ${formatPostDate(post.publishedAt)}

              </div>


              <button
                class="watch-btn video-button"
                data-url="${escapeHTML(post.embedUrl || "")}"
                data-title="${escapeHTML(post.title || "Football Live")}"
                aria-label="Watch ${escapeHTML(post.title || "football live")}">

                Watch

              </button>

            </article>

          `;

        }).join("");

      }

    }


    /* =========================================
       HIGHLIGHTS
    ========================================= */

    const highlights = posts.filter(function (post) {

      return post.type === "highlight";

    });


    if (highlightContainer) {

      if (highlights.length === 0) {

        highlightContainer.innerHTML = `
          <div class="empty-posts">
            No highlights yet.
          </div>
        `;

      } else {

        highlightContainer.innerHTML = highlights.map(function (post) {

          return `

            <article class="media-card post-card">

              <div class="media-thumb football-thumb">

                <span class="play">
                  ▶
                </span>

              </div>


              <div class="media-info">

                <span class="tag">
                  HIGHLIGHT
                </span>


                <h3>
                  ${escapeHTML(post.title || "Football Highlight")}
                </h3>


                <p>
                  ${escapeHTML(post.description || "")}
                </p>


                <div class="post-date">

                  ${formatPostDate(post.publishedAt)}

                </div>


                <button
                  class="video-button"
                  data-url="${escapeHTML(post.embedUrl || "")}"
                  data-title="${escapeHTML(post.title || "Football Highlight")}">

                  Watch highlight

                </button>

              </div>

            </article>

          `;

        }).join("");

      }

    }


    /* =========================================
       MOVIES
    ========================================= */

    const movies = posts.filter(function (post) {

      return post.type === "movie";

    });


    if (movieContainer) {

      if (movies.length === 0) {

        movieContainer.innerHTML = `
          <div class="empty-posts">
            No movies yet.
          </div>
        `;

      } else {

        movieContainer.innerHTML = movies.map(function (post) {

          return `

            <article class="movie-card post-card">

              <div class="poster poster-one">

                <span>
                  ${escapeHTML(post.category || "MOVIE")}
                </span>

              </div>


              <div class="movie-info">

                <h3>
                  ${escapeHTML(post.title || "Movie")}
                </h3>


                <p>
                  ${formatPostDate(post.publishedAt)}
                </p>


                <button
                  class="video-button"
                  data-url="${escapeHTML(post.embedUrl || "")}"
                  data-title="${escapeHTML(post.title || "Movie")}">

                  View

                </button>

              </div>

            </article>

          `;

        }).join("");

      }

    }


    /* =========================================
       VIDEO BUTTONS
    ========================================= */

    document.querySelectorAll(".video-button").forEach(function (button) {

      button.addEventListener("click", function () {

        const url = this.getAttribute("data-url");

        const title = this.getAttribute("data-title");

        openEmbed(title, url);

      });

    });


  } catch (error) {

    console.error("Deeprowss error:", error);


    if (liveContainer) {

      liveContainer.innerHTML = `
        <div class="empty-posts">
          Unable to load football posts.
        </div>
      `;

    }


    if (highlightContainer) {

      highlightContainer.innerHTML = `
        <div class="empty-posts">
          Unable to load highlights.
        </div>
      `;

    }


    if (movieContainer) {

      movieContainer.innerHTML = `
        <div class="empty-posts">
          Unable to load movies.
        </div>
      `;

    }

  }


  /* =========================================
     OPEN VIDEO
  ========================================= */

  window.openEmbed = function (title, url) {

    const modal =
      document.getElementById("embedModal");

    const modalTitle =
      document.getElementById("modalTitle");

    const embedArea =
      document.getElementById("embedArea");


    if (!modal || !embedArea) {
      return;
    }


    modalTitle.textContent =
      title || "Video";


    /* Clear previous video */

    embedArea.innerHTML = "";


    if (url) {

      const iframe = document.createElement("iframe");

      iframe.src = url;

      iframe.allowFullscreen = true;

      iframe.setAttribute(
        "allow",
        "autoplay; fullscreen; picture-in-picture; encrypted-media"
      );

      iframe.setAttribute(
        "loading",
        "eager"
      );

      iframe.setAttribute(
        "referrerpolicy",
        "no-referrer-when-downgrade"
      );


      embedArea.appendChild(iframe);


      /* =====================================
         SMALL FULLSCREEN ICON
      ===================================== */

      const fullscreenButton =
        document.createElement("button");

      fullscreenButton.className =
        "fullscreen-button";

      fullscreenButton.type =
        "button";

      fullscreenButton.setAttribute(
        "aria-label",
        "Enter fullscreen"
      );

      fullscreenButton.setAttribute(
        "title",
        "Fullscreen"
      );

      fullscreenButton.innerHTML = "⛶";


      fullscreenButton.addEventListener(
        "click",
        function () {

          requestFullscreen(iframe);

        }
      );


      embedArea.appendChild(
        fullscreenButton
      );

    } else {

      embedArea.innerHTML = `

        <div class="embed-placeholder">

          <strong>
            Video not available yet
          </strong>

          <p>
            Add an authorized external
            embed URL to this post.
          </p>

        </div>

      `;

    }


    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "modal-open"
    );

  };


  /* =========================================
     FULLSCREEN
  ========================================= */

  function requestFullscreen(element) {

    if (!element) {
      return;
    }


    /*
     * Normal fullscreen
     */

    if (element.requestFullscreen) {

      element.requestFullscreen();

    }


    /*
     * iPhone / iPad Safari
     */

    else if (element.webkitEnterFullscreen) {

      element.webkitEnterFullscreen();

    }


    /*
     * Android / older browsers
     */

    else if (element.webkitRequestFullscreen) {

      element.webkitRequestFullscreen();

    }

  }


  /* =========================================
     CLOSE VIDEO
  ========================================= */

  window.closeEmbed = function () {

    const modal =
      document.getElementById("embedModal");

    const embedArea =
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


    document.body.classList.remove(
      "modal-open"
    );

  };


  /* =========================================
     CLOSE WITH ESCAPE
  ========================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {

        closeEmbed();

      }

    }
  );


  /* =========================================
     MOBILE MENU
  ========================================= */

  const menuToggle =
    document.getElementById("menuToggle");

  const mainNav =
    document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.addEventListener(
      "click",
      function () {

        const isOpen =
          mainNav.classList.toggle("open");


        menuToggle.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

      }
    );


    /*
     * Close mobile menu after clicking
     * a navigation link.
     */

    mainNav.querySelectorAll("a").forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );

  }


  /* =========================================
     COPYRIGHT YEAR
  ========================================= */

  const year =
    document.getElementById("year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
