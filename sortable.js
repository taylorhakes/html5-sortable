(function() {
  'use strict';

  function Sortable(options) {
    var dragEl = null,
      type = options.type || 'insert', // insert or swap
      slice = function(arr, start, end) {
		  return Array.prototype.slice.apply(arr, start, end)
	  },
      sortables;

    function handleDragStart(e) {
      e.dataTransfer.effectAllowed = 'move';

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
      var dragElPos, dragElParent;

      // this/e.target is current target element.
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }

      // Don't do anything if we're dropping on the same column we're dragging.
      if (dragEl !== this) {
        dragElParent = dragEl.parentNode;
        if (type === 'swap') {
          dragElPos = slice(dragElParent.children).indexOf(dragEl);

          dragElParent.insertBefore(dragEl, this);
          if (dragElPos === 0 && !dragElParent.children[0]) {
            dragElParent.appendChild(this);
          } else {
            dragElParent.insertBefore(this, dragElParent.children[dragElPos]);
          }
        } else {
          dragElParent.insertBefore(dragEl, this);
        }

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
        modifyListeners(col, 'remove');
      });
    }

    function modifyListeners(el, addOrRemove) {
      el[addOrRemove+'EventListener']('dragstart', handleDragStart);
      el[addOrRemove+'EventListener']('dragenter', handleDragEnter);
      el[addOrRemove+'EventListener']('dragover', handleDragOver);
      el[addOrRemove+'EventListener']('dragleave', handleDragLeave);
      el[addOrRemove+'EventListener']('drop', handleDrop);
      el[addOrRemove+'EventListener']('dragend', handleDragEnd);
    }

    function init() {
      if (typeof options.els === 'string') {
        sortables = slice(document.querySelectorAll(options.els));
      } else {
        sortables = slice(options.els);
      }

      sortables.forEach(function (col) {
        col.setAttribute('draggable', 'true');  // Enable columns to be draggable.
        modifyListeners(col, 'add')
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
