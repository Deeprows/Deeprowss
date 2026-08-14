document.addEventListener("DOMContentLoaded", async function () {

  const liveContainer = document.getElementById("livePosts");
  const highlightContainer = document.getElementById("highlightPosts");
  const movieContainer = document.getElementById("moviePosts");

  console.log("Deeprowss: script loaded");

  try {

    const response = await fetch("posts.json?v=" + Date.now());

    if (!response.ok) {
      throw new Error("Could not load posts.json");
    }

    const posts = await response.json();

    console.log("Deeprowss posts:", posts);

    /*
     * FOOTBALL LIVE
     */

    const livePosts = posts.filter(post => post.type === "live");

    if (liveContainer) {

      if (livePosts.length === 0) {

        liveContainer.innerHTML = `
          <div class="empty-posts">
            No football posts yet.
          </div>
        `;

      } else {

        liveContainer.innerHTML = livePosts.map(post => `

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

              <span>vs</span>

              <strong>
                ${post.away || "Team 2"}
              </strong>

            </div>


            <div class="match-meta">

              ${post.description || ""}

            </div>


            <button
              class="watch-btn"
              data-url="${post.embedUrl || ""}"
              data-title="${post.title || "Video"}">

              Watch

            </button>

          </article>

        `).join("");

      }

    }


    /*
     * HIGHLIGHTS
     */

    const highlights = posts.filter(
      post => post.type === "highlight"
    );

    if (highlightContainer) {

      if (highlights.length === 0) {

        highlightContainer.innerHTML = `
          <div class="empty-posts">
            No highlights yet.
          </div>
        `;

      } else {

        highlightContainer.innerHTML = highlights.map(post => `

          <article class="media-card">

            <div class="media-thumb football-thumb">

              <span class="play">▶</span>

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

              <button
                data-url="${post.embedUrl || ""}"
                data-title="${post.title || "Highlight"}">

                Watch highlight

              </button>

            </div>

          </article>

        `).join("");

      }

    }


    /*
     * MOVIES
     */

    const movies = posts.filter(
      post => post.type === "movie"
    );

    if (movieContainer) {

      if (movies.length === 0) {

        movieContainer.innerHTML = `
          <div class="empty-posts">
            No movies yet.
          </div>
        `;

      } else {

        movieContainer.innerHTML = movies.map(post => `

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
                ${post.date || ""}
              </p>

              <button
                data-url="${post.embedUrl || ""}"
                data-title="${post.title || "Movie"}">

                View

              </button>

            </div>

          </article>

        `).join("");

      }

    }


    /*
     * VIDEO BUTTONS
     */

    document.querySelectorAll(
      "[data-url]"
    ).forEach(button => {

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

  }


  /*
   * VIDEO MODAL
   */

  window.openEmbed = function (title, url) {

    const modal =
      document.getElementById("embedModal");

    const modalTitle =
      document.getElementById("modalTitle");

    const embedArea =
      document.getElementById("embedArea");


    if (!modal) return;


    modalTitle.textContent =
      title || "Video";


    if (url) {

      embedArea.innerHTML = `

        <iframe
          src="${url}"
          allowfullscreen
          loading="lazy">
        </iframe>

      `;

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

  };


  window.closeEmbed = function () {

    const modal =
      document.getElementById("embedModal");

    const embedArea =
      document.getElementById("embedArea");


    if (!modal) return;


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

  const menuToggle =
    document.getElementById("menuToggle");

  const mainNav =
    document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.addEventListener(
      "click",
      function () {

        mainNav.classList.toggle("open");

      }
    );

  }


  /*
   * COPYRIGHT YEAR
   */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

});
