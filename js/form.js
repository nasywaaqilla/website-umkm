"use strict";

const STORAGE_KEY = "kopi-nusa-preferensi-kontak";
const PREVIEW_AWAL = "Data form akan muncul setelah tombol dikirim.";

const PILIHAN = {
  paket: ["rumahan", "kantor", "reseller"],
  topik: ["produk", "pesanan", "kerja-sama"],
  waktu: ["pagi", "siang", "sore", "kapan-saja"],
};

const PESAN_ERROR = {
  nama: {
    valueMissing: "Nama wajib diisi.",
    tooShort: "Nama minimal 3 karakter.",
  },
  email: {
    valueMissing: "Email wajib diisi.",
    typeMismatch: "Format email belum benar, contoh: kopi@contoh.com.",
  },
  telepon: {
    patternMismatch: "Format nomor telepon belum sesuai. Awali dengan 0, 10-13 digit, tanpa spasi atau tanda hubung.",
  },
  paket: {
    valueMissing: "Pilih paket yang diminati.",
  },
  pesan: {
    valueMissing: "Pesan wajib diisi.",
    tooShort: "Pesan minimal 20 karakter.",
  },
  setuju: {
    valueMissing: "Konfirmasi persetujuan wajib dicentang.",
  },
};

const FIELD_IDS = ["nama", "email", "telepon", "paket", "pesan", "setuju"];

const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const preferensiStatus = document.querySelector("#preferensi-status");
const preferensiFeedback = document.querySelector("#preferensi-feedback");
const tombolSimpan = document.querySelector("#simpan-preferensi");
const tombolHapus = document.querySelector("#hapus-preferensi");
const fields = FIELD_IDS.map((id) => document.querySelector(`#${id}`)).filter(Boolean);
const topikInputs = document.querySelectorAll('input[name="topik"]');
const topikError = document.querySelector("#topik-error");

function setPesan(elemen, teks, sukses = false) {
  if (!elemen) return;
  elemen.textContent = teks;
  elemen.classList.toggle("success", sukses && teks !== "");
}

function getFieldError(field) {
  const aturan = PESAN_ERROR[field.id] || {};
  const validity = field.validity;

  const kosongSetelahTrim =
    field.required && field.type !== "checkbox" && field.tagName !== "SELECT" && field.value.trim() === "";

  if (validity.valueMissing || kosongSetelahTrim) return aturan.valueMissing || "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return aturan.typeMismatch || "Format data belum sesuai.";
  if (validity.tooShort) return aturan.tooShort || `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return aturan.patternMismatch || "Format belum sesuai contoh yang diminta.";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);

  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const topikValid = Array.from(topikInputs).some((input) => input.checked);
  const pesan = topikValid ? "" : "Pilih topik pertanyaan.";

  topikInputs.forEach((input) => {
    input.setAttribute("aria-invalid", topikValid ? "false" : "true");
  });

  setPesan(topikError, pesan);
  return topikValid;
}

function fokusKeFieldInvalidPertama() {
  if (!form) return;

  const pertama = Array.from(form.elements).find(
    (el) => el.willValidate && !el.validity.valid
  );

  if (pertama) {
    pertama.focus();
  }
}

function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Telepon: ${data.get("telepon") || "-"}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu kontak: ${data.get("waktu")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  setPesan(formFeedback, "Form valid. Preview berhasil dibuat.", true);
}

function perbaruiInfoPreferensi(preferensi) {
  if (!preferensiStatus) return;

  if (!preferensi) {
    preferensiStatus.textContent = "Belum ada preferensi kontak yang tersimpan di browser ini.";
    return;
  }

  preferensiStatus.textContent =
    `Preferensi tersimpan: Paket "${preferensi.paket || "-"}" · ` +
    `Topik "${preferensi.topik || "-"}" · Waktu "${preferensi.waktu || "-"}"`;
}

function bacaPreferensiTersimpan() {
  try {
    const mentah = localStorage.getItem(STORAGE_KEY);
    if (mentah === null) return null;

    const data = JSON.parse(mentah);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Bentuk data preferensi tidak valid.");
    }

    return {
      paket: PILIHAN.paket.includes(data.paket) ? data.paket : "",
      topik: PILIHAN.topik.includes(data.topik) ? data.topik : "",
      waktu: PILIHAN.waktu.includes(data.waktu) ? data.waktu : "kapan-saja",
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    };
  } catch (error) {
    console.warn("Preferensi tidak valid, data lama dihapus.", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (removeError) {
      console.warn("Storage tidak bisa diakses.", removeError);
    }
    return null;
  }
}

function terapkanPreferensiKeForm(preferensi) {
  const paketSelect = document.querySelector("#paket");
  if (paketSelect) {
    paketSelect.value = preferensi.paket;
  }

  topikInputs.forEach((input) => {
    input.checked = input.value === preferensi.topik;
  });

  const waktu = document.querySelector(`input[name="waktu"][value="${preferensi.waktu}"]`);
  if (waktu) {
    waktu.checked = true;
  }
}

function muatPreferensi() {
  const preferensi = bacaPreferensiTersimpan();

  if (preferensi) {
    terapkanPreferensiKeForm(preferensi);
  }

  perbaruiInfoPreferensi(preferensi);
}

function simpanPreferensi() {
  const data = new FormData(form);
  const paket = String(data.get("paket") || "");
  const topik = String(data.get("topik") || "");
  const waktu = String(data.get("waktu") || "kapan-saja");

  if (!paket && !topik) {
    setPesan(preferensiFeedback, "Pilih paket atau topik terlebih dahulu sebelum menyimpan preferensi.");
    return;
  }

  const preferensi = {
    paket: PILIHAN.paket.includes(paket) ? paket : "",
    topik: PILIHAN.topik.includes(topik) ? topik : "",
    waktu: PILIHAN.waktu.includes(waktu) ? waktu : "kapan-saja",
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    perbaruiInfoPreferensi(preferensi);
    setPesan(preferensiFeedback, "Preferensi berhasil disimpan di browser ini.", true);
  } catch (error) {
    console.warn("Preferensi gagal disimpan.", error);
    setPesan(preferensiFeedback, "Preferensi tidak dapat disimpan di browser ini.");
  }
}

function hapusPreferensi() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Preferensi gagal dihapus.", error);
    setPesan(preferensiFeedback, "Preferensi tidak dapat dihapus di browser ini.");
    return;
  }

  terapkanPreferensiKeForm({ paket: "", topik: "", waktu: "kapan-saja" });
  fields.forEach((field) => tampilkanError(field, ""));
  validasiTopikBersih();
  perbaruiInfoPreferensi(null);
  setPesan(preferensiFeedback, "Preferensi berhasil dihapus.", true);

  document.dispatchEvent(new CustomEvent("preferensi:dihapus"));
}

function validasiTopikBersih() {
  topikInputs.forEach((input) => input.setAttribute("aria-invalid", "false"));
  setPesan(topikError, "");
}

if (form && preview && formFeedback) {
  muatPreferensi();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const hasilField = fields.map((field) => validasiField(field));
    const topikValid = validasiTopik();
    const semuaValid = hasilField.every(Boolean) && topikValid;

    if (!semuaValid || !form.checkValidity()) {
      setPesan(formFeedback, "Periksa kembali bagian yang ditandai.");
      preview.textContent = PREVIEW_AWAL;
      form.reportValidity();
      fokusKeFieldInvalidPertama();
      return;
    }

    tampilkanPreview();
  });

  fields.forEach((field) => {
    const namaEvent = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(namaEvent, () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validasiField(field);
      }
    });
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        validasiTopik();
      }
    });
  });

  form.addEventListener("reset", () => {
    fields.forEach((field) => tampilkanError(field, ""));
    validasiTopikBersih();
    setPesan(formFeedback, "");
    preview.textContent = PREVIEW_AWAL;
  });

  if (tombolSimpan) {
    tombolSimpan.addEventListener("click", simpanPreferensi);
  }

  if (tombolHapus) {
    tombolHapus.addEventListener("click", hapusPreferensi);
  }
}