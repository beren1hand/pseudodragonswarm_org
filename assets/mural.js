/* Pseudodragon Swarm — the hero mural, regenerated fresh on every page load.
 * Rules (the ones we settled on):
 *   - 180 cols x 9 rows: sky(3) / mountain ridge(1) / forest(4) / ground(1)
 *   - sky elements never touch (8-neighbour no-adjacency)
 *   - dragons kept clear of volcano columns, ALWAYS lots, and never fewer than 2
 *   - forest mostly empty; scattered stuff far apart; a few rare specials (one each)
 *   - new/ZWJ emoji are feature-detected and only shown where the browser renders them
 *   - dragons are the point; everything else is an easter egg
 */
(function () {
  var W = 180;
  var SKY = '🟦', GND = '🟩';
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(a) { return a[ri(0, a.length - 1)]; }
  function sample(arr, n) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = ri(0, i), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a.slice(0, Math.min(n, a.length));
  }

  /* ---- emoji support detection -------------------------------------------
   * Two failure modes to catch:
   *   1. tofu box  -> renders flat black (no colour) -> col≈0
   *   2. unsupported ZWJ sequence -> silently splits into 2 glyphs -> ~2x width
   * So: reject if it measures much wider than a known single emoji, else render
   * in black ink and require some coloured pixels. (Grey emoji read colourless,
   * so we only GATE the genuinely-new ones and trust the old/universal ones.) */
  var _cv, _x;
  function emojiSupported(ch) {
    if (!_cv) { _cv = document.createElement('canvas'); _cv.width = _cv.height = 24;
      _x = _cv.getContext('2d', { willReadFrequently: true }); }
    _x.font = '18px sans-serif';
    if (_x.measureText(ch).width > _x.measureText('🐉').width * 1.5) return false; // split ZWJ
    _x.clearRect(0, 0, 24, 24); _x.textBaseline = 'top'; _x.fillStyle = '#000'; _x.fillText(ch, 1, 1);
    var d = _x.getImageData(0, 0, 24, 24).data, ink = 0, col = 0;
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 48) continue; ink++;
      if (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 18) col++;
    }
    return ink > 14 && col > 2;
  }
  function buildPool(safe, newer) {
    var pool = safe.slice();
    newer.forEach(function (e) { if (emojiSupported(e)) pool.push(e); });
    return pool;
  }

  // ---- palettes (safe = Unicode <=14, universal; new = feature-detected) ----
  var MTN_SAFE = ['🗻', '🏔️', '⛰️'],            MTN_NEW = ['🛘'];
  var SKY_SAFE = ['🦅', '🦇', '💫', '🌩️', '🌧️', '⛈️', '🎈', '🕊️', '🪐'], SKY_NEW = ['🐦‍🔥']; // 🛸 is intentionally NOT here — it lives only in the last 12 columns
  var FOR_SAFE = ['👑', '🦄', '🦂', '🦖', '🦕', '🐍', '🦌', '🎄', '🎪', '🏰', '🗿', '🔮', '⚱️', '🏺', '🧚', '🧌'];
  var FOR_NEW  = ['🪎', '🫈', '🧚‍♂️', '🧚‍♀️'];
  var HOUSE    = ['🏡', '🏕️'];

  function generate() {
    var mtnPool = buildPool(MTN_SAFE, MTN_NEW);
    var skyPool = buildPool(SKY_SAFE, SKY_NEW);
    var forPool = buildPool(FOR_SAFE, FOR_NEW);

    var g = [];
    for (var r = 0; r < 9; r++) g.push(new Array(W));
    var decid = 0.45 + Math.random() * 0.35;
    for (var c = 0; c < W; c++) {
      g[0][c] = g[1][c] = g[2][c] = SKY;
      g[3][c] = pick(mtnPool);                                // ridge: fully random mountains
      for (var r2 = 4; r2 < 8; r2++) g[r2][c] = Math.random() < decid ? '🌳' : '🌲';
      g[8][c] = GND;
    }

    // volcanoes punctuate the ridge (and define dragon keep-out columns)
    var volc = [];
    placeGap(g, [3], ['🌋'], ri(3, 7), volc, 26);          // volcanoes — scattered, define dragon keep-out

    // forest: eggs always, a house or two, a few rare specials, then rocks + bare trees
    var fcols = [];
    var zones = [ri(15, 40), ri(55, 85), ri(105, 135), ri(145, 172)];
    ['💎', '🦉', '🍄', '🥚'].forEach(function (em, i) { g[ri(4, 7)][zones[i]] = em; fcols.push(zones[i]); });
    sample(forPool, ri(4, 8)).forEach(function (em) {
      var rLo = em === '🧌' ? 5 : 4;                          // keep the troll out of the top row (merges with mountains)
      for (var t = 0; t < 800; t++) {
        var c = ri(0, W - 1), r = ri(rLo, 7), ok = true;
        for (var k = 0; k < fcols.length; k++) if (Math.abs(c - fcols[k]) < 8) { ok = false; break; }
        if (ok) { g[r][c] = em; fcols.push(c); break; }
      }
    });
    placeGap(g, [4, 5, 6, 7], ['🪨'], ri(4, 12), fcols, 7);
    placeGap(g, [4, 5, 6, 7], ['🪾'], ri(2, 10), fcols, 7);
    // a dwelling at least every 6 columns (placed last, onto tree cells, so nothing else is clobbered)
    for (var hc = ri(1, 5); hc < W; hc += ri(4, 6)) placeHouse(g, hc);

    // sky: moon, then dragons (always lots, off the volcanoes), a few rare sky-things, clouds, sparkles
    placeSky(g, ['🌙'], 1, volc, false);
    placeSky(g, ['🐉'], ri(18, 30), volc, true);
    // dragons are the point — never a run of 5 columns without one
    var last = -1;
    for (var c2 = 0; c2 < W; c2++) {
      if (g[0][c2] === '🐉' || g[1][c2] === '🐉' || g[2][c2] === '🐉') last = c2;
      else if (c2 - last >= 5) { placeDragonInCol(g, c2, volc); last = c2; }
    }
    placeSky(g, skyPool, ri(8, 14), volc, true);            // eagle, bat, ufo... kept off the volcanoes
    ensureInSky(g, '🛸', W - 12, W - 1, volc);              // always a UFO somewhere in the last 12 columns
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
    return done;
  }

  function nearVolc(c, volc) {
    for (var k = 0; k < volc.length; k++) if (Math.abs(c - volc[k]) < 4) return true;
    return false;
  }
  // place a dragon in column c; relax constraints until one lands
  function placeDragonInCol(g, c, volc) {
    var passes = [[true, true], [true, false], [false, false]]; // [keep no-adjacency, avoid volcano]
    for (var p = 0; p < passes.length; p++)
      for (var r = 0; r < 3; r++) {
        if (g[r][c] !== SKY) continue;
        if (passes[p][0] && !clear8(g, r, c)) continue;
        if (passes[p][1] && nearVolc(c, volc)) continue;
        g[r][c] = '🐉'; return;
      }
    g[0][c] = '🐉'; // last resort: never leave a 5-col run dragonless
  }

  // ensure `em` appears in the sky within columns [lo,hi]; relax constraints until it lands
  function ensureInSky(g, em, lo, hi, volc) {
    for (var r = 0; r < 3; r++) for (var c = lo; c <= hi; c++) if (g[r][c] === em) return;
    var passes = [[true, true], [true, false], [false, false]];
    for (var p = 0; p < passes.length; p++)
      for (var t = 0; t < 120; t++) {
        var cc = ri(lo, hi), rr = ri(0, 2);
        if (g[rr][cc] !== SKY) continue;
        if (passes[p][0] && !clear8(g, rr, cc)) continue;
        if (passes[p][1] && nearVolc(cc, volc)) continue;
        g[rr][cc] = em; return;
      }
    g[0][hi] = em; // last resort
  }

  function placeHouse(g, c) {                 // drop a dwelling onto a tree cell in column c
    var rows = [4, 5, 6, 7];
    for (var i = 3; i > 0; i--) { var j = ri(0, i), tmp = rows[i]; rows[i] = rows[j]; rows[j] = tmp; }
    for (var k = 0; k < 4; k++)
      if (g[rows[k]][c] === '🌲' || g[rows[k]][c] === '🌳') { g[rows[k]][c] = pick(HOUSE); return; }
  }

  function apply() {
    var el = document.getElementById('mural');
    if (el) el.textContent = generate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
