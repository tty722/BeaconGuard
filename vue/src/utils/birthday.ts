export function formatDate(dateStr:any) {
  // 尝试解析日期字符串  
  const date = new Date(dateStr);


  // 使用 padStart 方法来确保月份和日期都是两位数  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 返回格式化后的日期字符串  
  return `${year}-${month}-${day}`;
}