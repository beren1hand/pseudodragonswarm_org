/* Pseudodragon Swarm — the hero mural, regenerated fresh on every page load.
 * Rules (the ones we settled on):
 *   - 180 cols x 9 rows: sky(3) / mountain ridge(1) / forest(4) / ground(1)
 *   - sky elements never touch (8-neighbour no-adjacency)
 *   - dragons kept clear of volcano columns
 *   - forest mostly empty; scattered stuff kept far apart
 *   - a few RARE "specials" per map (one each max), only ones the browser can render
 *   - proportions vary each load... but ALWAYS lots of dragons
 */
(function () {
  var W = 180;
  var SKY = '🟦', MTN = '🗻', GND = '🟩';
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(a) { return a[ri(0, a.length - 1)]; }
  function sample(arr, n) {                              // n distinct, shuffled
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = ri(0, i), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a.slice(0, Math.min(n, a.length));
  }

  /* ---- emoji support detection ----------------------------------------
   * A colour emoji paints multi-coloured pixels; an unsupported glyph paints
   * a flat black "tofu" box (no colour). So: render to a canvas in black ink
   * and look for any coloured pixels. Reliable for colourful glyphs (which the
   * risky new emoji all are). Grey emoji (moai) read as colourless, so we only
   * use this to GATE the genuinely-new emoji and trust the old/universal ones. */
  var _cv, _ctx;
  function emojiSupported(ch) {
    if (!_cv) { _cv = document.createElement('canvas'); _cv.width = _cv.height = 20;
      _ctx = _cv.getContext('2d', { willReadFrequently: true }); }
    _ctx.clearRect(0, 0, 20, 20);
    _ctx.textBaseline = 'top'; _ctx.font = '16px sans-serif'; _ctx.fillStyle = '#000';
    _ctx.fillText(ch, 1, 1);
    var d = _ctx.getImageData(0, 0, 20, 20).data, ink = 0, col = 0;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 48) continue; ink++;
      if (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 18) col++;
    }
    return ink > 14 && col > 2;
  }

  // universal (Unicode <= 10) — safe on any modern browser, no gating needed
  var SPECIALS_SAFE = ['👑','🦄','🦅','🦂','🦖','🦕','🐍','🦌','🎄','🏕️','🏰','🗿','🔮','⚱️','🏺'];
  // genuinely new (Unicode 16/17) — only show where the browser actually renders them
  var SPECIALS_NEW = ['🪎','🫈'];
  function buildSpecials() {
    var pool = SPECIALS_SAFE.slice();
    SPECIALS_NEW.forEach(function (e) { if (emojiSupported(e)) pool.push(e); });
    return pool;
  }

  function generate(pool) {
    var g = [];
    for (var r = 0; r < 9; r++) g.push(new Array(W));
    var decid = 0.45 + Math.random() * 0.35;
    for (var c = 0; c < W; c++) {
      g[0][c] = g[1][c] = g[2][c] = SKY;
      g[3][c] = MTN;
      for (var r = 4; r < 8; r++) g[r][c] = Math.random() < decid ? '🌳' : '🌲';
      g[8][c] = GND;
    }

    var volc = [];
    placeGap(g, [3], ['🌋'], ri(3, 7), volc, 26);

    // forest: eggs always, then sparse far-apart stuff, then a few rare specials
    var fcols = [];
    var zones = [ri(15, 40), ri(55, 85), ri(105, 135), ri(145, 172)];
    ['💎', '🦉', '🍄', '🥚'].forEach(function (em, i) { g[ri(4, 7)][zones[i]] = em; fcols.push(zones[i]); });
    placeGap(g, [4, 5, 6, 7], ['🏡', '🏠'], ri(1, 4), fcols, 28);
    // a few rare specials — one of each, far apart (placed early so they always fit)
    sample(pool, ri(2, 5)).forEach(function (em) {
      for (var t = 0; t < 800; t++) {
        var c = ri(0, W - 1), r = ri(4, 7), ok = true;
        for (var k = 0; k < fcols.length; k++) if (Math.abs(c - fcols[k]) < 8) { ok = false; break; }
        if (ok) { g[r][c] = em; fcols.push(c); break; }
      }
    });
    placeGap(g, [4, 5, 6, 7], ['🪨'], ri(4, 12), fcols, 7);
    placeGap(g, [4, 5, 6, 7], ['🪾'], ri(2, 10), fcols, 7);

    // sky: no-adjacency; dragons first and always plentiful, kept off the volcanoes
    placeSky(g, ['🌙'], 1, volc, false);
    placeSky(g, ['🐉'], ri(18, 30), volc, true);
    placeSky(g, ['☁️'], ri(8, 26), volc, false);
    placeSky(g, ['✨'], ri(22, 70), volc, false);

    return g.map(function (row) { return row.join(''); }).join('\n');
  }

  function placeGap(g, rows, ems, count, occ, gap) {
    var done = 0, t = 0;
    while (done < count && t < count * 400) {
      t++;
      var c = ri(0, W - 1), r = pick(rows), ok = true;
      for (var k = 0; k < occ.length; k++) if (Math.abs(c - occ[k]) < gap) { ok = false; break; }
      if (!ok) continue;
      g[r][c] = pick(ems); occ.push(c); done++;
    }
  }

  function clear8(g, r, c) {
    for (var dr = -1; dr <= 1; dr++)
      for (var dc = -1; dc <= 1; dc++) {
        var rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < 3 && cc >= 0 && cc < W && g[rr][cc] !== SKY) return false;
      }
    return true;
  }

  function placeSky(g, ems, count, volc, avoidVolc) {
    var done = 0, t = 0;
    while (done < count && t < count * 1500) {
      t++;
      var r = ri(0, 2), c = ri(0, W - 1);
      if (g[r][c] !== SKY || !clear8(g, r, c)) continue;
      if (avoidVolc) {
        var ok = true;
        for (var k = 0; k < volc.length; k++) if (Math.abs(c - volc[k]) < 4) { ok = false; break; }
        if (!ok) continue;
      }
      g[r][c] = pick(ems); done++;
    }
  }

  function apply() {
    var el = document.getElementById('mural');
    if (el) el.textContent = generate(buildSpecials());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
