export function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  for (let line of lines) {
    if (line.startsWith('### ')) { if(inUl){html+='</ul>';inUl=false;} if(inOl){html+='</ol>';inOl=false;} html += `<h3>${applyInline(line.slice(4))}</h3>`; continue; }
    if (line.startsWith('## '))  { if(inUl){html+='</ul>';inUl=false;} if(inOl){html+='</ol>';inOl=false;} html += `<h2>${applyInline(line.slice(3))}</h2>`; continue; }
    if (line.startsWith('# '))   { if(inUl){html+='</ul>';inUl=false;} if(inOl){html+='</ol>';inOl=false;} html += `<h1>${applyInline(line.slice(2))}</h1>`; continue; }
    if (line.match(/^- \[x\] /i)) { html += `<div style="margin:4px 0"><label><input type="checkbox" checked disabled style="margin-right:6px"> ${applyInline(line.slice(6))}</label></div>`; continue; }
    if (line.match(/^- \[ \] /))  { html += `<div style="margin:4px 0"><label><input type="checkbox" disabled style="margin-right:6px"> ${applyInline(line.slice(6))}</label></div>`; continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUl) { if(inOl){html+='</ol>';inOl=false;} html += '<ul style="padding-left:1.5rem;margin:0.5rem 0">'; inUl = true; }
      html += `<li style="margin:3px 0">${applyInline(line.slice(2))}</li>`; continue;
    } else if (inUl) { html += '</ul>'; inUl = false; }
    if (line.match(/^\d+\. /)) {
      if (!inOl) { if(inUl){html+='</ul>';inUl=false;} html += '<ol style="padding-left:1.5rem;margin:0.5rem 0">'; inOl = true; }
      html += `<li style="margin:3px 0">${applyInline(line.replace(/^\d+\. /,''))}</li>`; continue;
    } else if (inOl) { html += '</ol>'; inOl = false; }
    if (line.startsWith('> ')) { html += `<blockquote style="border-left:3px solid var(--accent);padding-left:1rem;color:var(--text-muted);margin:0.5rem 0">${applyInline(line.slice(2))}</blockquote>`; continue; }
    if (line.trim() === '') { html += '<br>'; continue; }
    html += `<p style="margin:0.4rem 0;line-height:1.75">${applyInline(line)}</p>`;
  }
  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  return html;
}

function applyInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:var(--bg-secondary);padding:0.1em 0.4em;border-radius:4px;font-size:0.88em">$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;border-radius:8px;margin:4px 0">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent)">$1</a>');
}
