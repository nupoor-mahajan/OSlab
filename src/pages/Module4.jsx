import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-green-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-green-400/20">{children}</div>}
    </div>
  )
}

const allocationMethods = [
  {
    name: 'Contiguous Allocation', icon: '📏', color: 'border-cyan-400/40',
    desc: 'Each file occupies a set of contiguous blocks on disk. Simple to implement — only need starting block and length.',
    pros: ['Fast sequential access', 'Easy directory implementation', 'Random access support'],
    cons: ['External fragmentation', 'File cannot grow easily', 'Need to know file size in advance'],
  },
  {
    name: 'Linked List Allocation', icon: '🔗', color: 'border-fuchsia-400/40',
    desc: 'Each block contains a pointer to the next block. Files can be scattered anywhere on disk.',
    pros: ['No external fragmentation', 'Files can grow dynamically', 'No need to declare size upfront'],
    cons: ['Slow random access (must traverse links)', 'Space wasted by pointers', 'Reliability: losing a pointer loses rest of file'],
  },
  {
    name: 'Indexed Allocation', icon: '📇', color: 'border-orange-400/40',
    desc: 'An index block contains pointers to all file blocks. Supports direct access without traversal.',
    pros: ['Good for random access', 'No external fragmentation', 'Dynamic file growth'],
    cons: ['Index block overhead', 'Small files waste space (full index block)', 'Multi-level index for large files'],
  },
  {
    name: 'FAT (File Allocation Table)', icon: '🗂️', color: 'border-yellow-400/40',
    desc: 'Linked allocation with all pointers stored in a FAT table in memory. Used in MS-DOS, USB drives.',
    pros: ['Fast traversal (FAT in memory)', 'Simple structure', 'Widely supported'],
    cons: ['FAT can be large for big disks', 'FAT corruption loses whole file system', 'Poor for large modern disks'],
  },
]

const diskScheduling = [
  { name: 'FCFS', desc: 'Service requests in arrival order. Fair but inefficient — large arm movements.', icon: '📋', formula: 'Total movement = sum of |positions|' },
  { name: 'SSTF', full: 'Shortest Seek Time First', desc: 'Move to closest request next. Reduces average seek time but can cause starvation of far requests.', icon: '🎯', formula: 'Always move to nearest pending request' },
  { name: 'SCAN (Elevator)', desc: 'Arm moves in one direction servicing requests, reverses at end. Like an elevator. Fair and efficient.', icon: '↕️', formula: 'Move in direction until end, then reverse' },
  { name: 'C-SCAN', full: 'Circular SCAN', desc: 'Like SCAN but only services requests in one direction. Returns to start without servicing on return.', icon: '🔁', formula: 'One-directional SCAN + jump to start' },
  { name: 'LOOK', desc: 'Like SCAN but reverses when no more requests in current direction (doesn\'t go to disk end).', icon: '🔍', formula: 'Reverse at last request, not disk edge' },
  { name: 'C-LOOK', desc: 'Like C-SCAN but only goes to last request in direction, then jumps back.', icon: '🔎', formula: 'One-directional LOOK + jump' },
]

const fileSystemStructure = [
  { level: 'Application Programs', color: 'bg-cyan-500/20 border-cyan-500/30' },
  { level: 'Logical File System', color: 'bg-fuchsia-500/20 border-fuchsia-500/30' },
  { level: 'File-Organization Module', color: 'bg-orange-500/20 border-orange-500/30' },
  { level: 'Basic File System', color: 'bg-green-500/20 border-green-500/30' },
  { level: 'I/O Control (Device Drivers)', color: 'bg-yellow-500/20 border-yellow-500/30' },
  { level: 'Devices (Disk, SSD)', color: 'bg-red-500/20 border-red-500/30' },
]

const ioMethods = [
  { name: 'Programmed I/O (Polling)', desc: 'CPU continuously checks I/O device status. Simple but CPU wastes cycles waiting. Good for fast/simple devices.', icon: '🔄', color: 'text-cyan-400' },
  { name: 'Interrupt-Driven I/O', desc: 'Device raises interrupt when ready. CPU can do other work. More efficient than polling.', icon: '🔔', color: 'text-fuchsia-400' },
  { name: 'DMA (Direct Memory Access)', desc: 'DMA controller transfers data directly between device and memory without CPU involvement. Most efficient for large transfers.', icon: '⚡', color: 'text-orange-400' },
]

const quiz = [
  { q: 'Which file allocation method suffers from external fragmentation?', opts: ['Linked','Indexed','Contiguous','FAT'], ans: 2 },
  { q: 'Which disk scheduling algorithm is also called the elevator algorithm?', opts: ['SSTF','FCFS','SCAN','C-LOOK'], ans: 2 },
  { q: 'DMA stands for:', opts: ['Dynamic Memory Allocation','Direct Memory Access','Data Management Area','Device Memory Addressing'], ans: 1 },
  { q: 'Which method allows best random access to file blocks?', opts: ['Contiguous','Linked','Indexed','FCFS'], ans: 2 },
  { q: 'Free space management using a bit vector: 0 means:', opts: ['Block allocated','Block free','Block corrupted','Block reserved'], ans: 1 },
]

export default function Module4() {
  const [quizAns, setQuizAns] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(quizAns).filter(([i, v]) => quiz[i].ans === v).length

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag">Module 4</span>
          <span className="tag">CO4</span>
          <span className="tag">8 Hours</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-4">File Management & I/O</h1>
        <p className="text-gray-400 text-lg">File systems structure, allocation methods, free space management, I/O hardware, disk scheduling, and storage management.</p>
      </div>

      {/* 4.1 File System Structure */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">4.1 File System Structure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Layered File System</h3>
            <div className="space-y-2">
              {fileSystemStructure.map((l, i) => (
                <div key={l.level} className={`p-3 rounded-xl border ${l.color} text-sm text-center font-medium text-white flex items-center justify-between`}>
                  <span className="text-gray-400 text-xs">{fileSystemStructure.length - i}</span>
                  {l.level}
                  <span className="text-gray-400 text-xs">↑↓</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Directory Organization</h3>
            <div className="space-y-3">
              {[
                { name: 'Single-Level', desc: 'One directory for all users. Simple but naming conflicts.' },
                { name: 'Two-Level', desc: 'Separate directory per user. No sharing between users.' },
                { name: 'Tree-Structured', desc: 'Hierarchical directories. Most common. Absolute/relative paths.' },
                { name: 'Acyclic-Graph', desc: 'Allows shared files/dirs. Hard and soft links.' },
                { name: 'General Graph', desc: 'Links can create cycles. Need garbage collection.' },
              ].map(d => (
                <div key={d.name} className="glass-card p-4">
                  <h4 className="font-semibold text-green-300 text-sm">{d.name}</h4>
                  <p className="text-gray-400 text-xs">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* File Allocation Methods */}
        <h3 className="text-xl font-bold text-white mb-4">File Allocation Methods</h3>
        <div className="space-y-3">
          {allocationMethods.map(m => (
            <Accordion key={m.name} title={`${m.icon} ${m.name}`}>
              <p className="mt-3 mb-3">{m.desc}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-400 text-xs font-semibold mb-1">✅ Pros</p>
                  <ul className="space-y-1">{m.pros.map(p=><li key={p}>• {p}</li>)}</ul>
                </div>
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">❌ Cons</p>
                  <ul className="space-y-1">{m.cons.map(c=><li key={c}>• {c}</li>)}</ul>
                </div>
              </div>
            </Accordion>
          ))}
        </div>

        {/* Free Space Management */}
        <h3 className="text-xl font-bold text-white mt-6 mb-4">Free Space Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Bit Vector (Bitmap)', desc: 'One bit per block. 0 = free, 1 = allocated. Simple but large for big disks. Easy to find contiguous blocks.', icon: '🗺️' },
            { name: 'Linked List', desc: 'Free blocks linked together. No waste but poor performance — must traverse to find contiguous space.', icon: '🔗' },
            { name: 'Grouping', desc: 'First free block stores n free block addresses. Much faster than traversing a linked list of individual blocks.', icon: '📦' },
          ].map(f => (
            <div key={f.name} className="glass-card p-5 text-center hover:border-green-400/30 transition-all">
              <div className="text-3xl mb-2">{f.icon}</div>
              <h4 className="font-bold text-white mb-2">{f.name}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4.2 I/O Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">4.2 I/O Management</h2>

        <h3 className="text-xl font-bold text-white mb-4">I/O Hardware & Interfaces</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {[
            { t: 'I/O Hardware', d: 'Includes ports (connection points), buses (daisy chain / shared direct access), and controllers (electronic components that operate the ports, buses, and devices). Device controllers have local buffer storage and special registers.' },
            { t: 'Application I/O Interface', d: 'OS hides hardware differences via device drivers. Applications use standard system calls (read, write, open, close) regardless of device type. Block vs Character devices, Network devices.' },
          ].map(item => (
            <div key={item.t} className="glass-card p-6">
              <h4 className="font-bold text-green-300 mb-2">{item.t}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-4">I/O Methods</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {ioMethods.map(m => (
            <div key={m.name} className="glass-card p-5 text-center hover:scale-[1.02] transition-all">
              <span className="text-3xl">{m.icon}</span>
              <h4 className={`font-bold text-lg mt-2 mb-2 ${m.color}`}>{m.name}</h4>
              <p className="text-gray-400 text-sm">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Secondary Storage: Disk Structure */}
        <h3 className="text-xl font-bold text-white mb-4">Secondary Storage — Disk Structure</h3>
        <div className="glass-card p-6 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm mb-4">
            {[
              { t: 'Platter', d: 'Circular magnetic disk' },
              { t: 'Track', d: 'Concentric circles on platter' },
              { t: 'Sector', d: 'Smallest storage unit (512B/4KB)' },
              { t: 'Cylinder', d: 'Same track across all platters' },
            ].map(d => (
              <div key={d.t} className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="font-bold text-green-300">{d.t}</div>
                <div className="text-gray-400 text-xs mt-1">{d.d}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-300 text-sm">
            <strong className="text-white">Access Time</strong> = Seek Time (arm movement to track) + Rotational Latency (wait for sector) + Transfer Time (actual data transfer)
          </p>
        </div>

        {/* Disk Scheduling */}
        <h3 className="text-xl font-bold text-white mb-4">Disk Scheduling Algorithms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {diskScheduling.map(d => (
            <div key={d.name} className="glass-card p-5 hover:border-green-400/30 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{d.icon}</span>
                <h4 className="font-bold text-white">{d.name}{d.full ? ` (${d.full})` : ''}</h4>
              </div>
              <p className="text-gray-400 text-sm mb-2">{d.desc}</p>
              <div className="bg-white/5 rounded-lg px-3 py-1 text-xs text-gray-400 font-mono">{d.formula}</div>
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <Link to="/sim/disk-scheduling" className="btn-primary inline-flex items-center gap-2">
            🔬 Try Disk Scheduling Simulator →
          </Link>
        </div>
      </section>

      {/* 4.3 Storage Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">4.3 Storage Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { t: 'RAID', d: 'Redundant Array of Independent Disks. RAID 0 (striping), RAID 1 (mirroring), RAID 5 (striping with parity). Improves performance and/or fault tolerance.', icon: '🗄️', color: 'border-cyan-400/30' },
            { t: 'Disk Formatting', d: 'Low-level: creates sectors/tracks. High-level: creates file system (inode table, free space list, root directory). Partition table divides disk into regions.', icon: '💿', color: 'border-fuchsia-400/30' },
            { t: 'Boot Block', d: 'Contains bootstrap loader. Stored in ROM/NVram and master boot record (MBR). Loads OS kernel from disk into memory at startup.', icon: '🚀', color: 'border-orange-400/30' },
            { t: 'Swap Space Management', d: 'Area on disk used as extension of RAM (virtual memory backing store). Can be a raw partition or a file. Managed separately for performance.', icon: '🔄', color: 'border-green-400/30' },
          ].map(item => (
            <div key={item.t} className={`glass-card p-5 border ${item.color}`}>
              <span className="text-2xl">{item.icon}</span>
              <h4 className="font-bold text-white mt-2 mb-2">{item.t}</h4>
              <p className="text-gray-400 text-sm">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🧠 File & I/O Quiz</h2>
        <div className="glass-card p-6 space-y-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="font-semibold text-white mb-3">{i+1}. {q.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((opt, j) => {
                  let cls = 'p-3 rounded-xl text-sm border border-white/10 cursor-pointer transition-all text-gray-300 hover:border-green-400/40 hover:bg-white/5'
                  if (submitted) {
                    if (j === q.ans) cls += ' !border-green-400 !bg-green-500/10 !text-green-300 font-semibold'
                    else if (quizAns[i] === j && j !== q.ans) cls += ' !border-red-400 !bg-red-500/10 !text-red-300'
                  } else if (quizAns[i] === j) {
                    cls += ' !border-green-400 !bg-green-500/10 !text-green-300'
                  }
                  return <button key={j} className={cls} onClick={() => !submitted && setQuizAns({ ...quizAns, [i]: j })}>{opt}</button>
                })}
              </div>
            </div>
          ))}
          {!submitted
            ? <button className="btn-primary w-full" onClick={() => setSubmitted(true)}>Submit Quiz</button>
            : <div className={`text-center py-3 rounded-xl font-bold text-lg ${score===quiz.length?'text-green-400 bg-green-500/10':'text-yellow-400 bg-yellow-500/10'}`}>
                Score: {score}/{quiz.length} {score===quiz.length?'🎉 Perfect!':'Keep going! 💪'}
              </div>
          }
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/module3" className="btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Module 3</Link>
        <Link to="/" className="btn-primary flex items-center gap-2">🏠 Home</Link>
      </div>
    </div>
  )
}
