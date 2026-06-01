/* Pseudodragon Swarm — the hero mural, regenerated fresh on every page load.
 * Rules (the ones we settled on):
 *   - 180 cols x 9 rows: sky(3) / mountain ridge(1) / forest(4) / ground(1)
 *   - sky elements never touch (8-neighbour no-adjacency)
 *   - dragons kept clear of volcano columns
 *   - forest mostly empty; scattered stuff kept far apart
 *   - proportions vary each load... but ALWAYS lots of dragons
 */
(function () {
  var W = 180;
  var SKY = '🟦', MTN = '🗻', GND = '🟩';
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(a) { return a[ri(0, a.length - 1)]; }

  function generate() {
    var g = [];
    for (var r = 0; r < 9; r++) g.push(new Array(W));
    var decid = 0.45 + Math.random() * 0.35;            // deciduous-vs-evergreen mix varies
    for (var c = 0; c < W; c++) {
      g[0][c] = g[1][c] = g[2][c] = SKY;
      g[3][c] = MTN;
      for (var r = 4; r < 8; r++) g[r][c] = Math.random() < decid ? '🌳' : '🌲';
      g[8][c] = GND;
    }

    // mountain ridge: a few volcanoes, far apart
    var volc = [];
    placeGap(g, [3], ['🌋'], ri(3, 7), volc, 26);

    // forest: eggs always (in 4 spread zones, jittered), then sparse far-apart stuff
    var fcols = [];
    var zones = [ri(15, 40), ri(55, 85), ri(105, 135), ri(145, 172)];
    ['💎', '🦉', '🍄', '🥚'].forEach(function (em, i) {
      g[ri(4, 7)][zones[i]] = em; fcols.push(zones[i]);
    });
    placeGap(g, [4, 5, 6, 7], ['🏡', '🏠'], ri(1, 4), fcols, 28);   // rare houses
    placeGap(g, [4, 5, 6, 7], ['🪨'], ri(4, 12), fcols, 7);         // rocks (more or less)
    placeGap(g, [4, 5, 6, 7], ['🪾'], ri(2, 10), fcols, 7);         // leafless (more or less)

    // sky: no-adjacency; dragons first and always plentiful, kept off the volcanoes
    placeSky(g, ['🌙'], 1, volc, false);
    placeSky(g, ['🐉'], ri(18, 30), volc, true);                    // ALWAYS lots of dragons
    placeSky(g, ['☁️'], ri(8, 26), volc, false);                   // more or less clouds
    placeSky(g, ['✨'], ri(22, 70), volc, false);                  // more or less sparkles

    return g.map(function (row) { return row.join(''); }).join('\n');
  }

  // scatter into rows, keeping every feature >= gap columns from prior ones
  function placeGap(g, rows, ems, count, occ, gap) {
    var done = 0, t = 0;
    while (done < count && t < count * 400) {
      t++;
      var c = ri(0, W - 1), r = pick(rows);
      var ok = true;
      for (var k = 0; k < occ.length; k++) if (Math.abs(c - occ[k]) < gap) { ok = false; break; }
      if (!ok) continue;
      g[r][c] = pick(ems); occ.push(c); done++;
    }
  }

  function clear8(g, r, c) {                                        // no sky element in 8 neighbours
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
    if (el) el.textContent = generate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
