import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Scale, 
  History, 
  Bot, 
  User, 
  Gavel, 
  BookOpen,
  Globe,
  Search,
  Zap
} from 'lucide-react'
import StickyNav from '../components/StickyNav'

export default function HomePage() {
  const { token } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] scroll-smooth">
      <StickyNav />
      
      {/* Hero Section */}
      <motion.section 
        id="home"
        className="container py-60 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          variants={itemVariants}
        >
          AI-Powered Virtual Assistant for the{' '}
          <motion.span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Department of Justice
          </motion.span>
        </motion.h1>
        <motion.p 
          className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Get instant answers to judiciary-related queries anytime, anywhere.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link to="/chat" className="btn-primary text-lg px-8 py-3">
            Start Chat
          </Link>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about"
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div className="max-w-4xl mx-auto text-center" variants={containerVariants}>
          <motion.h2 className="text-3xl font-bold mb-6" variants={itemVariants}>About the Chatbot</motion.h2>
          <motion.p 
            className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
            variants={itemVariants}
          >
            Our AI-powered virtual assistant provides instant, accurate responses to judiciary-related queries 
            using advanced natural language processing. Built with security and accessibility in mind, it serves 
            as a bridge between citizens and the Department of Justice, making legal information more accessible 
            and reducing the burden on traditional helpdesks.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Key Features */}
      <motion.section 
        id="features"
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>Key Features</motion.h2>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          <motion.div 
            className="card p-6 text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h3 className="font-semibold mb-2">24/7 Assistance</h3>
            <p className="text-sm text-neutral-500">Round-the-clock availability for all your judiciary queries</p>
          </motion.div>
          <motion.div 
            className="card p-6 text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Scale className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="font-semibold mb-2">Easy Access to DoJ Services</h3>
            <p className="text-sm text-neutral-500">Direct links and guidance to Department of Justice resources</p>
          </motion.div>
          <motion.div 
            className="card p-6 text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <History className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h3 className="font-semibold mb-2">Chat History & Secure Login</h3>
            <p className="text-sm text-neutral-500">Secure authentication with persistent chat history</p>
          </motion.div>
          <motion.div 
            className="card p-6 text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </motion.div>
            <h3 className="font-semibold mb-2">AI-powered Q&A</h3>
            <p className="text-sm text-neutral-500">Advanced NLP for accurate and contextual responses</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>How It Works</motion.h2>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
            </motion.div>
            <h3 className="font-semibold mb-2">Login / Register</h3>
            <p className="text-sm text-neutral-500">Create your secure account or sign in</p>
          </motion.div>
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-green-600 dark:text-green-400 font-bold">2</span>
            </motion.div>
            <h3 className="font-semibold mb-2">Create a Chat</h3>
            <p className="text-sm text-neutral-500">Start a new conversation session</p>
          </motion.div>
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
            </motion.div>
            <h3 className="font-semibold mb-2">Ask Questions</h3>
            <p className="text-sm text-neutral-500">Type your judiciary-related queries</p>
          </motion.div>
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
            </motion.div>
            <h3 className="font-semibold mb-2">Get Instant Responses</h3>
            <p className="text-sm text-neutral-500">Receive accurate answers powered by AI</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Use Cases */}
      <motion.section 
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>Applications / Use Cases</motion.h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div 
            className="card p-6 group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Citizens</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
              <li>• Filing cases and legal documents</li>
              <li>• Paying fines and fees</li>
              <li>• Accessing legal aid information</li>
              <li>• Understanding court procedures</li>
            </ul>
          </motion.div>
          <motion.div 
            className="card p-6 group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Gavel className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Lawyers</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
              <li>• Quick reference for judiciary processes</li>
              <li>• Case law and precedent lookup</li>
              <li>• Court schedule and filing deadlines</li>
              <li>• Legal form assistance</li>
            </ul>
          </motion.div>
          <motion.div 
            className="card p-6 group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Students</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
              <li>• Access to judiciary knowledge</li>
              <li>• Legal research assistance</li>
              <li>• Understanding legal concepts</li>
              <li>• Career guidance in law</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Why It Matters */}
      <motion.section 
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 className="text-3xl font-bold text-center mb-12" variants={itemVariants}>Why It Matters</motion.h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Globe className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Improves Access to Justice</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Democratizes legal information and makes justice more accessible to all citizens</p>
          </motion.div>
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-16 h-16 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Increases Transparency</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Provides clear, consistent information about legal processes and procedures</p>
          </motion.div>
          <motion.div 
            className="text-center group cursor-pointer"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="mb-4 flex justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-3">Reduces Manual Dependency</h3>
            <p className="text-neutral-600 dark:text-neutral-400">Decreases burden on traditional helpdesks and manual support systems</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Get Started */}
      <motion.section 
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div className="max-w-2xl mx-auto text-center" variants={containerVariants}>
          <motion.h2 className="text-3xl font-bold mb-6" variants={itemVariants}>Get Started Today</motion.h2>
          <motion.p 
            className="text-lg text-neutral-600 dark:text-neutral-400 mb-8"
            variants={itemVariants}
          >
            Join thousands of users who are already benefiting from our AI-powered judiciary assistant.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            {token ? (
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/chat" className="btn-primary text-lg px-8 py-3">
                    Go to Chat
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/login" className="btn-primary text-lg px-8 py-3">
                      Login
                    </Link>
                  </motion.div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/register" className="btn-ghost text-lg px-8 py-3">
                      Register
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-neutral-200 dark:border-neutral-800 mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div className="container py-12" variants={containerVariants}>
          <motion.div className="grid md:grid-cols-2 gap-8" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Useful Links</h3>
              <div className="space-y-2">
                <motion.a 
                  href="https://www.justice.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Department of Justice
                </motion.a>
                <motion.a 
                  href="https://ecourts.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  eCourts
                </motion.a>
                <motion.a 
                  href="https://njdg.ecourts.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  NJDG
                </motion.a>
                <motion.a 
                  href="https://www.tele-law.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-sm text-neutral-600 dark:text-neutral-400 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Tele-Law
                </motion.a>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Credits</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Developed as a Minor Project, BPIT
              </p>
            </motion.div>
          </motion.div>
          <motion.div 
            className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-500"
            variants={itemVariants}
          >
            © {new Date().getFullYear()} DoJ Chatbot. All rights reserved.
          </motion.div>
        </motion.div>
      </motion.footer>
    </div>
  )
}
