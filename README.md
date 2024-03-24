# chess

Welcome to my Chess project, a sophisticated and modern rendition of the classic chess game designed for developers and chess enthusiasts. This project offers an in-depth exploration of chess mechanics and coding strategies, making it a perfect resource for those keen on understanding the game's architecture. Structured meticulously to enhance learning and engagement, the Chess Project caters to a broad spectrum of development interests, ensuring a comprehensive and enriching experience for all.

warning: the code and this readme are not finished yet.

## Prerequisites
| Requirement       | Description                                                                                               |
|-------------------|-----------------------------------------------------------------------------------------------------------|
| Node.js           | Version 14.x or higher required for optimal compatibility with the project's ES6, ES2016, and ESNext features. |
| Typescript          | Version 5.3.3 or higher, for optimal compatibility and feature support. |

### Quick Start

1. Install TypeScript via npm: `npm i typescript`
2. Compile the TypeScript code to JavaScript: `npx tsc`
3. Initialize your Chess game:

```js
import { Chess, Events } from 'path/to/chess';

const game = new Chess({ bot: true });
game.on(Events.GameStarted, data => {
    if (data.currentPlayer === 666) {
        // Your code here
    }
});

game.start(); // Begins the game
```

### Utilizing Events
The Chess Project supports **10** events, with **8** having defined utilities. Available events include: `Move`, `IllegalMove`, `PieceSelected`, `PieceCaptured`, `GameStarted`, `GameEnded`, `Check`, `InvalidPosition`.

#### `Move` 

For notation details, see [Chess Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))

```js
game.players.get(123).play("e2", "e4");
game.on(Events.Move, data => {
    // Example output for a move event
    console.log(data.notation); // e.g., "e4"
});
```
#### `PieceSelected`
To select a piece and explore its possible moves, use the following example:
```js
game.players.get(123).select("d2");

game.on(Events.PieceSelected, (data) => {
    const { moves } = data;
    console.log(moves); // Outputs possible moves, e.g., ['d3', 'd4']
});
```

## Combining Events
You can listen to combined events for complex scenarios:
```js
// For a move that results in check
game.on(Events.Move + Events.Check, data => {
    console.log(data.notation); // e.g., "e4+"
});

// For a move that captures a piece and results in check
game.on(Events.Move + Events.Check + Events.PieceCaptured, data => {
    console.log(data.notation); // e.g., "exf6+"
});
```
