/* eventBus.js */

/* 导入mitt包 */
import mitt from 'mitt'

/* 创建EventBus的实例对象 */
const bus = mitt()

/* 将EventBus的实例对象共享出去 */
export default bus