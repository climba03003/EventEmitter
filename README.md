# EventEmitter

[![Build Status](https://travis-ci.com/climba03003/EventEmitter.svg?branch=master)](https://travis-ci.com/climba03003/Validator)
[![Coverage Status](https://coveralls.io/repos/github/climba03003/EventEmitter/badge.svg?branch=master)](https://coveralls.io/github/climba03003/EventEmitter?branch=master)
![GitHub](https://img.shields.io/github/license/climba03003/EventEmitter)

NodeJS EventEmitter which ensure all the event listener run sequentially.
The API is follow the NodeJS API Documents.

## Installation

```bash
npm install @climba03003/event-emitter
```

## How to use

```javascript
const EventEmitter = require('@climba03003/event-emitter').EventEmitter;

class Foo extends EventEmitter {}
```

```typescript
import EventEmitter from '@climba03003/event-emitter';

class Foo extends EventEmitter {}
```
