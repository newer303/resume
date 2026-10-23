const defaultData = {
  name: '',
  title: '',
  location: '',
  avatar: 'YN',
  avatarImage: null,
  contact: { email: '', phone: '', github: '', linkedin: '' },
  summary: '',
  education: [],
  skills: [],
  tools: [],
  softSkills: [],
  experience: [],
  projects: []
};

// Each selected design keeps its own draft in this browser.
const resumeStorageKey = window.resumeStorageKey || 'forma_resume_data_default';
const escapeHTML = value => String(value == null ? '' : value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
let currentData = (() => {
  const stored = localStorage.getItem(resumeStorageKey);
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultData));
})();

// Storage API for data persistence across pages
window.resumeStorage = {
  load: function () {
    const stored = localStorage.getItem(resumeStorageKey);
    if (stored) {
      try {
        currentData = JSON.parse(stored);
      } catch (error) {
        currentData = JSON.parse(JSON.stringify(defaultData));
      }
    } else {
      currentData = JSON.parse(JSON.stringify(defaultData));
    }

    currentData = Object.assign({}, JSON.parse(JSON.stringify(defaultData)), currentData || {});
    currentData.contact = Object.assign({}, defaultData.contact, currentData.contact || {});
    currentData.education = Array.isArray(currentData.education) ? currentData.education : [];
    currentData.skills = Array.isArray(currentData.skills) ? currentData.skills : [];
    currentData.tools = Array.isArray(currentData.tools) ? currentData.tools : [];
    currentData.softSkills = Array.isArray(currentData.softSkills) ? currentData.softSkills : [];
    currentData.experience = Array.isArray(currentData.experience) ? currentData.experience : [];
    currentData.projects = Array.isArray(currentData.projects) ? currentData.projects : [];

    return currentData;
  },
  save: function (data) {
    currentData = data;
    localStorage.setItem(resumeStorageKey, JSON.stringify(data));
    // Re-render if on the resume page
    if (document.getElementById('res-name')) {
      renderResume();
    }
  },
  render: function () {
    if (document.getElementById('res-name')) {
      renderResume();
    }
  }
};

function renderResume() {
  const params = new URLSearchParams(window.location.search);
  const selectedTemplate = params.get('template') || localStorage.getItem('forma_selected_template') || 'resume-professional';
  localStorage.setItem('forma_selected_template', selectedTemplate);
  document.documentElement.dataset.template = selectedTemplate;
  document.body.dataset.template = selectedTemplate;
  let data = window.resumeStorage ? window.resumeStorage.load() : currentData;
  data = Object.assign({}, defaultData, data || {});
  data.contact = Object.assign({}, defaultData.contact, data.contact || {});
  data.education = Array.isArray(data.education) ? data.education.map(item => {
    const normalized = Object.assign({ major: '', bullets: [] }, item);
    normalized.bullets = Array.isArray(normalized.bullets) ? normalized.bullets : [];
    return normalized;
  }) : [];
  data.skills = Array.isArray(data.skills) ? data.skills : [];
  data.tools = Array.isArray(data.tools) ? data.tools : [];
  data.softSkills = Array.isArray(data.softSkills) ? data.softSkills : [];
  data.experience = Array.isArray(data.experience) ? data.experience.map(item => {
    const normalized = Object.assign({ bullets: [] }, item);
    normalized.bullets = Array.isArray(normalized.bullets) ? normalized.bullets : [];
    return normalized;
  }) : [];
  data.projects = Array.isArray(data.projects) ? data.projects.map(item => Object.assign({ title: '', desc: '' }, item)) : [];

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('res-name', data.name);
  setText('res-title', data.title);
  setText('res-location', data.location);
  setText('res-profile-name', data.name);
  const githubHandle = (data.contact.github || '').replace(/^https?:\/\/(www\.)?github\.com\//, '');
  setText('res-profile-handle', '@' + githubHandle);
  setText('res-location-sidebar', data.location);

  const avatarEl = document.getElementById('res-avatar');
  const selectedTemplateId = document.documentElement.dataset.template || '';
  const noPhotoVariant = selectedTemplateId.endsWith('-no-photo');
  const showAvatar = !noPhotoVariant && (selectedTemplateId.endsWith('-photo') || selectedTemplateId.startsWith('resume-'));
  if (avatarEl) {
    avatarEl.hidden = !showAvatar;
    if (data.avatarImage) {
      avatarEl.innerHTML = `<img src="${escapeHTML(data.avatarImage)}" alt="${escapeHTML(data.name)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
      avatarEl.textContent = data.avatar;
    }
  }

  const emailEl = document.getElementById('res-email');
  if (emailEl) {
    emailEl.textContent = data.contact.email;
    emailEl.href = 'mailto:' + data.contact.email;
  }

  const phoneEl = document.getElementById('res-phone');
  if (phoneEl) {
    phoneEl.textContent = data.contact.phone;
    phoneEl.href = 'tel:' + data.contact.phone;
  }

  const githubEl = document.getElementById('res-github');
  if (githubEl) {
    const githubRaw = data.contact.github || '';
    githubEl.textContent = githubRaw.replace(/^https?:\/\//, '');
    githubEl.href = githubRaw;
  }

  const linkedinEl = document.getElementById('res-linkedin');
  if (linkedinEl) {
    const linkedinRaw = data.contact.linkedin || '';
    const linkedinUrl = linkedinRaw.startsWith('http')
      ? linkedinRaw
      : 'https://linkedin.com/' + linkedinRaw;
    linkedinEl.textContent = linkedinUrl.replace(/^https?:\/\//, '');
    linkedinEl.href = linkedinUrl;
  }

  const summaryEl = document.getElementById('res-summary');
  if (summaryEl) {
    summaryEl.textContent = data.summary;
  }

  const skillsEl = document.getElementById('skills-render');
  if (skillsEl) {
    skillsEl.innerHTML = data.skills.map(s => `<li>${escapeHTML(typeof s === 'string' ? s : s.name || '')}</li>`).join('');
  }

  const toolsEl = document.getElementById('tools-render');
  if (toolsEl) {
    toolsEl.innerHTML = data.tools.map(tool => `<li>${escapeHTML(typeof tool === 'string' ? tool : tool.name || '')}</li>`).join('');
  }

  const softSkillsEl = document.getElementById('soft-skills-render');
  if (softSkillsEl) {
    softSkillsEl.innerHTML = data.softSkills.map(skill => `<li>${escapeHTML(typeof skill === 'string' ? skill : skill.name || '')}</li>`).join('');
  }

  const educationEl = document.getElementById('education-render');
  if (educationEl) {
    educationEl.innerHTML = data.education.map(item => {
      const majorText = item.major ? ` • ${item.major}` : '';
      return `
            <div style="margin-bottom:15px">
                <div style="font-weight:700; font-size:14px">${escapeHTML(item.degree)}${escapeHTML(majorText)}</div>
                <div style="font-size:12px; color:var(--muted)">${escapeHTML(item.period)}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:8px">${escapeHTML(item.institution)} • ${escapeHTML(item.location)}</div>
                <ul style="margin:10px 0 0;padding-left:18px;color:var(--text-muted);font-size:13px;">
                    ${item.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
                </ul>
            </div>
        `;
    }).join('');
  }

  const expContainer = document.getElementById('experience-render');
  if (expContainer) {
    expContainer.innerHTML = data.experience.map(exp => `
            <div class="job-card">
                <div class="job-header">
                    <div>
                        <h3 class="job-title">${escapeHTML(exp.title)}</h3>
                        <div class="job-company">${escapeHTML(exp.company)}</div>
                    </div>
                    <span class="job-date">${escapeHTML(exp.period)}</span>
                </div>
                <ul class="job-list">
                    ${exp.bullets.map(t => `<li>${escapeHTML(t)}</li>`).join('')}
                </ul>
            </div>
        `).join('');
  }

  const projContainer = document.getElementById('projects-render');
  if (projContainer) {
    projContainer.innerHTML = data.projects.map(p => `
            <div class="project-card">
                <h4>${escapeHTML(p.title)}</h4>
                <p>${escapeHTML(p.desc)}</p>
            </div>
        `).join('');
  }

  if (summaryEl) summaryEl.hidden = !String(data.summary || '').trim();
  [
    [skillsEl, data.skills.length],
    [toolsEl, data.tools.length],
    [softSkillsEl, data.softSkills.length]
  ].forEach(([list, count]) => {
    if (!list) return;
    list.hidden = count === 0;
    if (list.previousElementSibling) list.previousElementSibling.hidden = count === 0;
  });
  const educationCard = educationEl && educationEl.closest('.profile-card');
  if (educationCard) educationCard.hidden = data.education.length === 0;
  [[expContainer, data.experience.length], [projContainer, data.projects.length]].forEach(([section, count]) => {
    if (!section) return;
    section.hidden = count === 0;
    if (section.previousElementSibling) section.previousElementSibling.hidden = count === 0;
  });
  [['res-email', data.contact.email], ['res-phone', data.contact.phone], ['res-github', data.contact.github], ['res-linkedin', data.contact.linkedin]].forEach(([id, value]) => {
    const item = document.getElementById(id);
    if (item && item.closest('li')) item.closest('li').hidden = !String(value || '').trim();
  });
  const locationEl = document.getElementById('res-location-sidebar');
  if (locationEl && locationEl.closest('li')) locationEl.closest('li').hidden = !String(data.location || '').trim();
  const contactList = document.querySelector('.contact-list');
  if (contactList) {
    const hasContact = Array.from(contactList.children).some(item => !item.hidden);
    contactList.hidden = !hasContact;
    const heading = contactList.previousElementSibling;
    if (heading) heading.hidden = !hasContact;
  }
  const handleEl = document.getElementById('res-profile-handle');
  if (handleEl) handleEl.hidden = !String(data.contact.github || '').trim();

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSectionOrganizer();
  renderResume();

  // Auto-print if opened from editor with ?print=true
  const params = new URLSearchParams(window.location.search);
  if (params.get('print') === 'true') {
    setTimeout(() => exportPDF(), 500);
  }
});

function initializeSectionOrganizer() {
  const content = document.querySelector('.content');
  const toggle = document.getElementById('arrange-sections');
  if (!content || !toggle) return;

  const template = localStorage.getItem('forma_selected_template') || 'resume-professional';
  const storageKey = 'forma_layout_' + template;
  const labels = { summary: 'แนะนำตัว', experience: 'ประสบการณ์ทำงาน', projects: 'ผลงานโปรเจกต์' };
  const sections = [...content.querySelectorAll('[data-layout-section]')];
  let activeDrag = null;

  function saveOrder() {
    const order = [...content.querySelectorAll('[data-layout-section]')].map(section => section.dataset.layoutSection);
    localStorage.setItem(storageKey, JSON.stringify(order));
  }

  function move(section, direction) {
    const siblings = [...content.querySelectorAll('[data-layout-section]')];
    const index = siblings.indexOf(section);
    const target = siblings[index + direction];
    if (!target) return;
    if (direction < 0) content.insertBefore(section, target);
    else content.insertBefore(target, section);
    saveOrder();
    updateControls();
  }

  function updateControls() {
    const current = [...content.querySelectorAll('[data-layout-section]')];
    current.forEach((section, index) => {
      const controls = section.querySelector('.layout-controls');
      controls.hidden = !document.body.classList.contains('arranging-sections');
      controls.innerHTML = '<span class="layout-drag-handle" aria-hidden="true">⠿</span><strong>' + labels[section.dataset.layoutSection] + '</strong>' +
        '<button type="button" aria-label="เลื่อน' + labels[section.dataset.layoutSection] + 'ขึ้น" ' + (index === 0 ? 'disabled' : '') + '>↑</button>' +
        '<button type="button" aria-label="เลื่อน' + labels[section.dataset.layoutSection] + 'ลง" ' + (index === current.length - 1 ? 'disabled' : '') + '>↓</button>';
      const buttons = controls.querySelectorAll('button');
      buttons[0].addEventListener('click', () => move(section, -1));
      buttons[1].addEventListener('click', () => move(section, 1));
      section.draggable = document.body.classList.contains('arranging-sections');
    });
  }

  try {
    const savedOrder = JSON.parse(localStorage.getItem(storageKey) || '[]');
    savedOrder.forEach(id => {
      const section = sections.find(item => item.dataset.layoutSection === id);
      if (section) content.appendChild(section);
    });
  } catch (error) {
    localStorage.removeItem(storageKey);
  }

  sections.forEach(section => {
    section.addEventListener('dragstart', event => {
      if (!document.body.classList.contains('arranging-sections')) { event.preventDefault(); return; }
      activeDrag = section;
      section.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
    });
    section.addEventListener('dragend', () => {
      section.classList.remove('is-dragging');
      activeDrag = null;
      saveOrder();
      updateControls();
    });
    section.addEventListener('dragover', event => {
      if (!activeDrag || activeDrag === section) return;
      event.preventDefault();
      const box = section.getBoundingClientRect();
      const insertAfter = event.clientY > box.top + box.height / 2;
      content.insertBefore(activeDrag, insertAfter ? section.nextSibling : section);
    });
  });

  toggleSectionArrange = function () {
    const active = document.body.classList.toggle('arranging-sections');
    toggle.setAttribute('aria-pressed', String(active));
    toggle.innerHTML = active ? 'เสร็จสิ้นการจัดเรียง' : 'จัดเรียงส่วน';
    if (!active) saveOrder();
    updateControls();
  };

  updateControls();
}

function toggleSectionArrange() {}

function exportPDF() {
  const element = document.body;
  const opt = {
    margin: 0,
    filename: (localStorage.getItem('forma_selected_template') || 'resume').replace(/[^a-z0-9-]/gi, '-') + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Hide button before export
  const buttons = [...document.querySelectorAll('.btn-print')];
  buttons.forEach(btn => { btn.style.display = 'none'; });

  html2pdf().set(opt).from(element).save().then(() => {
    buttons.forEach(btn => { btn.style.display = ''; });
  });
}

function editProfile() {
  const template = localStorage.getItem('forma_selected_template') || 'resume-professional';
  window.location.href = 'edit_resume.html?template=' + encodeURIComponent(template);
}

