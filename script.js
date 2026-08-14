```javascript
/* =========================================
   DEEPROWSS + SUPABASE
========================================= */

var SUPABASE_URL =
  "https://idffyqrbtewmtkwumcbv.supabase.co";

var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkZmZ5cXJidGV3bXRrd3VtY2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MjA3ODksImV4cCI6MjEwMjI5Njc4OX0.ByKaQRAMmHSKzTqVOrRF7qdScqSa-7mqbA0MfhVHysU";

var supabaseClient = null;

if (window.supabase) {

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

}



/* =========================================
   MAIN
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    var liveContainer =
      document.getElementById("livePosts");

    var highlightContainer =
      document.getElementById("highlightPosts");

    var movieContainer =
      document.getElementById("moviePosts");


    console.log(
      "Deeprowss script loaded"
    );


    /* =====================================
       LOAD POSTS
    ===================================== */

    var xhr =
      new XMLHttpRequest();


    xhr.open(
      "GET",
      "posts.json?v=" +
        new Date().getTime(),
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


            console.log(
              "Deeprowss posts loaded:",
              posts
            );


            /* Newest posts first */

            posts.sort(
              function (a, b) {

                return (
                  new Date(
                    b.publishedAt
                  ).getTime() -

                  new Date(
                    a.publishedAt
                  ).getTime()
                );

              }
            );


            displayLivePosts(
              posts
            );

            displayHighlightPosts(
              posts
            );

            displayMoviePosts(
              posts
            );


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


    xhr.onerror =
      function () {

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

    function formatPostDate(
      dateString
    ) {

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
       CREATE STABLE POST ID
    ===================================== */

    function getPostId(post) {

      if (post.id) {
        return String(post.id);
      }


      var parts = [

        post.type || "",

        post.title || "",

        post.home || "",

        post.away || "",

        post.publishedAt || ""

      ];


      return parts
        .join("-")
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        );

    }



    /* =====================================
       ESCAPE HTML
    ===================================== */

    function escapeHTML(
      value
    ) {

      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }


      return String(value)
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        );

    }



    /* =====================================
       FOOTBALL LIVE
    ===================================== */

    function displayLivePosts(
      posts
    ) {

      if (!liveContainer) {
        return;
      }


      var livePosts =
        posts.filter(
          function (post) {

            return post.type === "live";

          }
        );


      if (
        livePosts.length === 0
      ) {

        liveContainer.innerHTML =
          '<div class="empty-posts">' +
          'No football posts yet.' +
          '</div>';

        return;

      }


      var html = "";


      livePosts.forEach(
        function (post) {

          var statusClass =
            post.status === "LIVE"
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

                'class="watch-btn" ' +

                'data-url="' +
                  escapeHTML(
                    post.embedUrl ||
                    ""
                  ) +
                '" ' +

                'data-title="' +
                  escapeHTML(
                    post.title ||
                    (
                      (post.home || "Team 1") +
                      " vs " +
                      (post.away || "Team 2")
                    )
                  ) +
                '" ' +

                'data-post-id="' +
                  escapeHTML(
                    getPostId(post)
                  ) +
                '">' +

                'Watch' +

              '</button>' +

            '</article>';

        }
      );


      liveContainer.innerHTML =
        html;


      attachVideoButtons();

    }



    /* =====================================
       HIGHLIGHTS
    ===================================== */

    function displayHighlightPosts(
      posts
    ) {

      if (!highlightContainer) {
        return;
      }


      var highlights =
        posts.filter(
          function (post) {

            return post.type === "highlight";

          }
        );


      if (
        highlights.length === 0
      ) {

        highlightContainer.innerHTML =
          '<div class="empty-posts">' +
          'No highlights yet.' +
          '</div>';

        return;

      }


      var html = "";


      highlights.forEach(
        function (post) {

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

                  'data-url="' +
                    escapeHTML(
                      post.embedUrl ||
                      ""
                    ) +
                  '" ' +

                  'data-title="' +
                    escapeHTML(
                      post.title ||
                      "Highlight"
                    ) +
                  '" ' +

                  'data-post-id="' +
                    escapeHTML(
                      getPostId(post)
                    ) +
                  '">' +

                  'Watch highlight' +

                '</button>' +

              '</div>' +

            '</article>';

        }
      );


      highlightContainer.innerHTML =
        html;


      attachVideoButtons();

    }



    /* =====================================
       MOVIES
    ===================================== */

    function displayMoviePosts(
      posts
    ) {

      if (!movieContainer) {
        return;
      }


      var movies =
        posts.filter(
          function (post) {

            return post.type === "movie";

          }
        );


      if (
        movies.length === 0
      ) {

        movieContainer.innerHTML =
          '<div class="empty-posts">' +
          'No movies yet.' +
          '</div>';

        return;

      }


      var html = "";


      movies.forEach(
        function (post) {

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
                    post.title ||
                    "Movie"
                  ) +
                '</h3>' +


                '<p>' +
                  formatPostDate(
                    post.publishedAt
                  ) +
                '</p>' +


                '<button ' +

                  'data-url="' +
                    escapeHTML(
                      post.embedUrl ||
                      ""
                    ) +
                  '" ' +

                  'data-title="' +
                    escapeHTML(
                      post.title ||
                      "Movie"
                    ) +
                  '" ' +

                  'data-post-id="' +
                    escapeHTML(
                      getPostId(post)
                    ) +
                  '">' +

                  'View' +

                '</button>' +

              '</div>' +

            '</article>';

        }
      );


      movieContainer.innerHTML =
        html;


      attachVideoButtons();

    }



    /* =====================================
       VIDEO BUTTONS
    ===================================== */

    function attachVideoButtons() {

      var buttons =
        document.querySelectorAll(
          "[data-url]"
        );


      for (
        var i = 0;
        i < buttons.length;
        i++
      ) {

        buttons[i].onclick =
          function () {

            var url =
              this.getAttribute(
                "data-url"
              );


            var title =
              this.getAttribute(
                "data-title"
              );


            var postId =
              this.getAttribute(
                "data-post-id"
              );


            openEmbed(
              title,
              url,
              postId
            );

          };

      }

    }



    /* =====================================
       VIDEO MODAL
    ===================================== */

    window.openEmbed =
      function (
        title,
        url,
        postId
      ) {

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
          return;
        }


        if (modalTitle) {

          modalTitle.textContent =
            title ||
            "Video";

        }


        embedArea.innerHTML =
          "";


        /* =================================
           CREATE VIDEO IFRAME
        ================================= */

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
            "autoplay; fullscreen; encrypted-media"
          );


          iframe.setAttribute(
            "loading",
            "lazy"
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


          embedArea.appendChild(
            iframe
          );

        } else {

          embedArea.innerHTML =

            '<div class="embed-placeholder">' +

              '<strong>' +
                'Video not available yet' +
              '</strong>' +

              '<p>' +
                'Add an authorized external ' +
                'embed URL to this post.' +
              '</p>' +

            '</div>';

        }



        /* =================================
           REMOVE OLD COMMENTS / CONTROLS
        ================================= */

        var oldComments =
          modal.querySelector(
            ".comments-section"
          );


        if (oldComments) {
          oldComments.remove();
        }


        var oldControls =
          modal.querySelector(
            ".video-controls"
          );


        if (oldControls) {
          oldControls.remove();
        }



        /* =================================
           FULLSCREEN CONTROLS
        ================================= */

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



        /* =================================
           COMMENTS SECTION
        ================================= */

        createCommentsSection(
          modal,
          postId
        );



        /* =================================
           OPEN MODAL
        ================================= */

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
       COMMENTS SECTION
    ===================================== */

    function createCommentsSection(
      modal,
      postId
    ) {

      if (!modal) {
        return;
      }


      var commentsSection =
        document.createElement(
          "section"
        );


      commentsSection.className =
        "comments-section";


      commentsSection.innerHTML =

        '<div class="comments-header">' +

          '<h3>Comments</h3>' +

          '<span class="comment-count">' +
            '0' +
          '</span>' +

        '</div>' +


        '<div class="comments-list">' +

          '<div class="comments-loading">' +
            'Loading comments...' +
          '</div>' +

        '</div>' +


        '<div class="comment-form">' +

          '<input ' +
            'type="text" ' +
            'class="comment-name" ' +
            'placeholder="Your name" ' +
            'maxlength="30" ' +
            'autocomplete="name">' +

          '<textarea ' +
            'class="comment-text" ' +
            'placeholder="Write a comment..." ' +
            'maxlength="500" ' +
            'rows="3">' +
          '</textarea>' +

          '<button ' +
            'type="button" ' +
            'class="comment-submit">' +
            'Post comment' +
          '</button>' +

          '<div class="comment-message"></div>' +

        '</div>';


      modal.querySelector(
        ".modal-box"
      ).appendChild(
        commentsSection
      );


      var list =
        commentsSection.querySelector(
          ".comments-list"
        );


      var count =
        commentsSection.querySelector(
          ".comment-count"
        );


      var nameInput =
        commentsSection.querySelector(
          ".comment-name"
        );


      var textInput =
        commentsSection.querySelector(
          ".comment-text"
        );


      var submitButton =
        commentsSection.querySelector(
          ".comment-submit"
        );


      var message =
        commentsSection.querySelector(
          ".comment-message"
        );


      if (!supabaseClient) {

        list.innerHTML =
          '<div class="comments-loading">' +
          'Comments are temporarily unavailable.' +
          '</div>';

        return;

      }


      if (!postId) {

        list.innerHTML =
          '<div class="comments-loading">' +
          'Comments are unavailable for this post.' +
          '</div>';

        return;

      }



      /* =================================
         LOAD COMMENTS
      ================================= */

      loadComments(
        postId,
        list,
        count
      );



      /* =================================
         POST COMMENT
      ================================= */

      submitButton.onclick =
        async function () {

          var name =
            nameInput.value
              .trim();


          var comment =
            textInput.value
              .trim();


          if (!name) {

            message.textContent =
              "Please enter your name.";

            nameInput.focus();

            return;

          }


          if (!comment) {

            message.textContent =
              "Please write a comment.";

            textInput.focus();

            return;

          }


          if (
            name.length > 30
          ) {

            message.textContent =
              "Your name is too long.";

            return;

          }


          if (
            comment.length > 500
          ) {

            message.textContent =
              "Your comment is too long.";

            return;

          }


          submitButton.disabled =
            true;


          submitButton.textContent =
            "Posting...";


          message.textContent =
            "";


          try {

            var result =
              await supabaseClient
                .from("comments")
                .insert([
                  {
                    post_id:
                      postId,

                    name:
                      name,

                    comment:
                      comment
                  }
                ])
                .select()
                .single();


            if (result.error) {
              throw result.error;
            }


            nameInput.value =
              "";

            textInput.value =
              "";


            message.textContent =
              "Comment posted.";


            await loadComments(
              postId,
              list,
              count
            );


          } catch (error) {

            console.error(
              "Comment error:",
              error
            );


            message.textContent =
              "Unable to post comment. Please try again.";

          }


          submitButton.disabled =
            false;


          submitButton.textContent =
            "Post comment";

        };

    }



    /* =====================================
       LOAD COMMENTS FROM SUPABASE
    ===================================== */

    async function loadComments(
      postId,
      list,
      count
    ) {

      if (!supabaseClient) {
        return;
      }


      try {

        var result =
          await supabaseClient
            .from("comments")
            .select(
              "id, name, comment, created_at"
            )
            .eq(
              "post_id",
              postId
            )
            .order(
              "created_at",
              {
                ascending: false
              }
            );


        if (result.error) {
          throw result.error;
        }


        var comments =
          result.data || [];


        if (count) {

          count.textContent =
            comments.length;

        }


        if (
          comments.length === 0
        ) {

          list.innerHTML =

            '<div class="no-comments">' +

              'No comments yet. ' +
              'Be the first to comment.' +

            '</div>';

          return;

        }


        var html = "";


        comments.forEach(
          function (item) {

            html +=

              '<div class="comment-item">' +

                '<div class="comment-avatar">' +
                  escapeHTML(
                    (
                      item.name ||
                      "?"
                    )
                    .charAt(0)
                    .toUpperCase()
                  ) +
                '</div>' +

                '<div class="comment-body">' +

                  '<div class="comment-top">' +

                    '<strong>' +
                      escapeHTML(
                        item.name
                      ) +
                    '</strong>' +

                    '<span>' +
                      formatPostDate(
                        item.created_at
                      ) +
                    '</span>' +

                  '</div>' +

                  '<p>' +
                    escapeHTML(
                      item.comment
                    ) +
                  '</p>' +

                '</div>' +

              '</div>';

          }
        );


        list.innerHTML =
          html;


      } catch (error) {

        console.error(
          "Could not load comments:",
          error
        );


        list.innerHTML =

          '<div class="comments-loading">' +

            'Unable to load comments right now.' +

          '</div>';

      }

    }



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

          if (
            !document.fullscreenElement
          ) {

            if (
              modalBox.requestFullscreen
            ) {

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

              } catch (
                orientationError
              ) {

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


        if (
          document.fullscreenElement
        ) {

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


        var comments =
          modal.querySelector(
            ".comments-section"
          );


        if (comments) {
          comments.remove();
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
            event.target.classList.contains(
              "modal-backdrop"
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

  }
);
```
