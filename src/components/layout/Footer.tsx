import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  'For Students': [
    { href: '/explore', label: 'Find Tutors' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ],
  'For Tutors': [
    { href: '/register', label: 'Become a Tutor' },
    { href: '/tutor/resources', label: 'Resources' },
    { href: '/tutor/guidelines', label: 'Guidelines' },
    { href: '/tutor/support', label: 'Support' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Edu<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              AI-powered tutor marketplace connecting students with the perfect tutors.
              Personalized learning, powered by artificial intelligence.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@edupro.com" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                hello@edupro.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} EduPro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
