import { Chess } from '../classes/Chess';
import { Piece, PiecesValues } from './Piece';
import { notToPos, posToNot } from '../functions/main';
import { Events } from '../classes/EventEmitter';

export class Pawn extends Piece {
    public canEnPassant: boolean;
    constructor(color: string, position: string, instance: Chess) {
        super(color, PiecesValues.Pawn, position, instance);
        this.canEnPassant = false;
    }
    private isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x <= 7 && y >= 0 && y <= 7;
    }
    public isPiece(value: any): value is Piece {
        return value && typeof value === 'object' && value.hasOwnProperty('color');
    }
    public getAvailableMoves(cache: boolean = false): string[] {
        const { x, y } = notToPos(this.position);
        let moves: string[] = [];
    
        const forwardOne = this.color === "white" ? y - 1 : y + 1;
        const forwardTwo = this.color === "white" ? y - 2 : y + 2;
        const initialRow = this.color === "white" ? 6 : 1;
    
        if (y === initialRow && this.instance.grid[forwardTwo][x] === 0 && this.instance.grid[forwardOne][x] === 0) {
            moves.push(posToNot(x, forwardTwo));
        }
        if (this.instance.grid[forwardOne][x] === 0) {
            moves.push(posToNot(x, forwardOne));
        }
    
        const captureDirections = [-1, 1];
        captureDirections.forEach(direction => {
            const newX = x + direction;
            if (newX >= 0 && newX <= 7) {
                const target = this.instance.grid[this.color === "white" ? y - 1 : y + 1][newX];
                const sidePawn = this.instance.grid[y][newX];
                if (typeof target !== 'number' || (sidePawn instanceof Pawn && sidePawn.canEnPassant)) {
                    moves.push(posToNot(newX, this.color === "white" ? y - 1 : y + 1));
                }
            }
        });
    
        return !cache ? moves.filter(move => {
            const { x, y } = notToPos(move);
            return this.instance.grid[y][x] === 0
        }) : moves;
    }

    public canMoveTo(x: number, y: number): boolean {
        if (!this.isValidPosition(x, y)) throw new Error('Invalid position.');
        const newPosNot = posToNot(x, y);
        return this.getAvailableMoves(true).includes(newPosNot)
    }
    public moveTo(x: number, y: number): void {
        if (!this.isValidPosition(x, y)) throw new Error('Invalid position.');
        const { x: oldX, y: oldY } = notToPos(this.position);
        const target = this.instance.grid[y][x]
        let pieceCaptured: boolean = typeof target !== "number";
        let pieceValue: number = 0;
        this.instance.grid[oldY][oldX] = 0;
        if (this.isPiece(target)) {
            pieceValue = target.value;
        }
        this.instance.grid[y][x] = this;
        this.position = posToNot(x, y);
        if (this.instance.isCheck(this.color)) {
            this.instance.grid[y][x] = target;
            this.instance.grid[oldY][oldX] = this;
            this.position = posToNot(oldX, oldY);
            return this.instance.emit(Events.IllegalMove, {
                from: posToNot(oldX, oldY),
                to: posToNot(x, y)
            })
        }
        const dir = this.color === 'white' ? -1 : 1;
        if (Math.abs(oldX - x) === Math.abs(oldY - y) && Math.abs(oldY - y) === 1) {
            const downTarget = this.instance.grid[y+dir][x]
            if (downTarget instanceof Pawn && downTarget.canEnPassant) {
                this.instance.grid[y+dir][x] = 0;
                pieceCaptured = true;
                pieceValue += downTarget.value;
            }
        }
        let event = Events.Move;
        let notation = `${posToNot(x, y)}`;

        if (this.instance.makeCheck(this.color)) {
            event |= Events.Check;
            notation += "+";
        } 
        if (pieceCaptured) {
            event |= Events.PieceCaptured;
            notation = `${posToNot(oldX, oldY).charAt(0)}x${posToNot(x, y)}${notation.includes("+") ? "+": ""}`;
        }

        this.instance.emit(event, {
            from: posToNot(oldX, oldY),
            to: this.position,
            piece: 'Pawn',
            notation: notation,
            value: pieceValue,
            grid: this.instance.grid,
            stringGrid: this.instance.stringGrid,
            flatGrid: this.instance.flatGrid,
            stringFlatGrid: this.instance.stringFlatGrid,
            currentPlayer: this.instance.data.currentPlayer
        });
    }
}