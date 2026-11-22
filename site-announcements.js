(function () {
  "use strict";
  const BASE = "https://raw.githubusercontent.com/Deeprows/myflutter-app/main/assets/data/";
  const TICKER_URL = BASE + "receiver_ticker.json";
  const NOTICE_URL = BASE + "receiver_notice.json";
  const STYLE_ID = "dr-site-announcements-style";
  const TICKER_ID = "dr-site-ticker";
  const NOTICE_ID = "dr-site-notice";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .dr-site-ticker-row{display:none;max-width:1180px;margin:0 auto;padding:0 16px 10px}
      .dr-site-ticker-track{height:32px;display:flex;align-items:center;overflow:hidden;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:rgba(255,255,255,.035);color:#f4f7fb}
      .dr-site-ticker-label{flex:0 0 auto;padding:0 11px;color:#ff4968;font-size:10px;font-weight:900;letter-spacing:1.2px}
      .dr-site-ticker-window{min-width:0;flex:1;overflow:hidden}
      .dr-site-ticker-text{display:inline-block;white-space:nowrap;padding-left:100%;animation:drTickerScroll 24s linear infinite;font-size:12px;font-weight:650}
      @keyframes drTickerScroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}
      .dr-site-notice-backdrop{position:fixed;inset:0;z-index:99990;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.78);backdrop-filter:blur(7px)}
      .dr-site-notice-card{position:relative;width:min(460px,100%);padding:25px 22px 20px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:#111722;color:#f4f7fb;box-shadow:0 24px 80px rgba(0,0,0,.55)}
      .dr-site-notice-kicker{margin:0 0 9px;color:#ff4968;font-size:10px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}
      .dr-site-notice-card h2{margin:0 34px 12px 0;font-size:22px;line-height:1.2}
      .dr-site-notice-message{margin:0;color:#c5ceda;font-size:14px;line-height:1.65;white-space:pre-wrap}
      .dr-site-notice-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:22px}
      .dr-site-notice-actions a,.dr-site-notice-actions button{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 16px;border:0;border-radius:9px;background:#ff1744;color:white;font:inherit;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer}
      .dr-site-notice-actions button{background:#252d3a}
      .dr-site-notice-close{position:absolute;top:12px;right:13px;width:32px;height:32px;border:0;border-radius:50%;background:#252d3a;color:#fff;font-size:21px;cursor:pointer}
      @media(min-width:900px){.dr-site-ticker-row{display:block}}
      @media(max-width:899px){.dr-site-ticker-row{display:none!important}}
      @media(prefers-reduced-motion:reduce){.dr-site-ticker-text{animation:none;padding-left:12px}}
    `;
    document.head.appendChild(style);
  }

  function fetchJson(url) {
    return fetch(url + "?v=" + Date.now(), {cache:"no-store"})
      .then(function(r){if(!r.ok) throw new Error("HTTP "+r.status);return r.json();});
  }

  function mountTicker(config) {
    const header = document.querySelector(".site-header");
    const navWrap = header && header.querySelector(".nav-wrap");
    if (!header || !navWrap || !config || config.enabled === false) return;
    let row = document.getElementById(TICKER_ID);
    if (!row) {
      row = document.createElement("div");
      row.id = TICKER_ID;
      row.className = "dr-site-ticker-row";
      row.innerHTML = '<div class="dr-site-ticker-track"><span class="dr-site-ticker-label">DEEProWSS</span><div class="dr-site-ticker-window"><span class="dr-site-ticker-text"></span></div></div>';
      navWrap.insertAdjacentElement("afterend", row);
    }
    const items = Array.isArray(config.items) ? config.items.filter(Boolean) : [];
    if (!items.length) { row.remove(); return; }
    const text = row.querySelector(".dr-site-ticker-text");
    text.textContent = items.join("   •   ");
    const speed = Math.max(12, Math.min(90, Number(config.speed) || 36));
    text.style.animationDuration = speed + "s";
  }

  function playBeep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.3);
      oscillator.onended = function(){ctx.close();};
    } catch (_) {}
  }

  function showNotice(n) {
    if (!n || n.enabled !== true || !String(n.message || "").trim()) return;
    if (n.expires && /^\d{4}-\d{2}-\d{2}$/.test(String(n.expires)) &&
        new Date(n.expires + "T23:59:59").getTime() < Date.now()) return;
    const key = "dr_pages_notice_seen";
    const noticeKey = String(n.id || n.updated_at || (n.title + "|" + n.message));
    try { if (localStorage.getItem(key) === noticeKey) return; } catch (_) {}
    if (n.popup === false) return;
    if (document.getElementById(NOTICE_ID)) return;

    const backdrop = document.createElement("div");
    backdrop.id = NOTICE_ID;
    backdrop.className = "dr-site-notice-backdrop";
    const card = document.createElement("section");
    card.className = "dr-site-notice-card";
    card.setAttribute("role","dialog");
    card.setAttribute("aria-modal","true");
    card.setAttribute("aria-labelledby","dr-site-notice-title");
    const title = document.createElement("h2");
    title.id = "dr-site-notice-title";
    title.textContent = n.title || "Deeprowss Notice";
    const message = document.createElement("p");
    message.className = "dr-site-notice-message";
    message.textContent = n.message;
    const kicker = document.createElement("p");
    kicker.className = "dr-site-notice-kicker";
    kicker.textContent = "Announcement";
    const close = document.createElement("button");
    close.type = "button"; close.className = "dr-site-notice-close";
    close.setAttribute("aria-label","Close notice"); close.textContent = "×";
    const actions = document.createElement("div");
    actions.className = "dr-site-notice-actions";
    const dismiss = document.createElement("button");
    dismiss.type = "button"; dismiss.textContent = n.ok_text || "Close";
    function finish() {
      try { localStorage.setItem(key, noticeKey); } catch (_) {}
      backdrop.remove();
    }
    close.addEventListener("click",finish);
    dismiss.addEventListener("click",finish);
    backdrop.addEventListener("click",function(e){if(e.target===backdrop)finish();});
    if (n.button_url) {
      const link = document.createElement("a");
      link.href = n.button_url; link.textContent = n.button_text || "Learn more";
      link.target = "_blank"; link.rel = "noopener noreferrer";
      actions.appendChild(link);
    }
    actions.appendChild(dismiss);
    card.append(kicker,title,message,actions,close);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    if (n.beep !== false) {
      const gesture = function() {
        playBeep();
        document.removeEventListener("pointerdown",gesture);
        document.removeEventListener("keydown",gesture);
      };
      document.addEventListener("pointerdown",gesture,{once:true});
      document.addEventListener("keydown",gesture,{once:true});
    }
  }

  function refresh() {
    fetchJson(TICKER_URL).then(mountTicker).catch(function(){});
    fetchJson(NOTICE_URL).then(showNotice).catch(function(){});
  }

  addStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",refresh,{once:true});
  } else refresh();
  window.setInterval(refresh,60000);
})();