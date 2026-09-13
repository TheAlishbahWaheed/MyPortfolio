// ============================================================
// RESUME MODAL — collects an email, triggers the real resume.pdf
// download immediately, and (when window.EMAILJS_CONFIG has real IDs
// — see emailjs-config.js) also emails a copy to that address via a
// template with resume.pdf attached as a static EmailJS attachment.
// Falls back to a download-only demo flow otherwise.
// ============================================================
(function () {
  const openBtn = document.getElementById('resumeOpenBtn');
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('resumeModalClose');
  const closeBtn2 = document.getElementById('resumeCloseBtn');
  const form = document.getElementById('resumeForm');
  const success = document.getElementById('resumeSuccess');
  const emailField = document.getElementById('fieldResumeEmail');
  const emailInput = document.getElementById('resumeEmail');
  const sendBtn = document.getElementById('resumeSendBtn');
  const downloadLink = document.getElementById('resumeDownloadLink');

  if (!modal) return;

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function emailjsReady() {
    const cfg = window.EMAILJS_CONFIG;
    return typeof window.emailjs !== 'undefined' && cfg &&
      cfg.publicKey && !cfg.publicKey.startsWith('YOUR_') &&
      cfg.serviceId && !cfg.serviceId.startsWith('YOUR_') &&
      cfg.resumeTemplateId && !cfg.resumeTemplateId.startsWith('YOUR_');
  }

  // Separate readiness check for the owner-notification template, since
  // that one's optional even once the visitor-copy send is configured —
  // this way an unconfigured owner template never blocks the visitor's
  // download or their own copy.
  function ownerNotifyReady() {
    const cfg = window.EMAILJS_CONFIG;
    return typeof window.emailjs !== 'undefined' && cfg &&
      cfg.publicKey && !cfg.publicKey.startsWith('YOUR_') &&
      cfg.serviceId && !cfg.serviceId.startsWith('YOUR_') &&
      cfg.ownerNotifyTemplateId && !cfg.ownerNotifyTemplateId.startsWith('YOUR_');
  }

  // Belt-and-suspenders init — contact.js already calls this once
  // EMAILJS_CONFIG is filled in, but this file doesn't rely on load
  // order to make sure emailjs.init() has actually run before send().
  if (emailjsReady() || ownerNotifyReady()) {
    try { emailjs.init({ publicKey: window.EMAILJS_CONFIG.publicKey }); } catch (e) {}
  }

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    form.classList.remove('is-hidden');
    success.classList.remove('is-visible');
    emailField.classList.remove('has-error');
    emailInput.value = '';
    setTimeout(() => emailInput.focus(), 300);

    if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const inner = form.querySelectorAll('.resume-icon, h3, p, .field, button');
      gsap.fromTo(inner, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05, delay: 0.12, overwrite: true });
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn && openBtn.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  closeBtn2 && closeBtn2.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  sendBtn && sendBtn.addEventListener('click', () => {
    const val = emailInput.value;
    if (!isValidEmail(val)) {
      emailField.classList.add('has-error');
      emailInput.focus();
      return;
    }
    emailField.classList.remove('has-error');

    sendBtn.textContent = 'Preparing download…';
    sendBtn.disabled = true;

    function finish() {
      downloadLink && downloadLink.click();
      form.classList.add('is-hidden');
      success.classList.add('is-visible');
      sendBtn.textContent = 'Send & Download';
      sendBtn.disabled = false;

      if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(success.querySelectorAll('.check, h3, p, button'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06, overwrite: true });
        gsap.fromTo(success.querySelector('.check'), { scale: 0.5, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.2)' });
      }
    }

    // The local download always fires immediately — it never depends on
    // email delivery. Both EmailJS sends below (visitor copy + owner
    // alert) happen alongside it, best-effort, so a slow/failed send
    // never blocks the visitor from getting the file right away.
    if (emailjsReady()) {
      emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.resumeTemplateId, {
        visitor_email: val.trim(),
      }).catch(() => {});
    }

    // Notifies Alishbah directly whenever someone downloads the resume,
    // so she can see who's interested and reach out first. Its "To"
    // address is fixed inside the EmailJS template itself (see
    // emailjs-config.js), not read from the form, so it always lands in
    // her inbox regardless of whose email the visitor typed in.
    if (ownerNotifyReady()) {
      emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.ownerNotifyTemplateId, {
        visitor_email: val.trim(),
        sent_at: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      }).catch(() => {});
    }

    setTimeout(finish, emailjsReady() ? 400 : 500);
  });
})();
