const commentsListEl = document.getElementById('commentsList');
const loaderEl = document.getElementById('loader');
const errorEl = document.getElementById('error');

async function fetchComments() {
  show(loaderEl);
  hide(errorEl);
  try {
    const res = await fetch('/api/comments');
    if (!res.ok) throw new Error('Failed to load comments');
    const comments = await res.json();
    renderComments(comments);
  } catch (e) {
    errorEl.textContent = e.message || 'Something went wrong.';
    show(errorEl);
  } finally {
    hide(loaderEl);
  }
}

function renderComments(comments) {
  commentsListEl.innerHTML = '';
  comments.forEach((c) => commentsListEl.appendChild(createCommentItem(c)));
}

function createCommentItem(comment) {
  const li = document.createElement('li');
  li.className = 'comment';

  // View mode
  const viewRow = document.createElement('div');
  viewRow.className = 'row view-mode';

  const viewText = document.createElement('div');
  viewText.className = 'text';
  viewText.textContent = comment.body;

  viewRow.appendChild(viewText);

  // Edit mode
  const editRow = document.createElement('div');
  editRow.className = 'row edit-mode hidden';

  const textarea = document.createElement('textarea');
  textarea.value = comment.body;
  textarea.setAttribute('rows', '2');
  textarea.className = 'editor';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'btn save';

  // Switch to edit when clicking on the view text
  viewRow.addEventListener('click', () => {
    textarea.value = viewText.textContent;
    toggleMode(li, true);
    textarea.focus();
  });

  // Save handler
  saveBtn.addEventListener('click', async () => {
    const newBody = textarea.value.trim();
    if (newBody.length === 0) {
      alert('Comment cannot be empty.');
      textarea.focus();
      return;
    }
    try {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newBody })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }

      viewText.textContent = newBody; // Update UI
      toggleMode(li, false); // Back to view mode
    } catch (e) {
      alert(e.message || 'Failed to save comment');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  });

  editRow.appendChild(textarea);
  editRow.appendChild(saveBtn);

  li.appendChild(viewRow);
  li.appendChild(editRow);
  return li;
}

function toggleMode(li, isEdit) {
  const view = li.querySelector('.view-mode');
  const edit = li.querySelector('.edit-mode');
  if (isEdit) {
    view.classList.add('hidden');
    edit.classList.remove('hidden');
  } else {
    edit.classList.add('hidden');
    view.classList.remove('hidden');
  }
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

// Load comments on start
document.addEventListener('DOMContentLoaded', fetchComments);