type MatchType = {
    _id: string;
    p1: string;
    p2: string;
    s1: number[];
    s2: number[];
    date: Date;
}

type RecordType = {
    player: string;
    opponent: string;
    result: string;
    pScore: number[];
    oppScore: number[];
    date: Date;
}

type SessionType = {
    _id: string;
    name: string;
    owner: string;
    code: string;
    created: Date;
}
