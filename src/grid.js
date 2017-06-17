/*
  网格类，初始化，判断有没有空位，插入块
*/

export class Grid {
  constructor(size) {
    this.size = size
    this.cells = this.empty()
  }

  // 根据给定的 size 生成一个空的网格
  empty() {
    let cells = []
    for (let x = 0; x < this.size; x++) {
      let row = cells[x] = []
      for (let y = 0; y < this.size; y++) {
        row.push(null)
      }
    }
    return cells
  }

  // 方便遍历所有元素
  eachCell(cb) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        cb(x, y, this.cells[x][y])
      }
    }
  }

  // 返回所有为空的格
  availableCells() {
    let cells = []
    this.eachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x: x, y: y })
      }
    })
    return cells
  }

  // 随机找一个空置的位置
  randomAvailableCell() {
    let cells = this.availableCells()
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)]
    }
  }

  // 是否还有空的格存在
  cellsAvailable() {
    return !!this.availableCells().length
  }

  // 提取某个位置中的块的内容
  cellContent(cell) {
    if (this.withinBounds(cell)) {
      return this.cells[cell.x][cell.y]
    } else {
      return null
    }
  }

  // 检查某个位置是否为空
  cellAvailable(cell) {
    return !this.cellContent(cell)
  }

  // 检查某个位置是否在网格内（越界）
  withinBounds(position) {
    return position.x >= 0 && position.x < this.size &&
           position.y >= 0 && position.y < this.size
  }

  // 在给定的块的位置上填入一个块
  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile
  }
}
