// Banner Slider
const track = document.querySelector('.banner-track');
const slides = document.querySelectorAll('.banner-slide');
const dots = document.querySelectorAll('.dot');
const prev = document.querySelector('.banner-prev');
const next = document.querySelector('.banner-next');

let current = 0;
let timer;

function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots[current].classList.add('active');
}

function startAuto() {
    timer = setInterval(() => goTo(current + 1), 4000);
}

function resetAuto() {
    clearInterval(timer);
    startAuto();
}

prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

// Swipe support mobile
let startX = 0;
track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
});

startAuto();