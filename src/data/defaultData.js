export const defaultCouples = [
  { id: 1, maleName: 'Hoàng Anh', femaleName: 'Phương Anh' },
  { id: 2, maleName: 'Nhật Minh', femaleName: 'Lan Anh' },
  { id: 3, maleName: 'Hùng Hr', femaleName: 'Loan' },
  { id: 4, maleName: 'Ck My', femaleName: 'My' },
  { id: 5, maleName: 'Huy Sapo', femaleName: 'Trần Trang' },
  { id: 6, maleName: 'Chiến', femaleName: 'Hiền' },
  { id: 7, maleName: 'Lương', femaleName: 'Thanh' },
  { id: 8, maleName: 'Hiếu', femaleName: 'Thảo' },
  { id: 9, maleName: 'Hải', femaleName: 'Liên' },
  { id: 10, maleName: 'Phong', femaleName: 'Lê' },
  { id: 11, maleName: 'Lâm', femaleName: 'Linh' },
  { id: 12, maleName: 'Trung', femaleName: 'Thủy' },
]

function coupleSlot(coupleId) {
  return { type: 'couple', coupleId, override: null }
}
function winnerSlot(matchId) {
  return { type: 'winner', matchId, override: null }
}
function loserSlot(matchId) {
  return { type: 'loser', matchId, override: null }
}
function groupWinnerSlot(group) {
  return { type: 'groupWinner', group, override: null }
}
function baseMatch(id, round, group, court, time, team1, team2) {
  return { id, round, group, court, time, team1, team2, score1: null, score2: null, status: 'pending' }
}

export const defaultMatches = [
  // Vòng 1 — Loại trực tiếp (07:30–08:00)
  baseMatch('m1', 1, null, 1, '07:30-07:45', coupleSlot(1), coupleSlot(2)),
  baseMatch('m2', 1, null, 1, '07:45-08:00', coupleSlot(3), coupleSlot(4)),
  baseMatch('m3', 1, null, 2, '07:30-07:45', coupleSlot(5), coupleSlot(6)),
  baseMatch('m4', 1, null, 2, '07:45-08:00', coupleSlot(7), coupleSlot(8)),
  baseMatch('m5', 1, null, 3, '07:30-07:45', coupleSlot(9), coupleSlot(10)),
  baseMatch('m6', 1, null, 3, '07:45-08:00', coupleSlot(11), coupleSlot(12)),

  // Vòng 2 — Vòng tròn tính điểm (20:00–21:00)
  baseMatch('m7', 2, 'A1', 1, '20:00-20:15', winnerSlot('m1'), winnerSlot('m2')),
  baseMatch('m8', 2, 'A2', 2, '20:00-20:15', winnerSlot('m4'), winnerSlot('m5')),
  baseMatch('m9', 2, 'B1', 3, '20:00-20:15', loserSlot('m1'), loserSlot('m2')),
  baseMatch('m10', 2, 'A1', 1, '20:15-20:30', winnerSlot('m2'), winnerSlot('m3')),
  baseMatch('m11', 2, 'A2', 2, '20:15-20:30', winnerSlot('m5'), winnerSlot('m6')),
  baseMatch('m12', 2, 'B1', 3, '20:15-20:30', loserSlot('m2'), loserSlot('m3')),
  baseMatch('m13', 2, 'A1', 1, '20:30-20:45', winnerSlot('m1'), winnerSlot('m3')),
  baseMatch('m14', 2, 'A2', 2, '20:30-20:45', winnerSlot('m4'), winnerSlot('m6')),
  baseMatch('m15', 2, 'B1', 3, '20:30-20:45', loserSlot('m1'), loserSlot('m3')),
  baseMatch('m16', 2, 'B2', 1, '20:45-21:00', loserSlot('m4'), loserSlot('m5')),
  baseMatch('m17', 2, 'B2', 2, '20:45-21:00', loserSlot('m5'), loserSlot('m6')),
  baseMatch('m18', 2, 'B2', 3, '20:45-21:00', loserSlot('m4'), loserSlot('m6')),

  // Vòng 3 — Chung kết nhánh (21:00–21:15)
  baseMatch('m19', 3, null, 1, '21:00-21:15', groupWinnerSlot('A1'), groupWinnerSlot('A2')),
  baseMatch('m20', 3, null, 2, '21:00-21:15', groupWinnerSlot('B1'), groupWinnerSlot('B2')),

  // Vòng 4 — Chung kết tổng (21:15–21:30)
  baseMatch('m21', 4, null, 1, '21:15-21:30', winnerSlot('m19'), winnerSlot('m20')),
]

export const defaultRulesContent = {
  announcementTitle: 'ĐỒNG LƯƠN BADMINTON CUP 2026',
  announcementBody:
    'Thông báo: Đúng 19h30 - 21h30 tối thứ 6 ngày 31/7/2026 giải đấu "Đồng Lươn Badminton Cup 2026" sẽ được khởi tranh. Yêu cầu các lông thủ tham gia giải có mặt đúng giờ.\n\n' +
    'Mình cập nhật một số luật đặc biệt của giải: Nam không được phát bắn hay cao sâu Nữ (Nam phát bắn, cao sâu Nam thì bình thường), Nữ không được phát bắn nữ nhưng phát cao sâu bình thường (Nữ được phát bắn Nam). Các trường hợp phát bắn hay cao sâu vi phạm bị xử đánh lại, nếu cố tình lần 2 bị trừ 1 điểm. Nam đập cầu trúng đầu Nữ bị trừ 1 điểm, Nữ đập cầu trúng đầu Nữ đánh lại tình huống không bị trừ điểm.\n\n' +
    'Thời gian thi đấu 19h30 - 21h30. Đến muộn 10 phút - 29 phút khi gọi vào trận bị trừ 3 - 5 điểm. Muộn 30 phút trở đi xử thua (Trường hợp đặc biệt BTC sẽ có thể xử lý khác).',
  announcementClosing:
    'Trân trọng kính mời tất cả các lông thủ đến xem và cổ vũ cho các vận động viên để giải đấu thêm sôi động, kịch tính, và hoàn thành mỹ mãn. Thanks All!',
  serveRules: [
    {
      situation: 'Nam phát cầu cho Nữ',
      handling: 'KHÔNG ĐƯỢC phát bắn hay cao sâu.\nVi phạm: Xử đánh lại. Cố tình vi phạm lần 2 → trừ 1 điểm.',
    },
    { situation: 'Nam phát cầu cho Nam', handling: 'Phát bắn & cao sâu bình thường' },
    {
      situation: 'Nữ phát cầu cho Nữ',
      handling: 'KHÔNG ĐƯỢC phát bắn, nhưng được phát cao sâu bình thường.\nVi phạm: Xử đánh lại. Cố tình vi phạm lần 2 → trừ 1 điểm.',
    },
    { situation: 'Nữ phát cầu cho Nam', handling: 'Được phát bắn & cao sâu bình thường' },
    { situation: 'Nam đập cầu trúng đầu Nữ', handling: 'Trừ 1 điểm của bên đập' },
    { situation: 'Nữ đập cầu trúng đầu Nữ', handling: 'Đánh lại tình huống (không bị trừ điểm)' },
  ],
  officialTime: '19h30 - 21h30 tối thứ 6 ngày 31/07/2026.',
  officialTimeNote: 'Yêu cầu tất cả các lông thủ tham gia giải có mặt đúng giờ để điểm danh & khởi động.',
  latePenalties:
    'Muộn 10 - 29 phút khi gọi vào trận: Bị trừ 3 - 5 điểm.\nMuộn từ 30 phút trở đi: Xử thua trận.\n(Trường hợp đặc biệt BTC sẽ có thể xem xét xử lý khác).',
  formatRules:
    'Đội hình: Mỗi đội là một cặp nam - nữ, bốc thăm ngẫu nhiên từ 12 lông thủ nam và 12 lông thủ nữ.\n' +
    'Vòng 1 – loại trực tiếp: 6 trận. Cặp thắng vào Nhánh A (A1-A6), cặp thua vào Nhánh B (B1-B6). Thua vòng 1 vẫn còn nguyên cơ hội vô địch.\n' +
    'Vòng 2 – vòng tròn: 4 bảng × 3 cặp, mỗi bảng 3 trận. Mỗi cặp đánh 2 trận. Nhất bảng đi tiếp.\n' +
    'Xếp hạng bảng: Số trận thắng → hiệu số điểm → tổng điểm ghi được.\n' +
    'Vòng 3 – chung kết nhánh: Nhất bảng A1 gặp nhất bảng A2, nhất bảng B1 gặp nhất bảng B2.\n' +
    'Vòng 4 – chung kết tổng: Vô địch nhánh A gặp Vô địch nhánh B để xác định Lươn Chúa thực sự của giải.',
  eventInfoCards: [
    { label: 'Ngày thi đấu', value: 'Thứ 6, 31/07/2026', note: '' },
    { label: 'Giờ', value: '19h30 - 21h30', note: 'Có mặt đúng 19h30' },
    { label: 'Địa điểm', value: 'THPT Khương Đình', note: 'Sân 1 · 2 · 3' },
    { label: 'Trận cuối', value: 'Tranh ngôi Lươn Chúa', note: 'Vô địch A gặp Vô địch B' },
  ],
}
