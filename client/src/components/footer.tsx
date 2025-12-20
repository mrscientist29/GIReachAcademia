import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Stethoscope, Mail, Phone, MapPin, Settings, FileText, Users, Heart, Award, Star, Zap, Shield, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { logoStore, type LogoSettings } from "@/lib/logo-store";

// Icon mapping for logo icons
const iconMap = {
  Stethoscope,
  Settings,
  FileText,
  Users,
  Heart,
  Award,
  Star,
  Zap,
  Shield,
  Target
};

export default function Footer() {
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(logoStore.getLogoSettings());

  // Load logo settings on component mount and listen for changes
  useEffect(() => {
    const loadLogoSettings = () => {
      const settings = logoStore.getLogoSettings();
      setLogoSettings(settings);
    };

    // Initial load
    loadLogoSettings();

    // Listen for storage changes (when logo is updated from admin)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gireach-logo') {
        loadLogoSettings();
      }
    };

    // Listen for custom logo update events
    const handleLogoUpdate = (e: CustomEvent) => {
      loadLogoSettings();
    };

    // Listen for focus events (when user returns to tab)
    const handleFocus = () => {
      loadLogoSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logoUpdated', handleLogoUpdate as EventListener);
    window.addEventListener('focus', handleFocus);
    
    // Check for changes more frequently
    const interval = setInterval(() => {
      const currentSettings = logoStore.getLogoSettings();
      const currentSettingsStr = JSON.stringify(currentSettings);
      const prevSettingsStr = JSON.stringify(logoSettings);
      
      if (currentSettingsStr !== prevSettingsStr) {
        setLogoSettings(currentSettings);
      }
    }, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logoUpdated', handleLogoUpdate as EventListener);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [logoSettings]);

  const renderLogo = () => {
    const sizeClasses = "w-12 h-12";
    const textSizeClasses = logoSettings.fontSize || "text-2xl";
    
    return (
      <div className="flex items-center space-x-3 mb-6">
        {/* Logo Icon/Image */}
        {logoSettings.type === 'icon' && (
          <div className={`${sizeClasses} ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
            {(() => {
              const IconComponent = iconMap[logoSettings.iconName as keyof typeof iconMap] || Stethoscope;
              return <IconComponent className={`h-7 w-7 ${logoSettings.iconColor || 'text-white'}`} />;
            })()}
          </div>
        )}
        
        {logoSettings.type === 'image' && logoSettings.imageUrl && (
          <img 
            src={logoSettings.imageUrl} 
            alt="Logo"
            className={`${sizeClasses} object-cover ${logoSettings.borderRadius || 'rounded-xl'}`}
            style={{
              width: logoSettings.imageWidth || 48,
              height: logoSettings.imageHeight || 48
            }}
          />
        )}
        
        {logoSettings.type === 'text' && (
          <div className={`${sizeClasses} ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
            <span className={`${logoSettings.fontWeight || 'font-bold'} ${logoSettings.iconColor || 'text-white'} text-lg`}>
              {logoSettings.primaryText.charAt(0)}
            </span>
          </div>
        )}

        {/* Logo Text */}
        <div>
          <h3 className={`${textSizeClasses} ${logoSettings.fontWeight || 'font-bold'} text-white`} data-testid="footer-brand">
            {logoSettings.primaryText}
          </h3>
          {logoSettings.showSecondaryText && logoSettings.secondaryText && (
            <p className="text-gray-400 text-sm">
              {logoSettings.secondaryText}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 relative overflow-hidden" data-testid="footer">
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            {renderLogo()}
            <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-md">
              Advancing medical research in Pakistan through collaborative excellence, mentorship, and innovative gastroenterology studies.
            </p>
            <div className="flex space-x-4" data-testid="social-links">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg">
                <Linkedin className="h-6 w-6" data-testid="social-linkedin" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex items-center justify-center hover:from-sky-600 hover:to-sky-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg">
                <Twitter className="h-6 w-6" data-testid="social-twitter" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl flex items-center justify-center hover:from-blue-800 hover:to-blue-900 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg">
                <Facebook className="h-6 w-6" data-testid="social-facebook" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg">
                <Instagram className="h-6 w-6" data-testid="social-instagram" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="footer-quick-links-title">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-home">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-about">About Us</Link></li>
              <li><Link href="/programs" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-programs">Programs</Link></li>
              <li><Link href="/publications" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-publications">Publications</Link></li>
              <li><Link href="/resources" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-resources">Resources</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-1 inline-block" data-testid="footer-link-contact">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="footer-contact-title">Contact Info</h4>
            <ul className="space-y-6">
              <li className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-email">info@gireach.pk</span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-phone">+92 (21) 1234-5678</span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-location">Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm" data-testid="footer-copyright">
              &copy; 2024 GI REACH. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
