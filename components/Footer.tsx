import { Plane, Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/20 mt-24 bg-surface/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Plane className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">TravelAI</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your AI-powered travel companion. Plan perfect trips with advanced AI technology
              and discover amazing destinations around the world.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@travelai.com"
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/itinerary" className="text-gray-400 hover:text-primary transition-colors">
                  Plan Trip
                </Link>
              </li>
              <li>
                <Link href="/suggestions" className="text-gray-400 hover:text-primary transition-colors">
                  Discover
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TravelAI. Built with AI and powered by Azure OpenAI.
          </p>
        </div>
      </div>
    </footer>
  );
}
