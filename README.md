# 🌿 XANH VỊ QUÁN - WEBSITE BÁN THỨC UỐNG & MÓN ĂN TRỰC TUYẾN
> **Thức Uống Thanh Mát • Tròn Vị Bếp Nhà • Thanh Toán VietQR Tự Động**

Dự án website thương mại điện tử hoàn chỉnh phục vụ kinh doanh thức uống (cà phê, trà trái cây, nước ép nguyên chất, trà sữa) kết hợp điểm tâm sáng và cơm trưa văn phòng, được xây dựng theo chuẩn yêu cầu trong tài liệu `prompt_website_ban_nuoc_uong.md` và tích hợp toàn bộ **20 hình ảnh thực tế** trong thư mục `./mon-an/`.

---

## 🚀 1. Hướng Dẫn Khởi Chạy Nhanh (1 Click)

Dự án được thiết kế độc lập, **không phụ thuộc vào bất kỳ thư viện Node.js hay Python nào bên ngoài**. Bạn có thể chạy ngay trên mọi máy tính Windows:

### Cách 1: Mở Trực Tiếp Trình Duyệt (Nhanh nhất)
- Nhấp đúp chuột vào file **`start_website.bat`** hoặc mở trực tiếp file **`index.html`** bằng Google Chrome, Microsoft Edge, Firefox, Brave, v.v.

### Cách 2: Khởi chạy máy chủ cục bộ bằng PowerShell (Tích hợp sẵn)
- Mở PowerShell trong thư mục dự án và chạy lệnh:
  ```powershell
  powershell -ExecutionPolicy Bypass -File server.ps1
  ```
- Máy chủ cục bộ sẽ tự động khởi động tại địa chỉ: `http://localhost:8080` và mở ngay trình duyệt.

---

## 📂 2. Cấu Trúc Thư Mục Dự Án

```
d:\BAN NUOC\
├── mon-an\                         # 20 tệp hình ảnh món ăn & thức uống thực tế
│   ├── banh-canh-gio-heo.jpg
│   ├── banh-mi-thit-nuong.jpg
│   ├── bo-xao-bong-cai.jpg
│   ├── ca-ngan-chien-nuoc-mam.jpg
│   ├── ca-trung-sot-tieu.png
│   ├── heo-quay-banh-hoi.jpg
│   ├── hu-tieu-nam-vang.jpg
│   ├── luon-xao-sa-ot.jpg
│   ├── nui-xao-bo.jpg
│   ├── nuoc-ep-coc.jpg
│   ├── nuoc-ep-dua-hau.jpg
│   ├── nuoc-ep-oi.jpg
│   ├── pho-ga.jpg
│   ├── sua-da.jpg
│   ├── suon-heo-om-khoai-tay.jpg
│   ├── thit-heo-kho-mang.jpg
│   ├── thit-heo-kho-trung-cut.jpg
│   ├── thit-vien-trung-cut-sot-ca.jpg
│   ├── tra-gung-mat-ong.jpg
│   └── vit-kho-gung.jpg
│
├── css\
│   └── style.css                   # Định kiểu tùy biến, hoạt ảnh, glassmorphism, in hóa đơn
├── js\
│   ├── config.js                   # Cấu hình tập trung: Ngân hàng VietQR, phí ship, voucher, hotline
│   ├── data.js                     # 20+ sản phẩm và 7 danh mục ánh xạ toàn bộ ảnh trong mon-an/
│   ├── vietqr.js                   # Xử lý sinh mã QR Napas247 động, sao chép STK/mã đơn
│   ├── store.js                    # Quản lý trạng thái: Giỏ hàng, Đơn hàng, Audit Trail, Auth SHA-256
│   └── app.js                      # Điều hướng SPA, bộ lọc, tìm kiếm, modal tùy chọn, checkout, admin
├── index.html                      # Giao diện chính Single Page Application (Tailwind CSS, FontAwesome)
├── server.ps1                      # Máy chủ web HTTP nội bộ viết bằng PowerShell thuần
├── start_website.bat               # File khởi chạy 1-click cho người dùng Windows
├── .env.example                    # Mẫu biến môi trường cho môi trường Production (Node.js/PostgreSQL)
└── README.md                       # Tài liệu hướng dẫn chi tiết
```

---

## 🍽️ 3. Danh Mục & Thực Đơn Ánh Xạ Hình Ảnh

Hệ thống đã kết nối trực tiếp tất cả 20 hình ảnh trong thư mục `mon-an/` vào các danh mục cụ thể:

| STT | Tên Sản Phẩm | Danh Mục | File Ảnh Tương Ứng | Giá Bán (VND) |
|:---:|:---|:---|:---|:---:|
| 1 | Cà Phê Sữa Đá Sài Gòn | Cà phê | `sua-da.jpg` | 29.000 ₫ |
| 2 | Trà Gừng Mật Ong Ấm Nóng | Trà thảo mộc | `tra-gung-mat-ong.jpg` | 35.000 ₫ |
| 3 | Nước Ép Dưa Hấu Đỏ Tươi | Nước ép | `nuoc-ep-dua-hau.jpg` | 35.000 ₫ |
| 4 | Nước Ép Cóc Non Chua Ngọt | Nước ép | `nuoc-ep-coc.jpg` | 35.000 ₫ |
| 5 | Nước Ép Ổi Hồng Vitamin C | Nước ép | `nuoc-ep-oi.jpg` | 35.000 ₫ |
| 6 | Bánh Mì Thịt Nướng Giòn Rụm | Điểm tâm | `banh-mi-thit-nuong.jpg` | 35.000 ₫ |
| 7 | Phở Gà Ta Lá Chanh | Điểm tâm | `pho-ga.jpg` | 55.000 ₫ |
| 8 | Hủ Tiếu Nam Vang Thập Cẩm | Điểm tâm | `hu-tieu-nam-vang.jpg` | 55.000 ₫ |
| 9 | Bánh Canh Giò Heo Nước Trong | Điểm tâm | `banh-canh-gio-heo.jpg` | 55.000 ₫ |
| 10 | Bánh Hỏi Heo Quay Giòn Bì | Điểm tâm | `heo-quay-banh-hoi.jpg` | 59.000 ₫ |
| 11 | Nui Xào Bò Lúc Lắc | Điểm tâm | `nui-xao-bo.jpg` | 49.000 ₫ |
| 12 | Cơm Bò Xào Bông Cải Xanh | Cơm trưa | `bo-xao-bong-cai.jpg` | 55.000 ₫ |
| 13 | Cơm Sườn Heo Om Khoai Tây | Cơm trưa | `suon-heo-om-khoai-tay.jpg` | 52.000 ₫ |
| 14 | Cơm Thịt Viên Trứng Cút Sốt Cà | Cơm trưa | `thit-vien-trung-cut-sot-ca.jpg` | 48.000 ₫ |
| 15 | Cơm Ba Chỉ Kho Trứng Cút Nước Dừa | Cơm trưa | `thit-heo-kho-trung-cut.jpg` | 50.000 ₫ |
| 16 | Cơm Thịt Heo Kho Măng Giòn | Cơm trưa | `thit-heo-kho-mang.jpg` | 50.000 ₫ |
| 17 | Cơm Vịt Kho Gừng Thơm Cay | Cơm trưa | `vit-kho-gung.jpg` | 52.000 ₫ |
| 18 | Cơm Cá Ngần Chiên Mắm Tỏi Ớt | Cơm trưa | `ca-ngan-chien-nuoc-mam.jpg` | 48.000 ₫ |
| 19 | Cơm Cá Trứng Nauy Sốt Tiêu Đen | Cơm trưa | `ca-trung-sot-tieu.png` | 50.000 ₫ |
| 20 | Cơm Lươn Đồng Xào Sả Ớt Xứ Nghệ | Cơm trưa | `luon-xao-sa-ot.jpg` | 58.000 ₫ |
| 21 | Combo Sáng: Bánh Mì + Cà Phê | Combo | `banh-mi-thit-nuong.jpg` | 52.000 ₫ |
| 22 | Combo Trưa: Cơm Bò + Nước Ép Dưa Hấu | Combo | `bo-xao-bong-cai.jpg` | 75.000 ₫ |

---

## 💳 4. Luồng Thanh Toán VietQR Chuẩn Napas247

1. Khi khách hàng bấm đặt hàng và chọn hình thức **Chuyển khoản VietQR**:
   - Hệ thống tự động tạo mã đơn hàng duy nhất định dạng `XVQ-YYYYMMDD-XXXX`.
   - Sinh mã QR động chuẩn VietQR v2:
     ```
     https://img.vietqr.io/image/<MÃ_NGÂN_HÀNG>-<SỐ_TÀI_KHOẢN>-compact2.png?amount=<SỐ_TIỀN>&addInfo=<MÃ_ĐƠN_HÀNG>&accountName=<TÊN_CHỦ_TK>
     ```
   - Khách dùng bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank, BIDV, Agribank, ACB, MoMo, ZaloPay...) để quét mã.
   - Ứng dụng ngân hàng sẽ **tự động điền đúng chính xác số tiền và mã đơn hàng**.
   - Cung cấp nút sao chép thông minh: **Copy Số tài khoản**, **Copy Số tiền**, **Copy Nội dung chuyển khoản**.
2. **Quy tắc an toàn giao dịch:**
   - Hệ thống **không tự ý chuyển trạng thái thành "Đã thanh toán"** khi khách chỉ mới quét QR hoặc mở ứng dụng.
   - Đơn hàng được giữ ở trạng thái `Chờ thanh toán` (`PENDING_PAYMENT`).
   - Khách có thể bấm nút *"Tôi đã hoàn tất chuyển khoản"* để chuyển đơn sang `Chờ quán đối soát` (`AWAITING_CONFIRMATION`).
   - Quản trị viên/Thu ngân kiểm tra biến động số dư tài khoản ngân hàng và bấm nút *"Đã Nhận Tiền"* trong trang Quản trị để duyệt chính thức.

---

## 🔒 5. Tài Khoản Quản Trị Demo & Hướng Dẫn Admin

Để truy cập khu vực quản trị, chọn **Quản Trị** trên thanh điều hướng hoặc truy cập đường dẫn `#admin`:

- **Tên đăng nhập:** `admin`
- **Mật khẩu:** `admin123`
*(Mật khẩu được mã hóa và xác thực bảo mật bằng thuật toán SHA-256)*

### Các tính năng trong trang Admin:
- **Bảng thống kê:** Tổng doanh thu thực tế, số đơn hoàn tất, số đơn chờ xác nhận tiền VietQR, số lượng sản phẩm.
- **Quản lý đơn hàng:** Lọc đơn theo từng trạng thái, xem chi tiết từng món, xác nhận thanh toán thủ công, chuyển trạng thái chế biến/giao hàng.
- **Quản lý thực đơn:** Bật/tắt trạng thái Còn hàng / Tạm hết hàng theo thời gian thực, thêm món mới, xóa món.
- **Cấu hình ngân hàng VietQR:** Thay đổi mã ngân hàng, số tài khoản, tên chủ tài khoản thụ hưởng ngay trên giao diện mà không cần sửa code.

---

## 🔎 6. Tính Năng Tra Cứu Đơn Hàng Bảo Mật

Tại trang **Theo Dõi Đơn** (`#tracking`), người dùng nhập:
1. **Mã đơn hàng** (Ví dụ: `XVQ-20260927-1001`)
2. **Số điện thoại đặt món** (Ví dụ: `0908123456`)

> **Tính bảo mật:** Hệ thống bắt buộc phải khớp cả mã đơn và số điện thoại mới hiển thị thông tin địa chỉ và nhật ký đơn hàng, ngăn chặn việc người lạ đoán mã đơn để xem trộm thông tin cá nhân của khách.

---

## ✅ 7. Bảng Đối Chiếu Tiêu Chí Nghiệm Thu

| Tiêu Chí Nghiệm Thu (Prompt Mục 7) | Trạng Thái | Mô Tả Thực Hiện |
|:---|:---:|:---|
| Trang chủ, thực đơn, chi tiết, giỏ hàng, checkout, theo dõi đơn | Đạt | Hoàn chỉnh 100% SPA với định tuyến mượt mà. |
| Lọc danh mục, tìm kiếm và xem chi tiết sản phẩm hoạt động | Đạt | Tìm kiếm thời gian thực, lọc 7 danh mục, sắp xếp giá/tên. |
| Chọn tùy chọn (Size, đường, đá, topping), thêm/xóa giỏ | Đạt | Modal tương tác đầy đủ, tính tiền phụ thu tức thì. |
| Tổng tiền được tính chính xác bằng số nguyên VND | Đạt | Chuẩn hóa toàn bộ phép tính làm tròn VND, không sai lệch số thực. |
| Mã đơn hàng duy nhất | Đạt | Định dạng chuẩn `XVQ-YYYYMMDD-XXXX`. |
| Mã VietQR động theo số tiền và mã đơn | Đạt | Tích hợp chuẩn VietQR Napas247 QuickLink. |
| Không tự động đánh dấu đã thanh toán khi chưa đối soát | Đạt | Trạng thái Chờ thanh toán -> Duyệt thủ công hoặc webhook. |
| Tra cứu đơn an toàn bằng mã + SĐT | Đạt | Xác thực 2 lớp bảo vệ địa chỉ khách hàng. |
| Admin quản lý sản phẩm, đơn hàng, duyệt thanh toán | Đạt | Dashboard trực quan, xác thực mật khẩu SHA-256. |
| Giao diện responsive trên mobile, tablet, desktop | Đạt | Thanh Bottom Navigation thuận tiện thao tác 1 tay trên điện thoại. |
| README và tài liệu hướng dẫn đầy đủ | Đạt | Tài liệu chi tiết tiếng Việt và mẫu `.env.example`. |

---

## 🛠️ 8. Ghi Chú Khi Triển Khai Môi Trường Sản Xuất (Production)

Để đưa hệ thống vào vận hành thương mại với lưu lượng lớn:
1. **Cơ sở dữ liệu:** Chuyển từ LocalStorage/SQLite sang **PostgreSQL** để đồng bộ dữ liệu thời gian thực giữa nhiều thiết bị nhân viên.
2. **Webhook đối soát ngân hàng tự động:** Tích hợp Webhook từ các nhà cung cấp như **SePay.vn**, **Casso.vn** hoặc kết nối trực tiếp Open Banking của MB/Vietcombank:
   - Khi có tiền vào tài khoản đúng nội dung mã đơn hàng, backend nhận webhook và tự động chuyển `paymentStatus = "PAID"`.
   - Xác thực chữ ký số `HMAC-SHA256` của webhook ở tầng Backend để chống giả mạo thông báo.
3. **Cấu hình biến môi trường:** Sử dụng file `.env` theo mẫu trong `.env.example`.
