import { Chess } from '../classes/Chess';

class Piece {
    public color: string;
    public value: number;
    public position: string;
    protected instance: Chess;
    constructor(color: string, value: number, position: string, instance: Chess) {
        this.color = color;
        this.value = value;
        this.position = position;
        this.instance = instance;
    }
}

enum PiecesValues {
    King = 100,
    Queen = 9,
    Rook = 5,
    Knight = 3,
    Bishop = 3,
    Pawn = 1
}

export { Piece, PiecesValues };