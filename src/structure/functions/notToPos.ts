import { Notation } from '../interfaces/main';

export const notToPos = (notation: string): Notation  => {
    if (!notation || typeof notation !== "string" || notation.length !== 2) throw new Error("Invalid notation.");
    const nots = notation.split("");
    const letters = "abcdefgh".split("");
    if (!letters.includes(nots[0])) throw new Error("Invalid notation.");
    return { x: letters.indexOf(nots[0]), y: 8 - parseInt(nots[1], 10) };
}