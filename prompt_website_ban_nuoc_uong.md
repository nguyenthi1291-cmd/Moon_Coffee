# PROMPT XÂY DỰNG WEBSITE BÁN NƯỚC UỐNG

> **Vai trò:** Bạn là Senior Full-stack Developer kiêm UI/UX Designer. Hãy xây dựng một website bán nước uống hoàn chỉnh, có thể chạy được, giao diện tiếng Việt, ưu tiên trải nghiệm trên điện thoại và dễ quản trị dữ liệu.
>
> **Tên dự án:** `[ĐIỀN TÊN THƯƠNG HIỆU]`
>
> **Mục tiêu:** Tạo website giới thiệu sản phẩm, nhận đơn hàng, cho khách tra cứu trạng thái đơn và hỗ trợ thanh toán bằng QR chuyển khoản. Không chỉ tạo giao diện minh họa; hãy triển khai luồng hoạt động thực tế trong phạm vi công nghệ được chọn.

---

## 1. Yêu cầu làm việc

1. Trước tiên, kiểm tra cấu trúc thư mục và các file hiện có. Nếu dự án đã có mã nguồn, hãy kế thừa và tránh ghi đè những phần không liên quan.
2. Tự lựa chọn cấu trúc và công nghệ phù hợp với môi trường hiện có. Nếu bắt đầu từ đầu, ưu tiên:
   - Frontend: React + TypeScript + Vite.
   - UI: Tailwind CSS (hoặc CSS module nếu dự án không hỗ trợ Tailwind).
   - Backend: Node.js + Express, nếu cần API.
   - Database: SQLite cho bản chạy local; thiết kế lớp truy cập dữ liệu để có thể chuyển sang PostgreSQL.
3. Viết mã nguồn hoàn chỉnh, chia component rõ ràng, dễ bảo trì; không để nút bấm hoặc chức năng chính ở trạng thái giả lập.
4. Nếu chưa có thông tin thương hiệu, hình ảnh, giá bán hoặc tài khoản ngân hàng, dùng dữ liệu mẫu có ghi rõ là mẫu và gom cấu hình vào một nơi để dễ thay thế.
5. Sau khi triển khai, chạy kiểm tra/lint/build nếu môi trường hỗ trợ; sửa các lỗi phát hiện được. Cung cấp hướng dẫn cài đặt và chạy dự án.
6. Không tự ý đưa thông tin thanh toán thật vào mã nguồn. Không lưu thông tin nhạy cảm trong frontend.

## 2. Định hướng giao diện và trải nghiệm (UI/UX)

- Phong cách hiện đại, sạch sẽ, tươi mát, tạo cảm giác ngon miệng và đáng tin cậy.
- Bố cục thoáng, hình ảnh sản phẩm nổi bật, typography dễ đọc, màu sắc nhất quán với thương hiệu.
- Responsive đầy đủ cho desktop, tablet và mobile; ưu tiên thao tác một tay trên điện thoại.
- Có trạng thái loading, empty state, lỗi và thông báo thành công/thất bại rõ ràng.
- Có thanh điều hướng dễ hiểu: **Trang chủ – Thực đơn – Theo dõi đơn – Liên hệ**.
- Header có logo/tên thương hiệu, tìm kiếm, biểu tượng giỏ hàng và số lượng sản phẩm trong giỏ.
- Footer có thông tin cửa hàng, giờ hoạt động, địa chỉ, hotline/email và liên kết mạng xã hội (dùng dữ liệu mẫu nếu chưa có).
- Dùng ảnh sản phẩm phù hợp, không dùng ảnh hỏng. Nếu chưa có ảnh thật, sử dụng ảnh placeholder chất lượng tốt và cho phép thay thế dễ dàng.

## 3. Cấu trúc trang

### 3.1. Trang chủ

- Hero/banner giới thiệu thương hiệu, thông điệp ngắn và nút **Xem thực đơn**.
- Khu vực danh mục nổi bật.
- Khu vực sản phẩm bán chạy / được đề xuất.
- Khu vực ưu đãi hoặc combo (nếu có dữ liệu).
- Giới thiệu ngắn về cửa hàng và lời kêu gọi đặt hàng.
- Các nút điều hướng phải hoạt động.

### 3.2. Trang thực đơn / sản phẩm

Hiển thị danh sách đồ uống theo danh mục, ví dụ:
- Cà phê
- Trà trái cây
- Trà sữa
- Nước ép
- Sinh tố
- Đá xay
- Nước đóng chai
- Combo

Danh mục phải được lấy từ dữ liệu, không hard-code rải rác trong giao diện. Cho phép:
- Lọc theo danh mục.
- Tìm kiếm theo tên sản phẩm.
- Sắp xếp theo tên hoặc giá.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.

Mỗi thẻ sản phẩm cần có:
- Hình ảnh.
- Tên nước uống.
- Danh mục.
- Mô tả ngắn.
- Giá bán (VND, định dạng dễ đọc).
- Nhãn tùy chọn như “Bán chạy”, “Mới”, “Tạm hết hàng”.
- Nút **Xem chi tiết** và **Thêm vào giỏ**.

### 3.3. Trang chi tiết sản phẩm

- Ảnh lớn và các ảnh phụ nếu có.
- Tên, mô tả đầy đủ, giá.
- Tùy chọn dung tích/size (ví dụ S/M/L) và phần giá chênh lệch.
- Tùy chọn đường, đá (nếu sản phẩm hỗ trợ).
- Số lượng.
- Ghi chú riêng cho món.
- Nút thêm vào giỏ; kiểm tra dữ liệu hợp lệ trước khi thêm.
- Sản phẩm hết hàng phải không thể đặt.

### 3.4. Giỏ hàng

- Danh sách món, ảnh, lựa chọn size/đường/đá, ghi chú, đơn giá, số lượng và thành tiền.
- Tăng/giảm số lượng, xóa món.
- Tạm tính, phí giao hàng (có thể cấu hình), giảm giá (nếu có), tổng thanh toán.
- Giữ giỏ hàng khi tải lại trang bằng localStorage (không lưu thông tin thanh toán nhạy cảm).
- Kiểm tra giỏ hàng rỗng và số lượng hợp lệ.
- Nút **Tiến hành đặt hàng**.

### 3.5. Trang đặt hàng / checkout

Form đặt hàng gồm:
- Họ và tên người nhận.
- Số điện thoại.
- Địa chỉ giao hàng (có thể tách tỉnh/thành, quận/huyện, địa chỉ chi tiết nếu phù hợp).
- Hình thức nhận hàng: giao tận nơi hoặc tự đến lấy.
- Thời gian nhận hàng: sớm nhất hoặc chọn thời gian (nếu hỗ trợ).
- Ghi chú đơn hàng.
- Phương thức thanh toán: **QR chuyển khoản** hoặc **Thanh toán khi nhận hàng (COD)** nếu cửa hàng bật tính năng này.

Yêu cầu:
- Validate các trường bắt buộc và định dạng số điện thoại.
- Hiển thị tóm tắt đơn hàng và tổng tiền trước khi xác nhận.
- Tạo mã đơn hàng duy nhất, dễ đọc, ví dụ `DRK-20260927-0001`.
- Khi khách xác nhận, lưu đơn hàng vào backend/database nếu có; không chỉ hiển thị thông báo giả.
- Chống tạo đơn trùng do khách bấm nút nhiều lần (disable nút trong lúc gửi, dùng idempotency key nếu có backend).
- Sau khi tạo đơn, chuyển tới trang xác nhận đơn và hướng dẫn thanh toán tương ứng.

### 3.6. Thanh toán bằng QR code

Xây dựng luồng thanh toán QR chuyển khoản, ưu tiên chuẩn VietQR nếu thông tin ngân hàng được cung cấp.

Thông tin cấu hình cần có:
- Tên ngân hàng / mã ngân hàng.
- Số tài khoản.
- Tên chủ tài khoản.
- Nội dung chuyển khoản: tự động chứa mã đơn hàng.
- Số tiền cần thanh toán.
- URL tạo QR hoặc thư viện tạo QR phù hợp.

Yêu cầu:
- QR phải được tạo từ cấu hình và dữ liệu đơn hàng; không dùng ảnh QR tĩnh cho mọi đơn.
- Hiển thị QR rõ ràng, số tiền, ngân hàng, số tài khoản, tên người nhận và **nội dung chuyển khoản chính xác**.
- Có nút sao chép số tài khoản, số tiền và nội dung chuyển khoản.
- Hiển thị hướng dẫn mở ứng dụng ngân hàng và quét QR.
- Có trạng thái: **Chờ thanh toán – Đã thanh toán – Thanh toán thất bại/đã hủy**.
- Không được tự động đánh dấu “Đã thanh toán” chỉ vì khách đã mở hoặc quét QR.
- Nếu chưa tích hợp cổng/đối soát ngân hàng, hiển thị rõ “Đang chờ xác nhận thanh toán”; cho phép nhân viên xác nhận trong trang quản trị.
- Nếu tích hợp webhook từ nhà cung cấp thanh toán, phải xác minh chữ ký webhook ở backend và đối chiếu mã đơn, số tiền, trạng thái; không tin dữ liệu do frontend tự gửi.
- Không đưa secret key/API key vào mã frontend.
- Có hướng dẫn cấu hình và ghi rõ những phần cần thông tin từ ngân hàng/nhà cung cấp để vận hành thanh toán tự động.

### 3.7. Trang theo dõi đơn hàng

- Cho phép khách tra cứu bằng mã đơn hàng và số điện thoại (hoặc phương thức xác thực phù hợp).
- Không để người khác xem thông tin cá nhân của đơn hàng chỉ bằng mã đơn.
- Hiển thị mã đơn, thời gian đặt, danh sách món, tổng tiền, phương thức thanh toán và trạng thái.
- Timeline trạng thái đề xuất:
  1. Đơn hàng đã được tiếp nhận
  2. Chờ thanh toán (nếu thanh toán QR)
  3. Đã xác nhận
  4. Đang pha chế / chuẩn bị
  5. Đang giao (nếu giao hàng)
  6. Hoàn tất
  7. Đã hủy
- Trạng thái phải phản ánh dữ liệu thực từ backend. Nếu chưa có backend, tạo bản demo local có ghi rõ giới hạn và không giả vờ là hệ thống đang vận hành thật.

### 3.8. Trang quản trị (Admin)

Tạo khu vực quản trị cơ bản, tách khỏi giao diện khách hàng:
- Đăng nhập quản trị; không hard-code mật khẩu trong frontend.
- Dashboard: số đơn, doanh thu theo trạng thái phù hợp, đơn mới.
- Quản lý sản phẩm: thêm/sửa/xóa, tên, mô tả, ảnh, danh mục, giá, size, trạng thái còn hàng.
- Quản lý danh mục: thêm/sửa/xóa/ẩn hiện.
- Quản lý đơn: xem chi tiết, cập nhật trạng thái, xác nhận thanh toán thủ công, hủy đơn.
- Lưu lịch sử thay đổi trạng thái đơn hàng (thời điểm, trạng thái, người thực hiện nếu có).
- Các thao tác quản trị phải được kiểm tra quyền ở backend; ẩn nút ở frontend không được xem là bảo mật.
- Có xác nhận trước khi xóa hoặc hủy các dữ liệu quan trọng.

## 4. Mô hình dữ liệu đề xuất

Thiết kế dữ liệu tối thiểu gồm:

### Category
- `id`
- `name`
- `slug`
- `description`
- `image`
- `isActive`
- `sortOrder`

### Product
- `id`
- `categoryId`
- `name`
- `slug`
- `shortDescription`
- `description`
- `image`
- `gallery`
- `basePrice`
- `sizes` (size và phần giá cộng thêm)
- `options` (đường, đá hoặc tùy chọn khác)
- `isAvailable`
- `isFeatured`
- `createdAt`
- `updatedAt`

### Order
- `id`
- `orderCode`
- `customerName`
- `phone`
- `deliveryAddress`
- `fulfillmentMethod`
- `scheduledAt`
- `note`
- `items`
- `subtotal`
- `deliveryFee`
- `discount`
- `total`
- `paymentMethod`
- `paymentStatus`
- `orderStatus`
- `createdAt`
- `updatedAt`

### OrderStatusHistory
- `id`
- `orderId`
- `status`
- `note`
- `createdAt`
- `updatedBy`

### AdminUser
- `id`
- `username`
- `passwordHash`
- `role`
- `createdAt`

Giá tiền phải được xử lý nhất quán bằng số nguyên VND (không dùng số thực cho phép tính tiền). Tổng tiền phải được tính lại và xác thực ở backend, không tin tổng tiền gửi từ trình duyệt.

## 5. Yêu cầu kỹ thuật và bảo mật

- Tổ chức mã nguồn theo cấu trúc rõ ràng: components, pages, services/API, types, data/config.
- Dùng TypeScript nếu chọn React.
- Tách dữ liệu sản phẩm mẫu khỏi component.
- Có xử lý lỗi API, validate dữ liệu ở cả frontend và backend.
- Bảo vệ các API quản trị bằng xác thực và phân quyền.
- Mật khẩu phải được hash; dùng biến môi trường cho cấu hình bí mật.
- Chống truy cập trái phép vào đơn hàng; giới hạn dữ liệu trả về theo quyền.
- Không lưu số thẻ, mật khẩu ngân hàng hoặc thông tin đăng nhập ngân hàng.
- Kiểm tra tồn kho/trạng thái sản phẩm tại thời điểm tạo đơn.
- Không cho phép khách tự sửa giá hoặc trạng thái thanh toán bằng cách gửi request.
- Có `.env.example` chứa tên biến cần thiết nhưng không chứa secret thật.
- Có thông báo lỗi thân thiện, không để lộ stack trace hoặc thông tin nhạy cảm cho người dùng.

## 6. Dữ liệu mẫu ban đầu

Tạo dữ liệu demo tối thiểu 12 sản phẩm thuộc ít nhất 5 danh mục, ví dụ:
- Cà phê sữa đá
- Bạc xỉu
- Cà phê đen
- Trà đào cam sả
- Trà vải
- Trà chanh
- Trà sữa truyền thống
- Trà sữa matcha
- Nước ép cam
- Nước ép dưa hấu
- Sinh tố bơ
- Chanh dây đá xay

Dữ liệu mẫu cần có tên, mô tả tiếng Việt, giá VND, ảnh hợp lệ/placeholder, danh mục và trạng thái còn hàng. Ghi rõ đây là dữ liệu demo để chủ cửa hàng thay thế. Không tự nhận các mức giá hoặc thông tin ngân hàng mẫu là dữ liệu thật.

## 7. Tiêu chí nghiệm thu

Website được xem là hoàn thành khi đáp ứng các tiêu chí sau:

- [ ] Trang chủ, thực đơn, chi tiết sản phẩm, giỏ hàng, checkout và theo dõi đơn hoạt động.
- [ ] Lọc danh mục, tìm kiếm và xem chi tiết sản phẩm hoạt động.
- [ ] Khách có thể chọn tùy chọn món, thêm/xóa/sửa số lượng trong giỏ.
- [ ] Tổng tiền được tính chính xác và hiển thị nhất quán.
- [ ] Có thể tạo đơn hàng và nhận mã đơn duy nhất.
- [ ] Có QR động theo số tiền và mã đơn khi đã cấu hình thông tin ngân hàng.
- [ ] Hệ thống không tự xác nhận thanh toán khi chưa có bằng chứng/đối soát.
- [ ] Khách tra cứu được đơn bằng thông tin xác thực phù hợp.
- [ ] Admin có thể quản lý sản phẩm, danh mục, đơn hàng và trạng thái thanh toán.
- [ ] Giao diện responsive, không vỡ bố cục trên màn hình nhỏ.
- [ ] Có trạng thái loading, lỗi, thành công và dữ liệu rỗng.
- [ ] Không có lỗi nghiêm trọng khi chạy build.
- [ ] Có README hướng dẫn cài đặt, chạy, cấu hình QR và tài khoản quản trị demo.

## 8. Kết quả cần bàn giao

Hãy tạo trực tiếp trong workspace:
1. Toàn bộ mã nguồn frontend và backend (nếu dùng).
2. Dữ liệu mẫu và cấu hình mẫu.
3. File `.env.example`.
4. File `README.md` hướng dẫn cài đặt, chạy local, cấu hình database, cấu hình QR và các giới hạn tích hợp.
5. Nếu phù hợp, tạo migration/seed để khởi tạo database.
6. Tóm tắt cấu trúc thư mục và các chức năng đã hoàn thành.
7. Liệt kê rõ những phần còn cần thông tin thật hoặc tích hợp bên ngoài, đặc biệt là xác nhận thanh toán tự động.

**Ưu tiên:** hoàn thiện luồng đặt hàng end-to-end, tính đúng tổng tiền, bảo vệ dữ liệu khách hàng và thể hiện trạng thái thanh toán trung thực. Không chỉ tạo landing page tĩnh hoặc các nút bấm không có chức năng.
