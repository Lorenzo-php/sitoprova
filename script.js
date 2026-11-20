// PLACEHOLDER: sostituisci questo indirizzo quando avrai creato l'email definitiva.
const CONTACT_EMAIL = 'info@lvsocialmanagement.it';

document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Apri il menu');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Apri il menu' : 'Chiudi il menu');
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const emailDisplay = document.getElementById('contact-email');
const contactStatus = document.getElementById('contact-status');
if (emailDisplay) emailDisplay.textContent = CONTACT_EMAIL;

const copyButton = document.getElementById('copy-email');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = CONTACT_EMAIL;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'fixed';
        temporaryInput.style.opacity = '0';
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        if (!copied) throw new Error('Copia non disponibile');
      }
      if (contactStatus) contactStatus.textContent = 'Indirizzo email copiato.';
    } catch (error) {
      if (contactStatus) contactStatus.textContent = 'Copia non disponibile: seleziona l’indirizzo email e copialo manualmente.';
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const selectedPackage = String(formData.get('package') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const replyAddress = String(formData.get('reply') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const subject = selectedPackage === 'Informazioni generali'
      ? 'Richiesta informazioni - L&V Social Management'
      : `Richiesta informazioni - ${selectedPackage}`;
    const bodyLines = [
      'Buongiorno,',
      '',
      name ? `Sono ${name}.` : '',
      replyAddress ? `La mia email: ${replyAddress}` : '',
      `Formula di interesse: ${selectedPackage}.`,
      '',
      message,
      '',
      'Grazie.'
    ].filter((line) => line !== undefined);
    const composeUrl = new URL('https://mail.google.com/mail/');
    composeUrl.search = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: CONTACT_EMAIL,
      su: subject,
      body: bodyLines.join('\n')
    }).toString();

    const composeWindow = window.open(composeUrl.toString(), '_blank');
    if (composeWindow) {
      composeWindow.opener = null;
      if (contactStatus) contactStatus.textContent = 'Si è aperta la composizione di Gmail in una nuova scheda.';
    } else if (contactStatus) {
      contactStatus.textContent = 'Il browser ha bloccato la nuova scheda. Consenti i popup e riprova.';
    }
  });
}

document.querySelectorAll('[data-package]').forEach((button) => {
  button.addEventListener('click', () => {
    const packageName = button.getAttribute('data-package');
    const packageSelect = document.getElementById('contact-package');
    if (packageSelect && packageName) {
      const matchingOption = Array.from(packageSelect.options).find((option) => option.value.startsWith(`${packageName} -`));
      if (matchingOption) packageSelect.value = matchingOption.value;
    }
    document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.getElementById('contact-name')?.focus({ preventScroll: true }), 550);
  });
});

const yearDisplay = document.getElementById('current-year');
if (yearDisplay) yearDisplay.textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}
