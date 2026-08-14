document.addEventListener("DOMContentLoaded", function () {

  const liveContainer = document.getElementById("livePosts");
  const highlightContainer = document.getElementById("highlightPosts");
  const movieContainer = document.getElementById("moviePosts");

  console.log("Deeprowss script loaded");

  fetch("posts.json?v=" + Date.now())
    .then(function (response) {

      if (!response.ok) {
        throw new Error("posts.json could not be loaded");
      }

      return response.json();

    })
    .then(function (posts) {

      console.log("Posts loaded:", posts);

      displayPosts(posts);

    })
    .catch(function (error) {

      console.error("Deeprowss error:", error);

      if (liveContainer) {
        liveContainer.innerHTML =
          '<div class="empty-posts"><p>Unable to load posts.</p></div>';
      }

    });


  function displayPosts(posts) {

    const livePosts =
      posts.filter(function (post) {
        return post.type === "live";
      });


    if (liveContainer) {

      if (livePosts.length === 0) {

        liveContainer.innerHTML =
          '<div class="empty-posts"><p>No football posts yet.</p></div>';

      } else {

        liveContainer.innerHTML =
          livePosts.map(function (post) {

            return `
              <article class="live-card post-card">

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
                  onclick="openEmbed(
                    '${post.title || "Video"}',
                    '${post.embedUrl || ""}'
                  )"
                >
                  Watch
                </button>

              </article>
            `;

          }).join("");

      }

    }

  }


  /* ==============================
     VIDEO MODAL
     ============================== */

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
            Add an authorized external embed URL
            to this post.
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


  /* ==============================
     MOBILE MENU
     ============================== */

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


  /* ==============================
     YEAR
     ============================== */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

});
