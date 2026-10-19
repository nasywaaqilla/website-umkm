const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo Aktif: Beli 2 Gratis 1!";
        promoButton.classList.add("is-promo-active");
        console.log("Tombol promo berhasil diklik oleh pengunjung.");
    });
}

const nav = document.querySelector(".nav");
const navToggle = nav ? nav.querySelector(".nav-toggle") : null;
const navMenu = nav ? nav.querySelector("#menu-utama") : null;

if (nav && navToggle && navMenu) {
    const desktop = window.matchMedia("(min-width: 48rem)");

    nav.classList.add("nav-js");

    function setNavOpen(open) {
        nav.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(open));
    }

    navToggle.addEventListener("click", () => {
        setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    navMenu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setNavOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && nav.classList.contains("is-open")) {
            setNavOpen(false);
            navToggle.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!nav.contains(event.target)) {
            setNavOpen(false);
        }
    });

    desktop.addEventListener("change", (event) => {
        if (event.matches) {
            setNavOpen(false);
        }
    });
}