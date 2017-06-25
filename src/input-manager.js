/*
  按键操作的处理
*/

export class InputManager {
  constructor() {
    // 储存所有需要处理的事件
    this.events = {}
    this.listen()
  }

  listen() {
    // 按键对应的 key code
    const keyMap = {
      38: 'up',
      39: 'right',
      40: 'down',
      37: 'left'
    }

    // 添加 keydown 事件的处理
    document.addEventListener('keydown', (event) => {
      let keyPressed = keyMap[event.which]
      // 如果按下的不是方向键，则忽略不处理
      if (keyPressed !== undefined) {
        event.preventDefault()
        this.emit('move', keyPressed)
      }
    })

    // 添加重新开始按钮点击事件的处理
    const restartButton = document.getElementById('btn-restart')
    restartButton.addEventListener('click', (event) => {
      event.preventDefault()
      this.emit('restart')
    })

    // 记录触摸起始位置
    let touchStartX, touchStartY
    const gameContainer = document.getElementById('game-container')
    // 获取触摸开始位置
    gameContainer.addEventListener('touchstart', (event) => {
      if (event.targetTouches.length > 1) {
        return
      }
      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
      event.preventDefault()
    })

    gameContainer.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })
    // 获取触摸结束位置，计算滑动方向
    gameContainer.addEventListener('touchend', (event) => {
      if (event.targetTouches.length > 0) {
        return
      }

      let touchEndX = event.changedTouches[0].clientX
      let touchEndY = event.changedTouches[0].clientY
      // 计算滑动方向（X 轴 or Y 轴）
      let dX = touchEndX - touchStartX
      let absDX = Math.abs(dX)
      let dY = touchEndY - touchStartY
      let absDY = Math.abs(dY)
      // 判断滑动方向
      if (Math.max(absDX, absDY) > 10) {
        this.emit('move', absDX > absDY ? (dX > 0 ? 'right' : 'left') : (dY > 0 ? 'down' : 'up'))
      }
    })
  }

  // 添加事件的 handler
  addEventHandler(event, handler) {
    this.events[event] = handler
  }

  // 事件发生时，调用对应的 handler
  emit(event, params) {
    // 取出储存的事件的 handler
    let handler = this.events[event]
    if (handler) {
      handler(params)
    }
  }
}
