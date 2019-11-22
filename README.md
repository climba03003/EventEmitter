# EventEmitter

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
