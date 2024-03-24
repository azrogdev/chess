import { EventEmitter, Events } from './EventEmitter';
import { PieceData, PieceGetter, PieceGetterData, GameOptions, GameData, PlayerGetter, PieceMove, Notation, PieceSymbol, ScoredMove } from '../interfaces/main';
import { notToPos, posToNot } from '../functions/main';
import { King, Queen, Rook, Bishop, Knight, Pawn } from '../pieces/main';
import { Piece, PiecesValues } from '../pieces/Piece';
import { Player } from './Player';
import { KingScore, QueenScore, RookScore, KnightScore, BishopScore, PawnScore } from '../scorebase/score';
export class Chess extends EventEmitter implements GameOptions {
    public grid: (PieceData | Piece | number)[][];
    public data: GameData;
    public bot: boolean;
    private capture: {state: boolean, value: number };
    private score: number;
    constructor(options: GameOptions = {}) {
        super();
        if (options.bot && typeof options.bot !== "boolean") throw new Error("Invalid option 'bot'.");
        this.bot = options.bot ?? false;
        this.data = { players: [], winner: null, currentPlayer: null, started: false, ended: false };
        this.grid = this.init(), this.score = 0, this.capture = { state: false, value: 0 };
    }
    private init(): number[][] {
        const structure: number[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0));
        return structure;
    }
    private setupPieces(): void {
        const piecesConfig = [
            { Class: Pawn, positions: [0, 1, 2, 3, 4, 5, 6, 7] },
            { Class: Rook, positions: [0, 7] },
            { Class: Knight, positions: [1, 6] },
            { Class: Bishop, positions: [2, 5] },
            { Class: Queen, positions: [3] },
            { Class: King, positions: [4] },

        ];
        piecesConfig.forEach(({ Class, positions }) => {
            positions.forEach(position => {
                if (Class === Pawn) {
                    this.grid[1][position] = new Class("black", posToNot(position, 0), this);
                    this.grid[6][position] = new Class("white", posToNot(position, 7), this);
                } else {
                    this.grid[0][position] = new Class("black", posToNot(position, 0), this);
                    this.grid[7][position] = new Class("white", posToNot(position, 7), this);
                }
            });
        });
    }
    public get players(): PlayerGetter {
        return {
            get: (id: number): Player => {
                const player = this.data.players.find(p => p.id === id);
                if (!player) throw new Error("Invalid player id.");
                return player as Player;
            },
            add: (id: number): void => {
                if (isNaN(id) || this.bot || this.data.players.length === 2 || this.data.players.find(p => p.id === id)) return;
                const player = new Player(id, this);
                this.data.players.push(player);
            }

        }
    }
    public start() {
        if (this.bot === false && this.data.players.every(element => element instanceof Player) && this.data.players.length === 2) return;
        if (this.bot) {
            const human = new Player(666, this);
            const bot = new Player(42, this);
            this.data.players.push(human, bot);
        }
        const randomNumber = Math.floor(Math.random() * 2);
        const firstColor = randomNumber === 0 ? "white" : "black";
        const secondColor = firstColor === "white" ? "black" : "white";
        this.data.players[0].color = firstColor;
        this.data.players[1].color = secondColor;
        const firstPlayer = this.data.players.find(p => p.color === "white")?.id
        if (!firstPlayer) return;
        this.data.currentPlayer = firstPlayer;
        this.data.started = true;
        this.emit(Events.GameStarted, {
            grid: this.grid,
            stringGrid: this.stringGrid,
            flatGrid: this.flatGrid,
            stringFlatGrid: this.stringFlatGrid,
            data: this.data
        })
        if (firstPlayer === 42) {
            this.botMove();
        }
        this.on(Events.Move, (data) => this.changeGameState(data));
        this.on(Events.Move + Events.Check, (data) => this.changeGameState(data));
        this.on(Events.Move + Events.PieceCaptured, (data) => this.changeGameState(data));
        this.on(Events.Move + Events.Check + Events.PieceCaptured, (data) => this.changeGameState(data));
        this.on(Events.Play, (data) => {
            const { from, to } = data;
            const piece = this.piece.get(from as string);
            if (!piece) {
                return this.emit(Events.IllegalMove, {
                    from,
                    to
                });
            }
            const p = piece as PieceGetterData;
            p.move(to);
        })
        this.on(Events.Select, (data) => {
            const { position } = data;
            const piece = this.piece.get(position as string);
            if (!piece) {
                return this.emit(Events.InvalidPosition, {
                    position
                })
            }
            const p = piece as PieceGetterData;
            p.select();
        })
    }
    private changeGameState(data: any): void {
        const { x, y } = notToPos(data.to);
        const piece = this.grid[y][x];
        if (data.piece === 'Pawn' && Math.abs(parseInt(data.from.charAt(1), 10) - parseInt(data.to.charAt(1), 10)) === 2) {
            if (piece instanceof Pawn) {
                piece.canEnPassant = true;
            }
        } else if (['King', 'Rook'].includes(data.piece)) {
            if (piece instanceof Rook || piece instanceof King) {
                piece.canRook = false;
            }
        }
        this.grid.forEach((row) => row.forEach((p) => {
            if (p instanceof Pawn && p.color === data.color) {
                p.canEnPassant = false;
            }
            if ((p instanceof Rook || p instanceof King) && data.color === p.color) {
                p.canRook = false;
            }
        }));
        this.nextPlayer();
    }
    private botMove(): void {
        if (!this.bot || !this.data.started || this.data.ended) return;
        this.capture = { state: false, value: 0 };
        const bot = this.data.players.find(p => p.id === 42);
        if (!bot) return;
        const botColor = bot.color ?? "black";
        const grid = this.deepGridCopy();
        const allMoves = this.getAllMoves(botColor);
        const bestMoves: Array<ScoredMove> = [];
        for (const e of allMoves) {
            const piece = e.piece;
            const moves = e.moves;
            const bestPieceMoves: Array<ScoredMove> = [];
            for (const move of moves) {
                this.makeMove(grid, notToPos(move), piece)
                this.undoMove(grid, notToPos(move), notToPos(piece.position), piece);
                bestPieceMoves.push({ move: move, piece: piece, score: this.score });
            }
            const bestMove = this.sortMoves(bestPieceMoves);
            bestMoves.push(bestMove);
        }
        const finalMove = this.sortMoves(bestMoves);
        const { move, piece } = finalMove;
        this.makeMove(grid, notToPos(move), piece);
        if (this.isCheck(piece.color)) {
            this.data.ended = true;
            this.data.winner = this.data.players.find(p => p.id === 666) ?? new Player(666, this);
            return this.emit(Events.GameEnded, {
                grid: this.grid,
                stringGrid: this.stringGrid,
                flatGrid: this.flatGrid,
                stringFlatGrid: this.stringFlatGrid,
                data: this.data
            })
        } else {
            let event = Events.Move;
            let notation = `${this.getPieceSymbol(piece).charAt(0)}${move}`;

            if (this.makeCheck(piece.color)) {
                event |= Events.Check;
                notation += "+";
            }
            if (this.capture.state) {
                event |= Events.PieceCaptured;
                notation = `${this.getPieceSymbol(piece).charAt(0)}x${move}${notation.includes("+") ? "+" : ""}`;
            }
            const oldPos = piece.position;
            this.makeMove(this.grid, notToPos(move), piece);
            this.emit(event, {
                from: oldPos,
                to: piece.position,
                piece: piece.constructor.name,
                notation: notation,
                value: this.capture.value,
                grid: this.grid,
                stringGrid: this.stringGrid,
                flatGrid: this.flatGrid,
                stringFlatGrid: this.stringFlatGrid,
                currentPlayer: this.data.currentPlayer
            })
        }
    }
    private makeMove(grid: (PieceData | Piece | number)[][], move: Notation, piece: PieceData): void {
        this.score = 0;
        const { x, y } = move;
        const cell = grid[y][x];
        const { x: oldX, y: oldY } = notToPos(piece.position);
        grid[oldY][oldX] = 0;
        if (typeof cell !== 'number') {
            const value = cell.value;
            const diff = Math.abs(piece.value - value);
            if (diff > 4 && value < piece.value) {
                this.score -= piece.value;
            }
            this.score += value;
        }
        grid[y][x] = piece;
        piece.position = posToNot(x, y);
        this.score += this.eval(grid, piece.color, true)
        if (this.makeCheck(piece.color)) {
            this.score += (30 - (piece.value));
        }
        if (this.isCheck(piece.color)) {
            this.score = (0 - piece.value);
        }
    }
    private undoMove(grid: (PieceData | Piece | number)[][], move: Notation, oldPosition: Notation, piece: PieceData): void {
        const { x: oldX, y: oldY } = oldPosition;
        const { x, y } = move;
        grid[oldY][oldX] = piece;
        grid[y][x] = this.grid[y][x];
    }
    private getAllMoves(color: string): Array<PieceMove> {
        let arr: Array<PieceMove> = [];
        this.flatGrid.filter(p => typeof p !== 'number' && p.color === color).forEach((piece) => {
            if (typeof piece === 'number') return;
            arr.push({ piece, moves: piece.getAvailableMoves(true) });
        })
        return arr;
    }
    private sortMoves(moves: Array<ScoredMove>): ScoredMove {
        return moves.sort((a, b) => b.score - a.score)[0]
    }
    private eval(grid: (PieceData | Piece | number)[][], color: string, top: boolean = false): number {
        let score = 0;
        type PieceValues = {
            [key in PieceSymbol]: number;
        };
        const pieceValues: PieceValues = {
            "K": PiecesValues.King,
            "Q": PiecesValues.Queen,
            "R": PiecesValues.Rook,
            "C": PiecesValues.Knight,
            "B": PiecesValues.Bishop,
            "P": PiecesValues.Pawn
        };
        type PieceScoreMatrices = {
            [key in PieceSymbol]: number[][]
        }
        const pieceScoreMatrices: PieceScoreMatrices = {
            "K": KingScore,
            "Q": QueenScore,
            "R": RookScore,
            "C": KnightScore,
            "B": BishopScore,
            "P": PawnScore
        };

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const element = grid[i][j];
                if (typeof element === 'number' || element.color !== color) continue;
                const piece = element as Piece;
                const symbol = this.getPieceSymbol(piece);
                const value = pieceValues[symbol];
                const scoreMatrix = pieceScoreMatrices[symbol];

                let positionalScore = top ? scoreMatrix[7 - i][7 - j] : scoreMatrix[i][j];
                score += value + positionalScore;
            }
        }
        return score;
    }
    private nextPlayer(): void {
        const currentPlayerId = this.data.currentPlayer;
        const player = this.data.players.find(player => player.id !== currentPlayerId);
        if (!player) throw new Error('Something wrong while searching the next player');
        this.data.currentPlayer = player.id;
        if (player.id === 42) this.botMove()
    }
    private deepGridCopy(): (PieceData | Piece | number)[][] {
        const structure: (PieceData | Piece | number)[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0));
        structure.forEach((row, i) => {
            row.forEach((col, j) => {
                structure[i][j] = this.grid[i][j];
            })
        })
        return structure
    }
    private flattenGrid(grid: any[]): (PieceData | number)[] {
        let array: (PieceData | number)[] = [];
        grid.forEach((element) => {
            if (Array.isArray(element)) {
                array = [...array, ...this.flattenGrid(element)];
            } else array.push(element);
        })
        return array;
    }
    public get flatGrid(): (PieceData | number)[] {
        return this.flattenGrid(this.grid)
    }
    private get piece(): PieceGetter {
        return {
            get: (position: string): PieceGetterData | undefined => {
                const { x, y } = notToPos(position);
                const piece = this.grid[y][x];
                if (piece === 0 || typeof piece === "number") return undefined;

                return {
                    move: (destination: string) => {
                        const p = piece as PieceData;
                        const { x: newX, y: newY } = notToPos(destination);
                        if (p.canMoveTo(newX, newY)) {
                            p.moveTo(newX, newY)
                        } else this.emit(Events.IllegalMove, { from: position, to: destination });
                        return;
                    },
                    select: () => {
                        const p = piece as PieceData;
                        this.emit(Events.PieceSelected, {
                            moves: p.getAvailableMoves(false)
                        })
                        return;
                    }
                };
            }
        };
    }

    public makeCheck(currentColor: string): boolean {
        const otherColor = currentColor === "white" ? "black" : "white";
        const KingCell = this.flatGrid.filter(cell => typeof cell !== "number" && cell.color === otherColor && (cell instanceof King))[0] as PieceData;
        let moves: string[] = [];
        this.flatGrid.filter(cell => typeof cell !== "number" && cell.color === currentColor).forEach((p) => {
            const piece = p as PieceData;
            moves = [...moves, ...piece.getAvailableMoves(true)];
        })
        return moves.includes(KingCell.position);
    }
    public isCheck(currentColor: string): boolean {
        const otherColor = currentColor === "white" ? "black" : "white";
        const KingCell = this.flatGrid.filter(cell => typeof cell !== "number" && cell.color === currentColor && (cell instanceof King))[0] as PieceData;
        let moves: string[] = [];
        this.flatGrid.filter(cell => typeof cell !== "number" && cell.color === otherColor).forEach((p) => {
            const piece = p as PieceData;
            moves = [...moves, ...piece.getAvailableMoves(true)];
        })
        return moves.includes(KingCell.position);
    }
    private getPieceSymbol(piece: any): string {
        const symbols = {
            King: 'K',
            Queen: 'Q',
            Bishop: 'B',
            Rook: 'R',
            Knight: 'C',
            Pawn: 'P',
        };
        const symbol = symbols[piece.constructor.name];
        if (symbol) {
            return `${symbol}${piece.color.charAt(0).toUpperCase()}`;
        } else throw new Error('Something wrong with the piece symbol.')
    }
    public get stringFlatGrid(): string[] {
        return this.flatGrid.map(element => {
            if (typeof element === "number") return '';
            return this.getPieceSymbol(element);
        });
    }
    public get stringGrid(): string[][] {
        const flatGrid: string[] = this.stringFlatGrid;
        const grid: string[][] = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ''));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                grid[i][j] = flatGrid[i * 8 + j];
            }
        }
        return grid;
    }
}



const game = new Chess({
    bot: true
})





