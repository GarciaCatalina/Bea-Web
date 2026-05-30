/* ============================================
   beabadoobee — main.js
   Scripts compartidos para todas las páginas
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

 /* ── Hamburger menu & Submenú de Clics Consecutivos ── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMerchToggle = document.querySelector('.mobile-merch-toggle');
  const mobileMerchSub    = document.querySelector('.mobile-merch-sub');

  if (hamburger && mobileMenu) {
    // Seleccionamos los enlaces de páginas normales (Biografía, etc.) para que cierren el menú al tocarlos
    const normalMobileLinks = mobileMenu.querySelectorAll('ul > li > a:not(.mobile-merch-toggle)');
    function toggleMenu(open) {
      hamburger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      if (open) {
        mobileMenu.removeAttribute('hidden');
      } else {
        mobileMenu.addEventListener('transitionend', () => {
          if (!mobileMenu.classList.contains('open')) {
            mobileMenu.setAttribute('hidden', '');
          }
        }, { once: true });
        
        // Al cerrar el menú completo, reiniciamos el submenú de Merch por estética
        if (mobileMerchSub) mobileMerchSub.classList.remove('open');
        if (mobileMerchToggle) mobileMerchToggle.classList.remove('open');
      }
    }
    hamburger.addEventListener('click', () => {
      toggleMenu(!hamburger.classList.contains('open'));
    });
    // Cerrar el menú al hacer click en páginas estándar (Biografía, Discografía, etc.)
    normalMobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') toggleMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) toggleMenu(false);
    });
  }
  /* ── COMPORTAMIENTO SOLICITADO: Clics consecutivos en Merch Móvil ── */
  if (mobileMerchToggle && mobileMerchSub) {
    mobileMerchToggle.addEventListener('click', (e) => {
      // Verificamos si el submenú ya está abierto en el celular
      const isOpen = mobileMerchSub.classList.contains('open');
      if (!isOpen) {
        // PRIMER CLIC: Cancelamos el viaje a merch.html, abrimos el submenú y rotamos la flecha
        e.preventDefault();
        e.stopPropagation();
        mobileMerchSub.classList.add('open');
        mobileMerchToggle.classList.add('open');
      }
      // SEGUNDO CLIC: Al estar ya abierto ('isOpen' es true), no entra al 'if',
      // el 'preventDefault()' no se ejecuta y el navegador te lleva directo a merch.html
    });
    // Clic en secciones internas (Remeras, Vinilos, etc.)
    const subSections = mobileMerchSub.querySelectorAll('a');
    subSections.forEach(link => {
      link.addEventListener('click', () => {
        // Le damos un mini tiempo de 250ms para que se ejecute el viaje al ancla antes de cerrar todo
        setTimeout(() => {
          if (hamburger && mobileMenu) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
          }
        }, 250);
      });
    });
  }
  /* ── Merch: dropdown nav desktop (CORREGIDO PARA TODOS LOS QUERIES DESKTOP) ── */
const merchNavItem = document.querySelector('.merch-nav-item');
  const merchToggle  = document.querySelector('.merch-toggle');
  const merchDropdown = document.querySelector('.merch-dropdown');

  if (merchNavItem && merchDropdown && merchToggle) {
    // Opcional: Mantenemos el efecto hover clásico en pantallas grandes por comodidad
    merchNavItem.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        merchDropdown.classList.add('open');
        merchToggle.classList.add('open');
      }
    });
    merchNavItem.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        merchDropdown.classList.remove('open');
        merchToggle.classList.remove('open');
      }
    });
    // ¡COMPORTAMIENTO CLAVE SOLICITADO!
    merchToggle.addEventListener('click', (e) => {
      // Solo aplicamos esta lógica en diseño de escritorio (pantallas mayores a 768px)
      if (window.innerWidth > 768) {
        const isOpen = merchDropdown.classList.contains('open');
        if (!isOpen) {
          // PRIMER CLICK: No viaja, solo despliega el submenú
          e.preventDefault();
          merchDropdown.classList.add('open');
          merchToggle.classList.add('open');
        } 
        // SEGUNDO CLICK: Al estar 'isOpen' en true, no entra al IF, no hay preventDefault y viaja nativamente a merch.html
      }
    });
    // Cierra el menú si se hace click afuera del botón o del submenú
    document.addEventListener('click', (e) => {
      if (!merchNavItem.contains(e.target)) {
        merchDropdown.classList.remove('open');
        merchToggle.classList.remove('open');
      }
    });
  }

//CONTACTO  
/* ── VALIDACIÓN Y PROTECCIÓN DEL FORMULARIO DE CONTACTO ── */
  const contactForm  = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn    = document.getElementById('submit-btn');

  if (contactForm && formFeedback && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // 1. Detección de Honeypot Anti-Spam (Bot)
      const honeymoonField = contactForm.querySelector('input[name="b_username"]').value;
      if (honeymoonField !== "") {
        console.warn("Spam bot detectado.");
        // Actuamos como si se hubiera enviado bien para engañar al bot sin procesar nada
        showFeedback("¡Mensaje enviado con éxito! 🌹", "var(--green)");
        contactForm.reset();
        return;
      }

      // 2. Captura y Limpieza de Campos (Sanitización básica en cliente)
      const nameInput    = document.getElementById('name');
      const emailInput   = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');
      const name    = nameInput.value.trim();
      const email   = emailInput.value.trim();
      const subject = subjectInput.value;
      const message = messageInput.value.trim();
      // Regex estricta para validación de formato de Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // 3. Validaciones de Contenido Avanzadas
      if (name.length < 2) {
        showFeedback("Por favor, introduce un nombre válido (mínimo 2 caracteres).", "var(--red)");
        nameInput.focus();
        return;
      }
      if (!emailRegex.test(email)) {
        showFeedback("El formato de correo electrónico no es válido.", "var(--red)");
        emailInput.focus();
        return;
      }
      if (!subject) {
        showFeedback("Por favor, selecciona un asunto para tu mensaje.", "var(--red)");
        subjectInput.focus();
        return;
      }
      if (message.length < 10) {
        showFeedback("El mensaje es demasiado corto (mínimo 10 caracteres).", "var(--red)");
        messageInput.focus();
        return;
      }
      // 4. Bloqueo Anti-Spam Sucesivo (Deshabilitar Botón)
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "ENVIANDO...";
      submitBtn.style.opacity = "0.6";
      submitBtn.style.cursor = "not-allowed";
      // 5. Simulación de Envío Exitoso (Acá conectarías con tu backend o Fetch API posterior)
      setTimeout(() => {
        showFeedback("¡Tu mensaje ha sido enviado con éxito! Nos comunicaremos pronto. 🌹", "var(--green)");
        contactForm.reset();
        // Rehabilitar el botón después del reset
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
      }, 1500);
    });
    function showFeedback(text, color) {
      formFeedback.innerText = text;
      formFeedback.style.color = color;
      formFeedback.classList.add('visible');
      
      // Ocultar mensaje de error automáticamente tras 5 segundos si no es exitoso
      if (color === "var(--red)") {
        setTimeout(() => {
          formFeedback.classList.remove('visible');
        }, 5000);
      }
    }
  }

  /* ── Galería: lightbox simple ── */
  const galleryImgs = document.querySelectorAll('.gallery-item img');
  if (galleryImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<div class="lightbox-inner"><img src="" alt=""/><button class="lightbox-close">✕</button></div>';
    document.body.appendChild(overlay);
    const lbImg = overlay.querySelector('img');
    galleryImgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Discografía: tab álbumes ── */
  const albumTabs = document.querySelectorAll('.album-tab');
  const albumPanels = document.querySelectorAll('.album-panel');

  if (albumTabs.length) {
    albumTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        albumTabs.forEach(t => t.classList.remove('active'));
        albumPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.querySelector(tab.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  }
});
