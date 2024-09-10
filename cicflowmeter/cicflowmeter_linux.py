from flask import Flask, request, jsonify, send_file
import subprocess
import os
import json

app = Flask(__name__)

# 路径设置
pcap_dir = './pcap'
csv_dir = './csv'
output_dir = './output'
os.makedirs(pcap_dir, exist_ok=True)
os.makedirs(csv_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     # 接收上传的 pcap 文件
#     if 'file' not in request.files:
#         return "No file part", 400

#     file = request.files['file']
#     if file.filename == '':
#         return "No selected file", 400

#     # 保存 pcap 文件到 pcap 文件夹
#     pcap_file_path = os.path.join(pcap_dir, file.filename)
#     file.save(pcap_file_path)

#     # 转换 pcap 文件为 csv
#     csv_file_name = f"{os.path.splitext(file.filename)[0]}.csv"
#     csv_file_path = os.path.join(csv_dir, csv_file_name)

#     # 调用 cicflowmeter 进行转换
#     command = f"cicflowmeter -f {pcap_file_path} -c {csv_file_path}"
#     subprocess.run(command, check=True, shell=True)

#     # 返回生成的 csv 文件
#     return send_file(csv_file_path, as_attachment=True)

@app.route('/process', methods=['POST'])
def process_file():
    # 接收上传的文件
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # 保存 pcap 文件到 pcap 文件夹
    pcap_file_path = os.path.join(pcap_dir, file.filename)
    file.save(pcap_file_path)

    # 执行 C++ 代码
    # 假设你的 C++ 程序叫做 `ids` 并且已经编译好了
    command = f"./ids {pcap_file_path}"
    subprocess.run(command, check=True, shell=True)

    # 返回 output.json 中的数据
    output_json_path = './output.json'
    if not os.path.exists(output_json_path):
        return "Output file not found", 404

    # 读取 output.json 文件内容并返回
    return send_file(output_json_path, mimetype='application/json', as_attachment=True, download_name='output.json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
