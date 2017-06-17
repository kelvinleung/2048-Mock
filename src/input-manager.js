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
