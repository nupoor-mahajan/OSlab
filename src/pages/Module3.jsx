import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-orange-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-orange-400/20">{children}</div>}
    </div>
  )
}

const schedulers = [
  { type: 'Long-Term (Job Scheduler)', desc: 'Selects processes from job pool and loads them into memory. Controls degree of multiprogramming. Runs infrequently.', icon: '📋', color: 'text-orange-400' },
  { type: 'Short-Term (CPU Scheduler)', desc: 'Selects from ready queue and allocates CPU. Runs very frequently (milliseconds). Must be very fast.', icon: '⚡', color: 'text-cyan-400' },
  { type: 'Medium-Term (Swapper)', desc: 'Swaps processes in/out of memory to reduce multiprogramming degree. Helps manage thrashing.', icon: '🔄', color: 'text-fuchsia-400' },
]

const processStates = [
  { state: 'New', desc: 'Process is being created', color: 'bg-gray-500' },
  { state: 'Ready', desc: 'Waiting to be assigned CPU', color: 'bg-cyan-500' },
  { state: 'Running', desc: 'Instructions being executed', color: 'bg-green-500' },
  { state: 'Waiting', desc: 'Waiting for I/O or event', color: 'bg-orange-500' },
  { state: 'Terminated', desc: 'Process finished execution', color: 'bg-red-500' },
]

const schedulingAlgos = [
  { name: 'FCFS', full: 'First Come First Served', type: 'Non-Preemptive', desc: 'Processes are scheduled in order of arrival. Simple but convoy effect: short jobs wait behind long ones.', pros: ['Simple', 'No starvation'], cons: ['Convoy effect', 'Poor avg waiting time'] },
  { name: 'SJF', full: 'Shortest Job First', type: 'Non-Preemptive / Preemptive (SRTN)', desc: 'Schedule process with shortest CPU burst. Optimal for minimizing average wait time but requires knowing burst times.', pros: ['Min avg waiting time', 'High throughput'], cons: ['Starvation of long jobs', 'Requires burst time prediction'] },
  { name: 'SRTN', full: 'Shortest Remaining Time Next', type: 'Preemptive', desc: 'Preemptive version of SJF. A new shorter job preempts the running process.', pros: ['Optimal preemptive', 'Good for interactive systems'], cons: ['High overhead', 'Starvation'] },
  { name: 'Priority', full: 'Priority Scheduling', type: 'Preemptive / Non-Preemptive', desc: 'CPU assigned to highest priority process. Ties broken by FCFS. Problem: low-priority processes may starve.', pros: ['Important tasks run first', 'Flexible'], cons: ['Starvation', 'Priority inversion'] },
  { name: 'RR', full: 'Round Robin', type: 'Preemptive', desc: 'Each process gets a fixed time quantum. After quantum, preempted and moved to back of ready queue. Best for time-sharing.', pros: ['Fair', 'No starvation', 'Good for interactive'], cons: ['High context switch overhead', 'Performance depends on quantum size'] },
]

const ipcMechanisms = [
  { name: 'Shared Memory', desc: 'Processes share a memory region. Fast communication but requires synchronization to avoid race conditions.', icon: '🧠' },
  { name: 'Message Passing', desc: 'Processes communicate via send/receive primitives. No shared state needed. Can be synchronous or asynchronous.', icon: '✉️' },
  { name: 'Pipes', desc: 'Half-duplex byte stream between related processes. Named pipes allow unrelated processes to communicate.', icon: '🔗' },
  { name: 'Sockets', desc: 'Two-way communication endpoints. Used for network and local IPC. Foundation of client-server architectures.', icon: '🌐' },
]

const syncProblems = [
  { name: 'Producer-Consumer', desc: 'Producer creates data items; Consumer consumes them. Buffer of limited size. Need to ensure: producer doesn\'t overflow, consumer doesn\'t underflow.', solution: 'Semaphores: full, empty, mutex' },
  { name: 'Dining Philosophers', desc: 'N philosophers alternately think and eat. Need 2 forks to eat. Classic resource allocation problem demonstrating deadlock and starvation.', solution: 'Resource ordering, arbitrator, or Chandy/Misra' },
  { name: 'Readers-Writers', desc: 'Multiple readers can read simultaneously, but writers need exclusive access. First-readers-preference allows starvation of writers.', solution: 'Read-write locks, priority strategies' },
]

const deadlockConditions = [
  { name: 'Mutual Exclusion', desc: 'At least one resource must be non-shareable. Only one process at a time can use the resource.', icon: '🔒' },
  { name: 'Hold and Wait', desc: 'A process holding at least one resource is waiting to acquire additional resources held by other processes.', icon: '✋' },
  { name: 'No Preemption', desc: 'Resources cannot be forcibly taken from a process. They must be released voluntarily.', icon: '🚫' },
  { name: 'Circular Wait', desc: 'A set {P0,...,Pn} of waiting processes exists such that P0 waits for P1, P1 waits for P2, ..., Pn waits for P0.', icon: '🔄' },
]

const quiz = [
  { q: 'Which scheduler runs most frequently?', opts: ['Long-term','Medium-term','Short-term','I/O scheduler'], ans: 2 },
  { q: 'Round Robin uses a fixed:', opts: ['Priority level','Time quantum','Memory partition','Stack size'], ans: 1 },
  { q: 'Which condition is NOT required for deadlock?', opts: ['Mutual Exclusion','Hold and Wait','Starvation','Circular Wait'], ans: 2 },
  { q: 'Semaphore wait(S) operation is also called:', opts: ['signal()','V()','P()','lock()'], ans: 2 },
  { q: 'Convoy effect is associated with which algorithm?', opts: ['SJF','Round Robin','FCFS','Priority'], ans: 2 },
]

export default function Module3() {
  const [quizAns, setQuizAns] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(quizAns).filter(([i, v]) => quiz[i].ans === v).length

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag">Module 3</span>
          <span className="tag">CO3</span>
          <span className="tag">8 Hours</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 text-transparent bg-clip-text mb-4">Process Management</h1>
        <p className="text-gray-400 text-lg">Process states, schedulers, CPU scheduling algorithms, threads, IPC, synchronization, semaphores, and deadlock.</p>
      </div>

      {/* 3.1 Process Concepts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.1 Process: Concepts & States</h2>
        <div className="glass-card p-6 mb-5">
          <h3 className="font-bold text-orange-300 mb-3">What is a Process?</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">A <strong className="text-white">process</strong> is a program in execution. It is more than just the program code — it includes the current activity represented by the program counter, registers, stack, heap, and data section.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Program Counter','CPU Registers','Stack (function calls)','Heap (dynamic memory)','Text (code)','Data (global vars)'].map(c=>(
              <div key={c} className="p-3 bg-orange-500/10 rounded-lg text-sm text-orange-200 text-center">{c}</div>
            ))}
          </div>
        </div>

        {/* Process States */}
        <h3 className="text-xl font-bold text-white mb-4">Process States</h3>
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {processStates.map((s, i) => (
            <div key={s.state} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-bold`}>{s.state[0]}</div>
              <div className="text-sm">
                <div className="text-white font-semibold">{s.state}</div>
                <div className="text-gray-400 text-xs">{s.desc}</div>
              </div>
              {i < processStates.length-1 && <span className="text-gray-600 text-lg ml-2">→</span>}
            </div>
          ))}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-bold text-white mb-2">Process Control Block (PCB)</h3>
          <p className="text-gray-300 text-sm mb-3">The PCB is the data structure used by the OS to store all information about a process. It's the "identity card" of a process in the kernel.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {['PID','Process State','Program Counter','CPU Registers','Memory Limits','Open Files','Priority','I/O Status'].map(f=>(
              <div key={f} className="p-2 bg-white/5 rounded-lg text-center text-gray-300 border border-white/10">{f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.2 Scheduling Criteria */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.2 Scheduling Criteria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { m: 'CPU Utilization', d: 'Keep CPU as busy as possible (40–90%). Maximize percentage of time CPU is doing useful work.', c: 'text-green-400' },
            { m: 'Throughput', d: 'Number of processes completed per unit time. Higher = better system performance.', c: 'text-cyan-400' },
            { m: 'Turnaround Time', d: 'Total time from submission to completion. Includes waiting, execution, I/O. Minimize.', c: 'text-fuchsia-400' },
            { m: 'Waiting Time', d: 'Time process spends waiting in ready queue. Should be minimized for better user experience.', c: 'text-orange-400' },
            { m: 'Response Time', d: 'Time from request submission until first response. Critical for interactive systems.', c: 'text-yellow-400' },
          ].map(item => (
            <div key={item.m} className="glass-card p-5">
              <h3 className={`font-bold text-lg mb-2 ${item.c}`}>{item.m}</h3>
              <p className="text-gray-400 text-sm">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Schedulers */}
        <h3 className="text-xl font-bold text-white mb-4">Types of Schedulers</h3>
        <div className="space-y-3">
          {schedulers.map(s => (
            <div key={s.type} className="glass-card p-5 flex items-start gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <h4 className={`font-bold text-lg mb-1 ${s.color}`}>{s.type}</h4>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.3 Scheduling Algorithms */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.3 CPU Scheduling Algorithms</h2>
        <div className="space-y-3">
          {schedulingAlgos.map(a => (
            <Accordion key={a.name} title={`${a.name} — ${a.full} (${a.type})`}>
              <p className="mt-2 mb-3">{a.desc}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-400 font-semibold mb-1 text-xs">✅ Pros</p>
                  <ul className="text-sm space-y-1">{a.pros.map(p=><li key={p}>• {p}</li>)}</ul>
                </div>
                <div>
                  <p className="text-red-400 font-semibold mb-1 text-xs">❌ Cons</p>
                  <ul className="text-sm space-y-1">{a.cons.map(c=><li key={c}>• {c}</li>)}</ul>
                </div>
              </div>
            </Accordion>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/sim/cpu-scheduling" className="btn-primary inline-flex items-center gap-2">
            🔬 Try CPU Scheduling Simulator →
          </Link>
        </div>
      </section>

      {/* 3.4 Threads */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.4 Threads & Multithreading</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass-card p-6">
            <h3 className="font-bold text-white text-lg mb-3">What is a Thread?</h3>
            <p className="text-gray-300 text-sm mb-3">A thread is the smallest unit of CPU execution within a process. Multiple threads share the process's code, data, and files, but each has its own stack, registers, and program counter.</p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>✅ Less overhead than creating new process</p>
              <p>✅ Faster context switch</p>
              <p>✅ Efficient resource sharing</p>
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold text-white text-lg mb-3">Thread Types</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <strong className="text-cyan-300">User-Level Threads:</strong>
                <p className="text-gray-300">Managed by user-space library. OS unaware. Fast but single-threaded for I/O.</p>
              </div>
              <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                <strong className="text-fuchsia-300">Kernel-Level Threads:</strong>
                <p className="text-gray-300">OS manages directly. True parallelism on multicore. More overhead but better for I/O.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 IPC & Synchronization */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.5 Inter-Process Communication & Synchronization</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {ipcMechanisms.map(m => (
            <div key={m.name} className="glass-card p-5 hover:border-orange-400/30 transition-all">
              <span className="text-2xl">{m.icon}</span>
              <h3 className="font-bold text-white mt-2 mb-1">{m.name}</h3>
              <p className="text-gray-400 text-sm">{m.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-4">Semaphores & Mutual Exclusion</h3>
        <div className="glass-card p-6 mb-4">
          <p className="text-gray-300 text-sm mb-4">A <strong className="text-cyan-300">semaphore</strong> is an integer variable accessed through two atomic operations:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl font-mono text-sm">
              <p className="text-green-300 font-bold">wait(S) / P(S):</p>
              <p className="text-gray-300 mt-1">while S ≤ 0 do nothing;<br/>S--;</p>
            </div>
            <div className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl font-mono text-sm">
              <p className="text-fuchsia-300 font-bold">signal(S) / V(S):</p>
              <p className="text-gray-300 mt-1">S++;</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3">Binary Semaphore (mutex): S ∈ {"{0,1}"}. Counting Semaphore: S can be any non-negative value.</p>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">Classic Synchronization Problems</h3>
        <div className="space-y-3">
          {syncProblems.map(p => (
            <div key={p.name} className="glass-card p-5">
              <h4 className="font-bold text-orange-300 mb-2">{p.name}</h4>
              <p className="text-gray-300 text-sm mb-2">{p.desc}</p>
              <div className="inline-block bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-1 text-xs text-orange-200">
                Solution: {p.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.6 Deadlock */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">3.6 Deadlock</h2>
        <div className="glass-card p-6 mb-5">
          <p className="text-gray-300 text-sm leading-relaxed">A <strong className="text-red-300">deadlock</strong> is a state where a set of processes are each waiting for a resource held by another process in the set, creating a circular dependency with no process able to proceed.</p>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">Necessary & Sufficient Conditions (Coffman Conditions)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {deadlockConditions.map(c => (
            <div key={c.name} className="glass-card p-5 hover:border-red-400/30 transition-all">
              <span className="text-2xl">{c.icon}</span>
              <h4 className="font-bold text-red-300 mt-2 mb-1">{c.name}</h4>
              <p className="text-gray-400 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-5 border border-green-400/30">
            <h4 className="font-bold text-green-300 mb-3">Deadlock Prevention</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Eliminate at least one of the 4 Coffman conditions</li>
              <li>• No Hold-and-Wait: request all resources at once</li>
              <li>• Preemption: forcibly take resources from processes</li>
              <li>• No Circular Wait: order resources numerically</li>
            </ul>
          </div>
          <div className="glass-card p-5 border border-yellow-400/30">
            <h4 className="font-bold text-yellow-300 mb-3">Deadlock Avoidance (Banker's Algorithm)</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• OS grants resource only if state remains safe</li>
              <li>• Safe state: exists at least one execution sequence that completes all processes</li>
              <li>• Requires advance knowledge of max resources needed</li>
              <li>• More flexible than prevention</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link to="/sim/deadlock" className="btn-primary inline-flex items-center gap-2">
            🔬 Try Deadlock Simulator →
          </Link>
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🧠 Process Management Quiz</h2>
        <div className="glass-card p-6 space-y-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="font-semibold text-white mb-3">{i+1}. {q.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((opt, j) => {
                  let cls = 'p-3 rounded-xl text-sm border border-white/10 cursor-pointer transition-all text-gray-300 hover:border-orange-400/40 hover:bg-white/5'
                  if (submitted) {
                    if (j === q.ans) cls += ' !border-green-400 !bg-green-500/10 !text-green-300 font-semibold'
                    else if (quizAns[i] === j && j !== q.ans) cls += ' !border-red-400 !bg-red-500/10 !text-red-300'
                  } else if (quizAns[i] === j) {
                    cls += ' !border-orange-400 !bg-orange-500/10 !text-orange-300'
                  }
                  return <button key={j} className={cls} onClick={() => !submitted && setQuizAns({ ...quizAns, [i]: j })}>{opt}</button>
                })}
              </div>
            </div>
          ))}
          {!submitted
            ? <button className="btn-primary w-full" onClick={() => setSubmitted(true)}>Submit Quiz</button>
            : <div className={`text-center py-3 rounded-xl font-bold text-lg ${score===quiz.length?'text-green-400 bg-green-500/10':'text-yellow-400 bg-yellow-500/10'}`}>
                Score: {score}/{quiz.length} {score===quiz.length?'🎉 Perfect!':'Keep practicing! 💪'}
              </div>
          }
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/module2" className="btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Module 2</Link>
        <Link to="/module4" className="btn-primary flex items-center gap-2">Module 4 →</Link>
      </div>
    </div>
  )
}
