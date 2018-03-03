const formatBatterLevel = function(level) {
  return Math.floor(level * 100)
}

const formatTime = function(time) {}

const formatReaderPercent = function(percent) {
  return toDecimal(Math.floor(percent * 1000) / 10, 1)
}
let init = true
function toDecimal(x, n) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return false
  }
  var f = Math.round(x * 100) / 100
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + n) {
    s += '0'
  }
  return s
}

const formatBookChapterContentTest = function(content, { vh, vw, lh, fz }) {
  let fontCount = Math.floor(vw / fz)
  let fontLines = Math.floor(vh / lh)
  const length = content.length
  let x = 0,
    y = 0,
    p = 0
  let result = []
  while (x < length) {
    let _array = []
    for (let i = 0; i < fontLines; i++) {
      let currentLine = content.slice(x, x + fontCount)
      if (currentLine.indexOf('\n') !== -1) {
        y = currentLine.indexOf('\n') + 1
        _array[i] = content.slice(x, y)
        x = y
      } else {
        // 不包含回车
        _array[i] = currentLine
        x = x + fontCount
      }
    }
    result[p] = _array.join('')
    p++
  }
  return result
}

const formatBookChapterContent = function(content, { vh, vw, lh, fz }) {
  // 计算屏幕所能容纳的最高字符数
  let fontCount = Math.floor(vw / fz)
  let fontLines = Math.floor(vh / lh) - 1
  const length = content.length
  let array = []
  let x = 0,
    y,
    m = 0
  while (x < length) {
    let _array = []
    for (var i = 0; i <= fontLines; i++) {
      let str = content.substring(x, x + fontCount)
      if (str.indexOf('\n') != -1) {
        y = x + str.indexOf('\n') + 1
        _array[i] = content.substring(x, y)
        x = y
        continue
      } else {
        y = x + fontCount
        if (str.match(/\s/gi) && str.match(/\s/gi).length >= 3) {
          y += 2
        }
        _array[i] = content.substring(x, y)
        x = y
        continue
      }
    }
    array[m] = _array.join(' ')
    m++
  }
  return array
}

export { formatBatterLevel, formatReaderPercent, formatBookChapterContent }
