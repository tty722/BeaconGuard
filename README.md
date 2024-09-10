- # BeaconGuard: AI-based Network Traffic Intrusion Tracing System

  ## Overview

  **BeaconGuard** is an AI-powered cybersecurity tool designed to detect and trace potential network intrusions by analyzing network traffic. The system leverages deep learning models and advanced analytics algorithms to identify and track the sources of malicious traffic, providing effective security protection and threat tracing.

  ## Features

  - **AI-based Threat Detection**: Automatically detects abnormal network behaviors using machine learning and deep learning models.
  - **Network Traffic Analysis**: Supports analysis of PCAP files for real-time or offline traffic inspection.
  - **Threat Tracing**: Uses intelligent algorithms to identify and track the source IP and paths of malicious traffic, helping users quickly locate the origin of attacks.
  - **Large Model Assistance**: Utilizes large models such as Llama2 and SecGPT2 for threat traffic analysis, providing users with cybersecurity insights and generating intrusion threat reports.
  - **Traffic Restoration**: Supports restoring unencrypted traffic to retrieve original data such as images, videos, code, and files.

  ## Tech Stack

  - **Frontend**: Vue.js, Vite, TypeScript
  - **Backend**: Node.js, Express
  - **Database**: MongoDB
  - **Packet Capture and Processing**: `libpcap`

  ## Directory Structure

  ```
  BeaconGuard/
  │
  ├── cicflowmeter/            # Traffic feature extraction code
  ├── vue/                     # Frontend code
  ├── express/                 # Backend code
  ├── restore/                 # Traffic restoration code
  ├── llm/                     # Threat traffic analysis models and large prediction model code
  └── README.md                # Project introduction documentation
  ```

  ## Quick Start

  ### Prerequisites

  - Node.js and npm
  - MongoDB
  - `libpcap` development libraries
  - ollama
  - Llama2
  - cicflowmeter

  ### Installation

  1. **Clone the repository:**

     ```bash
     git clone https://github.com/tty722/BeaconGuard.git
     cd BeaconGuard-main
     ```

  2. **Install frontend dependencies:**

     ```bash
     cd vue
     npm install
     ```

  3. **Install backend dependencies:**

     ```bash
     cd express
     npm install
     ```

  4. **Set up MongoDB:**

     Ensure MongoDB is installed and running. If necessary, configure the connection string in the backend configuration files.

  5. **Install Python dependencies:**

     ```bash
     pip install -r requirements.txt
     ```

  ### Running the Application

  1. **Start the backend server:**

     ```bash
     cd express
     npm start
     ```

  2. **Run the frontend development server:**

     ```bash
     cd vue
     npm run dev
     ```

  3. **Run the model server:**

     ```bash
     cd llm
     python llama2.py
     ```

  4. **Run the traffic restoration server:**

     ```bash
     cd restore
     python convertion_linux.py
     ```

  5. **Run the traffic feature conversion server:**

     ```bash
     cd cicflowmeter
     python cicflowmeter_linux.py
     ```

  6. **Access the application:**

     Open your web browser and navigate to `http://localhost:5173`.

  ## Usage

  ### Capture Network Traffic

  1. **Real-time Capture:**

     Use the provided interface to start real-time network traffic capture.

  2. **Offline Capture:**

     Load pre-recorded PCAP files for analysis.

  ### Analyze Captured Traffic

  - The backend processes the captured traffic, including initial decoding, IP fragment reassembly, TCP stream reassembly, and application layer protocol extraction.
  - Processed data is stored in MongoDB or the file system.

  ### View Analysis Results

  - Access the web application to visualize communication relationships between IP pairs, traffic statistics of various protocols, and more.

  ## Contributing

  We welcome contributions to improve this project. Please fork the repository and submit pull requests.

  ## License

  This project is licensed under the MIT License. For details, please refer to the `LICENSE` file.

  ## Acknowledgements

  - Special thanks to the contributors of `libpcap`, Vue.js, Vite, TypeScript, Node.js, Express, Llama2, and MongoDB.
  - For further questions, contact us at 2022090911023@std.uestc.edu.cn.