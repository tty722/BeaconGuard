//封装本地存储数据和读取数据方法

//存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem("TOKEN", token);
};

//本地获取数据
export const GET_TOKEN = () => {
  return localStorage.getItem("TOKEN"); //唯一标识符
};

//本地存储删除数据方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem("TOKEN");
};
