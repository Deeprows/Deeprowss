document.addEventListener("DOMContentLoaded", async function () {

  const container = document.getElementById("allPosts");

  if (!container) return;

  try {

    const response = await fetch("posts.json?v=" + Date.now());

    if (!response.ok) {
      throw new Error("Could not load posts.json");
    }

    const posts = await response.json();

    posts.sort(function (a, b) {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });


    const page = window.location.pathname;


    let type = "live";

    if (page.includes("highlights")) {
      type = "highlight";
    }

    if (page.includes("movies")) {
      type = "movie";
    }


    const filteredPosts = posts.filter(function (post) {
      return post.type === type;
    });


    if (filteredPosts.length === 0) {

      container.innerHTML = `
        <div class="empty-posts">
          No posts available yet.
        </div>
      `;

      return;
    }


    function formatDate(dateString) {

      if (!dateString) return "";

      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "";

      return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });

    }


    if (type === "live") {

      container.innerHTML = filteredPosts.map(function (post) {

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

              <span>vs</span>

              <strong>
                ${post.away || "Team 2"}
              </strong>

            </div>


            <div class="match-meta">
              ${post.description || ""}
            </div>


            <div class="post-date">
              ${formatDate(post.publishedAt)}
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


    if (type === "highlight") {

      container.innerHTML = filteredPosts.map(function (post) {

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
                ${formatDate(post.publishedAt)}
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


    if (type === "movie") {

      container.innerHTML = filteredPosts.map(function (post) {

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
                ${formatDate(post.publishedAt)}
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


    /*
     * VIDEO BUTTONS
     */

    document.querySelectorAll("[data-url]").forEach(function (button) {

      button.addEventListener("click", function () {

        const url =
          this.getAttribute("data-url");

        const title =
          this.getAttribute("data-title");

        openEmbed(title, url);

      });

    });


  } catch (error) {

    console.error("Deeprowss error:", error);

    container.innerHTML = `
      <div class="empty-posts">
        Unable to load posts.
      </div>
    `;

  }


  /*
   * MOBILE MENU
   */

  const menuToggle =
    document.getElementById("menuToggle");

  const mainNav =
    document.getElementById("mainNav");


  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

      mainNav.classList.toggle("open");

    });

  }

});
