document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     1) Scroll Reveal
  ========================================================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));


/* NAVBAR: เลื่อนลงหาย เลื่อนขึ้นโผล่ */
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

/* ให้แสดงทันทีตอนโหลด */
navbar.classList.add("show");

window.addEventListener("scroll", () => {
  const y = window.pageYOffset;

  if (y > lastScroll && y > 120) {
    navbar.classList.remove("show");  // เลื่อนลง → ซ่อน
  } else if (y < lastScroll - 5) {
    navbar.classList.add("show");     // เลื่อนขึ้น → โผล่
  }

  lastScroll = y;
});






  /* =========================================================
     3) Smooth scroll for nav links
  ========================================================= */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (ev) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* =========================================================
     4) Back to Top button
  ========================================================= */
  const btnTop = document.getElementById('toTop');

  const toggleTopBtn = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (y > 150) btnTop.classList.add('show');
    else btnTop.classList.remove('show');
  };

  window.addEventListener('scroll', toggleTopBtn, { passive: true });
  toggleTopBtn();

  btnTop.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  });


  /* =========================================================
     5) Language Switch (เวอร์ชัน Smooth + ไม่ซ้ำ)
  ========================================================= */
  const langToggle = document.getElementById("langToggle");
  const html = document.documentElement;

  const savedLang = localStorage.getItem("lang") || "th";
  html.setAttribute("lang", savedLang);

  if (langToggle) langToggle.checked = (savedLang === "en");

  const setLang = () => {
    const lang = langToggle.checked ? "en" : "th";
    html.setAttribute("lang", lang);
    localStorage.setItem("lang", lang);
  };

  if (langToggle) langToggle.addEventListener("change", setLang);


  /* =========================================================
     6) Mobile Menu Toggle
  ========================================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navbar nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      nav.classList.toggle("show");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        nav.classList.remove("show");
      });
    });
  }


}); // END DOMContentLoaded



/* =========================================================
   STARFIELD — Star Shape Version
   (ดาวเป็นรูปดาวจริง ๆ ไม่ใช่วงกลม)
========================================================= */

(function () {
  const canvas = document.getElementById("bg-particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const STAR_COUNT = 80;  // ดาวน้อย ๆ แบบที่เอิงชอบ
  let stars = [];

  // วาดดาว 5 แฉก
  function drawStar(ctx, x, y, r, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, -r);

    for (let i = 0; i < 5; i++) {
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, -r * 0.4);
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, -r);
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = r * 2.5;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = Math.random() * 1.8 + 0.8;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        flickerOffset: Math.random() * 100,
        color: Math.random() > 0.88
          ? "rgba(255, 251, 0, 1)"  // ม่วงไว้บางดวง
          : "rgba(255,255,255,0.95)" // ดาวสีขาวหลัก
      });
    }
  }

  createStars();

  function draw() {
    ctx.clearRect(0, 0, w, h);

    stars.forEach((s, i) => {
      s.x += s.dx;
      s.y += s.dy;

      if (s.x < -20) s.x = w + 20;
      if (s.x > w + 20) s.x = -20;
      if (s.y < -20) s.y = h + 20;
      if (s.y > h + 20) s.y = -20;

      // flicker
      const flicker =
        0.8 + Math.sin((Date.now() + s.flickerOffset) * 0.003) * 0.3;

      drawStar(ctx, s.x, s.y, s.r * flicker, s.color);
    });

    requestAnimationFrame(draw);
  }

  draw();
})();



/* ============================== */
/*        FULL CAROUSEL JS        */
/* ============================== */

/* ===== SINGLE SLIDE CAROUSEL LOGIC ===== */

const track2 = document.querySelector(".carousel-track");
const slides2 = Array.from(track2.children);

const nextBtn2 = document.querySelector(".arrow.right");
const prevBtn2 = document.querySelector(".arrow.left");
const nav2 = document.querySelector(".carousel-nav");

let current2 = 0;

/* Create indicators */
slides2.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("indicator");
  if (i === 0) dot.classList.add("active");
  nav2.appendChild(dot);
});

const dots2 = Array.from(document.querySelectorAll(".indicator"));

function updateSlide2(index) {
  track2.style.transform = `translateX(-${index * 100}%)`;

  slides2.forEach(s => s.classList.remove("active"));
  slides2[index].classList.add("active");

  dots2.forEach(d => d.classList.remove("active"));
  dots2[index].classList.add("active");

  current2 = index;
}

/* Buttons */
nextBtn2.addEventListener("click", () => {
  let i = current2 + 1;
  if (i >= slides2.length) i = 0;
  updateSlide2(i);
});

prevBtn2.addEventListener("click", () => {
  let i = current2 - 1;
  if (i < 0) i = slides2.length - 1;
  updateSlide2(i);
});

/* Dot click */
dots2.forEach((dot, i) => {
  dot.addEventListener("click", () => updateSlide2(i));
});

/* Auto slide */
let auto2 = setInterval(() => {
  let i = current2 + 1;
  if (i >= slides2.length) i = 0;
  updateSlide2(i);
}, 3000);

/* Pause on hover */
track2.addEventListener("mouseenter", () => clearInterval(auto2));
track2.addEventListener("mouseleave", () => {
  auto2 = setInterval(() => {
    let i = current2 + 1;
    if (i >= slides2.length) i = 0;
    updateSlide2(i);
  }, 3000);
});
