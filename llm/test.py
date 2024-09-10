from transformers import AutoTokenizer, AutoModelForCausalLM


def reformat_sft(instruction, input):
    if input:
        prefix = (
            "Below is an instruction that describes a task, paired with an input that provides further context. "
            "Write a response that appropriately completes the request in Markdown format.\n"
            "### Instruction:\n{instruction}\n\n### Input:\n{input}\n\n### Response (in Markdown):"
        )
    else:
        prefix = (
            "以下是一个描述问题的指令，请用Markdown格式给出一个非常满足要求的回答。\n"
            "### 问题：\n{instruction}\n\n### 回答（Markdown格式）:"
        )
    prefix = prefix.replace("{instruction}", instruction)
    prefix = prefix.replace("{input}", input)
    return prefix


def evaluate(
        instruction,
        temperature=0.1,
        top_p=0.75,
        max_new_tokens=256,
        repetition_penalty=1.1,
        **kwargs,
):
    if not instruction:
        return None

    prompt = reformat_sft(instruction, "")
    tokenizer = AutoTokenizer.from_pretrained("models")
    model = AutoModelForCausalLM.from_pretrained("models")

    inputs = tokenizer(prompt, return_tensors="pt")
    input_ids = inputs["input_ids"].to(device)

    generation_config = dict(
        temperature=temperature,
        top_p=top_p,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        repetition_penalty=repetition_penalty,
    )

    output_ids = model.generate(input_ids=input_ids, **generation_config)
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    return output_text


def get_substring_after(original_string, target_substring):
    index = original_string.find(target_substring)
    if index != -1:
        return original_string[index + len(target_substring):]
    else:
        return ""


if __name__ == "__main__":
    device = "cpu"
    instruction = "ddos攻击是什么,有什么特点，列出来"
    answer = evaluate(instruction=instruction)
    answer = get_substring_after(answer, "回答（Markdown格式）:")

    # 打印Markdown格式的回答
    print(answer)