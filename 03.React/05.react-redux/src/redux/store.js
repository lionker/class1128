/*
  用来集中性的存储所有redux管理的状态数据
 */
import { createStore, applyMiddleware } from 'redux';
// 引入异步中间件: 帮助解析异步更新
import thunk from 'redux-thunk';
// 引入开发者调试工具插件  redux-devtools
import { composeWithDevTools } from 'redux-devtools-extension';

// 引入reducers函数
import reducers from './reducers';

// 创建store对象
// 传入参数为reducers函数，这样store对象就和reducers函数绑定在一起
// 所以reducers函数调用时才有previousState，并且调用完返回的newState会交给store管理
const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

// 暴露出去
export default store;