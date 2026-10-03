(function () {
  'use strict';

  // ---- Toast ----
  var toast = document.getElementById('toast');
  var toastTimer;
  function korsat(matn) {
    if (!toast) return;
    toast.textContent = matn;
    toast.classList.add('korin');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('korin'); }, 1800);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-toast]');
    if (!el) return;
    e.preventDefault();
    korsat(el.getAttribute('data-toast'));
  });

  // ---- Drawer ----
  document.querySelectorAll('[data-drawer-ochish]').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.add('drawer-ochiq'); });
  });
  document.querySelectorAll('[data-drawer-yopish]').forEach(function (b) {
    b.addEventListener('click', function () { document.body.classList.remove('drawer-ochiq'); });
  });

  function raqam(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  // ---- Bosh sahifa: rejimlar (keshbek / hamkor / karta) ----
  var rejimData = document.getElementById('rejimlar-data');
  if (rejimData) {
    var rejimlar = JSON.parse(rejimData.textContent);
    var sarlavha = document.getElementById('jamiSarlavha');
    var summa = document.getElementById('jamiSumma');
    var statlar = document.getElementById('statlar');
    var tugmalar = document.querySelectorAll('.rejim');

    tugmalar.forEach(function (t) {
      t.addEventListener('click', function () {
        if (t.classList.contains('faol')) return;
        tugmalar.forEach(function (x) { x.classList.remove('faol'); });
        t.classList.add('faol');
        var r = rejimlar[+t.dataset.rejim];

        summa.style.opacity = 0;
        statlar.style.opacity = 0;
        setTimeout(function () {
          sarlavha.firstChild.nodeValue = r.sarlavha + ' ';
          summa.textContent = raqam(r.jami);
          var kartalar = statlar.querySelectorAll('.stat');
          r.kartalar.forEach(function (k, i) {
            var c = kartalar[i];
            if (!c) return;
            c.querySelector('.stat-nom').textContent = k.nom;
            var q = c.querySelector('.stat-qiymat');
            q.textContent = raqam(k.qiymat);
            q.className = 'stat-qiymat rang-' + k.rang;
          });
          statlar.scrollLeft = 0;
          summa.style.opacity = 1;
          statlar.style.opacity = 1;
        }, 160);
      });
    });
  }

  // ---- Xizmatlar sahifasi: chiplar + qidiruv ----
  var chiplar = document.getElementById('chiplar');
  if (chiplar) {
    var input = document.getElementById('qidiruv');
    var bolimlar = document.querySelectorAll('.bolim');
    var boshNatija = document.getElementById('boshNatija');
    var tab = (chiplar.querySelector('.chip.faol') || {}).dataset.tab || 'hammasi';

    function yangila() {
      var q = input.value.trim().toLowerCase();
      var jami = 0;
      bolimlar.forEach(function (b) {
        var tabMos = tab === 'hammasi' || b.dataset.bolim === tab;
        var soni = 0;
        b.querySelectorAll('.plitka').forEach(function (p) {
          var mos = !q || p.dataset.nom.indexOf(q) !== -1;
          p.hidden = !mos;
          if (mos) soni++;
        });
        b.hidden = !tabMos || soni === 0;
        if (!b.hidden) jami += soni;
      });
      boshNatija.hidden = jami > 0;
    }

    function faolChipKorinsin(chip, silliq) {
      var chap = chip.offsetLeft - 20;
      chiplar.scrollTo({ left: chap, behavior: silliq ? 'smooth' : 'auto' });
    }

    chiplar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      chiplar.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('faol'); });
      chip.classList.add('faol');
      tab = chip.dataset.tab;
      var url = new URL(location.href);
      if (tab === 'hammasi') url.searchParams.delete('tab'); else url.searchParams.set('tab', tab);
      url.searchParams.delete('qidir');
      history.replaceState(null, '', url);
      faolChipKorinsin(chip, true);
      yangila();
    });
    input.addEventListener('input', yangila);

    // Statik (serversiz) versiyada ?tab= va ?qidir=1 ni brauzerning o'zi qo'llaydi
    var params = new URLSearchParams(location.search);
    var urlTab = params.get('tab');
    var urlChip = urlTab && chiplar.querySelector('.chip[data-tab="' + urlTab + '"]');
    if (urlChip && !urlChip.classList.contains('faol')) {
      chiplar.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('faol', c === urlChip); });
      tab = urlTab;
      yangila();
    }
    if (params.get('qidir') === '1') input.focus();

    // Ilovadagidek: "Soliqlarim" ochilganda chip ikkinchi o'rinda ko'rinadi
    var faol = chiplar.querySelector('.chip.faol');
    if (faol && faol.previousElementSibling) faolChipKorinsin(faol.previousElementSibling, false);
  }
})();
