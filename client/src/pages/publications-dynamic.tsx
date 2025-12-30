import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { BookOpen, FileText, TrendingUp, Users, Award, ArrowRight, ExternalLink } from "lucide-react";
import { contentStore, type PageContent, type ContentSection } from "@/lib/content-store";

// Helper function to convert Tailwind gradient classes to CSS gradients
const getGradientColors = (gradientClass: string): string => {
  const gradientMap: Record<string, string> = {
    'from-blue-50 to-indigo-100': '#eff6ff, #e0e7ff',
    'from-green-50 to-emerald-100': '#f0fdf4, #dcfce7',
    'from-purple-50 to-pink-100': '#faf5ff, #fce7f3',
    'from-orange-50 to-red-100': '#fff7ed, #fee2e2',
    'from-indigo-50 to-purple-100': '#eef2ff, #e9d5ff',
    'from-green-50 to-teal-100': '#f0fdf4, #ccfbf1',
    'from-blue-50 to-cyan-100': '#eff6ff, #cffafe',
  };
  
  return gradientMap[gradientClass] || '#eff6ff, #e0e7ff';
};

// Icon mapping
const iconMap = {
  BookOpen,
  FileText,
  TrendingUp,
  Users,
  Award,
  ExternalLink,
};

export default function PublicationsDynamic() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);

  // Load dynamic content
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('PublicationsDynamic: Loading content...');
        
        const content = await contentStore.getPageContent('publications');
        console.log('PublicationsDynamic: Loaded content:', content);
        
        if (content && content.sections) {
          setPageContent(content);
        } else {
          console.warn('PublicationsDynamic: Content missing sections, trying sync method');
          const fallbackContent = contentStore.getPageContentSync('publications');
          setPageContent(fallbackContent);
        }
      } catch (error) {
        console.error('PublicationsDynamic: Error loading content:', error);
        const fallbackContent = contentStore.getPageContentSync('publications');
        console.log('PublicationsDynamic: Fallback content:', fallbackContent);
        setPageContent(fallbackContent);
      }
    };

    loadContent();

    // Listen for content updates
    const handleContentUpdate = (e: CustomEvent) => {
      if (e.detail.pageId === 'publications') {
        console.log('PublicationsDynamic: Content updated via event');
        setPageContent(e.detail.content);
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
  }, []);

  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20 lg:py-32'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="hero-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-gradient-to-r from-blue-50 to-cyan-100')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 
                    className={`${section.styles?.fontSize || 'text-4xl lg:text-6xl'} font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6 leading-tight`}
                    data-testid="hero-title"
                  >
                    {section.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="hero-description">
                    {section.content}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/join">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid="button-publish"
                      >
                        Start Publishing
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
                {section.imageUrl && (
                  <div className="relative">
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                      data-testid="hero-image"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="text-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-white')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className={`${section.styles?.fontSize || 'text-4xl'} font-bold ${section.styles?.textColor || 'text-gray-900'} mb-6`}>
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
                {section.imageUrl && (
                  <div className="relative">
                    <img
                      src={section.imageUrl}
                      alt={section.title}
                      className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'stats':
        return (
          <section 
            key={section.id}
            className={`relative ${section.styles?.padding || 'py-20'}`}
            style={{
              background: section.styles?.backgroundColor?.includes('from-') 
                ? `linear-gradient(135deg, ${getGradientColors(section.styles.backgroundColor)})` 
                : undefined
            }}
            data-testid="stats-section"
          >
            <div className={`absolute inset-0 ${section.styles?.backgroundColor?.includes('from-') ? '' : (section.styles?.backgroundColor || 'bg-blue-600')}`}></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`${section.styles?.fontSize || 'text-4xl'} font-bold ${section.styles?.textColor || 'text-white'} mb-4`}>
                  {section.title}
                </h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  {section.content}
                </p>
              </div>
              
              {section.data?.stats && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.data.stats.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-blue-100 text-lg">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (!pageContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="publications-page">
      {pageContent.sections.map(renderSection)}
    </div>
  );
}