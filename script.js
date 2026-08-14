document.addEventListener("DOMContentLoaded", function () {

var liveContainer =
document.getElementById("livePosts");

var highlightContainer =
document.getElementById("highlightPosts");

var movieContainer =
document.getElementById("moviePosts");

console.log("Deeprowss script loaded");

/* =====================================
UNIVERSAL WATCH BUTTON HANDLER

 This is delegated to DOCUMENT.

 Therefore it works for:

   - Homepage posts
   - View All pages
   - Section pages
   - Existing Watch buttons
   - Dynamically created Watch buttons
   - Future posts

 No need to run attachVideoButtons()
 after every render.

===================================== */

if (!window.deeprowssVideoHandlerAttached) {

window.deeprowssVideoHandlerAttached = true;

document.addEventListener("click", function (event) {

  var button =
    event.target.closest(
      "[data-url], [data-embed-url], [data-video-url]"
    );


  if (!button) {
    return;
  }


  /*
   * Only handle actual video controls.
   */

  var tagName =
    button.tagName
      ? button.tagName.toLowerCase()
      : "";


  var isVideoButton =
    tagName === "button" ||
    tagName === "a" ||
    button.classList.contains("watch-btn") ||
    button.classList.contains("video-btn") ||
    button.classList.contains("watch-button");


  if (!isVideoButton) {
    return;
  }


  /*
   * Do not intercept fullscreen controls.
   */

  if (
    button.classList.contains("fullscreen-btn")
  ) {
    return;
  }


  /*
   * Prevent links or other scripts from
   * hijacking the Watch click.
   */

  event.preventDefault();


  /*
   * Read all supported video URL attributes.
   */

  var url =
    button.getAttribute("data-url") ||
    button.getAttribute("data-embed-url") ||
    button.getAttribute("data-video-url") ||
    "";


  url = String(url).trim();


  /*
   * Read the video title.
   */

  var title =
    button.getAttribute("data-title") ||
    button.getAttribute("data-video-title") ||
    "";


  title = String(title).trim();


  if (!title) {

    title =
      button.textContent
        .replace(/\s+/g, " ")
        .trim() ||
      "Video";

  }


  /*
   * Do not try to open a missing URL.
   */

  if (!url) {

    console.error(
      "Deeprowss: Watch button has no video URL:",
      button
    );

    return;

  }


  console.log(
    "Deeprowss: Opening video:",
    {
      title: title,
      url: url
    }
  );


  /*
   * Use the existing modal.
   */

  openEmbed(
    title,
    url
  );

});

}




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

xhr.onreadystatechange = function () {

if (xhr.readyState !== 4) {
  return;
}


if (xhr.status >= 200 && xhr.status < 300) {

  try {

    var posts =
      JSON.parse(xhr.responseText);


    if (!Array.isArray(posts)) {

      throw new Error(
        "posts.json must contain an array of posts."
      );

    }


    console.log(
      "Deeprowss posts loaded:",
      posts
    );


    /*
     * Newest posts first.
     */

    posts.sort(function (a, b) {

      return (
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
      );

    });


    displayLivePosts(posts);

    displayHighlightPosts(posts);

    displayMoviePosts(posts);


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

}




/* =====================================
FORMAT VISITOR LOCAL TIME
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

  return date.toLocaleString();

} catch (error) {

  return date.toString();

}

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

    return (
      String(post.type || "").toLowerCase() ===
      "live"
    );

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

        'class="watch-btn" ' +

        'data-url="' +

          escapeAttribute(
            getPostVideoURL(post)
          ) +

        '" ' +

        'data-title="' +

          escapeAttribute(
            post.title || "Video"
          ) +

        '">' +

        'Watch' +

      '</button>' +

    '</article>';

});


liveContainer.innerHTML =
  html;

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

    return (
      String(post.type || "").toLowerCase() ===
      "highlight"
    );

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

      '<div class="media-thumb football-thumb">' +

        '<span class="play">' +
          '▶' +
        '</span>' +

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

          'class="watch-btn" ' +

          'data-url="' +

            escapeAttribute(
              getPostVideoURL(post)
            ) +

          '" ' +

          'data-title="' +

            escapeAttribute(
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

}




/* =====================================
MOVIES
===================================== */

function displayMoviePosts(posts) {

if (!movieContainer) {
  return;
}


var movies =
  posts.filter(function (post) {

    return (
      String(post.type || "").toLowerCase() ===
      "movie"
    );

  });


if (movies.length === 0) {

  movieContainer.innerHTML =
    '<div class="empty-posts">' +
    'No movies yet.' +
    '</div>';

  return;

}


var html = "";


movies.forEach(function (post) {

  html +=

    '<article class="movie-card">' +

      '<div class="poster poster-one">' +

        '<span>' +

          escapeHTML(
            post.category || "MOVIE"
          ) +

        '</span>' +

      '</div>' +


      '<div class="movie-info">' +

        '<h3>' +

          escapeHTML(
            post.title || "Movie"
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
              getPostVideoURL(post)
            ) +

          '" ' +

          'data-title="' +

            escapeAttribute(
              post.title || "Movie"
            ) +

          '">' +

          'View' +

        '</button>' +

      '</div>' +

    '</article>';

});


movieContainer.innerHTML =
  html;

}




/* =====================================
POST VIDEO URL

 Supports all of these:

   embedUrl
   embedURL
   videoUrl
   videoURL
   url

 The first available value is used.

===================================== */

function getPostVideoURL(post) {

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
ESCAPE HTML
===================================== */

function escapeHTML(value) {

return String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

}




/* =====================================
ESCAPE ATTRIBUTE
===================================== */

function escapeAttribute(value) {

return String(value)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

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


  if (!modal || !embedArea) {

    console.error(
      "Deeprowss: embedModal or embedArea is missing from this page."
    );

    return;

  }


  if (modalTitle) {

    modalTitle.textContent =
      title || "Video";

  }


  /*
   * Remove previous player.
   */

  embedArea.innerHTML =
    "";


  /*
   * Remove previous fullscreen controls.
   */

  var oldControls =
    modal.querySelector(
      ".video-controls"
    );


  if (oldControls) {
    oldControls.remove();
  }


  /*
   * Create video iframe.
   */

  if (url) {

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
      "loading",
      "eager"
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


    embedArea.appendChild(
      iframe
    );

  }


  /*
   * Fullscreen controls.
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


  fullscreenButton.setAttribute(
    "aria-label",
    "Tap to watch in Fullscreen"
  );


  fullscreenButton.setAttribute(
    "title",
    "Tap to watch in Fullscreen"
  );


  fullscreenButton.textContent =
    "Tap to watch in Fullscreen";


  controls.appendChild(
    fullscreenButton
  );


  embedArea.insertAdjacentElement(
    "afterend",
    controls
  );


  /*
   * Open modal.
   */

  modal.classList.add(
    "open"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

};




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


  event.preventDefault();


  var modalBox =
    button.closest(
      ".modal-box"
    ) ||
    document.querySelector(
      ".modal-box"
    );


  if (!modalBox) {
    return;
  }


  try {

    if (!document.fullscreenElement) {

      if (modalBox.requestFullscreen) {

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

      if (document.exitFullscreen) {

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


  if (document.fullscreenElement) {

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


  if (document.fullscreenElement) {

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


  var controls =
    modal.querySelector(
      ".video-controls"
    );


  if (controls) {
    controls.remove();
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

};




/* =====================================
CLOSE MODAL WITH BACKDROP
===================================== */

var modal =
document.getElementById(
"embedModal"
);

if (modal) {

modal.addEventListener(
  "click",
  function (event) {

    if (
      event.target === modal ||
      (
        event.target.classList &&
        event.target.classList.contains(
          "modal-backdrop"
        )
      )
    ) {

      closeEmbed();

    }

  }
);

}




/* =====================================
ESC KEY
===================================== */

document.addEventListener(
"keydown",
function (event) {

  if (event.key !== "Escape") {
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

    closeEmbed();

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

  };

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
