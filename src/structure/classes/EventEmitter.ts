const Events = {
  Move: 1 << 0,
  IllegalMove: 1 << 1,
  PieceSelected: 1 << 2,
  PieceCaptured: 1 << 3,
  GameStarted: 1 << 4,
  GameEnded: 1 << 5,
  Check: 1 << 6,
  Play: 1 << 7,
  Select: 1 << 8,
  InvalidPosition: 1 << 9
};


class EventEmitter {
  private events: { [key: number]: ((...args: any[]) => void)[] } = {};

  on(eventName: number, listener: (...args: any[]) => void): void {
    (this.events[eventName] || (this.events[eventName] = [])).push(listener);
  }

  emit(eventName: number, ...args: any[]): void {
    Object.keys(this.events).forEach(key => {
      const eventNumber = parseInt(key, 10);
      if (eventName & eventNumber) {
        this.events[eventNumber]?.forEach(listener => listener(...args));
      }
    });
  }
}



export { EventEmitter, Events };