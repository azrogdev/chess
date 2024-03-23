import { Player } from '../classes/Player';

interface Notation {
    x: number,
    y: number
}

interface PieceData {
    canMoveTo(x: number, y: number): boolean;
    moveTo(x: number, y: number): void;
    getAvailableMoves(cache: boolean): string[];
    select(): string[];
    color: string;
    position: string;
    value: number;
}
interface PieceGetterData {
    move(position: string): void;
    select(): void;
}
interface PieceGetter {
    get(notation: string): PieceData | undefined | PieceGetterData;
}


interface PlayerGetter {
    get(id: number): Player;
    add(id: number): void;
}
interface PieceMove {
    piece: PieceData;
    moves: string[];
}
interface GameData {
    started: boolean;
    ended: boolean;
    players: Array<Player>;
    winner: Player | null;
    currentPlayer: Player["id"] | null;
}

interface GameOptions {
    bot?: boolean;
}
interface ScoredMove  {
    score: number;
    move: string;
    piece: PieceData;
}

type PieceSymbol = "K" | "Q" | "R" | "C" | "B" | "P";

export { Notation, PieceData, PieceGetter, PieceGetterData, GameOptions, GameData, PlayerGetter, PieceMove, PieceSymbol, ScoredMove };