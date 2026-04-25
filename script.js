document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    let scrollPos = 0;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        if (navMenu.classList.contains('active')) {
            // Simpan posisi scroll lalu lock
            scrollPos = window.scrollY;
            document.body.style.top = `-${scrollPos}px`;
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
            document.body.style.top = '';

            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollPos);
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 50);
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
            document.body.style.top = '';

            // Skip animasi scroll saat restore posisi
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollPos);
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 50);
        });
    });
    // Active link on scroll
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

let index = 0;

function slideProduk(dir) {
    const track = document.querySelector('.produk-track');
    const cardWidth = 280; // lebar kartu + gap
    index += dir;

    const maxIndex = track.children.length - 3;
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    track.style.transform = `translateX(-${index * cardWidth}px)`;
}

AOS.init();