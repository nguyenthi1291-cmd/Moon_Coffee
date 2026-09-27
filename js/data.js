/**
 * Data Model & Seed Products for XANH VỊ QUÁN
 * Sử dụng đầy đủ tất cả 20 hình ảnh thực tế có trong thư mục ./mon-an/
 * và các đồ uống đặc trưng được chỉ định trong prompt.
 */

window.SEED_CATEGORIES = [
  {
    id: "ca-phe",
    name: "Cà Phê Năng Lượng",
    slug: "ca-phe",
    icon: "fa-mug-hot",
    description: "Cà phê Robusta & Arabica rang mộc nguyên chất, đậm đà tỉnh táo",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "tra-thao-moc",
    name: "Trà Trái Cây & Thảo Mộc",
    slug: "tra-thao-moc",
    icon: "fa-leaf",
    description: "Trà ủ lạnh, hoa quả nhiệt đới tươi thanh lọc cơ thể",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "nuoc-ep",
    name: "Nước Ép & Sinh Tố Tươi",
    slug: "nuoc-ep",
    icon: "fa-glass-water-droplet",
    description: "100% trái cây ép tươi mỗi ngày, không đường hóa học",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "tra-sua",
    name: "Trà Sữa Đậm Vị",
    slug: "tra-sua",
    icon: "fa-cubes-stacked",
    description: "Trà sữa pha thủ công kết hợp trân châu dai giòn bùi béo",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "diem-tam",
    name: "Điểm Tâm & Món Sợi",
    slug: "diem-tam",
    icon: "fa-bowl-food",
    description: "Phở, hủ tiếu, bánh canh và bánh mì nóng giòn khởi đầu ngày mới",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "mon-man",
    name: "Cơm Trưa & Món Mặn",
    slug: "mon-man",
    icon: "fa-utensils",
    description: "Cơm phần văn phòng & món mặn truyền thống chuẩn cơm mẹ nấu",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "combo",
    name: "Combo Tiết Kiệm",
    slug: "combo",
    icon: "fa-fire",
    description: "Kết hợp hoàn hảo giữa món ăn no và thức uống giải nhiệt",
    sortOrder: 7,
    isActive: true,
  },
];

window.SEED_PRODUCTS = [
  // --- NHÓM 1: CÀ PHÊ ---
  {
    id: "drk-001",
    categoryId: "ca-phe",
    name: "Cà Phê Sữa Đá Sài Gòn",
    slug: "ca-phe-sua-da-sai-gon",
    shortDescription: "Cà phê pha phin truyền thống hòa quyện cùng sữa đặc béo ngậy, đắng đậm đà.",
    description: "Được tuyển chọn từ hạt cà phê Robusta Buôn Ma Thuột đậm vị, kết hợp cùng sữa đặc béo ngọt. Thức uống kinh điển mang đậm phong vị Sài Gòn, giúp bạn nạp năng lượng bừng tỉnh cho ngày dài làm việc.",
    image: "./mon-an/sua-da.jpg",
    basePrice: 29000,
    sizes: [
      { id: "M", name: "Size M (Chuẩn)", extraPrice: 0 },
      { id: "L", name: "Size L (Lớn + Sảng khoái)", extraPrice: 6000 },
      { id: "XL", name: "Size XL (Đại tướng)", extraPrice: 12000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "70% Ít ngọt", "50% Ngọt vừa", "0% Không đường"],
      ice: ["100% Đá riêng", "100% Bình thường", "50% Ít đá", "Nóng"],
      toppings: [
        { id: "top-flan", name: "Bánh Flan mềm mịn", price: 8000 },
        { id: "top-jelly", name: "Thạch cà phê giòn", price: 6000 }
      ]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy",
    rating: 4.9,
    soldCount: 1420
  },
  {
    id: "drk-002",
    categoryId: "ca-phe",
    name: "Bạc Xỉu Sữa Tươi Ba Tầng",
    slug: "bac-xiu-sua-tuoi-ba-tang",
    shortDescription: "Nhiều sữa ít cà phê, béo thơm ngậy mùi sữa đặc và sữa tươi tiệt trùng.",
    description: "Sự kết hợp tinh tế giữa lớp sữa tươi thanh mát, sữa đặc ngọt dịu và một chút cà phê phin nâu óng ả bên trên. Thích hợp cho những ai yêu thích vị béo ngọt và hương thơm nhẹ nhàng.",
    image: "./mon-an/sua-da.jpg",
    basePrice: 32000,
    sizes: [
      { id: "M", name: "Size M (Chuẩn)", extraPrice: 0 },
      { id: "L", name: "Size L (Lớn)", extraPrice: 6000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "50% Ít ngọt"],
      ice: ["Bình thường", "Ít đá", "Nóng"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "Yêu thích",
    rating: 4.8,
    soldCount: 890
  },
  {
    id: "drk-003",
    categoryId: "ca-phe",
    name: "Cà Phê Đen Đá Đậm Vị Mộc",
    slug: "ca-phe-den-da-dam-vi-moc",
    shortDescription: "Cà phê đen nguyên chất, vị đắng mộc đầm hậu vị ngọt thanh dài lâu.",
    description: "Dành riêng cho những người sành cà phê mộc. Không tẩm ướp hương liệu, rang vừa phải để giữ trọn vị đắng êm dịu và hương thơm khói nồng nàn.",
    image: "./mon-an/sua-da.jpg",
    basePrice: 25000,
    sizes: [
      { id: "M", name: "Size M", extraPrice: 0 },
      { id: "L", name: "Size L", extraPrice: 5000 }
    ],
    options: {
      sugar: ["Không đường", "Có đường (Ít)", "Có đường (Vừa)"],
      ice: ["Đá đầy đủ", "Ít đá", "Uống nóng"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.7,
    soldCount: 650
  },

  // --- NHÓM 2: TRÀ TRÁI CÂY & THẢO MỘC ---
  {
    id: "drk-004",
    categoryId: "tra-thao-moc",
    name: "Trà Gừng Mật Ong Rừng Ấm Nóng",
    slug: "tra-gung-mat-ong-am-nong",
    shortDescription: "Gừng tươi đập dập thơm lừng kết hợp mật ong hoa rừng ngọt dịu thanh cổ.",
    description: "Thức uống hỗ trợ tăng đề kháng và làm ấm cơ thể tuyệt vời. Gừng già thái lát nấu cùng nước cốt trà hảo hạng và mật ong thiên nhiên, thoang thoảng hương quế nhẹ nhàng.",
    image: "./mon-an/tra-gung-mat-ong.jpg",
    basePrice: 35000,
    sizes: [
      { id: "M", name: "Ly Tiêu Chuẩn (450ml)", extraPrice: 0 },
      { id: "L", name: "Bình Giữ Nhiệt Lớn (600ml)", extraPrice: 8000 }
    ],
    options: {
      sugar: ["Mật ong chuẩn", "Ít ngọt", "Tăng thêm gừng cay"],
      ice: ["Uống ấm nóng (Khuyên dùng)", "Thêm đá mát lạnh"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Đặc biệt",
    rating: 5.0,
    soldCount: 780
  },
  {
    id: "drk-005",
    categoryId: "tra-thao-moc",
    name: "Trà Đào Cam Sả Tươi Mát",
    slug: "tra-dao-cam-sa-tuoi-mat",
    shortDescription: "Hương sả thoang thoảng, cam vàng mọng nước và miếng đào giòn sần sật.",
    description: "Vị trà đen đậm đà quyện với nước cam vắt nguyên chất, tinh dầu sả tươi và đào ngâm giòn ngọt. Cực kỳ giải nhiệt cho những buổi trưa oi bức.",
    image: "./mon-an/nuoc-ep-oi.jpg",
    basePrice: 39000,
    sizes: [
      { id: "M", name: "Size M (500ml)", extraPrice: 0 },
      { id: "L", name: "Size L (700ml)", extraPrice: 8000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "70% Ít ngọt", "50% Ngọt vừa"],
      ice: ["100% Bình thường", "50% Ít đá"],
      toppings: [
        { id: "top-dao", name: "Thêm 2 miếng đào giòn", price: 10000 },
        { id: "top-chia", name: "Hạt chia hữu cơ", price: 5000 }
      ]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Mới",
    rating: 4.9,
    soldCount: 920
  },
  {
    id: "drk-006",
    categoryId: "tra-thao-moc",
    name: "Trà Vải Hoa Hồng Nhiệt Đới",
    slug: "tra-vai-hoa-hong-nhiet-doi",
    shortDescription: "Trà lài ướp hoa hồng, quả vải thiều mọng nước thơm mát quyến rũ.",
    description: "Thức uống mang sắc hồng nhẹ nhàng và hương thơm ngát của hoa hồng tươi kết hợp quả vải thiều mọng nước. Vị ngọt thanh thanh lưu luyến đầu lưỡi.",
    image: "./mon-an/nuoc-ep-dua-hau.jpg",
    basePrice: 42000,
    sizes: [
      { id: "M", name: "Size M", extraPrice: 0 },
      { id: "L", name: "Size L", extraPrice: 8000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "70% Ít ngọt", "50% Ngọt vừa"],
      ice: ["100% Bình thường", "50% Ít đá"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.8,
    soldCount: 430
  },

  // --- NHÓM 3: NƯỚC ÉP & SINH TỐ ---
  {
    id: "drk-007",
    categoryId: "nuoc-ep",
    name: "Nước Ép Dưa Hấu Đỏ Tươi Mát",
    slug: "nuoc-ep-dua-hau-do-tuoi-mat",
    shortDescription: "100% dưa hấu ruột đỏ ép chậm giữ trọn vitamin, ngọt thanh tự nhiên.",
    description: "Dưa hấu được chọn lọc kĩ, bỏ hạt và ép bằng công nghệ ép chậm giúp nước ép giữ trọn vẹn vitamin A, C và độ tươi mát tự nhiên mà không cần thêm đường hay nước.",
    image: "./mon-an/nuoc-ep-dua-hau.jpg",
    basePrice: 35000,
    sizes: [
      { id: "M", name: "Ly 500ml", extraPrice: 0 },
      { id: "L", name: "Chai Mang Về 650ml", extraPrice: 8000 }
    ],
    options: {
      sugar: ["Nguyên chất không đường", "Thêm chút mật ong (+3k)"],
      ice: ["Ướp lạnh sẵn không đá", "Thêm đá bi"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy",
    rating: 4.9,
    soldCount: 1650
  },
  {
    id: "drk-008",
    categoryId: "nuoc-ep",
    name: "Nước Ép Cóc Non Chua Ngọt Nhẹ",
    slug: "nuoc-ep-coc-non-chua-ngot-nhe",
    shortDescription: "Cóc non tươi xanh mơn mởn, vị chua thanh kích thích vị giác cực đã.",
    description: "Vị chua thanh mát của cóc non hòa cùng chút ngọt thanh tự nhiên và một xíu muối biển xí muội tinh tế. Thức uống tuyệt vời giúp giải ngấy sau bữa cơm trưa.",
    image: "./mon-an/nuoc-ep-coc.jpg",
    basePrice: 35000,
    sizes: [
      { id: "M", name: "Ly 500ml", extraPrice: 0 },
      { id: "L", name: "Chai Mang Về 650ml", extraPrice: 8000 }
    ],
    options: {
      sugar: ["Chuẩn chua ngọt cân đối", "Chua nhiều ít ngọt", "Không đường"],
      ice: ["Nhiều đá mát lạnh", "Ít đá"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Mới",
    rating: 4.8,
    soldCount: 910
  },
  {
    id: "drk-009",
    categoryId: "nuoc-ep",
    name: "Nước Ép Ổi Hồng Giàu Vitamin C",
    slug: "nuoc-ep-oi-hong-giau-vitamin-c",
    shortDescription: "Ổi hồng xá lị tươi giòn, giàu chất xơ và vitamin C giúp sáng da khỏe đẹp.",
    description: "Màu hồng phấn tự nhiên bắt mắt, hương thơm dịu ngát của ổi xá lị miền Tây. Được ép chậm nguyên chất giữ lại toàn bộ dưỡng chất quý giá cho cơ thể.",
    image: "./mon-an/nuoc-ep-oi.jpg",
    basePrice: 35000,
    sizes: [
      { id: "M", name: "Ly 500ml", extraPrice: 0 },
      { id: "L", name: "Chai Mang Về 650ml", extraPrice: 8000 }
    ],
    options: {
      sugar: ["Nguyên chất không đường", "Ngọt vừa (Thêm xíu mật ong)"],
      ice: ["Ướp lạnh sẵn", "Thêm đá mát"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "Tốt cho sức khỏe",
    rating: 4.9,
    soldCount: 820
  },

  // --- NHÓM 4: TRÀ SỮA ĐẬM VỊ ---
  {
    id: "drk-010",
    categoryId: "tra-sua",
    name: "Trà Sữa Ô Long Nướng Trân Châu Đen",
    slug: "tra-sua-o-long-nuong-tran-chau-den",
    shortDescription: "Vị trà ô long sao cháy đậm đà quyện cùng sữa béo và trân châu mật mía.",
    description: "Dòng trà sữa bán chạy số một tại quán với cốt trà ô long nướng thơm lừng, hậu vị chát nhẹ tinh tế hòa cùng sữa thơm và hạt trân châu nấu mật mía dẻo dai.",
    image: "./mon-an/sua-da.jpg",
    basePrice: 42000,
    sizes: [
      { id: "M", name: "Size M (500ml)", extraPrice: 0 },
      { id: "L", name: "Size L (700ml)", extraPrice: 8000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "70% Ít ngọt", "50% Ngọt vừa", "30% Rất ít ngọt"],
      ice: ["100% Bình thường", "50% Ít đá", "Không đá"],
      toppings: [
        { id: "top-pudding", name: "Pudding Trứng", price: 7000 },
        { id: "top-kemche", name: "Kem Phô Mai Machiato", price: 10000 }
      ]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy",
    rating: 4.9,
    soldCount: 1890
  },
  {
    id: "drk-011",
    categoryId: "tra-sua",
    name: "Trà Sữa Matcha Nhật Bản Đậm Vị",
    slug: "tra-sua-matcha-nhat-ban-dam-vi",
    shortDescription: "Bột matcha Uji thượng hạng hòa quyện sữa tươi thanh trùng thơm ngậy.",
    description: "Sắc xanh mướt từ bột trà xanh nguyên chất nhập khẩu, vị chát nhẹ hậu ngọt thơm mát, mang đến cảm giác thanh tịnh và sảng khoái.",
    image: "./mon-an/nuoc-ep-coc.jpg",
    basePrice: 45000,
    sizes: [
      { id: "M", name: "Size M", extraPrice: 0 },
      { id: "L", name: "Size L", extraPrice: 8000 }
    ],
    options: {
      sugar: ["100% Chuẩn", "70% Ít ngọt", "50% Ngọt vừa"],
      ice: ["100% Bình thường", "50% Ít đá"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.7,
    soldCount: 540
  },

  // --- NHÓM 5: ĐIỂM TÂM & MÓN SỢI ---
  {
    id: "food-001",
    categoryId: "diem-tam",
    name: "Bánh Mì Thịt Nướng Giòn Rụm",
    slug: "banh-mi-thit-nuong-gion-rum",
    shortDescription: "Vỏ bánh mì giòn tan, thịt xiên nướng than hoa thơm lừng và sốt bí truyền.",
    description: "Bánh mì nướng nóng hổi, kẹp thịt nạc vai ướp sốt mật ong nướng vàng xém cạnh, pa-tê gan béo ngậy, đồ chua giòn ngọt, dưa leo, ngò rí và nước sốt rim đậm đà đặc biệt của quán.",
    image: "./mon-an/banh-mi-thit-nuong.jpg",
    basePrice: 35000,
    sizes: [
      { id: "STD", name: "Phần Tiêu Chuẩn (2 xiên thịt)", extraPrice: 0 },
      { id: "SPEC", name: "Phần Đặc Biệt (3 xiên thịt + thêm pate)", extraPrice: 12000 }
    ],
    options: {
      chili: ["Cay vừa (Khuyên dùng)", "Cay nhiều", "Không cay"],
      vegetables: ["Đầy đủ rau ngò đồ chua", "Không lấy đồ chua", "Không lấy ngò"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy",
    rating: 4.9,
    soldCount: 2150
  },
  {
    id: "food-002",
    categoryId: "diem-tam",
    name: "Phở Gà Ta Lá Chanh Truyền Thống",
    slug: "pho-ga-ta-la-chanh-truyen-thong",
    shortDescription: "Nước dùng ninh xương gà thanh ngọt tự nhiên, thịt gà đồi dai giòn thơm lá chanh.",
    description: "Bát phở bốc khói nghi ngút với nước dùng trong vắt ngọt tủy, thịt gà ta thả vườn da vàng óng giòn sần sật, thái kèm lá chanh tươi, đầu hành hoa và tương ớt Bắc cay nồng.",
    image: "./mon-an/pho-ga.jpg",
    basePrice: 55000,
    sizes: [
      { id: "STD", name: "Tô Chuẩn (Thịt đùi + lườn xé)", extraPrice: 0 },
      { id: "SPEC", name: "Tô Đặc Biệt (+ Trứng non + Lòng mề)", extraPrice: 18000 }
    ],
    options: {
      onion: ["Đầy đủ hành hoa hành chẻ", "Không lấy hành"],
      soup: ["Nước béo", "Nước trong thanh"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Món Ngon Phố Cổ",
    rating: 4.9,
    soldCount: 1320
  },
  {
    id: "food-003",
    categoryId: "diem-tam",
    name: "Hủ Tiếu Nam Vang Thập Cẩm",
    slug: "hu-tieu-nam-vang-thap-cam",
    shortDescription: "Sợi hủ tiếu dai tơi, tôm tươi bóc nõn, thịt bằm, gan heo béo bùi và trứng cút.",
    description: "Nấu theo hương vị Nam Vang trứ danh. Nước lèo hầm xương mực khô ngọt thanh đậm đà, topping đầy đặn gồm tôm sú tươi, tim gan heo luộc giòn, thịt băm nhuyễn và tóp mỡ tỏi phi giòn rụm.",
    image: "./mon-an/hu-tieu-nam-vang.jpg",
    basePrice: 55000,
    sizes: [
      { id: "SOUP", name: "Hủ Tiếu Nước (Nước dùng ngọt lịm)", extraPrice: 0 },
      { id: "DRY", name: "Hủ Tiếu Khô (Sốt trộn gia truyền + Chén súp)", extraPrice: 3000 }
    ],
    options: {
      spicy: ["Cay nhẹ", "Cay nhiều", "Không cay"],
      vegetables: ["Rau cần + Hẹ + Giá đỗ", "Giá chần riêng"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Yêu thích",
    rating: 4.8,
    soldCount: 1470
  },
  {
    id: "food-004",
    categoryId: "diem-tam",
    name: "Bánh Canh Giò Heo Nước Trong",
    slug: "banh-canh-gio-heo-nuoc-trong",
    shortDescription: "Khoanh giò heo mềm rục da giòn, sợi bánh canh bột gạo dai mềm quyến rũ.",
    description: "Nước dùng bánh canh ninh kỹ từ giò heo và củ cải trắng ngọt thanh. Từng khoanh giò mập mạp béo mềm chấm kèm nước mắm ớt cay xè làm say đắm bất cứ thực khách nào.",
    image: "./mon-an/banh-canh-gio-heo.jpg",
    basePrice: 55000,
    sizes: [
      { id: "STD", name: "Tô Giò Nạc", extraPrice: 0 },
      { id: "SPEC", name: "Tô Giò Gân / Móng Đặc Biệt", extraPrice: 10000 }
    ],
    options: {
      onion: ["Đầy đủ hành phi hành lá", "Không hành phi"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.8,
    soldCount: 960
  },
  {
    id: "food-005",
    categoryId: "diem-tam",
    name: "Bánh Hỏi Heo Quay Giòn Bì Mỡ Hành",
    slug: "banh-hoi-heo-quay-gion-bi-mo-hanh",
    shortDescription: "Thịt heo quay da giòn nổ bung, bánh hỏi mềm mướt thơm lừng mỡ hành.",
    description: "Miếng thịt heo quay tẩm ướp ngũ vị bì giòn rôm rốp, thịt mềm mọng nước, xếp đều trên lớp bánh hỏi bột gạo thoa mỡ hành xanh mướt, ăn kèm dưa leo rau sống và nước mắm chua ngọt.",
    image: "./mon-an/heo-quay-banh-hoi.jpg",
    basePrice: 59000,
    sizes: [
      { id: "STD", name: "Phần Ăn 1 Người", extraPrice: 0 },
      { id: "SPEC", name: "Phần Đầy Đặn (Thêm heo quay giòn bì)", extraPrice: 20000 }
    ],
    options: {
      sauce: ["Nước mắm tỏi ớt chua ngọt", "Nước tương tỏi ớt"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Món Hot",
    rating: 4.9,
    soldCount: 1180
  },
  {
    id: "food-006",
    categoryId: "diem-tam",
    name: "Nui Xào Bò Lúc Lắc Rau Củ",
    slug: "nui-xao-bo-luc-lac-rau-cu",
    shortDescription: "Thịt bò thăn mềm ướp tiêu bơ xào cùng nui vàng óng và ớt chuông ngọt.",
    description: "Món ăn yêu thích của cả gia đình. Bò thăn tươi thái miếng dày sốt tiêu thơm mềm, nui xào săn ráo bơ tỏi không ngấy, kèm cà chua bi và bông cải thanh mát.",
    image: "./mon-an/nui-xao-bo.jpg",
    basePrice: 49000,
    sizes: [
      { id: "STD", name: "Phần Tiêu Chuẩn", extraPrice: 0 },
      { id: "SPEC", name: "Phần Thêm Bò + Trứng Ốp La", extraPrice: 15000 }
    ],
    options: {
      sauce: ["Sốt bơ tỏi đậm đà", "Sốt tương cà nhẹ nhàng"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.7,
    soldCount: 810
  },

  // --- NHÓM 6: CƠM TRƯA VĂN PHÒNG & MÓN MẶN ---
  {
    id: "food-007",
    categoryId: "mon-man",
    name: "Cơm Bò Xào Bông Cải Xanh Giòn Ngọt",
    slug: "com-bo-xao-bong-cai-xanh-gion-ngot",
    shortDescription: "Bò thăn xào lửa lớn giữ trọn vị mềm ngọt, bông cải xanh giòn tươi mát lành.",
    description: "Bữa trưa dinh dưỡng đầy đủ chất xơ và đạm. Bò xào sốt dầu hào thơm lừng, bông cải xanh mướt giữ được độ giòn ngọt tự nhiên, kèm cơm tấm dẻo và canh súp trong ngày.",
    image: "./mon-an/bo-xao-bong-cai.jpg",
    basePrice: 55000,
    sizes: [
      { id: "STD", name: "Suất Cơm Chuẩn + Canh", extraPrice: 0 },
      { id: "SPEC", name: "Suất Thêm Cơm + Bò + Canh Lớn", extraPrice: 15000 }
    ],
    options: {
      rice: ["Cơm dẻo vừa", "Thêm cơm không tính tiền", "Ít cơm"],
      soup: ["Kèm canh rong biển nóng", "Kèm canh rau củ"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy",
    rating: 4.9,
    soldCount: 1560
  },
  {
    id: "food-008",
    categoryId: "mon-man",
    name: "Cơm Sườn Heo Om Khoai Tây Bùi Béo",
    slug: "com-suon-heo-om-khoai-tay-bui-beo",
    shortDescription: "Sườn non chặt khúc om mềm rục xương, khoai tây bùi bở sánh quyện nước sốt.",
    description: "Sườn heo tươi ninh lửa nhỏ cùng khoai tây Đà Lạt và cà rốt cho đến khi nước sốt sánh mịn óng ánh. Chan lên bát cơm trắng nóng hổi ăn cực kỳ bắt miệng.",
    image: "./mon-an/suon-heo-om-khoai-tay.jpg",
    basePrice: 52000,
    sizes: [
      { id: "STD", name: "Suất Cơm Chuẩn", extraPrice: 0 },
      { id: "SPEC", name: "Suất Nhiều Sườn", extraPrice: 15000 }
    ],
    options: {
      rice: ["Cơm trắng dẻo", "Ít cơm"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Cơm Mẹ Nấu",
    rating: 4.8,
    soldCount: 1140
  },
  {
    id: "food-009",
    categoryId: "mon-man",
    name: "Cơm Thịt Viên Trứng Cút Sốt Cà Ri Chua Ngọt",
    slug: "com-thit-vien-trung-cut-sot-ca-ri-chua-ngot",
    shortDescription: "Viên thịt heo xay bọc trứng cút sốt cà chua tươi sánh mịn, vị chua ngọt kích thích.",
    description: "Thịt nạc vai xay nhuyễn ướp hạt tiêu bọc gọn quả trứng cút luộc bùi bùi, rim ngập trong sốt cà chua đỏ mọng nêm nếm chua ngọt hài hòa.",
    image: "./mon-an/thit-vien-trung-cut-sot-ca.jpg",
    basePrice: 48000,
    sizes: [
      { id: "STD", name: "Phần 3 Viên Thịt To", extraPrice: 0 },
      { id: "SPEC", name: "Phần 5 Viên Thịt Thập Cẩm", extraPrice: 12000 }
    ],
    options: {
      rice: ["Cơm nóng", "Ít cơm"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.8,
    soldCount: 890
  },
  {
    id: "food-010",
    categoryId: "mon-man",
    name: "Cơm Thịt Ba Chỉ Kho Trứng Cút Nước Dừa",
    slug: "com-thit-ba-chi-kho-trung-cut-nuoc-dua",
    shortDescription: "Thịt ba chỉ kho màu cánh gián óng ả, nước dừa xiêm ngọt thanh đậm đà.",
    description: "Món kho quốc hồn quốc túy. Thịt ba rọi cắt vuông vức kho rục cùng trứng cút trong nước dừa tươi Bến Tre, vị mặn ngọt béo hài hòa ăn hao cơm vô cùng.",
    image: "./mon-an/thit-heo-kho-trung-cut.jpg",
    basePrice: 50000,
    sizes: [
      { id: "STD", name: "Suất Cơm Tiêu Chuẩn", extraPrice: 0 },
      { id: "SPEC", name: "Suất Đầy Đặn Nhiều Thịt", extraPrice: 15000 }
    ],
    options: {
      rice: ["Cơm trắng dẻo thơm", "Thêm cơm dẻo"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "Truyền Thống",
    rating: 4.8,
    soldCount: 990
  },
  {
    id: "food-011",
    categoryId: "mon-man",
    name: "Cơm Thịt Heo Kho Măng Tươi Giòn",
    slug: "com-thit-heo-kho-mang-tuoi-gion",
    shortDescription: "Từng miếng măng giòn sần sật ngấm trọn vị đậm đà của thịt heo kho tiêu ớt.",
    description: "Măng củ tươi luộc kỹ khử hăng rồi đem kho cùng thịt heo nạc mỡ đan xen. Vị măng thơm giòn kết hợp nước kho sánh vàng tạo nên hương vị đặc sắc khó quên.",
    image: "./mon-an/thit-heo-kho-mang.jpg",
    basePrice: 50000,
    sizes: [
      { id: "STD", name: "Suất Tiêu Chuẩn", extraPrice: 0 }
    ],
    options: {
      spicy: ["Cay vừa", "Cay nồng", "Ít cay"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.7,
    soldCount: 760
  },
  {
    id: "food-012",
    categoryId: "mon-man",
    name: "Cơm Vịt Kho Gừng Cay Nồng Thơm Lừng",
    slug: "com-vit-kho-gung-cay-nong-thom-lung",
    shortDescription: "Thịt vịt cỏ săn chắc béo mềm kho ngập gừng tươi sợi, thơm cay ấm bụng.",
    description: "Thịt vịt được sơ chế kỹ với rượu và gừng để khử mùi, ướp tiêu ớt và kho liu riu cho ngấm gia vị. Miếng thịt săn chắc đậm đà, mùi gừng bốc lên nghi ngút thơm lừng.",
    image: "./mon-an/vit-kho-gung.jpg",
    basePrice: 52000,
    sizes: [
      { id: "STD", name: "Suất Tiêu Chuẩn", extraPrice: 0 },
      { id: "SPEC", name: "Suất Đùi Vịt Lớn", extraPrice: 15000 }
    ],
    options: {
      ginger: ["Nhiều gừng cay ấm", "Vừa gừng"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Đậm Đà",
    rating: 4.8,
    soldCount: 840
  },
  {
    id: "food-013",
    categoryId: "mon-man",
    name: "Cơm Cá Ngần Chiên Giòn Mắm Tỏi Ớt",
    slug: "com-ca-ngan-chien-gion-mam-toi-ot",
    shortDescription: "Cá ngần trắng ngần áo bột chiên vàng rụm, đảo đều mắm tỏi ớt kẹo cay ngọt.",
    description: "Cá ngần tươi rói thịt ngọt mềm được chiên giòn tan nguyên con, sau đó áo lớp sốt nước mắm tỏi ớt chua cay mặn ngọt bùng nổ hương vị.",
    image: "./mon-an/ca-ngan-chien-nuoc-mam.jpg",
    basePrice: 48000,
    sizes: [
      { id: "STD", name: "Suất Cơm Tiêu Chuẩn", extraPrice: 0 }
    ],
    options: {
      chili: ["Cay vừa", "Cay nhiều", "Ít cay"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "Đặc Sản",
    rating: 4.8,
    soldCount: 670
  },
  {
    id: "food-014",
    categoryId: "mon-man",
    name: "Cơm Cá Trứng Nauy Sốt Tiêu Cay Nồng",
    slug: "com-ca-trung-nauy-sot-tieu-cay-nong",
    shortDescription: "Cá trứng béo ngậy ắp đầy bụng trứng, rim sốt tiêu đen cay nồng thơm lừng.",
    description: "Từng con cá trứng Nauy béo tròn ních đầy trứng li ti bên trong, được rán săn rồi rim cùng sốt tiêu đen Phú Quốc đậm đà cay ấm tuyệt đỉnh.",
    image: "./mon-an/ca-trung-sot-tieu.png",
    basePrice: 50000,
    sizes: [
      { id: "STD", name: "Suất Tiêu Chuẩn (5 con cá trứng)", extraPrice: 0 }
    ],
    options: {
      pepper: ["Nhiều tiêu thơm nồng", "Tiêu vừa phải"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "",
    rating: 4.7,
    soldCount: 710
  },
  {
    id: "food-015",
    categoryId: "mon-man",
    name: "Cơm Lươn Đồng Xào Sả Ớt Xứ Nghệ",
    slug: "com-luon-dong-xao-sa-ot-xu-nghe",
    shortDescription: "Thịt lươn đồng xào săn vàng óng nghệ tươi, sả ớt cay nồng bổ dưỡng.",
    description: "Lươn đồng tự nhiên lọc sạch xương, xào lăn cùng củ nén, sả băm, ớt chỉ thiên và nghệ vàng tươi. Món ăn vừa thơm lừng vừa bổ huyết, ấm cơ thể.",
    image: "./mon-an/luon-xao-sa-ot.jpg",
    basePrice: 58000,
    sizes: [
      { id: "STD", name: "Suất Tiêu Chuẩn", extraPrice: 0 },
      { id: "SPEC", name: "Suất Nhiều Lươn Đặc Biệt", extraPrice: 20000 }
    ],
    options: {
      spicy: ["Cay chuẩn xứ Nghệ", "Cay vừa phải", "Ít cay"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bổ Dưỡng",
    rating: 4.9,
    soldCount: 930
  },

  // --- NHÓM 7: COMBO TIẾT KIỆM (ĂN + UỐNG) ---
  {
    id: "combo-001",
    categoryId: "combo",
    name: "Combo Sáng Trọn Vẹn: Bánh Mì Thịt Nướng + Cà Phê Sữa Đá",
    slug: "combo-sang-tron-ven",
    shortDescription: "1 Bánh Mì Thịt Nướng Giòn Rụm + 1 Cà Phê Sữa Đá Sài Gòn (Tiết kiệm 12.000đ).",
    description: "Bộ đôi khởi đầu ngày mới hoàn hảo và tiện lợi nhất. Bánh mì giòn rụm thơm lừng thịt nướng than hoa kết hợp cùng ly cà phê sữa đá đậm đà bừng tỉnh năng lượng.",
    image: "./mon-an/banh-mi-thit-nuong.jpg",
    basePrice: 52000, // Giá gốc 35k + 29k = 64k, giảm còn 52k
    originalPrice: 64000,
    sizes: [
      { id: "STD", name: "Combo Tiêu Chuẩn", extraPrice: 0 },
      { id: "UPGRADE", name: "Nâng Size Cà Phê Lên L (+6k)", extraPrice: 6000 }
    ],
    options: {
      coffeeSugar: ["Cà phê ngọt chuẩn", "Ít ngọt"],
      chili: ["Bánh mì có ớt", "Bánh mì không cay"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Tiết kiệm 20%",
    rating: 5.0,
    soldCount: 3120
  },
  {
    id: "combo-002",
    categoryId: "combo",
    name: "Combo Trưa Thanh Lành: Cơm Bò Xào Bông Cải + Nước Ép Dưa Hấu",
    slug: "combo-trua-thanh-lanh",
    shortDescription: "1 Cơm Bò Bông Cải Xanh + 1 Nước Ép Dưa Hấu Đỏ Ép Chậm (Tiết kiệm 15.000đ).",
    description: "Bữa trưa công sở no ngon và cực kỳ thanh mát. Cơm bò xào nóng sốt dinh dưỡng kèm ly nước ép dưa hấu đỏ giải nhiệt tức thì, xua tan mệt mỏi.",
    image: "./mon-an/bo-xao-bong-cai.jpg",
    basePrice: 75000, // Giá gốc 55k + 35k = 90k, giảm còn 75k
    originalPrice: 90000,
    sizes: [
      { id: "STD", name: "Combo Tiêu Chuẩn", extraPrice: 0 }
    ],
    options: {
      juiceIce: ["Nước ép mát lạnh", "Nước ép ít đá"],
      rice: ["Cơm vừa vặn", "Thêm cơm dẻo miễn phí"]
    },
    isAvailable: true,
    isFeatured: true,
    badge: "Bán chạy nhất",
    rating: 4.9,
    soldCount: 2280
  },
  {
    id: "combo-003",
    categoryId: "combo",
    name: "Combo Trà Chiều Thư Giãn: Nui Xào Bò + Nước Ép Cóc Non",
    slug: "combo-tra-chieu-thu-gian",
    shortDescription: "1 Nui Xào Bò Lúc Lắc + 1 Nước Ép Cóc Non Chua Ngọt Nhẹ (Tiết kiệm 14.000đ).",
    description: "Thích hợp cho bữa xế hoặc bữa tối nhẹ nhàng. Nui bò sốt thơm bơ kết hợp vị cóc chua ngọt sảng khoái kích thích vị giác.",
    image: "./mon-an/nui-xao-bo.jpg",
    basePrice: 70000, // Giá gốc 49k + 35k = 84k, giảm còn 70k
    originalPrice: 84000,
    sizes: [
      { id: "STD", name: "Combo Tiêu Chuẩn", extraPrice: 0 }
    ],
    options: {
      spicy: ["Vừa ăn", "Không cay"]
    },
    isAvailable: true,
    isFeatured: false,
    badge: "Tiết kiệm 17%",
    rating: 4.8,
    soldCount: 1040
  }
];

window.SEED_REVIEWS = [
  {
    name: "Minh Trang - NV Văn Phòng Q.1",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    comment: "Đồ uống cực ngon, nước ép dưa hấu không bị pha nước hay đường gắt. Quán giao hàng siêu nhanh, chỉ 20 phút là tới tận bàn!",
    rating: 5,
    dish: "Nước Ép Dưa Hấu & Bánh Mì Thịt Nướng"
  },
  {
    name: "Anh Hoàng Nam - Kỹ sư phần mềm",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    comment: "Thanh toán VietQR quét một cái là xong, tự điền đúng nội dung và số tiền. Cơm bò xào bông cải thì siêu nhiều thịt, 10 điểm!",
    rating: 5,
    dish: "Combo Trưa Thanh Lành"
  },
  {
    name: "Chị Thảo Lê - Freelancer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    comment: "Cà phê sữa đá pha rất đậm, đúng gu Sài Gòn. Đóng gói cẩn thận có tách đá riêng nên không bị nhạt khi nhận hàng.",
    rating: 5,
    dish: "Cà Phê Sữa Đá Sài Gòn"
  }
];
