(function () {
  var dialog = document.getElementById('preview-dialog');
  var previewPaper = document.getElementById('dialog-paper');
  var previewTitle = document.getElementById('preview-title');
  var previewKind = document.getElementById('dialog-kind');
  var previewDescription = document.getElementById('preview-description');
  var dialogCreate = document.getElementById('dialog-create');
  var closeButton = dialog.querySelector('.dialog-close');
  var activeCard = null;

  function beginCreation(card) {
    var template = card.dataset.template;
    localStorage.setItem('forma_selected_template', template);
    window.location.href = 'edit_resume.html?kind=' + encodeURIComponent(card.dataset.kind.toLowerCase()) + '&template=' + encodeURIComponent(template);
  }

  function showPreview(card) {
    activeCard = card;
    var thumbnail = card.querySelector('.mini-paper');
    previewPaper.replaceChildren(thumbnail.cloneNode(true));
    previewTitle.textContent = card.dataset.title;
    previewKind.textContent = card.dataset.kind + ' TEMPLATE';
    previewDescription.textContent = card.dataset.description;
    dialog.showModal();
  }

  document.querySelectorAll('.template-card').forEach(function (card) {
    card.querySelector('.preview-stage').addEventListener('click', function () { showPreview(card); });
    card.querySelector('.create-button').addEventListener('click', function () { beginCreation(card); });
    card.querySelector('.preview-stage').setAttribute('tabindex', '0');
    card.querySelector('.preview-stage').setAttribute('role', 'button');
    card.querySelector('.preview-stage').setAttribute('aria-label', 'ดูตัวอย่าง ' + card.dataset.kind + ' แบบ ' + card.dataset.title);
    card.querySelector('.preview-stage').addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showPreview(card); }
    });
  });

  closeButton.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialogCreate.addEventListener('click', function () { if (activeCard) beginCreation(activeCard); });
})();
