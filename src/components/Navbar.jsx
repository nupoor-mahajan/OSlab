import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Cpu } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Module 1 – OS Concepts', path: '/module1' },
  { label: 'Module 2 – Memory', path: '/module2' },
  { label: 'Module 3 – Processes', path: '/module3' },
  { label: 'Module 4 – File & I/O', path: '/module4' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  return (
    // Increased height from h-14 to h-20 and improved backdrop blur
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        
        {/* Brand Logo - Changed from OSMicro to OS LAB */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-xl tracking-tight leading-none">
              OS<span className="text-cyan-400">LAB</span>
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Virtual Laboratory</span>
          </div>
        </Link>

        {/* Desktop Navigation - Increased font size and spacing */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link 
              key={l.path} 
              to={l.path}
              className={`text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                loc.pathname === l.path 
                ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu - Improved padding and font size */}
      {open && (
        <div className="md:hidden bg-[#0a0a0f] border-b border-white/10 px-6 py-8 flex flex-col gap-5 animate-in slide-in-from-top duration-300">
          {navLinks.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              onClick={() => setOpen(false)}
              className={`text-lg font-medium ${
                loc.pathname === l.path ? 'text-cyan-400' : 'text-gray-300'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}