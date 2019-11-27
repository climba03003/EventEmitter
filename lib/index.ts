declare interface EventStack {
  [key: string]: Array<Listener>;
}

const MODE_ONCE = Symbol.for('[[Once Event Listener]]');
const MODE_ALWAYS = Symbol.for('[[Always Event Listener]]');

class Listener {
  listener: Function;
  mode: symbol;
  executed: boolean;

  constructor(listener: Function, mode: symbol) {
    this.executed = false;
    this.listener = listener;
    this.mode = mode;
  }

  async execute(...args: Array<any>): Promise<any> {
    if (this.mode === MODE_ONCE && this.executed) return true;
    this.executed = true;
    return await this.listener.apply(this.listener, args);
  }
}

export class EventEmitter {
  private events: EventStack = {};
  private defaultMaxListeners = 10;

  addListener(eventName: string | symbol, listener: Function): this {
    if (this.ensureStack(eventName).length + 1 > this.defaultMaxListeners) {
      throw new Error('Maximum Number of Event Listener exceed.');
    }
    this.ensureStack(eventName).push(new Listener(listener, MODE_ALWAYS));
    return this;
  }

  async emit(eventName: string | symbol, ...args: Array<any>): Promise<boolean> {
    const stack = this.ensureStack(eventName);
    for (let i = 0; i < stack.length; i++) {
      const listener = stack[i];
      await listener.execute.call(listener, ...args);
    }
    return true;
  }

  eventNames(): Array<string> {
    return Object.keys(this.events);
  }

  getMaxListeners(): number {
    return this.defaultMaxListeners;
  }

  listenerCount(eventName: string | symbol): number {
    return this.ensureStack(eventName).length;
  }

  listeners(eventName: string | symbol): Array<Listener> {
    return this.ensureStack(eventName);
  }

  off(eventName: string | symbol, listener: Function): this {
    return this.removeListener(eventName, listener);
  }

  on(eventName: string | symbol, listener: Function): this {
    return this.addListener(eventName, listener);
  }

  once(eventName: string | symbol, listener: Function): this {
    this.ensureStack(eventName).push(new Listener(listener, MODE_ONCE));
    return this;
  }

  prependListener(eventName: string | symbol, listener: Function): this {
    this.ensureStack(eventName).unshift(new Listener(listener, MODE_ALWAYS));
    return this;
  }

  prependOnceListener(eventName: string | symbol, listener: Function): this {
    this.ensureStack(eventName).unshift(new Listener(listener, MODE_ONCE));
    return this;
  }

  removeAllListeners(eventName: string | symbol): this {
    delete this.events[eventName as string];
    return this;
  }

  removeListener(eventName: string | symbol, listener: Function): this {
    const stack = this.ensureStack(eventName);
    let index = this.indexOfListener(stack, listener);
    while (index >= 0) {
      index = this.indexOfListener(stack, listener);
      stack.splice(index, 1);
    }
    return this;
  }

  setMaxListeners(n: number): void {
    if (isNaN(n)) throw new Error('MaxListerners must be a number.');
    this.defaultMaxListeners = parseInt(String(n), 10);
  }

  rawListeners(eventName: string | symbol): Array<Function> {
    return this.ensureStack(eventName).map(function(listener) {
      return listener.listener;
    });
  }

  private ensureStack(eventName: string | symbol): Array<Listener> {
    if (!Array.isArray(this.events[eventName as string])) this.events[eventName as string] = [];
    return this.events[eventName as string];
  }

  private indexOfListener(stack: Array<Listener>, listener: Function): number {
    return stack.findIndex(function(stackListener: Listener) {
      return stackListener.listener === listener;
    });
  }
}

export default EventEmitter;
