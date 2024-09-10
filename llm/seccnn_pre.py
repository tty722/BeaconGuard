import pandas as pd
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset
import csv
import json



# 数据归一化
def encode_numeric_range(df, names, normalized_low=0, normalized_high=1,
                         data_low=None, data_high=None):
    for name in names:
        if data_low is None:
            data_low = min(df[name])
            data_high = max(df[name])

        df[name] = ((df[name] - data_low) / (data_high - data_low)) \
                   * (normalized_high - normalized_low) + normalized_low
    return df


# 数据标准化
def encode_numeric_zscore(df, names, mean=None, sd=None):
    for name in names:
        if mean is None:
            mean = df[name].mean()

        if sd is None:
            sd = df[name].std()

        df[name] = (df[name] - mean) / sd
    return df


class LoadData(Dataset):
    def __init__(self, X, y):
        self.X = X
        self.y = y

    def __len__(self):
        return len(self.X)

    def __getitem__(self, index):
        X = torch.tensor(self.X.iloc[index])
        y = torch.tensor(self.y.iloc[index])
        return X, y


class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = nn.Sequential(  # 1*78*1
            nn.Conv1d(1, 32, kernel_size=2),  # 1*77*32
            nn.Conv1d(32, 64, kernel_size=2),  # 1*76*64
            nn.MaxPool1d(2, 2),  # 1*38*64
            nn.Conv1d(64, 64, kernel_size=2),  # 1*37*64
            nn.Conv1d(64, 128, kernel_size=2),  # 1*36*128
            nn.MaxPool1d(2, 2),  # 1*18*128
        )
        self.flatten = nn.Flatten()
        self.fc = nn.Sequential(
            nn.Linear(2304, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 15)
        )

    def forward(self, X):
        X = self.backbone(X)
        X = self.flatten(X)
        logits = self.fc(X)
        return logits


def predict(model, test_dataloader, device):
    label = []
    for X, y in test_dataloader:
        X = X.to(device).to(torch.float32)
        X = X.reshape(X.shape[0], 1, 78)
        y_pred = model(X)
        # print(y_pred[0])
        # print(torch.argmax(y_pred[0]))
        # print(torch.argmax(y_pred[0]).item())
        if torch.argmax(y_pred[0]).item() == 0:
            eng = 'Benign'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 10:
            eng = 'PortScan'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 2:
            eng = 'DDoS'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 3 or torch.argmax(y_pred[0]).item() == 4 or torch.argmax(
                y_pred[0]).item() == 5 or torch.argmax(y_pred[0]).item() == 6:
            eng = 'DoS'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 7 or torch.argmax(y_pred[0]).item() == 11:
            eng = 'Brute-Force'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 1:
            eng = 'Bot'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 9:
            eng = 'Infiltration'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 8:
            eng = 'Heartbleed'
            label.append(eng)
        elif torch.argmax(y_pred[0]).item() == 12 or torch.argmax(y_pred[0]).item() == 13 or torch.argmax(
                y_pred[0]).item() == 14:
            eng = 'Web-Attack'
            label.append(eng)
        else:
            label.append(torch.argmax(y_pred[0]).item())
    return label


def pre_cnn(path):
    df = pd.read_csv(path, encoding='utf-8')

    # 打印原始列顺序
    # print("原始列顺序:", df.columns.tolist())

    new_order = ['dst_port', 'flow_duration', 'tot_fwd_pkts', 'tot_bwd_pkts',
                 'totlen_fwd_pkts', 'totlen_bwd_pkts', 'fwd_pkt_len_max',
                 'fwd_pkt_len_min', 'fwd_pkt_len_mean', 'fwd_pkt_len_std',
                 'bwd_pkt_len_max', 'bwd_pkt_len_min', 'bwd_pkt_len_mean',
                 'bwd_pkt_len_std', 'flow_byts_s', 'flow_pkts_s', 'flow_iat_mean',
                 'flow_iat_std', 'flow_iat_max', 'flow_iat_min', 'fwd_iat_tot', 'fwd_iat_mean',
                 'fwd_iat_std', 'fwd_iat_max', 'fwd_iat_min', 'bwd_iat_tot', 'bwd_iat_mean',
                 'bwd_iat_std', 'bwd_iat_max', 'bwd_iat_min', 'fwd_psh_flags', 'bwd_psh_flags',
                 'fwd_urg_flags', 'bwd_urg_flags', 'fwd_header_len', 'bwd_header_len',
                 'fwd_pkts_s', 'bwd_pkts_s', 'pkt_len_min', 'pkt_len_max',
                 'pkt_len_mean', 'pkt_len_std', 'pkt_len_var',
                 'fin_flag_cnt', 'syn_flag_cnt', 'rst_flag_cnt', 'psh_flag_cnt',
                 'ack_flag_cnt', 'urg_flag_cnt', 'cwe_flag_count', 'ece_flag_cnt',
                 'down_up_ratio', 'pkt_size_avg', 'fwd_seg_size_avg',
                 'bwd_seg_size_avg', 'fwd_header_len', 'fwd_byts_b_avg',
                 'fwd_pkts_b_avg', 'fwd_blk_rate_avg', 'bwd_byts_b_avg',
                 'bwd_pkts_b_avg', 'bwd_blk_rate_avg', 'subflow_fwd_pkts',
                 'subflow_fwd_byts', 'subflow_bwd_pkts', 'subflow_bwd_byts',
                 'init_fwd_win_byts', 'init_bwd_win_byts', 'fwd_act_data_pkts',
                 'fwd_seg_size_min', 'active_mean', 'active_std', 'active_max',
                 'active_min', 'idle_mean', 'idle_std', 'idle_max', 'idle_min'
                 ]  # 请替换为你实际需要的列名

    # 重新排列列的顺序
    df = df[new_order]

    # 打印新的列顺序
    # print("新的列顺序:", df.columns.tolist())

    # 如果需要保存重新排列的 DataFrame 到新的 CSV 文件
    df.to_csv("dos_reordered.csv", index=False, encoding='utf-8', header=False)

    df = pd.read_csv('dos_reordered.csv', header=None, low_memory=False)
    # df.drop([0])

    df.columns = [
        'Destination Port', 'Flow Duration', 'Total Fwd Packets', 'Total Backward Packets',
        'Total Length of Fwd Packets', 'Total Length of Bwd Packets', 'Fwd Packet Length Max',
        'Fwd Packet Length Min', 'Fwd Packet Length Mean', 'Fwd Packet Length Std',
        'Bwd Packet Length Max', 'Bwd Packet Length Min', 'Bwd Packet Length Mean',
        'Bwd Packet Length Std', 'Flow Bytes/s', 'Flow Packets/s', 'Flow IAT Mean',
        'Flow IAT Std', 'Flow IAT Max', 'Flow IAT Min', 'Fwd IAT Total', 'Fwd IAT Mean',
        'Fwd IAT Std', 'Fwd IAT Max', 'Fwd IAT Min', 'Bwd IAT Total', 'Bwd IAT Mean',
        'Bwd IAT Std', 'Bwd IAT Max', 'Bwd IAT Min', 'Fwd PSH Flags', 'Bwd PSH Flags',
        'Fwd URG Flags', 'Bwd URG Flags', 'Fwd Header Length', 'Bwd Header Length',
        'Fwd Packets/s', 'Bwd Packets/s', 'Min Packet Length', 'Max Packet Length',
        'Packet Length Mean', 'Packet Length Std', 'Packet Length Variance',
        'FIN Flag Count', 'SYN Flag Count', 'RST Flag Count', 'PSH Flag Count',
        'ACK Flag Count', 'URG Flag Count', 'CWE Flag Count', 'ECE Flag Count',
        'Down/Up Ratio', 'Average Packet Size', 'Avg Fwd Segment Size',
        'Avg Bwd Segment Size', 'Fwd Header Length', 'Fwd Avg Bytes/Bulk',
        'Fwd Avg Packets/Bulk', 'Fwd Avg Bulk Rate', 'Bwd Avg Bytes/Bulk',
        'Bwd Avg Packets/Bulk', 'Bwd Avg Bulk Rate', 'Subflow Fwd Packets',
        'Subflow Fwd Bytes', 'Subflow Bwd Packets', 'Subflow Bwd Bytes',
        'Init_Win_bytes_forward', 'Init_Win_bytes_backward', 'act_data_pkt_fwd',
        'min_seg_size_forward', 'Active Mean', 'Active Std', 'Active Max',
        'Active Min', 'Idle Mean', 'Idle Std', 'Idle Max', 'Idle Min'
    ]

    df.dropna(inplace=True, axis=0)
    # 得到标签列索引
    cat_col = df.columns
    # 数据标准化
    df = encode_numeric_zscore(df, cat_col)
    # 数据归一化
    df = encode_numeric_range(df, cat_col)

    X, y = df, df['Idle Min']
    X_dimension = len(X.columns)  # 78
    y_dimension = 15

    test_data = LoadData(X, y)
    test_dataloader = DataLoader(test_data, num_workers=0)

    # 使用cuda进行GPU加速，如果无可加速显卡，则使用cpu
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(device)

    # 加载模型
    CNN_model = CNN()
    CNN_model.load_state_dict(torch.load('./Model/CNN_model49.pth', map_location=device))
    CNN_model.to(device)
    label = predict(CNN_model, test_dataloader, device)

    df = pd.read_csv(path, encoding='utf-8')
    # df.drop([0])
    # df.columns = ['src_ip', 'dst_ip', 'src_port', 'dst_port', 'protocol', 'timestamp', 'flow_duration', 'flow_byts_s', 'flow_pkts_s', 'fwd_pkts_s', 'bwd_pkts_s', 'tot_fwd_pkts', 'tot_bwd_pkts', 'totlen_fwd_pkts', 'totlen_bwd_pkts', 'fwd_pkt_len_max', 'fwd_pkt_len_min', 'fwd_pkt_len_mean', 'fwd_pkt_len_std', 'bwd_pkt_len_max', 'bwd_pkt_len_min', 'bwd_pkt_len_mean', 'bwd_pkt_len_std', 'pkt_len_max', 'pkt_len_min', 'pkt_len_mean', 'pkt_len_std', 'pkt_len_var', 'fwd_header_len', 'bwd_header_len', 'fwd_seg_size_min', 'fwd_act_data_pkts', 'flow_iat_mean', 'flow_iat_max', 'flow_iat_min', 'flow_iat_std', 'fwd_iat_tot', 'fwd_iat_max', 'fwd_iat_min', 'fwd_iat_mean', 'fwd_iat_std', 'bwd_iat_tot', 'bwd_iat_max', 'bwd_iat_min', 'bwd_iat_mean', 'bwd_iat_std', 'fwd_psh_flags', 'bwd_psh_flags', 'fwd_urg_flags', 'bwd_urg_flags', 'fin_flag_cnt', 'syn_flag_cnt', 'rst_flag_cnt', 'psh_flag_cnt', 'ack_flag_cnt', 'urg_flag_cnt', 'ece_flag_cnt', 'down_up_ratio', 'pkt_size_avg', 'init_fwd_win_byts', 'init_bwd_win_byts', 'active_max', 'active_min', 'active_mean', 'active_std', 'idle_max', 'idle_min', 'idle_mean', 'idle_std', 'fwd_byts_b_avg', 'fwd_pkts_b_avg', 'bwd_byts_b_avg', 'bwd_pkts_b_avg', 'fwd_blk_rate_avg', 'bwd_blk_rate_avg', 'fwd_seg_size_avg', 'bwd_seg_size_avg', 'cwe_flag_count', 'subflow_fwd_pkts', 'subflow_bwd_pkts', 'subflow_fwd_byts', 'subflow_bwd_byts']

    # 5. 添加标签列
    df['label'] = label

    # 6. 保存结果
    df.to_csv('dos_reordered_with_labels.csv', index=False)

    # 读取CSV文件
    csv_file_path = 'dos_reordered_with_labels.csv'
    json_file_path = 'data.json'

    data_list = []

    with open(csv_file_path, mode='r') as file:
        reader = csv.DictReader(file)

        for row in reader:
            # 将CSV行数据转换为JSON对象
            json_object = {
                "sourceIP": row["src_ip"],
                "destinationIP": row["dst_ip"],
                "sourcePort": int(row["src_port"]),
                "destinationPort": int(row["dst_port"]),
                "protocol": row["protocol"],
                "time": row["timestamp"],
                "label": row["label"]
            }
            data_list.append(json_object)

    # 将JSON对象列表写入文件
    with open(json_file_path, 'w') as file:
        json.dump({"data": data_list}, file, indent=4)

    print(f"CSV数据已成功转换为JSON格式并保存到 {json_file_path}")


if __name__ == '__main__':
    pre_cnn("2.csv")
