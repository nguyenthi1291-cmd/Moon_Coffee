/**
 * Store & State Management for XANH VỊ QUÁN
 * Đảm bảo tính toán chính xác tiền nguyên VND, lưu trữ giỏ hàng, đơn hàng và danh mục.
 */

class AppStore {
  constructor() {
    this.initProducts();
    this.initCategories();
    this.initOrders();
    this.initCart();
  }

  // --- 1. SẢN PHẨM & DANH MỤC ---
  initProducts() {
    try {
      const stored = localStorage.getItem(window.STORE_CONFIG.storageKeys.PRODUCTS);
      if (stored) {
        this.products = JSON.parse(stored);
      } else {
        this.products = [...window.SEED_PRODUCTS];
        this.saveProductsToStorage();
      }
    } catch (e) {
      this.products = [...window.SEED_PRODUCTS];
    }
  }

  saveProductsToStorage() {
    localStorage.setItem(window.STORE_CONFIG.storageKeys.PRODUCTS, JSON.stringify(this.products));
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  saveProduct(productData) {
    if (productData.id) {
      const idx = this.products.findIndex(p => p.id === productData.id);
      if (idx !== -1) {
        this.products[idx] = { ...this.products[idx], ...productData, updatedAt: new Date().toISOString() };
      }
    } else {
      const newId = "prod-" + Date.now();
      const newProduct = {
        ...productData,
        id: newId,
        slug: this.slugify(productData.name),
        isAvailable: productData.isAvailable !== false,
        soldCount: 0,
        rating: 5.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.products.unshift(newProduct);
    }
    this.saveProductsToStorage();
    return true;
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProductsToStorage();
    return true;
  }

  toggleProductAvailability(id) {
    const prod = this.getProductById(id);
    if (prod) {
      prod.isAvailable = !prod.isAvailable;
      this.saveProductsToStorage();
      return prod.isAvailable;
    }
    return false;
  }

  initCategories() {
    try {
      const stored = localStorage.getItem(window.STORE_CONFIG.storageKeys.CATEGORIES);
      if (stored) {
        this.categories = JSON.parse(stored);
      } else {
        this.categories = [...window.SEED_CATEGORIES];
        localStorage.setItem(window.STORE_CONFIG.storageKeys.CATEGORIES, JSON.stringify(this.categories));
      }
    } catch (e) {
      this.categories = [...window.SEED_CATEGORIES];
    }
  }

  getAllCategories() {
    return this.categories;
  }

  // --- 2. GIỎ HÀNG (CART) ---
  initCart() {
    try {
      const stored = localStorage.getItem(window.STORE_CONFIG.storageKeys.CART);
      this.cart = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.cart = [];
    }
  }

  saveCartToStorage() {
    localStorage.setItem(window.STORE_CONFIG.storageKeys.CART, JSON.stringify(this.cart));
  }

  getCartItems() {
    return this.cart;
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  addToCart({ product, size, sugar, ice, toppings = [], note = "", quantity = 1 }) {
    // Tính toán đơn giá từng món chuẩn nguyên VND
    const basePrice = Math.round(Number(product.basePrice) || 0);
    const sizeExtra = size ? Math.round(Number(size.extraPrice) || 0) : 0;
    const toppingTotal = toppings.reduce((sum, t) => sum + Math.round(Number(t.price) || 0), 0);
    const unitPrice = basePrice + sizeExtra + toppingTotal;

    // Tạo ID duy nhất cho biến thể của món trong giỏ
    const toppingKey = toppings.map(t => t.id).sort().join(",");
    const itemId = `${product.id}_${size ? size.id : 'default'}_${sugar || ''}_${ice || ''}_${toppingKey}_${note.trim()}`;

    const existingIndex = this.cart.findIndex(i => i.itemId === itemId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
      this.cart[existingIndex].totalPrice = this.cart[existingIndex].quantity * this.cart[existingIndex].unitPrice;
    } else {
      this.cart.push({
        itemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.categoryId,
        basePrice,
        size,
        sugar,
        ice,
        toppings,
        note: note.trim(),
        unitPrice,
        quantity: Math.max(1, quantity),
        totalPrice: unitPrice * Math.max(1, quantity),
        addedAt: new Date().toISOString()
      });
    }

    this.saveCartToStorage();
    return true;
  }

  updateQuantity(itemId, delta) {
    const item = this.cart.find(i => i.itemId === itemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(itemId);
    } else {
      item.totalPrice = item.quantity * item.unitPrice;
      this.saveCartToStorage();
    }
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter(i => i.itemId !== itemId);
    this.saveCartToStorage();
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
  }

  // Tính tạm tính
  calculateSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  // Tính phí giao hàng
  calculateDeliveryFee(fulfillmentMethod, subtotal) {
    if (fulfillmentMethod === "PICKUP") return 0;
    if (subtotal >= window.STORE_CONFIG.shipping.freeShippingThreshold) return 0;
    return window.STORE_CONFIG.shipping.standardFee;
  }

  // Tính chiết khấu khuyến mãi
  calculateDiscount(voucherCode, subtotal, deliveryFee) {
    if (!voucherCode) return 0;
    const voucher = window.STORE_CONFIG.promotions.find(p => p.code.toUpperCase() === voucherCode.toUpperCase().trim());
    if (!voucher) return 0;
    if (subtotal < (voucher.minOrder || 0)) return 0;

    if (voucher.freeShipping) {
      return deliveryFee;
    }
    if (voucher.discountPercent) {
      const discount = Math.round((subtotal * voucher.discountPercent) / 100);
      return voucher.maxDiscount ? Math.min(discount, voucher.maxDiscount) : discount;
    }
    if (voucher.discountAmount) {
      return Math.min(voucher.discountAmount, subtotal);
    }
    return 0;
  }

  // Tính tổng tiền toàn bộ đơn hàng (Chắc chắn là số nguyên VND)
  calculateOrderTotal({ fulfillmentMethod = "DELIVERY", voucherCode = "" }) {
    const subtotal = this.calculateSubtotal();
    if (subtotal === 0) return { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };

    const deliveryFee = this.calculateDeliveryFee(fulfillmentMethod, subtotal);
    const discount = this.calculateDiscount(voucherCode, subtotal, deliveryFee);
    const total = Math.max(0, subtotal + deliveryFee - discount);

    return {
      subtotal: Math.round(subtotal),
      deliveryFee: Math.round(deliveryFee),
      discount: Math.round(discount),
      total: Math.round(total)
    };
  }

  // --- 3. ĐƠN HÀNG (ORDERS) ---
  initOrders() {
    try {
      const stored = localStorage.getItem(window.STORE_CONFIG.storageKeys.ORDERS);
      if (stored) {
        this.orders = JSON.parse(stored);
      } else {
        // Tạo 2 đơn mẫu để hệ thống có sẵn dữ liệu test đẹp mắt
        this.orders = this.createSeedOrders();
        localStorage.setItem(window.STORE_CONFIG.storageKeys.ORDERS, JSON.stringify(this.orders));
      }
    } catch (e) {
      this.orders = [];
    }
  }

  createSeedOrders() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");

    return [
      {
        id: "ord-sample-01",
        orderCode: `XVQ-${dateStr}-1001`,
        customerName: "Nguyễn Văn An",
        phone: "0908123456",
        deliveryAddress: "Phòng 802, Tòa nhà Bitexco, 2 Hải Triều, P. Bến Nghé, Quận 1, TP. HCM",
        fulfillmentMethod: "DELIVERY",
        scheduledAt: "ASAP",
        note: "Giao trước 11h30 giúp mình, gọi lễ tân nhận nhé.",
        items: [
          {
            itemId: "drk-001_L",
            productId: "drk-001",
            name: "Cà Phê Sữa Đá Sài Gòn",
            image: "./mon-an/sua-da.jpg",
            size: { name: "Size L (Lớn + Sảng khoái)", extraPrice: 6000 },
            sugar: "70% Ít ngọt",
            ice: "100% Bình thường",
            toppings: [],
            unitPrice: 35000,
            quantity: 2,
            totalPrice: 70000
          },
          {
            itemId: "food-001_STD",
            productId: "food-001",
            name: "Bánh Mì Thịt Nướng Giòn Rụm",
            image: "./mon-an/banh-mi-thit-nuong.jpg",
            size: { name: "Phần Tiêu Chuẩn (2 xiên thịt)", extraPrice: 0 },
            options: "Cay vừa, đầy đủ rau ngò",
            unitPrice: 35000,
            quantity: 2,
            totalPrice: 70000
          }
        ],
        subtotal: 140000,
        deliveryFee: 20000,
        discount: 14000,
        discountCode: "XANHXINH",
        total: 146000,
        paymentMethod: "VIETQR",
        paymentStatus: "PAID",
        orderStatus: "PREPARING",
        statusHistory: [
          { status: "PENDING_PAYMENT", note: "Khách hàng tạo đơn và chọn thanh toán VietQR", createdAt: new Date(Date.now() - 3600000).toISOString(), updatedBy: "Khách hàng" },
          { status: "CONFIRMED", note: "Hệ thống xác nhận đã nhận chuyển khoản 146.000đ", createdAt: new Date(Date.now() - 3000000).toISOString(), updatedBy: "Admin" },
          { status: "PREPARING", note: "Bếp và quầy pha chế bắt đầu làm món", createdAt: new Date(Date.now() - 1500000).toISOString(), updatedBy: "Admin" }
        ],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1500000).toISOString()
      },
      {
        id: "ord-sample-02",
        orderCode: `XVQ-${dateStr}-1002`,
        customerName: "Trần Thị Mai",
        phone: "0912345678",
        deliveryAddress: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM",
        fulfillmentMethod: "DELIVERY",
        scheduledAt: "ASAP",
        note: "Mang cho mình thêm ít tương ớt.",
        items: [
          {
            itemId: "combo-002_STD",
            productId: "combo-002",
            name: "Combo Trưa Thanh Lành: Cơm Bò Xào Bông Cải + Nước Ép Dưa Hấu",
            image: "./mon-an/bo-xao-bong-cai.jpg",
            size: { name: "Combo Tiêu Chuẩn", extraPrice: 0 },
            unitPrice: 75000,
            quantity: 1,
            totalPrice: 75000
          }
        ],
        subtotal: 75000,
        deliveryFee: 20000,
        discount: 0,
        discountCode: "",
        total: 95000,
        paymentMethod: "COD",
        paymentStatus: "UNPAID",
        orderStatus: "SHIPPING",
        statusHistory: [
          { status: "CONFIRMED", note: "Đã xác nhận đơn COD qua điện thoại", createdAt: new Date(Date.now() - 2400000).toISOString(), updatedBy: "Admin" },
          { status: "PREPARING", note: "Món đã chuẩn bị xong, đóng gói hộp sinh học", createdAt: new Date(Date.now() - 1200000).toISOString(), updatedBy: "Bếp" },
          { status: "SHIPPING", note: "Tài xế nhận hàng và đang di chuyển", createdAt: new Date(Date.now() - 600000).toISOString(), updatedBy: "Tài xế giao vận" }
        ],
        createdAt: new Date(Date.now() - 2400000).toISOString(),
        updatedAt: new Date(Date.now() - 600000).toISOString()
      }
    ];
  }

  saveOrdersToStorage() {
    localStorage.setItem(window.STORE_CONFIG.storageKeys.ORDERS, JSON.stringify(this.orders));
  }

  getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  getOrderByCode(orderCode) {
    return this.orders.find(o => o.orderCode.toUpperCase() === orderCode.toUpperCase().trim());
  }

  // Tra cứu an toàn: Phải khớp cả mã đơn và số điện thoại
  lookupOrder(orderCode, phone) {
    const cleanCode = (orderCode || "").toUpperCase().trim();
    const cleanPhone = (phone || "").replace(/\s+/g, "").trim();

    return this.orders.find(o => 
      o.orderCode.toUpperCase() === cleanCode && 
      o.phone.replace(/\s+/g, "").trim() === cleanPhone
    );
  }

  // Tạo đơn hàng mới an toàn
  createOrder(orderData) {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `XVQ-${datePart}-${randomPart}`;
    const orderId = "ord-" + Date.now();

    // Tính toán lại tổng tiền từ giỏ hàng để tránh gian lận giá
    const pricing = this.calculateOrderTotal({
      fulfillmentMethod: orderData.fulfillmentMethod,
      voucherCode: orderData.voucherCode
    });

    const isVietQR = orderData.paymentMethod === "VIETQR";

    const newOrder = {
      id: orderId,
      orderCode,
      customerName: orderData.customerName.trim(),
      phone: orderData.phone.trim(),
      deliveryAddress: orderData.deliveryAddress ? orderData.deliveryAddress.trim() : "Nhận tại quán",
      fulfillmentMethod: orderData.fulfillmentMethod,
      scheduledAt: orderData.scheduledAt || "ASAP",
      note: orderData.note ? orderData.note.trim() : "",
      items: [...this.cart],
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      discount: pricing.discount,
      discountCode: orderData.voucherCode || "",
      total: pricing.total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: isVietQR ? "UNPAID" : "UNPAID",
      orderStatus: isVietQR ? "PENDING_PAYMENT" : "CONFIRMED",
      statusHistory: [
        {
          status: isVietQR ? "PENDING_PAYMENT" : "CONFIRMED",
          note: isVietQR 
            ? "Đơn hàng đã tạo thành công, chờ khách hàng quét mã VietQR chuyển khoản" 
            : "Đơn hàng COD đã ghi nhận vào hệ thống",
          createdAt: now.toISOString(),
          updatedBy: "Khách hàng"
        }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    this.orders.unshift(newOrder);
    this.saveOrdersToStorage();

    // Xóa giỏ hàng sau khi đặt thành công
    this.clearCart();

    return newOrder;
  }

  // Khách hàng bấm: "Tôi đã hoàn tất chuyển khoản" -> Đổi sang Awaiting Confirmation
  markPaymentTransferred(orderId) {
    const order = this.getOrderById(orderId);
    if (!order) return false;

    if (order.paymentStatus === "PAID") return true;

    order.paymentStatus = "AWAITING_VERIFICATION";
    order.orderStatus = "AWAITING_CONFIRMATION";
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: "AWAITING_CONFIRMATION",
      note: "Khách hàng thông báo đã chuyển khoản thành công. Đang chờ nhân viên đối soát ngân hàng.",
      createdAt: new Date().toISOString(),
      updatedBy: "Khách hàng"
    });

    this.saveOrdersToStorage();
    return true;
  }

  // Quản trị viên cập nhật trạng thái đơn
  updateOrderStatus(orderId, newStatus, note = "", updatedBy = "Admin") {
    const order = this.getOrderById(orderId);
    if (!order) return false;

    order.orderStatus = newStatus;
    if (newStatus === "COMPLETED" && order.paymentMethod === "COD") {
      order.paymentStatus = "PAID";
    }
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      note: note || `Cập nhật trạng thái thành: ${window.STORE_CONFIG.orderStatuses[newStatus]?.label || newStatus}`,
      createdAt: new Date().toISOString(),
      updatedBy
    });

    this.saveOrdersToStorage();
    return true;
  }

  // Quản trị viên duyệt thanh toán tiền vào tài khoản
  confirmPayment(orderId, updatedBy = "Admin") {
    const order = this.getOrderById(orderId);
    if (!order) return false;

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: "CONFIRMED",
      note: "Quản trị viên đã kiểm tra tài khoản ngân hàng và xác nhận nhận đủ tiền.",
      createdAt: new Date().toISOString(),
      updatedBy
    });

    this.saveOrdersToStorage();
    return true;
  }

  // Hủy đơn hàng
  cancelOrder(orderId, reason = "Khách hủy hoặc hết nguyên liệu", updatedBy = "Admin") {
    const order = this.getOrderById(orderId);
    if (!order) return false;

    order.orderStatus = "CANCELLED";
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: "CANCELLED",
      note: `Đơn hàng đã hủy: ${reason}`,
      createdAt: new Date().toISOString(),
      updatedBy
    });

    this.saveOrdersToStorage();
    return true;
  }

  // --- 4. ADMIN AUTHENTICATION ---
  async checkAdminAuth(username, password) {
    if (username !== window.STORE_CONFIG.admin.username) return false;
    
    // Hash password with SHA-256
    const hash = await this.sha256(password);
    return hash === window.STORE_CONFIG.admin.passwordHash;
  }

  async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

window.appStore = new AppStore();
