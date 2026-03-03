import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

function Accordion({ title, children, accent = 'border-cyan-400' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
        <span className="font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-cyan-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className={`px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t ${accent} border-opacity-30`}>{children}</div>}
    </div>
  )
}

const partitionTypes = [
  { name: 'Fixed Partitioning', pros: ['Simple to implement', 'Fast allocation'], cons: ['Internal fragmentation', 'Fixed number of processes', 'Unused space in partitions'], color: 'border-cyan-400/40' },
  { name: 'Dynamic Partitioning', pros: ['No internal fragmentation', 'Flexible partition sizes'], cons: ['External fragmentation', 'Compaction overhead', 'Complex management'], color: 'border-fuchsia-400/40' },
]

const allocationStrategies = [
  { name: 'Best Fit', desc: 'Allocates the smallest hole that is large enough. Reduces wasted space but slow (must search all holes) and causes many tiny unusable holes.', icon: '🎯', color: 'text-green-400' },
  { name: 'First Fit', desc: 'Allocates the first hole that is large enough. Fast and simple. May leave larger holes at end.', icon: '⚡', color: 'text-cyan-400' },
  { name: 'Worst Fit', desc: 'Allocates the largest hole. Leaves the largest remaining hole after allocation. Poor performance overall.', icon: '💥', color: 'text-red-400' },
]

const cacheMappings = [
  { name: 'Direct Mapping', desc: 'Each memory block maps to exactly one cache line. Simple and fast but causes frequent conflicts.', formula: 'Line = Block mod Number_of_Lines' },
  { name: 'Associative Mapping', desc: 'A block can be placed in any cache line. Most flexible, but expensive hardware needed for parallel searching.', formula: 'Any block → Any cache line' },
  { name: 'Set-Associative Mapping', desc: 'Cache divided into sets. A block maps to a specific set but can go in any line within that set. Balance between speed and flexibility.', formula: 'Set = Block mod Number_of_Sets' },
]

const pageReplacementAlgos = [
  { name: 'FIFO', desc: 'Replace the page that has been in memory the longest. Simple but can replace heavily used pages (Belady\'s Anomaly possible).', icon: '📋' },
  { name: 'LRU (Least Recently Used)', desc: 'Replace the page that hasn\'t been used for the longest time. Good approximation of optimal. Requires tracking usage time.', icon: '🕐' },
  { name: 'Optimal', desc: 'Replace the page that won\'t be used for the longest time in the future. Theoretical minimum page faults — not implementable in practice.', icon: '✨' },
]

const quiz = [
  { q: 'What type of fragmentation occurs in Fixed Partitioning?', opts: ['External','Internal','Both','None'], ans: 1 },
  { q: 'Which page replacement algorithm gives minimum page faults theoretically?', opts: ['FIFO','LRU','Optimal','MRU'], ans: 2 },
  { q: 'What is a Page Fault?', opts: ['Disk error','Process crash','Required page not in RAM','Cache miss'], ans: 2 },
  { q: 'LRU stands for:', opts: ['Last Recently Used','Least Recently Used','Least Replacing Unit','Last Running Utility'], ans: 1 },
  { q: 'Which allocation strategy causes many tiny unusable holes?', opts: ['First Fit','Worst Fit','Best Fit','Round Robin'], ans: 2 },
]

export default function Module2() {
  const [quizAns, setQuizAns] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(quizAns).filter(([i, v]) => quiz[i].ans === v).length

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag">Module 2</span>
          <span className="tag">CO2</span>
          <span className="tag">8 Hours</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-500 text-transparent bg-clip-text mb-4">Memory Management</h1>
        <p className="text-gray-400 text-lg">Memory partitioning, fragmentation, allocation strategies, cache mapping, virtual memory, paging, segmentation, and page replacement.</p>
      </div>

      {/* 2.1 Requirements */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2.1 Memory Management Requirements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { r: 'Relocation', d: 'Programs can be loaded at different memory locations. OS must translate logical addresses to physical addresses.' },
            { r: 'Protection', d: 'Processes must not access memory of other processes. Hardware (MMU) enforces protection bits.' },
            { r: 'Sharing', d: 'Multiple processes can share certain memory regions (e.g., shared libraries, shared memory IPC).' },
            { r: 'Logical Organization', d: 'Memory viewed as linear array of bytes at hardware level, but organized as segments/pages at OS level.' },
            { r: 'Physical Organization', d: 'Actual RAM and secondary storage management. OS moves data between RAM and disk (swapping).' },
            { r: 'Efficiency', d: 'Minimize wasted memory. Maximize throughput by keeping as many processes in memory as possible.' },
          ].map(item => (
            <div key={item.r} className="glass-card p-5 hover:border-fuchsia-400/30 transition-all">
              <h3 className="font-bold text-fuchsia-300 mb-2">{item.r}</h3>
              <p className="text-gray-400 text-sm">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Partition Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {partitionTypes.map(p => (
            <div key={p.name} className={`glass-card p-6 border ${p.color}`}>
              <h3 className="font-bold text-white text-lg mb-3">{p.name}</h3>
              <div className="mb-3">
                <p className="text-green-400 text-xs font-semibold mb-1">✅ Advantages</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  {p.pros.map(x => <li key={x}>• {x}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-red-400 text-xs font-semibold mb-1">❌ Disadvantages</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  {p.cons.map(x => <li key={x}>• {x}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.2 Fragmentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2.2 Internal & External Fragmentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="glass-card p-6 border border-orange-400/30">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold text-orange-300 text-lg mb-2">Internal Fragmentation</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Wasted space <strong>inside</strong> an allocated partition. Occurs when a process is smaller than the partition it was assigned. Common in Fixed Partitioning.</p>
            <div className="mt-3 p-3 bg-orange-500/10 rounded-lg text-xs text-orange-200">Example: Partition = 100KB, Process = 70KB → 30KB wasted inside</div>
          </div>
          <div className="glass-card p-6 border border-red-400/30">
            <div className="text-3xl mb-3">🧩</div>
            <h3 className="font-bold text-red-300 text-lg mb-2">External Fragmentation</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Wasted space <strong>outside</strong> allocations. Total free memory is sufficient but split into non-contiguous small holes. Common in Dynamic Partitioning.</p>
            <div className="mt-3 p-3 bg-red-500/10 rounded-lg text-xs text-red-200">Solution: Compaction — shuffle memory contents to consolidate free space</div>
          </div>
        </div>

        {/* Allocation Strategies */}
        <h3 className="text-xl font-bold text-white mb-4">Allocation Strategies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {allocationStrategies.map(a => (
            <div key={a.name} className="glass-card p-5 text-center hover:scale-[1.02] transition-all">
              <div className="text-3xl mb-2">{a.icon}</div>
              <h3 className={`font-bold text-lg mb-2 ${a.color}`}>{a.name}</h3>
              <p className="text-gray-400 text-sm">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link to="/sim/memory-partitioning" className="btn-primary inline-flex items-center gap-2">
            🔬 Try Memory Partitioning Simulator →
          </Link>
        </div>
      </section>

      {/* 2.3 Cache Mapping */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2.3 Cache Memory Mapping Techniques</h2>
        <p className="text-gray-400 text-sm mb-5">Cache memory sits between CPU and RAM. Mapping techniques define how main memory blocks map to cache lines.</p>
        <div className="space-y-4">
          {cacheMappings.map(c => (
            <div key={c.name} className="glass-card p-6">
              <h3 className="font-bold text-white text-lg mb-2">{c.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{c.desc}</p>
              <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 font-mono text-cyan-300 text-sm">{c.formula}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.4 Virtual Memory */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2.4 Virtual Memory</h2>
        <Accordion title="What is Virtual Memory?" defaultOpen={false}>
          <p className="mt-3">Virtual memory allows processes to use more memory than physically available by storing parts of the process on disk (swap space). The OS uses the MMU to map virtual addresses to physical addresses transparently.</p>
          <p className="mt-2"><strong className="text-cyan-300">Key Benefits:</strong> Process isolation, larger address space, simplified programming model, efficient memory use.</p>
        </Accordion>
        <Accordion title="Paging">
          <p className="mt-3"><strong className="text-fuchsia-300">Paging</strong> divides both virtual memory and physical memory into fixed-size blocks called <em>pages</em> (virtual) and <em>frames</em> (physical). The OS maintains a <strong>Page Table</strong> for each process mapping virtual pages to physical frames.</p>
          <ul className="mt-2 space-y-1 ml-4">
            <li>• No external fragmentation (all frames same size)</li>
            <li>• Page size typically 4KB</li>
            <li>• TLB (Translation Lookaside Buffer) caches recent address translations</li>
          </ul>
        </Accordion>
        <Accordion title="Page Fault">
          <p className="mt-3">A <strong className="text-red-300">page fault</strong> occurs when a process accesses a virtual page that is NOT currently in RAM. The OS must:</p>
          <ol className="mt-2 space-y-1 ml-4 list-decimal">
            <li>Trap to OS (hardware interrupt)</li>
            <li>Find the page on disk</li>
            <li>Find or free a frame (evict a page if needed)</li>
            <li>Load the page into the frame</li>
            <li>Update the page table</li>
            <li>Restart the faulting instruction</li>
          </ol>
        </Accordion>
        <Accordion title="Page Allocation">
          <p className="mt-3">OS decides how many frames to allocate to each process:</p>
          <ul className="mt-2 space-y-1 ml-4">
            <li>• <strong className="text-cyan-300">Equal Allocation:</strong> Divide frames equally among all processes</li>
            <li>• <strong className="text-cyan-300">Proportional Allocation:</strong> Allocate frames proportional to process size</li>
            <li>• <strong className="text-orange-300">Thrashing:</strong> If too few frames, process constantly page faults → system spends more time paging than executing</li>
          </ul>
        </Accordion>
      </section>

      {/* 2.5 Segmentation + Page Replacement */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">2.5 Segmentation & Page Replacement</h2>
        <div className="glass-card p-6 mb-5">
          <h3 className="font-bold text-white text-lg mb-3">Segmentation</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">Segmentation divides memory into <strong className="text-cyan-300">variable-size segments</strong> based on logical program structure (code, data, stack). Each segment has a base address and limit. Contrast with paging (fixed size).</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Code Segment','Data Segment','Stack Segment','Heap Segment'].map(s=>(
              <div key={s} className="p-3 bg-white/5 rounded-xl text-center text-sm text-gray-300">{s}</div>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-4">Page Replacement Algorithms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {pageReplacementAlgos.map(a => (
            <div key={a.name} className="glass-card p-5 text-center hover:border-fuchsia-400/30 transition-all">
              <div className="text-3xl mb-2">{a.icon}</div>
              <h3 className="font-bold text-white mb-2">{a.name}</h3>
              <p className="text-gray-400 text-sm">{a.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/sim/page-replacement" className="btn-primary inline-flex items-center gap-2">
            🔬 Try Page Replacement Simulator →
          </Link>
        </div>
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">🧠 Memory Management Quiz</h2>
        <div className="glass-card p-6 space-y-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="font-semibold text-white mb-3">{i+1}. {q.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((opt, j) => {
                  let cls = 'p-3 rounded-xl text-sm border border-white/10 cursor-pointer transition-all text-gray-300 hover:border-fuchsia-400/40 hover:bg-white/5'
                  if (submitted) {
                    if (j === q.ans) cls += ' !border-green-400 !bg-green-500/10 !text-green-300 font-semibold'
                    else if (quizAns[i] === j && j !== q.ans) cls += ' !border-red-400 !bg-red-500/10 !text-red-300'
                  } else if (quizAns[i] === j) {
                    cls += ' !border-fuchsia-400 !bg-fuchsia-500/10 !text-fuchsia-300'
                  }
                  return <button key={j} className={cls} onClick={() => !submitted && setQuizAns({ ...quizAns, [i]: j })}>{opt}</button>
                })}
              </div>
            </div>
          ))}
          {!submitted
            ? <button className="btn-primary w-full" onClick={() => setSubmitted(true)}>Submit Quiz</button>
            : <div className={`text-center py-3 rounded-xl font-bold text-lg ${score===quiz.length?'text-green-400 bg-green-500/10':'text-yellow-400 bg-yellow-500/10'}`}>
                Score: {score}/{quiz.length} {score===quiz.length?'🎉 Perfect!':'Keep revising! 💪'}
              </div>
          }
        </div>
      </section>

      <div className="flex justify-between">
        <Link to="/module1" className="btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Module 1</Link>
        <Link to="/module3" className="btn-primary flex items-center gap-2">Module 3 →</Link>
      </div>
    </div>
  )
}
