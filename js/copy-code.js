document.addEventListener('DOMContentLoaded', function () {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(function (block) {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.type = 'button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code snippet to clipboard');

    button.addEventListener('click', function () {
      const code = block.querySelector('code');
      let text = code ? code.textContent : block.textContent;
      if (!code) {
        const clone = block.cloneNode(true);
        const btn = clone.querySelector('.copy-code-btn');
        if (btn) {
          btn.remove();
          text = clone.textContent;
        }
      }

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        button.textContent = 'Failed';
        setTimeout(function () {
          button.textContent = 'Copy';
        }, 2000);
        return;
      }

      navigator.clipboard.writeText(text).then(function () {
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(function () {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        button.textContent = 'Failed';
        setTimeout(function () {
          button.textContent = 'Copy';
        }, 2000);
      });
    });

    block.appendChild(button);
  });
});
