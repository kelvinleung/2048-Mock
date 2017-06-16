import { GameManager } from './game-manager'
import { HTMLActuator } from './html-actuator'
import style from '../style/main.css'

// 等待浏览器准备好了再开始
window.requestAnimationFrame(() => {
  new GameManager(4, HTMLActuator)
})
