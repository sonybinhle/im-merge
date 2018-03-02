<div align="center"><strong>Status</strong></div>

<div align="center">
  <a href="https://david-dm.org/sonybinhle/im-merge?type=dev" title="devDependencies status">
    <img src="https://david-dm.org/sonybinhle/im-merge/dev-status.svg"/>
  </a>
  
  <a href="https://travis-ci.org/sonybinhle/im-merge.svg?branch=master">
      <img src="https://travis-ci.org/sonybinhle/im-merge.svg?branch=master" alt="Build Status" />
    </a>
    
  <a href='https://coveralls.io/github/sonybinhle/im-merge?branch=master'>
  <img src='https://coveralls.io/repos/github/sonybinhle/im-merge/badge.svg?branch=master' alt='Coverage Status' />
  </a>

</div>

# im-merge v0.0.2

The utility for immutable merging objects which actions helps.

## Why im-merge?

TBD


## Install:

```shell
npm i im-merge
```

## Usage:

<strong>ES6</strong>

```jsx harmony
import imMerge from 'im-merge';

const data = {x : { y : { z: 3, k: 7 } } };
const source = {x : { y : { z: 4 }, t: { q : 6 } } };

const result = imMerge(data, source);

console.log(result);
/*
{x : { y : { z: 4, k: 7 }, t: { q : 6 } } };
*/
console.log(source.t === result.t); // true
```

## Api:

TBD

## Static functions

TBD
