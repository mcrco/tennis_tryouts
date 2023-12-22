export default class CompUtil {

    matches: MatchType[];

    constructor(matches: MatchType[]) {
        this.matches = matches
    }

    recordsOf(player: string) {
        const matches = this.matches
        const recs: RecordType[] = []
        for (let match of matches) {
            let opp: string;
            let didWin: boolean = false;
            let pScore: number[];
            let oppScore: number[];
            if (match.p1 == player) {
                opp = match.p2;
                let setsWon = 0;
                let setsLost = 0;
                for (let i of [0, 1, 2]) {
                    if (match.s1[i] > match.s2[i])
                        setsWon++;
                    else if (match.s1[i] < match.s2[i])
                        setsLost++;
                }

                didWin = setsWon > setsLost
                pScore = match.s1
                oppScore = match.s2
            } else if (match.p2 == player) {
                opp = match.p1
                let setsWon = 0;
                let setsLost = 0;
                for (let i of [0, 1, 2]) {
                    if (match.s2[i] > match.s1[i])
                        setsWon++;
                    else if (match.s2[i] < match.s1[i])
                        setsLost++;
                }

                didWin = setsWon > setsLost;
                pScore = match.s2;
                oppScore = match.s1;
            } else {
                continue
            }

            const res = didWin ? 'win' : 'loss'
            recs.push({
                player: player,
                opponent: opp,
                result: res,
                pScore: pScore,
                oppScore: oppScore,
                date: match.date,
            })
        }

        return recs
    }

    hasPlayer(player: string) {
        return this.recordsOf(player).length > 0
    }

    getNumWins(player: string) {
        let count = 0;
        for (let rec of this.recordsOf(player)) {
            if (rec.result == 'win') {
                count += 1;
            }
        }
        return count;
    }

    getNumLosses(player: string) {
        return this.recordsOf(player).length - this.getNumWins(player);
    }

    recToString(rec: RecordType, player: string) {
        return player + rec.result == 'win' ? " beat " : " lost to " + rec.opponent + " " + rec.pScore + "-" + rec.oppScore
    }

    getMatches(p1: string, p2: string) {
        const matches = []
        for (const rec of this.recordsOf(p1)) {
            if (rec.opponent == p2) {
                matches.push({
                    p1: p1,
                    p2: rec.opponent,
                    s1: rec.pScore,
                    s2: rec.oppScore,
                    date: rec.date
                })
            }
        }

        return matches
    }

    getH2H(p1: string, p2: string) {
        let wins = 0;
        let losses = 0;

        for (let rec of this.recordsOf(p1)) {
            if (rec.opponent == p2) {
                if (rec.result == 'win') {
                    wins++;
                } else {
                    losses++;
                }
            }
        }

        return [wins, losses];
    }

    getWinChain(p1: string, p2: string) {
        const q: string[][] = [[p1]];
        const visited: string[] = [];

        while (q.length > 0) {
            const opps = q.shift()!;
            const lastOpp = opps[opps.length - 1];

            if (lastOpp == p2) {
                return opps;
            }

            if (visited.includes(lastOpp))
                continue;
            visited.push(lastOpp);

            for (let rec of this.recordsOf(lastOpp)) {
                const h2h = this.getH2H(lastOpp, rec.opponent);
                if (h2h[0] > h2h[1])
                    q.push(opps.concat([rec.opponent]));
            }
        }

        return [];
    }

    bfsCompare(p1: string, p2: string) {
        const p1WinChain = this.getWinChain(p1, p2);
        const p2WinChain = this.getWinChain(p2, p1);
        if ((p1WinChain.length == 0) == (p2WinChain.length == 0)) {
            return this.getNumWins(p2) - this.getNumWins(p1);
        }

        return p2WinChain.length - p1WinChain.length;
    }
}
