export const posToNot = (x: number, y: number): string => {
    const letters = "abdcefgh".split("");
    return `${letters[x]}${8-y}`
}