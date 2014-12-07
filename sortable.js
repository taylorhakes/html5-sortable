(function() {
  'use strict';

  function Sortable(options) {
    var dragEl = null,
      sortables;

    function handleDragStart(e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);

      dragEl = this;

      // this/e.target is the source node.
      this.classList.add('moving');
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Allows us to drop.
      }

      e.dataTransfer.dropEffect = 'move';

      return false;
    }

    function handleDragEnter() {
      this.classList.add('over');
    }

    function handleDragLeave() {

      // this/e.target is previous target element.
      this.classList.remove('over');
    }

    function handleDrop(e) {

      // this/e.target is current target element.
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }

      // Don't do anything if we're dropping on the same column we're dragging.
      if (dragEl != this) {
        dragEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
      }

      return false;
    }

    function handleDragEnd() {
      // this/e.target is the source node.
      this.style.opacity = '1';

      [].forEach.call(sortables, function (col) {
        col.classList.remove('over', 'moving');
      });
    }

    function destroy() {
      sortables.forEach(function (col) {
        col.removeAttribute('draggable', 'true');  // Enable columns to be draggable.
        col.removeEventListener('dragstart', handleDragStart);
        col.removeEventListener('dragenter', handleDragEnter);
        col.removeEventListener('dragover', handleDragOver);
        col.removeEventListener('dragleave', handleDragLeave);
        col.removeEventListener('drop', handleDrop);
        col.removeEventListener('dragend', handleDragEnd);
      });
    }

    function init() {
      if (typeof options.els === 'string') {
        sortables = [].slice.call(document.querySelector(options.els));
      } else {
        sortables = [].slice.call(options.els);
      }

      sortables.forEach(function (col) {
        col.setAttribute('draggable', 'true');  // Enable columns to be draggable.
        col.addEventListener('dragstart', handleDragStart);
        col.addEventListener('dragenter', handleDragEnter);
        col.addEventListener('dragover', handleDragOver);
        col.addEventListener('dragleave', handleDragLeave);
        col.addEventListener('drop', handleDrop);
        col.addEventListener('dragend', handleDragEnd);
      });
    }

    init();

    return {
      destroy: destroy
    };
  }

  if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = Sortable;
  } else {
    window['Sortable'] = Sortable;
  }
})();
