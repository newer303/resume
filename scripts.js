const defaultData = {
  name: 'Yodchan Suphaphan',
  title: 'Full-Stack Developer',
  location: 'กรุงเทพมหานคร, ประเทศไทย',
  avatar: 'YS',
  avatarImage: null, // data URL (base64) for profile image
  contact: {
    email: 'nkegamer1@gmail.com',
    phone: '+66 96-730-1189',
    github: 'https://github.com/newer303',
    linkedin: 'yodchan-suphaphan'
  },
  summary: 'ชอบการทำงานที่ได้ใช้ความคิดสร้างสรรค์และแก้ปัญหา มีประสบการณ์ในการพัฒนาเว็บไซต์และออกแบบ UI/UX ด้วยทักษะด้าน Frontend Development และความเข้าใจในกระบวนการออกแบบที่ดี มีความสามารถในการทำงานร่วมกับทีมและสื่อสารได้อย่างมีประสิทธิภาพ',
  education: [
    {
      degree: 'ปริญญาตรี',
      major: 'วิศวกรรมซอฟต์แวร์',
      institution: 'มหาวิทยาลัยตัวอย่าง',
      period: '2016 - 2020',
      location: 'กรุงเทพมหานคร',
      bullets: ['เกรดเฉลี่ย 3.50', 'กิจกรรม: ทีมซอฟต์แวร์']
    }
  ],
  skills: [
    { name: 'HTML/CSS' },
    { name: 'PHP' },
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'UI / Figma' },
    { name: 'Node.js' },
    { name: 'Next.js' },
    { name: 'TypeScript' }
  ],
  tools: [
    'Git / GitHub',
    'VS Code',
    'Figma',
    'Roblox Studio',
    'Unity'
  ],
  softSkills: [
    'การทำงานเป็นทีม',
    'การแก้ปัญหา',
    'ความคิดสร้างสรรค์',
    'การจัดการเวลา'
  ],
  experience: [
    {
      title: 'Frontend Developer',
      company: 'บริษัทตัวอย่าง',
      period: 'มิ.ย. 2021 - ปัจจุบัน',
      location: 'กรุงเทพมหานคร',
      bullets: [
        'พัฒนา UI ด้วย React และจัดการ state ด้วย Redux / Context',
        'ออกแบบและปรับปรุงประสิทธิภาพเว็บไซต์ให้โหลดเร็วขึ้น 30%',
        'ร่วมออกแบบ UX และทำ prototype ด้วย Figma'
      ]
    },
    {
      title: 'Junior Web Developer',
      company: 'บริษัทต้น',
      period: 'ม.ค. 2020 - พ.ค. 2021',
      location: 'กรุงเทพมหานคร',
      bullets: [
        'เขียน HTML/CSS ที่เข้ากับมาตรฐาน Responsive และเข้าถึงได้ (accessibility)',
        'ร่วมพัฒนาแอปพลิเคชันเว็บบน Node.js สำหรับระบบภายใน'
      ]
    }
  ],
  projects: [
    { title: 'ระบบจองเวลาออนไลน์', desc: 'ออกแบบ UI/UX และพัฒนา frontend ให้ลูกค้าสามารถจองบริการได้อย่างราบรื่น รองรับมือถือและเดสก์ท็อป' },
    { title: 'แดชบอร์ดวิเคราะห์', desc: 'สร้างแดชบอร์ดด้วย React + D3 เพื่อแสดงข้อมูลเชิงลึกและชาร์ตต่าง ๆ' }
  ]
};

// Initialize current data - load from localStorage or use default
let currentData = (() => {
  const stored = localStorage.getItem('resume_data_v1');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultData));
})();

// Storage API for data persistence across pages
window.resumeStorage = {
  load: function () {
    const stored = localStorage.getItem('resume_data_v1');
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
    localStorage.setItem('resume_data_v1', JSON.stringify(data));
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
  if (avatarEl) {
    if (data.avatarImage) {
      avatarEl.innerHTML = `<img src="${data.avatarImage}" alt="${data.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
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
    skillsEl.innerHTML = data.skills.map(s => `<li>${typeof s === 'string' ? s : s.name || ''}</li>`).join('');
  }

  const toolsEl = document.getElementById('tools-render');
  if (toolsEl) {
    toolsEl.innerHTML = data.tools.map(tool => `<li>${typeof tool === 'string' ? tool : tool.name || ''}</li>`).join('');
  }

  const softSkillsEl = document.getElementById('soft-skills-render');
  if (softSkillsEl) {
    softSkillsEl.innerHTML = data.softSkills.map(skill => `<li>${typeof skill === 'string' ? skill : skill.name || ''}</li>`).join('');
  }

  const educationEl = document.getElementById('education-render');
  if (educationEl) {
    educationEl.innerHTML = data.education.map(item => {
      const majorText = item.major ? ` • ${item.major}` : '';
      return `
            <div style="margin-bottom:15px">
                <div style="font-weight:700; font-size:14px">${item.degree}${majorText}</div>
                <div style="font-size:12px; color:var(--muted)">${item.period}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:8px">${item.institution} • ${item.location}</div>
                <ul style="margin:10px 0 0;padding-left:18px;color:var(--text-muted);font-size:13px;">
                    ${item.bullets.map(b => `<li>${b}</li>`).join('')}
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
                        <h3 class="job-title">${exp.title}</h3>
                        <div class="job-company">${exp.company}</div>
                    </div>
                    <span class="job-date">${exp.period}</span>
                </div>
                <ul class="job-list">
                    ${exp.bullets.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
        `).join('');
  }

  const projContainer = document.getElementById('projects-render');
  if (projContainer) {
    projContainer.innerHTML = data.projects.map(p => `
            <div class="project-card">
                <h4>${p.title}</h4>
                <p>${p.desc}</p>
            </div>
        `).join('');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderResume();

  // Auto-print if opened from editor with ?print=true
  const params = new URLSearchParams(window.location.search);
  if (params.get('print') === 'true') {
    setTimeout(() => exportPDF(), 500);
  }
});

function exportPDF() {
  const element = document.body;
  const opt = {
    margin: 0,
    filename: 'resume-yodchan.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Hide button before export
  const btn = document.querySelector('.btn-print');
  if (btn) btn.style.display = 'none';

  html2pdf().set(opt).from(element).save().then(() => {
    if (btn) btn.style.display = '';
  });
}

function editProfile() {
  showPasswordModal();
}

function showPasswordModal() {
  let overlay = document.getElementById('password-modal-overlay');
  
  if (!overlay) {
    // Create modal HTML if it doesn't exist
    const modalHTML = `
      <div id="password-modal-overlay" class="password-modal-overlay">
        <div class="password-modal">
          <div class="password-modal-header">
            <i data-lucide="lock"></i>
            <div>
              <h2 class="password-modal-title">กรุณาป้อนรหัสผ่าน</h2>
              <p class="password-modal-subtitle">เข้าถึงการแก้ไขข้อมูลโปรไฟล์</p>
            </div>
          </div>
          <div class="password-modal-content">
            <div class="password-error" id="password-error"></div>
            <div class="password-input-group">
              <label for="password-input">รหัสผ่าน</label>
              <input type="password" id="password-input" placeholder="กรุณาป้อนรหัสผ่าน" onkeypress="if(event.key==='Enter') verifyPassword()">
            </div>
          </div>
          <div class="password-modal-buttons">
            <button class="btn-modal btn-modal-cancel" onclick="closePasswordModal()">ยกเลิก</button>
            <button class="btn-modal btn-modal-submit" onclick="verifyPassword()">ยืนยัน</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    overlay = document.getElementById('password-modal-overlay');
    
    // Update lucide icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  
  // Clear previous input and error
  const passwordInput = document.getElementById('password-input');
  const errorDiv = document.getElementById('password-error');
  
  passwordInput.value = '';
  errorDiv.classList.remove('show');
  errorDiv.textContent = '';
  
  // Show modal
  overlay.classList.add('active');
  setTimeout(() => {
    const modal = document.querySelector('.password-modal');
    if (modal) modal.classList.add('active');
  }, 10);
  
  // Focus input
  setTimeout(() => passwordInput.focus(), 300);
  
  // Allow closing with Escape key
  document.addEventListener('keydown', handleEscapeKey);
}

function closePasswordModal() {
  const overlay = document.getElementById('password-modal-overlay');
  const modal = document.querySelector('.password-modal');
  
  if (modal) modal.classList.remove('active');
  
  setTimeout(() => {
    if (overlay) overlay.classList.remove('active');
  }, 200);
  
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closePasswordModal();
  }
}

function verifyPassword() {
  const correctPassword = '13465';
  const passwordInput = document.getElementById('password-input');
  const errorDiv = document.getElementById('password-error');
  const enteredPassword = passwordInput.value;
  
  if (enteredPassword === correctPassword) {
    // Password correct - transition to new page
    closePasswordModal();
    setTimeout(() => {
      window.location.href = 'edit_resume.html';
    }, 300);
  } else {
    // Password incorrect
    errorDiv.textContent = '❌ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    errorDiv.classList.add('show');
    passwordInput.value = '';
    passwordInput.focus();
  }
}
