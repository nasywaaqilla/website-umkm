const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo Aktif: Beli 2 Gratis 1!";
        promoButton.classList.add("is-promo-active");
        console.log("Tombol promo berhasil diklik oleh pengunjung.");
    });
}