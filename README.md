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

# im-merge v1.0.2

The utility for immutable merging objects which actions helps.

## Why im-merge?

When using Redux, the good practice is always return a new object from state rather than mutate the existing one because of the shallow comparing. It helps avoid redundant components's re-rendering. 

The usual patterns that I observed when developers using Redux is:

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
import imMerge, { insertType } from 'im-merge';

const data = {x : { y : { z: 3, k: 7 } }, items: [{}, 2, 3, 4] };
const source = {x : { y : { z: 4 }, t: { q : 6 } }, items: insertType(5, 1) };

const result = imMerge(data, source);

console.log(result);
/*
{x : { y : { z: 4, k: 7 }, t: { q : 6 } }, items: [{}, 5, 2, 3, 4] };
*/
console.log(source.t === result.t); // true
console.log(source.items[0] === result.items[0]); // true -> object reference kept
console.log(source.t === result.t); // true
```

## Api:

**Main function:**
* `func imMerge(data: any, source: any) => any` return a **immutable** value/object by **recursively** merging data and source.

  + if data and source are **different** in type(object vs array, ...) then return source.
  + if data and source are **the same** in type(array/array, object/object, primitive/primitive) then do the merge.
  + if (array/array) case: the default behavior is returning the **concatenate array**, in order to handle more complex user case, we could use helpers **modification types**(insertType, insertFisrtType, insertLastType, insertBeforeMatchType, insertAfterMatchType, removeType, removeFirstType, removeLastType, removeMatchType);

**Array modification types:**
* `func insertType(data, index = 0, flatten = true) => object` return immutable array with inserted item at given index.
```jsx harmony
import imMerge, { insertType } from 'im-merge';

const data = { items: [{x: 1}, {x: 2}, {x: 3}] };
const source = { items: insertType([{x: 4}, {x: 5}], 1) };

const result = imMerge(data, source);
// { items: [{x: 1}, {x: 4}, {x: 5}, {x: 2}, {x: 3}] }
```
* `func insertFisrtType(data, flatten = true) => object` instruction for inserting new item at the beginning of the array
* `func insertLastType(data, flatten = true) => object` instruction for inserting new item at the end of the array
* `func insertBeforeMatchType(match, data, flatten = true) => object` instruction for inserting new item before the index of matched item(deep contain match) in the array
```jsx harmony
import imMerge, { insertBeforeMatchType } from 'im-merge';

const data = { items: [{x: 1}, {x: 2, y: {z: 3}}, {x: 3, y: {z: 4}}] };
const source = { items: insertBeforeMatchType([{x: 4}, {x: 5}], {y : {z: 3}}) };

const result = imMerge(data, source);
// { items: [{x: 1}, {x: 4}, {x: 5}, {x: 2, y: {z: 3}}, {x: 3, y: {z: 4}}] }
```
* `func insertAfterMatchType(match, data, flatten = true) => object` instruction for inserting new item after the index of matched item(deep contain match) in the array
* `func removeType(index = 0) => object` instruction for removing item at the index in the array
* `func removeFirstType() => object` instruction for removing item at the first index in the array
* `func removeLastType() => object` instruction for removing item at the last index in the array
* `func removeMatchType(match) => object` instruction for removing item at the matched index in the array
