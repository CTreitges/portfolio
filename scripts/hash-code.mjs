#!/usr/bin/env node
/**
 * Zugangscode-Werkzeug:
 *   node scripts/hash-code.mjs --gen [name]     → generiert langen Zufallscode + Hash
 *   node scripts/hash-code.mjs "<code>" [name]  → hasht einen vorgegebenen Code
 *
 * Output ist der fertige ACCESS_CODES-Eintrag (name:hash).
 * Codes sind base62 mit 192 bit Entropie — dank Magic-Link
 * (/unlock#code=…) muss sie niemand tippen oder sich merken.
 */
import { hash } from "@node-rs/argon2";
import { randomBytes } from "node:crypto";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateCode(bytes = 24) {
  const buf = randomBytes(bytes);
  let out = "";
  for (const b of buf) out += ALPHABET[b % ALPHABET.length];
  return out;
}

const [, , arg1, arg2] = process.argv;
if (!arg1) {
  console.error('Usage: hash-code.mjs --gen [name] | "<code>" [name]');
  process.exit(1);
}

const isGen = arg1 === "--gen";
const code = isGen ? generateCode() : arg1;
const name = (isGen ? arg2 : arg2) ?? "default";

// OWASP-solide Argon2id-Parameter: 64 MiB, t=3, p=4.
const h = await hash(code, {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
});

console.log(`Name      : ${name}`);
console.log(`Code      : ${code}`);
console.log(`Magic-Link: https://${process.env.SITE_URL ?? "<SERVER_IP>"}/unlock#code=${encodeURIComponent(code)}`);
console.log(`Eintrag   : ${name}:${h}`);
console.log(
  `\nIn ACCESS_CODES mehrere Einträge mit ';' trennen. Nach Änderung: systemctl restart portfolio`
);
