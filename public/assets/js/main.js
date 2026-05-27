(function () {
  "use strict";

  // === consultation popup handler Script ===
  document.addEventListener('mouseleave', function (event) {
    const isExcludedPage = location.pathname === '/contact' || location.pathname === '/freeconsultation';
    const alreadyShown = sessionStorage.getItem('consultation_popup_shown');

    if (event.clientY <= 10 && !alreadyShown && !isExcludedPage) {
      var consultationModal = new bootstrap.Modal(document.getElementById('consultationModal'));
      consultationModal.show();

      // mark as shown immediately
      sessionStorage.setItem('consultation_popup_shown', '1');
    }
  });

  // =============CONSULT FORM HTTP REQUEST ===========
  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      var apiResponse = null;
      const loader = document.getElementById('loader');
      const responseMessage = document.getElementById('responseMessage');
      const formData = new FormData(event.target);

      // Show loading spinner
      loader.style.display = 'block';
      responseMessage.innerHTML = '';

      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value.trim();
      }

      const smsData = {
        message: 'NOTIFICATION from TechPlus Consultation Request Call To ' + data.name + ' @' + data.phoneNumber,
      };

      const emailData = {
        subject: 'Consultation Request',
        text: `
  ${data.text}
  
  Name: ${data.name},
  Phone: ${data.phoneNumber},-
  Email: ${data.email}
      `
      };

      const gmailData = {
        subject: 'Consultation Request',
        text: `
  ${data.text}
  
  Name: ${data.name},
  Phone: ${data.phoneNumber},
  Email: ${data.email}
      `
      };

      try {
        const { smsResult, emailResult, gmailResult } = await sendNotifications(smsData, emailData, gmailData);

        loader.style.display = 'none';
        responseMessage.innerHTML = `<strong style="color:green">Consultation requested successfully!</strong>`;

        document.getElementById('consultForm').reset();
      } catch (error) {
        loader.style.display = 'none';
        responseMessage.innerHTML = `<strong style="color:red">Failed to request consultation. Please try again.</strong>`;
        console.error(error);
      }

    });
  }

  async function sendNotifications(smsData, emailData, gmailData) {
    const sendSmsUrl = `${location.origin}/api/sendsms`;
    const sendEmailUrl = `${location.origin}/api/sendEmail`;
    const sendGmailUrl = `${location.origin}/api/sendGmail`;

    const [smsResponse, emailResponse, gmailResponse] = await Promise.allSettled([
      // fetch(sendSmsUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(smsData),
      // }),
      // fetch(sendEmailUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData),
      // }),
      fetch(sendGmailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gmailData),
      }),
    ]);

    // Evaluate results
    const smsSuccess = smsResponse?.status === 'fulfilled' && smsResponse.value.ok;
    const emailSuccess = emailResponse?.status === 'fulfilled' && emailResponse.value.ok;
    const gmailSuccess = gmailResponse?.status === 'fulfilled' && gmailResponse.value.ok;

    if (!smsSuccess && !emailSuccess && !gmailSuccess) {
      throw new Error(`Failed to send notifications`);
    }

    const smsResult = smsSuccess ? await smsResponse.value.json() : null;
    const emailResult = emailSuccess ? await emailResponse.value.json() : null;
    const gmailResult = gmailSuccess ? await gmailResponse.value.json() : null;

    return { smsResult, emailResult, gmailResult };
  }
  // =============CONSULT FORM HTTP REQUEST END===========

  window.navigateTo = function (url) {
    window.location.href = location.origin + url;
  };

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    carouselIndicator.closest('.carousel').querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      if (index === 0) {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        carouselIndicator.innerHTML += `<li data-bs-target="#${carouselIndicator.closest('.carousel').id}" data-bs-slide-to="${index}"></li>`;
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // =============HTTP REQUEST===========
  const baseUrl = location.origin;

  const updateViewCount = async (blogId) => {
    try {
      const response = await fetch(`${baseUrl}/blogs/${blogId}/views`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = location.origin + '/blog/' + blogId;
      console.log('View count updated:', data);
    } catch (error) {
      console.error('Error updating view count:', error.message);
    }
  };

  // Example usage
  // updateViewCount(1); // Replace 1 with the actual blog ID

  const isPublishedComment = async (commentId, isPublished) => {
    const url = `${baseUrl}/comments/${commentId}/publish-status`;
    isPublished = !isPublished;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Publish status updated:', data);
      location.reload();
    } catch (error) {
      console.error('Error updating publish status:', error.message);
    }
  };

  // Example usage
  // isPublishedComment(123, true); // Replace 123 with the actual comment ID

  const deleteItem = async (url, id) => {
    const apiUrl = `${baseUrl}/api/${url}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      location.reload();
      console.log('Deleted:', data);
    } catch (error) {
      console.error('Error deleting :', error.message);
    }
  };

  // Example usage
  // deleteItem('comments', 123); // Replace 123 with the actual comment ID

  // ===============add testimonial image preview handling============
  const fileInput = document.getElementById('file');
  const imgPreview = document.getElementById('imgPreview');

  fileInput?.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block'; // show image
      }

      reader.readAsDataURL(file);
    } else {
      imgPreview.style.display = 'none'; // hide if no file
      imgPreview.src = '';
    }
  });

})();




