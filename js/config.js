/**
 * Configuration for XANH VỊ QUÁN (Fresh Drinks & Kitchen)
 * Chứa các thông tin cấu hình tập trung dễ dàng thay đổi khi triển khai thực tế.
 */

window.STORE_CONFIG = {
  // Thông tin thương hiệu
  brand: {
    name: "XANH VỊ QUÁN",
    shortName: "Xanh Vị",
    slogan: "Nước Mát Thanh Lành - Tròn Vị Bếp Nhà",
    description: "Chuyên phục vụ các dòng thức uống giải nhiệt nguyên chất, cà phê sạch pha máy và các món điểm tâm, cơm trưa nóng hổi giao tận nơi.",
    hotline: "1900 6868 - 0988.123.456",
    zalo: "0988123456",
    email: "contact@xanhviquan.vn",
    address: "168 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    openingHours: "07:00 - 22:00 (Mỗi ngày)",
    currency: "VND",
    currencySymbol: "₫",
  },

  // Cấu hình ngân hàng cho mã thanh toán VietQR động
  // Tuân thủ chuẩn VietQR (Napas247)
  bank: {
    bankId: "MB",               // Mã ngân hàng theo chuẩn VietQR (MB, VCB, TCB, ACB, VPB,...)
    bankName: "MBBank (Quân Đội)",
    accountNo: "0388998899",     // Số tài khoản người thụ hưởng (Demo)
    accountName: "TIEM NUOC XANH VI", // Tên chủ tài khoản (Không dấu)
    template: "compact2",        // Giao diện template VietQR (compact, compact2, qr_only)
    isDemo: true,               // Đánh dấu tài khoản demo
  },

  // Cấu hình vận chuyển & giao hàng
  shipping: {
    standardFee: 20000,         // Phí giao tiêu chuẩn (20.000đ)
    freeShippingThreshold: 200000, // Đơn từ 200.000đ miễn phí giao
    pickupFee: 0,               // Tự đến lấy: Miễn phí
    estimatedDeliveryMinutes: "25 - 35 phút",
  },

  // Mã giảm giá khuyến mãi (Voucher)
  promotions: [
    {
      code: "XANHXINH",
      description: "Giảm 10% cho đơn hàng từ 100.000đ",
      minOrder: 100000,
      discountPercent: 10,
      maxDiscount: 30000,
    },
    {
      code: "FREESHIP",
      description: "Miễn phí giao hàng cho mọi đơn từ 50.000đ",
      minOrder: 50000,
      freeShipping: true,
    },
    {
      code: "COMBOVUI",
      description: "Giảm trực tiếp 20.000đ cho đơn từ 150.000đ",
      minOrder: 150000,
      discountAmount: 20000,
    }
  ],

  // Cấu hình Admin Demo
  admin: {
    username: "admin",
    // SHA-256 của chuỗi "admin123"
    passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  },

  // Các trạng thái đơn hàng (Khớp với prompt mục 3.7)
  orderStatuses: {
    PENDING_PAYMENT: { code: "PENDING_PAYMENT", label: "Chờ thanh toán QR", color: "amber", icon: "clock" },
    AWAITING_CONFIRMATION: { code: "AWAITING_CONFIRMATION", label: "Chờ đối soát & duyệt", color: "blue", icon: "eye" },
    CONFIRMED: { code: "CONFIRMED", label: "Đã xác nhận", color: "emerald", icon: "check-circle" },
    PREPARING: { code: "PREPARING", label: "Đang pha chế & nấu", color: "indigo", icon: "coffee" },
    SHIPPING: { code: "SHIPPING", label: "Đang giao hàng", color: "purple", icon: "truck" },
    COMPLETED: { code: "COMPLETED", label: "Hoàn tất thành công", color: "green", icon: "package-check" },
    CANCELLED: { code: "CANCELLED", label: "Đã hủy", color: "red", icon: "x-circle" }
  },

  // Khóa lưu trữ LocalStorage
  storageKeys: {
    CART: "xvq_cart_v1",
    ORDERS: "xvq_orders_v1",
    PRODUCTS: "xvq_custom_products_v1",
    CATEGORIES: "xvq_custom_categories_v1",
    ADMIN_SESSION: "xvq_admin_session_v1",
  }
};
