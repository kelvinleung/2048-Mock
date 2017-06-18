/* 
  整个游戏的管理
*/

import { Tile } from './tile'
import { Grid } from './grid'

export class GameManager {
  constructor(size, Actuator, InputManager) {
    this.size = size
    this.inputManager = new InputManager
    this.actuator = new Actuator
    this.startTiles = 2

    // 绑定 this 到 move()，为了后续调用的正确，this = new GameManager
    this.inputManager.addEventHandler('move', this.move.bind(this))
    // 重新开始游戏
    this.inputManager.addEventHandler('restart', this.restart.bind(this))

    this.setup()
  }
  
  // 初始化：新建网格，添加初始块，DOM 初始化
  setup() {
    this.grid = new Grid(this.size)
    this.addStartTiles()
    this.actuate()
  }

  // 重新开始游戏
  restart() {
    // 重新初始化
    this.setup()
  }

  // 初始化最开始的块
  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile()
    }
  }

  // 在随机位置添加块
  addRandomTile() {
    if (this.grid.cellsAvailable()) {
      let value = Math.random() < 0.9 ? 2 : 4
      let tile = new Tile(this.grid.randomAvailableCell(), value)
      this.grid.insertTile(tile)
    }
  }

  // DOM 初始化
  actuate() {
    this.actuator.actuate(this.grid)
  }

  /* ---------- 游戏操作部分 ---------- */

  // 处理移动的逻辑，按键后的操作
  move(direction) {
    let cell, tile
    // 与按键对应的向量
    let vector = this.getVector(direction)
    // 用于遍历的二维数组，从远到近
    let traversals = this.buildTraversals(vector)
    let moved = false

    // 记录移动前的位置，保存到块中
    this.prepareTiles()

    // 开始遍历所有位置，找到块，找到块的最远可移动位置
    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        cell = { x: x, y: y }
        tile = this.grid.cellContent(cell)

        if (tile) {
          // 寻找到块要移动到的最远位置
          let position = this.findFarthestPosition(cell, vector)
          let next = this.grid.cellContent(position.next)
          // 只能合并一次，合并条件为两者的值相等
          if (next && next.value === tile.value && !next.mergedFrom) {
            let mergedTile = new Tile(position.next, tile.value * 2)
            mergedTile.mergedFrom = [tile, next]
            // 只保留合并后的块
            this.grid.insertTile(mergedTile)
            this.grid.removeTile(tile)

            tile.updatePosition(position.next)
          } else {
            // 将块移动到最远的位置，即更新块的位置坐标
            this.moveTile(tile, position.farthest)
          }

          // 判断块的前后坐标是否一致，即是否有移动
          if (!this.positionsEqual(tile, cell)) {
            moved = true
          }
        }
      })
    })

    // 移动后增加新的块，并刷新 DOM
    if (moved) {
      this.addRandomTile()
      this.actuate()
    }
  }

  // 移动块，实际为更新块的位置
  moveTile(tile, cell) {
    this.grid.cells[tile.x][tile.y] = null
    this.grid.cells[cell.x][cell.y] = tile
    // 浅拷贝
    tile.updatePosition(cell)
  }

  // 记录所有块移动前的位置，保存到块中
  prepareTiles() {
    this.grid.eachCell((x, y, tile) => {
      if (tile) {
        // 移动前清除所有已经合并的块
        tile.mergedFrom = null
        tile.savePosition()
      }
    })
  }

  // 根据按键方向，返回对应的向量，用于遍历
  getVector(direction) {
    const map = {
      'up': { x: 0, y: -1 },
      'right': { x: 1, y: 0 },
      'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 }
    }
    return map[direction]
  }

  // 返回一个二维数组，用于之后根据方向，从远到近遍历整个网格
  buildTraversals(vector) {
    let traversals = { x: [], y: [] }

    for (let i = 0; i < this.size; i++) {
      traversals.x.push(i)
      traversals.y.push(i)
    }
    // 根据方向，从最远的位置到最近，块是先移动远的再到近的
    if (vector.x === 1) {
      traversals.x = traversals.x.reverse()
    }
    if (vector.y === 1) {
      traversals.y = traversals.y.reverse()
    }

    return traversals
  }

  // 寻找最远的可移动位置，即根据向量，寻找空置的格，直到有障碍出现（格不为空）
  findFarthestPosition(cell, vector) {
    let previous
    do {
      previous = cell
      // 根据向量，往对应的方向走一格
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell))
    return { farthest: previous, next: cell }
  }

  // 判断块的前后位置是否一致，即是否有移动
  positionsEqual(before, after) {
    return before.x === after.x && before.y === after.y
  }
}
