const QueenScore: number[][] = [
    [0.5, 0.6, 0.8, 1.0, 1.0, 0.8, 0.6, 0.5],
    [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    [0.6, 0.8, 1.0, -2.0, 1.2, 1.0, 0.8, 0.6],
    [0.7, 1.0, 1.2, -1.0, 1.4, 0.0, 1.0, 0.7],
    [0.7, 1.0, 1.2, 1.4, 1.4, 0.0, 1.0, 0.7],
    [0.6, 0.8, 1.0, -1.2, 1.2, 1.0, 0.8, 0.6],
    [0.5, 0.6, 0.8, -2, 1.0, 0.8, 0.6, 0.5],
    [-2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0]
]
const RookScore: number[][] = [
    [1.1, 0.7, 0.0, 0.0, 0.0, 0.0, 0.7, 1.1],
    [1.0, 0.4, 0.0, 0.0, 0.0, 0.0, 0.4, 1.0],
    [0.9, 0.3, 0.0, 0.0, 0.0, 0.0, 0.3, 0.9],
    [0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8],
    [0.6, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, 0.6],
    [0.4, 0.1, 0.2, 0.0, 0.0, 0.2, 0.1, 0.4],
    [0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
    [0.0, -3.0, 0.0, 2.0, 0.0, 2.0, -3.0, 0.0]
]

const KingScore: number[][] = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
]

const PawnScore: number[][] = [
    [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    [0.3, 0.0, 0.0, 0.0, 5.0, 1.0, 3.0, 0.0],
    [-2.0, -1.8, -1.5, 2.0, -3.0, -1.5, -1.8, -2.0],
    [0.0, 0.0, 0.0, -3.0, 1.0, -3.0, -3.0, -3.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
]

const KnightScore: number[][] = [
    [-3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0, -3.0],
    [-3.0, 1.0, 5.0, 1.0, 0.0, 5.0, 1.0, -2.0],
    [-3.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0],
    [-3.0, 0.0, 0.0, 1.5, 1.5, 0.0, 0.0, 0.0],
    [-3.0, 0.0, 0.0, 3.0, 3.0, 0.0, 0.0, 0.0],
    [-1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0],
    [-3.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0],
    [-3.0, 0.0, -3.0, -3.0, -3.0, -3.0, 0.0, -3.0],
]

const BishopScore: number[][] = [
    [-5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0, -5.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [-1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, -1.0],
    [-2.0, -2.0, 1.0, 0.0, 0.0, 1.0, -2.0, -2.0],
    [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
    [2.0, -5.0, 0.0, 0.0, 0.0, 0.0, -5.0, 2.0],
    [-5.0, -1.0, -5.0, 0.0, 0.0, -5.0, -1.0, -5.0],
    [-5.0, -5.0, -2.0, -5.0, -5.0, -2.0, -5.0, -5.0],
]

export { KingScore, QueenScore, RookScore, BishopScore, KnightScore, PawnScore };