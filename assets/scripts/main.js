"use strict";

document.addEventListener('DOMContentLoaded', initializeCountersOnView);
function animateCounter(element, duration = 1000) {
  const targetValue = +element.getAttribute('data-target');
  const increment = Math.ceil(targetValue / (duration / 10));
  let currentValue = 0;
  const updateCounter = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      element.innerText = targetValue.toLocaleString() + '+';
      clearInterval(updateCounter);
    } else {
      element.innerText = currentValue.toLocaleString() + '+';
    }
  }, 10);
}
function initializeCountersOnView() {
  const counters = document.querySelectorAll('[id^="counter-"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const counter = entry.target;
      if (entry.isIntersecting) {
        // Запуск анимации
        animateCounter(counter);
      } else {
        // Сброс значения при выходе из области видимости
        counter.innerText = '0+';
      }
    });
  }, {
    threshold: 0.5
  }); // Срабатывает, когда элемент наполовину виден

  counters.forEach(counter => observer.observe(counter));
}
$(document).ready(function () {
  let totalSeconds = 3 * 24 * 3600 + 5 * 3600 + 44 * 60 + 12;
  function updateTimer() {
    // Рассчитываем дни, часы, минуты и секунды
    let days = Math.floor(totalSeconds / (24 * 3600));
    let hours = Math.floor(totalSeconds % (24 * 3600) / 3600);
    let minutes = Math.floor(totalSeconds % 3600 / 60);
    let seconds = totalSeconds % 60;

    // Форматируем время с ведущими нулями, если нужно
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    // Обновляем текст внутри элемента <span>
    document.getElementById('timer').innerText = `${days} дня ${hours}:${minutes}:${seconds}`;

    // Уменьшаем общее количество секунд
    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      clearInterval(timerInterval); // Останавливаем таймер, когда время истечет
    }
  }

  // Запускаем таймер с интервалом 1 секунда
  let timerInterval = setInterval(updateTimer, 1000);

  // Первоначальное обновление таймера
  updateTimer();
  const programsSlider = new Swiper('.programs-slider', {
    slidesPerView: '1.2',
    centeredSlides: true,
    spaceBetween: 12,
    loop: true,
    grabCursor: true,
    loopAddBlankSlides: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.programs-next',
      prevEl: '.programs-prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2
      },
      768: {
        slidesPerView: 2.1
      },
      992: {
        slidesPerView: 3.4
      },
      1900: {
        slidesPerView: 5.4
      }
    }
  });
  document.querySelectorAll('.prof-slider .item').forEach(item => {
    const textBox = item.querySelector('.text-box');
    const pElement = textBox.querySelector('p');
    item.addEventListener('mouseenter', () => {
      const pHeight = pElement.scrollHeight; // Получаем высоту p

      // Поднимаем text-box на высоту p
      textBox.style.transform = `translateY(-${32}px)`;

      // Увеличиваем высоту p и делаем его видимым
      pElement.style.height = `${pHeight}px`;
      pElement.style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      // Возвращаем text-box на исходное положение
      textBox.style.transform = 'translateY(0)';

      // Скрываем p
      pElement.style.height = '0'; // Возвращаем высоту на 0
      pElement.style.opacity = '0';
    });
  });
  var profNavSlider = new Swiper('.prof-nav-slider', {
    spaceBetween: 24,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true
  });
  var profSlider = new Swiper('.prof-slider', {
    spaceBetween: 10,
    allowTouchMove: false,
    thumbs: {
      swiper: profNavSlider
    },
    breakpoints: {
      993: {
        allowTouchMove: true
      }
    }
  });
  var reviewsSlider = new Swiper('.reviews-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    initialSlide: 2,
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 10,
      slideShadows: false
    },
    navigation: {
      nextEl: '.reviews-next',
      prevEl: '.reviews-prev'
    }
  });
  var resultNavSlider = new Swiper('.result-nav-slider', {
    spaceBetween: 24,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true
  });
  var resultSlider = new Swiper('.result-slider', {
    spaceBetween: 20,
    autoHeight: true,
    thumbs: {
      swiper: resultNavSlider
    }
  });
  var mobSlider = new Swiper('.mob-slider', {
    slidesPerView: '1.05',
    centeredSlides: false,
    spaceBetween: 0,
    loop: true,
    grabCursor: true,
    loopAddBlankSlides: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.mob-next',
      prevEl: '.mob-prev'
    }
  });
  var modalSlider = new Swiper('.modal-slider', {
    slidesPerView: '1',
    centeredSlides: false,
    spaceBetween: 0,
    loop: true,
    grabCursor: true,
    loopAddBlankSlides: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.modal-next',
      prevEl: '.modal-prev'
    }
  });
  document.querySelector('.burger-menu').addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.menu').classList.toggle('active');
  });

  //Аккардион
  class Accordion {
    constructor(selector, options = {}) {
      const defaultConfig = {
        shouldOpenAll: false,
        defaultOpen: [],
        collapsedClass: 'open',
        multiple: false
      };
      this.config = Object.assign({}, defaultConfig, options);
      this.$accordion = $(selector);
      this.$items = this.$accordion.find('.accordion-item');
      this.init();
    }
    init() {
      const {
        shouldOpenAll,
        defaultOpen,
        collapsedClass,
        multiple
      } = this.config;
      if (shouldOpenAll) {
        this.$items.addClass(collapsedClass);
        this.$items.children('.accordion-content').slideDown();
      } else {
        this.$items.each(function (index, item) {
          const $item = $(item);
          const $content = $item.children('.accordion-content');
          const isOpen = defaultOpen.includes(index);
          if (isOpen) {
            $content.slideDown();
            $item.addClass(collapsedClass);
          } else {
            $content.slideUp();
          }
          $item.on('click', function () {
            if (multiple) {
              $content.slideToggle();
            } else {
              const $siblings = $item.siblings();
              $siblings.removeClass(collapsedClass);
              $siblings.children('.accordion-content').slideUp();
              $content.slideToggle();
              $item.toggleClass(collapsedClass);
            }
          });
        });
      }
    }
    close() {
      this.$items.removeClass(this.config.collapsedClass);
      this.$items.children('.accordion-content').slideUp();
    }
  }
  const accordionResult = new Accordion('.accordion-result', {
    shouldOpenAll: false,
    defaultOpen: [],
    collapsedClass: 'open',
    multiple: false
  });
  const accordionFooter = new Accordion('.accordion-footer', {
    shouldOpenAll: false,
    defaultOpen: [],
    collapsedClass: 'open',
    multiple: false
  });
});