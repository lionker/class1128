/*
  用来创建action对象的工厂函数模块
  action对象 --> {type: xxx, data: xxx}
    type 用来决定reducers最终对数据执行什么操作
    data 用来决定数据怎么修改
 */

import { INCREMENT, DECREMENT } from './action-types';

// 同步： 返回值是一个action对象
// action creators 工厂函数
export const increment = (data) => ({type: INCREMENT, data});

export const decrement = (data) => ({type: DECREMENT, data});

// 异步：返回值是一个函数
export const incrementAsync = (data) => {
  return (dispatch) => {
    // dispatch用来触发reducers调用，从而更新组件
    setTimeout(() => {
      dispatch(increment(data));
    }, 1000)
  }
}

