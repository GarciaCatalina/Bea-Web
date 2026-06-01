document.addEventListener('DOMContentLoaded', () => {
  let lightbox = document.querySelector('.lightbox-overlay');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.classList.add('lightbox-overlay');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Visualizador de imagen');
    lightbox.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" aria-label="Cerrar">&times;</button>
        <img src="" alt="" />
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  let currentIndex = 0;
  const galleryItems = Array.from(document.querySelectorAll('.gallery-grid .gallery-item img'));
  const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = ''; 
  };
  const nextImage = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxImage();
  };
  const prevImage = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  };
  const updateLightboxImage = () => {
    if (galleryItems[currentIndex]) {
      lightboxImg.src = galleryItems[currentIndex].src;
      lightboxImg.alt = galleryItems[currentIndex].alt;
    }
  };
  galleryItems.forEach((img, index) => {
    img.onclick = (e) => {
      e.preventDefault();
      openLightbox(index);
    };
  });
  lightboxClose.onclick = (e) => {
    e.stopPropagation();
    closeLightbox();
  };
  
  lightbox.onclick = (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  };
  window.onkeydown = (e) => {
    if (!lightbox.classList.contains('open')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 40;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  const handleSwipe = () => {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > minSwipeDistance) {
      prevImage();
    } 
    else if (swipeDistance < -minSwipeDistance) {
      nextImage();
    }
  };
});