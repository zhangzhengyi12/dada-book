class TouchData {
  constructor(x, y, vh, vw) {
    this.x = x
    this.y = y
    this.vh = vh
    this.vw = vw
    this.hHalf = vh / 2
    this.wHalf = vw / 2
    this.middleRect = {
      w: 200,
      h: 300
    }
    this.middleToTopBot = (this.vh - this.middleRect.h) / 2
    this.middleToLeftRight = (this.vw - this.middleRect.w) / 2
  }
  isRightTop() {
    return this.x > this.wHalf && this.y < this.middleToTopBot
  }
  isRighgCenter() {
    return this.x > this.middleToLeftRight + this.middleRect.w && this.y > this.middleToTopBot && this.y < this.vh - this.middleToTopBot
  }
  isRightBot() {
    return this.x > this.wHalf && this.y > this.vh - this.middleToTopBot
  }
  isRight() {
    return this.isRightTop() || this.isRighgCenter() || this.isRightBot()
  }
  isMiddle() {
    return (
      this.x > this.middleToLeftRight &&
      this.x < this.vw - this.middleToLeftRight &&
      this.y > this.middleToTopBot &&
      this.y < this.vh - this.middleToTopBot
    )
  }
  isLeft() {
    return this.isLeftTop() || this.isLeftCenter() || this.isLeftBot()
  }
  isLeftTop() {
    return this.x < this.wHalf && this.y < this.middleToTopBot
  }
  isLeftCenter() {
    return this.x < this.middleToLeftRight + this.middleRect.w && this.y > this.middleToTopBot && this.y < this.vh - this.middleToTopBot
  }
  isLeftBot() {
    return this.x < this.wHalf && this.y > this.vh - this.middleToTopBot
  }
}

export default TouchData
