// Menangani interaksi tombol promo
const promoButton = document.querySelector("#promoButton");

promoButton.addEventListener("click", () => {
    promoButton.textContent = "Promo Aktif: Beli 2 Gratis 1!";
    promoButton.style.background = "#06d6a0";
    promoButton.style.color = "#ffffff";
    console.log("Tombol promo berhasil diklik oleh pengunjung.");
});