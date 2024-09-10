#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <pcap.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netinet/if_ether.h>
#include <netinet/ip.h>
#include <linux/tcp.h>
#include <netinet/udp.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <resolv.h>
#include <netinet/ether.h>
#include <vector>
#include <map>
#include <cstring>
#include <string>
#include <fstream>
#include <iterator>
#include <algorithm>
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/istreamwrapper.h"
#include <iomanip>
#include <ctime>
#include <chrono>
#include <netinet/ip_icmp.h>
#include <netinet/in.h>
#include <regex>

using namespace std;
using namespace rapidjson;
long long num = 0;
#define pathway "./"
#define NAME_SIZE 50
#define SIZE_ETHERNET 14 // 以太网头部大小
#define ETHER_ADDR_LEN 6 // 以太网地址长度
#define IP_HL(ip) (((ip)->ip_vhl) & 0x0f)

bool ipreassembly = false;
bool tcpstreamreassembly = false;
bool applicationlayerextraction = false;
bool storedInDatabase = false;
int totalpackets = 0, totalbytes = 0;
int totalpackets_tcp = 0, totalbytes_tcp = 0;
int totalpackets_udp = 0, totalbytes_udp = 0;
int totalpackets_ftp = 0, totalbytes_ftp = 0;
int totalpackets_http = 0, totalbytes_http = 0;
int totalpackets_dns = 0, totalbytes_dns = 0;

struct FlowTuple
{
    string sourceIP;
    string destinationIP;
    int sourcePort;
    int destinationPort;
    string protocol;
    string time; // 假设这里使用字符串表示时间
};

struct PacketStats
{
    int total_packets;
    int total_bytes;
    int tcp_packets;
    int tcp_bytes;
    int udp_packets;
    int udp_bytes;
    int http_packets;
    int http_bytes;
    int ftp_packets;
    int ftp_bytes;
    int dns_packets;
    int dns_bytes;
    int icmp_bytes;
    int icmp_packets;

    PacketStats() : total_packets(0), total_bytes(0), tcp_packets(0), tcp_bytes(0),
                    udp_packets(0), udp_bytes(0), http_packets(0), http_bytes(0),
                    ftp_packets(0), ftp_bytes(0), dns_packets(0), dns_bytes(0), icmp_bytes(0), icmp_packets(0) {}
};

struct TCPFragment
{
    uint32_t seq; // 序列号
    uint16_t len;
    std::vector<uint8_t> data; // 数据保存
    uint16_t nack;             // 每个分片的ack
};

struct tcp_packet_info
{
    struct iphdr *ip_header;                       // IP头部信息
    std::map<unsigned int, TCPFragment> fragments; // 存储所有分片的map
    string app;                                    // 协议类型
    string type;                                   // 数据格式
    string path;                                   // 创建路径
    bool is_syn;
    uint32_t seqn;
    bool is_first; // 判断有没有头部协议
    bool end;
};
struct Fragment
{
    uint16_t id;               // 分片的ID
    uint16_t offset;           // 分片的偏移量
    uint16_t len;              // 分片的长度
    std::vector<uint8_t> data; // 分片的数据内容
};

struct packet_info
{
    struct iphdr *ip_header;                    // IP头部信息
    std::map<unsigned int, Fragment> fragments; // 存储所有分片的map
    bool reassembled;                           // 是否已经重组完成
    uint32_t id;
};
struct sniff_ethernet
{
    u_char ether_dhost[ETHER_ADDR_LEN]; // 目标主机地址
    u_char ether_shost[ETHER_ADDR_LEN]; // 源主机地址
    u_short ether_type;                 // 类型
};

struct sniff_ip
{                   // IP头
    u_char ip_vhl;  // 头部长度
    u_char ip_tos;  // 服务类型
    u_short ip_len; // 总长度
    u_short ip_id;
    u_short ip_off; // 偏移
    u_char ip_ttl;
    u_char ip_p; // 协议
    u_short ip_sum;
    struct in_addr ip_src;
    struct in_addr ip_dst; // 源、目的IP地址
};

struct sniff_udp
{
    u_short uh_sport; // 源端口
    u_short uh_dport;
    u_short uh_ulen;
    u_short uh_sum;
};

int count1 = 0;

std::map<std::tuple<uint32_t, uint32_t, uint8_t, uint16_t>, packet_info> ip_map;
std::map<std::tuple<uint32_t, uint32_t, uint8_t, uint16_t>, tcp_packet_info> tcp_map;

FILE *file = NULL;
char *file_type = NULL;
pcap_t *pcap = nullptr;
pcap_dumper_t *dumper = nullptr;

static int count1re = 0;
static bool first_time = true;

// 处理udp以及dns解析
void UDP_process(const u_char *packet)
{
    struct ether_header *eptr;
    struct ip *ip;
    struct udphdr *udp;
    const char *payload;
    int size_ip;
    int size_udp = 8;

    eptr = (struct ether_header *)packet;
    ip = (struct ip *)(packet + sizeof(struct ether_header));
    size_ip = ip->ip_hl * 4;
    udp = (struct udphdr *)(packet + sizeof(struct ether_header) + size_ip);
    payload = (const char *)(packet + sizeof(struct ether_header) + size_ip + size_udp);

    if (ntohs(eptr->ether_type) == 0x0800)
    {
        if (ip->ip_p == IPPROTO_UDP)
        {
            if (ntohs(udp->uh_sport) == 53 || ntohs(udp->uh_dport) == 53)
            {
                count1re++;

                // Get source and destination IP addresses as strings
                char source_ip_str[INET_ADDRSTRLEN];
                inet_ntop(AF_INET, &(ip->ip_src), source_ip_str, INET_ADDRSTRLEN);
                char dest_ip_str[INET_ADDRSTRLEN];
                inet_ntop(AF_INET, &(ip->ip_dst), dest_ip_str, INET_ADDRSTRLEN);

                // JSON document
                Document d;
                d.SetObject();
                Document::AllocatorType &allocator = d.GetAllocator();

                d.AddMember("number", count1re, allocator);
                d.AddMember("sourceIP", StringRef(source_ip_str), allocator);
                d.AddMember("destinationIP", StringRef(dest_ip_str), allocator);
                d.AddMember("sourcePort", ntohs(udp->uh_sport), allocator);
                d.AddMember("destinationPort", ntohs(udp->uh_dport), allocator);

                StringBuffer buffer;
                Writer<StringBuffer> writer(buffer);
                d.Accept(writer);

                // Determine file open mode
                std::fstream fs;
                if (first_time)
                {
                    fs.open("dns_records.json", std::fstream::out);
                    first_time = false;
                    fs << "[\n";
                }
                else
                {
                    fs.open("dns_records.json", std::fstream::in | std::fstream::out);
                    fs.seekp(-2, std::ios_base::end); // Move the file pointer to the position before the last ']'
                    fs << ",\n";
                }

                if (fs.is_open())
                {
                    fs << buffer.GetString() << "\n]";
                    fs.close();
                }
                else
                {
                    // perror("failed to open file");
                }
            }
        }
    }
}

// 打印tcp头部信息
void print_tcp_header_info(struct tcphdr *tcpptr)
{
    /*printf("\nTransmission Control Protocol(TCP):\n");
    printf("Source port: %d\n",ntohs(tcpptr->source));//源端口
    printf("Destination port: %d\n",ntohs(tcpptr->dest));//目的端口
    printf("Seq: %u\n",ntohs(tcpptr->seq));//确认号
    printf("Checksum: %#04x\n",tcpptr->check);//检验和*/
}

bool is_number_complete(std::map<unsigned int, TCPFragment> &fragments)
{
    if (fragments.empty())
    {
        // printf("Fragment map is empty.\n");
        return false;
    }

    unsigned int expected_seq = fragments.begin()->second.seq;
    int i = 0;

    // printf("开始检查...\n");
    for (const auto &fragment : fragments)
    {
        // printf("当前序列号(seq): %u\n", fragment.first);
        // printf("当前长度(len): %u\n", fragment.second.len);
        if (fragment.second.len == 0)
            continue;
        if (fragment.first != expected_seq)
        {
            // 如果不连续，可以打印调试信息
            // printf("序列号不匹配！期望：%u，实际上是：%u,差值%u\n", expected_seq, fragment.first,expected_seq-fragment.first);
            // 如果已经检查了足够的片段数量，可以终止循环
            // if(i>=5)break;
            return false;
        }

        expected_seq += fragment.second.len;
        // printf("更新期望序列号为：%u\n", expected_seq);

        i++;
    }
    // printf("检查完成.\n");
    return i >= 5; // 至少检查了5个片段
}

void write_in(const string &path, const std::vector<uint8_t> &reassembled_data)
{
    static bool isFirstCall = true;

    FILE *file;
    if (isFirstCall)
    {
        file = fopen(path.c_str(), "wb"); // 清空文件
        isFirstCall = false;              // 设置为非第一次调用
    }
    else
    {
        file = fopen(path.c_str(), "ab"); // 追加文件
    }

    if (file == NULL)
    {
        // printf("Failed to open file: %s\n", path.c_str());
        return;
    }

    fwrite(reassembled_data.data(), sizeof(uint8_t), reassembled_data.size(), file);
    fclose(file);
}

static int http_count = 0;
static bool http_first_time = true;

std::string findContentType(const std::string &headers)
{
    // std::cout << "All headers: " << headers << std::endl;

    // Open file for appending
    std::ofstream file("http_records.txt", std::ios::app);
    if (!file.is_open())
    {
        std::cerr << "Failed to open file 'http_records.txt'." << std::endl;
        return "";
    }
    // Write headers to file
    file << "All headers: " << headers << std::endl;

    // 查找 Content-Type 字段
    std::string contentTypeField = "Content-Type: ";
    std::size_t fieldIndex = headers.find(contentTypeField);
    if (fieldIndex == std::string::npos)
    {

        // 在 headers 中查找 ".png" 字符串
        std::size_t pngIndex = headers.find("png");
        if (pngIndex != std::string::npos)
        {
            return "png";
        }

        // 在 headers 中查找 ".jpg" 字符串
        std::size_t jpgIndex = headers.find("jpg");
        if (jpgIndex != std::string::npos)
        {
            return "jpg";
        }

        // 在 headers 中查找 ".png" 字符串
        std::size_t jpegIndex = headers.find("jpeg");
        if (jpegIndex != std::string::npos)
        {
            return "jpeg";
        }

        // 在 headers 中查找 ".jpg" 字符串
        std::size_t jsIndex = headers.find("javascript");
        if (jsIndex != std::string::npos)
        {
            return "js";
        }

        // 在 headers 中查找 ".png" 字符串
        std::size_t gifIndex = headers.find("gif");
        if (gifIndex != std::string::npos)
        {
            return "gif";
        }

        // 在 headers 中查找 ".jpg" 字符串
        std::size_t htmlIndex = headers.find("html");
        if (htmlIndex != std::string::npos)
        {
            return "html";
        }

        std::size_t wsdlIndex = headers.find("wsdl");
        if (wsdlIndex != std::string::npos)
        {
            return "wsdl";
        }

        file << "Content type: unknown" << std::endl
             << std::endl;
        file.close();
        return "unknown";
    }

    // JSON 文档
    Document d;
    d.SetObject();
    Document::AllocatorType &allocator = d.GetAllocator();

    // 添加 JSON 数据
    d.AddMember("number", ++http_count, allocator);
    d.AddMember("head", StringRef(headers.c_str()), allocator);

    StringBuffer buffer;
    Writer<StringBuffer> writer(buffer);
    d.Accept(writer);

    // 确定文件打开模式
    std::ofstream fs;
    if (http_first_time)
    {
        fs.open("http_records.json", std::fstream::out);
        if (!fs.is_open())
        {
            perror("打开文件失败");
            return "";
        }
        http_first_time = false;
        fs << "[\n";
    }
    else
    {
        fs.open("http_records.json", std::fstream::in | std::fstream::out);
        if (!fs.is_open())
        {
            perror("打开文件失败");
            return "";
        }
        fs.seekp(-2, std::ios_base::end); // 将文件指针移动到倒数第二个字符（']'之前）
        fs << ",\n";
    }

    if (fs.is_open())
    {
        fs << buffer.GetString() << "\n]";
        fs.close();
    }
    else
    {
        perror("打开文件失败");
    }

    fieldIndex += contentTypeField.size();
    std::size_t fieldEndIndex = headers.find("\r\n", fieldIndex);

    std::string contentType = headers.substr(fieldIndex, fieldEndIndex - fieldIndex);
    // std::cout << "Content type: " << contentType << std::endl;

    // 从 Content-Type 中取出'/'后的部分
    std::size_t slashIndex = contentType.find('/');
    std::string fileExtension = (slashIndex != std::string::npos) ? contentType.substr(slashIndex + 1) : "unknown";

    // 过滤出分号前的部分
    std::size_t semiColonIndex = fileExtension.find(';');
    if (semiColonIndex != std::string::npos)
    {
        fileExtension = fileExtension.substr(0, semiColonIndex);
    }

    return fileExtension;
}

std::string findFilename(const std::string &httpPacket)
{
    std::string contentTypeField = "Content-Disposition: ";
    std::size_t fieldIndex = httpPacket.find(contentTypeField);

    if (fieldIndex != std::string::npos)
    {
        fieldIndex += contentTypeField.size();
        std::size_t filenameIndex = httpPacket.find("filename=", fieldIndex);
        if (filenameIndex != std::string::npos)
        {
            filenameIndex += 9; // length of "filename="
            std::size_t fieldEndIndex = httpPacket.find("\r\n", fieldIndex);
            return httpPacket.substr(filenameIndex, fieldEndIndex - filenameIndex);
        }
    }
    num++;
    // 无法获取文件名，生成以数字命名的文件名
    return std::to_string(num);
}

std::string findFilenameFromFTPCommand(const std::string &ftpCommand)
{
    // 初始化文件名为空字符串
    std::string filename;

    // 找到第一个空格的位置
    size_t spacePos = ftpCommand.find(' ');

    // 如果找到空格，则文件名开始的位置是空格的下一个字符
    if (spacePos != std::string::npos)
    {
        filename = ftpCommand.substr(spacePos + 1);

        // 去除文件名中的路径信息，只保留文件名部分
        size_t lastSlashPos = filename.find_last_of('/');
        if (lastSlashPos != std::string::npos)
        {
            filename = filename.substr(lastSlashPos + 1);
        }

        // 去除文件名中可能存在的双引号（FTP命令中有时会包含双引号）
        size_t firstQuotePos = filename.find_first_of('"');
        size_t lastQuotePos = filename.find_last_of('"');
        if (firstQuotePos != std::string::npos && lastQuotePos != std::string::npos && firstQuotePos < lastQuotePos)
        {
            filename = filename.substr(firstQuotePos + 1, lastQuotePos - firstQuotePos - 1);
        }
    }

    return filename;
}

std::string getFileTypeFromContent(const std::string &filePath)
{
    std::ifstream file(filePath, std::ios::binary);
    if (!file.is_open())
    {
        return "unknown";
    }

    // 读取文件的前几个字节
    char buffer[8];
    file.read(buffer, sizeof(buffer));

    // 根据文件头部内容推断文件类型
    if (file.gcount() >= 4 && buffer[0] == '\x89' && buffer[1] == 'P' && buffer[2] == 'N' && buffer[3] == 'G')
    {
        return "image/png";
    }
    else if (file.gcount() >= 2 && buffer[0] == '\xFF' && buffer[1] == '\xD8')
    {
        return "image/jpeg";
    }
    else if (file.gcount() >= 4 && buffer[0] == '%' && buffer[1] == 'P' && buffer[2] == 'D' && buffer[3] == 'F')
    {
        return "application/pdf";
    }
    else
    {
        return "application/octet-stream"; // 默认类型，未知类型或二进制数据
    }
}

// http和ftp解析
void http_ftp_decode(struct tcp_packet_info &info, const struct tcphdr *tcp_header, const std::vector<uint8_t> &reassembled_data)
{
    // printf("decode called\n");

    if (ntohs(tcp_header->source) == 80 || ntohs(tcp_header->dest) == 80 || ntohs(tcp_header->dest) == 443 ||
        ntohs(tcp_header->source) == 443 || ntohs(tcp_header->source) == 8080 || ntohs(tcp_header->dest) == 8080)
    {
        // 找到HTTP头部与体的界限
        auto it_body_start = std::search(reassembled_data.begin(), reassembled_data.end(),
                                         "\r\n\r\n", "\r\n\r\n" + 4);

        // 头部与体是否完整
        if (it_body_start == reassembled_data.end())
        {
            // printf("Headers not found or incomplete body\n");
            return;
        }
        // 将HTTP头部转化为string进行处理
        std::string httpHeader(reassembled_data.begin(), it_body_start);
        std::vector<uint8_t> bodyData(it_body_start + 4, reassembled_data.end());

        info.app = "HTTP";

        // 调用修改后的 findContentType，它现在返回文件扩展名
        std::string fileExtension = findContentType(httpHeader);
        std::string filename = findFilename(httpHeader);
        if (fileExtension == "javascript")
        {
            fileExtension = "js";
        }
        info.path = pathway + filename + "." + fileExtension;

        // printf("文件名称：%s\n", info.path.c_str());
        if (!bodyData.empty() && !info.path.empty())
        {
            std::ofstream output(info.path, std::ios::binary);
            std::copy(bodyData.begin(), bodyData.end(), std::ostreambuf_iterator<char>(output));
            /*
            std::ofstream file("http_records.txt", std::ios::app);
            if (!file.is_open()) {
                std::cerr << "Failed to open file 'http_records.txt'." << std::endl;
                return;
            }
            // Write headers to file
            file << "All headers: " <<  std::endl;
            file.close();
        */
            // 生成文件后修改文件权限为644
            std::string command = "chmod 777 " + info.path;
            system(command.c_str());
        }
        applicationlayerextraction = true;
    }
    else if (ntohs(tcp_header->source) == 21 || ntohs(tcp_header->dest) == 21 || ntohs(tcp_header->dest) == 20 || ntohs(tcp_header->source) == 20)
    {
        // FTP处理逻辑
        info.app = "FTP";
        // printf("FTP decode called!\n");

        // 判断是否为FTP数据包（源端口或目标端口为20或21）
        if (ntohs(tcp_header->source) == 21 || ntohs(tcp_header->dest) == 21 || ntohs(tcp_header->dest) == 20 || ntohs(tcp_header->source) == 20)
        {
            // 查找FTP命令和响应的边界
            auto it_end_of_command = std::search(reassembled_data.begin(), reassembled_data.end(),
                                                 "\r\n", "\r\n" + 2);

            // 检查命令和响应是否完整
            if (it_end_of_command == reassembled_data.end())
            {
                // printf("FTP command not found or incomplete\n");
                return;
            }

            std::string ftpCommand(reassembled_data.begin(), it_end_of_command);

            // 根据FTP命令判断是文件传输命令还是其他命令
            if (ftpCommand.substr(0, 4) == "STOR" || ftpCommand.substr(0, 4) == "RETR")
            {
                // 查找文件名
                std::string filename = findFilenameFromFTPCommand(ftpCommand);

                // 获取文件数据（从命令结束到数据末尾）
                std::vector<uint8_t> fileData(it_end_of_command + 2, reassembled_data.end());

                // 确定文件路径
                info.path = pathway + filename; // 替换为实际存储文件的路径

                // printf("文件名称：%s\n", info.path.c_str());

                // 写入文件
                if (!fileData.empty() && !info.path.empty())
                {
                    std::ofstream output(info.path, std::ios::binary);
                    std::copy(fileData.begin(), fileData.end(), std::ostreambuf_iterator<char>(output));

                    // 修改文件权限为777（示例中使用777，请根据实际需求调整）
                    std::string command = "chmod 777 " + info.path;
                    system(command.c_str());

                    // 获取文件类型（MIME 类型）
                    std::string fileType = getFileTypeFromContent(info.path);
                    // printf("文件类型：%s\n", fileType.c_str());

                    // 这里可以根据 fileType 进行进一步的处理，例如记录到日志文件中
                }
            }
            else if (ftpCommand.substr(0, 4) == "LIST" || ftpCommand.substr(0, 4) == "NLST")
            {
                // 处理列出文件列表的逻辑
                // printf("FTP LIST or NLST command received\n");

                // 可以在这里获取列表数据，或者处理其他相关逻辑
            }
            else if (ftpCommand.substr(0, 4) == "PASS" || ftpCommand.substr(0, 4) == "USER")
            {
                // 处理用户身份验证相关的逻辑
                // printf("FTP USER or PASS command received\n");

                // 可以在这里处理用户登录认证的逻辑
            }
            else
            {
                // 其他FTP命令的处理逻辑
                // printf("Unsupported FTP command received\n");
                // std::cout << "First four characters of ftpCommand: " << ftpCommand.substr(0, 4) << std::endl;
            }

            applicationlayerextraction = true;
        }
    }

    info.is_first = true;
}

void TCP_reassembly(struct tcphdr *tcpptr, const uint8_t *packet)
{
    struct ether_header *eptr;
    struct iphdr *ip_header;

    eptr = (struct ether_header *)packet;
    ip_header = (struct iphdr *)(packet + sizeof(struct ether_header));

    const struct tcphdr *tcp_header = (struct tcphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));

    uint16_t src_port = ntohs(tcp_header->source);
    if (src_port == 20)
        src_port++;
    uint16_t dst_port = ntohs(tcp_header->dest);
    if (dst_port == 20)
        dst_port++;
    uint16_t ip_header_len = ip_header->ihl * 4;
    uint16_t tcp_header_len = tcp_header->doff * 4;
    uint16_t len = ntohs(ip_header->tot_len) - ip_header_len - tcp_header_len;

    // 检查长度是否合理
    if (len > 65535 - sizeof(struct tcphdr))
    {
        // 重新计算实际数据长度
        uint16_t packet_len = 0;

        // 计算整个包的长度
        while (packet[packet_len] != '\0')
        {
            packet_len++;
        }
        uint16_t actual_data_len = packet_len - sizeof(struct ether_header) - ip_header_len - tcp_header_len;

        // 更新 len 为实际数据长度
        len = actual_data_len;

        // 检查重新赋值后的 len 是否仍然大于 65535
        if (len > 65535 - sizeof(struct tcphdr))
        {
            // printf("TCP data length too large: %u\n", len);
            return;
        }
    }

    const uint8_t *data = packet + sizeof(struct ether_header) + ip_header_len + tcp_header_len;

    auto key = std::make_tuple(ip_header->saddr, ip_header->daddr, tcp_header->source, tcp_header->dest);
    // std::cout << "Key: " << std::get<0>(key) << " " << std::get<1>(key) << " " << std::get<2>(key) << " " << std::get<3>(key) << std::endl;

    if (tcp_header->syn)
    {
        auto &info = tcp_map[key];
        info.is_syn = 1;
        info.seqn = ntohl(tcpptr->seq) + 1;
        info.is_first = false;
        if (ntohs(tcp_header->source) == 21 || ntohs(tcp_header->dest) == 21)
        {
            char *data = (char *)(packet + 14 + ip_header->ihl * 4 + tcp_header->doff * 4);
            uint16_t data_length = ntohs(ip_header->tot_len) - ip_header_len - tcp_header_len;

            if (data_length > 5 && strncmp(data, "TYPE ", 5) == 0)
            {
                if (data[5] == 'A')
                {
                    file_type = "txt";
                }
                else if (data[5] == 'I')
                {
                    file_type = "bin";
                }
            }
            info.is_first = true;
        }
        return;
    }
    else
    {
        auto it = tcp_map.find(key);
        if (it != tcp_map.end())
        {
            uint32_t seq = ntohl(tcp_header->seq);

            if (len > 65535 - sizeof(struct tcphdr))
            {
                // printf("TCP data length too large: %u\n", len);
                return;
            }

            TCPFragment fragment = {seq, len, std::vector<uint8_t>(data, data + len)};

            tcp_packet_info &info = it->second;
            if (tcp_header->fin != 1)
                info.fragments[seq] = fragment;

            if ((tcp_header->fin || is_number_complete(info.fragments)) && info.seqn == info.fragments.begin()->second.seq)
            {
                std::vector<unsigned char> data_vector;
                if (tcp_header->fin != 1)
                {
                    int count = 0;
                    for (auto it = info.fragments.begin(); it != info.fragments.end() && count < 5; ++it)
                    {
                        data_vector.insert(data_vector.end(), it->second.data.begin(), it->second.data.end());
                        count++;
                    }
                }
                else
                {
                    for (auto it = info.fragments.begin(); it != info.fragments.end(); ++it)
                    {
                        data_vector.insert(data_vector.end(), it->second.data.begin(), it->second.data.end());
                    }
                }

                if (!info.is_first)
                {
                    http_ftp_decode(info, tcp_header, data_vector);
                }
                else
                {
                    if (ntohs(tcp_header->source) == 20 || ntohs(tcp_header->dest) == 20)
                    {
                        // printf("start\n");
                        char filename[20];
                        sprintf(filename, "output.%s", "bin"); // 使用实际的文件类型
                        FILE *file = fopen(filename, "wb");
                        if (file == NULL)
                        {
                            fprintf(stderr, "Couldn't open output file\n");
                            return;
                        }
                        char *data = (char *)(packet + 14 + ip_header->ihl * 4 + tcp_header->doff * 4);
                        uint16_t data_length = ntohs(ip_header->tot_len) - ip_header_len - tcp_header_len;

                        fwrite(data, 1, data_length, file);
                    }
                    std::string filename1 = "ftp.txt";
                    info.path = pathway + filename1;
                    write_in(info.path, data_vector);
                }

                // 使用RapidJSON将数据写入ftp.json
                static bool first_time = true;

                Document d;
                d.SetObject();
                Document::AllocatorType &allocator = d.GetAllocator();

                Value data_array(kArrayType);
                for (auto &byte : data_vector)
                {
                    data_array.PushBack(byte, allocator);
                }
                d.AddMember("data", data_array, allocator);

                StringBuffer buffer;
                Writer<StringBuffer> writer(buffer);
                d.Accept(writer);

                std::fstream fs;
                if (first_time)
                {
                    fs.open("ftp.json", std::fstream::out);
                    first_time = false;
                    fs << "[\n";
                }
                else
                {
                    fs.open("ftp.json", std::fstream::in | std::fstream::out);
                    fs.seekp(-2, std::ios_base::end); // 移动文件指针到最后一个']'之前的位置
                    fs << ",\n";
                }

                if (fs.is_open())
                {
                    fs << buffer.GetString() << "\n]";
                    fs.close();
                }
                else
                {
                    perror("failed to open file");
                }

                if (info.fragments.size() >= 5)
                {
                    auto it = info.fragments.begin();
                    std::advance(it, 4);
                    info.seqn = it->second.seq + it->second.len;
                }
                if (tcp_header->fin != 1)
                {
                    auto it = info.fragments.begin();
                    std::advance(it, 5);
                    info.fragments.erase(info.fragments.begin(), it);
                }
                else
                {
                    info.fragments.clear();
                    // std::cout << "over\n";
                }
            }
        }
    }
}

bool is_fragments_complete(std::map<unsigned int, Fragment> &fragments)
{
    unsigned int expected_offset = 0;
    for (const auto &fragment : fragments)
    {
        if (fragment.first != expected_offset)
        {
            // printf("--分片顺序不正确--\n");
            return false;
        }
        expected_offset += fragment.second.len;
    }
    // printf("--所有分片都已经到达--\n");
    return true;
}

// 处理 ICMP 报文的函数
void process_icmp_packet(const unsigned char *packet)
{
    // 假设ICMP头部紧跟在IP头部后面
    struct iphdr *ip_header = (struct iphdr *)(packet + sizeof(struct ether_header));
    struct icmphdr *icmp_header = (struct icmphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));

    // 打印 IP 头部信息
    char src_ip[INET_ADDRSTRLEN];
    char dest_ip[INET_ADDRSTRLEN];
    inet_ntop(AF_INET, &(ip_header->saddr), src_ip, INET_ADDRSTRLEN);
    inet_ntop(AF_INET, &(ip_header->daddr), dest_ip, INET_ADDRSTRLEN);

    // printf("Source IP: %s\n", src_ip);
    // printf("Destination IP: %s\n", dest_ip);

    // 打印 ICMP 头部信息
    // printf("ICMP Type: %d\n", icmp_header->type);
    // printf("ICMP Code: %d\n", icmp_header->code);
    // printf("ICMP Checksum: %d\n", ntohs(icmp_header->checksum));

    // 打印更多的 ICMP 报文信息
    switch (icmp_header->type)
    {
    case ICMP_ECHO:
    case ICMP_ECHOREPLY:
        // printf("ICMP Identifier: %d\n", ntohs(icmp_header->un.echo.id));
        // printf("ICMP Sequence Number: %d\n", ntohs(icmp_header->un.echo.sequence));
        break;
    case ICMP_DEST_UNREACH:
        // printf("ICMP Destination Unreachable\n");
        break;
    case ICMP_REDIRECT:
        // printf("ICMP Redirect\n");
        // printf("Gateway IP: %s\n", inet_ntoa(*(struct in_addr *)&icmp_header->un.gateway));
        break;
    case ICMP_TIME_EXCEEDED:
        // printf("ICMP Time Exceeded\n");
        break;
    case ICMP_PARAMETERPROB:
        // printf("ICMP Parameter Problem\n");
        // printf("Pointer: %d\n", icmp_header->un.gateway);
        break;
    case ICMP_TIMESTAMP:
    case ICMP_TIMESTAMPREPLY:
    {
        const unsigned char *timestamp_data = (packet + sizeof(struct ether_header) + sizeof(struct iphdr) + sizeof(struct icmphdr));
        uint32_t originate_timestamp = ntohl(*(uint32_t *)(timestamp_data));
        uint32_t receive_timestamp = ntohl(*(uint32_t *)(timestamp_data + 4));
        uint32_t transmit_timestamp = ntohl(*(uint32_t *)(timestamp_data + 8));
        // printf("Originate Timestamp: %u\n", originate_timestamp);
        // printf("Receive Timestamp: %u\n", receive_timestamp);
        // printf("Transmit Timestamp: %u\n", transmit_timestamp);
        break;
    }
    case ICMP_INFO_REQUEST:
    case ICMP_INFO_REPLY:
        // printf("ICMP Info Request/Reply\n");
        break;
    default:
        // printf("ICMP Other Type: %d\n", icmp_header->type);
        break;
    }

    // printf("\n");
}

void ip_reassembly(struct iphdr *ipptr, const u_char *packet)
{
    // 获取IP头部信息
    struct iphdr *ip_header = ipptr;
    // 构造用于标识IP分片重组的唯一键
    auto key = std::make_tuple(ip_header->saddr, ip_header->daddr, ip_header->protocol, ip_header->id);
    // 获取或创建与键关联的IP信息结构体引用
    auto &info = ip_map[key];
    // 计算IP分片的偏移量和长度
    uint16_t offset = (ntohs(ip_header->frag_off) & 0x1fff) * 8;
    uint16_t len = ntohs(ip_header->tot_len) - ip_header->ihl * 4;

    // 检查分片长度是否合理
    if (len > 65535)
    {
        // printf("IP fragment length too large: %u\n", len);
        return;
    }

    // 计算数据指针，指向分片数据的起始位置
    const uint8_t *data = packet + 14 + ip_header->ihl * 4;

    // 将分片信息存储到info结构体中的fragments映射中
    info.fragments[offset] = {ip_header->id, offset, len, std::vector<uint8_t>(data, data + len)};

    // 标记重组状态为未完成
    info.reassembled = false;

    // 检查是否是最后一个分片
    if ((ntohs(ip_header->frag_off) & 0x2000) == 0x0000)
    {
        info.reassembled = true; // 如果不是分片，标记重组状态为已完成
    }

    // 如果已经重组完成并且所有分片已经到齐
    if (info.reassembled && is_fragments_complete(info.fragments))
    {
        // 开始重组数据包
        std::vector<uint8_t> reassembled_data;

        // 将所有分片的数据按顺序拼接到reassembled_data中
        for (auto &fragment : info.fragments)
        {
            reassembled_data.insert(reassembled_data.end(), fragment.second.data.begin(), fragment.second.data.end());
        }

        // 清空分片信息
        info.fragments.clear();

        // 检查重组后的数据长度是否合理
        if (reassembled_data.size() > 65535)
        {
            // printf("Reassembled data length too large: %zu\n", reassembled_data.size());
            return;
        }
        // 构造新的数据包
        struct ether_header *eptr = (struct ether_header *)packet;
        struct iphdr *ipptr1 = (struct iphdr *)(packet + 14);
        struct pcap_pkthdr header;

        // 设置新数据包的捕获长度和实际长度
        header.caplen = reassembled_data.size() + 14 + 20; // 14是以太网头长度，20是TCP/UDP头长度
        header.len = header.caplen;

        // 设置时间戳
        struct timeval tv;
        gettimeofday(&tv, NULL);
        header.ts = tv;

        // 更新IP数据包头部信息
        ipptr1->tot_len = htons(reassembled_data.size() + 20); // 更新总长度，加上20字节的IP头长度
        ipptr1->frag_off = 0;                                  // 清除分片偏移和标志位

        // 构造新的数据包内容
        std::vector<u_char> new_packet;
        new_packet.insert(new_packet.end(), (u_char *)eptr, (u_char *)eptr + sizeof(ether_header)); // 添加以太网头部
        new_packet.insert(new_packet.end(), (u_char *)ipptr1, (u_char *)ipptr1 + ipptr1->ihl * 4);  // 添加IP头部
        new_packet.insert(new_packet.end(), reassembled_data.begin(), reassembled_data.end());      // 添加重组后的数据
        // 根据协议类型处理新的数据包
        switch (ip_header->protocol)
        {
        case IPPROTO_TCP:
        {
            struct tcphdr *tcpptr = (struct tcphdr *)(new_packet.data() + 14 + ip_header->ihl * 4); // 假设TCP头部紧跟在IP头部后面
            TCP_reassembly(tcpptr, new_packet.data());                                              // 调用TCP重组函数处理TCP数据包
            break;
        }
        case IPPROTO_UDP:
        {
            UDP_process(new_packet.data()); // 处理UDP数据包
            break;
        }
        case IPPROTO_ICMP:
        {
            // printf("\nICMP packet detected\n");
            process_icmp_packet(packet); // 调用 ICMP 处理函数
            break;
        }
        default:
            break;
        }
        // 清理工作
        reassembled_data.clear(); // 清空重组后的数据
        ip_map.erase(key);        // 从映射中移除已处理完成的IP信息
    }
}

bool ip_check(struct iphdr *ipptr, const u_char *packet)
{
    struct in_addr addr;
    char *c;
    c = (char *)(ipptr);

    /*printf("\n协议:\n");
    printf("版本号: %d\n",ipptr->version);
    printf("头部长度: %d\n",ipptr->ihl);
    printf("总长度: %d\n",ntohs(ipptr->tot_len));
    printf("认证: %#04x\n",ipptr->id);*/
    c += 6;
    // printf("Flags: 0x%02x%02x", (*c), (*(c + 1))); // 分片标志位DF，MF
    if ((*c) == 0x40 && (*(c + 1)) == 0x00)
    {
        // printf(" 无分片\n");
        return true;
    }
    else
    { // printf(" 存在分片，进行分片处理\n");
        ipreassembly = true;
        ip_reassembly(ipptr, packet);

        return false;
    }
}

void flow_analyze(u_char *user, const struct pcap_pkthdr *pkthdr, const u_char *packet)
{
    int j, *id;
    struct ether_header *eptr;
    struct iphdr *ipptr;
    struct tcphdr *tcpptr;
    struct udphdr *udpptr;
    struct icmp *icmpptr; // ICMP 头部结构体指针

    j = 0, id = (int *)user;
    // printf("id: %d\n", ++(*id));

    PacketStats *stats = reinterpret_cast<PacketStats *>(user);
    stats->total_packets++;
    stats->total_bytes += pkthdr->len;

    // 解析以太网帧头部
    struct ether_header *eth_header = (struct ether_header *)packet;
    if (ntohs(eth_header->ether_type) == ETHERTYPE_IP)
    {
        // 解析IP头部
        struct iphdr *ip_header = (struct iphdr *)(packet + sizeof(struct ether_header));

        // 根据IP协议类型进行进一步处理
        switch (ip_header->protocol)
        {
        case IPPROTO_TCP:
        {
            // TCP协议
            stats->tcp_packets++;
            stats->tcp_bytes += pkthdr->len;

            // 进一步检查是否为HTTP或FTP流量
            struct tcphdr *tcp_header = (struct tcphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
            u_char *payload = (u_char *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr) + tcp_header->doff * 4);

            // HTTP流量判断
            if (ntohs(tcp_header->dest) == 80 || ntohs(tcp_header->source) == 80)
            {
                stats->http_packets++;
                stats->http_bytes += pkthdr->len;
            }
            // FTP流量判断
            else if (ntohs(tcp_header->dest) == 21 || ntohs(tcp_header->source) == 21)
            {
                stats->ftp_packets++;
                stats->ftp_bytes += pkthdr->len;
            }

            break;
        }
        case IPPROTO_UDP:
        {
            // UDP协议
            stats->udp_packets++;
            stats->udp_bytes += pkthdr->len;

            // 进一步检查是否为DNS流量
            struct udphdr *udp_header = (struct udphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
            u_char *payload = (u_char *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr) + sizeof(struct udphdr));

            // DNS流量判断
            if (ntohs(udp_header->dest) == 53 || ntohs(udp_header->source) == 53)
            {
                stats->dns_packets++;
                stats->dns_bytes += pkthdr->len;
            }

            break;
        }
        case IPPROTO_ICMP:
        {

            // ICMP协议
            stats->icmp_packets++;
            stats->icmp_bytes += pkthdr->len;
            // 解析 ICMP 头部
            struct icmphdr *icmp_header = (struct icmphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
            // icmp process
            break;
        }
        default:
            // 其他协议，暂不处理
            break;
        }
    }

    // 获取以太网帧头部
    eptr = (struct ether_header *)packet;
    j += 14; // 以太网帧头部通常是14个字节

    // 检查以太网帧类型是否为IP
    if (ntohs(eptr->ether_type) == ETHERTYPE_IP)
    {
        // 获取IP数据包头部
        ipptr = (struct iphdr *)(packet + sizeof(struct ether_header));
        ip_check(ipptr, packet); // 调用ip_check函数处理IP包
    }

    j += ipptr->ihl; // 将IP包头部长度添加到计数器j中

    // 根据IP包的协议字段处理TCP或UDP数据包
    if (ipptr->protocol == 6)
    {
        // 获取TCP数据包头部
        tcpptr = (struct tcphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
        print_tcp_header_info(tcpptr);  // 调用print_tcp_header_info函数打印TCP头部信息
        TCP_reassembly(tcpptr, packet); // 调用TCP_reassembly函数进行TCP数据包重组
        j += 20;                        // TCP头部长度为20字节
    }
    else if (ipptr->protocol == 17)
    {
        // 获取UDP数据包头部
        udpptr = (struct udphdr *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
        UDP_process(packet); // 调用process_packet函数处理UDP数据包
        j += 8;              // UDP头部长度为8字节
    }
    else if (ipptr->protocol == 1)
    {
        icmpptr = (struct icmp *)(packet + sizeof(struct ether_header) + sizeof(struct iphdr));
        // 处理 ICMP 报文
        // printf("ICMP Type: %d\n", icmpptr->icmp_type);
        // printf("ICMP Code: %d\n", icmpptr->icmp_code);
        // 这里可以添加进一步处理逻辑，例如根据 icmp_type 和 icmp_code 进行不同的处理
        j += 8; // UDP头部长度为8字节
    }
    else
    {
        // printf("not TCP/UDP/ICMP protocol\n");
    }
}

void alive_process()
{
    char *device;
    char errBuf[PCAP_ERRBUF_SIZE];
    pcap_t *pcap;
    pcap_dumper_t *dumper;
    pcap_t *head;
    int id;

    // 打开一个空的pcap文件
    pcap = pcap_open_dead(DLT_EN10MB, 65535);
    if (!pcap)
    {
        fprintf(stderr, "pcap_open_dead() failed: %s\n", errBuf);
        return; // 如果打开失败，直接返回
    }

    // 创建一个pcap文件的dumper对象，用于将捕获的数据包写入到文件中
    dumper = pcap_dump_open(pcap, "./1.pcap");
    if (!dumper)
    {
        fprintf(stderr, "pcap_dump_open() failed: %s\n", pcap_geterr(pcap));
        pcap_close(pcap); // 关闭pcap文件描述符
        return;           // 如果创建失败，直接返回
    }

    // 查找本地网络接口设备
    device = pcap_lookupdev(errBuf);
    if (!device)
    {
        fprintf(stderr, "pcap_lookupdev() failed: %s\n", errBuf);
        pcap_dump_close(dumper); // 关闭dumper对象
        pcap_close(pcap);        // 关闭pcap文件描述符
        return;                  // 如果查找失败，直接返回
    }

    // 打开指定网络接口设备进行数据包捕获
    head = pcap_open_live(device, 65535, 0, 0, errBuf);
    if (!head)
    {
        fprintf(stderr, "pcap_open_live() failed: %s\n", errBuf);
        pcap_dump_close(dumper); // 关闭dumper对象
        pcap_close(pcap);        // 关闭pcap文件描述符
        return;                  // 如果打开失败，直接返回
    }

    // printf("开启成功!\n");

    // 循环捕获数据包并写入到pcap文件
    // 创建PacketStats结构体实例，用于统计
    PacketStats stats;

    // pcap_loop(head, -1, flow_analyze, (u_char *)dumper);
    // pcap_loop(head, -1, flow_analyze, reinterpret_cast<u_char *>(&stats));

    // 捕获数据包并写入到pcap文件
    struct pcap_pkthdr packet;
    const u_char *packetflag = pcap_next(head, &packet);

    if (packetflag)
    {
        // printf("捕获成功.\n");
        id = 0;
        // 将捕获的数据包写入pcap文件
        pcap_dump((u_char *)dumper, &packet, packetflag);
        // 循环捕获数据包并调用flow_analyze函数处理，直到捕获到结束信号
        pcap_loop(head, -1, flow_analyze, reinterpret_cast<u_char *>(&stats));
    }
    else
    {
        // printf("捕获失败 %s\n", errBuf);
    }

    // 关闭pcap相关资源
    pcap_close(head);
    pcap_dump_close(dumper);
    pcap_close(pcap);
}

std::string parseIPAddress(const u_char *data)
{
    return std::to_string(data[0]) + "." +
           std::to_string(data[1]) + "." +
           std::to_string(data[2]) + "." +
           std::to_string(data[3]);
}

std::string formatTimeISO8601(struct timeval ts)
{
    char buffer[32];
    struct tm *ptm = gmtime(&ts.tv_sec);
    strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S", ptm);
    snprintf(buffer + strlen(buffer), sizeof(buffer) - strlen(buffer), ".%06ldZ", ts.tv_usec);
    return std::string(buffer);
}

// 从JSON文件中读取内容并返回为Document对象
Document ReadJsonFile(const std::string &filePath)
{
    std::ifstream ifs(filePath);
    if (!ifs.is_open())
    {
        throw std::runtime_error("无法打开文件: " + filePath);
    }
    IStreamWrapper isw(ifs);
    Document d;
    d.ParseStream(isw);
    if (d.HasParseError())
    {
        throw std::runtime_error("解析JSON文件失败: " + filePath);
    }
    return d;
}

void offline_process(char *name)
{
    char errbuf[PCAP_ERRBUF_SIZE];
    const char *prefix = "./";
    size_t len = strlen(prefix) + strlen(name) + 1;
    char *filename = (char *)malloc(len);
    if (filename == NULL)
    {
        fprintf(stderr, "Memory allocation error\n");
        return;
    }
    strcpy(filename, prefix);
    strcat(filename, name);

    pcap_t *handle;
    int id = 0;
    PacketStats stats;

    handle = pcap_open_offline(filename, errbuf);
    if (handle == NULL)
    {
        fprintf(stderr, "Couldn't open pcap file %s: %s\n", filename, errbuf);
        return;
    }

    struct pcap_pkthdr *header;
    const u_char *packet;
    int res;

    time_t start_time, end_time;
    while ((res = pcap_next_ex(handle, &header, &packet)) >= 0)
    {
        if (res == 0)
            continue;

        struct timeval ts = header->ts;
        start_time = ts.tv_sec;
        end_time = start_time + ts.tv_usec / 1000000;

        // 打印或者使用开始时间和结束时间
        // printf("Packet start time: %s", ctime(&start_time));
        // printf("Packet end time: %s", ctime(&end_time));
    }

    handle = pcap_open_offline(filename, errbuf);
    if (handle == NULL)
    {
        fprintf(stderr, "Couldn't open pcap file %s: %s\n", filename, errbuf);
        return;
    }

    if (pcap_loop(handle, 0, flow_analyze, reinterpret_cast<u_char *>(&stats)) < 0)
    {
        fprintf(stderr, "\npcap_loop() failed: %s\n", pcap_geterr(handle));
        return;
    }

    /*printf("\nsuccessful process\n");
    printf("\nTotal packets: %d\n", stats.total_packets / 2);
    printf("Total bytes: %d\n", stats.total_bytes);
    printf("TCP packets: %d\n", stats.tcp_packets);
    printf("TCP bytes: %d\n", stats.tcp_bytes);
    printf("UDP packets: %d\n", stats.udp_packets);
    printf("UDP bytes: %d\n", stats.udp_bytes);
    printf("HTTP packets: %d\n", stats.http_packets);
    printf("HTTP bytes: %d\n", stats.http_bytes);
    printf("FTP packets: %d\n", stats.ftp_packets);
    printf("FTP bytes: %d\n", stats.ftp_bytes);
    printf("DNS packets: %d\n", stats.dns_packets);
    printf("DNS bytes: %d\n", stats.dns_bytes);
    printf("ICMP packets: %d\n", stats.icmp_packets);
    printf("ICMP bytes: %d\n", stats.icmp_bytes);
*/
    pcap_close(handle);

    Document document;
    document.SetObject();
    Document::AllocatorType &allocator = document.GetAllocator();

    Value statisticsobject(kObjectType);
    statisticsobject.AddMember("total_packets", stats.total_packets / 2, allocator);
    statisticsobject.AddMember("total_bytes", stats.total_bytes, allocator);
    Value protocolanalysis(kObjectType);
    Value tcpobject(kObjectType);
    tcpobject.AddMember("totalPackets", stats.tcp_packets, allocator);
    tcpobject.AddMember("totalBytes", stats.tcp_bytes, allocator);
    Value udpobject(kObjectType);
    udpobject.AddMember("totalPackets", stats.udp_packets, allocator);
    udpobject.AddMember("totalBytes", stats.udp_bytes, allocator);
    Value httpobject(kObjectType);
    httpobject.AddMember("totalPackets", stats.http_packets, allocator);
    httpobject.AddMember("totalBytes", stats.http_bytes, allocator);
    Value ftpobject(kObjectType);
    ftpobject.AddMember("totalPackets", stats.ftp_packets, allocator);
    ftpobject.AddMember("totalBytes", stats.ftp_bytes, allocator);
    Value dnsobject(kObjectType);
    dnsobject.AddMember("totalPackets", stats.dns_packets, allocator);
    dnsobject.AddMember("totalBytes", stats.dns_bytes, allocator);
    Value icmpobject(kObjectType);
    icmpobject.AddMember("totalPackets", stats.icmp_packets, allocator);
    icmpobject.AddMember("totalBytes", stats.icmp_bytes, allocator);

    protocolanalysis.AddMember("tcp", tcpobject, allocator);
    protocolanalysis.AddMember("udp", udpobject, allocator);
    protocolanalysis.AddMember("http", httpobject, allocator);
    protocolanalysis.AddMember("ftp", ftpobject, allocator);
    protocolanalysis.AddMember("dns", dnsobject, allocator);
    protocolanalysis.AddMember("icmp", icmpobject, allocator);
    statisticsobject.AddMember("protocolAnalysis", protocolanalysis, allocator);

    Value processedResultsobject(kObjectType);
    processedResultsobject.AddMember("ipReassembly", ipreassembly, allocator);
    processedResultsobject.AddMember("tcpStreamReassembly", tcpstreamreassembly, allocator);
    processedResultsobject.AddMember("applicationLayerExtraction", applicationlayerextraction, allocator);
    processedResultsobject.AddMember("storedInDatabase", storedInDatabase, allocator);

    std::string start_time_str = formatTimeISO8601(header->ts);
    std::string end_time_str = formatTimeISO8601(header->ts);

    document.AddMember("startTime", rapidjson::Value(start_time_str.c_str(), allocator).Move(), allocator);
    document.AddMember("endTime", rapidjson::Value(end_time_str.c_str(), allocator).Move(), allocator);

    document.AddMember("processedResults", processedResultsobject, allocator);
    document.AddMember("statistics", statisticsobject, allocator);

    // 读取并添加DNS记录
    Document dnsRecords = ReadJsonFile("dns_records.json");
    document.AddMember("DNS", dnsRecords, allocator);

    // 读取并添加HTTP记录
    Document httpRecords = ReadJsonFile("http_records.json");
    document.AddMember("HTTP", httpRecords, allocator);

    // Read ftp.txt content
    ifstream ifs("ftp.txt");
    if (!ifs)
    {
        cerr << "Failed to open ftp.txt for reading\n";
        return;
    }

    string ftpContent((istreambuf_iterator<char>(ifs)),
                      (istreambuf_iterator<char>()));

    // Add ftpContent to the JSON document
    Value ftpContentValue;
    ftpContentValue.SetString(ftpContent.c_str(), static_cast<SizeType>(ftpContent.length()), allocator);
    document.AddMember("FTP", ftpContentValue, allocator);

    Value packages(kArrayType);
    Value restoredFiles(kArrayType);
    std::string message;
    handle = pcap_open_offline(filename, errbuf);
    if (handle == NULL)
    {
        fprintf(stderr, "Couldn't open pcap file %s: %s\n", filename, errbuf);
        return;
    }

    while ((res = pcap_next_ex(handle, &header, &packet)) >= 0)
    {
        if (res == 0)
            continue;

        FlowTuple flow;
        const u_char *ip_header = packet + 14;

        std::string sourceIP = parseIPAddress(ip_header + 12);
        std::string destinationIP = parseIPAddress(ip_header + 16);

        const u_char *tcp_header = ip_header + ((ip_header[0] & 0x0F) * 4);
        int sourcePort = ntohs(*(const u_int16_t *)(tcp_header));
        int destinationPort = ntohs(*(const u_int16_t *)(tcp_header + 2));

        std::string protocol;
        const struct ip *ip_header1 = (struct ip *)(packet + 14);
        if (ip_header1->ip_p == IPPROTO_TCP)
        {
            protocol = "TCP";
            // TCP header starts after IP header
            const struct tcphdr *tcp_header1 = (struct tcphdr *)(packet + 14 + ip_header1->ip_hl * 4);
            int tcp_header_length = tcp_header1->doff * 4;

            // Calculate offset to TCP payload (after TCP header)
            const unsigned char *payload = packet + 14 + ip_header1->ip_hl * 4 + tcp_header_length;
            int payload_length = ntohs(ip_header1->ip_len) - (ip_header1->ip_hl * 4 + tcp_header_length);

            // Print or save payload (application layer data)
            message.assign(reinterpret_cast<const char *>(payload), payload_length);
            // std::cout << "tcpMessage:" << std::endl << message << std::endl;

            if (ntohs(tcp_header1->source) == 80 || ntohs(tcp_header1->dest) == 80)
            {
                protocol = "HTTP";
            }
            else if (ntohs(tcp_header1->source) == 21 || ntohs(tcp_header1->dest) == 21)
            {
                protocol = "FTP";
            }
        }
        else if (ip_header1->ip_p == IPPROTO_UDP)
        {
            protocol = "UDP";
            // UDP header starts after IP header
            const struct udphdr *udp_header = (struct udphdr *)(packet + 14 + ip_header1->ip_hl * 4);

            // Calculate offset to UDP payload (after UDP header)
            const unsigned char *payload = packet + 14 + ip_header1->ip_hl * 4 + sizeof(struct udphdr);
            int payload_length = ntohs(udp_header->uh_ulen) - sizeof(struct udphdr);

            // Print or save payload (application layer data)

            message.assign(reinterpret_cast<const char *>(payload), payload_length);
            // std::cout << "udpMessage:" << std::endl << message << std::endl;

            if (ntohs(udp_header->uh_sport) == 53 || ntohs(udp_header->uh_dport) == 53)
            {
                protocol = "DNS";
            }
        }
        else if (ip_header1->ip_p == IPPROTO_ICMP)
        {
            protocol = "ICMP";
            // ICMP header starts after IP header
            const struct icmphdr *icmp_header = (struct icmphdr *)(packet + 14 + ip_header1->ip_hl * 4);

            // Calculate offset to ICMP payload (after ICMP header)
            int ip_header_length = ip_header1->ip_hl * 4;
            int icmp_header_length = sizeof(struct icmphdr);
            int total_length = ntohs(ip_header1->ip_len);

            // Ensure that the total length is valid
            if (total_length < ip_header_length + icmp_header_length)
            {
                std::cerr << "Invalid packet length" << std::endl;
                continue; // or continue to next packet
            }

            const unsigned char *icmp_payload = packet + 14 + ip_header_length + icmp_header_length;
            int icmp_payload_length = total_length - ip_header_length - icmp_header_length;

            // Ensure that the payload length is non-negative and within the packet length
            if (icmp_payload_length < 0 || icmp_payload_length > total_length)
            {
                std::cerr << "Invalid ICMP payload length" << std::endl;
                return; // or continue to next packet
            }

            // Print or save ICMP payload
            message.assign(reinterpret_cast<const char *>(icmp_payload), icmp_payload_length);
            // std::cout << "ICMP Message:" << std::endl << message << std::endl;
        }
        // std::cout << "udpMessage:" << std::endl << message << std::endl;
        std::string time_str = formatTimeISO8601(header->ts);

        Value package(kObjectType);
        package.AddMember("sourceIP", Value(sourceIP.c_str(), allocator).Move(), allocator);
        package.AddMember("destinationIP", Value(destinationIP.c_str(), allocator).Move(), allocator);
        package.AddMember("sourcePort", sourcePort, allocator);
        package.AddMember("destinationPort", destinationPort, allocator);
        package.AddMember("protocol", Value(protocol.c_str(), allocator).Move(), allocator);
        package.AddMember("time", Value(time_str.c_str(), allocator).Move(), allocator);
        package.AddMember("message", Value(message.c_str(), allocator).Move(), allocator);
        packages.PushBack(package, allocator);
    }

    document.AddMember("packages", packages, allocator);
    document.AddMember("restoredFiles", restoredFiles, allocator);
    pcap_close(handle);

    StringBuffer buffer;
    Writer<StringBuffer> writer(buffer);
    document.Accept(writer);

    std::ofstream ofs("output.json");
    if (!ofs)
    {
        std::cerr << "Failed to open file for writing\n";
        return;
    }
    ofs << buffer.GetString();
    ofs.close();
}

int main(int argc, char *argv[])
{
    // 检查是否提供了正确数量的命令行参数
    if (argc != 2)
    {
        std::cerr << "用法: " << argv[0] << " <文件名>" << std::endl;
        return 1; // 返回错误代码
    }

    // 从命令行参数中获取文件名
    char *filename = argv[1];

    // 调用 offline_process 函数处理文件
    offline_process(filename);

    return 0;
}
