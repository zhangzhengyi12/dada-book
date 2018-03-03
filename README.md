flatlist 组件会热心的帮你把 item 进行一层包裹
别再 view 里直接加文本,会出问题，闪退，需要用<Text>包裹
```js

export let contentFormat = (content) => {
  let fontCount = parseInt(Dimen.window.width / 18 - 1)
  let fontLines = parseInt((Dimen.window.height - 100) / 34)
  const length = content.length
  let array = []
  let x = 0, y, m = 0
  while (x < length) {
    let _array = []
    for (var i = 0; i <= fontLines; i++) {
      let str = content.substring(x, x + fontCount)
      if (str.indexOf('@') != -1) {
        y = x + str.indexOf('@') + 1
        _array[i] = content.substring(x, y).replace('@', '')
        x = y
        continue
      } else {
        y = x + fontCount
        _array[i] = content.substring(x, y)
        x = y
        continue
      }
    }
     array[m] = _array
    m++
  }
  return array


```

每一页排多少字是算出来的

缓存首先需要检查，按序进行缓存，不要太高并发。