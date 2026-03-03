import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Play, RotateCcw, BarChart3, Info } from 'lucide-react'

const COLORS = ['#0bdada', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa', '#f87171']

// --- Logic functions remain the same as your original code ---
function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival)
  let time = 0; const result = []
  for (const p of sorted) {
    if (time < p.arrival) time = p.arrival
    const start = time
    time += p.burst
    result.push({ ...p, start, finish: time, waiting: start - p.arrival, turnaround: time - p.arrival })
  }
  return result
}

function sjf(processes) {
  const procs = processes.map(p => ({ ...p, done: false }))
  let time = 0; const result = []; const n = procs.length
  for (let i = 0; i < n; i++) {
    const available = procs.filter(p => !p.done && p.arrival <= time)
    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter(p => !p.done).map(p => p.arrival))
      time = nextArrival; i--; continue
    }
    const p = available.reduce((a, b) => a.burst < b.burst ? a : b)
    const start = time; time += p.burst
    p.done = true
    result.push({ ...p, start, finish: time, waiting: start - p.arrival, turnaround: time - p.arrival })
  }
  return result
}

function priorityAlgo(processes) {
  const procs = processes.map(p => ({ ...p, done: false }))
  let time = 0; const result = []; const n = procs.length
  for (let i = 0; i < n; i++) {
    const available = procs.filter(p => !p.done && p.arrival <= time)
    if (available.length === 0) {
      const nextArrival = Math.min(...procs.filter(p => !p.done).map(p => p.arrival))
      time = nextArrival; i--; continue
    }
    const p = available.reduce((a, b) => a.priority < b.priority ? a : b)
    const start = time; time += p.burst
    p.done = true
    result.push({ ...p, start, finish: time, waiting: start - p.arrival, turnaround: time - p.arrival })
  }
  return result
}

function roundRobin(processes, quantum) {
  const q = Number(quantum) || 2
  const procs = processes.map(p => ({ ...p, rem: p.burst, finished: false })).sort((a, b) => a.arrival - b.arrival)
  let time = 0; const gantt = []; const result = {}
  const ready = []; let idx = 0
  while (true) {
    while (idx < procs.length && procs[idx].arrival <= time) ready.push(procs[idx++])
    if (ready.length === 0) {
      if (idx >= procs.length) break
      time = procs[idx].arrival; continue
    }
    const p = ready.shift()
    const run = Math.min(p.rem, q)
    gantt.push({ id: p.id, start: time, end: time + run })
    time += run; p.rem -= run
    while (idx < procs.length && procs[idx].arrival <= time) ready.push(procs[idx++])
    if (p.rem > 0) ready.push(p)
    else {
      result[p.id] = { ...p, finish: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst }
    }
  }
  return { gantt, result: Object.values(result) }
}

export default function CpuScheduling() {
  const [algo, setAlgo] = useState('FCFS')
  const [quantum, setQuantum] = useState(2)
  const [processes, setProcesses] = useState([
    { id: 'P1', arrival: 0, burst: 6, priority: 2 },
    { id: 'P2', arrival: 2, burst: 4, priority: 1 },
    { id: 'P3', arrival: 4, burst: 2, priority: 3 },
  ])
  const [result, setResult] = useState(null)
  const [gantt, setGantt] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  const colorMap = useMemo(() => {
    const map = {}
    processes.forEach((p, i) => { map[p.id] = COLORS[i % COLORS.length] })
    return map
  }, [processes])

  const addProcess = () => {
    const id = `P${processes.length + 1}`
    setProcesses([...processes, { id, arrival: 0, burst: 4, priority: 1 }])
  }

  const removeProcess = (i) => setProcesses(processes.filter((_, idx) => idx !== i))

  const updateProcess = (i, field, val) => {
    const p = [...processes]
    p[i] = { ...p[i], [field]: field === 'id' ? val : Number(val) }
    setProcesses(p)
  }

  // --- Comparison Logic ---
  const comparisonData = useMemo(() => {
    if (processes.length === 0) return []
    const algos = [
      { name: 'FCFS', res: fcfs(processes) },
      { name: 'SJF', res: sjf(processes) },
      { name: 'Priority', res: priorityAlgo(processes) },
      { name: 'RR', res: roundRobin(processes, quantum).result }
    ]
    return algos.map(a => ({
      name: a.name,
      avgWT: (a.res.reduce((s, r) => s + r.waiting, 0) / a.res.length).toFixed(2),
      avgTAT: (a.res.reduce((s, r) => s + r.turnaround, 0) / a.res.length).toFixed(2)
    }))
  }, [processes, quantum])

  const calculate = () => {
    let res, g = []
    if (algo === 'FCFS') res = fcfs(processes)
    else if (algo === 'SJF') res = sjf(processes)
    else if (algo === 'Priority') res = priorityAlgo(processes)
    else { const rr = roundRobin(processes, quantum); res = rr.result; g = rr.gantt }
    setResult(res)
    setGantt(algo === 'RR' ? g : res.map(r => ({ id: r.id, start: r.start, end: r.finish })))
  }

  const reset = () => { setResult(null); setGantt([]); setShowComparison(false) }

  const totalTime = gantt.length ? Math.max(...gantt.map(g => g.end)) : 1
  const avgWT = result ? (result.reduce((s, r) => s + r.waiting, 0) / result.length).toFixed(2) : 0
  const avgTAT = result ? (result.reduce((s, r) => s + r.turnaround, 0) / result.length).toFixed(2) : 0

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">CPU Scheduling <span className="text-cyan-400">Lab</span></h1>
          <p className="text-gray-400">Perform algorithmic experiments and analyze performance metrics.</p>
        </div>
        <button 
          onClick={() => setShowComparison(!showComparison)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${showComparison ? 'bg-fuchsia-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
          <BarChart3 size={18} /> {showComparison ? "Close Comparison" : "Compare All Algorithms"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Comparison View */}
          {showComparison && (
            <div className="bg-gradient-to-br from-fuchsia-500/10 to-purple-500/5 border border-fuchsia-500/20 rounded-3xl p-6 animate-in zoom-in-95 duration-300">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="text-fuchsia-400" size={20} /> Comparative Performance Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comparisonData.map(data => (
                  <div key={data.name} className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                    <div className="text-fuchsia-400 font-bold text-lg mb-2">{data.name}</div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Avg Waiting:</span>
                      <span className="text-white font-mono">{data.avgWT}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg Turnaround:</span>
                      <span className="text-white font-mono">{data.avgTAT}ms</span>
                    </div>
                    {/* Tiny visual bar */}
                    <div className="mt-3 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-fuchsia-500" style={{width: `${(1 - data.avgWT/20) * 100}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table and Config */}
          <div className="glass-card p-6 border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
               <div className="flex gap-2">
                 {['FCFS','SJF','Priority','RR'].map(a => (
                    <button key={a} onClick={() => { setAlgo(a); reset() }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${algo === a ? 'bg-cyan-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                      {a}
                    </button>
                 ))}
               </div>
               {algo === 'RR' && (
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-gray-500 text-xs font-bold uppercase">Quantum</span>
                  <input type="number" value={quantum} onChange={e=>setQuantum(e.target.value)} className="w-12 bg-transparent text-cyan-400 font-bold outline-none" />
                </div>
               )}
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-white/5 text-left uppercase text-[10px] tracking-widest">
                    <th className="pb-3 px-2">Process</th>
                    <th className="pb-3 px-2">Arrival</th>
                    <th className="pb-3 px-2">Burst</th>
                    {algo === 'Priority' && <th className="pb-3 px-2">Priority</th>}
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {processes.map((p, i) => (
                    <tr key={i} className="group">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ background: colorMap[p.id] }} />
                          <input value={p.id} onChange={e=>updateProcess(i,'id',e.target.value)} className="bg-transparent text-white font-medium outline-none w-12" />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={p.arrival} onChange={e=>updateProcess(i,'arrival',e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 w-16 text-white" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={p.burst} onChange={e=>updateProcess(i,'burst',e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 w-16 text-white" />
                      </td>
                      {algo === 'Priority' && (
                        <td className="py-3 px-2">
                          <input type="number" value={p.priority} onChange={e=>updateProcess(i,'priority',e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 w-16 text-white" />
                        </td>
                      )}
                      <td className="py-3 px-2 text-right">
                        <button onClick={() => removeProcess(i)} className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4">
              <button onClick={addProcess} className="flex-1 border border-dashed border-white/20 hover:border-cyan-500/50 py-3 rounded-2xl text-gray-500 hover:text-cyan-400 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                <Plus size={16} /> Add Process
              </button>
              <button onClick={calculate} className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 rounded-2xl font-bold transition-all flex items-center gap-2">
                <Play size={16} /> Run Simulation
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* Gantt Chart */}
{gantt.length > 0 && (
  <div className="glass-card p-6">
    <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Execution Timeline (Gantt Chart)</h3>
    
    {/* The Chart Bar */}
    <div className="relative h-12 w-full flex rounded-xl overflow-hidden bg-white/5 border border-white/10">
      {gantt.map((seg, i) => (
        <div 
          key={i} 
          className="h-full flex items-center justify-center text-[10px] font-black text-black border-r border-black/20 transition-all hover:brightness-110"
          style={{ 
            width: `${((seg.end - seg.start) / totalTime) * 100}%`, 
            background: colorMap[seg.id] || '#4a5568',
            minWidth: '24px' 
          }}
        >
          {seg.id}
        </div>
      ))}
    </div>

    {/* The Aligned Timestamps */}
    <div className="relative h-6 w-full mt-2">
      {/* Starting Zero */}
      <span className="absolute left-0 text-[10px] font-mono text-gray-500 transform -translate-x-1/2">0</span>
      
      {/* End of every segment */}
      {gantt.map((seg, i) => (
        <span 
          key={i} 
          className="absolute text-[10px] font-mono text-gray-500 transform -translate-x-1/2"
          style={{ left: `${(seg.end / totalTime) * 100}%` }}
        >
          {seg.end}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap gap-3 mt-6">
      {processes.map(p => (
        <div key={p.id} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <div className="w-2 h-2 rounded-full" style={{ background: colorMap[p.id] }} />
          <span className="text-gray-400">{p.id}</span>
        </div>
      ))}
    </div>
  </div>
)}

              {/* Metrics Table */}
              <div className="glass-card overflow-hidden">
                 <table className="w-full text-sm">
                    <thead className="bg-white/5">
                       <tr className="text-gray-400 text-left text-[10px] uppercase tracking-widest">
                          <th className="p-4">Process</th>
                          <th className="p-4">Finish</th>
                          <th className="p-4">Waiting</th>
                          <th className="p-4">Turnaround</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {result.map(r => (
                         <tr key={r.id}>
                            <td className="p-4 font-bold" style={{color: colorMap[r.id]}}>{r.id}</td>
                            <td className="p-4 text-white">{r.finish}ms</td>
                            <td className="p-4 text-orange-400">{r.waiting}ms</td>
                            <td className="p-4 text-cyan-400">{r.turnaround}ms</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Knowledge Base */}
        <div className="space-y-6">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-6">
            <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <Info size={18} /> Algorithmic Logic
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white text-xs font-bold uppercase mb-1">Convoy Effect (FCFS)</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Occurs when short processes wait for one long process to finish. Resulting in poor average waiting time.</p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase mb-1">Starvation (SJF/Priority)</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Longer or lower-priority processes may never execute if short/high-priority ones keep arriving.</p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase mb-1">Response Time (RR)</h4>
                <p className="text-gray-400 text-xs leading-relaxed">Round Robin is designed for time-sharing systems to ensure no process monopolizes the CPU.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-white/10">
            <h3 className="text-white font-bold mb-4">Lab Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-orange-400">{avgWT}ms</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Average Waiting Time</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-cyan-400">{avgTAT}ms</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Average Turnaround Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}