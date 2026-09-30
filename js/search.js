(function () {
  const MAX_RESULTS = 8;
  const SNIPPET_RADIUS = 70;

  let indexPromise = null;
  let index = null;
  let activeIndex = -1;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Fetch elasticlunr and the index only on first use, so ordinary page loads stay light
  function loadIndex(form) {
    if (!indexPromise) {
      indexPromise = loadScript(form.dataset.lib)
        .then(function () { return loadScript(form.dataset.index); })
        .then(function () {
          index = elasticlunr.Index.load(window.searchIndex);
          return index;
        })
        .catch(function (e) {
          indexPromise = null;
          throw e;
        });
    }
    return indexPromise;
  }

  function snippet(body, terms) {
    if (!body) return '';
    const lower = body.toLowerCase();
    let pos = -1;
    for (const term of terms) {
      pos = lower.indexOf(term);
      if (pos !== -1) break;
    }
    if (pos === -1) return body.slice(0, SNIPPET_RADIUS * 2).trim() + '…';
    const start = Math.max(0, pos - SNIPPET_RADIUS);
    const end = Math.min(body.length, pos + SNIPPET_RADIUS);
    return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
  }

  function search(query) {
    const results = index.search(query, {
      bool: 'AND',
      expand: true,
      fields: {
        title: { boost: 3 },
        body: { boost: 1 },
      },
    });
    return results
      .map(function (r) { return index.documentStore.getDoc(r.ref); })
      // The posts section list page itself is indexed alongside its pages; skip it
      .filter(function (doc) { return doc && doc.title; })
      .slice(0, MAX_RESULTS);
  }

  function render(list, input, docs, query) {
    list.replaceChildren();
    activeIndex = -1;

    if (!docs.length) {
      const empty = document.createElement('li');
      empty.className = 'search-empty';
      empty.textContent = 'No posts found for “' + query + '”';
      list.appendChild(empty);
    }

    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    docs.forEach(function (doc, i) {
      const li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.id = 'search-result-' + i;

      const a = document.createElement('a');
      a.href = doc.id;

      const title = document.createElement('span');
      title.className = 'search-title';
      title.textContent = doc.title;
      a.appendChild(title);

      if (doc.date) {
        const date = document.createElement('span');
        date.className = 'search-date';
        date.textContent = doc.date.slice(0, 10);
        a.appendChild(date);
      }

      const text = document.createElement('span');
      text.className = 'search-snippet';
      text.textContent = snippet(doc.body, terms);
      a.appendChild(text);

      li.appendChild(a);
      list.appendChild(li);
    });

    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function close(list, input) {
    list.hidden = true;
    activeIndex = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function highlight(list, input, next) {
    const options = list.querySelectorAll('[role="option"]');
    if (!options.length) return;
    activeIndex = (next + options.length) % options.length;
    options.forEach(function (opt, i) {
      opt.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
    });
    input.setAttribute('aria-activedescendant', options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const list = document.getElementById('search-results');
    if (!form || !input || !list) return;

    let debounce = null;

    input.addEventListener('focus', function () { loadIndex(form).catch(function () {}); });

    input.addEventListener('input', function () {
      clearTimeout(debounce);
      const query = input.value.trim();
      if (!query) {
        close(list, input);
        return;
      }
      debounce = setTimeout(function () {
        loadIndex(form)
          .then(function () { render(list, input, search(query), query); })
          .catch(function () {
            list.replaceChildren();
            const err = document.createElement('li');
            err.className = 'search-empty';
            err.textContent = 'Search is unavailable right now';
            list.appendChild(err);
            list.hidden = false;
          });
      }, 120);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlight(list, input, activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlight(list, input, activeIndex - 1);
      } else if (e.key === 'Escape') {
        close(list, input);
        input.blur();
      }
    });

    // Enter opens the highlighted result, or the top one if nothing is highlighted
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const links = list.querySelectorAll('[role="option"] a');
      const target = links[activeIndex] || links[0];
      if (target) window.location.href = target.href;
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) close(list, input);
    });

    // "/" focuses search from anywhere, unless the reader is already typing
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
      e.preventDefault();
      input.focus();
    });
  });
})();
