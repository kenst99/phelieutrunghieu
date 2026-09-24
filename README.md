# Phế Liệu Trung Hiếu — V3

Ứng dụng web (PWA) quản lý bãi phế liệu: **Tổng quan trạm cân**, Nhập – Xuất – Tồn, **Bảng kê** (đã gộp tính năng của `bangke.html`), Tính tiền, Tài chính, Hành chính và **Trợ lý AI local có giọng nói**.

Dự án là web tĩnh thuần HTML/CSS/JS — **không cần build**, deploy Vercel chỉ vài bước.

---

## 1. Có gì mới

| Tính năng | Mô tả |
|---|---|
| 🏗️ **Tổng quan (trang chủ)** | Đồng hồ cân LED "hôm nay đã mua", so với hôm qua, bồn chứa tồn kho, biểu đồ nhập theo ngày, cơ cấu mặt hàng, bảng vàng khách hàng, lịch nhập hàng, phiếu cân gần nhất |
| 📡 **Nguồn dữ liệu 2 tháng** | Chọn 1–2 tháng liền nhau (vd T8 + T9 → chỉ lấy **01/08 → 30/09**). Nạp từ **Google Sheet**, **tải tệp** (.xlsx/.xls/.csv/.json, chọn nhiều tệp ngày cùng lúc) hoặc **Nhật ký nhập**. Tự nhận cột (kể cả font VNI), tự bỏ dòng TỔNG CỘNG và dữ liệu ngoài khoảng |
| 🤖 **Trợ lý AI** (nút tròn góc phải, Ctrl+K) | Hỏi bằng chữ hoặc **giọng nói tiếng Việt**, trả lời & **đọc to**. Ra lệnh: "mở tính tiền", "mở bảng kê", "đồng bộ", "báo cáo tồn"… Chế độ **rảnh tay** tự nghe câu tiếp theo |
| 📥 **Bảng kê** (từ bangke.html) | Thêm / Sửa / Xoá dòng, Lọc nhiều khách, Check list CK (ghi "DA CK" vào dòng gốc), Báo cáo ảnh (có dòng "Nợ Anh Thanh"), Tải từ Drive (Apps Script), Xuất danh bạ Excel, sửa lỗi lệch ngày khi đọc ngày Excel |
| 🎨 Giao diện & icon | Logo làm icon app/favicon/PWA, màn hình chờ, sọc cảnh báo, kim loại xước; màu mặt hàng đã kiểm tra dễ phân biệt cho người mù màu |

### Câu hỏi mẫu cho Trợ lý
- "Hôm nay mua được bao nhiêu tấn?" · "Hôm qua chi bao nhiêu tiền?" · "Hôm nay có bao nhiêu xe?"
- "Tồn kho bao nhiêu?" · "Tồn sắt còn bao nhiêu?"
- "Tháng 8 mua bao nhiêu sắt?" · "Từ 1/9 đến 15/9 mua bao nhiêu?" · "3 ngày qua mua được bao nhiêu?"
- "Top 5 khách tháng này" · "Anh Thanh bán bao nhiêu tháng 9?"
- "So sánh tháng 9 với tháng 8" · "Ngày nào mua nhiều nhất?" · "Xu hướng 7 ngày qua"
- "Tiền mặt hôm nay?" · "Ai còn cần chuyển khoản?" · "Giá mua trung bình sắt?" · "Tạp chất tháng này?" · "Dự báo cuối tháng"

Mọi con số do bộ phân tích **tính trực tiếp từ dữ liệu** (không đoán). Dữ liệu không rời khỏi máy.

---

## 2. Deploy lên Vercel

**Cách A — qua GitHub (khuyên dùng, tự cập nhật mỗi lần sửa):**
1. Tạo repo GitHub, đẩy toàn bộ thư mục này lên.
2. Vào <https://vercel.com/new> → Import repo.
3. Framework Preset: **Other** · Build Command: *(để trống)* · Output Directory: *(để trống)* → **Deploy**.

**Cách B — bằng dòng lệnh (không cần GitHub):**
```bash
npx vercel --prod
```
Chạy lệnh trong thư mục dự án, đăng nhập lần đầu, trả lời mặc định các câu hỏi.

Sau khi deploy: mở link trên điện thoại → *Thêm vào màn hình chính* để dùng như app (icon là logo TH).

> ⚠️ **Bảo mật:** `js/app.js` có sẵn danh sách `DEFAULT_CUSTOMERS` gồm **tên và số tài khoản ngân hàng** của khách. Khi deploy công khai, ai có link đều xem được mã nguồn. Nên xoá danh sách này (danh bạ vẫn nạp được bằng nút **📥 Nạp Excel**) hoặc chỉ chia sẻ link nội bộ.

Chạy thử trên máy: `python -m http.server 5173` rồi mở <http://localhost:5173> (micro chỉ hoạt động trên `localhost` hoặc `https`).

---

## 3. Kết nối Google Sheet (dữ liệu 2 tháng)

Vào **Tổng quan → Nguồn dữ liệu → Cấu hình Google Sheet**, dán **một trong các loại link**:

| Loại link | Cách lấy | Ghi chú |
|---|---|---|
| Link Sheet thường | Chia sẻ → "Bất kỳ ai có đường liên kết" → mở đúng tab → copy link (có `#gid=…`) | Đơn giản nhất |
| Link CSV đã công bố | Tệp → Chia sẻ → **Công bố lên web** → chọn tab → CSV | Ổn định nhất cho sheet công khai |
| Sheets API v4 | `https://sheets.googleapis.com/v4/spreadsheets/{ID}/values/{TAB}?key={API_KEY}` | Giống link đang dùng ở tab Tồn |
| **Apps Script** (sheet riêng tư) | Làm theo hướng dẫn trong [`apps-script/Code.gs`](apps-script/Code.gs) | Chỉ trả về đúng khoảng ngày |

- Ô **Tên tab**: nếu mỗi tháng một tab, ghi `T8,T9`.
- Bảng cần có cột **NGÀY** và **KL THỰC** (hoặc KL HÀNG / TIỀN). Các cột khác (KHÁCH HÀNG, MẶT HÀNG, GIÁ TT, TIỀN TT, GHI CHÚ, SỐ XE, GIỜ…) được tự nhận nếu có.
- Bật **"Tự tải khi mở app"** để trợ lý luôn có số mới (tải lại mỗi 10 phút).

Bảng kê đang mở ở tab NHẬP và **Nhật ký nhập (LOG)** cũng được gộp tự động (có thể tắt).

---

## 4. Giọng nói & AI nâng cao

- **Nhận giọng nói:** Chrome/Edge (Android, Windows, macOS) và Safari (iPhone) bản mới; cho phép micro khi được hỏi. Trình duyệt dùng dịch vụ nhận dạng của nó nên cần mạng.
- **Đọc câu trả lời:** cần giọng đọc tiếng Việt trên máy.
  Windows: *Cài đặt → Thời gian & ngôn ngữ → Giọng nói → Thêm giọng nói → Tiếng Việt*. Android/iPhone thường có sẵn.
- **AI nâng cao (tuỳ chọn, ⚙️ trong khung trợ lý)** — cho câu hỏi tự do; câu hỏi số liệu vẫn do bộ tích hợp tính:
  - **Ollama trên máy tính:** cài <https://ollama.com> → `ollama pull qwen2.5:3b` → đặt biến môi trường `OLLAMA_ORIGINS=*` → khởi động lại Ollama. LM Studio: bật Local Server, địa chỉ `http://localhost:1234/v1`.
  - **WebLLM (trong trình duyệt):** cần Chrome/Edge có WebGPU; tải mô hình ~1 GB lần đầu, sau đó chạy offline.

---

## 5. Cấu trúc thư mục

```
index.html            Khung giao diện (HTML)
manifest.json, sw.js  PWA: icon, chạy offline
vercel.json           Cấu hình Vercel (header, cache)
favicon.ico, icons/   Icon tạo từ icon.png (logo)
css/app.css           Giao diện gốc
css/tinhtien.css      Module Tính tiền
css/v3.css            Giao diện mới (Tổng quan, AI, Bảng kê)
js/app.js             Lõi: Tồn · Nhập (Bảng kê) · Nhật ký · Khách hàng · Xuất
js/tinhtien.js        Module Tính tiền
js/taichinh.js        Module Tài chính
js/hanhchinh.js       Module Hành chính
js/v3/datahub.js      Nạp & chuẩn hoá dữ liệu 2 tháng
js/v3/ai-engine.js    Bộ hiểu câu hỏi tiếng Việt + phân tích
js/v3/ai-ui.js        Khung chat, micro, đọc giọng, Ollama/WebLLM
js/v3/dashboard.js    Màn hình Tổng quan
js/v3/shell.js        Nối các module mới vào app
apps-script/Code.gs   API Google Sheet theo khoảng ngày
_goc/                 Bản gốc index.html, bangke.html, icon.png (không deploy)
```

Dữ liệu (nhật ký, danh bạ, cấu hình, dữ liệu 2 tháng) lưu trong trình duyệt của từng máy (localStorage / IndexedDB) — dùng **Xuất/Nhập JSON** trong Nhật ký để sao lưu hoặc chuyển máy.
