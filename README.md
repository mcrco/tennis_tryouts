Live @ [tennisranker.us](http://tennisranker.us)!

# Features

## User Accounts

- uses Meteor Accounts system
- user can log in with email and password
- has email verification and password reset functionality
- account verification and password reset emails sent via Amazon SES

## Coach Dashboard and Multiple Sessions

- users can create multiple sessions to manage different events, such as tryouts, tournaments, etc...
- each session has view code, which can be used by anyone to view the associated session by entering the code in the popup that appears when the user clicks the "View Session" button on the top right of the home page.
- session managers can allow participants to see results by sharing view code

## Match List

- every session has a list of matches that is inputted by session manager
- app supports best of 3 sets match format
- matches can be edited after being inputted for the first time

## Leaderboard

- app automatically ranks players based on matches
- uses the player compare functionality described below

## Player Comparer

- provides valuable insight to matchups between any two players using relevant matches
- displays head to head between players
- detects any indirect matchup (if Alice beats Bob, Bob beats Carl, then app will tell you that Alice is probably better than Carl and displays relevant matches)
- can detect rock-paper-scissors cycles within players and gives them the same rank in the leaderboard
  - e.g. if A beats B, B beats C, but C beats A, players A, B, and C are ranked the same
- if two players aren't directly comparable, it will compare them based on the number of wins
