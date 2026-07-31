export function resolveTeam(teamSlot, matches) {
  if (!teamSlot) return null
  if (teamSlot.override != null) return teamSlot.override

  if (teamSlot.type === 'couple') {
    return teamSlot.coupleId
  }

  if (teamSlot.type === 'winner' || teamSlot.type === 'loser') {
    const source = matches.find((m) => m.id === teamSlot.matchId)
    if (!source || source.status !== 'done') return null
    const id1 = resolveTeam(source.team1, matches)
    const id2 = resolveTeam(source.team2, matches)
    if (id1 == null || id2 == null) return null
    const winnerId = source.score1 > source.score2 ? id1 : id2
    const loserId = source.score1 > source.score2 ? id2 : id1
    return teamSlot.type === 'winner' ? winnerId : loserId
  }

  if (teamSlot.type === 'groupWinner') {
    return getGroupWinner(teamSlot.group, matches)
  }

  return null
}

export function computeGroupStandings(group, matches) {
  const groupMatches = matches.filter((m) => m.group === group)
  const stats = {}

  groupMatches.forEach((m) => {
    const id1 = resolveTeam(m.team1, matches)
    const id2 = resolveTeam(m.team2, matches)
    if (id1 != null && !stats[id1]) stats[id1] = { coupleId: id1, wins: 0, losses: 0, points: 0, scored: 0, conceded: 0 }
    if (id2 != null && !stats[id2]) stats[id2] = { coupleId: id2, wins: 0, losses: 0, points: 0, scored: 0, conceded: 0 }
  })

  groupMatches.forEach((m) => {
    if (m.status !== 'done') return
    const id1 = resolveTeam(m.team1, matches)
    const id2 = resolveTeam(m.team2, matches)
    if (id1 == null || id2 == null) return
    stats[id1].scored += m.score1
    stats[id1].conceded += m.score2
    stats[id2].scored += m.score2
    stats[id2].conceded += m.score1
    if (m.score1 > m.score2) {
      stats[id1].wins += 1
      stats[id1].points += 1
      stats[id2].losses += 1
    } else {
      stats[id2].wins += 1
      stats[id2].points += 1
      stats[id1].losses += 1
    }
  })

  return Object.values(stats).map((s) => ({ ...s, diff: s.scored - s.conceded }))
}

export function isGroupComplete(group, matches) {
  const groupMatches = matches.filter((m) => m.group === group)
  return groupMatches.length > 0 && groupMatches.every((m) => m.status === 'done')
}

// Thứ tự xếp hạng: điểm -> đối đầu trực tiếp (chỉ khi đúng 2 đội bằng điểm) -> hiệu số -> tổng điểm ghi -> không phân định được (Admin override)
export function getGroupWinner(group, matches) {
  if (!isGroupComplete(group, matches)) return null
  const standings = computeGroupStandings(group, matches)
  if (standings.length === 0) return null

  const maxPoints = Math.max(...standings.map((s) => s.points))
  let leaders = standings.filter((s) => s.points === maxPoints)
  if (leaders.length === 1) return leaders[0].coupleId

  if (leaders.length === 2) {
    const h2h = matches.find((m) => {
      if (m.group !== group || m.status !== 'done') return false
      const id1 = resolveTeam(m.team1, matches)
      const id2 = resolveTeam(m.team2, matches)
      const pair = [leaders[0].coupleId, leaders[1].coupleId].sort().join(',')
      return [id1, id2].sort().join(',') === pair
    })
    if (h2h) {
      const id1 = resolveTeam(h2h.team1, matches)
      const id2 = resolveTeam(h2h.team2, matches)
      return h2h.score1 > h2h.score2 ? id1 : id2
    }
  }

  const maxDiff = Math.max(...leaders.map((s) => s.diff))
  leaders = leaders.filter((s) => s.diff === maxDiff)
  if (leaders.length === 1) return leaders[0].coupleId

  const maxScored = Math.max(...leaders.map((s) => s.scored))
  leaders = leaders.filter((s) => s.scored === maxScored)
  if (leaders.length === 1) return leaders[0].coupleId

  return null
}

const BRANCH_FINAL_LABELS = { m19: 'NHẤT A', m20: 'NHẤT B' }

export function getSlotLabel(teamSlot, matches) {
  if (!teamSlot) return null
  if (teamSlot.type === 'couple') return `Cặp ${teamSlot.coupleId}`

  if (teamSlot.type === 'winner' && BRANCH_FINAL_LABELS[teamSlot.matchId]) {
    return BRANCH_FINAL_LABELS[teamSlot.matchId]
  }

  if (teamSlot.type === 'winner' || teamSlot.type === 'loser') {
    const round1Matches = matches
      .filter((m) => m.round === 1)
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    const idx = round1Matches.findIndex((m) => m.id === teamSlot.matchId)
    if (idx === -1) return null
    return `${teamSlot.type === 'winner' ? 'A' : 'B'}${idx + 1}`
  }

  if (teamSlot.type === 'groupWinner') {
    return `${teamSlot.group[0]} NHẤT ${teamSlot.group.slice(1)}`
  }

  return null
}
