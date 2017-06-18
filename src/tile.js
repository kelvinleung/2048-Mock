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
    // 用于记录合并的位置，产生合并的动画
    this.mergedFrom = null
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
