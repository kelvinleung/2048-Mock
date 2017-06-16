/* 
  整个游戏的管理
*/

import { Tile } from './tile'
import { Grid } from './grid'

export class GameManager {
  constructor(size, Actuator) {
    this.size = size
    this.actuator = new Actuator
    this.startTiles = 2

    this.setup()
  }
  
  // 初始化：新建网格，添加初始块，DOM 初始化
  setup() {
    this.grid = new Grid(this.size)
    this.addStartTiles()
    this.actuate()
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
      let value = 2
      let tile = new Tile(this.grid.randomAvailableCell(), value)
      this.grid.insertTile(tile)
    }
  }

  // DOM 初始化
  actuate() {
    this.actuator.actuate(this.grid)
  }
}
