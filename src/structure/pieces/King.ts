import { Chess } from '../classes/Chess';
import { Piece, PiecesValues } from './Piece';
import { notToPos, posToNot } from '../functions/main';
import { Events } from '../classes/EventEmitter';
import { Rook } from './Rook';

export class King extends Piece {
    public canRook: boolean;
    constructor(color: string, position: string, instance: Chess) {
        super(color, PiecesValues.King, position, instance);
        this.canRook = true;
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
            const newX = x + dx, newY = y + dy;
            if (!this.isValidPosition(newX, newY)) continue;
            const target = this.instance.grid[newY][newX];
            if (typeof target === "number") {
                moves.push(posToNot(newX, newY));
            } else if (this.isPiece(target) && target.color !== this.color) {
                moves.push(posToNot(newX, newY));
            }
        }
        if (this.canMoveToRook(true)) moves.push(posToNot(x - 2, y))
        if (this.canMoveToRook(false)) moves.push(posToNot(x + 2, y))
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
    private canMoveToRook(long: boolean): boolean {
        const tabPos = this.color === 'white' ? [{ x: 7, y: 7 }, { x: 0, y: 7 }] : [{ x: 7, y: 0 }, { x: 0, y: 0 }];
        const pos = long ? tabPos[1] : tabPos[0];
        const dir = long ? -1 : 1;
        const { x, y } = notToPos(this.position);
        var pathIsClear = true;
        for (let i = 1; i < (long ? 4 : 3); i++) {
            const target = this.instance.grid[y][x + (dir * i)];
            if (target !== 0 && !(target instanceof Rook && target.canRook)) {
                pathIsClear = false;
                break;
            }
        }
        return pathIsClear;
    }
    public moveTo(x: number, y: number): void {
        if (!this.isValidPosition(x, y)) throw new Error('Invalid position.');
        const { x: oldX, y: oldY } = notToPos(this.position);
        const target = this.instance.grid[y][x]
        const tabPos = this.color === 'white' ? [{ x: 7, y: 7 }, { x: 0, y: 7 }] : [{ x: 7, y: 0 }, { x: 0, y: 0 }];
        const diff =  Math.abs(oldX - x);
        const dir = oldX > x ? -1 : 1
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
        if (Math.abs(oldX - x) === 2) {
            const isLongCastle = (oldX > x);
            const rookStartX = isLongCastle ? 0 : 7;
            const rookEndX = isLongCastle ? 3 : 5;
            const supp = isLongCastle ? 1 : 0
            const rook = this.instance.grid[y][rookStartX] as Rook;
            this.instance.grid[y][rookStartX] = 0;
            this.instance.grid[y][rookEndX] = rook;
    
            if (rook) rook.position = posToNot(rookEndX, y);
    
            rook.canRook = false;
            this.canRook = false;
        }
        let event = Events.Move;
        let notation = `K${posToNot(x, y)}`;

        if (this.instance.makeCheck(this.color)) {
            event |= Events.Check;
            notation += "+";
        }
        if (pieceCaptured) {
            event |= Events.PieceCaptured;
            notation = `Kx${posToNot(x, y)}${notation.includes("+") ? "+" : ""}`;
        }

        this.instance.emit(event, {
            from: posToNot(oldX, oldY),
            to: this.position,
            piece: 'King',
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