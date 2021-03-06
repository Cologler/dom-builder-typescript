# dom-builder

[![](https://data.jsdelivr.com/v1/package/gh/Cologler/dom-builder-typescript/badge)](https://www.jsdelivr.com/package/gh/Cologler/dom-builder-typescript)

A nice api for browser dom. idea from React.

**look**: like the dom tree:

``` js
const db = DomBuilder;
db.el('p', [
    '12',
    db.el('p', 'p_value'),
    "11"
]).get();
// <p>
//   "12"
//   <p>p_value</p>
//   "11"
// </p>
db.el('p', { id: 'p1', class: ['a', 'b'], attrs: { 'x': 'y' } }, [
    '12',
    db.el('p', 'p_value'),
    "11"
]).get();
// <p id="p1" class="a b" x="y">
//   "12"
//   <p>p_value</p>
//   "11"
// </p>
```

**method chaining**: like jquery:

``` js
db.el('a')
  .id('c')
  .class('a', 'b')
  .attr('href', 'www.google.com')
  .get();
// <a id="c" class="a b" href="www.google.com"></a>
```

**lazy create**: only create node when you call `get()`

## CDN

* [jsdelivr](https://cdn.jsdelivr.net/gh/Cologler/dom-builder-typescript/dist/dom-builder.js)
