// Ota-onam soliqlarini to'lash: otam/onam almashtirish, summa tanlash, kartani aktivlashtirish
(function () {
  'use strict';
  var segment = document.querySelector('.segment');
  if (!segment) return;
  var tolash = document.getElementById('tolashBtn');
  var toast = document.getElementById('toast');

  function faolPanel() { return document.querySelector('.shaxs-panel:not([hidden])'); }
  function tugmaHolati() {
    var p = faolPanel();
    tolash.disabled = !(p.querySelector('[data-karta]').classList.contains('aktiv') &&
                        p.querySelector('.tolov-qator.tanlangan'));
  }

  segment.addEventListener('click', function (e) {
    var el = e.target.closest('.segment-el');
    if (!el) return;
    segment.querySelectorAll('.segment-el').forEach(function (x) { x.classList.toggle('faol', x === el); });
    document.querySelectorAll('.shaxs-panel').forEach(function (p) { p.hidden = p.dataset.panel !== el.dataset.kim; });
    var url = new URL(location.href);
    url.searchParams.set('kim', el.dataset.kim);
    history.replaceState(null, '', url);
    tugmaHolati();
  });

  document.querySelectorAll('.shaxs-panel').forEach(function (panel) {
    panel.addEventListener('click', function (e) {
      var tanla = e.target.closest('[data-tanla]');
      var och = e.target.closest('[data-och]');
      if (tanla) {
        var qator = tanla.closest('[data-qator]');
        if (qator.classList.contains('bosh')) return;
        panel.querySelectorAll('[data-qator]').forEach(function (q) { q.classList.toggle('tanlangan', q === qator); });
        panel.querySelector('[data-summa]').textContent = qator.dataset.summaQiymat;
      } else if (och) {
        och.closest('[data-qator]').classList.toggle('ochiq');
      } else if (e.target.closest('[data-aktivlash]')) {
        // Karta ikkala panelda bitta — birga aktivlashadi
        document.querySelectorAll('[data-karta]').forEach(function (k) { k.classList.add('aktiv'); });
      }
      tugmaHolati();
    });
  });

  tolash.addEventListener('click', function () {
    toast.textContent = "To'lov so'rovi yuborildi: " + faolPanel().querySelector('[data-summa]').textContent + " so'm (demo)";
    toast.classList.add('korin');
    setTimeout(function () { toast.classList.remove('korin'); }, 2200);
  });
  // Statik versiyada ?kim=onam ni brauzer qo'llaydi
  var urlKim = new URLSearchParams(location.search).get('kim');
  var kimEl = urlKim && segment.querySelector('.segment-el[data-kim="' + urlKim + '"]');
  if (kimEl && !kimEl.classList.contains('faol')) kimEl.click();
  tugmaHolati();
})();
