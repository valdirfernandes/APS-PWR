// Main document ready function
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize intersection observers for animations
    initAnimations();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize tabs
    initTabs();
    
    // Initialize visualization tabs
    initVizTabs();
    
    // Initialize bar chart animation
    initBarChart();
    
    // Initialize pie chart
    initPieChart();
  });
  
  // Initialize animations with Intersection Observer
  function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
  }
  
  // Initialize mobile menu functionality
  function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
      
      // Close mobile menu when clicking a link
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
        });
      });
    }
    
    // Handle navbar background on scroll
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }
  
  // Initialize tab functionality for the application section
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Initialize visualization tabs
  function initVizTabs() {
    const vizTabButtons = document.querySelectorAll('.viz-tab-button');
    const vizTabPanes = document.querySelectorAll('.viz-tab-pane');
    
    vizTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        vizTabButtons.forEach(btn => btn.classList.remove('active'));
        vizTabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        const vizId = button.getAttribute('data-viz');
        document.getElementById(vizId + '-viz').classList.add('active');
      });
    });
  }
  
  // Initialize bar chart animation
  function initBarChart() {
    const bars = document.querySelectorAll('.bar');
    
    // Animation delay to allow the container to be visible first
    setTimeout(() => {
      bars.forEach(bar => {
        const height = bar.getAttribute('data-height');
        bar.style.height = height + '%';
      });
    }, 500);
    
    // Add hover effect
    bars.forEach(bar => {
      bar.addEventListener('mouseenter', () => {
        bar.classList.add('hovered');
      });
      bar.addEventListener('mouseleave', () => {
        bar.classList.remove('hovered');
      });
    });
  }
  
  // Initialize pie chart
  function initPieChart() {
    const pieData = [
      { label: 'Energia', value: 45, color: '#34d399' },
      { label: 'Água', value: 25, color: '#38bdf8' },
      { label: 'Materiais', value: 20, color: '#facc15' },
      { label: 'Outros', value: 10, color: '#a3a3a3' }
    ];
    
    const svg = document.getElementById('pieChart');
    const tooltip = document.getElementById('pieTooltip');
    const legend = document.getElementById('pieLegend');
    
    if (!svg || !tooltip || !legend) return;
    
    // Clear existing content
    svg.innerHTML = '';
    legend.innerHTML = '';
    
    // Calculate total
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    
    // Create pie segments
    let startAngle = 0;
    pieData.forEach((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 360;
      const endAngle = startAngle + angle;
      
      // Convert angles to radians and calculate points on the circumference
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const centerX = 100;
      const centerY = 100;
      const radius = 80;
      
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      
      // Determine if the arc is larger than 180 degrees
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Create the path for the segment
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`);
      path.setAttribute('fill', item.color);
      path.setAttribute('data-index', index);
      path.setAttribute('data-label', item.label);
      path.setAttribute('data-value', item.value);
      
      // Add hover effect
      path.addEventListener('mouseenter', (e) => {
        const segment = e.target;
        segment.setAttribute('opacity', '0.8');
        
        // Position and show tooltip
        tooltip.innerHTML = `
          <strong>${item.label}:</strong> ${item.value}% do fluxo emergético
        `;
        tooltip.style.opacity = '1';
        tooltip.style.top = '0';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      });
      
      path.addEventListener('mouseleave', (e) => {
        const segment = e.target;
        segment.setAttribute('opacity', '1');
        tooltip.style.opacity = '0';
      });
      
      svg.appendChild(path);
      
      // Create labels for segments (only for larger segments)
      if (item.value >= 20) {
        const textRad = startRad + (endRad - startRad) / 2;
        const textDistance = radius * 0.6;
        const textX = centerX + textDistance * Math.cos(textRad);
        const textY = centerY + textDistance * Math.sin(textRad);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#ffffff');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = `${item.value}%`;
        
        svg.appendChild(text);
      }
      
      // Update the start angle for the next segment
      startAngle = endAngle;
      
      // Add to legend
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
        <div class="legend-color" style="background-color: ${item.color}"></div>
        <span>${item.label}</span>
      `;
      
      legendItem.addEventListener('mouseenter', () => {
        // Highlight corresponding pie segment
        const segment = svg.querySelector(`path[data-index="${index}"]`);
        if (segment) {
          segment.setAttribute('opacity', '0.8');
          
          // Show tooltip
          tooltip.innerHTML = `
            <strong>${item.label}:</strong> ${item.value}% do fluxo emergético
          `;
          tooltip.style.opacity = '1';
          tooltip.style.top = '0';
          tooltip.style.left = '50%';
          tooltip.style.transform = 'translateX(-50%)';
        }
      });
      
      legendItem.addEventListener('mouseleave', () => {
        // Remove highlight from pie segment
        const segment = svg.querySelector(`path[data-index="${index}"]`);
        if (segment) {
          segment.setAttribute('opacity', '1');
          tooltip.style.opacity = '0';
        }
      });
      
      legend.appendChild(legendItem);
    });
  }
  
  // Contact form submission
  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple form validation
        if (!email || !message) {
          alert('Por favor, preencha todos os campos.');
          return;
        }
      });
    }
  });