# chess
This repos contain an advanced structure of a chess game.

warning: the code and this readme are not finished yet.

## Prerequisites
| Requirement       | Description                                                                                               |
|-------------------|-----------------------------------------------------------------------------------------------------------|
| Node.js           | Version 14.x or higher required for optimal compatibility with the project's ES6, ES2016, and ESNext features. |
| Typescript          | Version 5.3.3 or higher required for optimal compatibility with the project |
### How to start ?

Before starting make sure to complete the prerequisites. If you don't know how to install typescript, open your project and use `npm i typescript`,
then use `npx tsc` to compile the code in javascript.

```js
import { Chess, Events } from 'path';

const game = new Chess({
    bot: true
})
game.on(Events.GameStarted, (data) => {
    if (data.data.currentPlayer === 666) {
        // code to execute if the firstplayer is you.
    }
});

game.start(); // the game start
```

### How to use Events ?
You can use **10** events but only **8** have an utility.
Here is the list of the availables events :`Move`, `IllegalMove`, `PieceSelected`, `PieceCaptured`, `GameStarted`, `GameEnded`, `Check`, `InvalidPosition`.

#### `Move` 

For more information about the notation : [Chess Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))

```js
game.players.get(010102201010).play("a1", "a3");

game.on(Events.Move, (data) => {
    const { from, to, piece, notation, value, grid, stringGrid, stringFlatGrid, currentPlayer } = data;
    
    console.log(from) // Output: 'a1'.
    console.log(to) // Output: 'a3'.
    console.log(piece) // Output: 'Pawn'.
    console.log(notation) // Output: 'a3'.

    console.log(stringFlatGrid) // Output: ['RB', 'CB', 'BB', 'QB', 'KB', 'BB', 'CB', 'RB', 'PB', 'PB' ... 'RW'] (optimal grid to create your board)
})
```
#### `PieceSelected`

```js
game.players.get(010102201010).select("a1");

game.on(Events.PieceSelected, (data) => {
    const { moves } = data;
    console.log(moves) // Output: ['a2', 'a3']
})
```

But you can also combined events :

```js
game.on(Events.Move+Events.Check, (data) => {
    const { notation } = data;

    console.log(notation) // Output: Bf6+
})
```
or
```js
game.on(Events.Move+Events.Check+Events.PieceCaptured, (data) => {
    const { notation } = data;

    console.log(notation) // Output: Bxf6+
})
```
