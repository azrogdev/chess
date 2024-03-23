# chess
This repos contain an advanced structure of a chess game.

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
