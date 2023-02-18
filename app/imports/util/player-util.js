export default class PlayerUtil {

    constructor(matches) {
        this.matches = matches
    }

    recordsOf(player) {
        const matches = this.matches
        const recs = []
        for (let match of matches) {
            let opp = ''
            let didWin = false
            let p_score = -1
            let opp_score = -1
            if (match.p1 == player) {
                opp = match.p2
                didWin = match.s1 > match.s2
                p_score = match.s1
                opp_score = match.s2
            } else if (match.p2 == player) {
                opp = match.p1
                didWin = match.s2 > match.s1
                p_score = match.s2
                opp_score = match.s1
            } else {
                continue
            }

            const res = didWin ? 'win' : 'loss'
            recs.push({
                player: player,
                opponent: opp,
                result: res,
                p_score: p_score,
                opp_score: opp_score,
                date: match.date,
            })
        }
        
        return recs
    }

    hasPlayer(player) {
        return this.recordsOf(player).length > 0
    }

    win_count(player) {
        let count = 0
        for (let rec of this.recordsOf(player)) {
            if (rec.result == 'win') {
                count += 1
            }
        }
        return count
    }

    recToString(rec, player) {
        return player + rec.result == win ? " beat " : " lost to " + rec.opponent + " " + rec.p_score + "-" + rec.opp_score
    }

    comp(p1, p2) {
        const matches = []
        for (const rec of this.recordsOf(p1)) {
            if (rec.opponent == p2) {
                matches.push({
                    p1: p1,
                    p2: rec.opponent,
                    s1: rec.p_score,
                    s2: rec.opp_score,
                    date: rec.date
                })
            }
        }
        
        return matches
    }

    bfs_comp(p1, p2) {
        const q = []
        for (let rec of this.recordsOf(p1)) {
            q.push({record: rec, opps: []})
        }
        
        let oppChains = []
        let visited = []

        while (q.length > 0) {
            const pair = q.shift()
            const rec = pair.record
            const opps = pair.opps
            
            if (visited.includes(rec.opponent)) 
                continue
            visited.push(rec.opponent)

            let new_opps = opps.concat([rec.opponent])
            
            if (rec.opponent == p2) {
                if (oppChains.length == 0 || oppChains[0].length >= new_opps.length) {
                    oppChains.push(new_opps)
                    continue
                }
            }
            
            for (let next of this.recordsOf(rec.opponent)) {
                if (next.result == rec.result) 
                    q.push({record: next, opps : new_opps})
            }
        }

        let matchChains = []
        for (const chain of oppChains) {
            let matchChain = []
            let curr = p1
            for (const opp of chain) {
                matchChain = matchChain.concat(this.comp(curr, opp))
                curr = opp
            }
            matchChains.push(matchChain)
        }

        return matchChains
    }

    bfs_comp_val(p1, p2) {
        const q = []
        for (let rec of this.recordsOf(p1)) {
            q.push({record: rec, opps: []})
        }
        
        let visited = []

        while (q.length > 0) {
            const pair = q.shift()
            const rec = pair.record
            const opps = pair.opps
            
            if (visited.includes(rec.opponent)) 
                continue
            visited.push(rec.opponent)
            let new_opps = opps.concat([rec.opponent])
            
            if (rec.opponent == p2) {
                return rec.result == 'win' ? -1 : 1
            }
            
            for (let next of this.recordsOf(rec.opponent)) {
                if (next.result == rec.result) 
                    q.push({record: next, opps: new_opps})
            }
        }
        
        return this.win_count(p2) - this.win_count(p1)
    }

    lb() {
        const matches = this.matches
        let players = []
        for (let match in matches) {
            if (!players.includes(match.p1))
                players.push(match.p1)
            if (!players.includes(match.p2))
                players.push(match.p2)
        }
        
        players.sort(bfs_comp_val)
    }

}
