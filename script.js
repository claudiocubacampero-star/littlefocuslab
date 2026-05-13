// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .step, .stat, .section-header').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Contact form — submits lead into GHL via a serverless function or mailto fallback
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(this));

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    // Try to POST to /api/contact (Netlify/Vercel function) if available
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btn.textContent = "✓ You're booked! I'll be in touch within 24h.";
      btn.style.background = '#16a34a';
      this.reset();
    } else {
      throw new Error('server error');
    }
  } catch {
    // Fallback: open mailto
    const subject = encodeURIComponent(`Audit Request from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\n\nMessage:\n${data.message || 'N/A'}`
    );
    window.location.href = `mailto:claudio@littlefocuslab.com?subject=${subject}&body=${body}`;
    btn.textContent = 'Book My Free Audit →';
    btn.disabled = false;
  }
});

// Smooth nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 80;
  sections.forEach(s => {
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav a[href="#${s.id}"]`);
      if (link) link.classList.add('active');
    }
  });
});
