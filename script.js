```javascript
document.addEventListener("DOMContentLoaded", async function () {

  const SUPABASE_URL =
    "https://idffyqrbtewmtkwumcbv.supabase.co";

  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZmZ5cXJidGV3bXRrd3VtY2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MjA3ODksImV4cCI6MjEwMjI5Njc4OX0.ByKaQRAMmHSKzTqVOrRF7qdScqSa-7mqbA0MfhVHysU";


  const liveContainer =
    document.getElementById("livePosts");

  const highlightContainer =
    document.getElementById("highlightPosts");

  const movieContainer =
    document.getElementById("moviePosts");


  console.log("Deeprowss: Supabase script loaded");


  /*
   * LOAD POSTS FROM SUPABASE
   */

  async function loadPosts() {

    try {

      const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/posts?select=*&order=publishedAt.desc",
        {
          method: "GET",

          headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization":
              "Bearer " + SUPABASE_ANON_KEY
          }
        }
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          "Supabase error: " + errorText
        );

      }


      const posts =
        await response.json();


      console.log(
        "Deeprowss posts:",
        posts
      );


      displayPosts(posts);


    } catch (error) {

      console.error(
        "Deeprowss error:",
        error
      );


      showError(
        liveContainer,
        "Unable to load football posts."
      );

      showError(
        highlightContainer,
        "Unable to load highlights."
      );

      showError(
        movieContainer,
        "Unable to load movies."
      );

    }

  }


  /*
   * FORMAT DATE
   *
   * Automatically uses
   * the visitor's timezone.
   */

  function formatPostDate(dateString) {

    if (!dateString) {
      return "";
    }


    const date =
      new Date(dateString);


    if (isNaN(date.getTime())) {
      return "";
    }


    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  }


  /*
   * DISPLAY POSTS
   */

  function displayPosts(posts) {


    /*
     * FOOTBALL LIVE
     */

    const livePosts =
      posts.filter(function (post) {

        return post.type === "live";

      });


    if (liveContainer) {

      if (livePosts.length === 0) {

        liveContainer.innerHTML =
          `
          <div class="empty-posts">
            No football posts yet.
          </div>
          `;

      } else {

        liveContainer.innerHTML =
          livePosts.map(function (post) {

            return `

              <article class="live-card">

                <div class="match-top">

                  <span class="${
                    post.status === "LIVE"
                      ? "live-badge"
                      : "upcoming-badge"
                  }">

                    ${escapeHTML(
                      post.status ||
                      "UPCOMING"
                    )}

                  </span>

                  <span>

                    ${escapeHTML(
                      post.category ||
                      "Football"
                    )}

                  </span>

                </div>


                <div class="teams">

                  <strong>
                    ${escapeHTML(
                      post.home ||
                      "Team 1"
                    )}
                  </strong>

                  <span>vs</span>

                  <strong>
                    ${escapeHTML(
                      post.away ||
                      "Team 2"
                    )}
                  </strong>

                </div>


                <div class="match-meta">

                  ${escapeHTML(
                    post.description ||
                    ""
                  )}

                </div>


                <div class="post-date">

                  ${formatPostDate(
                    post.publishedAt
                  )}

                </div>


                <button
                  class="watch-btn"
                  data-url="${escapeAttribute(
                    post.embedUrl || ""
                  )}"
                  data-title="${escapeAttribute(
                    post.title ||
                    "Video"
                  )}">

                  Watch

                </button>

              </article>

            `;

          }).join("");

      }

    }



    /*
     * HIGHLIGHTS
     */

    const highlights =
      posts.filter(function (post) {

        return post.type === "highlight";

      });


    if (highlightContainer) {

      if (highlights.length === 0) {

        highlightContainer.innerHTML =
          `
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

                    ${escapeHTML(
                      post.title ||
                      "Football Highlight"
                    )}

                  </h3>


                  <p>

                    ${escapeHTML(
                      post.description ||
                      ""
                    )}

                  </p>


                  <div class="post-date">

                    ${formatPostDate(
                      post.publishedAt
                    )}

                  </div>


                  <button
                    data-url="${escapeAttribute(
                      post.embedUrl || ""
                    )}"
                    data-title="${escapeAttribute(
                      post.title ||
                      "Highlight"
                    )}">

                    Watch highlight

                  </button>

                </div>

              </article>

            `;

          }).join("");

      }

    }



    /*
     * MOVIES
     */

    const movies =
      posts.filter(function (post) {

        return post.type === "movie";

      });


    if (movieContainer) {

      if (movies.length === 0) {

        movieContainer.innerHTML =
          `
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

                    ${escapeHTML(
                      post.category ||
                      "MOVIE"
                    )}

                  </span>

                </div>


                <div class="movie-info">

                  <h3>

                    ${escapeHTML(
                      post.title ||
                      "Movie"
                    )}

                  </h3>


                  <p>

                    ${formatPostDate(
                      post.publishedAt
                    )}

                  </p>


                  <button
                    data-url="${escapeAttribute(
                      post.embedUrl || ""
                    )}"
                    data-title="${escapeAttribute(
                      post.title ||
                      "Movie"
                    )}">

                    View

                  </button>

                </div>

              </article>

            `;

          }).join("");

      }

    }



    /*
     * CONNECT VIDEO BUTTONS
     */

    document
      .querySelectorAll("[data-url]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const url =
              this.getAttribute(
                "data-url"
              );


            const title =
              this.getAttribute(
                "data-title"
              );


            openEmbed(
              title,
              url
            );

          }
        );

      });

  }



  /*
   * VIDEO MODAL
   */

  window.openEmbed =
    function (title, url) {

      const modal =
        document.getElementById(
          "embedModal"
        );

      const modalTitle =
        document.getElementById(
          "modalTitle"
        );

      const embedArea =
        document.getElementById(
          "embedArea"
        );


      if (!modal) return;


      modalTitle.textContent =
        title || "Video";


      if (url) {

        embedArea.innerHTML = `

          <iframe
            src="${escapeAttribute(url)}"
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



  /*
   * CLOSE VIDEO MODAL
   */

  window.closeEmbed =
    function () {

      const modal =
        document.getElementById(
          "embedModal"
        );

      const embedArea =
        document.getElementById(
          "embedArea"
        );


      if (!modal) return;


      modal.classList.remove(
        "open"
      );


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
    document.getElementById(
      "menuToggle"
    );

  const mainNav =
    document.getElementById(
      "mainNav"
    );


  if (menuToggle && mainNav) {

    menuToggle.addEventListener(
      "click",
      function () {

        mainNav.classList.toggle(
          "open"
        );


        menuToggle.setAttribute(
          "aria-expanded",
          mainNav.classList.contains(
            "open"
          )
        );

      }
    );

  }



  /*
   * COPYRIGHT YEAR
   */

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }



  /*
   * BASIC HTML SAFETY
   */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function escapeAttribute(value) {

    return escapeHTML(value);

  }


  function showError(
    container,
    message
  ) {

    if (!container) return;

    container.innerHTML = `
      <div class="empty-posts">
        ${escapeHTML(message)}
      </div>
    `;

  }


  /*
   * START
   */

  loadPosts();

});
```
