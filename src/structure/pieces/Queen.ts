import { Chess } from '../classes/Chess';
import { Piece, PiecesValues } from './Piece';
import { notToPos, posToNot } from '../functions/main';
import { Events } from '../classes/EventEmitter';

export class Queen extends Piece {
    constructor(color: string, position: string, instance: Chess) {
        super(color, PiecesValues.Queen, position, instance);
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
        const directions = [
            { dx: 1, dy: 1 }, { dx: -1, dy: -1 }, { dx: -1, dy: 1 }, { dx: 1, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];

        for (const { dx, dy } of directions) {
            for (let step = 1; step <= 7; step++) {
                const newX = x + dx * step, newY = y + dy * step;
                if (!this.isValidPosition(newX, newY)) break;
                const target = this.instance.grid[newY][newX];
                if (typeof target === "number") {
                    moves.push(posToNot(newX, newY));
                } else if (this.isPiece(target) && target.color !== this.color) {
                    moves.push(posToNot(newX, newY));
                    break;
                }
            }
        }

        return !cache ? moves.filter(move => {
            const { x, y } = notToPos(move);
            return this.instance.grid[y][x] === 0;
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
        let event = Events.Move;
        let notation = `Q${posToNot(x, y)}`;

        if (this.instance.makeCheck(this.color)) {
            event |= Events.Check;
            notation += "+";
        }
        if (pieceCaptured) {
            event |= Events.PieceCaptured;
            notation = `Qx${posToNot(x, y)}${notation.includes("+") ? "+": ""}`;
        }

        this.instance.emit(event, {
            from: posToNot(oldX, oldY),
            to: this.position,
            piece: 'Queen',
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