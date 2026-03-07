import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Info, BarChart3, Activity, BookOpen } from 'lucide-react';

/**
 * PAGE REPLACEMENT ALGORITHMS
 */

// FIFO Logic
const runFIFO = (pages, framesCount) => {
  let memory = [];
  let faults = 0;
  const steps = [];
  const queue = [];

  pages.forEach((page) => {
    let fault = false;
    let replacedIndex = -1;

    if (!memory.includes(page)) {
      fault = true;
      faults++;
      if (memory.length < framesCount) {
        memory.push(page);
        queue.push(page);
        replacedIndex = memory.length - 1;
      } else {
        const victim = queue.shift();
        replacedIndex = memory.indexOf(victim);
        memory[replacedIndex] = page;
        queue.push(page);
      }
    }
    steps.push({ page, memory: [...memory], fault, replacedIndex });
  });
  return { steps, faults, hits: pages.length - faults };
};

// LRU Logic
const runLRU = (pages, framesCount) => {
  let memory = [];
  let faults = 0;
  const steps = [];

  pages.forEach((page) => {
    let fault = false;
    let replacedIndex = -1;

    if (!memory.includes(page)) {
      fault = true;
      faults++;
      if (memory.length < framesCount) {
        memory.push(page);
        replacedIndex = memory.length - 1;
      } else {
        // Find least recently used by looking back at steps
        // For simplicity in this demo, we track order of access
        const victim = memory[0]; 
        replacedIndex = 0;
        memory.shift();
        memory.push(page);
      }
    } else {
      // Hit: Move to most recently used (end of array)
      memory.splice(memory.indexOf(page), 1);
      memory.push(page);
    }
    steps.push({ page, memory: [...memory], fault, replacedIndex });
  });
  return { steps, faults, hits: pages.length - faults };
};

// Optimal Logic
const runOptimal = (pages, framesCount) => {
  let memory = [];
  let faults = 0;
  const steps = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    let fault = false;
    let replacedIndex = -1;

    if (!memory.includes(page)) {
      fault = true;
      faults++;
      if (memory.length < framesCount) {
        memory.push(page);
        replacedIndex = memory.length - 1;
      } else {
        let farthest = -1;
        let victimIndex = 0;
        for (let j = 0; j < memory.length; j++) {
          const nextUse = pages.slice(i + 1).indexOf(memory[j]);
          if (nextUse === -1) {
            victimIndex = j;
            break;
          }
          if (nextUse > farthest) {
            farthest = nextUse;
            victimIndex = j;
          }
        }
        memory[victimIndex] = page;
        replacedIndex = victimIndex;
      }
    }
    steps.push({ page, memory: [...memory], fault, replacedIndex });
  }
  return { steps, faults, hits: pages.length - faults };
};

export default function PageReplacement() {
  const [algo, setAlgo] = useState('FIFO');
  const [frames, setFrames] = useState(3);
  const [pageStr, setPageStr] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2');
  const [result, setResult] = useState(null);

  const pagesArr = useMemo(() => 
    pageStr.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n)), 
  [pageStr]);

  const calculate = () => {
    if (pagesArr.length === 0) return;
    let res = algo === 'FIFO' ? runFIFO(pagesArr, frames) : algo === 'LRU' ? runLRU(pagesArr, frames) : runOptimal(pagesArr, frames);
    setResult({ ...res, pages: pagesArr });
  };

  const hitRatio = result ? ((result.hits / result.pages.length) * 100).toFixed(1) : 0;
  const missRatio = result ? ((result.faults / result.pages.length) * 100).toFixed(1) : 0;

 return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto bg-[#0a0a0f] text-white">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 mb-6 md:mb-10 transition-colors text-base md:text-lg font-medium">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">Page Replacement <span className="text-orange-400">Lab</span></h1>
        <p className="text-base md:text-xl text-gray-400 max-w-3xl">Analyze and visualize how the Operating System manages demand paging and handles page faults.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* Sidebar Config - Stacked on mobile, sticky on desktop */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 md:p-8 border-white/10 lg:sticky lg:top-32">
            <h3 className="text-white font-bold text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-3">
              <Activity size={18} className="text-orange-400" /> Experiment Config
            </h3>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Select Algorithm</label>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
                  {['FIFO', 'LRU', 'Optimal'].map(a => (
                    <button key={a} onClick={() => { setAlgo(a); setResult(null); }}
                      className={`px-3 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-base font-bold transition-all text-center lg:text-left ${algo === a ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Physical Frames: {frames}</label>
                <input type="range" min="1" max="6" value={frames} onChange={e => { setFrames(Number(e.target.value)); setResult(null); }} 
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              <button onClick={calculate} className="w-full bg-orange-500 hover:bg-orange-400 text-black py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/10">
                Execute Simulation
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6 md:space-y-8">
          <div className="glass-card p-6 md:p-8 border-white/10">
            <label className="text-gray-400 text-[10px] md:text-sm font-bold uppercase mb-4 block">Reference String (Page Requests)</label>
            <input 
              value={pageStr} 
              onChange={e => { setPageStr(e.target.value); setResult(null); }}
              className="w-full bg-black/40 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-6 text-xl md:text-3xl text-orange-400 font-mono focus:border-orange-500 outline-none transition-all shadow-inner" 
            />
          </div>

          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="glass-card p-6 md:p-8 border-red-500/20 flex justify-between items-center">
                <div>
                  <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Page Faults</div>
                  <div className="text-3xl md:text-5xl font-black text-red-500">{result.faults}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Miss Ratio</div>
                  <div className="text-xl md:text-3xl font-bold text-red-500/80">{missRatio}%</div>
                </div>
              </div>
              <div className="glass-card p-6 md:p-8 border-green-500/20 flex justify-between items-center">
                <div>
                  <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Page Hits</div>
                  <div className="text-3xl md:text-5xl font-black text-green-500">{result.hits}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Hit Ratio</div>
                  <div className="text-xl md:text-3xl font-bold text-green-500/80">{hitRatio}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frame Trace - Added specialized scroll container */}
      {result && (
        <div className="glass-card p-6 md:p-10 border-white/10 mb-8 md:mb-12">
          <h3 className="text-white font-bold mb-8 md:mb-12 text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> Temporal Memory Analysis
          </h3>
          
          <div className="overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
            <div className="flex gap-4 md:gap-8 min-w-max">
              {result.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-[10px] md:text-sm font-mono text-gray-600 mb-3 uppercase">T-{i}</div>
                  
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-xl font-black mb-6 md:mb-8 border-2 ${
                    step.fault ? 'border-red-500/40 text-red-500 bg-red-500/5' : 'border-green-500/40 text-green-500 bg-green-500/5'
                  }`}>
                    {step.page}
                  </div>
                  
                  <div className="flex flex-col-reverse gap-2 md:gap-3 p-2 md:p-3 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5">
                    {Array.from({ length: frames }, (_, j) => {
                      const content = step.memory[j];
                      const isNew = step.fault && j === step.replacedIndex;
                      return (
                        <div key={j} className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-sm md:text-lg font-black transition-all duration-300 ${
                          content !== undefined 
                            ? isNew ? 'bg-orange-500 text-black scale-105 md:scale-110 shadow-lg shadow-orange-500/40' : 'bg-white/10 text-white'
                            : 'bg-transparent border border-white/10 text-gray-800'
                        }`}>
                          {content !== undefined ? content : ''}
                        </div>
                      );
                    })}
                  </div>
                  <div className={`mt-4 md:mt-6 text-[9px] md:text-xs font-black uppercase tracking-widest ${step.fault ? 'text-red-500' : 'text-green-500'}`}>
                    {step.fault ? 'Miss' : 'Hit'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Theory & Formulas Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="glass-card p-6 md:p-10 border-white/5">
          <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6 flex items-center gap-3 text-orange-400">
            <BookOpen size={24} /> Theory
          </h4>
          <div className="text-gray-400 text-sm md:text-base leading-relaxed space-y-4 md:space-y-6">
            <p>
              <strong className="text-white">Demand Paging:</strong> Pages are loaded into memory only when they are required. When the CPU requests a page not in memory, a <span className="text-red-400 font-bold uppercase tracking-tighter">Page Fault</span> occurs.
            </p>
            <p>
              <strong className="text-white">Victim Selection:</strong> When memory frames are full, the OS replaces a page based on {algo}.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 md:p-10 border-white/5">
          <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6 flex items-center gap-3 text-orange-400">
            <BarChart3 size={24} /> Formulas
          </h4>
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 rounded-2xl border border-white/5 gap-2">
              <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">Hit Ratio</span>
              <span className="text-white font-mono text-sm md:text-lg">($Hits / Total$) × 100</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 rounded-2xl border border-white/5 gap-2">
              <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-widest">Miss Ratio</span>
              <span className="text-white font-mono text-sm md:text-lg">($Faults / Total$) × 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}