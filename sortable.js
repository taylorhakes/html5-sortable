(function () {
	'use strict';

	/**
	 * Make a group of items sortable
	 * @method Sortable
	 * @param options {Object} Object of options
	 * @param options.type {'insert'|'swap'} Moving inserts or swaps items
	 * @param options.onDragEnter {Function} Item enters a drop target
	 * @param options.onDragOver {Function} Item over drop target
	 * @param options.onDragLeave {Function} Item leaves a drop target
	 * @param options.onDragStart {Function} Item started dragging
	 * @param options.onDragStart {Function} Item stopped dragging
	 * @param options.onDrop {Function} Item is dropped
	 * @returns {{destroy: destroy}}
	 * @constructor
	 */
	function Sortable(options) {
		var dragEl = null,
			type = options.type || 'insert', // insert or swap
			slice = function (arr, start, end) {
				return Array.prototype.slice.call(arr, start, end)
			},
			sortables,
			overClass = options.overClass || 'sortable-over',
			movingClass = options.movingClass || 'sortable-moving';

		function handleDragStart(e) {
			e.dataTransfer.effectAllowed = 'move';

			dragEl = this;

			// this/e.target is the source node.
			this.classList.add(movingClass);

			if (options.onDragStart) {
				options.onDragStart(e);
			}
		}

		function handleDragOver(e) {
			if (e.preventDefault) {
				e.preventDefault(); // Allows us to drop.
			}

			e.dataTransfer.dropEffect = 'move';


			if (options.onDragOver) {
				options.onDragOver(e);
			}
			return false;
		}

		function handleDragEnter() {
			this.classList.add(overClass);

			if (options.onDragEnter) {
				options.onDragEnter(e);
			}
		}

		function handleDragLeave() {
			// this/e.target is previous target element.
			this.classList.remove(overClass);

			if (options.onDragLeave) {
				options.onDragLeave(e);
			}
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

			if (options.onDrop) {
				options.onDrop(e);
			}

			return false;
		}

		function handleDragEnd() {
			// this/e.target is the source node.
			this.style.opacity = '1';

			[].forEach.call(sortables, function (col) {
				col.classList.remove(overClass, movingClass);
			});

			if (options.onDragEnd) {
				options.onDragEnd(e);
			}
		}

		function destroy() {
			sortables.forEach(function (col) {
				col.removeAttribute('draggable', 'true');  // Enable columns to be draggable.
				modifyListeners(col, 'remove');
			});
		}

		function modifyListeners(el, addOrRemove) {
			el[addOrRemove + 'EventListener']('dragstart', handleDragStart);
			el[addOrRemove + 'EventListener']('dragenter', handleDragEnter);
			el[addOrRemove + 'EventListener']('dragover', handleDragOver);
			el[addOrRemove + 'EventListener']('dragleave', handleDragLeave);
			el[addOrRemove + 'EventListener']('drop', handleDrop);
			el[addOrRemove + 'EventListener']('dragend', handleDragEnd);
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
