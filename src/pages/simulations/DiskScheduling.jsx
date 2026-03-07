import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Activity, Info, TrendingUp, BookOpen } from 'lucide-react';

/** * DISK SCHEDULING LOGIC FUNCTIONS 
 */
const calcFCFS = (requests, head) => {
  const seq = [head, ...requests];
  let movement = 0;
  for (let i = 1; i < seq.length; i++) movement += Math.abs(seq[i] - seq[i - 1]);
  return { seq, movement };
};

const calcSSTF = (requests, head) => {
  const reqs = [...requests];
  const seq = [head];
  let movement = 0;
  let cur = head;
  while (reqs.length) {
    let minIdx = 0;
    let minDist = Math.abs(reqs[0] - cur);
    reqs.forEach((r, i) => {
      const d = Math.abs(r - cur);
      if (d < minDist) { minDist = d; minIdx = i; }
    });
    const dist = Math.abs(reqs[minIdx] - cur);
    cur = reqs[minIdx];
    seq.push(cur);
    movement += dist;
    reqs.splice(minIdx, 1);
  }
  return { seq, movement };
};

const calcSCAN = (requests, head, direction, diskSize) => {
  const reqs = [...requests].sort((a, b) => a - b);
  const left = reqs.filter(r => r <= head).reverse();
  const right = reqs.filter(r => r > head);
  let seq = [head];
  let movement = 0;
  let cur = head;

  if (direction === 'right') {
    right.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
    if (left.length) { movement += Math.abs(diskSize - 1 - cur); cur = diskSize - 1; seq.push(cur); }
    left.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
  } else {
    left.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
    if (right.length) { movement += Math.abs(cur); cur = 0; seq.push(0); }
    right.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
  }
  return { seq, movement };
};

const calcCSCAN = (requests, head, diskSize) => {
  const reqs = [...requests].sort((a, b) => a - b);
  const right = reqs.filter(r => r >= head);
  const left = reqs.filter(r => r < head);
  let seq = [head];
  let movement = 0;
  let cur = head;

  right.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
  if (left.length) {
    movement += Math.abs(diskSize - 1 - cur);
    seq.push(diskSize - 1);
    movement += (diskSize - 1); 
    seq.push(0);
    cur = 0;
    left.forEach(r => { movement += Math.abs(r - cur); cur = r; seq.push(r); });
  }
  return { seq, movement };
};

export default function DiskScheduling() {
  const [algo, setAlgo] = useState('FCFS');
  const [head, setHead] = useState(50);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState('right');
  const [reqStr, setReqStr] = useState('98 183 37 122 14 124 65 67');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const requests = reqStr.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0 && n < diskSize);
    let res;
    if (algo === 'FCFS') res = calcFCFS(requests, head);
    else if (algo === 'SSTF') res = calcSSTF(requests, head);
    else if (algo === 'SCAN') res = calcSCAN(requests, head, direction, diskSize);
    else if (algo === 'C-SCAN') res = calcCSCAN(requests, head, diskSize);
    else res = calcFCFS(requests, head);
    setResult({ ...res, requests });
  };

  const algoDesc = {
    FCFS: 'First-Come-First-Served: Requests are addressed in the order they arrive. No optimization occurs.',
    SSTF: 'Shortest Seek Time First: Selects the request with the minimum seek time from the current head position.',
    SCAN: 'Elevator Algorithm: The arm moves toward one end of the disk, servicing requests until it reaches the end, then reverses.',
    'C-SCAN': 'Circular SCAN: Services requests in one direction then jumps back to the start, providing more uniform wait times.',
  };

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto bg-[#0a0a0f] text-white">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 md:mb-10 transition-colors text-base md:text-xl font-medium">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="mb-8 md:mb-14 text-center md:text-left">
        <h1 className="text-3xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text leading-tight">
          Disk Scheduling <span className="text-white">Laboratory</span>
        </h1>
        <p className="text-base md:text-2xl text-gray-400 max-w-4xl leading-relaxed">Visualize and analyze secondary storage arm movements to optimize seek time efficiency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10 mb-10 md:mb-14">
        {/* Controls Sidebar - Stacked on mobile */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-8 border-white/10 lg:sticky lg:top-32">
            <h3 className="text-white font-bold text-xs md:text-base uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-3">
              <Activity size={18} className="text-green-400" /> Lab Configuration
            </h3>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Scheduling Strategy</label>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {['FCFS','SSTF','SCAN','C-SCAN'].map(a => (
                    <button key={a} onClick={() => { setAlgo(a); setResult(null); }}
                      className={`px-3 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-base font-bold transition-all text-center lg:text-left ${algo === a ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Initial Head: <span className="text-green-400">{head}</span></label>
                <input type="range" min="0" max={diskSize - 1} value={head} onChange={e => {setHead(Number(e.target.value)); setResult(null);}} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500" />
              </div>

              {algo === 'SCAN' && (
                <div>
                  <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-3 block">Direction</label>
                  <select value={direction} onChange={e => {setDirection(e.target.value); setResult(null);}} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm md:text-base text-white outline-none">
                    <option value="right">Right (Increasing)</option>
                    <option value="left">Left (Decreasing)</option>
                  </select>
                </div>
              )}

              <button onClick={calculate} className="w-full bg-green-500 hover:bg-green-400 text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl shadow-green-500/10">
                Start Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Results and Main Plot */}
        <div className="lg:col-span-3 space-y-6 md:space-y-10">
          <div className="glass-card p-6 md:p-10 border-white/10">
            <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Request Queue (Track Numbers)</label>
            <input value={reqStr} onChange={e => {setReqStr(e.target.value); setResult(null);}}
              className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-8 text-xl md:text-3xl text-green-400 font-mono focus:border-green-500 outline-none transition-all"
              placeholder="e.g. 98, 183, 37" />
          </div>

          {result && (
            <div className="glass-card p-4 md:p-12 border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <h3 className="text-white font-bold mb-8 md:mb-14 text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-3 px-2">
                <TrendingUp size={18} className="text-green-400" /> Seek Path Analysis
              </h3>
              
              <div className="relative w-full overflow-x-auto no-scrollbar">
                {/* Responsive SVG wrapper */}
                <svg 
                  viewBox={`0 0 1000 ${result.seq.length * 60 + 100}`} 
                  className="w-full min-w-[600px] h-auto overflow-visible"
                >
                  <line x1="0" y1="0" x2="1000" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  
                  {[0, 50, 100, 150, 199].map(t => (
                    <text key={t} x={(t / 199) * 1000} y="-20" textAnchor="middle" fill="#666" fontSize="18" fontWeight="bold">
                      {t}
                    </text>
                  ))}

                  <polyline
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={result.seq.map((track, i) => {
                      const x = (track / 199) * 1000;
                      const y = i * 60 + 40;
                      return `${x},${y}`;
                    }).join(' ')}
                    className="drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                  />

                  {result.seq.map((t, i) => {
                    const x = (t / 199) * 1000;
                    const y = i * 60 + 40;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="10" fill={i === 0 ? "#fff" : "#4ade80"} />
                        <text x={x + 20} y={y + 8} fill={i === 0 ? "#fff" : "#4ade80"} fontSize="22" fontWeight="900" fontFamily="monospace">
                          {t}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="glass-card p-6 md:p-10 border-green-500/20 flex flex-col justify-center">
                <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Total Seek Distance</div>
                <div className="text-4xl md:text-6xl font-black text-green-400">{result.movement} <span className="text-sm md:text-2xl font-normal text-gray-500 uppercase">tracks</span></div>
              </div>
              <div className="glass-card p-6 md:p-10 border-cyan-500/20">
                <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">Traversal Sequence</div>
                <div className="text-sm md:text-xl font-mono text-cyan-400 flex flex-wrap gap-2">
                  {result.seq.join(' → ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lab Theory & Observations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-8 md:mt-16">
        <div className="glass-card p-6 md:p-12 border-white/5 bg-white/[0.02]">
          <h4 className="text-white font-bold text-xl md:text-2xl mb-6 md:mb-8 flex items-center gap-3 text-green-400">
            <BookOpen size={24} /> Theory & Observations
          </h4>
          <div className="text-gray-400 text-sm md:text-lg leading-relaxed space-y-4 md:space-y-6">
            <p><strong className="text-white font-bold italic">Strategy:</strong> {algo}</p>
            <p className="text-xs md:text-lg">{algoDesc[algo]}</p>
            <p className="bg-green-500/10 p-4 md:p-5 rounded-2xl border border-green-500/20 text-green-300 text-xs md:text-base">
              <Info size={16} className="inline mr-2" /> 
              {algo === 'SSTF' ? 'SSTF minimizes total movement but can cause starvation of distant requests.' : 'Visualization shows the arm servicing requests in a single sweep.'}
            </p>
          </div>
        </div>

        <div className="glass-card p-6 md:p-12 border-white/5 bg-white/[0.02] flex flex-col justify-between">
           <h4 className="text-white font-bold text-xl md:text-2xl mb-6 md:mb-8 flex items-center gap-3 text-green-400">
            <TrendingUp size={24} /> Performance
          </h4>
          <div className="space-y-6 md:space-y-8">
            <div className="p-6 md:p-8 bg-black/40 rounded-3xl border border-white/10 text-center">
              <div className="text-[10px] md:text-sm text-gray-500 uppercase font-bold tracking-widest mb-2">Efficiency Metric</div>
              <div className="text-2xl md:text-4xl font-bold text-white">Over-head: {result ? (result.movement / result.requests.length).toFixed(1) : '—'} <span className="text-xs md:text-lg">tracks/req</span></div>
            </div>
             <p className="text-xs md:text-lg text-gray-500 italic text-center leading-relaxed">
               Lower traverse distance directly results in lower mechanical latency and faster data throughput.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}