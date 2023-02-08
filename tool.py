import fileinput
import pandas as pd

records = {}

class record:
    def __init__(self, opp, res, s1, s2):
        self.opponent = opp
        self.result = res
        self.my_score = s1
        self.opp_score = s2

def win_count(player):
    count = 0
    for rec in records[player]:
        if rec.result == 'win':
            count += 1
    return count

for line in fileinput.input(files = 'record.txt'):
    args = line.split()

    p1 = args[0]
    if p1 not in records:
        records[p1] = []

    p2 = args[1]
    if p2 not in records:
        records[p2] = []

    g1 = args[2]
    g2 = args[3]

    if (g1 > g2):
        records[p1].append(record(p2, 'win', g1, g2))
        records[p2].append(record(p1, 'loss', g2, g1))
    else:
        records[p1].append(record(p2, 'loss', g1, g2))
        records[p2].append(record(p1, 'win', g2, g1))

players = list(records.keys())
players.sort(reverse=True, key=lambda player : win_count(player))

def print_rec(rec, player):
    print(player, "beat" if rec.result == 'win' else "lost to", rec.opponent, rec.my_score, '-', rec.opp_score)

def deep_comp(p1, p2):
    q = []
    for rec in records[p1]:
        q.append((rec, 1))

    visited = []
    while (q):
        rec, degrees = q.pop(0)

        if rec.opponent in visited:
            continue
        visited.append(rec.opponent)

        if (rec.opponent == p2):
            print(p1, 'has a', degrees, 'degree', rec.result, 'against', p2)
            break

        for next in records[rec.opponent]:
            if next.result == rec.result:
                q.append((next, degrees + 1))

while True:
    line = input()
    if line == 'quit':
        break
    args = str(line).split()

    if args[0] == 'lb':
        players = list(records.keys())
        players.sort(reverse=True, key=lambda player : win_count(player))
        for player in players:
            print(player, win_count(player))
    
    elif args[0] == 'comp':
        p1 = args[1]
        p2 = args[2]
        print(p1, 'has', win_count(p1), 'wins')
        print(p2, 'has', win_count(p2), 'wins')
        for rec in records[p1]:
            print_rec(rec, p1)
            if rec.opponent == p1:
                print_rec(rec, p1)
        deep_comp(p1, p2)

    elif args[0] == 'stat':
        for rec in records[args[1]]:
            print_rec(rec, args[1])
