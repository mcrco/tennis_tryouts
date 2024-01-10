class Match {
    p1: string;
    p2: string;
    s1: number[];
    s2: number[];
    date: Date;

    constructor(p1: string, p2: string, s1: number[], s2: number[], date: Date) {
        this.p1 = p1;
        this.p2 = p2;
        this.s1 = s1;
        this.s2 = s2;
        this.date = date;
    }

    hasPlayer(player: string) {
        return player === this.p1 || player === this.p2;
    }

    getOpponent(player: string) {
        return player === this.p1 ? this.p2 : this.p1;
    }

    getScore(player: string) {
        if (player === this.p1)
            return this.s1;
        else if (player === this.p2)
            return this.p2;
        else
            throw new Error('Player not in match');
    }

    getOppScore(player: string) {
        if (player === this.p1)
            return this.s2;
        else if (player === this.p2)
            return this.p1;
        else
            throw new Error('Player not in match');
    }

    getWinner() {
        let setsWon = 0;
        let setsLost = 0;
        for (let i of [0, 1, 2]) {
            if (this.s1[i] > this.s2[i])
                setsWon++;
            else if (this.s1[i] < this.s2[i])
                setsLost++;
        }
        return setsWon > setsLost ? this.p1 : this.p2;
    }
}

export default class CompUtil {

    matches: Match[];
    players: string[];

    constructor(matches: MatchType[]) {
        this.matches = matches.map(match => new Match(match.p1, match.p2, match.s1, match.s2, match.date));
        this.players = [];
        for (const match of matches) {
            if (!this.players.includes(match.p1))
                this.players.push(match.p1);
            if (!this.players.includes(match.p2))
                this.players.push(match.p2)
        }
    }

    getMatches(player: string) {
        return this.matches.filter(match => match.hasPlayer(player));
    }

    hasPlayer(player: string) {
        return this.getMatches(player).length > 0;
    }

    getNumWins(player: string) {
        let count = 0;
        for (let match of this.matches) {
            if (match.getWinner() === player) {
                count += 1;
            }
        }
        return count;
    }

    getNumLosses(player: string) {
        return this.getMatches(player).length - this.getNumWins(player);
    }

    getMatchesBetween(p1: string, p2: string) {
        return this.matches.filter(match => match.hasPlayer(p1) && match.hasPlayer(p2));
    }

    getH2H(p1: string, p2: string) {
        let wins = 0;
        let losses = 0;

        for (const match of this.getMatches(p1)) {
            if (match.hasPlayer(p2)) {
                if (match.getWinner() === p1) {
                    wins++;
                } else {
                    losses++;
                }
            }
        }

        return [wins, losses];
    }

    existsH2HChain(p1: string, p2: string) {
        const q: string[] = [p1];
        const visited: string[] = [];

        while (q.length > 0) {
            const opp = q.shift()!;
            if (opp == p2)
                return true;

            if (visited.includes(opp))
                continue;
            visited.push(opp);

            for (const match of this.getMatches(opp)) {
                const h2h = this.getH2H(opp, match.getOpponent(opp));
                if (h2h[0] > h2h[1])
                    q.push(match.getOpponent(opp));
            }
        }
    }

    existsLoop(p1: string, p2: string) {
        return this.existsH2HChain(p1, p2) && this.existsH2HChain(p2, p1);
    }

    getValidH2HChain(p1: string, p2: string) {
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

            for (const match of this.getMatches(lastOpp)) {
                const nextOpp = match.getOpponent(lastOpp);
                if (this.existsLoop(lastOpp, nextOpp))
                    continue;
                const h2h = this.getH2H(lastOpp, nextOpp);
                if (h2h[0] > h2h[1])
                    q.push(opps.concat([nextOpp]));
            }
        }

        return [];
    }

    compare(p1: string, p2: string) {
        if (this.existsLoop(p1, p2))
            return this.getNumWins(p2) - this.getNumWins(p1);
        return this.existsH2HChain(p1, p2) ? -1 : 1
    }
}
