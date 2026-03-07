import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Plus, Trash2, Info, AlertTriangle } from 'lucide-react'

const COLORS = ['#0bdada', '#f472b6', '#fb923c', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa', '#f87171', '#10b981', '#8b5cf6']

/**
 * Core Allocation Logic for Fixed Partitioning
 */
function allocate(partitions, processes, strategy) {
  const parts = partitions.map((size, i) => ({ 
    id: i, 
    size, 
    used: 0, 
    process: null, 
    free: size 
  }))
  
  const results = []

  for (const proc of processes) {
    let chosen = null
    const available = parts.filter(p => p.process === null && p.size >= proc.size)

    if (strategy === 'First Fit') {
      chosen = available[0]
    } else if (strategy === 'Best Fit') {
      chosen = available.reduce((best, p) => (!best || p.size < best.size) ? p : best, null)
    } else if (strategy === 'Worst Fit') {
      chosen = available.reduce((best, p) => (!best || p.size > best.size) ? p : best, null)
    }

    if (chosen) {
      chosen.used = proc.size
      chosen.free = chosen.size - proc.size
      chosen.process = proc.name
      results.push({ 
        process: proc.name, 
        size: proc.size, 
        partition: chosen.id + 1, 
        internal: chosen.free,
        status: 'Allocated'
      })
    } else {
      results.push({ 
        process: proc.name, 
        size: proc.size, 
        partition: null, 
        internal: 0,
        status: 'Not Fit'
      })
    }
  }
  return { parts, results }
}

export default function MemoryPartitioning() {
  const [strategy, setStrategy] = useState('Best Fit')
  const [partitions, setPartitions] = useState([300, 200, 150, 250, 100])
  const [processes, setProcesses] = useState([
    { name: 'P1', size: 120 },
    { name: 'P2', size: 200 },
    { name: 'P3', size: 50 },
    { name: 'P4', size: 270 },
  ])
  const [result, setResult] = useState(null)

  const addPartition = () => setPartitions([...partitions, 100])
  const removePartition = i => setPartitions(partitions.filter((_, idx) => idx !== i))
  const updatePartition = (i, v) => { 
    const p = [...partitions]; 
    p[i] = Math.max(0, Number(v)); 
    setPartitions(p) 
  }

  const addProcess = () => setProcesses([...processes, { name: `P${processes.length + 1}`, size: 50 }])
  const removeProcess = i => setProcesses(processes.filter((_, idx) => idx !== i))
  const updateProcess = (i, f, v) => { 
    const p = [...processes]; 
    p[i] = { ...p[i], [f]: f === 'name' ? v : Number(v) }; 
    setProcesses(p) 
  }

  const calculate = () => setResult(allocate(partitions, processes, strategy))
  const reset = () => { setResult(null); }

  const totalPartitionsSize = useMemo(() => partitions.reduce((a, b) => a + b, 0), [partitions])

  const externalFragProcesses = useMemo(() => {
    if (!result) return []
    const totalFreeMemory = result.parts.reduce((acc, p) => acc + p.free, 0)
    return result.results.filter(r => r.status === 'Not Fit' && r.size <= totalFreeMemory)
  }, [result])

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-4 max-w-6xl mx-auto bg-[#0a0a0f]">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-fuchsia-400 mb-6 md:mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Memory Partitioning <span className="text-fuchsia-500">Lab</span></h1>
        <p className="text-gray-400 text-sm md:text-base">Fixed partition allocation simulation with fragmentation analysis.</p>
      </div>

      {/* Configuration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        
        {/* Allocation Strategy Selection */}
        <div className="lg:col-span-3 glass-card p-4 md:p-6 border-white/10">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
            <Info size={14} className="text-fuchsia-500" /> Select Strategy
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            {['First Fit', 'Best Fit', 'Worst Fit'].map(s => (
              <button 
                key={s} 
                onClick={() => { setStrategy(s); reset(); }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${strategy === s ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Partition Inputs */}
        <div className="glass-card p-4 md:p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">Partitions (KB)</h3>
            <button onClick={addPartition} className="text-fuchsia-400 hover:text-white transition-colors"><Plus size={18} /></button>
          </div>
          <div className="space-y-3 max-h-[300px] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
            {partitions.map((size, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <input 
                  type="number" 
                  value={size} 
                  onChange={e => updatePartition(i, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-fuchsia-500 outline-none text-sm font-mono"
                />
                <button onClick={() => removePartition(i)} className="p-2 text-gray-600 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Process Inputs */}
        {/* Process Inputs */}
<div className="lg:col-span-2 glass-card p-4 md:p-6 flex flex-col">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">Incoming Processes (KB)</h3>
    <button onClick={addProcess} className="text-fuchsia-400 hover:text-white transition-colors">
      <Plus size={18} />
    </button>
  </div>

  {/* Grid Container with min-w-0 on children to prevent overflow */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
    {processes.map((p, i) => (
      <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5 min-w-0">
        <input 
          value={p.name} 
          onChange={e => updateProcess(i, 'name', e.target.value)}
          className="w-10 md:w-14 bg-transparent text-fuchsia-400 font-bold outline-none shrink-0 text-xs md:text-sm"
        />
        
        {/* The flex-1 wrapper and min-w-0 here are the magic fix */}
        <div className="flex-1 min-w-0 relative">
          <input 
            type="number" 
            value={p.size} 
            onChange={e => updateProcess(i, 'size', e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-white text-sm outline-none focus:border-fuchsia-500/50"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono pointer-events-none">KB</span>
        </div>

        <button 
          onClick={() => removeProcess(i)} 
          className="p-2 text-gray-600 hover:text-red-500 shrink-0 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
  </div>

  {/* Action Buttons */}
  <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
    <button onClick={calculate} className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-fuchsia-500/20">
      <Play size={18} fill="currentColor" /> Run Allocation
    </button>
    <button onClick={reset} className="py-3 px-6 border border-white/10 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center">
      <RotateCcw size={18} />
    </button>
  </div>
</div>
</div>
      {/* Visual Results Section */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Vertical Memory Stack */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="glass-card p-4 md:p-6 lg:sticky lg:top-24">
              <h3 className="text-white font-bold mb-6 text-xs md:text-sm uppercase tracking-widest">Memory Stack View</h3>
              
              <div className="relative w-full border-2 border-white/10 rounded-2xl overflow-hidden bg-black/60 flex flex-col shadow-2xl">
                {result.parts.map((part, i) => {
                  const allocPct = (part.used / part.size) * 100
                  const freePct = (part.free / part.size) * 100
                  const blockColor = COLORS[i % COLORS.length]
                  
                  return (
                    <div 
                      key={i} 
                      className="relative border-b border-white/5 last:border-0 flex flex-col"
                      style={{ height: `${Math.max((part.size / totalPartitionsSize) * 500, 80)}px` }}
                    >
                      {/* Process (Allocated Space) */}
                      {part.used > 0 && (
                        <div 
                          className="w-full flex flex-col items-center justify-center text-[10px] md:text-[11px] font-black text-black transition-all"
                          style={{ height: `${allocPct}%`, background: blockColor }}
                        >
                          <span>{part.process}</span>
                          <span className="opacity-70">{part.used}KB</span>
                        </div>
                      )}
                      
                      {/* Fragmentation (Wasted/Free Space) */}
                      {part.free > 0 && (
                        <div 
                          className="w-full flex items-center justify-center text-[9px] md:text-[10px] font-bold transition-all relative"
                          style={{ 
                            height: `${freePct}%`, 
                            backgroundColor: `${blockColor}15`,
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, ${blockColor}20 8px, ${blockColor}20 16px)`
                          }}
                        >
                          <span className="text-white/40 uppercase tracking-tighter px-2 text-center">
                            {part.free}K {part.process ? 'Wasted' : 'Free'}
                          </span>
                        </div>
                      )}

                      <div className="absolute right-2 md:right-3 bottom-1 text-[8px] md:text-[9px] text-gray-600 font-mono">
                        P-{i+1}: {part.size}KB
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 md:mt-8 space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-fuchsia-500" /> Allocated Process
                </div>
                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded opacity-30 border border-white/20" style={{ backgroundImage: `repeating-linear-gradient(45deg, #fff, #fff 2px, transparent 2px, transparent 4px)` }} /> Int. Fragmentation
                </div>
              </div>
            </div>
          </div>

          {/* Table and Analysis */}
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
            
            {/* External Fragmentation Alert */}
            {externalFragProcesses.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row gap-4">
                <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h4 className="text-amber-500 font-bold mb-1 text-sm md:text-base">External Fragmentation Alert</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    Processes <b>{externalFragProcesses.map(p => p.process).join(', ')}</b> could not be allocated despite having {result.parts.reduce((a,p)=>a+p.free,0)}KB total free space.
                  </p>
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 md:p-6 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-white font-bold text-sm md:text-base">Allocation Results — {strategy}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-white/5">
                    <tr className="text-gray-500 text-left text-[10px] uppercase tracking-widest">
                      <th className="p-4">Process</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Partition</th>
                      <th className="p-4 text-orange-400">Int. Frag</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.results.map((r, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-white">{r.process}</td>
                        <td className="p-4 text-gray-400 font-mono">{r.size}KB</td>
                        <td className="p-4 text-fuchsia-400 font-mono">{r.partition ? `PART-${r.partition}` : '—'}</td>
                        <td className="p-4 text-orange-400 font-mono">{r.partition ? `${r.internal}KB` : '—'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase ${r.partition ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-4 md:p-6 border-orange-500/20">
                <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Internal Fragmentation</div>
                <div className="text-2xl md:text-3xl font-black text-orange-400">
                  {result.results.reduce((s, r) => s + (r.partition ? r.internal : 0), 0)} <span className="text-xs md:text-sm font-normal">KB</span>
                </div>
              </div>
              <div className="glass-card p-4 md:p-6 border-fuchsia-500/20">
                <div className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Free Memory</div>
                <div className="text-2xl md:text-3xl font-black text-fuchsia-400">
                  {result.parts.reduce((acc, curr) => acc + curr.free, 0)} <span className="text-xs md:text-sm font-normal">KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}