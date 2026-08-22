/*
 * AutoLog — maschera di inserimento dei campi numerici.
 *
 * Le cifre entrano da destra, come su un POS: con tre decimali "1" diventa
 * 0,001 e "1799" diventa 1,799. Serve a scrivere un prezzo o un importo su
 * tastiera numerica senza cercare la virgola, che su parecchie tastiere mobili
 * è nascosta sotto un tasto secondario.
 *
 * Il separatore arriva da fuori: qui non si sa in che lingua è l'interfaccia.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AutoLogMask = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* Oltre questa soglia i tasti in più vengono ignorati: nessun importo o
     volume reale ci arriva, e senza limite un tasto rimasto premuto porta il
     numero fuori dalla precisione di un double. */
  var MAX_DIGITS = 12;

  /*
   * decimals('1799', 3, ',') -> '1,799'
   * decimals('179', 3, ',')  -> '0,179'
   * decimals('', 3, ',')     -> ''
   *
   * Tutto ciò che non è una cifra viene scartato: così incollare "€ 1,799"
   * o cancellare con backspace passano dalla stessa strada.
   */
  function decimals(raw, dec, sep) {
    var d = dec > 0 ? Math.floor(dec) : 0;
    var digits = String(raw === null || raw === undefined ? '' : raw).replace(/\D/g, '');
    digits = digits.replace(/^0+(?=\d)/, '');
    if (!digits) return '';
    if (digits.length > MAX_DIGITS) digits = digits.slice(0, MAX_DIGITS);
    if (!d) return digits;
    while (digits.length <= d) digits = '0' + digits;
    return digits.slice(0, digits.length - d) + (sep || ',') + digits.slice(digits.length - d);
  }

  /* Numero già noto -> stringa nella stessa forma della maschera. */
  function format(n, dec, sep) {
    if (n === null || n === undefined || n === '') return '';
    var v = Number(n);
    if (!isFinite(v)) return '';
    return v.toFixed(dec > 0 ? Math.floor(dec) : 0).replace('.', sep || ',');
  }

  return {
    MAX_DIGITS: MAX_DIGITS,
    decimals: decimals,
    format: format
  };
});
