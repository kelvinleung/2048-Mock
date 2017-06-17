/*
  “块”的类
*/

export class Tile {
  constructor(position, value) {
    this.x = position.x
    this.y = position.y
    this.value = value || 2
    // 用于记录前置位置，产生移动的动画
    this.previousPosition = null
  }

  // 移动前，保存前置位置
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y }
  }

  // 保存当前的最新位置
  updatePosition(position) {
    this.x = position.x
    this.y = position.y
  }
}
