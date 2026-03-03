import { Link } from 'react-router-dom'
import { Cpu, Database, GitBranch, HardDrive, ArrowRight, Users, BookOpen, Award } from 'lucide-react'

const modules = [
  {
    id: 1, path: '/module1', icon: Cpu, hours: 6, co: 'CO1',
    title: 'OS Concepts',
    desc: 'Processes, address spaces, files, I/O, protection, shell, types of OS',
    color: 'from-cyan-400 to-blue-500',
    glow: 'hover:shadow-cyan-500/20',
    border: 'hover:border-cyan-400/40',
    topics: ['OS Roles', 'Types of OS', 'Shell & Protection', 'Address Spaces'],
  },
  {
    id: 2, path: '/module2', icon: Database, hours: 8, co: 'CO2',
    title: 'Memory Management',
    desc: 'Partitioning, fragmentation, virtual memory, paging, segmentation, LRU/FIFO',
    color: 'from-fuchsia-400 to-pink-500',
    glow: 'hover:shadow-fuchsia-500/20',
    border: 'hover:border-fuchsia-400/40',
    topics: ['Fixed/Dynamic Partitioning', 'Virtual Memory', 'Page Replacement', 'Cache Mapping'],
  },
  {
    id: 3, path: '/module3', icon: GitBranch, hours: 8, co: 'CO3',
    title: 'Process Management',
    desc: 'Schedulers, CPU scheduling, IPC, synchronization, deadlock, threads',
    color: 'from-orange-400 to-yellow-400',
    glow: 'hover:shadow-orange-500/20',
    border: 'hover:border-orange-400/40',
    topics: ['CPU Scheduling', 'Deadlock', 'IPC & Sync', 'Semaphores'],
  },
  {
    id: 4, path: '/module4', icon: HardDrive, hours: 8, co: 'CO4',
    title: 'File & I/O Management',
    desc: 'File systems, allocation methods, disk scheduling, I/O hardware, storage',
    color: 'from-green-400 to-emerald-500',
    glow: 'hover:shadow-green-500/20',
    border: 'hover:border-green-400/40',
    topics: ['File Allocation', 'Disk Scheduling', 'I/O Management', 'Storage'],
  },
]

const simCards = [
  { title: 'CPU Scheduling', desc: 'FCFS, SJF, Priority, Round Robin with Gantt chart', path: '/sim/cpu-scheduling', color: 'from-cyan-500 to-blue-600' },
  { title: 'Memory Partitioning', desc: 'Fixed & dynamic partitioning, Best/First/Worst Fit', path: '/sim/memory-partitioning', color: 'from-fuchsia-500 to-purple-600' },
  { title: 'Page Replacement', desc: 'FIFO, LRU, Optimal algorithm simulation', path: '/sim/page-replacement', color: 'from-orange-500 to-yellow-500' },
  { title: 'Disk Scheduling', desc: 'FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK', path: '/sim/disk-scheduling', color: 'from-green-500 to-emerald-500' },
  { title: 'Deadlock Simulator', desc: 'Resource allocation & deadlock detection', path: '/sim/deadlock', color: 'from-red-500 to-pink-600' },
]

export default function Home() {
  return (
    // Increased pt-14 to pt-24 to account for the larger navbar
    <div className="min-h-screen pt-24 bg-[#0a0a0f]">
      
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl animate-float" style={{animationDelay:'2s'}} />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Operating Systems Virtual Laboratory
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 text-transparent bg-clip-text">
              OS Laboratory
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore and visualize core Operating Systems algorithms through high-fidelity interactive simulations and comprehensive module resources.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link to="/module1" className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
              Explore Modules <ArrowRight size={18} />
            </Link>
            <Link to="/sim/cpu-scheduling" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
              Virtual Simulators <Cpu size={18} />
            </Link>
          </div>

          {/* Stats / Quick Links */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[
              { icon: BookOpen, val: '4', label: 'Theory Modules' },
              { icon: Award, val: 'Full', label: 'Course Coverage' },
              { icon: Users, val: '5+', label: 'Lab Simulators' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Icon size={24} className="text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-left mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">Laboratory Curriculum</h2>
          <p className="text-gray-400 max-w-2xl">Access detailed theoretical concepts and visual guides for each module of the Operating Systems course.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map(m => {
            const Icon = m.icon
            return (
              <Link key={m.id} to={m.path}
                className={`group relative bg-white/5 border border-white/10 p-8 rounded-3xl transition-all duration-300 ${m.border} ${m.glow}`}>
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon size={30} className="text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">{m.co}</span>
                      <span className="text-xs text-gray-500 font-medium tracking-wider">{m.hours} HOURS</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{m.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {m.topics.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full text-[10px] bg-white/5 text-gray-400 border border-white/10 uppercase tracking-tighter">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Simulations Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Virtual Experiments</h2>
          <p className="text-gray-400">Step-by-step algorithmic visualization tools for lab practicals.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {simCards.map(s => (
            <Link key={s.path} to={s.path}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} mb-6 flex items-center justify-center shadow-lg`}>
                <Cpu size={24} className="text-black" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-cyan-400 transition-colors">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{s.desc}</p>
              <div className="flex items-center text-cyan-400 text-sm font-bold gap-2 group-hover:translate-x-1 transition-all">
                LAUNCH SIMULATOR <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-gray-500 text-sm font-medium tracking-widest uppercase mb-4">
            Operating Systems Virtual Lab — 2025
          </div>
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full max-w-md mx-auto rounded-full opacity-30" />
        </div>
      </footer>
    </div>
  )
}