import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Monitor, Layers, Shield, Terminal } from 'lucide-react'

const osTypes = [
  { name: 'Mainframe OS', desc: 'Handles large-scale batch processing. Used in banking, insurance. High throughput, reliability.', icon: '🖥️', color: 'border-cyan-500/40' },
  { name: 'Server OS', desc: 'Manages network resources, serves multiple clients. Examples: Linux, Windows Server.', icon: '🌐', color: 'border-blue-500/40' },
  { name: 'Multiprocessor OS', desc: 'Coordinates multiple CPUs for parallel processing. Symmetric (SMP) or Asymmetric (AMP).', icon: '⚡', color: 'border-purple-500/40' },
  { name: 'Personal Computer OS', desc: 'Single-user systems with GUI. Windows, macOS, Linux. Focus on usability and interactivity.', icon: '💻', color: 'border-fuchsia-500/40' },
  { name: 'Handheld/Mobile OS', desc: 'Optimized for low power, small screens. Android, iOS. Touch-based interfaces.', icon: '📱', color: 'border-orange-500/40' },
  { name: 'Embedded OS', desc: 'Runs inside devices like routers, microwaves. Small footprint, real-time constraints.', icon: '🔧', color: 'border-green-500/40' },
  { name: 'Sensor-Node OS', desc: 'TinyOS for IoT sensor networks. Ultra-low power, event-driven, highly constrained.', icon: '📡', color: 'border-teal-500/40' },
  { name: 'Real-Time OS (RTOS)', desc: 'Guarantees response within strict deadlines. Hard RTOS (miss = failure) vs Soft RTOS.', icon: '⏱️', color: 'border-red-500/40' },
  { name: 'Smart Card OS', desc: 'Runs on credit-card-sized chips. Very limited resources. Used in security tokens, SIM cards.', icon: '💳', color: 'border-yellow-500/40' },
]

const roles = [
  { icon: Monitor, title: 'Process Management', desc: 'Creates, schedules, and terminates processes. Manages PCB (Process Control Block), context switching, and CPU allocation for multitasking.', color: 'text-cyan-400' },
  { icon: Layers, title: 'Memory Management', desc: 'Allocates/deallocates RAM for processes. Handles address spaces, virtual memory, paging, and protects one process from another.', color: 'text-fuchsia-400' },
  { icon: Shield, title: 'File System Management', desc: 'Organizes data into files and directories. Handles read/write/delete, permissions, and file allocation on storage devices.', color: 'text-orange-400' },
  { icon: Terminal, title: 'I/O & Device Management', desc: 'Interfaces hardware via drivers. Manages input/output operations using buffers, interrupts, and DMA to efficiently transfer data.', color: 'text-green-400' },
]

const shellTopics = [
  { term: 'Shell', def: 'A command-line interpreter that accepts user commands and passes them to the kernel for execution. Examples: bash, zsh, cmd.' },
  { term: 'Process', def: 'A program in execution. Has its own address space, stack, heap, registers, and program counter. Managed by the OS scheduler.' },
  { term: 'Address Space', def: 'The range of virtual memory addresses a process can use. Provides isolation and protection between processes.' },
  { term: 'Protection', def: 'OS mechanisms ensuring processes cannot access each other\'s memory or hardware without permission. Enforced via hardware (MMU) and OS policies.' },
  { term: 'System Call', def: 'The interface between a user program and the OS kernel. Programs request OS services (file I/O, process creation) via system calls.' },
]

const quiz = [
  { q: 'Which OS type guarantees response within strict deadlines?', opts: ['Server OS','Real-Time OS','Embedded OS','Mainframe OS'], ans: 1 },
  { q: 'What is the primary function of a Shell?', opts: ['Memory allocation','Command interpretation','File storage','Process scheduling'], ans: 1 },
  { q: 'Which component stores process information (state, registers)?', opts: ['File Table','Page Table','Process Control Block','Interrupt Vector'], ans: 2 },
  { q: 'Address spaces provide:', opts: ['Fast I/O','Process isolation','Better disk speed','GUI support'], ans: 1 },
]

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-cyan-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5">{children}</div>}
    </div>
  )
}

export default function Module1() {
  const [quizAns, setQuizAns] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(quizAns).filter(([i, v]) => quiz[i].ans === v).length

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag">Module 1</span>
          <span className="tag">CO1</span>
          <span className="tag">6 Hours</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">Operating Systems Concepts</h1>
        <p className="text-gray-400 text-lg">Explore roles of processes, memory management, file systems, I/O, protection, shell, and types of OS.</p>
      </div>

      {/* Section 1: Roles */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-2">1.1 Roles of an Operating System</h2>
        <p className="text-gray-400 text-sm mb-6">An OS acts as an intermediary between hardware and user programs. It manages four core responsibilities:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {roles.map(r => {
            const Icon = r.icon
            return (
              <div key={r.title} className="glass-card p-6 hover:border-white/20 transition-all">
                <Icon size={24} className={`${r.color} mb-3`} />
                <h3 className={`font-bold text-lg mb-2 ${r.color}`}>{r.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Flip Cards: OS as Govt/Resource/Interface */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-6">OS Perspectives (Hover to Reveal)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { front: '🏛️ OS as Government', back: 'Like a government, the OS allocates resources fairly, enforces rules (protection), and ensures no single program monopolizes the system.' },
            { front: '🛠️ OS as Resource Manager', back: 'Manages CPU, memory, disk, and I/O devices. Decides who gets what resource and when, balancing efficiency and fairness.' },
            { front: '🔌 OS as Extended Machine', back: 'Hides complex hardware details. Programs interact with simple abstractions (files, processes) instead of raw hardware instructions.' },
          ].map(c => (
            <div key={c.front} className="flip-card h-44">
              <div className="flip-card-inner h-full">
                <div className="flip-front bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 shadow-lg">
                  <p className="text-cyan-300 font-semibold text-lg">{c.front}</p>
                </div>
                <div className="flip-back bg-gradient-to-br from-slate-700 to-slate-800 border border-fuchsia-500/30 shadow-lg">
                  <p className="text-yellow-200 text-sm leading-relaxed">{c.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shell & Key Terms */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-6">1.1 Shell, Processes, Address Spaces & Protection</h2>
        <div className="space-y-3">
          {shellTopics.map(t => (
            <Accordion key={t.term} title={t.term}>
              <p className="mt-2">{t.def}</p>
            </Accordion>
          ))}
        </div>
      </section>

      {/* Types of OS */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-2">1.2 Types of Operating Systems</h2>
        <p className="text-gray-400 text-sm mb-6">Different environments demand different OS designs. Understanding each type reveals trade-offs in performance, power, and complexity.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {osTypes.map(t => (
            <div key={t.name} className={`glass-card p-5 border ${t.color} hover:scale-[1.02] transition-all`}>
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="font-bold text-white mb-2">{t.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-6">OS Types Comparison</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-gray-300">
                {['OS Type','Users','Performance','Use Case','Example'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Mainframe','Many','Very High','Banking, Data Centers','IBM z/OS'],
                ['Server','Many','High','Web Hosting, Cloud','Linux, Windows Server'],
                ['Personal Computer','Single','Moderate','Desktop, Laptop','Windows 11, macOS'],
                ['Real-Time','1–Many','Deterministic','Medical, Aerospace','VxWorks, FreeRTOS'],
                ['Embedded','None/1','Low Power','IoT, Appliances','TinyOS, Contiki'],
                ['Mobile/Handheld','Single','Optimized','Smartphones','Android, iOS'],
              ].map(row => (
                <tr key={row[0]} className="hover:bg-white/3 text-gray-300">
                  {row.map((cell, i) => <td key={i} className="px-4 py-3">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🧠 Quick Quiz</h2>
        <div className="glass-card p-6 space-y-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="font-semibold text-white mb-3">{i+1}. {q.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((opt, j) => {
                  let cls = 'p-3 rounded-xl text-sm border border-white/10 cursor-pointer transition-all text-gray-300 hover:border-cyan-400/40 hover:bg-white/5'
                  if (submitted) {
                    if (j === q.ans) cls += ' !border-green-400 !bg-green-500/10 !text-green-300 font-semibold'
                    else if (quizAns[i] === j && j !== q.ans) cls += ' !border-red-400 !bg-red-500/10 !text-red-300'
                  } else if (quizAns[i] === j) {
                    cls += ' !border-cyan-400 !bg-cyan-500/10 !text-cyan-300'
                  }
                  return (
                    <button key={j} className={cls} onClick={() => !submitted && setQuizAns({ ...quizAns, [i]: j })}>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          {!submitted
            ? <button className="btn-primary w-full" onClick={() => setSubmitted(true)}>Submit Quiz</button>
            : <div className={`text-center py-3 rounded-xl font-bold text-lg ${score===quiz.length?'text-green-400 bg-green-500/10':'text-yellow-400 bg-yellow-500/10'}`}>
                Score: {score}/{quiz.length} {score===quiz.length?'🎉 Perfect!':'Keep studying! 💪'}
              </div>
          }
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/" className="btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Home</Link>
        <Link to="/module2" className="btn-primary flex items-center gap-2">Module 2 →</Link>
      </div>
    </div>
  )
}
