"use strict";

const NEWSLETTER_KEY = "kopi-nusa-newsletter-optin";

const newsletterOptin = document.querySelector("#newsletter-optin");
const newsletterFeedback = document.querySelector("#newsletter-feedback");

function setFeedbackNewsletter(teks, sukses = false) {
  if (!newsletterFeedback) return;
  newsletterFeedback.textContent = teks;
  newsletterFeedback.classList.toggle("success", sukses && teks !== "");
}

function hapusDataNewsletter() {
  try {
    localStorage.removeItem(NEWSLETTER_KEY);
  } catch (error) {
    console.warn("Preferensi newsletter gagal dihapus.", error);
  }
}

function muatNewsletter() {
  try {
    const mentah = localStorage.getItem(NEWSLETTER_KEY);
    if (mentah === null) return;

    const data = JSON.parse(mentah);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Bentuk data newsletter tidak valid.");
    }

    newsletterOptin.checked = data.optIn === true;
  } catch (error) {
    console.warn("Preferensi newsletter tidak valid, data lama dihapus.", error);
    newsletterOptin.checked = false;
    hapusDataNewsletter();
  }
}

function simpanNewsletter() {
  try {
    if (newsletterOptin.checked) {
      const payload = {
        optIn: true,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(payload));
      setFeedbackNewsletter("Pilihan info promo tersimpan di browser ini.", true);
    } else {
      localStorage.removeItem(NEWSLETTER_KEY);
      setFeedbackNewsletter("Pilihan info promo dihapus dari browser ini.", true);
    }
  } catch (error) {
    console.warn("Preferensi newsletter gagal disimpan.", error);
    setFeedbackNewsletter("Pilihan tidak dapat disimpan di browser ini.");
  }
}

if (newsletterOptin) {
  muatNewsletter();

  newsletterOptin.addEventListener("change", simpanNewsletter);

  document.addEventListener("preferensi:dihapus", () => {
    newsletterOptin.checked = false;
    hapusDataNewsletter();
    setFeedbackNewsletter("");
  });
}