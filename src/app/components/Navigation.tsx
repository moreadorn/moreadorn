import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Mail, Phone, Globe2 } from "lucide-react";
import { QuoteModal } from "./QuoteModal";
import { useCompanyContact } from "../hooks/useCompanyContact";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const location = useLocation();
  const contact = useCompanyContact();
  // Real values only — never render fake placeholder phone / email.
  const navEmail = (contact?.contact_email || "").trim();
  const navPhone = (contact?.phone || "").trim();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/markets", label: "Markets" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/policies", label: "Policies" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const openQuote = () => {
    setIsOpen(false);
    setQuoteOpen(true);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0B0B]/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-[#C8A96A]/20"
            : "bg-[#0B0B0B]"
        }`}
      >
        {/* Top contact bar — hides on scroll */}
        <div
          className={`hidden md:block border-b border-white/5 overflow-hidden transition-all duration-300 ${
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-8 flex items-center justify-between text-[10px] tracking-wider">
            <div className="flex items-center gap-6 text-gray-400">
              {navEmail ? (
                <a
                  href={`mailto:${navEmail}`}
                  className="flex items-center gap-2 hover:text-[#C8A96A] transition-colors"
                >
                  <Mail size={12} />
                  <span>{navEmail}</span>
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="flex items-center gap-2 hover:text-[#C8A96A] transition-colors"
                >
                  <Mail size={12} />
                  <span className="uppercase tracking-[0.2em]">
                    Reach our team
                  </span>
                </Link>
              )}
              {(navEmail || navPhone) && (
                <span className="w-px h-3 bg-white/10" />
              )}
              {navPhone && (
                <a
                  href={`tel:${navPhone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 hover:text-[#C8A96A] transition-colors"
                >
                  <Phone size={12} />
                  <span>{navPhone}</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Globe2 size={12} className="text-[#C8A96A]" />
              <span className="uppercase tracking-[0.2em]">
                Shipping to 50+ countries
              </span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C8A96A] to-[#E6D3A3] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-[#C8A96A]/20">
                <span className="text-[#0B0B0B] font-bold text-xl">M</span>
              </div>
              <div className="leading-none">
                <div className="text-xl font-bold text-white tracking-tight">
                  MORE
                  <span className="text-[#C8A96A]">ADORN</span>
                </div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-gray-500 mt-1">
                  Global Trade Co.
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-[13px] font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${
                    isActive(link.to)
                      ? "text-[#C8A96A]"
                      : "text-white/85 hover:text-[#C8A96A]"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] rounded-full" />
                  )}
                </Link>
              ))}
              <button
                onClick={openQuote}
                className="ml-2 group bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] px-7 py-2.5 rounded-full font-bold text-[13px] tracking-[0.1em] uppercase hover:shadow-lg hover:shadow-[#C8A96A]/40 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#0B0B0B]/98 backdrop-blur-lg border-t border-[#C8A96A]/20">
            <div className="px-6 py-8 space-y-5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block text-base font-semibold tracking-wider uppercase transition-colors ${
                    isActive(link.to)
                      ? "text-[#C8A96A]"
                      : "text-white/85 hover:text-[#C8A96A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={openQuote}
                className="w-full bg-gradient-to-r from-[#C8A96A] to-[#E6D3A3] text-[#0B0B0B] px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase mt-4"
              >
                Get Quote
              </button>
              <div className="pt-6 border-t border-white/10 space-y-3 text-sm text-gray-400">
                <a
                  href={`mailto:${navEmail}`}
                  className="flex items-center gap-3 hover:text-[#C8A96A]"
                >
                  <Mail size={14} />
                  {navEmail}
                </a>
                <a
                  href={`tel:${navPhone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 hover:text-[#C8A96A]"
                >
                  <Phone size={14} />
                  {navPhone}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
