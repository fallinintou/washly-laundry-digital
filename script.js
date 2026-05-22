let selectedService = {
  name: "Cuci Kering",
  price: 6000,
  days: 2
};

let transactions = JSON.parse(localStorage.getItem("washlyTransactions")) || [];
let currentReceipt = null;

function login() {
  const pin = document.getElementById("pinInput").value;
  const error = document.getElementById("loginError");

  if (pin === "1234") {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("appScreen").classList.remove("hidden");
    error.textContent = "";
    updateDashboard();
    renderOrders();
  } else {
    error.textContent = "PIN salah. Gunakan PIN demo: 1234";
  }
}

function logout() {
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("appScreen").classList.add("hidden");
  document.getElementById("pinInput").value = "";
}

function showPage(pageId, button) {
  const pages = document.querySelectorAll(".page");
  const buttons = document.querySelectorAll(".menu-tabs button");

  pages.forEach(page => page.classList.add("hidden"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(pageId).classList.remove("hidden");
  button.classList.add("active");

  if (pageId === "orderPage") {
    renderOrders();
  }
}

function selectService(button, name, price, days) {
  const serviceButtons = document.querySelectorAll(".service-card");

  serviceButtons.forEach(btn => btn.classList.remove("active-service"));
  button.classList.add("active-service");

  selectedService = {
    name: name,
    price: price,
    days: days
  };

  document.getElementById("selectedServiceText").textContent = name;
  calculateTotal();
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
}

function calculateTotal() {
  const weight = parseFloat(document.getElementById("weight").value) || 0;
  const paidAmount = parseInt(document.getElementById("paidAmount").value) || 0;

  const total = weight * selectedService.price;
  const change = paidAmount - total;

  document.getElementById("totalPrice").textContent = formatRupiah(total);
  document.getElementById("changeAmount").textContent = change >= 0 ? formatRupiah(change) : "Uang kurang";

  const estimate = new Date();
  estimate.setDate(estimate.getDate() + selectedService.days);

  document.getElementById("estimateDate").textContent = estimate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function generateInvoice() {
  const date = new Date();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return "WSL-" +
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    "-" +
    randomNumber;
}

function generatePickupCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AMBIL-";

  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

function saveTransaction(event) {
  event.preventDefault();

  const customerName = document.getElementById("customerName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const weight = parseFloat(document.getElementById("weight").value);
  const paidAmount = parseInt(document.getElementById("paidAmount").value);

  const total = weight * selectedService.price;
  const change = paidAmount - total;

  if (change < 0) {
    alert("Uang pelanggan belum cukup.");
    return;
  }

  const estimate = new Date();
  estimate.setDate(estimate.getDate() + selectedService.days);

  const transaction = {
    id: Date.now(),
    invoice: generateInvoice(),
    pickupCode: generatePickupCode(),
    customerName: customerName,
    phoneNumber: phoneNumber,
    serviceName: selectedService.name,
    servicePrice: selectedService.price,
    weight: weight,
    total: total,
    paidAmount: paidAmount,
    change: change,
    estimateDate: estimate.toISOString(),
    status: "Diproses",
    createdAt: new Date().toISOString()
  };

  transactions.unshift(transaction);
  localStorage.setItem("washlyTransactions", JSON.stringify(transactions));

  currentReceipt = transaction;

  resetForm();
  updateDashboard();
  renderOrders();
  showReceipt(transaction);
}

function resetForm() {
  document.getElementById("customerName").value = "";
  document.getElementById("phoneNumber").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("paidAmount").value = "";
  document.getElementById("totalPrice").textContent = "Rp0";
  document.getElementById("changeAmount").textContent = "Rp0";
  document.getElementById("estimateDate").textContent = "-";
}

function showReceipt(transaction) {
  const receiptData = document.getElementById("receiptData");
  const modal = document.getElementById("receiptModal");
  const qrcodeBox = document.getElementById("qrcode");

  currentReceipt = transaction;

  receiptData.innerHTML = `
    <div class="receipt-row">
      <span>Invoice</span>
      <b>${transaction.invoice}</b>
    </div>
    <div class="receipt-row">
      <span>Kode Ambil</span>
      <b>${transaction.pickupCode}</b>
    </div>
    <div class="receipt-row">
      <span>Nama</span>
      <b>${transaction.customerName}</b>
    </div>
    <div class="receipt-row">
      <span>No HP</span>
      <b>${transaction.phoneNumber}</b>
    </div>
    <div class="receipt-row">
      <span>Layanan</span>
      <b>${transaction.serviceName}</b>
    </div>
    <div class="receipt-row">
      <span>Berat/Item</span>
      <b>${transaction.weight}</b>
    </div>
    <div class="receipt-row">
      <span>Total</span>
      <b>${formatRupiah(transaction.total)}</b>
    </div>
    <div class="receipt-row">
      <span>Bayar</span>
      <b>${formatRupiah(transaction.paidAmount)}</b>
    </div>
    <div class="receipt-row">
      <span>Kembalian</span>
      <b>${formatRupiah(transaction.change)}</b>
    </div>
    <div class="receipt-row">
      <span>Estimasi</span>
      <b>${formatDate(transaction.estimateDate)}</b>
    </div>
    <div class="receipt-row">
      <span>Status</span>
      <b>${transaction.status}</b>
    </div>
  `;

  qrcodeBox.innerHTML = "";

  new QRCode(qrcodeBox, {
    text: transaction.pickupCode,
    width: 150,
    height: 150
  });

  modal.classList.remove("hidden");
}

function closeReceipt() {
  document.getElementById("receiptModal").classList.add("hidden");
}

function printReceipt() {
  window.print();
}

function sendWhatsApp() {
  if (!currentReceipt) return;

  let phone = currentReceipt.phoneNumber;

  if (phone.startsWith("0")) {
    phone = "62" + phone.substring(1);
  }

  const message =
    `Halo ${currentReceipt.customerName}, nota laundry Anda sudah dibuat.%0A%0A` +
    `Invoice: ${currentReceipt.invoice}%0A` +
    `Kode Pengambilan: ${currentReceipt.pickupCode}%0A` +
    `Layanan: ${currentReceipt.serviceName}%0A` +
    `Total: ${formatRupiah(currentReceipt.total)}%0A` +
    `Estimasi Selesai: ${formatDate(currentReceipt.estimateDate)}%0A%0A` +
    `Terima kasih sudah menggunakan Washly Laundry.`;

  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getStatusClass(status) {
  if (status === "Diproses") return "status-diproses";
  if (status === "Dicuci") return "status-dicuci";
  if (status === "Selesai") return "status-selesai";
  if (status === "Sudah Diambil") return "status-diambil";
}

function renderOrders() {
  const orderList = document.getElementById("orderList");
  const keyword = document.getElementById("searchOrder")?.value.toLowerCase() || "";

  const filteredTransactions = transactions.filter(item => {
    return (
      item.customerName.toLowerCase().includes(keyword) ||
      item.invoice.toLowerCase().includes(keyword) ||
      item.pickupCode.toLowerCase().includes(keyword)
    );
  });

  if (filteredTransactions.length === 0) {
    orderList.innerHTML = `
      <div class="order-card">
        <p>Belum ada order yang sesuai.</p>
      </div>
    `;
    return;
  }

  orderList.innerHTML = filteredTransactions.map(item => `
    <div class="order-card">
      <div class="order-top">
        <div>
          <h4>${item.customerName}</h4>
          <p>${item.invoice}</p>
        </div>
        <span class="status-badge ${getStatusClass(item.status)}">${item.status}</span>
      </div>

      <p><b>Layanan:</b> ${item.serviceName}</p>
      <p><b>Berat/Item:</b> ${item.weight}</p>
      <p><b>Total:</b> ${formatRupiah(item.total)}</p>
      <p><b>Kode Ambil:</b> ${item.pickupCode}</p>
      <p><b>Estimasi:</b> ${formatDate(item.estimateDate)}</p>

      <div class="order-actions">
        <button onclick="updateStatus(${item.id}, 'Diproses')">Diproses</button>
        <button onclick="updateStatus(${item.id}, 'Dicuci')">Dicuci</button>
        <button onclick="updateStatus(${item.id}, 'Selesai')">Selesai</button>
        <button onclick="showReceiptById(${item.id})">Nota</button>
      </div>
    </div>
  `).join("");
}

function updateStatus(id, newStatus) {
  transactions = transactions.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus
      };
    }

    return item;
  });

  localStorage.setItem("washlyTransactions", JSON.stringify(transactions));
  renderOrders();
  updateDashboard();
}

function showReceiptById(id) {
  const transaction = transactions.find(item => item.id === id);

  if (transaction) {
    showReceipt(transaction);
  }
}

function findPickup() {
  const code = document.getElementById("pickupCodeInput").value.trim().toLowerCase();
  const resultBox = document.getElementById("pickupResult");

  const transaction = transactions.find(item =>
    item.pickupCode.toLowerCase() === code ||
    item.invoice.toLowerCase() === code
  );

  if (!transaction) {
    resultBox.innerHTML = `
      <div class="pickup-result-card">
        <h3>Order Tidak Ditemukan</h3>
        <p>Pastikan kode pengambilan atau invoice sudah benar.</p>
      </div>
    `;
    return;
  }

  resultBox.innerHTML = `
    <div class="pickup-result-card">
      <h3>${transaction.customerName}</h3>
      <p><b>Invoice:</b> ${transaction.invoice}</p>
      <p><b>Kode Ambil:</b> ${transaction.pickupCode}</p>
      <p><b>Layanan:</b> ${transaction.serviceName}</p>
      <p><b>Total:</b> ${formatRupiah(transaction.total)}</p>
      <p><b>Status Pembayaran:</b> Lunas</p>
      <p><b>Status Laundry:</b> 
        <span class="status-badge ${getStatusClass(transaction.status)}">${transaction.status}</span>
      </p>

      <button onclick="handoverLaundry(${transaction.id})">Serahkan Laundry</button>
    </div>
  `;
}

function handoverLaundry(id) {
  updateStatus(id, "Sudah Diambil");

  const transaction = transactions.find(item => item.id === id);

  document.getElementById("pickupResult").innerHTML = `
    <div class="pickup-result-card">
      <h3>Laundry Sudah Diserahkan</h3>
      <p>Order milik <b>${transaction.customerName}</b> berhasil diperbarui menjadi <b>Sudah Diambil</b>.</p>
    </div>
  `;

  document.getElementById("pickupCodeInput").value = "";
}

function updateDashboard() {
  const totalOrder = transactions.length;
  const totalIncome = transactions.reduce((sum, item) => sum + item.total, 0);

  document.getElementById("totalOrder").textContent = totalOrder;
  document.getElementById("totalIncome").textContent = formatRupiah(totalIncome);
}

calculateTotal();