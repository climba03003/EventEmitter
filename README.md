# EventEmitter

[![Continuous Integration](https://github.com/climba03003/eventemitter/actions/workflows/ci.yml/badge.svg)](https://github.com/climba03003/eventemitter/actions/workflows/ci.yml)
[![Package Manager CI](https://github.com/climba03003/eventemitter/actions/workflows/package-manager-ci.yml/badge.svg)](https://github.com/climba03003/eventemitter/actions/workflows/package-manager-ci.yml)
[![NPM version](https://img.shields.io/npm/v/@climba03003/eventemitter.svg?style=flat)](https://www.npmjs.com/package/@climba03003/eventemitter)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/climba03003/eventemitter)](https://github.com/climba03003/eventemitter)
[![Coverage Status](https://coveralls.io/repos/github/climba03003/eventemitter/badge.svg?branch=main)](https://coveralls.io/github/climba03003/eventemitter?branch=master)
[![GitHub](https://img.shields.io/github/license/climba03003/eventemitter)](https://github.com/climba03003/eventemitter)

NodeJS EventEmitter which ensure all the event listener run sequentially.
The API is follow the NodeJS API Documents.

## Installation

```bash
npm install @climba03003/event-emitter
```

## How to use

```javascript
const EventEmitter = require("@climba03003/event-emitter").EventEmitter;

class Foo extends EventEmitter {}
```

```typescript
import EventEmitter from "@climba03003/event-emitter";

class Foo extends EventEmitter {}
```
