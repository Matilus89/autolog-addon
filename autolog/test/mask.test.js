'use strict';
var test = require('node:test');
var assert = require('node:assert');
var M = require('../public/mask.js');

test('le cifre entrano da destra', function () {
  assert.strictEqual(M.decimals('1', 3, ','), '0,001');
  assert.strictEqual(M.decimals('17', 3, ','), '0,017');
  assert.strictEqual(M.decimals('179', 3, ','), '0,179');
  assert.strictEqual(M.decimals('1799', 3, ','), '1,799');
  assert.strictEqual(M.decimals('12345', 3, ','), '12,345');
});

test('due decimali per gli importi', function () {
  assert.strictEqual(M.decimals('4', 2, ','), '0,04');
  assert.strictEqual(M.decimals('45', 2, ','), '0,45');
  assert.strictEqual(M.decimals('4550', 2, ','), '45,50');
});

test('il campo vuoto resta vuoto', function () {
  assert.strictEqual(M.decimals('', 3, ','), '');
  assert.strictEqual(M.decimals(null, 3, ','), '');
  assert.strictEqual(M.decimals(undefined, 3, ','), '');
  assert.strictEqual(M.decimals('abc', 3, ','), '');
});

test('conta solo le cifre: incollare un valore già formattato non lo altera', function () {
  assert.strictEqual(M.decimals('1,799', 3, ','), '1,799');
  assert.strictEqual(M.decimals('1.799', 3, '.'), '1.799');
  assert.strictEqual(M.decimals('€ 45,50', 2, ','), '45,50');
});

test('backspace fa scorrere le cifre a destra', function () {
  /* '1,799' meno l'ultimo carattere è quello che il campo passa alla maschera */
  assert.strictEqual(M.decimals('1,79', 3, ','), '0,179');
  assert.strictEqual(M.decimals('0,17', 3, ','), '0,017');
});

test('gli zeri iniziali non si accumulano', function () {
  assert.strictEqual(M.decimals('01799', 3, ','), '1,799');
  assert.strictEqual(M.decimals('000', 3, ','), '0,000');
  assert.strictEqual(M.decimals('0', 2, ','), '0,00');
});

test('il separatore è quello passato', function () {
  assert.strictEqual(M.decimals('1799', 3, '.'), '1.799');
  assert.strictEqual(M.decimals('1799', 3), '1,799');
});

test('senza decimali resta solo la parte intera', function () {
  assert.strictEqual(M.decimals('120000', 0, ','), '120000');
});

test('le cifre oltre il limite vengono ignorate', function () {
  var many = '9'.repeat(M.MAX_DIGITS + 5);
  var out = M.decimals(many, 2, ',');
  assert.strictEqual(out.replace(/\D/g, '').length, M.MAX_DIGITS);
});

test('format riporta un numero nella forma della maschera', function () {
  assert.strictEqual(M.format(2.279, 3, ','), '2,279');
  assert.strictEqual(M.format(59.008, 2, ','), '59,01');
  assert.strictEqual(M.format(45.5, 2, ','), '45,50');
  assert.strictEqual(M.format(0, 2, ','), '0,00');
  assert.strictEqual(M.format(1.5, 2, '.'), '1.50');
});

test('format ignora i valori non numerici', function () {
  assert.strictEqual(M.format(null, 2, ','), '');
  assert.strictEqual(M.format(undefined, 2, ','), '');
  assert.strictEqual(M.format('', 2, ','), '');
  assert.strictEqual(M.format(NaN, 2, ','), '');
  assert.strictEqual(M.format(Infinity, 2, ','), '');
});

test('quello che la maschera scrive è rileggibile come numero', function () {
  [[ '1799', 3, 1.799 ], [ '4550', 2, 45.5 ], [ '179', 3, 0.179 ]].forEach(function (c) {
    var s = M.decimals(c[0], c[1], ',');
    assert.strictEqual(Number(s.replace(',', '.')), c[2]);
  });
});
