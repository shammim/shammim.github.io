/* LMS connection: SCORM 2004 (4th ed.) and SCORM 1.2.
   Finds the LMS API in parent or opener windows. With no LMS (a website, a preview), progress is kept in
   the browser instead, so the lesson works the same way. */
(function () {
  'use strict';
  function find(win, name) {
    var tries = 0;
    while (win && tries < 12) {
      try { if (win[name]) return win[name]; } catch (e) { return null; }
      if (win.parent && win.parent !== win) win = win.parent; else break;
      tries++;
    }
    return null;
  }
  function locate(name) {
    var api = find(window, name);
    if (!api && window.opener) api = find(window.opener, name);
    return api;
  }
  var api2004 = locate('API_1484_11');
  var api12 = api2004 ? null : locate('API');
  var mode = api2004 ? '2004' : (api12 ? '1.2' : 'none');
  var started = Date.now(), live = false, nInt = 0;
  var KEY = 'ecl-trainee-onboarding:progress';

  function call(fn, a, b) {
    try {
      if (mode === '2004') return api2004[fn](a === undefined ? '' : a, b);
      if (mode === '1.2') return api12[fn](a === undefined ? '' : a, b);
    } catch (e) { /* keep the lesson running if the LMS errors */ }
    return '';
  }
  function get(k12, k04) { return mode === '2004' ? call('GetValue', k04) : mode === '1.2' ? call('LMSGetValue', k12) : ''; }
  function set(k12, k04, v) {
    if (mode === '2004') call('SetValue', k04, String(v));
    else if (mode === '1.2' && k12) call('LMSSetValue', k12, String(v));
  }
  function commit() { if (mode === '2004') call('Commit'); else if (mode === '1.2') call('LMSCommit'); }
  function duration() {
    var s = Math.round((Date.now() - started) / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    if (mode === '2004') return 'PT' + h + 'H' + m + 'M' + sec + 'S';
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return p(h) + ':' + p(m) + ':' + p(sec);
  }

  window.LMS = {
    mode: mode,
    start: function () {
      if (mode === '2004') live = call('Initialize') === 'true';
      else if (mode === '1.2') live = call('LMSInitialize') === 'true';
      if (live) {
        var st = mode === '2004' ? get('', 'cmi.completion_status') : get('cmi.core.lesson_status', '');
        if (!st || st === 'not attempted' || st === 'unknown') {
          set('cmi.core.lesson_status', 'cmi.completion_status', 'incomplete');
        }
        if (mode === '2004') set('', 'cmi.exit', 'suspend'); else set('cmi.core.exit', '', 'suspend');
        commit();
      }
      return live;
    },
    load: function () {
      var raw = live ? get('cmi.suspend_data', 'cmi.suspend_data') : '';
      if (!raw) { try { raw = localStorage.getItem(KEY) || ''; } catch (e) { raw = ''; } }
      try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    },
    save: function (state, location) {
      var raw = JSON.stringify(state);
      try { localStorage.setItem(KEY, raw); } catch (e) {}
      if (!live) return;
      set('cmi.suspend_data', 'cmi.suspend_data', raw);
      if (location) set('cmi.core.lesson_location', 'cmi.location', location);
      commit();
    },
    interaction: function (id, type, response, correct) {
      if (!live) return;
      var n = nInt++;
      if (mode === '2004') {
        var p = 'cmi.interactions.' + n + '.';
        set('', p + 'id', id); set('', p + 'type', type); set('', p + 'learner_response', response);
        set('', p + 'result', correct ? 'correct' : 'incorrect'); set('', p + 'timestamp', new Date().toISOString().slice(0, 19));
      } else {
        var q = 'cmi.interactions.' + n + '.';
        set(q + 'id', '', id); set(q + 'type', '', type); set(q + 'student_response', '', response);
        set(q + 'result', '', correct ? 'correct' : 'wrong');
      }
      commit();
    },
    result: function (scorePct, passMark) {
      if (!live) return;
      var passed = scorePct >= passMark;
      if (mode === '2004') {
        set('', 'cmi.score.raw', scorePct); set('', 'cmi.score.min', 0); set('', 'cmi.score.max', 100);
        set('', 'cmi.score.scaled', (scorePct / 100).toFixed(2));
        set('', 'cmi.success_status', passed ? 'passed' : 'failed');
        set('', 'cmi.completion_status', 'completed');
      } else {
        set('cmi.core.score.raw', '', scorePct); set('cmi.core.score.min', '', 0); set('cmi.core.score.max', '', 100);
        set('cmi.core.lesson_status', '', passed ? 'passed' : 'failed');
      }
      commit();
    },
    finish: function () {
      if (!live) return;
      if (mode === '2004') { set('', 'cmi.session_time', duration()); commit(); call('Terminate'); }
      else { set('cmi.core.session_time', '', duration()); commit(); call('LMSFinish'); }
      live = false;
    }
  };
  window.addEventListener('pagehide', function () { window.LMS.finish(); });
  window.addEventListener('beforeunload', function () { window.LMS.finish(); });
})();
