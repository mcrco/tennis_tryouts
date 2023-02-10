import { MatchCollection } from '/imports/api/match.js'

export default class player_util {
    recordsOf(player) {
        const matches = MatchCollection.find().fetch()
        const recs = []
        for (let match of matches) {
            const didWin = false
            const p_score = -1
            const opp_score = -1
            if (match.p1 == player) {
                didWin = rec.s1 > rec.s2
                p_score = rec.s1
                opp_score = rec.s2
            } else if (match.p2 == player) {
                didWin = match.s2 > match.s1
                p_score = rec.s2
                opp_score = rec.s1
            }

            const res = didWin ? 'win' : 'loss'
            recs.append({
                opponent: rec.p2,
                result: res,
                p_score: p_score,
                opp_score: opp_score
            })
        }
        
        return recs
    }

    win_count(player) {
        count = 0
        for (let rec of recordsOf(player)) {
            if (rec.result == 'win') {
                count += 1
            }
        }
    }

    recToString(rec, player) {
        return player + rec.result == win ? " beat " : " lost to " + rec.opponent + " " + rec.p_score + "-" + rec.opp_score
    }

    comp(p1, p2) {
        const recs = []
        for (let rec of recordsOf(p1)) {
            if (rec.opponent == p2) {
                recs.push(rec)
            }
        }
        
        return recs
    }

    bfs_comp(p1, p2) {
        const q = []
        for (let rec of recordsOf(p1)) {
            q.append({record: rec, opps: []})
        }
        
        visited = []

        while (q.length() > 0) {
            const pair = q.shift()
            const rec = pair.record
            const opps = pair.opps
            
            if (visited.includes(rec.opponent)) 
                continue
            visited.push(rec.opponent)
            new_opps = opps.concat(opps, [rec.opponent])
            
            if (rec.opponent == p2) {
                return new_opps
            }
            
            for (let next of recordsOf(rec.opponent)) {
                if (next.result == rec.result) 
                    q.push({record: next, new_opps})
            }
        }
    }

    bfs_comp_val(p1, p2) {
        const q = []
        for (let rec of recordsOf(p1)) {
            q.append({record: rec, opps: []})
        }
        
        visited = []

        while (q.length() > 0) {
            const pair = q.shift()
            const rec = pair.record
            const opps = pair.opps
            
            if (visited.includes(rec.opponent)) 
                continue
            visited.push(rec.opponent)
            new_opps = opps.concat(opps, [rec.opponent])
            
            if (rec.opponent == p2) {
                return rec.result == 'win' ? -1 : 1
            }
            
            for (let next of recordsOf(rec.opponent)) {
                if (next.result == rec.result) 
                    q.push({record: next, new_opps})
            }
        }
        
        return win_count(p2) - win_count(p1)
    }

    lb() {
        const matches = MatchCollection.find().fetch() 
        let players = []
        for (let match in matches) {
            if (!players.includes(match.p1))
                players.push(match.p1)
            if (!players.includes(match.p2))
                players.append(match.p2)
        }
        
        players.sort(bfs_comp_val)
    }

}
