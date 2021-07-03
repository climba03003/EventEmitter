import * as crypto from 'crypto'
import { EventEmitter, Listener } from '../lib'

async function tick (): Promise<void> {
  return await new Promise(function (resolve) {
    process.nextTick(function () {
      resolve()
    })
  })
}

describe('EventEmitter', function () {
  beforeEach(function () {
    // reset EventEmitter constant
    EventEmitter.defaultMaxListeners = 10
  })

  afterEach(function () {
    process.removeAllListeners('warning')
  })

  describe('constant', function () {
    test('defaultMaxListeners is 10', function () {
      expect(EventEmitter.defaultMaxListeners).toStrictEqual(10)
    })

    test('defaultMaxListeners = 11', function () {
      EventEmitter.defaultMaxListeners = 11
      expect(EventEmitter.defaultMaxListeners).toStrictEqual(11)
    })

    test('defaultMaxListeners = -1', function () {
      expect(() => { EventEmitter.defaultMaxListeners = -1 }).toThrowError()
    })

    test('defaultMaxListeners = null', function () {
      expect(() => { EventEmitter.defaultMaxListeners = 'null' as any }).toThrowError()
    })
  })

  describe('constructor', function () {
    test('maxListeners', function () {
      const ee = new EventEmitter()
      expect(ee.getMaxListeners()).toStrictEqual(10)
    })

    test('maxListeners = 11', function () {
      EventEmitter.defaultMaxListeners = 11
      const ee = new EventEmitter()
      expect(ee.getMaxListeners()).toStrictEqual(11)
    })
  })

  describe('addListener', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    test('chainable', function () {
      const ee = new EventEmitter()
      expect(ee.addListener(eventName, tick)).toBeInstanceOf(EventEmitter)
    })

    test(`eventNames include ${eventName}`, function () {
      const ee = new EventEmitter()
      ee.addListener(eventName, tick)
      expect(ee.eventNames()).toContainEqual(eventName)
    })

    test(`rawListeners include ${Object.prototype.toString.call(tick)}`, function () {
      const ee = new EventEmitter()
      ee.addListener(eventName, tick)
      expect(ee.rawListeners(eventName)).toContainEqual(tick)
    })

    test('emit Warning', function () {
      const ee = new EventEmitter()
      ee.setMaxListeners(1)
      process.on('warning', function (warning) {
        expect(warning.name).toStrictEqual('MaxListenersExceededWarning')
      })
      ee.addListener(eventName, tick)
      ee.addListener(eventName, tick)
    })
  })

  describe('emit', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const ee = new EventEmitter()
    const order: string[] = []
    async function before (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('before')
          resolve()
        })
      })
    };
    async function after (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('after')
          resolve()
        })
      })
    };

    ee.addListener(eventName, before)
    ee.addListener(eventName, after)

    test('stack length = 2', function () {
      expect(ee.listenerCount(eventName)).toStrictEqual(2)
    })

    test('emit order', async function () {
      await ee.emit(eventName, order)
      expect(order).toHaveLength(2)
      expect(order[0]).toStrictEqual('before')
      expect(order[1]).toStrictEqual('after')
    })
  })

  describe('eventNames', function () {
    const ee = new EventEmitter()
    const events = [
      crypto.randomBytes(4).toString('hex'),
      crypto.randomBytes(4).toString('hex')
    ]
    ee.addListener(events[0], tick)
    ee.addListener(events[1], tick)

    test('stack length = 2', function () {
      expect(ee.eventNames()).toHaveLength(2)
    })

    test(`eventNames = [${events[0]},${events[1]}]`, function () {
      const names = ee.eventNames()
      expect(names[0]).toStrictEqual(events[0])
      expect(names[1]).toStrictEqual(events[1])
    })
  })

  describe('getMaxListeners', function () {
    const ee = new EventEmitter()
    test('= 10', function () {
      expect(ee.getMaxListeners()).toStrictEqual(10)
    })
  })

  describe('listenerCount', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const random = Math.floor(Math.random() * 10 + 1)
    const ee = new EventEmitter()

    test('empty at default', function () {
      expect(ee.listenerCount(eventName)).toStrictEqual(0)
    })

    test(`event stack should increase to ${random}`, function () {
      let count = 1
      while (count <= random) {
        ee.on(eventName, tick)
        count++
      }
      expect(ee.listenerCount(eventName)).toStrictEqual(random)
    })
  })

  describe('listeners', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const random = Math.floor(Math.random() * 10 + 1)
    const ee = new EventEmitter()

    test('empty at default', function () {
      expect(ee.listeners(eventName)).toHaveLength(0)
    })

    test(`event stack should increase to ${random}`, function () {
      let count = 1
      while (count <= random) {
        ee.on(eventName, tick)
        count++
      }
      expect(ee.listeners(eventName)).toHaveLength(random)
      ee.listeners(eventName).forEach(function (l) {
        expect(l).toBeInstanceOf(Listener)
      })
    })
  })

  describe('off', function () {
    const ee = new EventEmitter()
    const eventName = crypto.randomBytes(4).toString('hex')

    test('remove one listener at a time', function () {
      ee.addListener(eventName, tick)
      ee.addListener(eventName, tick)
      ee.off(eventName, tick)

      expect(ee.listenerCount(eventName)).toStrictEqual(1)
    })

    test('remove more than stack', function () {
      ee.off(eventName, tick)
      ee.off(eventName, tick)

      expect(ee.listenerCount(eventName)).toStrictEqual(0)
    })
  })

  describe('on', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    test('chainable', function () {
      const ee = new EventEmitter()
      expect(ee.on(eventName, tick)).toBeInstanceOf(EventEmitter)
    })

    test(`eventNames include ${eventName}`, function () {
      const ee = new EventEmitter()
      ee.on(eventName, tick)
      expect(ee.eventNames()).toContainEqual(eventName)
    })

    test(`rawListeners include ${Object.prototype.toString.call(tick)}`, function () {
      const ee = new EventEmitter()
      ee.on(eventName, tick)
      expect(ee.rawListeners(eventName)).toContainEqual(tick)
    })

    test('emit Warning', function () {
      const ee = new EventEmitter()
      ee.setMaxListeners(1)
      process.on('warning', function (warning) {
        expect(warning.name).toStrictEqual('MaxListenersExceededWarning')
      })
      ee.on(eventName, tick)
      ee.on(eventName, tick)
    })
  })

  describe('once', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    test('chainable', function () {
      const ee = new EventEmitter()
      expect(ee.once(eventName, tick)).toBeInstanceOf(EventEmitter)
    })

    test(`eventNames include ${eventName}`, function () {
      const ee = new EventEmitter()
      ee.once(eventName, tick)
      expect(ee.eventNames()).toContainEqual(eventName)
    })

    test(`rawListeners include ${Object.prototype.toString.call(tick)}`, function () {
      const ee = new EventEmitter()
      ee.once(eventName, tick)
      expect(ee.rawListeners(eventName)).toContainEqual(tick)
    })

    test('emit Warning', function () {
      const ee = new EventEmitter()
      ee.setMaxListeners(1)
      process.on('warning', function (warning) {
        expect(warning.name).toStrictEqual('MaxListenersExceededWarning')
      })
      ee.once(eventName, tick)
      ee.once(eventName, tick)
    })
  })

  describe('prependListener', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const ee = new EventEmitter()
    const order: string[] = []
    async function before (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('before')
          resolve()
        })
      })
    };
    async function after (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('after')
          resolve()
        })
      })
    };

    ee.addListener(eventName, after)
    ee.prependListener(eventName, before)

    test('stack length = 2', function () {
      expect(ee.listenerCount(eventName)).toStrictEqual(2)
    })

    test('emit order', async function () {
      await ee.emit(eventName, order)
      await ee.emit(eventName, order)
      expect(order).toHaveLength(4)
      expect(order[0]).toStrictEqual('before')
      expect(order[1]).toStrictEqual('after')
      expect(order[2]).toStrictEqual('before')
      expect(order[3]).toStrictEqual('after')
    })
  })

  describe('prependOnceListener', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const ee = new EventEmitter()
    const order: string[] = []
    async function before (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('before')
          resolve()
        })
      })
    };
    async function after (order: string[]): Promise<void> {
      return await new Promise(function (resolve) {
        process.nextTick(function () {
          order.push('after')
          resolve()
        })
      })
    };

    ee.addListener(eventName, after)
    ee.prependOnceListener(eventName, before)

    test('stack length = 2', function () {
      expect(ee.listenerCount(eventName)).toStrictEqual(2)
    })

    test('emit order', async function () {
      await ee.emit(eventName, order)
      await ee.emit(eventName, order)
      expect(order).toHaveLength(3)
      expect(order[0]).toStrictEqual('before')
      expect(order[1]).toStrictEqual('after')
      expect(order[2]).toStrictEqual('after')
    })
  })

  describe('removeAllListeners', function () {
    const eventName = crypto.randomBytes(4).toString('hex')
    const ee = new EventEmitter()
    ee.on(eventName, tick)
    ee.on(eventName, tick)

    test('empty', function () {
      ee.removeAllListeners(eventName)
      expect(ee.listenerCount(eventName)).toStrictEqual(0)
    })
  })

  describe('removeListener', function () {
    const ee = new EventEmitter()
    const eventName = crypto.randomBytes(4).toString('hex')

    test('remove one listener at a time', function () {
      ee.addListener(eventName, tick)
      ee.addListener(eventName, tick)
      ee.removeListener(eventName, tick)

      expect(ee.listenerCount(eventName)).toStrictEqual(1)
    })

    test('remove more than stack', function () {
      ee.removeListener(eventName, tick)
      ee.removeListener(eventName, tick)

      expect(ee.listenerCount(eventName)).toStrictEqual(0)
    })
  })

  describe('setMaxListeners', function () {
    const ee = new EventEmitter()
    test('maxListeners is 10', function () {
      expect(ee.getMaxListeners()).toStrictEqual(10)
    })

    test('maxListeners = 11', function () {
      ee.setMaxListeners(11)
      expect(ee.getMaxListeners()).toStrictEqual(11)
    })

    test('maxListeners = -1', function () {
      expect(() => { ee.setMaxListeners(-1) }).toThrowError()
    })

    test('maxListeners = null', function () {
      expect(() => { ee.setMaxListeners('null' as any) }).toThrowError()
    })
  })
})
