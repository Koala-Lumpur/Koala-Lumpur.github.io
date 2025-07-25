// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Hero section animations
    gsap.from('.hero-title', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        duration: 1.5,
        y: 30,
        opacity: 0,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    // Animate sections on scroll
    gsap.utils.toArray('section').forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            });
        }
    });
    
    // Animate skills list items
    gsap.from('.skills-list li', {
        scrollTrigger: {
            trigger: '.skills-list',
            start: 'top 75%'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Project cards stagger animation
    ScrollTrigger.batch('.project-item', {
        onEnter: elements => {
            gsap.from(elements, {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                overwrite: 'auto',
                ease: 'power3.out'
            });
        },
        once: true,
        start: 'top bottom-=100px'
    });
    
    // Contact section animation
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });
    
    // Social buttons animation
    gsap.from('.social-buttons a', {
        scrollTrigger: {
            trigger: '.social-buttons',
            start: 'top 80%'
        },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });
    
    // Parallax effect for hero section
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero-container',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        opacity: 0.3
    });
    
    // Navigation bar fade in
    gsap.from('.main-nav', {
        y: -100,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
});