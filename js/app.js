"use strict";
console.log("P09 JavaScript aktif");

const produkUmkm = [
    {
        nama: "Kopi Tubruk Signature",
        kategori: "Kopi",
        harga: 18000,
        stok: 24, // > 5  -> Tersedia
        isUnggulan: true,
        deskripsi: "Seduhan tradisional yang pekat, khas nusantara.",
        diskonPersen: 0,
    },
    {
        nama: "Cold Brew Aren",
        kategori: "Kopi",
        harga: 22000,
        stok: 4, // 1-5 -> Terbatas
        isUnggulan: false,
        deskripsi: "Kopi seduh dingin 12 jam dengan gula aren asli.",
        diskonPersen: 10,
    },
    {
        nama: "Choco Regal Creamy",
        kategori: "Non-Kopi",
        harga: 20000,
        stok: 0, // = 0 -> Habis
        isUnggulan: false,
        deskripsi: "Coklat belgian dan susu segar dengan taburan biskuit Regal.",
        diskonPersen: 0,
    },
    {
        nama: "Kopi Susu Gula Aren",
        kategori: "Kopi",
        harga: 25000,
        stok: 12, // > 5  -> Tersedia
        isUnggulan: true,
        deskripsi: "Espresso, susu segar, dan gula aren asli.",
        diskonPersen: 15,
    },
];

const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

function hitungHargaAkhir(harga, diskonPersen = 0) {
    const persen = Number(diskonPersen);

    if (!Number.isFinite(persen) || persen <= 0) {
        return harga;
    }

    const persenValid = Math.min(persen, 100);
    return Math.round(harga - (harga * persenValid) / 100);
}

function statusStok(stok) {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    } else if (stok <= 5) {
        return { label: "Terbatas", className: "warning" };
    } else {
        return { label: "Tersedia", className: "" };
    }
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
             <s class="price-old">${formatRupiah.format(produk.harga)}</s>
             <span class="price-promo">${formatRupiah.format(hargaAkhir)}</span>
             <span class="discount-tag">-${produk.diskonPersen}%</span>
           </p>`
        : `<p class="price">${formatRupiah.format(produk.harga)}</p>`;

    return `
      <article class="js-product-card">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p>${produk.kategori} &middot; ${produk.deskripsi}</p>
        ${blokHarga}
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p>${produk.stok > 0 ? `Sisa stok: ${produk.stok}` : "Hubungi admin"}</p>
      </article>
    `;
}

function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        if (produk.stok > 0) {
            jumlahTersedia++;
        }
        markup += buatKartuProduk(produk);
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;

    console.table(
        produkUmkm.map((p) => ({
            nama: p.nama,
            kategori: p.kategori,
            harga: p.harga,
            diskonPersen: p.diskonPersen,
            hargaAkhir: hitungHargaAkhir(p.harga, p.diskonPersen),
            stok: p.stok,
            status: statusStok(p.stok).label,
            isUnggulan: p.isUnggulan,
        }))
    );
}

document.addEventListener("DOMContentLoaded", renderProduk);