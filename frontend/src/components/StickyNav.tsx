import { motion } from 'framer-motion'
import { useTheme } from '../theme/ThemeContext'

export default function StickyNav() {
  const { theme, toggle } = useTheme()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' }
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10">{item.label}</span>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />

          {/* Theme Toggle */}
          <motion.button
            onClick={toggle}
            className="group relative inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 w-8 h-8 transition-colors overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600"
            aria-label="Toggle theme"
            title="Toggle theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-6"
              initial={false}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </motion.span>
            <motion.span 
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-6 group-hover:translate-y-0"
              initial={false}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
