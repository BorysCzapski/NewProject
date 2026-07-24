// ============================================================================
// lib/matma/matemaks-console-script.ts
// Browser DevTools console script the admin runs THEMSELVES while normally
// viewing a matemaks.pl temat page (matura rozszerzona z matematyki content).
// matemaks.pl actively blocks automated/datacenter requests (confirmed: 403 on
// every server-side fetch attempt, even a known-correct URL) — this script
// deliberately never touches their server itself; it only reads the DOM of a
// page the admin already legitimately loaded in their own browser, exactly
// like manually copying problems by hand, just faster. Extracts the same shape
// lib/matma/import-curated-matemaks.ts RawMatemaksProblem expects (matemaksId,
// nrZad, points, statementText, answerText, imageUrl), restricted to .blok_strony
// sections labeled "Poziom rozszerzony", and copies the resulting JSON to the
// clipboard for pasting into the admin import form. Plain data (no "server-only"
// marker) so it can be imported and displayed by a "use client" admin component.
// Generated + round-trip-verified against a standalone .js file — see the
// session history if this ever needs regenerating by the same method.
// ============================================================================

export const MATEMAKS_CONSOLE_SCRIPT = `(function () {
  var BS = String.fromCharCode(92);
  function convertMath(text) {
    return text
      .split(BS + '[').join('$$')
      .split(BS + ']').join('$$')
      .split(BS + '(').join('$')
      .split(BS + ')').join('$');
  }

  function extractStatement(zTrescEl) {
    var clone = zTrescEl.cloneNode(true);
    var imageUrl = null;
    var firstImg = clone.querySelector('img');
    if (firstImg) {
      imageUrl = new URL(firstImg.getAttribute('src'), location.href).toString();
    }
    var imgs = clone.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) imgs[i].remove();

    var podzadania = clone.querySelectorAll('.podzadanie');
    for (var j = 0; j < podzadania.length; j++) {
      var letter = String.fromCharCode(97 + j);
      var pkt = podzadania[j].getAttribute('data-pkt');
      var prefix = '\\n' + letter + ') ' + (pkt ? '(' + pkt + ' pkt) ' : '');
      podzadania[j].insertAdjacentText('beforebegin', prefix);
    }

    var text = convertMath(clone.textContent || '');
    text = text.replace(/[ \\t]+/g, ' ').trim();
    return { text: text, imageUrl: imageUrl };
  }

  var titleEl = document.querySelector('h1.tytuldzialu');
  var title = titleEl ? titleEl.textContent.trim() : '';

  var problems = [];
  var bloki = document.querySelectorAll('.blok_strony');
  for (var b = 0; b < bloki.length; b++) {
    var infoEl = bloki[b].querySelector('.poziom_blok_info');
    var label = infoEl ? infoEl.textContent.toLowerCase() : '';
    if (label.indexOf('rozszerz') === -1) continue;

    var zadania = bloki[b].querySelectorAll('.zadanie');
    for (var z = 0; z < zadania.length; z++) {
      var zad = zadania[z];
      var matemaksId = zad.getAttribute('data-id') || zad.getAttribute('id') || '';
      var nrZad = parseInt(zad.getAttribute('data-nr_zad'), 10) || (problems.length + 1);
      var pktAttr = zad.getAttribute('pkt');
      var points = pktAttr ? parseInt(pktAttr, 10) : null;

      var tresc = zad.querySelector('.z_tresc');
      if (!tresc) continue;
      var extracted = extractStatement(tresc);
      if (!extracted.text) continue;

      var answerEl = zad.querySelector('.p_o');
      var answerText = answerEl ? convertMath(answerEl.textContent || '').trim() : '';

      problems.push({
        matemaksId: matemaksId,
        nrZad: nrZad,
        points: points && points > 0 ? points : null,
        statementText: extracted.text,
        answerText: answerText || null,
        imageUrl: extracted.imageUrl
      });
    }
  }

  var result = { title: title, url: location.href, problems: problems };
  var json = JSON.stringify(result, null, 2);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(json).then(function () {
      console.log('Skopiowano do schowka: ' + problems.length + ' zadan (poziom rozszerzony). Wklej w panelu admina Matmy.');
    }, function () {
      console.log(json);
    });
  } else {
    console.log(json);
  }
})();
`;
