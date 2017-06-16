/*
  处理所有 DOM 相关操作
*/

export class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector('.tile-container')
  }

  // 初始化网格到 DOM
  actuate(grid) {
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer)
      grid.cells.forEach((column) => {
        column.forEach((cell) => {
          if (cell) {
            this.addTile(cell)
          }
        })
      })
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
    const position = { x: tile.x, y: tile.y }
    const positionClass = this.positionClass(position)

    let classes = ['tile', positionClass]
    this.applyClasses(wrapper, classes)

    inner.classList.add('tile-inner')
    inner.textContent = tile.value

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
}
