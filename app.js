/**
 * Yi Fan Portfolio - Prototype Logic
 * 
 */

// ============================================
// State Management
// ============================================
const AppState = {
    currentPage: 'home',
    pageHistory: [],
    currentTimeZone: 'AU',
    isMusicPlaying: false,
    timeZones: {
        'CN': { offset: 8, label: 'CN' },
        'AU': { offset: 10, label: 'AU' }
    }
};

// ============================================
// Page Navigation
// ============================================
function showPage(pageName, addToHistory = true) {
    // Save current page to history before switching
    if (addToHistory && AppState.currentPage !== pageName) {
        AppState.pageHistory.push(AppState.currentPage);
        // Keep history manageable (max 10 entries)
        if (AppState.pageHistory.length > 10) {
            AppState.pageHistory.shift();
        }
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const pageToShow = document.getElementById(`page-${pageName}`);
    if (pageToShow) {
        pageToShow.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Toggle UI elements visibility
    const backBtn = document.getElementById('backBtn');
    const navbar = document.getElementById('navbar');
    const homeControls = document.querySelector('.home-controls');

    if (pageName === 'home') {
        backBtn?.classList.remove('visible');
        navbar?.classList.remove('visible');
        homeControls?.classList.remove('hidden');
        // Clear history when returning home
        AppState.pageHistory = [];
    } else {
        backBtn?.classList.add('visible');
        navbar?.classList.add('visible');
        homeControls?.classList.add('hidden');
    }

    // Reset scroll
    window.scrollTo(0, 0);
    AppState.currentPage = pageName;
}

// Go back to previous page
function goBack() {
    if (AppState.pageHistory.length > 0) {
        const previousPage = AppState.pageHistory.pop();
        // Don't add to history when going back
        showPage(previousPage, false);
    } else {
        showPage('home', false);
    }
}

// Open project detail page
function openProject(projectId) {
    showPage(projectId);
}

// ============================================
// Music Player
// ============================================
function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const nameWrapper = document.getElementById('heroNameWrapper');
    
    if (!audio) return;
    
    if (AppState.isMusicPlaying) {
        audio.pause();
        AppState.isMusicPlaying = false;
        nameWrapper?.classList.remove('playing');
    } else {
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        AppState.isMusicPlaying = true;
        nameWrapper?.classList.add('playing');
    }
}

// ============================================
// Time Zone Toggle
// ============================================
function updateTime() {
    const now = new Date();
    const offset = AppState.timeZones[AppState.currentTimeZone].offset;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (3600000 * offset));
    
    const hours = String(localTime.getHours()).padStart(2, '0');
    const minutes = String(localTime.getMinutes()).padStart(2, '0');
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}`;
    }
}

function toggleTimeZone() {
    AppState.currentTimeZone = AppState.currentTimeZone === 'CN' ? 'AU' : 'CN';
    
    const timeZoneLabel = document.getElementById('timeZone');
    if (timeZoneLabel) {
        timeZoneLabel.textContent = AppState.timeZones[AppState.currentTimeZone].label;
    }
    
    updateTime();
}

// ============================================
// Button Actions
// ============================================
function showComingSoon() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
}

function showContact() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeContact() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // Create mailto link with form data
    const subject = `Message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:yifan4388@163.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showToast('Opening email client...');
    
    // Close modal and reset form
    closeContact();
    form.reset();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function openLinkedIn() {
    window.open('https://www.linkedin.com/in/yi-fan-a2466b224/', '_blank');
}

// ============================================
// Lightbox
// ============================================
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox && lightboxImage) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initLightbox() {
    // Add click handlers to project gallery images
    const projectImages = document.querySelectorAll('.project-gallery img');
    
    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src);
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// ============================================
// Theme Toggle
// ============================================
// ============================================
// Name Shadow Follow Effect
// ============================================
function initNameEffect() {
    const heroName = document.getElementById('heroName');
    
    if (!heroName) return;
    
    document.addEventListener('mousemove', (e) => {
        if (AppState.currentPage !== 'home') return;
        
        const rect = heroName.getBoundingClientRect();
        const nameCenterX = rect.left + rect.width / 2;
        const nameCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to name center
        const deltaX = e.clientX - nameCenterX;
        const deltaY = e.clientY - nameCenterY;
        
        // Shadow moves opposite to mouse (like light source following)
        const shadowX = -deltaX * 0.05;
        const shadowY = -deltaY * 0.05;
        
        // Apply shadow
        heroName.style.textShadow = `${shadowX}px ${shadowY}px 0 rgba(201, 169, 110, 0.3)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        heroName.style.textShadow = 'none';
    });
}

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.currentPage !== 'home') {
            goBack();
        }
    });
}

// ============================================
// Project Card Spotlight Effect
// ============================================
function initProjectSpotlight() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ============================================
// Initialization
// ============================================
function init() {
    // Initialize timezone label
    const timeZoneLabel = document.getElementById('timeZone');
    if (timeZoneLabel) {
        timeZoneLabel.textContent = AppState.timeZones[AppState.currentTimeZone].label;
    }
    
    // Start time update
    updateTime();
    setInterval(updateTime, 1000);
    
    // Init effects
    initNameEffect();
    initKeyboardNav();
    initProjectSpotlight();
    
    // Show home page
    showPage('home');
}

// ============================================
// Page Tilt Effect
// ============================================
function initPageTilt() {
    const homeSection = document.getElementById('page-home');
    if (!homeSection) return;
    
    // Add tilt container class
    homeSection.classList.add('page-tilt-container');
    
    document.addEventListener('mousemove', (e) => {
        // Only on home page
        if (AppState.currentPage !== 'home') {
            homeSection.style.transform = 'none';
            return;
        }
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate rotation (max 3 degrees)
        const rotateX = ((e.clientY - centerY) / centerY) * -3;
        const rotateY = ((e.clientX - centerX) / centerX) * 3;
        
        homeSection.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        homeSection.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ============================================
// Typewriter Effect for Tagline
// ============================================
function initTypewriter() {
    const tagline = document.getElementById('heroTagline');
    if (!tagline) return;
    
    const text = 'Full-Stack Designer';
    
    // Clear existing content
    tagline.innerHTML = '';
    
    // Create spans for each character
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${1.2 + index * 0.05}s`;
        tagline.appendChild(span);
    });
}

// ============================================
// Three.js Paper Texture Background
// ============================================
function initPaperBackground() {
    const canvas = document.getElementById('paperCanvas');
    if (!canvas) return;
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.log('Three.js not loaded, skipping paper background');
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Paper texture shader
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                               -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                   dot(x12.zw,x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
        
        void main() {
            vec2 uv = vUv;
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
            
            // Mouse influence
            vec2 mouseInfluence = (uMouse - 0.5) * 0.1;
            uv += mouseInfluence * 0.02;
            
            // Layered noise for paper texture
            float noise1 = snoise(uv * 3.0 + uTime * 0.05);
            float noise2 = snoise(uv * 8.0 - uTime * 0.03) * 0.5;
            float noise3 = snoise(uv * 16.0 + uTime * 0.02) * 0.25;
            
            float paperNoise = (noise1 + noise2 + noise3) * 0.5 + 0.5;
            
            // Subtle grain
            float grain = snoise(uv * 200.0) * 0.02;
            
            // Paper color (warm off-white)
            vec3 paperColor = vec3(0.98, 0.97, 0.94);
            vec3 shadowColor = vec3(0.92, 0.89, 0.84);
            
            // Mix based on noise - stronger contrast
            vec3 color = mix(shadowColor, paperColor, paperNoise);
            color += grain;
            
            // Subtle vignette
            float vignette = 1.0 - length((vUv - 0.5) * 0.8);
            vignette = smoothstep(0.0, 0.7, vignette);
            color = mix(color * 0.95, color, vignette);
            
            gl_FragColor = vec4(color, 0.4);
        }
    `;
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        transparent: true
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Mouse tracking
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    
    document.addEventListener('mousemove', (e) => {
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    });
    
    // Animation loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        // Smooth mouse interpolation
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
        
        material.uniforms.uTime.value += 0.01;
        material.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    init();
    initPageTilt();
    initTypewriter();
    initPaperBackground();
    initScrollProgress();
    initKeyboardShortcuts();
    initLightbox();
});

// ============================================
// Custom Cursor
// ============================================
// ============================================
// Page Loader
// ============================================
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    const loaderText = document.getElementById('loaderText');
    if (!loader || !loaderText) return;

    const text = 'Yi Fan';
    let index = 0;

    // Typewriter effect
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            loaderText.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
            // Wait a moment then exit
            setTimeout(() => {
                loader.classList.add('exiting');
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 300);
            }, 400);
        }
    }, 150);
}

// ============================================
// Scroll Progress Bar
// ============================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// Keyboard Shortcuts
// ============================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC to close modal or go back
        if (e.key === 'Escape') {
            const modal = document.getElementById('contactModal');
            if (modal && modal.classList.contains('active')) {
                closeContact();
            } else if (AppState.currentPage !== 'home') {
                goBack();
            }
        }
        
        // Number keys 1-4 for projects (when on work page)
        if (AppState.currentPage === 'work') {
            switch(e.key) {
                case '1':
                    openProject('project1');
                    break;
                case '2':
                    openProject('project2');
                    break;
                case '3':
                    openProject('project3');
                    break;
                case '4':
                    openProject('project4');
                    break;
            }
        }
    });
}
