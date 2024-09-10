from flask import Flask, request, jsonify, send_file
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_community.llms import Ollama
from sft_model import generate_answer
import subprocess
import os
from seccnn_pre import pre_cnn
import json

app = Flask(__name__)

# 初始化 LLMChain 实例
ollama_llm = Ollama(model="llama2-chinese")

# 定义各部分的 Prompt 模板
prompt_template_overview = """
请严格按照以下 Markdown 格式输出，确保内容和格式一致：

**攻击类型**: {label}攻击  
**攻击时间**: {start_time}  
**总持续时间**: {total_time}秒  
**攻击目标**: 目标服务器 (IP: {dest_ip})  
**攻击影响**: 讲述{label}攻击在本次事件中的影响

请务必按照上述格式输出，不要遗漏任何字段或修改格式。
"""

prompt_template_threat_analysis = """
请严格按照以下 Markdown 格式输出本次攻击的威胁类型和威胁特征部分，不能修改格式，不得加入其他任何内容如疑问、建议或额外解释。必须确保输出的内容不低于100字，描述详细且准确。

- **威胁类型**: 请详细介绍此次 **{label}** 攻击的类型，描述它的核心机制和常见表现形式，不少于100字。重点分析此次攻击的技术手段及其目标，确保内容全面且具有分析深度。

- **威胁特征**: 详细分析此次 **{label}** 攻击的具体特征，目标 IP 为 {dest_ip}，主要端口为 {dest_port}。请描述攻击的行为模式、使用的协议及可能带来的影响，不少于100字。请确保描述清晰、准确，不能加入任何额外的内容。
"""

prompt_template_source_analysis = """
请严格按照以下 Markdown 格式输出本次攻击的攻击源IP地址和攻击来源端口部分内容，确保内容和格式一致，不能修改格式或加入任何其他内容如建议或额外解释。

- **攻击源IP地址**:{sourceip} ({sourcecity})  

  僵尸机的IP地址分布于不同国家/地区，表明攻击者可能利用了全球分布的僵尸网络。这种地理分布加大了追踪和防御的难度，攻击来源广泛，可能意味着攻击者在不同国家设置了多个控制节点。

- **攻击来源端口**:  
  大部分攻击源端口为动态端口，随机生成。这种动态端口的随机性使得攻击更加不可预测，增加了防御系统的复杂性，并提升了攻击的灵活性和多样性。
"""

prompt_template_dest_analysis = """
请严格按照以下格式输出，描述攻击目标的IP地址、所承载的服务类型以及受到的影响。确保内容详细且灵活，适当丰富内容，能够反映攻击对目标系统的实际影响。确保只输出以下的两段内容，每段不低于100字。

{label}攻击的目标IP地址为{dest_ip}，该服务器是公司核心服务的主机，承载了重要业务功能，例如在线交易、客户支持、移动应用接口等。在遭受攻击后，服务器的CPU和内存资源消耗过度，导致系统进入高负载状态，部分服务出现响应缓慢或崩溃，影响了业务的正常运行。

通过流量分析，发现攻击集中在服务的{dest_port}端口上，攻击者通过大量请求（如HTTP、HTTPS等）试图耗尽资源，造成服务中断或性能下降。核心业务受到严重影响，导致在线交易暂停、用户访问受限和服务不可用。
"""

prompt_template_strategy = """
请用中文严格按照以下的markdown格式输出，确保只输出四点建议，不包含无关内容,每点建议不少于150字,只需回答四点内容即可，其他内容无需输出:
    针对本次持续时间为{total_time}秒的{label}攻击，给出合理的建议，建议分四大点，每大点加粗格式显示，每大点详细输出不少于150字，要求建议合理，内容充实，分点回答。
"""

prompt_template_summary = """
请用中文严格按照以下的markdown格式输出入侵威胁报告的总结部分，确保不包含无关部分的内容,注意用一到两段话总结：
    本次{label}攻击目的IP为{dest_ip}，攻击源IP为{sourceip}，攻击起始时间为{start_time}，攻击持续时间为{total_time}秒，我们已经针对这次入侵事件写了一份包含概述、威胁类型和威胁特征分析、威胁源分析、威胁目的、应对措施与建议五个部分内容的入侵威胁报告，请你输出这份入侵威胁报告的总结部分，不包含其他无关部分的内容，请用至少350字的一到两段话总结这份入侵威胁报告。
"""

# 初始化 LLMChain 对象
overview_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_overview))
threat_analysis_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_threat_analysis))
source_analysis_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_source_analysis))
dest_analysis_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_dest_analysis))
strategy_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_strategy))
summary_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_summary))

prompt_template_suggest = """
请严格按照 Markdown 格式输出，确保内容和格式合理，给出针对本次{label}攻击的安全策略建议：
本次{label}攻击，源IP为{source_ip}，目的IP为{dest_ip}，攻击开始时间为{start_time}，持续时间为{total_time}
    请你分四个大点(每个大点不少于250字)针对这次攻击给出合理的安全策略建议，每个大点再分为不同的小点，要求每个大点不少于250字

请务必按照上述要求输出。
"""
suggest_chain = LLMChain(llm=ollama_llm, prompt=PromptTemplate.from_template(prompt_template_suggest))


@app.route('/generate_report', methods=['POST'])
def generate_report():
    print('report--come')
    data = request.json

    dest_ip = data.get('destinationIP')
    source = data.get('source')
    dest_port = data.get('destinationPort')
    start_time = data.get('time')
    label = data.get('label')
    total_time = data.get('total_time')

    # 提取 source 中的 IP 和城市信息
    sourceip = source['sourceIP']
    sourcecity = source['sourceCity']

    # 生成每个部分的内容
    overview = overview_chain.run(start_time=start_time, dest_ip=dest_ip, label=label, total_time=total_time)
    while overview == '':
        overview = overview_chain.run(start_time=start_time, dest_ip=dest_ip, label=label, total_time=total_time)
    print(overview)

    threat_analysis = threat_analysis_chain.run(dest_ip=dest_ip, label=label, dest_port=dest_port)
    while threat_analysis == '':
        threat_analysis = threat_analysis_chain.run(dest_ip=dest_ip, label=label, dest_port=dest_port)
    print(threat_analysis)

    source_analysis = source_analysis_chain.run(sourceip=sourceip,
                                                sourcecity=sourcecity)
    while source_analysis == '':
        source_analysis = source_analysis_chain.run(sourceip=sourceip,
                                                    sourcecity=sourcecity)
    print(source_analysis)

    dest_analysis = dest_analysis_chain.run(dest_ip=dest_ip, label=label, dest_port=dest_port)
    while dest_analysis == '':
        dest_analysis = dest_analysis_chain.run(dest_ip=dest_ip, label=label, dest_port=dest_port)
    print(dest_analysis)

    strategy = strategy_chain.run(label=label, total_time=total_time)
    while strategy == '':
        strategy = strategy_chain.run(label=label, total_time=total_time)
    print(strategy)

    summary = summary_chain.run(label=label, total_time=total_time, dest_ip=dest_ip, start_time=start_time,
                                sourceip=sourceip)
    while summary == '':
        summary = summary_chain.run(label=label, total_time=total_time, dest_ip=dest_ip, start_time=start_time,
                                    sourceip=sourceip)
    print(summary)

    # 组合成完整的报告
    final_report = f"""
# 入侵威胁报告\n

## 一、概述\n
{overview}

## 二、威胁类型分析\n
{threat_analysis}

## 三、威胁源分析\n
{source_analysis}

## 四、攻击目标分析\n
{dest_analysis}

## 五、应对措施与建议\n
{strategy}

## 六、结论\n
{summary}
    """

    return jsonify({"report": final_report})


@app.route('/generate_suggest', methods=['POST'])
def generate_suggest():
    print('suggest--come')
    data = request.json

    dest_ip = data.get('destinationIP')
    source_ip = data.get('sourceIP')
    dest_port = data.get('destinationPort')
    start_time = data.get('time')
    label = data.get('label')
    total_time = data.get('total_time')

    # 生成每个部分的内容
    suggest = suggest_chain.run(start_time=start_time, dest_ip=dest_ip, label=label, total_time=total_time,
                                source_ip=source_ip)
    while suggest == '':
        suggest = suggest_chain.run(start_time=start_time, dest_ip=dest_ip, label=label, total_time=total_time,
                                    source_ip=source_ip)
    print(suggest)

    # 组合成完整的报告
    final_suggest = f"""
# 安全策略建议\n
    
{suggest}
        """

    return jsonify({"suggest": final_suggest})


@app.route('/alphaIDS', methods=['POST'])
def alphaIDS():
    print('alpha--come')
    # 从 JSON 请求中提取 'instruction' 字段
    data = request.json
    if 'instruction' in data:
        instruction = data['instruction']
    else:
        return jsonify({"error": "No instruction provided"}), 400

    # 调用生成答案函数
    answer = generate_answer(instruction)
    print(answer)

    # 返回 JSON 响应
    return jsonify({"response": answer})


@app.route('/threat', methods=['POST'])
def threat():
    print('threat -- come')
    csv_dir = './csv'
    os.makedirs(csv_dir, exist_ok=True)
    # 接收上传的 pcap 文件
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # 保存 csv 文件到 csv 文件夹
    csv_file_path = os.path.join(csv_dir, file.filename)
    file.save(csv_file_path)

    pre_cnn(csv_file_path)

    # 假设 data.json 是威胁检测的输出，读取并返回内容
    json_file_path = './data.json'
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
            print(data)
        return jsonify(data)  # 将 JSON 数据作为响应返回
    else:
        return "data.json not found", 404


if __name__ == '__main__':
    app.run(debug=True)
