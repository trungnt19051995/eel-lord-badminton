# Đồng Lươn Badminton Cup 2026 — Design Spec

Bổ sung/chi tiết hoá cho `DETAIL_DESIGN(1).md`, chốt qua brainstorming ngày 2026-07-31. Tài liệu này là nguồn spec chính thức để lập plan triển khai.

## 1. Mục tiêu & Kiến trúc

Giữ nguyên theo `DETAIL_DESIGN(1).md`:

- Website phục vụ giải cầu lông đôi Nam-Nữ, dùng trong vài ngày diễn ra giải, không cần vòng đời dài.
- Single Page Application, Mobile First, không tự quản lý backend (không viết server code).
- Vue 3 + Vite + Tailwind CSS + Pinia.
- **Đồng bộ dữ liệu real-time:** dùng Firebase Realtime Database (gói free) làm nguồn dữ liệu dùng chung — mọi thiết bị (Admin lẫn người xem) đọc/ghi cùng một node, cập nhật của Admin hiển thị gần như tức thời trên các thiết bị khác. Đây là điều chỉnh so với `DETAIL_DESIGN(1).md` gốc (bản gốc dùng LocalStorage thuần) sau khi phát hiện LocalStorage không đồng bộ được giữa các thiết bị — xem mục 6. LocalStorage vẫn dùng làm cache cục bộ để mở app tức thời/offline.
- Cấu trúc thư mục:

```
src/
  assets/
  components/
  store/
  data/defaultData.js
  utils/firebase.js   // khởi tạo Firebase app + Realtime Database
  utils/storage.js    // đọc/ghi dữ liệu qua Firebase, cache LocalStorage
  App.vue
  main.js
```

Deploy: chưa cần thiết lập ngay trong scope này (build chạy local trước).

**Tiền đề trước khi triển khai:** cần 1 project Firebase (Spark - free plan) do bạn tạo tại console.firebase.google.com, bật Realtime Database. Các giá trị cấu hình (`apiKey`, `authDomain`, `databaseURL`, `projectId`,...) sẽ được cung cấp qua file `.env.local` (không commit) — đây là bước đầu tiên của kế hoạch triển khai.

## 2. Cấu trúc giải đấu (4 vòng)

12 cặp đấu, xác định qua sơ đồ do người dùng cung cấp (thay thế phần "Vòng bảng" đơn giản trong tài liệu gốc bằng cấu trúc đầy đủ dưới đây):

- **Vòng 1 — Loại trực tiếp** (07:30–08:00, 6 trận, 3 sân): 12 cặp đấu loại trực tiếp theo cặp số thứ tự (1v2, 3v4, 5v6, 7v8, 9v10, 11v12). Thắng → Nhánh Thắng (gán nhãn A1–A6 theo thứ tự trận 1–6), Thua → Nhánh Thua (gán nhãn B1–B6 theo thứ tự trận 1–6).
- **Vòng 2 — Vòng tròn tính điểm** (20:00–21:00, 12 trận, 3 sân): chia 4 bảng vòng tròn 1 lượt, mỗi bảng 3 đội, 3 trận/bảng:
  - Bảng A1: A1, A2, A3
  - Bảng A2: A4, A5, A6
  - Bảng B1: B1, B2, B3
  - Bảng B2: B4, B5, B6
  Mỗi bảng tính BXH ra đội Nhất bảng (A_NHẤT_1, A_NHẤT_2, B_NHẤT_1, B_NHẤT_2).
- **Vòng 3 — Chung kết nhánh** (21:00–21:15, 2 trận): A_NHẤT_1 vs A_NHẤT_2 → Nhất Nhánh A. B_NHẤT_1 vs B_NHẤT_2 → Nhất Nhánh B.
- **Vòng 4 — Chung kết tổng** (21:15–21:30, 1 trận): Nhất Nhánh A vs Nhất Nhánh B → Nhà vô địch.

Giờ/sân mặc định (`defaultData.js`) lấy đúng theo sơ đồ gốc người dùng cung cấp (lịch chi tiết từng trận theo giờ và sân, mỗi trận 15 phút). Admin có thể sửa giờ/sân sau khi seed.

### Quy tắc xếp hạng trong mỗi bảng (Vòng 2)

Áp dụng đúng mục 7 của `DETAIL_DESIGN(1).md`:

1. Điểm (Thắng = 1, Thua = 0)
2. Đối đầu trực tiếp (chỉ khi đúng 2 đội bằng điểm)
3. Hiệu số
4. Tổng điểm ghi được
5. Nếu vẫn không phân định được: Admin chỉ định thủ công (dùng cơ chế override, xem mục 3).

## 3. Data Model

```
Couple {
  id
  maleName
  femaleName
}

Match {
  id
  round        // 1 | 2 | 3 | 4
  group        // null | 'A1' | 'A2' | 'B1' | 'B2'  (chỉ Vòng 2)
  court
  time
  team1        // TeamSlot
  team2        // TeamSlot
  score1
  score2
  status       // 'pending' | 'live' | 'done'
}

TeamSlot {
  type         // 'couple' | 'winner' | 'loser' | 'groupWinner'
  coupleId     // dùng khi type = 'couple'
  matchId      // dùng khi type = 'winner' | 'loser'
  group        // dùng khi type = 'groupWinner' ('A1' | 'A2' | 'B1' | 'B2')
  override     // null | coupleId — Admin gán tay, ưu tiên tuyệt đối khi khác null
}
```

Quy tắc gán `TeamSlot` theo vòng:

- Vòng 1: `{type:'couple', coupleId}` trực tiếp.
- Vòng 2: `{type:'winner', matchId}` (đội thắng trận Vòng 1 tương ứng, vào Nhánh Thắng) hoặc `{type:'loser', matchId}` (đội thua, vào Nhánh Thua).
- Vòng 3: `{type:'groupWinner', group}` — lấy đội đứng đầu BXH của bảng tương ứng.
- Vòng 4: `{type:'winner', matchId}` — trỏ tới 1 trong 2 trận Vòng 3.

### Engine `resolveTeam(teamSlot)`

Hàm trung tâm suy ra coupleId thực tế cho một `TeamSlot`, theo thứ tự ưu tiên:

1. Nếu `override` khác null → trả về `override` (Admin đã chỉ định tay, dùng khi đội bỏ giải, hoặc bảng hoà không phân định được).
2. Ngược lại tính theo `type`:
   - `couple` → trả `coupleId`.
   - `winner`/`loser` → tra trận `matchId`; nếu trận đó `status !== 'done'`, trả về placeholder chưa xác định (xem mục 4); nếu đã xong, trả đội thắng/thua tương ứng.
   - `groupWinner` → tính BXH của `group` theo quy tắc mục 2; nếu xác định được 1 đội nhất rõ ràng, trả coupleId đó; nếu hoà không phân định được, trả placeholder và yêu cầu Admin override.

Toàn bộ bracket "tự chảy" từ Vòng 1 đến Vòng 4 qua engine này — Admin chỉ nhập tỉ số (và override khi cần), không tự chọn đội cho vòng sau trong điều kiện bình thường.

### Chuyển trạng thái Match

- `pending`: chưa nhập tỉ số nào.
- `live`: Admin đã nhập ít nhất 1 trong 2 tỉ số nhưng chưa xác nhận xong — trận vẫn chưa được `winner`/`loser`/`groupWinner` ở vòng sau tính vào (tránh bracket "chảy" sớm khi tỉ số đang nhập dở).
- `done`: Admin bấm "Xác nhận kết thúc trận" sau khi nhập đủ 2 tỉ số — chỉ khi này `resolveTeam` mới coi trận đã có kết quả và cho các trận/bảng phụ thuộc tính tiếp.

## 4. Giao diện

Một trang duy nhất, header sticky (Cặp đấu / Lịch thi đấu / Kết quả / Thể lệ / Admin), click menu smooth-scroll tới section, trên mobile menu thu gọn thành hamburger, tap 1 mục sẽ cuộn rồi tự đóng menu.

### Màu sắc

Theme nền sáng, primary xanh dương/cyan (sporty). Mỗi vòng đấu có màu accent riêng để phân biệt khi cuộn ngang bracket:

| Vòng | Màu accent |
|---|---|
| Vòng 1 – Loại trực tiếp | Xanh lá đậm (emerald) |
| Vòng 2 – Vòng tròn | Xanh dương (blue) |
| Vòng 3 – Chung kết nhánh | Tím (violet) |
| Vòng 4 – Chung kết tổng | Cam (amber) |

Trạng thái trận: ⚪ chưa đấu / 🟡 đang cập nhật / 🟢 hoàn thành. Đội thắng: viền xanh lá đậm + chữ đậm.

### Các section

- **Cặp đấu:** lưới card 1 cột (mobile) / 2-3 cột (tablet+), mỗi card avatar-icon + tên Nam/Nữ. Không có thêm/xoá; Admin chỉ sửa tên.
- **Lịch thi đấu:** khu vực trung tâm, bracket rộng ~1600px, cuộn ngang trên mobile (không thu nhỏ), header cột luôn hiển thị (sticky theo trục ngang khi cuộn dọc). 4 cột theo 4 vòng, màu accent theo bảng trên. Trong Vòng 2, mỗi bảng (A1/A2/B1/B2) có sub-header + mini-BXH (STT, Cặp đấu, Thắng, Thua, Điểm, Điểm ghi, Điểm thua, Hiệu số) ngay dưới các match card của bảng đó, đội đầu bảng tô xanh nhạt. Match card gồm: giờ, sân, 2 đội (hoặc "Chờ thắng trận X" nếu chưa resolve được), tỉ số, badge trạng thái.
- **Kết quả:** card tổng hợp Nhất A1/A2/B1/B2, Vô địch Nhánh A/B, Nhà vô địch — mỗi mục hiện "Chưa xác định" cho tới khi resolve được.
- **Thể lệ:** text do Admin soạn, hiển thị giữ line-break, không cần rich text editor phức tạp.
- **Admin:** ẩn sau đăng nhập; sau khi đăng nhập hiện các control chỉnh sửa ngay tại chỗ (inline) trong các section trên — không cần trang admin riêng.

## 5. Admin

- Đăng nhập username/password so khớp cứng trong code (username `trungnt`, password `12345678`, theo mục 12 `DETAIL_DESIGN(1).md`). Không cần mã hoá phức tạp — 1 admin duy nhất, dữ liệu không nhạy cảm.
- Trạng thái đăng nhập lưu trong `sessionStorage` (mất khi đóng tab), có nút "Đăng xuất".
- Quyền Admin: sửa tên cặp, nhập tỉ số, sửa giờ/sân, sửa thể lệ, override đội đi tiếp (theo `TeamSlot.override`), Export JSON, Import JSON, Reset dữ liệu.
- Toàn bộ control chỉnh sửa chỉ render khi đã đăng nhập; người xem thường (chưa đăng nhập) không thấy nút sửa nào.

## 6. Đồng bộ dữ liệu, Lưu trữ & Export/Import

### Vì sao không dùng LocalStorage thuần

LocalStorage lưu riêng theo từng trình duyệt/thiết bị. Nếu chỉ dùng LocalStorage, khi Admin cập nhật tỉ số trên điện thoại của mình, người xem mở web trên điện thoại riêng của họ sẽ **không** thấy cập nhật đó (mỗi máy có bản dữ liệu riêng, tự seed từ `defaultData.js`). Điều này mâu thuẫn với mục tiêu "người xem chỉ cần mở website để theo dõi" — nên cần một nguồn dữ liệu dùng chung.

### Firebase Realtime Database

- 1 Pinia store chứa toàn bộ state (couples, matches, thể lệ), nhưng nguồn sự thật (source of truth) là 1 node duy nhất trên Firebase Realtime Database (ví dụ `/tournament`), không phải LocalStorage.
- Khi app khởi động: đọc ngay từ LocalStorage cache (nếu có) để render tức thời, đồng thời mở kết nối `onValue` lắng nghe node Firebase — khi có dữ liệu mới (do bất kỳ thiết bị nào ghi), toàn bộ client khác tự cập nhật gần như tức thời, đồng thời ghi đè lại LocalStorage cache.
- Mọi mutation từ Admin (nhập tỉ số, sửa giờ/sân, override,...) ghi thẳng lên Firebase (`update`/`set`, debounce ~300ms cho các trường gõ liên tục như tên/thể lệ); Firebase tự phát lại cho mọi client đang lắng nghe, kể cả chính thiết bị Admin (qua listener, không cần code riêng để tự cập nhật UI của Admin).
- Người xem (không đăng nhập) chỉ đọc (`onValue`), không ghi.
- Firebase SDK có sẵn khả năng chịu mất mạng tạm thời (offline persistence): nếu wifi/4G tại sân đấu chập chờn, các ghi của Admin được giữ tại chỗ và tự đồng bộ lại khi có mạng trở lại; người xem vẫn thấy được bản dữ liệu gần nhất đã cache.
- Lần đầu tiên node Firebase rỗng (chưa ai khởi tạo): client seed từ `src/data/defaultData.js` và ghi lên Firebase — 12 cặp mặc định (mục 5 tài liệu gốc) + toàn bộ 21 trận với giờ/sân mặc định theo mục 2 spec này.
- **Bảo mật (chấp nhận được cho quy mô giải đấu CLB vài ngày):** Realtime Database rules ở mức đơn giản — `.read: true` (ai cũng xem được), `.write: true` (ai biết cấu trúc URL cũng ghi được trực tiếp qua API, không chỉ qua UI có đăng nhập). Rủi ro thấp vì đây là giải đấu nội bộ, không có dữ liệu nhạy cảm; nếu sau này cần chặt hơn có thể bổ sung Firebase Authentication + rules theo UID mà không đổi giao diện.

### Export/Import/Reset (giữ nguyên vai trò backup thủ công)

- Export: xuất toàn bộ state hiện tại (đọc từ Firebase) thành file `tournament.json` tải về máy.
- Import: chọn file `tournament.json`, validate cấu trúc cơ bản, ghi đè lên node Firebase (áp dụng cho mọi thiết bị ngay sau đó) + cache LocalStorage.
- Reset: ghi đè node Firebase bằng dữ liệu seed từ `defaultData.js`, có confirm dialog (hành động phá huỷ, ảnh hưởng tất cả mọi người đang xem).

## 7. Xử lý biên

- Bảng hoà theo đúng thứ tự tiêu chí mục 2; nếu vẫn hoà, UI hiện nút "Chọn đội nhất bảng" cho Admin (set `override` trên `TeamSlot` type `groupWinner`).
- Trận có `TeamSlot` chưa resolve được (trận nguồn chưa `done`): match card hiện "Chờ thắng trận X", ẩn ô nhập tỉ số cho tới khi cả 2 đội đã resolve.
- Override có thể set/huỷ bất kỳ lúc nào qua nút nhỏ cạnh mỗi ô đội (chỉ hiện khi đăng nhập Admin) — dùng khi đội bỏ giải hoặc cần chỉnh sửa nhánh vì lý do khác.

## 8. Kiểm thử

Dự án ngắn hạn (vài ngày), không cần bộ test tự động. Kiểm thử thủ công theo kịch bản trước khi dùng thật:

1. Nhập tỉ số lần lượt Vòng 1 → xác nhận Vòng 2 tự hiện đúng đội (winner/loser đúng nhánh).
2. Nhập tỉ số Vòng 2 đủ 1 bảng → xác nhận BXH tính đúng, đội nhất bảng tự lên Vòng 3.
3. Test trường hợp hoà điểm trong bảng → xác nhận nút "Chọn đội nhất bảng" xuất hiện, override hoạt động.
4. Nhập tỉ số Vòng 3, Vòng 4 → xác nhận ra đúng Nhà vô địch.
5. Test Export → Import (đổi dữ liệu, import lại file cũ, xác nhận khôi phục đúng).
6. Test Reset → xác nhận quay về đúng dữ liệu mặc định.
7. Test trên viewport mobile thực tế: cuộn ngang bracket, menu hamburger, các form nhập liệu Admin.
8. Test đồng bộ đa thiết bị: mở web trên 2 thiết bị/trình duyệt khác nhau (1 Admin đăng nhập, 1 người xem thường), Admin cập nhật tỉ số → xác nhận thiết bị còn lại tự cập nhật mà không cần tải lại trang.

## 9. Khả năng mở rộng

Đã áp dụng sớm định hướng mục 18 tài liệu gốc (thay LocalStorage bằng Firebase). Nếu cần mở rộng thêm (nhiều giải đấu, phân quyền nhiều Admin, lịch sử...), có thể thay Firebase bằng Supabase/API khác mà không đổi giao diện, do toàn bộ truy cập dữ liệu đi qua Pinia store + `utils/storage.js`.
