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

# im-merge v0.1.0

The utility for immutable merging objects which actions helps.

## Why im-merge?

When using Redux, the good practice is always return a new object from state rather than mutate the existing one because of the shallow comparing. It helps avoid redundant component's re-rendering. 

The usual patterns that I observe when developers using Redux it.

```jsx harmony
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'INIT':
      return payload;
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, payload] };
    case 'CHANGE_TITLE':
      return { ...state, title: payload };
    case 'CHANGE_NAME':
      return { ...state, name: payload };
    default:
      return state;
  } 
};
```
There is two problems with the above implementation:

* It looks the same and repetitive for many reducers, the main purpose is still merging objects in the immutable manner. 
* Deeply nested object update with be even harder.

We could rewrite it as:

```jsx harmony
import imMerge from 'im-merge';
/*
* payload could be:
* { title: 'new title' }
* { name: 'new name' }
* { items: ['new item'] }
* */
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'INIT':
      return payload;
    case 'CHANGE':
      return imMerge(state, payload);
    default:
      return state;
  } 
};
```

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
