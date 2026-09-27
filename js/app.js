/**
 * Main Application Logic & View Controllers for XANH VỊ QUÁN
 */

// Utility: Format tiền tệ VND
function formatVND(amount) {
  const clean = Math.round(Number(amount) || 0);
  return clean.toLocaleString("vi-VN") + " ₫";
}

// Utility: Format thời gian tiếng Việt
function formatDateTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " - " + 
         d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Toast Notification Manager
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColors = {
    success: "bg-emerald-600 text-white shadow-emerald-200",
    error: "bg-rose-600 text-white shadow-rose-200",
    warning: "bg-amber-500 text-white shadow-amber-200",
    info: "bg-slate-800 text-white shadow-slate-200"
  };

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };

  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/20 text-sm font-medium ${bgColors[type] || bgColors.info}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} text-lg"></i>
    <span class="flex-1">${message}</span>
    <button class="opacity-70 hover:opacity-100 text-xs ml-2" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
window.showToast = showToast;

// Biến trạng thái toàn cục cho UI
const AppState = {
  currentRoute: "home",
  activeCategory: "all",
  searchKeyword: "",
  sortBy: "default",
  filterBadge: "all",
  selectedProductForModal: null,
  appliedVoucherCode: "",
  checkoutFulfillment: "DELIVERY",
  checkoutPaymentMethod: "VIETQR",
  adminLoggedIn: false,
};

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  updateCartBadge();
  renderCategoriesFilter();
  renderProducts();
  renderFeaturedHome();
  initEventListeners();
  checkAdminSession();
});

// Router định tuyến trang SPA
function initRouter() {
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1) || "home";
    const [route, queryString] = hash.split("?");
    const params = new URLSearchParams(queryString || "");

    AppState.currentRoute = route;

    // Ẩn tất cả các trang
    document.querySelectorAll(".page-view").forEach(el => el.classList.add("hidden"));

    // Hiển thị trang tương ứng
    const target = document.getElementById(`view-${route}`);
    if (target) {
      target.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById("view-home").classList.remove("hidden");
    }

    // Xử lý các view đặc thù
    if (route === "order-confirmation") {
      const orderId = params.get("orderId");
      if (orderId) renderOrderConfirmationView(orderId);
    } else if (route === "tracking") {
      const code = params.get("code");
      const phone = params.get("phone");
      if (code && phone) {
        document.getElementById("track-code-input").value = code;
        document.getElementById("track-phone-input").value = phone;
        handleLookupOrder(code, phone);
      }
    } else if (route === "admin") {
      renderAdminView();
    } else if (route === "menu") {
      renderProducts();
    }

    // Cập nhật trạng thái active trên navbar
    document.querySelectorAll(".nav-link").forEach(link => {
      const linkTarget = link.getAttribute("href")?.replace("#", "");
      if (linkTarget === route) {
        link.classList.add("text-emerald-600", "font-bold");
        link.classList.remove("text-slate-600");
      } else {
        link.classList.remove("text-emerald-600", "font-bold");
        link.classList.add("text-slate-600");
      }
    });
  };

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
}

function navigateTo(routeWithParams) {
  window.location.hash = routeWithParams;
}

// Cập nhật số lượng trên icon giỏ hàng
function updateCartBadge() {
  const count = window.appStore.getCartCount();
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });

  const cartButton = document.getElementById("header-cart-btn");
  if (cartButton && count > 0) {
    cartButton.classList.add("cart-bounce");
    setTimeout(() => cartButton.classList.remove("cart-bounce"), 500);
  }
}

// Render các mục nổi bật tại trang chủ
function renderFeaturedHome() {
  const container = document.getElementById("home-featured-grid");
  if (!container) return;

  const products = window.appStore.getAllProducts().filter(p => p.isFeatured && p.isAvailable).slice(0, 6);
  container.innerHTML = products.map(p => renderProductCardHTML(p)).join("");

  const comboContainer = document.getElementById("home-combos-grid");
  if (comboContainer) {
    const combos = window.appStore.getAllProducts().filter(p => p.categoryId === "combo").slice(0, 3);
    comboContainer.innerHTML = combos.map(p => renderProductCardHTML(p)).join("");
  }
}

// Render thanh lọc danh mục
function renderCategoriesFilter() {
  const container = document.getElementById("menu-category-tabs");
  if (!container) return;

  const categories = window.appStore.getAllCategories();
  let html = `
    <button class="cat-pill px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${AppState.activeCategory === 'all' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}" data-cat="all">
      <i class="fa-solid fa-border-all mr-1.5"></i> Tất Cả Món
    </button>
  `;

  categories.forEach(cat => {
    const active = AppState.activeCategory === cat.slug;
    html += `
      <button class="cat-pill px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}" data-cat="${cat.slug}">
        <i class="fa-solid ${cat.icon || 'fa-tag'} mr-1.5"></i> ${cat.name}
      </button>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll(".cat-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.activeCategory = btn.getAttribute("data-cat");
      renderCategoriesFilter();
      renderProducts();
    });
  });
}

// Render danh sách sản phẩm trang Thực đơn
function renderProducts() {
  const container = document.getElementById("menu-products-grid");
  const countDisplay = document.getElementById("menu-results-count");
  if (!container) return;

  let products = [...window.appStore.getAllProducts()];

  // Lọc theo danh mục
  if (AppState.activeCategory !== "all") {
    products = products.filter(p => p.categoryId === AppState.activeCategory);
  }

  // Lọc theo từ khóa tìm kiếm
  if (AppState.searchKeyword.trim()) {
    const kw = AppState.searchKeyword.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(kw) || 
      p.shortDescription.toLowerCase().includes(kw)
    );
  }

  // Sắp xếp
  if (AppState.sortBy === "price-asc") {
    products.sort((a, b) => a.basePrice - b.basePrice);
  } else if (AppState.sortBy === "price-desc") {
    products.sort((a, b) => b.basePrice - a.basePrice);
  } else if (AppState.sortBy === "name-asc") {
    products.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  } else if (AppState.sortBy === "popular") {
    products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  }

  if (countDisplay) {
    countDisplay.textContent = `Hiển thị ${products.length} món ngon`;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-20 h-20 mx-auto mb-4 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Không tìm thấy món phù hợp</h3>
        <p class="text-slate-500 max-w-md mx-auto mb-6">Hãy thử tìm với từ khóa khác hoặc chọn xem tất cả danh mục của Xanh Vị Quán.</p>
        <button class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700" onclick="resetMenuFilters()">
          Xem lại tất cả
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(p => renderProductCardHTML(p)).join("");
}

function resetMenuFilters() {
  AppState.activeCategory = "all";
  AppState.searchKeyword = "";
  AppState.sortBy = "default";
  const searchInput = document.getElementById("menu-search-input");
  if (searchInput) searchInput.value = "";
  renderCategoriesFilter();
  renderProducts();
}

// Render HTML cho từng Card sản phẩm
function renderProductCardHTML(product) {
  const isOutOfStock = !product.isAvailable;
  const badgeHTML = product.badge ? `
    <span class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm ${
      product.badge.includes('20%') || product.badge.includes('17%') ? 'badge-discount' :
      product.badge === 'Bán chạy' || product.badge === 'Món Hot' ? 'badge-bestseller' : 'badge-new'
    }">
      ${product.badge}
    </span>
  ` : "";

  return `
    <div class="product-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group relative">
      ${badgeHTML}
      <div class="relative cursor-pointer product-img-wrapper" onclick="openProductDetailModal('${product.id}')">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" onerror="this.src='./mon-an/sua-da.jpg'">
        ${isOutOfStock ? `
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span class="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Tạm Hết Hàng</span>
          </div>
        ` : ""}
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span class="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              ${getCategoryName(product.categoryId)}
            </span>
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-star text-amber-400"></i> ${product.rating || '5.0'}
            </span>
          </div>
          <h4 class="font-bold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors cursor-pointer" onclick="openProductDetailModal('${product.id}')">
            ${product.name}
          </h4>
          <p class="text-xs text-slate-500 line-clamp-2 mb-3">
            ${product.shortDescription}
          </p>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div class="text-base font-extrabold text-emerald-600">
              ${formatVND(product.basePrice)}
            </div>
            ${product.originalPrice ? `
              <div class="text-xs text-slate-400 line-through">
                ${formatVND(product.originalPrice)}
              </div>
            ` : ""}
          </div>
          <div class="flex items-center gap-1.5">
            <button 
              class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-xs transition" 
              title="Xem chi tiết"
              onclick="openProductDetailModal('${product.id}')"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
            <button 
              class="px-3 h-8 rounded-lg ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'btn-primary text-white'} flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              ${isOutOfStock ? 'disabled' : `onclick="quickAddToCart('${product.id}')"`}
            >
              <i class="fa-solid fa-cart-plus"></i> Chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getCategoryName(catId) {
  const cat = window.appStore.getAllCategories().find(c => c.slug === catId || c.id === catId);
  return cat ? cat.name : "Món ngon";
}

// Quick Add to cart (với tùy chọn mặc định)
function quickAddToCart(productId) {
  const product = window.appStore.getProductById(productId);
  if (!product || !product.isAvailable) {
    showToast("Món này hiện đang tạm hết hàng", "warning");
    return;
  }

  // Nếu món có nhiều size hoặc lựa chọn phức tạp, mở modal để khách chọn
  if ((product.sizes && product.sizes.length > 1) || (product.options && Object.keys(product.options).length > 0)) {
    openProductDetailModal(productId);
    return;
  }

  // Thêm trực tiếp nếu là sản phẩm đơn giản
  window.appStore.addToCart({
    product,
    size: product.sizes ? product.sizes[0] : null,
    sugar: "100% Chuẩn",
    ice: "100% Bình thường",
    toppings: [],
    note: "",
    quantity: 1
  });

  updateCartBadge();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
}

// Modal chi tiết sản phẩm và tùy chỉnh món
function openProductDetailModal(productId) {
  const product = window.appStore.getProductById(productId);
  if (!product) return;

  AppState.selectedProductForModal = product;
  const modal = document.getElementById("product-detail-modal");
  const modalContent = document.getElementById("modal-product-content");
  if (!modal || !modalContent) return;

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;

  modalContent.innerHTML = `
    <div class="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full mx-4 my-8 flex flex-col md:flex-row max-h-[90vh]">
      <button class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/60 flex items-center justify-center transition" onclick="closeProductDetailModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Ảnh sản phẩm -->
      <div class="md:w-5/12 bg-slate-100 relative min-h-[220px] md:min-h-full">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='./mon-an/sua-da.jpg'">
        ${product.badge ? `
          <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-md ${product.badge.includes('20%') ? 'badge-discount' : 'badge-bestseller'}">
            ${product.badge}
          </span>
        ` : ""}
      </div>

      <!-- Thông tin tùy chọn -->
      <div class="md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div class="text-xs text-emerald-600 font-semibold tracking-wider uppercase mb-1">
            ${getCategoryName(product.categoryId)}
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-1">${product.name}</h3>
          <p class="text-xs text-slate-500 mb-4 leading-relaxed">${product.description}</p>

          <form id="modal-options-form">
            <!-- Chọn Size / Khẩu phần -->
            ${product.sizes && product.sizes.length > 0 ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Chọn kích cỡ / Khẩu phần <span class="text-rose-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-2">
                  ${product.sizes.map((s, idx) => `
                    <label class="border border-slate-200 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                      <div class="flex items-center gap-2">
                        <input type="radio" name="opt_size" value="${s.id}" ${idx === 0 ? 'checked' : ''} class="accent-emerald-600" onchange="calculateModalPrice()">
                        <span class="text-xs font-semibold text-slate-800">${s.name}</span>
                      </div>
                      ${s.extraPrice > 0 ? `<span class="text-[11px] font-bold text-emerald-600">+${formatVND(s.extraPrice)}</span>` : ''}
                    </label>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Chọn mức Đường (Nếu có) -->
            ${product.options && product.options.sugar ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2. Mức ngọt / Đường</label>
                <div class="flex flex-wrap gap-2">
                  ${product.options.sugar.map((opt, idx) => `
                    <label class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition hover:border-slate-300 has-[:checked]:bg-emerald-600 has-[:checked]:text-white has-[:checked]:border-emerald-600">
                      <input type="radio" name="opt_sugar" value="${opt}" ${idx === 0 ? 'checked' : ''} class="hidden">
                      <span>${opt}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Chọn mức Đá / Nóng (Nếu có) -->
            ${product.options && product.options.ice ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">3. Đá / Nhiệt độ</label>
                <div class="flex flex-wrap gap-2">
                  ${product.options.ice.map((opt, idx) => `
                    <label class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition hover:border-slate-300 has-[:checked]:bg-emerald-600 has-[:checked]:text-white has-[:checked]:border-emerald-600">
                      <input type="radio" name="opt_ice" value="${opt}" ${idx === 0 ? 'checked' : ''} class="hidden">
                      <span>${opt}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Tùy chọn cay / rau củ cho món ăn -->
            ${product.options && product.options.chili ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Độ cay</label>
                <div class="flex flex-wrap gap-2">
                  ${product.options.chili.map((opt, idx) => `
                    <label class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition hover:border-slate-300 has-[:checked]:bg-emerald-600 has-[:checked]:text-white has-[:checked]:border-emerald-600">
                      <input type="radio" name="opt_chili" value="${opt}" ${idx === 0 ? 'checked' : ''} class="hidden">
                      <span>${opt}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Topping thêm (Nếu có) -->
            ${product.options && product.options.toppings && product.options.toppings.length > 0 ? `
              <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Topping thêm</label>
                <div class="space-y-1.5">
                  ${product.options.toppings.map(t => `
                    <label class="border border-slate-200 rounded-xl p-2 flex items-center justify-between cursor-pointer text-xs hover:border-emerald-400 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                      <div class="flex items-center gap-2">
                        <input type="checkbox" name="opt_topping" value="${t.id}" data-price="${t.price}" class="accent-emerald-600 rounded" onchange="calculateModalPrice()">
                        <span class="font-medium text-slate-800">${t.name}</span>
                      </div>
                      <span class="font-bold text-emerald-600">+${formatVND(t.price)}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Ghi chú riêng -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ghi chú cho bếp / pha chế</label>
              <input type="text" id="modal-item-note" placeholder="Ví dụ: Để đá riêng, xin thêm tương ớt..." class="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
            </div>
          </form>
        </div>

        <!-- Thanh footer modal tính tiền & thêm giỏ -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-2">
          <!-- Bộ chỉnh số lượng -->
          <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
            <button class="w-7 h-7 rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold" onclick="changeModalQty(-1)">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span id="modal-qty-display" class="w-9 text-center font-bold text-sm text-slate-800">1</span>
            <button class="w-7 h-7 rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs font-bold" onclick="changeModalQty(1)">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <!-- Nút thêm vào giỏ có tổng tiền -->
          <button 
            id="modal-add-btn" 
            class="flex-1 btn-primary text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-between shadow-md shadow-emerald-200 ${!product.isAvailable ? 'opacity-50 pointer-events-none' : ''}" 
            onclick="submitModalAddToCart()"
          >
            <span>Thêm Vào Giỏ</span>
            <span id="modal-total-price-display">${formatVND(product.basePrice)}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  calculateModalPrice();
}

function closeProductDetailModal() {
  const modal = document.getElementById("product-detail-modal");
  if (modal) modal.classList.add("hidden");
  AppState.selectedProductForModal = null;
}

let modalQuantity = 1;

function changeModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  const display = document.getElementById("modal-qty-display");
  if (display) display.textContent = modalQuantity;
  calculateModalPrice();
}

function calculateModalPrice() {
  const product = AppState.selectedProductForModal;
  if (!product) return;

  let unitPrice = product.basePrice;

  // Lấy size đang chọn
  const sizeInput = document.querySelector('input[name="opt_size"]:checked');
  if (sizeInput && product.sizes) {
    const selectedSize = product.sizes.find(s => s.id === sizeInput.value);
    if (selectedSize) unitPrice += selectedSize.extraPrice;
  }

  // Topping
  const toppingInputs = document.querySelectorAll('input[name="opt_topping"]:checked');
  toppingInputs.forEach(t => {
    unitPrice += Number(t.getAttribute("data-price") || 0);
  });

  const totalPrice = unitPrice * modalQuantity;
  const display = document.getElementById("modal-total-price-display");
  if (display) display.textContent = formatVND(totalPrice);
}

function submitModalAddToCart() {
  const product = AppState.selectedProductForModal;
  if (!product) return;

  const sizeInput = document.querySelector('input[name="opt_size"]:checked');
  const selectedSize = (sizeInput && product.sizes) ? product.sizes.find(s => s.id === sizeInput.value) : null;

  const sugarInput = document.querySelector('input[name="opt_sugar"]:checked');
  const iceInput = document.querySelector('input[name="opt_ice"]:checked');
  const chiliInput = document.querySelector('input[name="opt_chili"]:checked');

  const selectedToppings = [];
  document.querySelectorAll('input[name="opt_topping"]:checked').forEach(t => {
    const topObj = product.options.toppings.find(item => item.id === t.value);
    if (topObj) selectedToppings.push(topObj);
  });

  const noteInput = document.getElementById("modal-item-note");
  let fullNote = noteInput ? noteInput.value.trim() : "";
  if (chiliInput) {
    fullNote = fullNote ? `${fullNote}, Độ cay: ${chiliInput.value}` : `Độ cay: ${chiliInput.value}`;
  }

  window.appStore.addToCart({
    product,
    size: selectedSize,
    sugar: sugarInput ? sugarInput.value : "",
    ice: iceInput ? iceInput.value : "",
    toppings: selectedToppings,
    note: fullNote,
    quantity: modalQuantity
  });

  updateCartBadge();
  closeProductDetailModal();
  modalQuantity = 1;
  showToast(`Đã thêm ${product.name} vào giỏ!`, "success");
}

// Drawer & Cart View
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.remove("translate-x-full");
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.add("translate-x-full");
}

function renderCartDrawer() {
  const itemsContainer = document.getElementById("cart-drawer-items");
  const subtotalDisplay = document.getElementById("cart-drawer-subtotal");
  const checkoutBtn = document.getElementById("cart-drawer-checkout-btn");
  if (!itemsContainer) return;

  const cartItems = window.appStore.getCartItems();
  const subtotal = window.appStore.calculateSubtotal();

  if (cartItems.length === 0) {
    itemsContainer.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-4 text-slate-300">
          <i class="fa-solid fa-basket-shopping"></i>
        </div>
        <p class="font-bold text-slate-700 text-base mb-1">Giỏ hàng của bạn đang trống</p>
        <p class="text-xs text-slate-400 mb-6">Hãy chọn thức uống mát lạnh hoặc món ngon từ thực đơn nhé!</p>
        <button class="btn-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl" onclick="closeCartDrawer(); navigateTo('menu')">
          Xem Thực Đơn Ngay
        </button>
      </div>
    `;
    if (subtotalDisplay) subtotalDisplay.textContent = "0 ₫";
    if (checkoutBtn) checkoutBtn.classList.add("opacity-50", "pointer-events-none");
    return;
  }

  if (checkoutBtn) checkoutBtn.classList.remove("opacity-50", "pointer-events-none");
  if (subtotalDisplay) subtotalDisplay.textContent = formatVND(subtotal);

  itemsContainer.innerHTML = cartItems.map(item => `
    <div class="p-3 bg-white border border-slate-100 rounded-2xl flex gap-3 shadow-sm hover:border-slate-200 transition">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover shrink-0" onerror="this.src='./mon-an/sua-da.jpg'">
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <h5 class="font-bold text-xs text-slate-800 line-clamp-1">${item.name}</h5>
            <button class="text-slate-300 hover:text-rose-500 text-xs ml-2 transition" onclick="removeCartItem('${item.itemId}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5 space-y-0.5">
            ${item.size ? `<span class="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-600">${item.size.name}</span>` : ''}
            ${item.sugar ? `<span>• ${item.sugar}</span>` : ''}
            ${item.ice ? `<span>• ${item.ice}</span>` : ''}
            ${item.toppings && item.toppings.length > 0 ? `<div class="text-emerald-600">+ ${item.toppings.map(t => t.name).join(', ')}</div>` : ''}
            ${item.note ? `<div class="italic text-slate-400">"${item.note}"</div>` : ''}
          </div>
        </div>
        <div class="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
          <span class="font-extrabold text-xs text-emerald-600">${formatVND(item.totalPrice)}</span>
          <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1">
            <button class="w-5 h-5 text-slate-600 hover:text-emerald-600 text-[10px]" onclick="updateCartItemQty('${item.itemId}', -1)">-</button>
            <span class="w-6 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
            <button class="w-5 h-5 text-slate-600 hover:text-emerald-600 text-[10px]" onclick="updateCartItemQty('${item.itemId}', 1)">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function updateCartItemQty(itemId, delta) {
  window.appStore.updateQuantity(itemId, delta);
  updateCartBadge();
  renderCartDrawer();
  if (AppState.currentRoute === "checkout") renderCheckoutSummary();
}

function removeCartItem(itemId) {
  window.appStore.removeFromCart(itemId);
  updateCartBadge();
  renderCartDrawer();
  if (AppState.currentRoute === "checkout") renderCheckoutSummary();
  showToast("Đã xóa món khỏi giỏ hàng", "info");
}

// Checkout Page Logic
function renderCheckoutSummary() {
  const container = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const feeEl = document.getElementById("checkout-delivery-fee");
  const discountEl = document.getElementById("checkout-discount");
  const totalEl = document.getElementById("checkout-total");
  const discountRow = document.getElementById("checkout-discount-row");

  if (!container) return;

  const items = window.appStore.getCartItems();
  if (items.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">Giỏ hàng rỗng. Hãy quay lại thực đơn chọn món.</div>`;
    return;
  }

  container.innerHTML = items.map(i => `
    <div class="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">${i.quantity}x</span>
        <div>
          <span class="font-semibold text-slate-800">${i.name}</span>
          ${i.size ? `<span class="text-slate-400 text-[10px]"> (${i.size.name})</span>` : ''}
        </div>
      </div>
      <span class="font-bold text-slate-700">${formatVND(i.totalPrice)}</span>
    </div>
  `).join("");

  const pricing = window.appStore.calculateOrderTotal({
    fulfillmentMethod: AppState.checkoutFulfillment,
    voucherCode: AppState.appliedVoucherCode
  });

  if (subtotalEl) subtotalEl.textContent = formatVND(pricing.subtotal);
  if (feeEl) feeEl.textContent = pricing.deliveryFee > 0 ? formatVND(pricing.deliveryFee) : "Miễn phí";

  if (discountEl && discountRow) {
    if (pricing.discount > 0) {
      discountRow.classList.remove("hidden");
      discountEl.textContent = `-${formatVND(pricing.discount)}`;
    } else {
      discountRow.classList.add("hidden");
    }
  }

  if (totalEl) totalEl.textContent = formatVND(pricing.total);
}

function applyVoucher() {
  const input = document.getElementById("checkout-voucher-input");
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) {
    showToast("Vui lòng nhập mã giảm giá", "warning");
    return;
  }

  const voucher = window.STORE_CONFIG.promotions.find(p => p.code.toUpperCase() === code);
  if (!voucher) {
    showToast("Mã khuyến mãi không hợp lệ hoặc đã hết hạn", "error");
    return;
  }

  const subtotal = window.appStore.calculateSubtotal();
  if (subtotal < voucher.minOrder) {
    showToast(`Mã này chỉ áp dụng cho đơn từ ${formatVND(voucher.minOrder)}`, "warning");
    return;
  }

  AppState.appliedVoucherCode = code;
  renderCheckoutSummary();
  showToast(`Áp dụng thành công mã "${code}": ${voucher.description}`, "success");
}

// Xử lý Gửi Đơn Hàng (Chống duplicate clicks)
let isSubmittingOrder = false;

async function handlePlaceOrder(event) {
  if (event) event.preventDefault();
  if (isSubmittingOrder) return;

  const cartItems = window.appStore.getCartItems();
  if (cartItems.length === 0) {
    showToast("Giỏ hàng đang trống! Vui lòng chọn món trước.", "warning");
    navigateTo("menu");
    return;
  }

  const nameInput = document.getElementById("order-name");
  const phoneInput = document.getElementById("order-phone");
  const addressInput = document.getElementById("order-address");
  const noteInput = document.getElementById("order-note");
  const scheduledInput = document.getElementById("order-scheduled");

  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const address = addressInput ? addressInput.value.trim() : "";
  const note = noteInput ? noteInput.value.trim() : "";
  const scheduledAt = scheduledInput ? scheduledInput.value : "ASAP";

  // Validate form
  if (!name) {
    showToast("Vui lòng nhập họ tên người nhận", "warning");
    nameInput?.focus();
    return;
  }

  // Validate định dạng số điện thoại Việt Nam (10 chữ số)
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
    showToast("Số điện thoại không hợp lệ (Vui lòng nhập 10 chữ số)", "warning");
    phoneInput?.focus();
    return;
  }

  if (AppState.checkoutFulfillment === "DELIVERY" && !address) {
    showToast("Vui lòng nhập địa chỉ nhận hàng chi tiết", "warning");
    addressInput?.focus();
    return;
  }

  // Khóa nút để chống gửi lặp
  isSubmittingOrder = true;
  const submitBtn = document.getElementById("place-order-btn");
  const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Đang xử lý đơn hàng...`;
  }

  try {
    // Giả lập độ trễ an toàn mạng 600ms
    await new Promise(r => setTimeout(r, 600));

    const newOrder = window.appStore.createOrder({
      customerName: name,
      phone,
      deliveryAddress: AppState.checkoutFulfillment === "DELIVERY" ? address : "Khách tự lấy tại quán",
      fulfillmentMethod: AppState.checkoutFulfillment,
      scheduledAt,
      note,
      paymentMethod: AppState.checkoutPaymentMethod,
      voucherCode: AppState.appliedVoucherCode
    });

    updateCartBadge();
    showToast(`Tạo đơn hàng ${newOrder.orderCode} thành công!`, "success");

    // Chuyển sang màn hình xác nhận đơn và thanh toán
    navigateTo(`order-confirmation?orderId=${newOrder.id}`);
  } catch (err) {
    console.error("Lỗi tạo đơn:", err);
    showToast("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!", "error");
  } finally {
    isSubmittingOrder = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
}

// Màn hình Xác Nhận Đơn Hàng & Thanh Toán VietQR
function renderOrderConfirmationView(orderId) {
  const order = window.appStore.getOrderById(orderId);
  const container = document.getElementById("order-confirmation-content");
  if (!container) return;

  if (!order) {
    container.innerHTML = `
      <div class="text-center py-16">
        <h3 class="text-xl font-bold text-slate-800 mb-2">Không tìm thấy thông tin đơn hàng</h3>
        <button class="btn-primary text-white text-xs px-6 py-2.5 rounded-xl font-bold" onclick="navigateTo('home')">Về Trang Chủ</button>
      </div>
    `;
    return;
  }

  const isVietQR = order.paymentMethod === "VIETQR";
  const isPaid = order.paymentStatus === "PAID";
  const isAwaiting = order.paymentStatus === "AWAITING_VERIFICATION";

  // Tạo URL VietQR chuẩn
  const qrUrl = window.VietQRService.generateQRUrl({
    bankId: window.STORE_CONFIG.bank.bankId,
    accountNo: window.STORE_CONFIG.bank.accountNo,
    accountName: window.STORE_CONFIG.bank.accountName,
    amount: order.total,
    orderCode: order.orderCode,
    template: window.STORE_CONFIG.bank.template
  });

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Banner Chúc mừng -->
      <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-emerald-200 text-sm font-semibold mb-1">
            <i class="fa-solid fa-circle-check text-lg"></i> Đặt hàng thành công!
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold">Mã Đơn: ${order.orderCode}</h2>
          <p class="text-xs sm:text-sm text-emerald-100 mt-1">Cảm ơn ${order.customerName} đã tin tưởng ủng hộ Xanh Vị Quán.</p>
        </div>
        <div class="flex gap-2">
          <button class="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2.5 rounded-xl font-bold backdrop-blur-sm transition flex items-center gap-1.5" onclick="window.print()">
            <i class="fa-solid fa-print"></i> In Hóa Đơn
          </button>
          <button class="bg-white text-emerald-800 hover:bg-emerald-50 text-xs px-4 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-1.5" onclick="navigateTo('tracking?code=${order.orderCode}&phone=${order.phone}')">
            <i class="fa-solid fa-route"></i> Theo Dõi Đơn
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Cột Trái: VietQR & Hướng dẫn thanh toán (nếu là VietQR) HOẶC Trạng thái COD -->
        <div class="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          ${isVietQR ? `
            <div>
              <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <i class="fa-solid fa-qrcode"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-800 text-sm">Thanh Toán VietQR Tự Động</h4>
                    <span class="text-[11px] text-slate-400">Mã QR tạo riêng cho đơn hàng này</span>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
                  isPaid ? 'bg-emerald-100 text-emerald-700' :
                  isAwaiting ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }">
                  ${
                    isPaid ? '✓ Đã Thanh Toán' :
                    isAwaiting ? 'Đang Chờ Quán Đối Soát' : 'Chờ Thanh Toán'
                  }
                </span>
              </div>

              <!-- Ảnh QR Code -->
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center mb-5">
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 inline-block relative group">
                  <img src="${qrUrl}" alt="Mã VietQR" class="w-64 h-auto max-w-full rounded-xl mx-auto" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(order.orderCode)}'">
                  <div class="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-semibold">
                    Quét trên mọi app Ngân hàng & Ví MoMo
                  </div>
                </div>
                <p class="text-[11px] text-slate-500 mt-3 text-center">
                  <i class="fa-solid fa-shield-halved text-emerald-600"></i> Hỗ trợ quét tự động điền đúng Số Tiền và Mã Đơn trên 40+ ứng dụng ngân hàng
                </p>
              </div>

              <!-- Chi tiết thông tin chuyển khoản kèm nút sao chép -->
              <div class="space-y-2 text-xs mb-5">
                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Ngân hàng:</span>
                  <span class="font-bold text-slate-800">${window.STORE_CONFIG.bank.bankName}</span>
                </div>
                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Số tài khoản:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-slate-900 text-sm">${window.STORE_CONFIG.bank.accountNo}</span>
                    <button class="text-emerald-600 hover:text-emerald-700 text-xs px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 font-semibold transition" onclick="window.VietQRService.copyToClipboard('${window.STORE_CONFIG.bank.accountNo}', 'Đã copy Số tài khoản!')">
                      <i class="fa-solid fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-slate-500">Chủ tài khoản:</span>
                  <span class="font-bold text-slate-800">${window.STORE_CONFIG.bank.accountName}</span>
                </div>
                <div class="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span class="text-slate-600 font-medium">Số tiền cần chuyển:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-emerald-700 text-sm">${formatVND(order.total)}</span>
                    <button class="text-emerald-600 hover:text-emerald-700 text-xs px-2 py-0.5 rounded bg-emerald-100/60 font-semibold transition" onclick="window.VietQRService.copyToClipboard('${order.total}', 'Đã copy Số tiền!')">
                      <i class="fa-solid fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div class="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <div>
                    <span class="text-amber-800 font-semibold">Nội dung chuyển khoản:</span>
                    <div class="text-[10px] text-amber-600">(Bắt buộc giữ nguyên để quán đối soát)</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-amber-900 text-sm bg-white px-2 py-1 rounded border border-amber-200">${order.orderCode}</span>
                    <button class="text-amber-700 hover:text-amber-800 text-xs px-2 py-1 rounded bg-amber-200/80 font-bold transition" onclick="window.VietQRService.copyToClipboard('${order.orderCode}', 'Đã copy Nội dung chuyển khoản!')">
                      <i class="fa-solid fa-copy"></i> Copy
                    </button>
                  </div>
                </div>
              </div>

              <!-- Nút xác nhận chuyển tiền an toàn -->
              <div class="pt-2">
                ${!isPaid ? `
                  <button 
                    class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    onclick="handleClientConfirmPayment('${order.id}')"
                  >
                    <i class="fa-solid fa-paper-plane"></i> Tôi Đã Hoàn Tất Chuyển Khoản
                  </button>
                  <p class="text-[11px] text-slate-400 text-center mt-2">
                    Hệ thống sẽ giữ đơn và nhân viên quầy sẽ duyệt ngay khi tiền vào tài khoản.
                  </p>
                ` : `
                  <div class="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600"></i> Đơn hàng đã được xác nhận thanh toán thành công!
                  </div>
                `}
              </div>
            </div>
          ` : `
            <div>
              <div class="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-800 mb-6">
                <i class="fa-solid fa-truck-fast text-2xl text-emerald-600"></i>
                <div>
                  <h4 class="font-bold text-sm">Thanh toán khi nhận hàng (COD)</h4>
                  <p class="text-xs text-slate-600">Quý khách vui lòng chuẩn bị số tiền mặt chính xác khi nhận hàng từ tài xế.</p>
                </div>
              </div>
              <div class="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-slate-500">Số tiền cần thanh toán:</span>
                  <span class="font-extrabold text-slate-900 text-sm">${formatVND(order.total)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Trạng thái:</span>
                  <span class="font-bold text-amber-600">Thu tiền tận nơi</span>
                </div>
              </div>
            </div>
          `}
        </div>

        <!-- Cột Phải: Thông tin nhận hàng & Chi tiết món -->
        <div class="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
              <span>Chi Tiết Đơn Hàng</span>
              <span class="text-[11px] font-normal text-slate-400">${formatDateTime(order.createdAt)}</span>
            </h4>

            <!-- Người nhận -->
            <div class="text-xs space-y-1.5 mb-4 text-slate-600">
              <p><strong class="text-slate-800">Người nhận:</strong> ${order.customerName}</p>
              <p><strong class="text-slate-800">Điện thoại:</strong> ${order.phone}</p>
              <p><strong class="text-slate-800">Hình thức:</strong> ${order.fulfillmentMethod === 'DELIVERY' ? 'Giao tận nơi' : 'Tự lấy tại quán'}</p>
              <p><strong class="text-slate-800">Địa chỉ:</strong> ${order.deliveryAddress}</p>
              ${order.note ? `<p><strong class="text-slate-800">Ghi chú:</strong> "${order.note}"</p>` : ''}
            </div>

            <!-- Danh sách món -->
            <div class="max-h-56 overflow-y-auto space-y-2 mb-4 pr-1">
              ${order.items.map(item => `
                <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                  <div class="flex items-center gap-2">
                    <img src="${item.image}" alt="${item.name}" class="w-10 h-10 rounded-lg object-cover" onerror="this.src='./mon-an/sua-da.jpg'">
                    <div>
                      <div class="font-semibold text-slate-800">${item.name}</div>
                      <div class="text-[10px] text-slate-400">
                        ${item.size ? item.size.name : ''} x${item.quantity}
                      </div>
                    </div>
                  </div>
                  <span class="font-bold text-slate-700">${formatVND(item.totalPrice)}</span>
                </div>
              `).join("")}
            </div>

            <!-- Tổng kết tiền -->
            <div class="space-y-1 text-xs pt-3 border-t border-slate-100">
              <div class="flex justify-between text-slate-500">
                <span>Tạm tính:</span>
                <span>${formatVND(order.subtotal)}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Phí vận chuyển:</span>
                <span>${order.deliveryFee > 0 ? formatVND(order.deliveryFee) : 'Miễn phí'}</span>
              </div>
              ${order.discount > 0 ? `
                <div class="flex justify-between text-rose-600 font-semibold">
                  <span>Giảm giá (${order.discountCode}):</span>
                  <span>-${formatVND(order.discount)}</span>
                </div>
              ` : ''}
              <div class="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Tổng cộng:</span>
                <span class="text-emerald-600">${formatVND(order.total)}</span>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <button class="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition" onclick="navigateTo('menu')">
              Tiếp Tục Mua Thêm Món
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleClientConfirmPayment(orderId) {
  window.appStore.markPaymentTransferred(orderId);
  renderOrderConfirmationView(orderId);
  showToast("Quán đã nhận thông tin thông báo chuyển khoản của bạn. Xin đợi trong giây lát!", "info");
}

// Order Tracking View
function handleLookupOrder(codeParam, phoneParam) {
  const code = (codeParam || document.getElementById("track-code-input")?.value || "").trim();
  const phone = (phoneParam || document.getElementById("track-phone-input")?.value || "").trim();
  const container = document.getElementById("tracking-result-container");
  if (!container) return;

  if (!code || !phone) {
    showToast("Vui lòng nhập cả Mã đơn hàng và Số điện thoại đặt hàng", "warning");
    return;
  }

  const order = window.appStore.lookupOrder(code, phone);
  if (!order) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
        <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-800 mb-1">Không tìm thấy đơn hàng</h4>
        <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          Vui lòng kiểm tra lại mã đơn (ví dụ: <code class="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700">XVQ-20260927-1001</code>) và số điện thoại đã dùng để đặt món.
        </p>
      </div>
    `;
    return;
  }

  // Render Timeline tiến trình
  const statusSteps = [
    { key: "PENDING_PAYMENT", label: "Tiếp Nhận Đơn", icon: "fa-clipboard-check" },
    { key: "CONFIRMED", label: "Đã Xác Nhận", icon: "fa-circle-check" },
    { key: "PREPARING", label: "Đang Pha Chế / Nấu", icon: "fa-fire-burner" },
    { key: "SHIPPING", label: "Đang Giao Hàng", icon: "fa-truck-fast" },
    { key: "COMPLETED", label: "Giao Thành Công", icon: "fa-house-chimney" },
  ];

  const statusOrderIndex = {
    "PENDING_PAYMENT": 0,
    "AWAITING_CONFIRMATION": 0,
    "CONFIRMED": 1,
    "PREPARING": 2,
    "SHIPPING": 3,
    "COMPLETED": 4,
    "CANCELLED": -1
  };

  const currentIndex = statusOrderIndex[order.orderStatus] ?? 0;
  const isCancelled = order.orderStatus === "CANCELLED";

  container.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
      <!-- Header mã đơn & trạng thái -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <span class="text-xs text-slate-400 font-medium">Chi tiết theo dõi đơn hàng:</span>
          <h3 class="text-2xl font-black text-slate-800 font-mono">${order.orderCode}</h3>
          <p class="text-xs text-slate-500 mt-1">Đặt lúc: ${formatDateTime(order.createdAt)}</p>
        </div>
        <div>
          ${isCancelled ? `
            <span class="px-4 py-2 rounded-xl text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-2">
              <i class="fa-solid fa-ban"></i> Đơn Hàng Đã Hủy
            </span>
          ` : `
            <span class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <i class="fa-solid fa-clock-rotate-left"></i> ${window.STORE_CONFIG.orderStatuses[order.orderStatus]?.label || order.orderStatus}
            </span>
          `}
        </div>
      </div>

      <!-- Timeline tiến trình -->
      ${!isCancelled ? `
        <div class="relative">
          <div class="hidden sm:block absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
            ${statusSteps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return `
                <div class="flex flex-col items-center text-center">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-base mb-2 transition-all ${
                    isCurrent ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-100 scale-110' :
                    isPast ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }">
                    <i class="fa-solid ${step.icon}"></i>
                  </div>
                  <span class="text-xs font-bold ${isCurrent ? 'text-emerald-700' : isPast ? 'text-slate-800' : 'text-slate-400'}">
                    ${step.label}
                  </span>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : ""}

      <!-- Lịch sử Audit Trail -->
      <div class="bg-slate-50 rounded-2xl p-4">
        <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Nhật ký cập nhật:</h5>
        <div class="space-y-2 text-xs">
          ${order.statusHistory.map(h => `
            <div class="flex items-start gap-2 text-slate-600">
              <i class="fa-solid fa-check text-emerald-500 mt-0.5"></i>
              <div>
                <span class="font-semibold text-slate-800">[${formatDateTime(h.createdAt)}]</span>
                <span>${h.note}</span>
                <span class="text-slate-400 text-[10px]">(${h.updatedBy})</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Chi tiết người nhận & Món -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
        <div>
          <h5 class="font-bold text-slate-800 mb-2">Địa Chỉ Giao Hàng:</h5>
          <p class="text-slate-600 font-medium">${order.customerName} - ${order.phone}</p>
          <p class="text-slate-500">${order.deliveryAddress}</p>
          ${order.note ? `<p class="text-slate-400 italic mt-1">Ghi chú: "${order.note}"</p>` : ''}
        </div>
        <div>
          <h5 class="font-bold text-slate-800 mb-2">Thanh Toán & Tổng Tiền:</h5>
          <p class="text-slate-600">Phương thức: <span class="font-semibold">${order.paymentMethod === 'VIETQR' ? 'Chuyển khoản VietQR' : 'COD - Tiền mặt khi nhận'}</span></p>
          <p class="text-slate-600">Trạng thái thanh toán: <span class="font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}">${order.paymentStatus === 'PAID' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</span></p>
          <p class="text-base font-extrabold text-emerald-600 mt-1">Tổng cộng: ${formatVND(order.total)}</p>
        </div>
      </div>
    </div>
  `;
}

// ADMIN VIEW & LOGIC
function checkAdminSession() {
  const session = localStorage.getItem(window.STORE_CONFIG.storageKeys.ADMIN_SESSION);
  AppState.adminLoggedIn = session === "authenticated";
}

function renderAdminView() {
  const container = document.getElementById("admin-portal-container");
  if (!container) return;

  if (!AppState.adminLoggedIn) {
    container.innerHTML = renderAdminLoginHTML();
  } else {
    container.innerHTML = renderAdminDashboardHTML();
    bindAdminDashboardEvents();
  }
}

function renderAdminLoginHTML() {
  return `
    <div class="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
      <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
        <i class="fa-solid fa-lock"></i>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 mb-1">Quản Trị Viên</h3>
      <p class="text-xs text-slate-400 mb-6">Đăng nhập để quản lý thực đơn, đơn hàng và duyệt thanh toán VietQR</p>
      
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-left mb-6">
        <p class="font-bold mb-1"><i class="fa-solid fa-circle-info"></i> Tài khoản Demo:</p>
        <p>• Tên đăng nhập: <strong class="font-mono text-slate-900">admin</strong></p>
        <p>• Mật khẩu: <strong class="font-mono text-slate-900">admin123</strong></p>
      </div>

      <form id="admin-login-form" onsubmit="handleAdminLogin(event)" class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tên đăng nhập</label>
          <input type="text" id="admin-user-input" required value="admin" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mật khẩu</label>
          <input type="password" id="admin-pass-input" required value="admin123" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
        </div>
        <button type="submit" class="w-full py-3 btn-primary text-white rounded-xl font-bold text-sm shadow-md transition">
          Đăng Nhập Quản Trị
        </button>
      </form>
    </div>
  `;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const user = document.getElementById("admin-user-input")?.value.trim();
  const pass = document.getElementById("admin-pass-input")?.value.trim();

  const isValid = await window.appStore.checkAdminAuth(user, pass);
  if (isValid) {
    AppState.adminLoggedIn = true;
    localStorage.setItem(window.STORE_CONFIG.storageKeys.ADMIN_SESSION, "authenticated");
    showToast("Đăng nhập quản trị thành công!", "success");
    renderAdminView();
  } else {
    showToast("Sai tên đăng nhập hoặc mật khẩu!", "error");
  }
}

function handleAdminLogout() {
  AppState.adminLoggedIn = false;
  localStorage.removeItem(window.STORE_CONFIG.storageKeys.ADMIN_SESSION);
  showToast("Đã đăng xuất khỏi trang quản trị", "info");
  renderAdminView();
}

let adminCurrentTab = "orders"; // 'orders', 'products', 'settings'
let adminOrderFilter = "all";

function renderAdminDashboardHTML() {
  const orders = window.appStore.getAllOrders();
  const products = window.appStore.getAllProducts();

  // Thống kê
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.orderStatus === "COMPLETED");
  const pendingPaymentOrders = orders.filter(o => o.orderStatus === "PENDING_PAYMENT" || o.orderStatus === "AWAITING_CONFIRMATION");
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "PAID" || o.orderStatus === "COMPLETED")
    .reduce((sum, o) => sum + o.total, 0);

  return `
    <div class="space-y-6">
      <!-- Admin Topbar -->
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
            <i class="fa-solid fa-gauge-high"></i>
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-slate-800">Bảng Điều Khiển Quản Trị</h2>
            <span class="text-xs text-slate-400">Hệ thống Xanh Vị Quán • Phiên bản 1.0.0</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition" onclick="resetToInitialData()">
            <i class="fa-solid fa-rotate-left mr-1"></i> Khôi Phục Dữ Liệu Gốc
          </button>
          <button class="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition" onclick="handleAdminLogout()">
            <i class="fa-solid fa-right-from-bracket mr-1"></i> Đăng Xuất
          </button>
        </div>
      </div>

      <!-- Thống kê nhanh Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs text-slate-400 font-semibold uppercase">Tổng Doanh Thu</span>
          <div class="text-2xl font-black text-emerald-600 mt-1">${formatVND(totalRevenue)}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">Chỉ tính đơn đã thanh toán/hoàn tất</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs text-slate-400 font-semibold uppercase">Tổng Đơn Hàng</span>
          <div class="text-2xl font-black text-slate-800 mt-1">${totalOrders}</div>
          <span class="text-[11px] text-emerald-600 mt-1 block">${completedOrders.length} đơn đã giao thành công</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs text-slate-400 font-semibold uppercase">Cần Duyệt VietQR</span>
          <div class="text-2xl font-black text-amber-500 mt-1">${pendingPaymentOrders.length}</div>
          <span class="text-[11px] text-amber-600 mt-1 block">Đang chờ đối soát ngân hàng</span>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs text-slate-400 font-semibold uppercase">Sản Phẩm Trong Thực Đơn</span>
          <div class="text-2xl font-black text-indigo-600 mt-1">${products.length}</div>
          <span class="text-[11px] text-slate-400 mt-1 block">${products.filter(p => p.isAvailable).length} món đang phục vụ</span>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 gap-2">
        <button class="px-5 py-3 font-bold text-xs uppercase tracking-wider transition ${adminCurrentTab === 'orders' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}" onclick="setAdminTab('orders')">
          <i class="fa-solid fa-receipt mr-1"></i> Quản Lý Đơn Hàng (${orders.length})
        </button>
        <button class="px-5 py-3 font-bold text-xs uppercase tracking-wider transition ${adminCurrentTab === 'products' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}" onclick="setAdminTab('products')">
          <i class="fa-solid fa-mug-hot mr-1"></i> Quản Lý Thực Đơn (${products.length})
        </button>
        <button class="px-5 py-3 font-bold text-xs uppercase tracking-wider transition ${adminCurrentTab === 'settings' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-800'}" onclick="setAdminTab('settings')">
          <i class="fa-solid fa-gear mr-1"></i> Cấu Hình Ngân Hàng VietQR
        </button>
      </div>

      <!-- Nội dung tab -->
      <div id="admin-tab-content">
        ${adminCurrentTab === 'orders' ? renderAdminOrdersTabHTML() : ''}
        ${adminCurrentTab === 'products' ? renderAdminProductsTabHTML() : ''}
        ${adminCurrentTab === 'settings' ? renderAdminSettingsTabHTML() : ''}
      </div>
    </div>
  `;
}

function setAdminTab(tab) {
  adminCurrentTab = tab;
  renderAdminView();
}

function renderAdminOrdersTabHTML() {
  let orders = window.appStore.getAllOrders();

  if (adminOrderFilter !== "all") {
    orders = orders.filter(o => o.orderStatus === adminOrderFilter);
  }

  return `
    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div class="flex flex-wrap items-center gap-1.5">
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}" onclick="filterAdminOrders('all')">Tất Cả</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'PENDING_PAYMENT' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}" onclick="filterAdminOrders('PENDING_PAYMENT')">Chờ Thanh Toán</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'AWAITING_CONFIRMATION' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}" onclick="filterAdminOrders('AWAITING_CONFIRMATION')">Chờ Duyệt</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'CONFIRMED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}" onclick="filterAdminOrders('CONFIRMED')">Đã Xác Nhận</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'PREPARING' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}" onclick="filterAdminOrders('PREPARING')">Đang Nấu</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'SHIPPING' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700'}" onclick="filterAdminOrders('SHIPPING')">Đang Giao</button>
          <button class="px-3 py-1.5 rounded-lg text-xs font-bold ${adminOrderFilter === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}" onclick="filterAdminOrders('COMPLETED')">Hoàn Tất</button>
        </div>
        <span class="text-xs text-slate-400 font-medium">Hiển thị ${orders.length} đơn</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <th class="p-3">Mã Đơn</th>
              <th class="p-3">Khách Hàng</th>
              <th class="p-3">Món Đặt</th>
              <th class="p-3">Tổng Tiền</th>
              <th class="p-3">Thanh Toán</th>
              <th class="p-3">Trạng Thái Đơn</th>
              <th class="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${orders.length === 0 ? `
              <tr><td colspan="7" class="p-8 text-center text-slate-400">Không có đơn hàng nào trong mục này.</td></tr>
            ` : orders.map(o => `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3 font-mono font-bold text-slate-900">${o.orderCode}</td>
                <td class="p-3">
                  <div class="font-bold text-slate-800">${o.customerName}</div>
                  <div class="text-[11px] text-slate-400">${o.phone}</div>
                </td>
                <td class="p-3">
                  <span class="font-medium text-slate-700">${o.items.length} món</span>
                  <div class="text-[11px] text-slate-400 line-clamp-1 max-w-[180px]">
                    ${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                </td>
                <td class="p-3 font-black text-emerald-600">${formatVND(o.total)}</td>
                <td class="p-3">
                  <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                    o.paymentStatus === 'AWAITING_VERIFICATION' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                  }">
                    ${o.paymentStatus === 'PAID' ? 'Đã Thanh Toán' : o.paymentStatus === 'AWAITING_VERIFICATION' ? 'Chờ Duyệt Tiền' : 'Chưa Trả'}
                  </span>
                  <div class="text-[10px] text-slate-400 mt-0.5">${o.paymentMethod === 'VIETQR' ? 'VietQR' : 'COD'}</div>
                </td>
                <td class="p-3">
                  <select 
                    class="bg-white border border-slate-200 text-slate-800 text-[11px] rounded-lg px-2 py-1 font-semibold focus:ring-1 focus:ring-emerald-500"
                    onchange="handleAdminChangeOrderStatus('${o.id}', this.value)"
                  >
                    ${Object.entries(window.STORE_CONFIG.orderStatuses).map(([code, meta]) => `
                      <option value="${code}" ${o.orderStatus === code ? 'selected' : ''}>${meta.label}</option>
                    `).join("")}
                  </select>
                </td>
                <td class="p-3 text-right space-x-1">
                  ${o.paymentStatus !== 'PAID' ? `
                    <button class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition" title="Xác nhận tiền đã vào tài khoản ngân hàng" onclick="handleAdminConfirmPayment('${o.id}')">
                      <i class="fa-solid fa-check mr-1"></i> Đã Nhận Tiền
                    </button>
                  ` : ''}
                  <button class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] transition" title="Xem mã VietQR và chi tiết" onclick="navigateTo('order-confirmation?orderId=${o.id}')">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterAdminOrders(status) {
  adminOrderFilter = status;
  renderAdminView();
}

function handleAdminChangeOrderStatus(orderId, newStatus) {
  window.appStore.updateOrderStatus(orderId, newStatus, `Admin đã đổi trạng thái thành ${newStatus}`, "Admin");
  showToast("Cập nhật trạng thái đơn hàng thành công!", "success");
  renderAdminView();
}

function handleAdminConfirmPayment(orderId) {
  window.appStore.confirmPayment(orderId, "Admin (Thủ công)");
  showToast("Đã duyệt xác nhận thanh toán cho đơn hàng!", "success");
  renderAdminView();
}

function renderAdminProductsTabHTML() {
  const products = window.appStore.getAllProducts();

  return `
    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 class="font-bold text-slate-800 text-sm">Danh Sách Món Trong Thực Đơn (${products.length})</h4>
        <button class="btn-primary text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-sm" onclick="openAddProductModal()">
          <i class="fa-solid fa-plus mr-1"></i> Thêm Món Mới
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <th class="p-3">Hình Ảnh</th>
              <th class="p-3">Tên Món</th>
              <th class="p-3">Danh Mục</th>
              <th class="p-3">Giá Bán</th>
              <th class="p-3">Đã Bán</th>
              <th class="p-3">Trạng Thái</th>
              <th class="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${products.map(p => `
              <tr class="hover:bg-slate-50 transition">
                <td class="p-3">
                  <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='./mon-an/sua-da.jpg'">
                </td>
                <td class="p-3 font-bold text-slate-800">
                  ${p.name}
                  ${p.badge ? `<span class="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">${p.badge}</span>` : ''}
                </td>
                <td class="p-3 text-slate-500">${getCategoryName(p.categoryId)}</td>
                <td class="p-3 font-extrabold text-emerald-600">${formatVND(p.basePrice)}</td>
                <td class="p-3 text-slate-500 font-medium">${p.soldCount || 0} phần</td>
                <td class="p-3">
                  <button 
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold transition ${p.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}"
                    onclick="handleToggleProductStatus('${p.id}')"
                  >
                    ${p.isAvailable ? '✓ Còn Hàng' : '✕ Tạm Hết'}
                  </button>
                </td>
                <td class="p-3 text-right space-x-1">
                  <button class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs" onclick="openProductDetailModal('${p.id}')" title="Xem trước">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs" onclick="handleDeleteProduct('${p.id}')" title="Xóa món">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleToggleProductStatus(productId) {
  const isAvailable = window.appStore.toggleProductAvailability(productId);
  showToast(`Đã chuyển trạng thái thành: ${isAvailable ? 'Còn Hàng' : 'Tạm Hết Hàng'}`, "info");
  renderAdminView();
  renderProducts();
}

function handleDeleteProduct(productId) {
  if (confirm("Bạn có chắc chắn muốn xóa món này khỏi thực đơn không?")) {
    window.appStore.deleteProduct(productId);
    showToast("Đã xóa món thành công!", "info");
    renderAdminView();
    renderProducts();
  }
}

function openAddProductModal() {
  const name = prompt("Nhập tên món ăn / thức uống mới:");
  if (!name) return;
  const price = prompt("Nhập giá bán (VND, ví dụ 35000):", "35000");
  if (!price) return;
  const image = prompt("Đường dẫn ảnh (ví dụ: ./mon-an/sua-da.jpg):", "./mon-an/sua-da.jpg");

  window.appStore.saveProduct({
    name,
    categoryId: "ca-phe",
    shortDescription: "Món mới thơm ngon được pha chế theo công thức riêng của quán.",
    description: "Nguyên liệu tươi ngon mỗi ngày, đảm bảo an toàn vệ sinh thực phẩm.",
    basePrice: Number(price) || 30000,
    image: image || "./mon-an/sua-da.jpg",
    sizes: [{ id: "M", name: "Size M", extraPrice: 0 }],
    isAvailable: true,
    isFeatured: true,
    badge: "Mới"
  });

  showToast(`Đã thêm món "${name}" vào thực đơn!`, "success");
  renderAdminView();
  renderProducts();
}

function renderAdminSettingsTabHTML() {
  const bank = window.STORE_CONFIG.bank;

  return `
    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm max-w-2xl space-y-4">
      <h4 class="font-bold text-slate-800 text-base pb-3 border-b border-slate-100">
        <i class="fa-solid fa-building-columns text-emerald-600 mr-1.5"></i> Cấu Hình Ngân Hàng Nhận Tiền VietQR
      </h4>
      <p class="text-xs text-slate-500">
        Hệ thống tự động sinh mã VietQR chuẩn Napas247 tương thích với hơn 40 ứng dụng ngân hàng và ví điện tử.
      </p>

      <form id="admin-bank-form" onsubmit="handleSaveBankSettings(event)" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Mã ngân hàng (Bin / VietQR Code):</label>
          <input type="text" id="bank-id-input" value="${bank.bankId}" class="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono">
          <span class="text-[10px] text-slate-400">Ví dụ: MB (Quân Đội), VCB (Vietcombank), TCB (Techcombank), ACB, VPB...</span>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Tên ngân hàng hiển thị:</label>
          <input type="text" id="bank-name-input" value="${bank.bankName}" class="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Số tài khoản thụ hưởng:</label>
          <input type="text" id="bank-acc-input" value="${bank.accountNo}" class="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold text-slate-900">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Tên chủ tài khoản (Viết hoa không dấu):</label>
          <input type="text" id="bank-owner-input" value="${bank.accountName}" class="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold">
        </div>
        <button type="submit" class="btn-primary text-white px-6 py-2.5 rounded-xl font-bold">
          Lưu Cấu Hình Ngân Hàng
        </button>
      </form>
    </div>
  `;
}

function handleSaveBankSettings(e) {
  e.preventDefault();
  const bankId = document.getElementById("bank-id-input")?.value.trim();
  const bankName = document.getElementById("bank-name-input")?.value.trim();
  const accountNo = document.getElementById("bank-acc-input")?.value.trim();
  const accountName = document.getElementById("bank-owner-input")?.value.trim();

  if (bankId) window.STORE_CONFIG.bank.bankId = bankId;
  if (bankName) window.STORE_CONFIG.bank.bankName = bankName;
  if (accountNo) window.STORE_CONFIG.bank.accountNo = accountNo;
  if (accountName) window.STORE_CONFIG.bank.accountName = accountName;

  showToast("Đã lưu cấu hình tài khoản VietQR thành công!", "success");
}

function resetToInitialData() {
  if (confirm("Khôi phục toàn bộ danh sách sản phẩm và đơn hàng về mặc định ban đầu?")) {
    localStorage.removeItem(window.STORE_CONFIG.storageKeys.PRODUCTS);
    localStorage.removeItem(window.STORE_CONFIG.storageKeys.ORDERS);
    localStorage.removeItem(window.STORE_CONFIG.storageKeys.CATEGORIES);
    window.location.reload();
  }
}

function bindAdminDashboardEvents() {
  // Bind dynamic inputs if needed
}

// Lắng nghe sự kiện toàn cục
function initEventListeners() {
  // Tìm kiếm thời gian thực
  const searchInput = document.getElementById("menu-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchKeyword = e.target.value;
      renderProducts();
    });
  }

  // Sắp xếp
  const sortSelect = document.getElementById("menu-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Đổi hình thức nhận hàng (Delivery vs Pickup)
  document.querySelectorAll('input[name="fulfillment_method"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      AppState.checkoutFulfillment = e.target.value;
      const addrSection = document.getElementById("checkout-address-section");
      if (addrSection) {
        if (AppState.checkoutFulfillment === "PICKUP") {
          addrSection.classList.add("hidden");
        } else {
          addrSection.classList.remove("hidden");
        }
      }
      renderCheckoutSummary();
    });
  });

  // Đổi phương thức thanh toán (VietQR vs COD)
  document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      AppState.checkoutPaymentMethod = e.target.value;
    });
  });
}
