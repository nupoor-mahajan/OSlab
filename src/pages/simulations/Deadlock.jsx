import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw, Plus, Trash2 } from 'lucide-react'

function detectDeadlock(processes, allocation, request, available) {
  const n = processes.length
  const m = available.length
  const work = [...available]
  const finish = new Array(n).fill(false)
  const safeSeq = []

  let changed = true
  while (changed) {
    changed = false
    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        let canFinish = true
        for (let j = 0; j < m; j++) {
          if (request[i][j] > work[j]) { canFinish = false; break }
        }
        if (canFinish) {
          finish[i] = true; changed = true; safeSeq.push(processes[i])
          for (let j = 0; j < m; j++) work[j] += allocation[i][j]
        }
      }
    }
  }

  const deadlocked = processes.filter((_, i) => !finish[i])
  return { safe: deadlocked.length === 0, safeSeq, deadlocked }
}

const RESOURCE_LABELS = ['R1','R2','R3']

export default function Deadlock() {
  const [numProcesses, setNumProcesses] = useState(4)
  const [numResources, setNumResources] = useState(3)
  const [available, setAvailable] = useState([3, 2, 2])
  const [allocation, setAllocation] = useState([
    [0,1,0],[2,0,0],[3,0,2],[2,1,1]
  ])
  const [maxNeed, setMaxNeed] = useState([
    [7,5,3],[3,2,2],[9,0,2],[2,2,2]
  ])
  const [result, setResult] = useState(null)

  const updateAvailable = (j, v) => {
    const a = [...available]; a[j] = Number(v); setAvailable(a); setResult(null)
  }

  const updateAlloc = (i, j, v) => {
    const a = allocation.map(r=>[...r]); a[i][j] = Number(v); setAllocation(a); setResult(null)
  }

  const updateMax = (i, j, v) => {
    const m = maxNeed.map(r=>[...r]); m[i][j] = Number(v); setMaxNeed(m); setResult(null)
  }

  const calculate = () => {
    const request = allocation.map((row, i) => row.map((alloc, j) => Math.max(0, maxNeed[i][j] - alloc)))
    const processes = Array.from({ length: numProcesses }, (_, i) => `P${i}`)
    const res = detectDeadlock(processes, allocation, request, available)
    const need = allocation.map((row, i) => row.map((alloc, j) => Math.max(0, maxNeed[i][j] - alloc)))
    setResult({ ...res, need })
  }

  const processes = Array.from({ length: numProcesses }, (_, i) => `P${i}`)
  const resources = Array.from({ length: numResources }, (_, j) => RESOURCE_LABELS[j] || `R${j+1}`)

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text mb-2">Deadlock Detector (Banker's Algorithm)</h1>
        <p className="text-gray-400">Input allocation and maximum need matrices. Detect deadlock using the Banker's Algorithm safety check.</p>
      </div>

      {/* Info Box */}
      <div className="glass-card p-5 mb-6 border-l-4 border-red-400">
        <h3 className="font-semibold text-red-300 mb-2">How Banker's Algorithm Works</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-300">
          <div className="p-2 bg-white/5 rounded-lg"><strong className="text-cyan-300">Allocation:</strong> Resources currently allocated to each process</div>
          <div className="p-2 bg-white/5 rounded-lg"><strong className="text-fuchsia-300">Max Need:</strong> Maximum resources each process may need</div>
          <div className="p-2 bg-white/5 rounded-lg"><strong className="text-orange-300">Need:</strong> Max - Allocation = remaining need</div>
          <div className="p-2 bg-white/5 rounded-lg"><strong className="text-green-300">Available:</strong> Currently free resources in system</div>
        </div>
        <p className="text-gray-400 text-xs mt-3">A state is <span className="text-green-300 font-semibold">safe</span> if there exists a sequence where every process can complete using currently available + released resources.</p>
      </div>

      {/* Config */}
      <div className="glass-card p-5 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Number of Processes</label>
            <input type="number" min="2" max="6" value={numProcesses}
              onChange={e => {
                const n = Number(e.target.value)
                setNumProcesses(n)
                setAllocation(Array.from({length:n},(_,i)=>allocation[i]||new Array(numResources).fill(0)))
                setMaxNeed(Array.from({length:n},(_,i)=>maxNeed[i]||new Array(numResources).fill(0)))
                setResult(null)
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-400" />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Number of Resource Types</label>
            <input type="number" min="1" max="5" value={numResources}
              onChange={e => {
                const m = Number(e.target.value)
                setNumResources(m)
                setAvailable(Array.from({length:m},(_,j)=>available[j]||0))
                setAllocation(allocation.map(row=>Array.from({length:m},(_,j)=>row[j]||0)))
                setMaxNeed(maxNeed.map(row=>Array.from({length:m},(_,j)=>row[j]||0)))
                setResult(null)
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-400" />
          </div>
        </div>

        {/* Available */}
        <div className="mb-5">
          <h4 className="text-green-300 font-semibold mb-2 text-sm">Available Resources</h4>
          <div className="flex gap-3 flex-wrap">
            {resources.map((r,j) => (
              <div key={j} className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{r}:</span>
                <input type="number" min="0" value={available[j]||0} onChange={e=>updateAvailable(j,e.target.value)}
                  className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-green-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Allocation */}
          <div>
            <h4 className="text-cyan-300 font-semibold mb-2 text-sm">Allocation Matrix</h4>
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-1 px-2 text-left">P</th>
                    {resources.map(r=><th key={r} className="py-1 px-2">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p,i) => (
                    <tr key={i}>
                      <td className="py-1 px-2 text-gray-400">{p}</td>
                      {resources.map((_,j) => (
                        <td key={j} className="py-1 px-2">
                          <input type="number" min="0" value={(allocation[i]||[])[j]||0} onChange={e=>updateAlloc(i,j,e.target.value)}
                            className="w-12 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-cyan-400" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Max Need */}
          <div>
            <h4 className="text-fuchsia-300 font-semibold mb-2 text-sm">Max Need Matrix</h4>
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-1 px-2 text-left">P</th>
                    {resources.map(r=><th key={r} className="py-1 px-2">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p,i) => (
                    <tr key={i}>
                      <td className="py-1 px-2 text-gray-400">{p}</td>
                      {resources.map((_,j) => (
                        <td key={j} className="py-1 px-2">
                          <input type="number" min="0" value={(maxNeed[i]||[])[j]||0} onChange={e=>updateMax(i,j,e.target.value)}
                            className="w-12 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-fuchsia-400" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={calculate} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
            <Play size={16} /> Detect Deadlock
          </button>
          <button onClick={() => setResult(null)} className="btn-secondary flex items-center gap-2"><RotateCcw size={16} /> Reset</button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`glass-card p-6 mb-6 border-2 ${result.safe ? 'border-green-400/50' : 'border-red-400/50'}`}>
          <div className={`text-2xl font-bold mb-3 ${result.safe ? 'text-green-400' : 'text-red-400'}`}>
            {result.safe ? '✅ System is in SAFE STATE — No Deadlock' : '❌ System is in UNSAFE STATE — DEADLOCK DETECTED'}
          </div>

          {result.safe ? (
            <div>
              <p className="text-gray-300 text-sm mb-3">Safe execution sequence found:</p>
              <div className="flex items-center gap-2 flex-wrap">
                {result.safeSeq.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 font-bold">{p}</span>
                    {i < result.safeSeq.length - 1 && <span className="text-gray-500">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 text-sm mb-3">Deadlocked processes (cannot proceed):</p>
              <div className="flex gap-2 flex-wrap">
                {result.deadlocked.map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-bold">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Need Matrix */}
          <div className="mt-5">
            <h4 className="text-orange-300 font-semibold mb-2 text-sm">Computed Need Matrix (Max - Allocation)</h4>
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-1 px-3 text-left">Process</th>
                    {resources.map(r=><th key={r} className="py-1 px-3">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p,i) => (
                    <tr key={i} className={`border-b border-white/5 ${result.deadlocked.includes(p) ? 'bg-red-500/10' : ''}`}>
                      <td className="py-1.5 px-3 text-gray-300 font-semibold">{p}</td>
                      {resources.map((_,j) => (
                        <td key={j} className={`py-1.5 px-3 text-center ${result.deadlocked.includes(p) ? 'text-red-300' : 'text-orange-300'}`}>
                          {(result.need[i]||[])[j]||0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
