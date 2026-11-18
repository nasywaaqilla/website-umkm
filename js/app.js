"use strict";

console.log("P11 JavaScript aktif");

const produkUmkm = [
    { id: 1, nama: "Kopi Tubruk Signature", kategori: "Kopi", harga: 18000, stok: 24, isUnggulan: true, diskonPersen: 0, deskripsi: "Seduhan tradisional yang pekat, khas nusantara." },
    { id: 2, nama: "Cold Brew Aren", kategori: "Kopi", harga: 22000, stok: 4, isUnggulan: false, diskonPersen: 10, deskripsi: "Kopi seduh dingin 12 jam dengan gula aren asli." },
    { id: 3, nama: "Choco Regal Creamy", kategori: "Non-Kopi", harga: 20000, stok: 0, isUnggulan: false, diskonPersen: 0, deskripsi: "Coklat belgian dan susu segar dengan taburan biskuit Regal." },
    { id: 4, nama: "Kopi Susu Gula Aren", kategori: "Kopi", harga: 25000, stok: 12, isUnggulan: true, diskonPersen: 15, deskripsi: "Espresso, susu segar, dan gula aren asli." },
    { id: 5, nama: "Paket Ngopi Santai (2 Gelas)", kategori: "Bundling", harga: 40000, stok: 8, isUnggulan: true, diskonPersen: 12, deskripsi: "Bundling 1 Kopi Tubruk Signature dan 1 Kopi Susu Gula Aren." }
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
        return { label: "Habis", className: "empty" };
    }
    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }
    return { label: "Tersedia", className: "" };
}

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

function perbaruiStatusSetelahSembunyi() {
    const sisa = produkGrid.querySelectorAll(".product-card").length;
    produkStatus.textContent = sisa === 0
        ? "Semua kartu disembunyikan. Klik tombol filter untuk menampilkan lagi."
        : `${sisa} produk ditampilkan (sebagian kartu disembunyikan sementara).`;
}

function buatElemenProduk(produk) {
    const card = document.createElement("article");
    card.classList.add("product-card");

    const title = document.createElement("h3");
    title.textContent = produk.nama;
    const category = document.createElement("p");
    category.classList.add("category-note");
    category.textContent = `${produk.kategori} · ${produk.deskripsi}`;

    const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskonPersen);
    const adaDiskon = hargaAkhir < produk.harga;

    const price = document.createElement("p");
    price.classList.add("price");

    if (adaDiskon) {
        const oldPrice = document.createElement("s");
        oldPrice.classList.add("price-old");
        oldPrice.textContent = formatRupiah(produk.harga);

        const promoPrice = document.createElement("span");
        promoPrice.classList.add("price-promo");
        promoPrice.textContent = formatRupiah(hargaAkhir);

        const discountTag = document.createElement("span");
        discountTag.classList.add("discount-tag");
        discountTag.textContent = `-${produk.diskonPersen}%`;

        price.append(oldPrice, " ", promoPrice, " ", discountTag);
    } else {
        price.textContent = formatRupiah(produk.harga);
    }

    const stock = document.createElement("span");
    const status = statusStok(produk.stok);
    stock.classList.add("stock-badge");
    if (status.className) {
        stock.classList.add(status.className);
    }
    stock.textContent = status.label;

    card.append(title);
    if (produk.isUnggulan) {
        const badge = document.createElement("span");
        badge.classList.add("badge-unggulan");
        badge.textContent = "Unggulan";
        card.append(badge);
    }
    card.append(category, price, stock);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Sembunyikan";
    removeButton.classList.add("ghost-button");
    removeButton.setAttribute("aria-label", `Sembunyikan ${produk.nama}`);

    removeButton.addEventListener("click", () => {
        card.remove();
        perbaruiStatusSetelahSembunyi();
    });

    card.append(removeButton);
    return card;
}

function buatEmptyState(kategori) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
    return empty;
}

function renderProduk(kategoriAktif = "Semua") {
    if (!produkGrid || !produkStatus) {
        console.warn("Target render produk tidak ditemukan.");
        return;
    }

    const produkTampil = kategoriAktif === "Semua"
        ? produkUmkm
        : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

    produkGrid.replaceChildren();

    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(kategoriAktif));
        produkStatus.textContent = "0 produk ditemukan.";
        return;
    }

    produkTampil.forEach((produk) => {
        produkGrid.append(buatElemenProduk(produk));
    });

    produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        const kategori = tombolAktif.dataset.filter;

        tombolFilter.forEach((item) => {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
        });
        tombolAktif.classList.add("is-active");
        tombolAktif.setAttribute("aria-pressed", "true");

        renderProduk(kategori);
    });
});

renderProduk();