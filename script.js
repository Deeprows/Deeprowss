/* =========================================================
   DEEPROWSS PUBLISHING SYSTEM
   ========================================================= */

/*
   Your GitHub repository:

   https://github.com/Deeprows/Deeprowss

   Posts are stored here:

   posts/football/
   posts/highlights/
   posts/movies/

   Add a JSON file to one of those folders and
   the homepage will automatically display it.
*/


const GITHUB_USERNAME = "Deeprows";
const GITHUB_REPOSITORY = "Deeprowss";
const GITHUB_BRANCH = "main";


const API_BASE =
  `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/posts`;


const RAW_BASE =
  `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/${GITHUB_BRANCH}/posts`;



/* =========================================================
   SETTINGS
   ========================================================= */

const POST_LIMIT = 12;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const liveContainer =
  document.getElementById("livePosts");

const highlightContainer =
  document.getElementById("highlightPosts");

const movieContainer =
  document.getElementById("moviePosts");

const searchInput =
  document.getElementById("siteSearch");

const noResults =
  document.getElementById("noResults");

const yearElement =
  document.getElementById("year");



/* =========================================================
   YEAR
   ========================================================= */

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}



/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuToggle =
  document.getElementById("menuToggle");

const mainNav =
  document.getElementById("mainNav");


if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen =
      mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

  });


  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}



/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}



/* =========================================================
   GET POSTS FROM GITHUB
   ========================================================= */

async function getPosts(folder) {

  try {

    const response = await fetch(
      `${API_BASE}/${folder}?_=${Date.now()}`,
      {
        cache: "no-store"
      }
    );


    if (!response.ok) {

      console.warn(
        `Could not load ${folder}`,
        response.status
      );

      return [];

    }


    const files =
      await response.json();


    /*
       Only use JSON files.
    */

    const jsonFiles =
      files.filter(file =>
        file.type === "file" &&
        file.name.toLowerCase().endsWith(".json")
      );


    /*
       Download each JSON file.
    */

    const posts =
      await Promise.all(

        jsonFiles.map(async file => {

          try {

            const url =
              `${RAW_BASE}/${folder}/${encodeURIComponent(file.name)}?_=${Date.now()}`;


            const postResponse =
              await fetch(
                url,
                {
                  cache: "no-store"
                }
              );


            if (!postResponse.ok) {
              return null;
            }


            const post =
              await postResponse.json();


            return {
              ...post,
              folder: folder,
              filename: file.name
            };

          }

          catch (error) {

            console.error(
              "Error loading post:",
              file.name,
              error
            );

            return null;

          }

        })

      );


    return posts.filter(Boolean);

  }

  catch (error) {

    console.error(
      `Error loading ${folder}:`,
      error
    );

    return [];

  }

}



/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {

  if (!dateValue) {
    return "";
  }


  const date =
    new Date(dateValue);


  if (Number.isNaN(date.getTime())) {
    return escapeHTML(dateValue);
  }


  return date.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );

}



/* =========================================================
   GET THUMBNAIL
   ========================================================= */

function getThumbnail(post) {

  if (
    post.thumbnail &&
    post.thumbnail.trim() !== ""
  ) {

    return `
      <img
        src="${escapeHTML(post.thumbnail)}"
        alt="${escapeHTML(post.title || "Deeprowss")}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
    `;

  }


  return `
    <div class="default-thumbnail">
      <span>▶</span>
    </div>
  `;

}



/* =========================================================
   VIDEO BUTTON
   ========================================================= */

function getWatchButton(post) {

  if (
    !post.embedUrl ||
    post.embedUrl.trim() === ""
  ) {

    return "";

  }


  return `
    <button
      class="watch-btn dynamic-watch"
      data-title="${escapeHTML(post.title || "Video")}"
      data-url="${escapeHTML(post.embedUrl)}">

      Watch

    </button>
  `;

}



/* =========================================================
   FOOTBALL CARD
   ========================================================= */

function createFootballCard(post) {

  const status =
    post.status || "UPCOMING";


  const isLive =
    status.toUpperCase() === "LIVE";


  const badge =
    isLive
      ? `<span class="live-badge">● LIVE</span>`
      : `<span class="upcoming-badge">${escapeHTML(status)}</span>`;


  return `

    <article
      class="live-card post-card"
      data-search="${escapeHTML(
        `${post.title || ""} ${post.category || ""} ${post.description || ""}`
      )}">

      <div class="match-top">

        ${badge}

        <span>
          ${escapeHTML(post.category || "Football")}
        </span>

      </div>


      <div class="teams">

        <strong>
          ${escapeHTML(post.home || post.title || "Football")}
        </strong>

        ${
          post.away
            ? `<span>vs</span>
               <strong>${escapeHTML(post.away)}</strong>`
            : ""
        }

      </div>


      <div class="match-meta">

        ${escapeHTML(post.description || "")}

        ${
          post.date
            ? `<br>${formatDate(post.date)}`
            : ""
        }

      </div>


      ${getWatchButton(post)}

    </article>

  `;

}



/* =========================================================
   HIGHLIGHT CARD
   ========================================================= */

function createHighlightCard(post) {

  return `

    <article
      class="media-card post-card"
      data-search="${escapeHTML(
        `${post.title || ""} ${post.category || ""} ${post.description || ""}`
      )}">

      <div class="media-thumb football-thumb">

        ${getThumbnail(post)}

        <span class="play">
          ▶
        </span>

      </div>


      <div class="media-info">

        <span class="tag">

          ${escapeHTML(
            post.category || "HIGHLIGHT"
          )}

        </span>


        <h3>
          ${escapeHTML(
            post.title || "Football Highlight"
          )}
        </h3>


        <p>
          ${escapeHTML(
            post.description || ""
          )}
        </p>


        ${
          post.date
            ? `<small>${formatDate(post.date)}</small>`
            : ""
        }


        ${getWatchButton(post)}

      </div>

    </article>

  `;

}



/* =========================================================
   MOVIE CARD
   ========================================================= */

function createMovieCard(post) {

  return `

    <article
      class="movie-card post-card"
      data-search="${escapeHTML(
        `${post.title || ""} ${post.category || ""} ${post.description || ""}`
      )}">

      <div class="poster">

        ${getThumbnail(post)}

        <span>
          ${escapeHTML(
            post.category || "MOVIE"
          )}
        </span>

      </div>


      <div class="movie-info">

        <h3>
          ${escapeHTML(
            post.title || "Movie"
          )}
        </h3>


        <p>

          ${
            post.date
              ? formatDate(post.date)
              : ""
          }

          ${
            post.genre
              ? ` • ${escapeHTML(post.genre)}`
              : ""
          }

        </p>


        ${getWatchButton(post)}

      </div>

    </article>

  `;

}



/* =========================================================
   SORT POSTS
   ========================================================= */

function sortPosts(posts) {

  return posts.sort((a, b) => {

    const dateA =
      new Date(
        a.date ||
        a.published ||
        a.kickoff ||
        0
      ).getTime();


    const dateB =
      new Date(
        b.date ||
        b.published ||
        b.kickoff ||
        0
      ).getTime();


    return dateB - dateA;

  });

}



/* =========================================================
   DISPLAY POSTS
   ========================================================= */

function displayPosts(
  container,
  posts,
  cardFunction
) {

  if (!container) {
    return;
  }


  if (!posts.length) {

    container.innerHTML = `

      <div class="empty-posts">

        <p>
          No posts available yet.
        </p>

      </div>

    `;

    return;

  }


  const sorted =
    sortPosts(posts);


  container.innerHTML =
    sorted
      .slice(0, POST_LIMIT)
      .map(cardFunction)
      .join("");


  attachWatchButtons();

}



/* =========================================================
   WATCH BUTTONS
   ========================================================= */

function attachWatchButtons() {

  document
    .querySelectorAll(".dynamic-watch")
    .forEach(button => {

      /*
         Prevent attaching the same event twice.
      */

      if (
        button.dataset.connected === "true"
      ) {

        return;

      }


      button.dataset.connected =
        "true";


      button.addEventListener(
        "click",
        () => {

          const title =
            button.dataset.title ||
            "Video";


          const url =
            button.dataset.url ||
            "";


          openEmbed(
            title,
            url
          );

        }
      );

    });

}



/* =========================================================
   LOAD ALL POSTS
   ========================================================= */

async function loadAllPosts() {

  try {

    if (liveContainer) {

      liveContainer.innerHTML =
        `<div class="loading">Loading football...</div>`;

    }


    if (highlightContainer) {

      highlightContainer.innerHTML =
        `<div class="loading">Loading highlights...</div>`;

    }


    if (movieContainer) {

      movieContainer.innerHTML =
        `<div class="loading">Loading movies...</div>`;

    }


    /*
       Load all three folders.
    */

    const [
      footballPosts,
      highlightPosts,
      moviePosts
    ] = await Promise.all([

      getPosts("football"),

      getPosts("highlights"),

      getPosts("movies")

    ]);


    /*
       Display them.
    */

    displayPosts(
      liveContainer,
      footballPosts,
      createFootballCard
    );


    displayPosts(
      highlightContainer,
      highlightPosts,
      createHighlightCard
    );


    displayPosts(
      movieContainer,
      moviePosts,
      createMovieCard
    );


    attachWatchButtons();


    console.log(
      "Deeprowss posts loaded:",
      {
        football: footballPosts.length,
        highlights: highlightPosts.length,
        movies: moviePosts.length
      }
    );

  }

  catch (error) {

    console.error(
      "Deeprowss loading error:",
      error
    );

  }

}



/* =========================================================
   SEARCH
   ========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      const cards =
        document.querySelectorAll(
          ".post-card"
        );


      let visibleCount = 0;


      cards.forEach(card => {

        const searchText =
          (
            card.dataset.search || ""
          ).toLowerCase();


        const matches =
          query === "" ||
          searchText.includes(query);


        card.style.display =
          matches
            ? ""
            : "none";


        if (matches) {
          visibleCount++;
        }

      });


      if (
        noResults &&
        query !== "" &&
        visibleCount === 0
      ) {

        noResults.style.display =
          "block";

      }

      else if (noResults) {

        noResults.style.display =
          "none";

      }

    }
  );

}



/* =========================================================
   VIDEO EMBED
   ========================================================= */

function openEmbed(
  title,
  url
) {

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


  if (!modal || !embedArea) {
    return;
  }


  modalTitle.textContent =
    title || "Video";


  /*
     Empty URL
  */

  if (
    !url ||
    url === "PASTE-YOUR-EMBED-URL-HERE"
  ) {

    embedArea.innerHTML = `

      <div class="embed-placeholder">

        <div class="embed-icon">
          ▶
        </div>

        <h3>
          Video coming soon
        </h3>

        <p>
          The external video embed has not
          been added yet.
        </p>

      </div>

    `;

  }

  else {

    /*
       External authorized embed.
    */

    embedArea.innerHTML = `

      <iframe
        src="${escapeHTML(url)}"
        title="${escapeHTML(title || "Video")}"
        width="100%"
        height="450"
        frameborder="0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin">
      </iframe>

    `;

  }


  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}



/* =========================================================
   CLOSE VIDEO
   ========================================================= */

function closeEmbed() {

  const modal =
    document.getElementById(
      "embedModal"
    );


  const embedArea =
    document.getElementById(
      "embedArea"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  if (embedArea) {

    embedArea.innerHTML = "";

  }


  document.body.style.overflow =
    "";

}



/* =========================================================
   ESC KEY CLOSE
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeEmbed();

    }

  }
);



/* =========================================================
   START
   ========================================================= */

loadAllPosts();
