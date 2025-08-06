import React from 'react';
import { Music, Github, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/your-org/djfly',
      icon: Github,
      label: 'Visit our GitHub repository',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/djfly',
      icon: Twitter,
      label: 'Follow us on Twitter',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/djfly',
      icon: Instagram,
      label: 'Follow us on Instagram',
    },
    {
      name: 'Contact',
      href: 'mailto:contact@djfly.app',
      icon: Mail,
      label: 'Send us an email',
    },
  ];

  const footerLinks = [
    { name: 'Privacy Policy', href: ROUTES.PRIVACY },
    { name: 'Terms of Service', href: ROUTES.TERMS },
    { name: 'Contact Us', href: ROUTES.CONTACT },
    { name: 'Help Center', href: ROUTES.HELP },
  ];

  return (
    <footer
      className="bg-rich-black/90 backdrop-blur-sm border-t border-white/10 py-12"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-8 md:mb-0">
            <Link to={ROUTES.HOME} className="flex items-center">
              <Music
                className="h-8 w-8 text-electric-blue"
                aria-hidden="true"
              />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-electric-blue to-bright-turquoise bg-clip-text text-transparent">
                DJfly
              </span>
            </Link>
          </div>

          <div className="flex justify-center space-x-6 md:order-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={item.label}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {footerLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <p className="mt-8 text-xs text-gray-500 md:mt-0 md:order-1">
            &copy; {currentYear} DJfly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
