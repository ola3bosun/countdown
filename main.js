// 🎂 Dynamic friend birthdays
const friends = [
    { name: "Tubosun",   date: "2025-06-15T00:00:00" },
    { name: "Chipel",    date: "2025-06-18T00:00:00" },
    { name: "Malik",     date: "2025-07-17T00:00:00" },
    { name: "Suleiman",  date: "2025-09-11T00:00:00" },
    { name: "Tise",      date: "2025-10-07T00:00:00" },  // normalized “00”
    { name: "Noheemot",  date: "2025-11-30T00:45:00" },
    { name: "Bolaji",    date: "2025-12-15T00:00:00" },
    { name: "Sam",       date: "2026-01-01T00:00:00" },
    { name: "Mom",       date: "2025-11-18T00:00:00" },
    { name: "My Baby",   date: "2025-12-19T00:00:00" }
  ];
  
  let nextBirthdayIndex = 0;
  let confettiTriggered = false;
  
  const flipUnits = {
    days:    document.getElementById('days'),
    hours:   document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };
  
  const nameDisplay = document.getElementById('currentName');
  
  // Helper: format “5” → “05”
  function formatNumber(n){ return n.toString().padStart(2, '0'); }
  
  // Move to next friend + reset confetti + update UI
  function goToNextBirthday() {
    nextBirthdayIndex = (nextBirthdayIndex + 1) % friends.length;
    confettiTriggered = false;
    nameDisplay.textContent = `${friends[nextBirthdayIndex].name}'s Birthday In…`;
  }
  
  // Update flips based on seconds remaining
  function updateFlip(unit, value) {
    const top       = unit.querySelector('.top');
    const bottom    = unit.querySelector('.bottom');
    const flipTop   = unit.querySelector('.flip-top');
    const flipBottom= unit.querySelector('.flip-bottom');
    const formatted = formatNumber(value);
  
    if (top.innerText === formatted) return;
  
    flipTop.innerText    = top.innerText;
    flipBottom.innerText = formatted;
  
    gsap.set(flipTop,    { rotationX: 0 });
    gsap.set(flipBottom, { rotationX: 90 });
  
    const tl = gsap.timeline();
    tl.to(flipTop,    { rotationX: -90, duration: 0.4, ease: "power1.in"  })
      .to(flipBottom, { rotationX:   0, duration: 0.4, ease: "power1.out" }, "-=0.3")
      .add(() => {
        top.innerText    = formatted;
        bottom.innerText = formatted;
      });
  }
  
  // Core countdown logic
  function updateCountdown() {
    const now     = new Date();
    const endDate = new Date(friends[nextBirthdayIndex].date);
    const diffSec = Math.floor((endDate - now) / 1000);
  
    if (diffSec <= 0) {
      if (!confettiTriggered) {
        confettiTriggered = true;
        launchConfetti();
        goToNextBirthday();
      }
      return;
    }
  
    const days    = Math.floor(diffSec / (3600 * 24));
    const hours   = Math.floor((diffSec / 3600) % 24);
    const minutes = Math.floor((diffSec / 60) % 60);
    const seconds = diffSec % 60;
  
    updateFlip(flipUnits.days,    days);
    updateFlip(flipUnits.hours,   hours);
    updateFlip(flipUnits.minutes, minutes);
    updateFlip(flipUnits.seconds, seconds);
  }
  
  // Fireworks confetti
  function launchConfetti() {
    const duration     = 5_000;
    const end          = Date.now() + duration;
    const defaults     = { startVelocity:30, spread:360, ticks:60, zIndex:2000 };
    const randomInRange= (min, max) => Math.random() * (max - min) + min;
  
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({
        particleCount: 100,
        origin: { x: randomInRange(0.1,0.9), y: Math.random() - 0.2 },
        ...defaults
      });
    }, 250);
  }
  
  // Init UI & start timer
  nameDisplay.textContent = `${friends[nextBirthdayIndex].name}'s Birthday In…`;
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // custom cursor
  //quickTo setup for custom cursor box
const box = document.querySelector('.box');
const xTo = gsap.quickTo(box, 'x', { duration: 0.15, ease: 'elastic.out(1, 0.3)' });
const yTo = gsap.quickTo(box, 'y', { duration: 0.15, ease: 'elastic.out(1, 0.3)' });

//Idle‐fade functions
function hideCursor() {
  gsap.to(box, { opacity: 0, duration: 0.5, ease: 'power1.out' });
}
function showCursor() {
  gsap.to(box, { opacity: 1, duration: 0.3, ease: 'power1.out' });
}

// Idle timer logic
let idleTimeout;
function resetIdleTimer() {
  showCursor();
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(hideCursor, 1500);
}

//Mousemove handler (moves box + resets idle timer)
document.body.addEventListener('mousemove', (e) => {
  xTo(e.clientX - box.offsetWidth  / 2);
  yTo(e.clientY - box.offsetHeight / 2);
  resetIdleTimer();
});

//Show/hide on window leave/enter
window.addEventListener('mouseout',  e => { if (!e.relatedTarget) hideCursor(); });
window.addEventListener('mouseover', e => { if (!e.relatedTarget) showCursor(); });

// Initialize idle timer
resetIdleTimer();
