#!/bin/python3

import json
import functools

# Dictionary stores records for a player
records = {}

# Data structure to store match result for a given player
class record:
    def __init__(self, opp, res, s1, s2):
        self.opponent = opp
        self.result = res
        self.my_score = s1
        self.opp_score = s2

# Counts number of wins a player has
def win_count(player):
    count = 0
    for rec in records[player]:
        if rec.result == 'win':
            count += 1
    return count

# Take in records from a spreadsheet
f = open('./records.json')
for rec in json.load(f):
    p1 = rec['p1']
    if p1 not in records:
        records[p1] = []

    p2 = rec['p2']
    if p2 not in records:
        records[p2] = []

    g1 = rec['s1']
    g2 = rec['s2']

    if (g1 > g2):
        records[p1].append(record(p2, 'win', g1, g2))
        records[p2].append(record(p1, 'loss', g2, g1))
    else:
        records[p1].append(record(p2, 'loss', g1, g2))
        records[p2].append(record(p1, 'win', g2, g1))

# Printing a record
def print_rec(rec, player):
    print(player, "beat" if rec.result == 'win' else "lost to", rec.opponent, rec.my_score, '-', rec.opp_score)

# Check if two players have played before
def comp(p1, p2):
    # Check if they have played before
    for rec in records[p1]:
        if rec.opponent == p2:
            print_rec(rec, p1)

# BFS to compare 2 players
def bfs_comp(p1, p2):
    q = []
    for rec in records[p1]:
        q.append((rec, []))
        print_rec(rec, p1)

    visited = []
    while (q):
        rec, opps = q.pop(0)

        if rec.opponent in visited:
            continue
        visited.append(rec.opponent)
        opps.append(rec.opponent)

        if (rec.opponent == p2):
            print(p1, 'has a', len(opps), 'degree', rec.result, 'against', p2)
            print(opps)
            curr = p1
            for opp in opps:
                comp(curr, opp)
                curr = opp
            break

        for next in records[rec.opponent]:
            if next.result == rec.result:
                print_rec(next, rec.opponent)
                q.append((next, opps))

def bfs_comp_val(p1, p2):
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
            return -1 if rec.result == 'win' else 1

        for next in records[rec.opponent]:
            if next.result == rec.result:
                q.append((next, degrees + 1))

    return win_count(p2) - win_count(p1)

# players = ['Nikhil Aadapu', 'Sourodeep Deb', 'Warren Zhou', 'Charles Wang', 'Neev Fnu', 'Sreesh Srinivasan', 'Aaron Li', 'Rishabh Shah', 'Lakshmi Prasanna', 'Sairisheeth Venkat', 'Sohum Waduwani', 'Sai Divyesh Tunguturu']
# players.sort(key=functools.cmp_to_key(bfs_comp_val))
# for player in players:
#     print(player, win_count(player))

bfs_comp('Nikhil Aadapu', 'Sairisheeth Venkat')

# for p1 in players:
#     for p2 in players:
#         if p1 != p2:
#             bfs_comp(p1, p2)

# Interactive program
while True:
    line = input()
    if line == 'q':
        break
    args = str(line).split()

    command = args[0]
    p1 = args[1] + ' ' + args[2]

    # Print leaderboard
    if command == 'lb':
        players = list(records.keys())
        players.sort(reverse=True, key=lambda player : win_count(player))
        for player in players:
            print(player, win_count(player))
    
    # Print comparison between two players
    elif command == 'comp':
        p2 = args[3] + ' ' + args[4]
        
        # Number of wins
        print(p1, 'has', win_count(p1), 'wins')
        print(p2, 'has', win_count(p2), 'wins')
        comp(p1, p2)

        # Check if they can be indirectly compared
        bfs_comp(p1, p2)

    # Print all records of player
    elif command == 'stat':
        for rec in records[p1]:
            print_rec(rec, p1)
