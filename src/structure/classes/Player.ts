import { Chess } from './Chess';
import { Events } from './EventEmitter';
import { PieceGetterData } from '../interfaces/main';
export class Player {
    private instance: Chess;
    public id: number;
    public color: string | null;
    public score: number;
    constructor(id: number, instance: Chess) {
        this.id = id;
        this.color = null;
        this.score = 0;
        this.instance = instance;
    }
    public play(from: string, to: string): void {
        if (!this.instance.data.started || this.instance.data.ended || this.instance.data.currentPlayer !== this.id) return;
        if (this.isValid([from, to])) {
            this.instance.emit(Events.Play, { from, to });
        } else {
            return this.instance.emit(Events.IllegalMove, {
                from,
                to
            })
        }
    }
    public select(position: string): void {
        if (!this.instance.data.started || this.instance.data.ended || this.instance.data.currentPlayer !== this.id) return;
        if (this.isValid([position])) {
            this.instance.emit(Events.Select, { position });
        } else {
            return this.instance.emit(Events.InvalidPosition, {
                position
            })
        }
    }
    private isValid(args: string[]): boolean {
        const letters = "abcdefgh".split("");
        for (const arg of args) {
            if (typeof arg !== "string") return false;
            if (arg.length !== 2) return false;
            const letter = arg.charAt(0);
            const number = parseInt(arg.charAt(1), 10);
    
            if (!letters.includes(letter) || isNaN(number) || number < 1 || number > 8) {
                return false;
            }
        }
        return true;
    }
}