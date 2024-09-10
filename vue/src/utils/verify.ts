//封装函数，实现表单校验
// 邮箱校验规则函数
export function emailValidator(rule: any, value: string, callback: Function) {
  if (!value) {
    callback(new Error("请输入您的邮件"));
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      callback(new Error("错误的邮件格式"));
    } else {
      callback();
    }
  }
}

export function usernameValidator(
  rule: any,
  value: string,
  callback: Function
) {
  if (!value) {
    callback(new Error("请输入您的用户名"));
  } else {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/; // 匹配3到16位由字母、数字或下划线组成的用户名
    if (!usernameRegex.test(value)) {
      callback(new Error("用户名必须由3到16位由字母、数字或下划线组成"));
    } else {
      callback();
    }
  }
}

export function passwordValidator(
  rule: any,
  value: string,
  callback: Function
) {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error("密码长度至少六位"));
  }
}

export function confirmPassValidator(
  rule: any,
  value: string,
  callback: Function,
  formData: any
) {
  if (value !== formData.password) {
    callback(new Error("两次密码不同"));
  } else {
    callback();
  }
}

export function phoneValidator(  
  rule: any,  
  value: string,  
  callback: (error?: string | Error) => void  
 ) {  
  // 使用正则表达式来匹配只包含数字的字符串  
  const regex = /^\d{11}$/;  
    
  if (regex.test(value)) {  
    // 如果匹配成功，调用回调函数无错误参数  
    callback();  
  } else {  
    // 如果匹配失败，调用回调函数并传入错误信息  
    callback(new Error("电话号码必须为11位纯数字"));  
  }  
}
