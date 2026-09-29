/**
 * Mecânica Pneu Queimado - Interações JavaScript
 * - Scroll suave e navegação ativa
 * - Menu responsivo mobile
 * - Carrossel de avaliações de clientes
 * - Modal de agendamento com integração WhatsApp (27) 99695-1416
 * - Modal de detalhes dos produtos
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constantes e referências
  const WHATSAPP_NUMBER = '5527996951416';

  // 1. MENU RESPONSIVO MOBILE
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar menu mobile ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. SCROLL SUAVE E MENU ATIVO
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Highlight no menu durante o scroll
  const sections = document.querySelectorAll('main section[id], footer[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const header = document.querySelector('.header');

    // Sombra no header após scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          correspondingLink.classList.add('active');
        }
      }
    });
  });

  // 3. CARROSSEL DE AVALIAÇÕES
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  let currentReviewIndex = 0;

  if (reviewCards.length > 0 && dotsContainer) {
    // Gerar dots indicadores
    dotsContainer.innerHTML = '';
    reviewCards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para avaliação ${idx + 1}`);
      dot.addEventListener('click', () => showReview(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function showReview(index) {
      if (index < 0) index = reviewCards.length - 1;
      if (index >= reviewCards.length) index = 0;

      currentReviewIndex = index;

      reviewCards.forEach((card, idx) => {
        if (idx === currentReviewIndex) {
          card.style.display = 'flex';
          card.classList.add('active');
        } else {
          // Em desktop grande mostramos aos pares se desejado, ou ciclo simples
          if (window.innerWidth <= 768) {
            card.style.display = 'none';
          }
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentReviewIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showReview(currentReviewIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showReview(currentReviewIndex + 1));
    }

    // Auto rotate suave a cada 6 segundos
    let reviewInterval = setInterval(() => {
      showReview(currentReviewIndex + 1);
    }, 6000);

    const sliderWrapper = document.querySelector('.reviews-carousel-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => clearInterval(reviewInterval));
      sliderWrapper.addEventListener('mouseleave', () => {
        reviewInterval = setInterval(() => showReview(currentReviewIndex + 1), 6000);
      });
    }
  }

  // 4. MODAL DE AGENDAMENTO (BOTÃO "AGENDAR SERVIÇO")
  const scheduleModal = document.getElementById('scheduleModal');
  const scheduleCloseBtn = document.getElementById('modalScheduleClose');
  const scheduleBackdrop = document.getElementById('modalScheduleBackdrop');
  const scheduleForm = document.getElementById('scheduleForm');
  const scheduleTriggers = document.querySelectorAll('.open-schedule-modal');
  const serviceSelect = document.getElementById('schedService');

  function openSchedule(serviceName = '') {
    if (!scheduleModal) return;
    if (serviceName && serviceSelect) {
      // Ajusta opção se houver correspondência
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.includes(serviceName) || serviceSelect.options[i].value === serviceName) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    scheduleModal.hidden = false;
    setTimeout(() => {
      scheduleModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 10);
  }

  function closeSchedule() {
    if (!scheduleModal) return;
    scheduleModal.classList.remove('active');
    setTimeout(() => {
      scheduleModal.hidden = true;
      document.body.style.overflow = '';
    }, 200);
  }

  scheduleTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-servico') || '';
      openSchedule(service);
    });
  });

  if (scheduleCloseBtn) scheduleCloseBtn.addEventListener('click', closeSchedule);
  if (scheduleBackdrop) scheduleBackdrop.addEventListener('click', closeSchedule);

  // Envio do formulário de agendamento com alerta amigável e redirecionamento WhatsApp
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('schedName')?.value.trim();
      const phone = document.getElementById('schedPhone')?.value.trim();
      const car = document.getElementById('schedCar')?.value.trim();
      const service = document.getElementById('schedService')?.value;
      const date = document.getElementById('schedDate')?.value;
      const notes = document.getElementById('schedNotes')?.value.trim();

      if (!name || !phone || !car || !service || !date) {
        alert('Por favor, preencha todos os campos obrigatórios (*).');
        return;
      }

      // Formatando data para pt-BR
      const dateParts = date.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : date;

      const message = `*NOVO AGENDAMENTO - MECÂNICA PNEU QUEIMADO*%0A%0A` +
        `👤 *Cliente:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contato:* ${encodeURIComponent(phone)}%0A` +
        `🚗 *Veículo:* ${encodeURIComponent(car)}%0A` +
        `🔧 *Serviço:* ${encodeURIComponent(service)}%0A` +
        `📅 *Data Preferencial:* ${encodeURIComponent(formattedDate)}%0A` +
        (notes ? `📝 *Observações:* ${encodeURIComponent(notes)}%0A` : '') +
        `%0A_Enviado pelo site institucional._`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      // Feedback amigável para o usuário
      alert(`Obrigado, ${name}! Seu pedido de agendamento foi registrado com sucesso. Você será redirecionado para o WhatsApp oficial da Mecânica Pneu Queimado para confirmar seu horário.`);

      // Redireciona para o WhatsApp
      window.open(whatsappUrl, '_blank');
      closeSchedule();
      scheduleForm.reset();
    });
  }

  // 5. MODAL DE DETALHES DO PRODUTO
  const productModal = document.getElementById('productModal');
  const productCloseBtn = document.getElementById('modalProductClose');
  const productBackdrop = document.getElementById('modalProductBackdrop');
  const detailButtons = document.querySelectorAll('.btn-product-details');

  const modalImg = document.getElementById('modalProductImg');
  const modalTitle = document.getElementById('modalProductTitle');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalDesc = document.getElementById('modalProductDescription');
  const modalWhatsappBtn = document.getElementById('modalProductWhatsappBtn');

  function openProductDetails(btn) {
    if (!productModal) return;

    const name = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price');
    const desc = btn.getAttribute('data-desc');
    const img = btn.getAttribute('data-img');

    if (modalTitle) modalTitle.textContent = name;
    if (modalPrice) modalPrice.textContent = price;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalImg) {
      modalImg.src = img;
      modalImg.alt = name;
    }

    if (modalWhatsappBtn) {
      const msg = `Olá! Vi o produto *${encodeURIComponent(name)}* (${encodeURIComponent(price)}) no site da Mecânica Pneu Queimado e gostaria de verificar a disponibilidade e compatibilidade com o meu veículo.`;
      modalWhatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    }

    productModal.hidden = false;
    setTimeout(() => {
      productModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }, 10);
  }

  function closeProductDetails() {
    if (!productModal) return;
    productModal.classList.remove('active');
    setTimeout(() => {
      productModal.hidden = true;
      document.body.style.overflow = '';
    }, 200);
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => openProductDetails(btn));
  });

  if (productCloseBtn) productCloseBtn.addEventListener('click', closeProductDetails);
  if (productBackdrop) productBackdrop.addEventListener('click', closeProductDetails);

  // Fechar modais ao teclar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSchedule();
      closeProductDetails();
    }
  });

  // Definir data mínima do input de agendamento como hoje
  const schedDateInput = document.getElementById('schedDate');
  if (schedDateInput) {
    const today = new Date().toISOString().split('T')[0];
    schedDateInput.min = today;
  }
});
