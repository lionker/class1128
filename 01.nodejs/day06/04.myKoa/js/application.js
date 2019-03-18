const {createServer} = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

module.exports = class Application {
  constructor () {
    //初始化中间件数组
    this.middleware = [];
    this.context = context;
    this.request = request;
    this.response = response;
  }
  //使用中间件方法
  use (fn) {
    this.middleware.push(fn);
  }
  //监听端口号
  listen (...args) {
    // console.log(args); //实参列表，真数组
    const server = createServer(this.callback())
    server.listen(...args);
  }
  //处理回调的方法
  callback () {
    return (req, res) => {
      const fn = compose(this.middleware);
      //创建context 上下文对象
      const ctx = this.createContext(req, res);
      const respond = () => this.handleRequest(ctx);
      //then方法触发了, 说明所有中间件函数都被调用完成
      fn(ctx).then(respond);
    }
  }
  //处理响应回调函数
  handleRequest (ctx) {
    //最终返回响应
    const body = ctx.body;
    if (typeof body === 'object') {
      ctx.res.end(JSON.stringify(body));
    } else if (typeof body === 'string') {
      ctx.res.setHeader('content-type', 'text/html;charset=utf-8');
      ctx.res.end(body);
    } else {
      ctx.res.end(body);
    }
  }
  //创建context 上下文对象的方法
  createContext (req, res) {
    //Object.create(obj) 创建新对象, 新对象.__proto__ = obj
    //以指定对象为原型,创建新对象
    let context = Object.create(this.context);
    context.request = Object.create(this.request);
    context.response = Object.create(this.response);
    
    context.req = context.request.req = req;
    context.res = context.response.res = res;
    
    return context;
  }
}

function compose(middleware) {
  
  return (ctx) => {
    //默认调用一次，为了执行第一个中间件函数
    return dispatch(0);
    
    function dispatch(i) {
      //提取中间件数组的函数
      let fn = middleware[i];
      //让最后一个中间件的next方法，调用不出错，返回值是一个promise对象
      if (!fn) return Promise.resolve();
      //dispatch.bind(null, i + 1))就是next方法
      return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
    }
    
  }
}