import json
import os

# 文件路径
input_file_path = r'C:\Users\30883\Desktop\软件杯\alpha-ids\express\mock\restore.json'
output_file_path = r'C:\Users\30883\Desktop\软件杯\alpha-ids\express\mock\protocol.json'

def process_json(input_path, output_path):
    # 读取 JSON 文件
    try:
        with open(input_path, 'r', encoding='latin-1') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"文件未找到: {input_path}")
        return
    except json.JSONDecodeError:
        print("JSON 文件格式错误")
        return

    # 提取 'packages' 数据并重组
    if 'packages' in data:
        formatted_data = {
            "data": [
                {
                    "sourceIP": pkg.get("sourceIP", ""),
                    "destinationIP": pkg.get("destinationIP", ""),
                    "sourcePort": pkg.get("sourcePort", 0),
                    "destinationPort": pkg.get("destinationPort", 0),
                    "protocol": pkg.get("protocol", ""),
                    "time": pkg.get("time", ""),
                    "message": pkg.get("message", "")
                }
                for pkg in data["packages"]
            ]
        }
    else:
        print("'packages' 属性不存在于 JSON 数据中")
        return

    # 保存新 JSON 文件
    try:
        with open(output_path, 'w', encoding='utf-8') as file:
            json.dump(formatted_data, file, ensure_ascii=False, indent=2)
        print(f"新 JSON 文件已保存为: {output_file_path}")
    except IOError as e:
        print(f"保存文件失败: {e}")

if __name__ == "__main__":
    process_json(input_file_path, output_file_path)
