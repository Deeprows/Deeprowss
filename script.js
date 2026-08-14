const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const search = document.getElementById("siteSearch");
const noResults = document.getElementById("noResults");

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
});

mainNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => mainNav.classList.remove("open"));
});

search?.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  const cards = [...document.querySelectorAll("[data-search]")];
  let visible = 0;

  cards.forEach(card => {
    const match = !query || card.dataset.search.toLowerCase().includes(query);
    card.style.display = match ? "" : "none";
    if (match) visible++;
  });

  noResults.style.display = query && visible === 0 ? "block" : "none";
});

function openEmbed(title, url) {
  const modal = document.getElementById("embedModal");
  const titleEl = document.getElementById("modalTitle");
  const area = document.getElementById("embedArea");

  titleEl.textContent = title;

  if (url && !url.includes("PASTE-YOUR-EMBED-URL-HERE")) {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    area.replaceChildren(iframe);
  } else {
    area.innerHTML = `
      <div class="embed-placeholder">
        <strong>External video embed placeholder</strong>
        Add your authorized video/embed URL in the HTML, then this area will display the external player.
      </div>`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeEmbed() {
  const modal = document.getElementById("embedModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("embedArea").replaceChildren();
  document.body.style.overflow = "";
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeEmbed();
});

document.getElementById("year").textContent = new Date().getFullYear();
