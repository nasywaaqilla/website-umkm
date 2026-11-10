"use strict";
console.log("P10 JavaScript aktif");

const produkUmkm = [
    { id: 1, nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 18000, stok: 24, isUnggulan: true, diskonPersen: 0, gambar: "assets/images/kopi_tubruk_signature.webp", deskripsi: "Seduhan tradisional yang pekat, khas nusantara." },
    { id: 2, nama: "Cold Brew Aren", kategori: "Kopi", harga: 22000, stok: 4, isUnggulan: false, diskonPersen: 10, gambar: "assets/images/cold_brew_aren.webp", deskripsi: "Kopi seduh dingin 12 jam dengan gula aren asli." },
    { id: 3, nama: "Choco Regal Creamy", kategori: "Non-Kopi", harga: 20000, stok: 0, isUnggulan: false, diskonPersen: 0, gambar: "assets/images/choco_regal.webp", deskripsi: "Coklat belgian dan susu segar dengan taburan biskuit Regal." },
    { id: 4, nama: "Kopi Susu Gula Aren", kategori: "Kopi", harga: 25000, stok: 12, isUnggulan: true, diskonPersen: 15, gambar: "assets/images/kopi_susu_aren.webp", deskripsi: "Espresso, susu segar, dan gula aren asli." }
];

function formatRupiah(nilai) {
    const angka = Number(nilai);
    if (!Number.isFinite(angka)) {
        return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka).replace(/\u00a0/g, " ");
}

function hitungHargaAkhir(harga, diskonPersen = 0) {
    const persen = Math.min(Math.max(Number(diskonPersen) || 0, 0), 100);
    return Math.round(harga - (harga * persen) / 100);
}

function statusStok(stok) {
    if (stok <= 0) {
        return { label: "Habis", class: "stok-habis" };
    }
    if (stok <= 5) {
        return { label: "Stok terbatas", class: "stok-terbatas" };
    }
    return { label: "Tersedia", class: "stok-tersedia" };
}

function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);
    const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
    const adaDiskon = hargaAkhir < produk.harga;

    const badgeUnggulan = produk.isUnggulan
        ? '<span class="badge-unggulan">Unggulan</span>'
        : "";

    const blokHarga = adaDiskon
        ? `<p class="price">
             <s class="price-old">${formatRupiah(produk.harga)}</s>
             <span class="price-promo">${formatRupiah(hargaAkhir)}</span>
             <span class="discount-tag">-${produk.diskonPersen}%</span>
           </p>`
        : `<p class="price">${formatRupiah(produk.harga)}</p>`;

    return `
      <article class="js-product-card" data-id="${produk.id}">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p class="category-note">${produk.kategori} &middot; ${produk.deskripsi}</p>
        ${blokHarga}
        <span class="stock-badge ${status.class}">${status.label}</span>
        <p>Sisa stok: ${produk.stok}</p>
      </article>
    `;
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");

    if (!grid || !ringkasan || !unggulan) {
        console.warn("Target render produk tidak ditemukan; render dilewati.");
        return;
    }

    console.table(produkUmkm);

    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    console.log("Jumlah data awal:", produkUmkm.length, "| tersedia:", produkTersedia.length);

    const daftarKartu = produkTersedia.map(buatKartuProduk);
    console.log("Jumlah kartu HTML:", daftarKartu.length);

    const produkUnggulan = produkTersedia.find((produk) => produk.isUnggulan === true);
    console.log("Produk unggulan:", produkUnggulan);

    let totalStok = 0;
    let nilaiPersediaan = 0;
    for (const produk of produkTersedia) {
        const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
        totalStok += produk.stok;
        nilaiPersediaan += hargaAkhir * produk.stok;
        console.log(`[hitung] ${produk.nama}: harga akhir ${hargaAkhir} x stok ${produk.stok}`);
    }
    console.log("Total stok:", totalStok, "| Nilai persediaan:", nilaiPersediaan);

    grid.innerHTML = daftarKartu.join("");
    ringkasan.textContent =
        `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data. ` +
        `Total stok ${totalStok} gelas, nilai persediaan ${formatRupiah(nilaiPersediaan)}.`;

    if (produkUnggulan) {
        unggulan.textContent = `Produk unggulan: ${produkUnggulan.nama}`;
    } else {
        unggulan.textContent = "Belum ada produk unggulan.";
    }
}

document.addEventListener("DOMContentLoaded", renderProduk);