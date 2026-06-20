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
                title: "Giuoco Piano",
                type: "Solid plan",
                steps: [
                    { move: "3... Bc5", notation: "Bc5", explanation: "Black mirrors your setup. By placing the bishop here, Black fights for control of the center and prevents White from easily pushing pawns forward." },
                    { move: "4. c3", notation: "c3", explanation: "White plays a slow, building move. The goal isn't just safety—White is preparing to play d4 on the next turn to create a massive two-pawn center." },
                    { move: "4... Nf6", notation: "Nf6", explanation: "Black counterattacks instantly, developing a piece and attacking White's undefended e4 pawn before White can pull off the d4 push." },
                    { move: "5. d3", notation: "d3", explanation: "White chooses solid defense over immediate chaos. This protects the e4 pawn and locks in a steady, highly strategic middle-game fight." }
                ]
            },
            {
                id: "B",
                title: "Two Knights Defense",
                type: "Best plan / Counterattack",
                steps: [
                    { move: "3... Nf6", notation: "Nf6", explanation: "Black skips the bishop and brings out a knight to counterattack White's e4 pawn immediately, daring White to get aggressive." },
                    { move: "4. Ng5", notation: "Ng5", explanation: "White takes the bait! This violates the beginner rule of 'don't move a piece twice,' but creates an immediate double-attack with the bishop on the weak f7 pawn." },
                    { move: "4... d5", notation: "d5", explanation: "The only good defense for Black. Black blocks the white bishop's vision, cutting off the deadly battery attacking f7." },
                    { move: "5. exd5", notation: "exd5", explanation: "White takes the pawn, continuing to threaten Black. The tactical lines here get incredibly sharp and exciting from both sides." }
                ]
            },
            {
                id: "C",
                title: "Early Counterattack",
                type: "Risky / Incorrect plan",
                steps: [
                    { move: "3... d5?!", notation: "d5", explanation: "Black lashes out in the center way too early before finishing development. This allows White to seize absolute control." },
                    { move: "4. exd5", notation: "exd5", explanation: "White happily accepts the free central space, removing Black's central pawn and putting immediate pressure on Black's position." },
                    { move: "4... Qxd5", notation: "Qxd5", explanation: "Black recaptures with the queen. While it gets the pawn back, bringing the queen out on move 4 makes her an easy target." },
                    { move: "5. Nc3", notation: "Nc3", explanation: "White develops a new knight with tempo! White attacks Black's queen, forcing her to run away and waste another turn while White takes a massive development lead." }
                ]
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
                title: "Symmetrical Response",
                type: "Solid plan",
                steps: [
                    { move: "3... d5", notation: "d5", explanation: "Black stakes an equal claim in the center, setting up a solid traditional defensive mirror." },
                    { move: "4. e3", notation: "e3", explanation: "White locks in the central d4 pawn. Because the dark bishop is already outside on f4, this pawn doesn't trap it in!" },
                    { move: "4... e6", notation: "e6", explanation: "Black copies White's solid structure, but notice the difference: Black's light-squared bishop is now trapped behind its own pawns." }
                ]
            },
            {
                id: "B",
                title: "King's Indian Setup",
                type: "Flexible system",
                steps: [
                    { move: "3... Nf6", notation: "Nf6", explanation: "Black keeps options open, planning a hypermodern approach rather than fighting directly in the center with pawns." },
                    { move: "4. e3", notation: "e3", explanation: "White sticks to the master plan, reinforcing d4 and preparing a comfortable home for the light-squared bishop." },
                    { move: "4... g6", notation: "g6", explanation: "Black prepares to 'fianchetto' their dark bishop to g7, aiming to influence the board from a distance across the long diagonal." }
                ]
            },
            {
                id: "C",
                title: "Early Queen Aggression",
                type: "Punishable line if careless",
                steps: [
                    { move: "3... c5", notation: "c5", explanation: "Black immediately strikes at White's central d4 pawn from the flank, trying to disrupt the peaceful London setup." },
                    { move: "4. e3", notation: "e3", explanation: "White stays calm and guards the center, refusing to break the solid structural triangle." },
                    { move: "4... Qb6", notation: "Qb6", explanation: "The sting of Black's plan. By leaving the queenside early, White's b2 pawn is unguarded. Black's queen targets it instantly." }
                ]
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
                title: "The Open Sicilian",
                type: "Best plan / Sharpest lines",
                steps: [
                    { move: "2. Nf3", notation: "Nf3", explanation: "White develops logically toward the center, getting ready to blow the game open on the next move." },
                    { move: "2... d6", notation: "d6", explanation: "Black fights for control of the e5 square and clears a path to activate the light-squared bishop later." },
                    { move: "3. d4", notation: "d4", explanation: "White strikes directly in the center! White fights for quick development and dynamic piece activity." },
                    { move: "3... cxd4", notation: "cxd4", explanation: "Black trades a flank pawn for a central pawn. The c-file is now open for Black's future counterattack." }
                ]
            },
            {
                id: "B",
                title: "The Closed Sicilian",
                type: "Solid plan",
                steps: [
                    { move: "2. Nc3", notation: "Nc3", explanation: "White decides not to open the center up, choosing instead to develop calmly and control the e4 square." },
                    { move: "2... Nc6", notation: "Nc6", explanation: "Black matches White's development, adding more pressure to the d4 and e5 central squares." },
                    { move: "3. g3", notation: "g3", explanation: "White prepares to place the light bishop on g2, planning a slow, powerful kingside attack later." }
                ]
            },
            {
                id: "C",
                title: "The Alapin Variation",
                type: "Anti-Sicilian strategy",
                steps: [
                    { move: "2. c3", notation: "c3", explanation: "White plays an unusual pawn move. The goal is simple: support a future d4 push to build a perfect two-pawn center." },
                    { move: "2... d5", notation: "d5", explanation: "Black strikes back immediately! Because White's knight isn't on c3, Black can bring the queen out safely if needed." },
                    { move: "3. exd5", notation: "exd5", explanation: "White trades off pawns, disrupting Black's early center structure while planning to continue developing smoothly." }
                ]
            }
        ]
    }
};
