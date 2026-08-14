document.addEventListener("DOMContentLoaded", async function () {

  const liveContainer = document.getElementById("livePosts");
  const highlightContainer = document.getElementById("highlightPosts");
  const movieContainer = document.getElementById("moviePosts");

  console.log("Deeprowss: script loaded");


  /* =====================================================
     FORMAT VISITOR TIMEZONE
  ===================================================== */

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


  /* =====================================================
     LOAD POSTS
  ===================================================== */

  try {

    const response = await fetch(
      "posts.json?v=" + Date.now()
    );

    if (!response.ok) {
      throw new Error("Could not load posts.json");
    }

    const posts = await response.json();


    /*
     * NEWEST POSTS FIRST
     */

    posts.sort(function (a, b) {

      return (
        new Date(b.publishedAt) -
        new Date(a.publishedAt)
      );

    });


    console.log("Deeprowss posts:", posts);


    /* =====================================================
       FOOTBALL LIVE
    ===================================================== */

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

            <article class="live-card">

              <div class="match-top">

                <span class="${
                  post.status === "LIVE"
                    ? "live-badge"
                    : "upcoming-badge"
                }">

                  ${post.status || "UPCOMING"}

                </span>

                <span>
                  ${post.category || "Football"}
                </span>

              </div>


              <div class="teams">

                <strong>
                  ${post.home || "Team 1"}
                </strong>

                <span>
                  vs
                </span>

                <strong>
                  ${post.away || "Team 2"}
                </strong>

              </div>


              <div class="match-meta">
                ${post.description || ""}
              </div>


              <div class="post-date">
                ${formatPostDate(post.publishedAt)}
              </div>


              <button
                class="watch-btn"
                data-url="${post.embedUrl || ""}"
                data-title="${post.title || "Football Live"}">

                Watch

              </button>

            </article>

          `;

        }).join("");

      }

    }



    /* =====================================================
       HIGHLIGHTS
    ===================================================== */

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

        highlightContainer.innerHTML =
          highlights.map(function (post) {

            return `

              <article class="media-card">

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
                    ${post.title || "Football Highlight"}
                  </h3>


                  <p>
                    ${post.description || ""}
                  </p>


                  <div class="post-date">
                    ${formatPostDate(post.publishedAt)}
                  </div>


                  <button
                    data-url="${post.embedUrl || ""}"
                    data-title="${post.title || "Highlight"}">

                    Watch highlight

                  </button>

                </div>

              </article>

            `;

          }).join("");

      }

    }



    /* =====================================================
       MOVIES
    ===================================================== */

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

        movieContainer.innerHTML =
          movies.map(function (post) {

            return `

              <article class="movie-card">

                <div class="poster poster-one">

                  <span>
                    ${post.category || "MOVIE"}
                  </span>

                </div>


                <div class="movie-info">

                  <h3>
                    ${post.title || "Movie"}
                  </h3>


                  <p>
                    ${formatPostDate(post.publishedAt)}
                  </p>


                  <button
                    data-url="${post.embedUrl || ""}"
                    data-title="${post.title || "Movie"}">

                    View

                  </button>

                </div>

              </article>

            `;

          }).join("");

      }

    }



    /* =====================================================
       VIDEO BUTTONS
    ===================================================== */

    document
      .querySelectorAll("[data-url]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const url =
              this.getAttribute("data-url");

            const title =
              this.getAttribute("data-title");

            openEmbed(title, url);

          }
        );

      });


  } catch (error) {

    console.error(
      "Deeprowss error:",
      error
    );


    if (liveContainer) {

      liveContainer.innerHTML = `
        <div class="empty-posts">
          Error loading posts.
        </div>
      `;

    }


    if (highlightContainer) {

      highlightContainer.innerHTML = `
        <div class="empty-posts">
          Error loading highlights.
        </div>
      `;

    }


    if (movieContainer) {

      movieContainer.innerHTML = `
        <div class="empty-posts">
          Error loading movies.
        </div>
      `;

    }

  }



  /* =====================================================
     OPEN VIDEO
  ===================================================== */

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


    /*
     * VIDEO
     */

    if (url) {

      embedArea.innerHTML = `

        <div class="video-player">

          <iframe
            id="videoFrame"
            src="${url}"
            allow="
              autoplay;
              fullscreen;
              picture-in-picture;
              encrypted-media
            "
            allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen
            loading="eager">
          </iframe>


          <div class="video-controls">

            <button
              id="fullscreenBtn"
              class="fullscreen-btn"
              type="button">

              ⛶ Full Screen

            </button>

          </div>

        </div>

      `;


      /*
       * FULL SCREEN BUTTON
       */

      const fullscreenBtn =
        document.getElementById(
          "fullscreenBtn"
        );


      const videoPlayer =
        document.querySelector(
          ".video-player"
        );


      if (fullscreenBtn && videoPlayer) {

        fullscreenBtn.addEventListener(
          "click",
          async function () {

            try {

              /*
               * Request full screen.
               */

              if (
                videoPlayer.requestFullscreen
              ) {

                await videoPlayer.requestFullscreen();

              } else if (
                videoPlayer.webkitRequestFullscreen
              ) {

                videoPlayer.webkitRequestFullscreen();

              }


              /*
               * Try to lock mobile screen
               * into landscape.
               *
               * Not all browsers support this.
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
                    "Landscape lock not supported:",
                    orientationError
                  );

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

      }

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


    /*
     * Prevent page scrolling while
     * video modal is open.
     */

    document.body.style.overflow =
      "hidden";

  };



  /* =====================================================
     CLOSE VIDEO
  ===================================================== */

  window.closeEmbed = function () {

    const modal =
      document.getElementById("embedModal");

    const embedArea =
      document.getElementById("embedArea");


    if (!modal) {
      return;
    }


    /*
     * Exit fullscreen first.
     */

    if (document.fullscreenElement) {

      if (document.exitFullscreen) {

        document.exitFullscreen();

      }

    } else if (
      document.webkitFullscreenElement
    ) {

      if (
        document.webkitExitFullscreen
      ) {

        document.webkitExitFullscreen();

      }

    }


    /*
     * Unlock orientation if supported.
     */

    if (
      screen.orientation &&
      screen.orientation.unlock
    ) {

      try {

        screen.orientation.unlock();

      } catch (error) {

        console.log(
          "Orientation unlock not supported."
        );

      }

    }


    modal.classList.remove("open");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    if (embedArea) {

      embedArea.innerHTML = "";

    }


    /*
     * Restore page scrolling.
     */

    document.body.style.overflow =
      "";

  };



  /* =====================================================
     CLOSE WITH ESCAPE KEY
  ===================================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {

        const modal =
          document.getElementById("embedModal");

        if (
          modal &&
          modal.classList.contains("open")
        ) {

          closeEmbed();

        }

      }

    }
  );



  /* =====================================================
     MOBILE MENU
  ===================================================== */

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

  }



  /* =====================================================
     COPYRIGHT YEAR
  ===================================================== */

  const year =
    document.getElementById("year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
