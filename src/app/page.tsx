'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: '🏠',
      title: 'שיפוצים כלליים',
      description: 'שיפוץ דירות ובתים פרטיים מא׳ עד ת׳, כולל תכנון וביצוע מקצועי'
    },
    {
      icon: '🛁',
      title: 'חדרי אמבטיה',
      description: 'עיצוב ושיפוץ חדרי רחצה ושירותים ברמה הגבוהה ביותר'
    },
    {
      icon: '🍳',
      title: 'מטבחים',
      description: 'התקנת מטבחים חדשים ושיפוץ מטבחים קיימים'
    },
    {
      icon: '🏗️',
      title: 'בנייה ופיתוח',
      description: 'בניית תוספות, הרחבות ופיתוח נכסים'
    },
    {
      icon: '🎨',
      title: 'צביעה וגבס',
      description: 'עבודות צבע, גבס ועיצוב קירות פנים'
    },
    {
      icon: '⚡',
      title: 'חשמל ואינסטלציה',
      description: 'התקנות חשמל ואינסטלציה מקצועיות'
    }
  ];

  const projects = [
    { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', title: 'שיפוץ דירה בתל אביב' },
    { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600', title: 'עיצוב חדר אמבטיה' },
    { image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600', title: 'מטבח מודרני' },
    { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600', title: 'סלון יוקרתי' },
    { image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600', title: 'חדר שינה מעוצב' },
    { image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600', title: 'פנטהאוז בהרצליה' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                RE
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">רפאל אלבז</h1>
                <p className="text-xs text-gray-500">קבלן שיפוצים ובנייה</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-amber-600 transition-colors">אודות</a>
              <a href="#services" className="text-gray-600 hover:text-amber-600 transition-colors">שירותים</a>
              <a href="#portfolio" className="text-gray-600 hover:text-amber-600 transition-colors">פרויקטים</a>
              <a href="#contact" className="text-gray-600 hover:text-amber-600 transition-colors">צור קשר</a>
              <Link 
                href="/quote" 
                className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                הצעת מחיר
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <a href="#about" className="text-gray-600 hover:text-amber-600">אודות</a>
                <a href="#services" className="text-gray-600 hover:text-amber-600">שירותים</a>
                <a href="#portfolio" className="text-gray-600 hover:text-amber-600">פרויקטים</a>
                <a href="#contact" className="text-gray-600 hover:text-amber-600">צור קשר</a>
                <Link href="/quote" className="px-6 py-2.5 bg-amber-600 text-white rounded-lg text-center">
                  הצעת מחיר
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            רפאל אלבז
          </h1>
          <p className="text-xl md:text-2xl text-amber-400 font-medium mb-4">
            קבלן שיפוצים ובנייה
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            מעל 15 שנות ניסיון בשיפוצים, בנייה ופיתוח נכסים.
            אנחנו מביאים את החלום שלכם לחיים עם מקצועיות, איכות ואמינות.
          </p>
          <div className="flex justify-center">
            <a 
              href="#contact"
              className="px-10 py-4 bg-amber-600 text-white rounded-xl text-lg font-bold hover:bg-amber-700 transition-all hover:scale-105 shadow-lg"
            >
              צור קשר
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                אודות <span className="text-amber-600">רפאל אלבז</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                אני רפאל אלבז, קבלן שיפוצים ובנייה עם ניסיון של למעלה מ-15 שנה בתחום.
                התחלתי את דרכי כנגר ולאורך השנים רכשתי מומחיות בכל תחומי הבנייה והשיפוצים.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                אני מאמין שכל פרויקט הוא ייחודי ומתייחס לכל לקוח באופן אישי.
                המטרה שלי היא להפוך את הבית שלכם לבית החלומות - עם תשומת לב לכל פרט,
                עמידה בלוחות זמנים ושקיפות מלאה לאורך כל הדרך.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600">15+</div>
                  <div className="text-gray-500">שנות ניסיון</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600">500+</div>
                  <div className="text-gray-500">פרויקטים</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600">100%</div>
                  <div className="text-gray-500">שביעות רצון</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
                  alt="רפאל אלבז"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-600 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-200 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">השירותים שלנו</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              אנחנו מציעים מגוון רחב של שירותי בנייה ושיפוצים ברמה הגבוהה ביותר
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">הפרויקטים שלנו</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              צפו בחלק מהפרויקטים האחרונים שביצענו עבור לקוחותינו המרוצים
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            מוכנים להתחיל את הפרויקט שלכם?
          </h2>
          <p className="text-xl text-amber-100 mb-10">
            קבלו הצעת מחיר מפורטת ומקצועית תוך 24 שעות
          </p>
          <Link 
            href="/quote"
            className="inline-block px-10 py-5 bg-white text-amber-600 rounded-xl text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            קבל הצעת מחיר עכשיו
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">צור קשר</h2>
              <p className="text-lg text-gray-600 mb-8">
                נשמח לשמוע מכם ולענות על כל שאלה. מלאו את הטופס או התקשרו ישירות.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">טלפון</div>
                    <div className="text-xl font-medium" dir="ltr">050-123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">אימייל</div>
                    <div className="text-xl font-medium">info@rafaelelbaz.co.il</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">אזור שירות</div>
                    <div className="text-xl font-medium">ירושלים והסביבה</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="הכנס את שמך"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="050-000-0000"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעה</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="ספר לנו על הפרויקט שלך..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full px-6 py-4 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors"
                >
                  שלח הודעה
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                RE
              </div>
              <div>
                <div className="text-white font-bold">רפאל אלבז</div>
                <div className="text-gray-400 text-sm">קבלן שיפוצים ובנייה</div>
              </div>
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#about" className="hover:text-white transition-colors">אודות</a>
              <a href="#services" className="hover:text-white transition-colors">שירותים</a>
              <a href="#portfolio" className="hover:text-white transition-colors">פרויקטים</a>
              <a href="#contact" className="hover:text-white transition-colors">צור קשר</a>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 רפאל אלבז. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
