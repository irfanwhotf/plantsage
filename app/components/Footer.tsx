export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
              About Me
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              Hi! I'm Mohammed Irfan, the developer behind Plant Sage. I'm passionate about combining technology 
              with nature to help people identify and learn about plants. Plant Sage is my contribution to making 
              plant identification accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                  Plant Identification
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                  Care Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                  Plant Database
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase mb-4">
              Connect With Me
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://www.instagram.com/irfanwhotf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200 flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @irfanwhotf
                </a>
              </li>
              <li>
                <a 
                  href="mailto:mohammediirfan2006@gmail.com"
                  className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200 flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  mohammediirfan2006@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.buymeacoffee.com/mohammedirfan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-500 hover:text-emerald-600 transition-colors duration-200 flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
                  </svg>
                  Buy me a coffee
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Plant Sage. Made with 💚 by Mohammed Irfan
          </p>
        </div>
      </div>
    </footer>
  );
}
