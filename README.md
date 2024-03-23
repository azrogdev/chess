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

## Starting a game.

```js
import { Chess, Events } from 'path';

const game = new Chess({
    bot: true
})

game.on(Events.GameStarted, (data) => console.log(data))
```
