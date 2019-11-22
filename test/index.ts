import { describe, it } from 'mocha';
import * as should from 'should';
import * as crypto from 'crypto';
import EventEmitter from '../lib';

function tick() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 500);
  });
}

describe('EventEmitter', function() {
  describe('constructor', function() {
    const Emitter: any = new EventEmitter();
    it('defaultMaxListeners is 10', function() {
      should(Emitter.defaultMaxListeners)
        .be.a.Number()
        .and.equal(10);
    });

    it('events is {}', function() {
      should(Emitter.events).be.a.Object();
      should(String(Emitter.events)).equal(String({}));
    });
  });

  describe('addListener', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    it('return EventEmitter', function() {
      const Emitter = new EventEmitter();
      should(Emitter.on(eventName, tick)).be.equal(Emitter);
    });

    it(`eventNames contain ${eventName}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.eventNames()).be.containEql(eventName);
    });

    it(`event stack should contain ${Object.prototype.toString.call(tick)}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.rawListeners(eventName))
        .be.an.Array()
        .and.length(1)
        .and.containEql(tick);
    });
  });

  describe('emit', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    const before = async function(order: Array<string>) {
      order.push('before');
    };
    const after = async function(order: Array<string>) {
      order.push('after');
    };
    const order: any[] = [];

    this.beforeAll(async function() {
      Emitter.on(eventName, after);
      Emitter.prependListener(eventName, before);

      await Emitter.emit(eventName, order);
      await Emitter.emit(eventName, order);
    });

    it('stack length is 2', async function() {
      should(Emitter.listenerCount(eventName))
        .be.Number()
        .and.equal(2);
    });

    it('in correct order', function() {
      should(order)
        .be.Array()
        .and.containDeepOrdered(['before', 'after', 'before', 'after']);
    });
  });

  describe('eventNames', function() {
    const Emitter = new EventEmitter();
    const randomName = function() {
      return crypto.randomBytes(4).toString('hex');
    };
    const eventNames = [];
    eventNames.push(randomName());
    eventNames.push(randomName());
    eventNames.forEach(function(eventName) {
      Emitter.on(eventName, tick);
    });
    it('length is 2', function() {
      should(Emitter.eventNames())
        .be.Array()
        .length(2);
    });
  });

  describe('getMaxListeners', function() {
    it('equal to 10', function() {
      const Emitter = new EventEmitter();
      should(Emitter.getMaxListeners())
        .be.Number()
        .and.equal(10);
    });
  });

  describe('listenerCount', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    const random = Math.floor(Math.random() * 10 + 1);
    it('empty as default', function() {
      const Emitter = new EventEmitter();
      should(Emitter.listenerCount(eventName))
        .be.Number()
        .and.equal(0);
    });

    it(`event stack should increase to ${random}`, function() {
      const Emitter = new EventEmitter();
      let count = 1;
      while (count <= random) {
        Emitter.on(eventName, tick);
        count++;
      }
      should(Emitter.listenerCount(eventName))
        .be.Number()
        .and.equal(random);
    });
  });

  describe('listeners', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    const random = Math.floor(Math.random() * 10 + 1);
    it('empty as default', function() {
      const Emitter = new EventEmitter();
      should(Emitter.listeners(eventName))
        .be.an.Array()
        .and.length(0);
    });

    it(`event stack should increase to ${random}`, function() {
      const Emitter = new EventEmitter();
      let count = 1;
      while (count <= random) {
        Emitter.on(eventName, tick);
        count++;
      }
      should(Emitter.listeners(eventName))
        .be.an.Array()
        .and.length(random);
    });
  });

  describe('off', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    it('event stack not contain anything', function() {
      Emitter.on(eventName, tick);
      Emitter.removeListener(eventName, tick);
      should(Emitter.listeners(eventName))
        .is.Array()
        .and.length(0);
    });
  });

  describe('on', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    it('return EventEmitter', function() {
      const Emitter = new EventEmitter();
      should(Emitter.on(eventName, tick)).be.equal(Emitter);
    });

    it(`eventNames contain ${eventName}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.eventNames()).be.containEql(eventName);
    });

    it(`event stack should contain ${Object.prototype.toString.call(tick)}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.rawListeners(eventName))
        .be.an.Array()
        .and.length(1)
        .and.containEql(tick);
    });
  });

  describe('once', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    it('return EventEmitter', function() {
      const Emitter = new EventEmitter();
      should(Emitter.on(eventName, tick)).be.equal(Emitter);
    });

    it(`eventNames contain ${eventName}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.eventNames()).be.containEql(eventName);
    });

    it(`event stack should contain ${Object.prototype.toString.call(tick)}`, function() {
      const Emitter = new EventEmitter();
      Emitter.on(eventName, tick);
      should(Emitter.rawListeners(eventName))
        .be.an.Array()
        .and.length(1)
        .and.containEql(tick);
    });
  });

  describe('prependListener', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    const before = async function(order: Array<string>) {
      order.push('before');
    };
    const after = async function(order: Array<string>) {
      order.push('after');
    };
    const order: any[] = [];

    this.beforeAll(async function() {
      Emitter.on(eventName, after);
      Emitter.prependListener(eventName, before);

      await Emitter.emit(eventName, order);
      await Emitter.emit(eventName, order);
    });

    it('stack length is 2', async function() {
      should(Emitter.listenerCount(eventName))
        .be.Number()
        .and.equal(2);
    });

    it('in correct order', function() {
      should(order)
        .be.Array()
        .and.containDeepOrdered(['before', 'after', 'before', 'after']);
    });
  });

  describe('prependOnceListener', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    const before = async function(order: Array<string>) {
      order.push('before');
    };
    const after = async function(order: Array<string>) {
      order.push('after');
    };
    const order: any[] = [];

    this.beforeAll(async function() {
      Emitter.on(eventName, after);
      Emitter.prependOnceListener(eventName, before);

      await Emitter.emit(eventName, order);
      await Emitter.emit(eventName, order);
    });

    it('stack length is 2', async function() {
      should(Emitter.listenerCount(eventName))
        .be.Number()
        .and.equal(2);
    });

    it('in correct order', function() {
      should(order)
        .be.Array()
        .and.containDeepOrdered(['before', 'after', 'after']);
    });
  });

  describe('removeAllListeners', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    it('event stack not contain anything', function() {
      Emitter.on(eventName, tick);
      Emitter.removeAllListeners(eventName);
      should(Emitter.listeners(eventName))
        .is.Array()
        .and.length(0);
    });
  });

  describe('removeListener', function() {
    const Emitter = new EventEmitter();
    const eventName = crypto.randomBytes(4).toString('hex');
    it('event stack not contain anything', function() {
      Emitter.on(eventName, tick);
      Emitter.removeListener(eventName, tick);
      should(Emitter.listeners(eventName))
        .is.Array()
        .and.length(0);
    });
  });

  describe('setMaxListeners', function() {
    const random = Math.floor(Math.random() * 20 + 1);
    it(`set to ${random}`, function() {
      const Emitter = new EventEmitter();
      Emitter.setMaxListeners(random);
      should(Emitter.getMaxListeners())
        .be.a.Number()
        .and.equal(random);
    });

    it('throw error when n isNaN', function() {
      const Emitter = new EventEmitter();
      should(function() {
        Emitter.setMaxListeners(crypto.randomBytes(4) as any);
      }).throw('MaxListerners must be a number.');
    });
  });

  describe('rawListeners', function() {
    const eventName = crypto.randomBytes(4).toString('hex');
    const random = Math.floor(Math.random() * 10 + 1);
    it('empty as default', function() {
      const Emitter = new EventEmitter();
      should(Emitter.rawListeners(eventName))
        .be.an.Array()
        .and.length(0);
    });

    it(`event stack should increase to ${random}`, function() {
      const Emitter = new EventEmitter();
      let count = 1;
      while (count <= random) {
        Emitter.on(eventName, tick);
        count++;
      }
      should(Emitter.rawListeners(eventName))
        .be.an.Array()
        .and.length(random);
    });
  });
});
