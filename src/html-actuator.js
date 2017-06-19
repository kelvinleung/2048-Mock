/*
  处理所有 DOM 相关操作
*/

export class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector('.tile-container')
    this.scoreContainer = document.getElementById('score')
    this.bestContainer = document.getElementById('best')
  }

  // 初始化网格到 DOM
  actuate(grid, metaData) {
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer)
      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell)
          }
        })
      })
      // 更新得分的数据到 DOM
      this.updateScore(metaData.score)
      // 更新最高得分的数据到 DOM
      this.updateBest(metaData.best)
    })
  }

  // 清除网格中的所有块
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }

  // 添加一个块到 DOM
  addTile(tile) {
    const wrapper = document.createElement('div')
    const inner = document.createElement('div')
    // 先放置在前置的位置
    const position = tile.previousPosition || { x: tile.x, y: tile.y }
    const positionClass = this.positionClass(position)

    // 先放置在前置的位置，产生移动的动画
    let classes = ['tile', positionClass]
    this.applyClasses(wrapper, classes)

    inner.classList.add('tile-inner')
    inner.textContent = tile.value

    // 判断某个块是否有前置的位置（是否要有移动动画）
    if (tile.previousPosition) {
      window.requestAnimationFrame(() => {
        classes[1] = this.positionClass({ x: tile.x, y: tile.y })
        this.applyClasses(wrapper, classes)
      })
    } else if (tile.mergedFrom) {
      // 合并产生的块，添加合并的动画
      classes.push('tile-merged')
      this.applyClasses(wrapper, classes)
      // 合并的两个块，要有过渡动画，分别为移动以及保持原位，最终会在合并的位置产生三个重叠的块
      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged)
      })
    } else {
      // 没有前置位置的话，添加新增块的动画
      classes.push('tile-new')
      this.applyClasses(wrapper, classes)
    }

    wrapper.appendChild(inner)
    this.tileContainer.appendChild(wrapper)
  }

  // 添加块的 CSS
  applyClasses(element, classes) {
    element.setAttribute('class', classes.join(' '))
  }

  // 添加块的 CSS 中的位置
  positionClass(position) {
    return 'tile-position-' + position.x + '-' + position.y
  }

  // 更新得分
  updateScore(score) {
    this.scoreContainer.textContent = score
  }
  // 更新最高记录
  updateBest(score) {
    this.bestContainer.textContent = score
  }
}
