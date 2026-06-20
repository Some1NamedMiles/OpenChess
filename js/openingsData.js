// js/openingsData.js
const openingsData = {
    italian: {
        name: "The Italian Game",
        description: "One of the oldest and most fundamental chess openings, focusing on rapid development and controlling the center.",
        moves: ["1. e4 e5", "2. Nf3 Nc6", "3. Bc4"],
        philosophy: "White immediately develops the bishop to an active diagonal, eyeing Black's weakest point: the f7 pawn.",
        branches: [
            {
                id: "A",
                title: "Giuoco Piano (3... Bc5)",
                type: "Solid plan",
                explanation: "Black mirrors White's bishop deployment. This leads to classical, strategic battles where both sides fight carefully for central control.",
                nextMoves: ["4. c3 Nf6", "5. d3"]
            },
            {
                id: "B",
                title: "Two Knights Defense (3... Nf6)",
                type: "Best plan / Counterattack",
                explanation: "Black aggressively develops the knight to attack White's e4 pawn. This opens up highly tactical lines, including the famous Fried Liver Attack if White plays 4.Ng5.",
                nextMoves: ["4. Ng5 d5", "5. exd5"]
            },
            {
                id: "C",
                title: "Early Counterattack (3... d5?!)",
                type: "Risky / Incorrect plan",
                explanation: "An premature strike in the center. After 4.exd5, Black often loses time recapturing with the queen or forcing pieces out too early before completing development.",
                nextMoves: ["4. exd5 Qxd5", "5. Nc3"]
            }
        ]
    },
    london: {
        name: "The London System",
        description: "A highly reliable, 'system-based' opening for White that can be played against almost any Black setup.",
        moves: ["1. d4", "2. Nf3", "3. Bf4"],
        philosophy: "White creates an unshakeable pawn triangle (c3-d4-e3) while getting the dark-squared bishop outside the pawn chain early.",
        branches: [
            {
                id: "A",
                title: "Symmetrical Response (...d5 Structure)",
                type: "Solid plan",
                explanation: "Black plays solidly in the center. White continues with e3, c3, and Bd3, steering the game into a safe, controllable positional squeeze.",
                nextMoves: ["3... d5", "4. e3 e6"]
            },
            {
                id: "B",
                title: "King's Indian Setup (...Nf6 & ...g6)",
                type: "Flexible system",
                explanation: "Black prepares to fianchetto their dark-squared bishop. White adapts by maintaining central space and preparing a queenside expansion.",
                nextMoves: ["3... Nf6", "4. e3 g6"]
            },
            {
                id: "C",
                title: "Early Queen Aggression (...c5 & ...Qb6)",
                type: "Punishable line if careless",
                explanation: "Black tries to exploit White's missing dark-squared bishop by attacking the weakened b2 pawn. White must respond accurately with Qb3 or Qc1.",
                nextMoves: ["3... c5", "4. e3 Qb6"]
            }
        ]
    },
    sicilian: {
        name: "The Sicilian Defense",
        description: "The most popular and highest-scoring response to White's 1.e4, creating immediate asymmetrical imbalances.",
        moves: ["1. e4 c5"],
        philosophy: "Black fights for the center using a flank pawn (c5), aiming for a counter-attack on the open c-file later.",
        branches: [
            {
                id: "A",
                title: "The Open Sicilian (2. Nf3 & 3. d4)",
                type: "Best plan / Sharpest lines",
                explanation: "White fights for central initiative by sacrificing a central pawn for rapid development. Leads to highly aggressive, double-edged games.",
                nextMoves: ["2. Nf3 d6", "3. d4 cxd4"]
            },
            {
                id: "B",
                title: "The Closed Sicilian (2. Nc3)",
                type: "Solid plan",
                explanation: "White avoids early tactical chaos, closing the center to build up a slow, strategic kingside pawn storm.",
                nextMoves: ["2. Nc3 Nc6", "3. g3"]
            },
            {
                id: "C",
                title: "The Alapin Variation (2. c3)",
                type: "Anti-Sicilian strategy",
                explanation: "White prepares to establish a classical full pawn center with a quick d4. Black must strike back immediately with 2...d5 or 2...Nf6.",
                nextMoves: ["2. c3 d5", "3. exd5 Qxd5"]
            }
        ]
    }
};
