import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Stethoscope, Mail, Phone, MapPin, Settings, FileText, Users, Heart, Award, Star, Zap, Shield, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { logoStore, type LogoSettings } from "@/lib/logo-store";
import { footerStore, type FooterSettings, type SocialLink } from "@/lib/footer-store";

// Icon mapping for logo icons
const logoIconMap = {
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

// Icon mapping for social media
const socialIconMap = {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin
};

export default function FooterDynamic() {
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(logoStore.getLogoSettings());
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(footerStore.getFooterSettings());

  // Load settings on component mount and listen for changes
  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        // Load logo settings
        const logoData = logoStore.getLogoSettings();
        if (mounted) setLogoSettings(logoData);

        // Load footer settings from database
        const footerData = await footerStore.loadFooterSettings();
        if (mounted) setFooterSettings(footerData);
      } catch (error) {
        console.warn('FooterDynamic: Error loading settings:', error);
        // Use cached/default settings
        if (mounted) {
          setLogoSettings(logoStore.getLogoSettings());
          setFooterSettings(footerStore.getFooterSettings());
        }
      }
    };

    loadSettings();

    // Listen for logo updates
    const handleLogoUpdate = (e: CustomEvent) => {
      if (mounted) {
        const settings = logoStore.getLogoSettings();
        setLogoSettings(settings);
      }
    };

    // Listen for footer updates
    const handleFooterUpdate = (e: CustomEvent) => {
      if (mounted) {
        console.log('FooterDynamic: Footer updated via event', e.detail.settings);
        setFooterSettings(e.detail.settings);
      }
    };

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (!mounted) return;
      
      if (e.key === 'gireach-logo') {
        const settings = logoStore.getLogoSettings();
        setLogoSettings(settings);
      } else if (e.key === 'gireach-footer') {
        const settings = footerStore.getFooterSettings();
        setFooterSettings(settings);
      }
    };

    // Listen for focus events (when user returns to tab)
    const handleFocus = () => {
      if (mounted) {
        loadSettings();
      }
    };

    window.addEventListener('logoUpdated', handleLogoUpdate as EventListener);
    window.addEventListener('footerUpdated', handleFooterUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    // Check for changes periodically
    const interval = setInterval(() => {
      if (!mounted) return;
      
      const currentLogoSettings = logoStore.getLogoSettings();
      const currentFooterSettings = footerStore.getFooterSettings();
      
      const logoChanged = JSON.stringify(currentLogoSettings) !== JSON.stringify(logoSettings);
      const footerChanged = JSON.stringify(currentFooterSettings) !== JSON.stringify(footerSettings);
      
      if (logoChanged) {
        setLogoSettings(currentLogoSettings);
      }
      if (footerChanged) {
        setFooterSettings(currentFooterSettings);
      }
    }, 1000);

    return () => {
      mounted = false;
      window.removeEventListener('logoUpdated', handleLogoUpdate as EventListener);
      window.removeEventListener('footerUpdated', handleFooterUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [logoSettings, footerSettings]);

  const renderLogo = () => {
    const sizeClasses = "w-12 h-12";
    const textSizeClasses = logoSettings.fontSize || "text-2xl";
    
    return (
      <div className="flex items-center space-x-3 mb-6">
        {/* Logo Icon/Image */}
        {logoSettings.type === 'icon' && (
          <div className={`${sizeClasses} ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
            {(() => {
              const IconComponent = logoIconMap[logoSettings.iconName as keyof typeof logoIconMap] || Stethoscope;
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

  const renderSocialLink = (socialLink: SocialLink) => {
    if (!socialLink.enabled) return null;

    const IconComponent = socialIconMap[socialLink.icon as keyof typeof socialIconMap];
    if (!IconComponent) return null;

    return (
      <a
        key={socialLink.id}
        href={socialLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-12 h-12 bg-gradient-to-r ${socialLink.color} rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg`}
        data-testid={`social-${socialLink.id}`}
        title={socialLink.name}
      >
        <IconComponent className="h-6 w-6 text-white" />
      </a>
    );
  };

  return (
    <footer className={`${footerSettings.backgroundColor} ${footerSettings.textColor} py-20 relative overflow-hidden`} data-testid="footer">
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
            <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-md" data-testid="footer-description">
              {footerSettings.description}
            </p>
            <div className="flex flex-wrap gap-4" data-testid="social-links">
              {footerSettings.socialLinks.map(renderSocialLink)}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="footer-quick-links-title">
              {footerSettings.quickLinksTitle}
            </h4>
            <ul className="space-y-4">
              {footerSettings.quickLinks
                .filter(link => link.enabled)
                .map(link => (
                  <li key={link.id}>
                    <Link 
                      href={link.url} 
                      className={`text-gray-300 hover:${footerSettings.accentColor} transition-all duration-300 hover:translate-x-1 inline-block`}
                      data-testid={`footer-link-${link.id}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="footer-contact-title">
              {footerSettings.contactTitle}
            </h4>
            <ul className="space-y-6">
              {footerSettings.contactInfo.email && (
                <li className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-email">
                    {footerSettings.contactInfo.email}
                  </span>
                </li>
              )}
              
              {footerSettings.contactInfo.phone && (
                <li className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-phone">
                    {footerSettings.contactInfo.phone}
                  </span>
                </li>
              )}
              
              {footerSettings.contactInfo.address && (
                <li className="flex items-center space-x-4 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors" data-testid="footer-location">
                    {footerSettings.contactInfo.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm" data-testid="footer-copyright">
              {footerSettings.copyrightText}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footerSettings.privacyPolicyUrl && (
                <Link 
                  href={footerSettings.privacyPolicyUrl} 
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              )}
              {footerSettings.termsOfServiceUrl && (
                <Link 
                  href={footerSettings.termsOfServiceUrl} 
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}