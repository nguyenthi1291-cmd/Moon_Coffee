/**
 * VietQR Generation and Payment Utilities
 * Hỗ trợ tạo mã VietQR chuẩn Napas247 động theo từng mã đơn hàng và số tiền.
 */

const VietQRService = {
  /**
   * Tạo URL ảnh VietQR chuẩn Napas247
   * @param {Object} params
   * @param {string} params.bankId - Mã định danh ngân hàng (MB, VCB, TCB, ACB, ...)
   * @param {string} params.accountNo - Số tài khoản thụ hưởng
   * @param {string} params.accountName - Tên chủ tài khoản (viết hoa không dấu)
   * @param {number} params.amount - Số tiền nguyên VND
   * @param {string} params.orderCode - Mã đơn hàng dùng làm nội dung chuyển khoản
   * @param {string} [params.template="compact2"] - Mẫu giao diện hiển thị VietQR
   */
  generateQRUrl({ bankId, accountNo, accountName, amount, orderCode, template = "compact2" }) {
    const cleanBank = bankId || window.STORE_CONFIG.bank.bankId;
    const cleanAccNo = accountNo || window.STORE_CONFIG.bank.accountNo;
    const cleanAccName = encodeURIComponent(accountName || window.STORE_CONFIG.bank.accountName);
    const cleanOrderCode = encodeURIComponent(orderCode || "");
    const cleanAmount = Math.round(Number(amount) || 0);

    // Chuẩn API VietQR QuickLink v2
    return `https://img.vietqr.io/image/${cleanBank}-${cleanAccNo}-${template}.png?amount=${cleanAmount}&addInfo=${cleanOrderCode}&accountName=${cleanAccName}`;
  },

  /**
   * Tạo chuỗi thông điệp quét QR cho fallback dự phòng
   */
  generateFallbackPayload({ bankId, accountNo, amount, orderCode }) {
    return `247|${bankId}|${accountNo}|${amount}|${orderCode}`;
  },

  /**
   * Sao chép văn bản vào clipboard với hiệu ứng phản hồi
   */
  async copyToClipboard(text, successMessage = "Đã sao chép vào bộ nhớ tạm!") {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback cho môi trường không có HTTPS hoặc file://
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      if (window.showToast) {
        window.showToast(successMessage, "success");
      }
      return true;
    } catch (err) {
      console.error("Không thể sao chép:", err);
      if (window.showToast) {
        window.showToast("Không thể tự động sao chép, vui lòng copy thủ công", "warning");
      }
      return false;
    }
  }
};

window.VietQRService = VietQRService;
