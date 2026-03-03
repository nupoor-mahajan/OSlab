# 🖥️ Operating Systems Virtual Laboratory

An interactive, high-fidelity web platform designed to visualize and simulate core Operating Systems algorithms.  
This project serves as a comprehensive laboratory tool for students to explore **process management, memory allocation, and storage scheduling** through hands-on experimentation, mapping directly to course learning outcomes (COs).

---

## [🚀 Live Demo](https://nupoor-mahajan.github.io/OSlab/)

---

## 🌟 Key Features

### 1. Syllabus-Aligned Simulators
The platform includes custom-built simulators covering the essential practicals of the OS course:

- **CPU Scheduling**: FCFS, SJF, Priority, and Round Robin with dynamic, time-aligned Gantt charts.  
- **Memory Partitioning**: First Fit, Best Fit, and Worst Fit strategies with vertical memory stack visualization highlighting internal fragmentation.  
- **Page Replacement**: FIFO, LRU, and Optimal algorithms with automated hit/miss ratio calculations.  
- **Disk Scheduling**: FCFS, SSTF, SCAN, and C-SCAN with zigzag seek-time plots.  
- **Deadlock Prevention**: Interactive resource allocation graphs and detection tools.  

### 2. Academic Modules
Structured into four modules as per the college curriculum:

- **Module 1**: OS Concepts, Shells, and Protection  
- **Module 2**: Memory Management and Virtual Memory  
- **Module 3**: Process Synchronization and Deadlocks  
- **Module 4**: File Systems and I/O Management  

---

## 📊 Lab Observations & Metrics

The platform provides the specific data required for lab manual observations:

- **Automated Metrics**: Calculates Average Waiting Time (AWT), Average Turnaround Time (ATAT), and Page Fault Rates.  
- **Comparative Analysis**: Side-by-side performance comparisons of different algorithms to justify *why* specific strategies are chosen.  
- **Theoretical Context**: Integrated knowledge base explaining syllabus concepts like **Belady’s Anomaly** and the **Convoy Effect**.  

---

## 🛠️ Tech Stack

- **Framework**: React.js (Vite)  
- **Styling**: Tailwind CSS  
- **Icons**: Lucide React  
- **Routing**: HashRouter (for GitHub Pages compatibility)  

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository:
```bash
git clone https://github.com/nupoor-mahajan/OSlab.git
cd OSlab
```

### 2. Install Dependencies:
```bash
npm install
```
### 3. Start Development Server
```bash
npm run dev
```

---
## 👩‍💻 Author
Developed by **Nupoor Mahajan**  
GitHub: [@nupoor-mahajan](https://github.com/nupoor-mahajan)
