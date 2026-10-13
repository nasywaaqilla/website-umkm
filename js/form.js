const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const previewDefault = "Data form akan muncul setelah tombol dikirim.";

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const telepon = data.get("telepon") || "-";
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${telepon}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu Kontak: ${data.get("waktu")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");
});

// Tombol Reset Form (.form-actions) juga mengosongkan preview
form.addEventListener("reset", () => {
  preview.textContent = previewDefault;
});