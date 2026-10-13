// Menangani interaksi tombol promo
const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Promo Aktif: Beli 2 Gratis 1!";
        // Gaya diatur lewat class di css/style.css (button.is-promo-active),
        // bukan style inline, supaya warna tetap lewat design token dan kontras aman.
        promoButton.classList.add("is-promo-active");
        console.log("Tombol promo berhasil diklik oleh pengunjung.");
    });
}