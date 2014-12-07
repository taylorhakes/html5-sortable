(function() {
  'use strict';

  describe('sortable', function() {
    var els = [], s;
    beforeEach(function() {
      els = [];
      for (var i = 9; i >= 0; i--) {
        var el = document.createElement('div');
        el.className = 'col';
        el.id = 'element-' + i;
        el.style.height = '50px';
        el.style.width = '50px';
        el.style.border = '1px solid #000';
        el.style.display = 'inline-block';
        el.style.userSelect = 'none';
        el.style.webkitUserDrag = 'element';
        el.textContent = 'element ' + i;
        document.body.appendChild(el);
        els.push(el);
      }
    });
    afterEach(function() {
      els.forEach(function(el) {
        el.parentNode.removeChild(el);
      });
    });
    describe('basic functionality', function() {;
      it('basic sort', function() {
        s = Sortable({
          els: els
        });
        var draggable = [].every.call($('.col'), function(el) {
          return $(el).is('[draggable]');
        });
        $('.col:eq(0)').simulateDragDrop({
          dropTarget: '.col:eq(2)'
        });
        expect(draggable).toBe(true);
        expect($('.col:eq(0)').text()).toBe('element 7');
        expect($('.col:eq(2)').text()).toBe('element 9');
      });
      it('basic sort with class selector', function() {
        s = Sortable({
          els: '.col'
        });
        $('.col:eq(0)').simulateDragDrop({
          dropTarget: '.col:eq(2)'
        });
        expect($('.col:eq(0)').text()).toBe('element 7');
        expect($('.col:eq(2)').text()).toBe('element 9');
      });
      it('multiple el sort', function() {
        s = Sortable({
          els: els
        });
        $('.col:eq(0)').simulateDragDrop({
          dropTarget: '.col:eq(2)'
        });
        $('.col:eq(0)').simulateDragDrop({
          dropTarget: '.col:eq(1)'
        });
        $('.col:eq(1)').simulateDragDrop({
          dropTarget: '.col:eq(9)'
        });
        expect($('.col:eq(2)').text()).toBe('element 9');
        expect($('.col:eq(1)').text()).toBe('element 0');
        expect($('.col:eq(0)').text()).toBe('element 8');
        expect($('.col:eq(9)').text()).toBe('element 7');
      });
    });
    describe('destroy', function() {
      it('doesn\'t sort on destroy', function() {
        s = Sortable({
          els: '.col'
        });
        s.destroy();
        $('.col:eq(0)').simulateDragDrop({
          dropTarget: '.col:eq(2)'
        });
        expect($('.col:eq(0)').text()).toBe('element 9');
        expect($('.col:eq(2)').text()).toBe('element 7');
      });
      it('no draggable attribute', function() {
        s = Sortable({
          els: '.col'
        });
        s.destroy();
        var draggable = [].some.call($('.col'), function(el) {
          return $(el).is('[draggable]');
        });
        expect(draggable).toBe(false);
      });
    })
  });
})();
