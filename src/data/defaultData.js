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

export const defaultRules = 'Thể lệ giải đấu sẽ được Admin cập nhật tại đây.'
