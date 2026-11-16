/**
 * CONTENT INTEGRITY CHECKER — `npm run check-content`
 * -----------------------------------------------------------------------------
 * Validates everything inside `content/` before a build or a deploy:
 *   1. required files + JSON schema shapes
 *   2. bilingual completeness (ar/en key parity)
 *   3. every referenced media file exists
 *   4. media files stay under 1 MB
 *   5. no accidental personal data (phone numbers / addresses / schools)
 *
 * Diagnostics are printed in Arabic, with file paths and actionable hints.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");

const errors: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];

const ok = (message: string) => console.log(`  \u2713 ${message}`);
const fail = (message: string) => {
  errors.push(message);
  console.log(`  \u2717 ${message}`);
};
const warn = (message: string) => {
  warnings.push(message);
  console.log(`  \u26A0 ${message}`);
};
const note = (message: string) => {
  notes.push(message);
  console.log(`  \u2022 ${message}`);
};

const rel = (absolute: string) => path.relative(ROOT, absolute).replaceAll("\\", "/");

function absolute(relativePath: string) {
  return path.join(CONTENT, relativePath.replace(/^\/+/, ""));
}

function exists(relativePath: string) {
  return fs.existsSync(absolute(relativePath));
}

function readJson<T = unknown>(relativePath: string): T | null {
  const file = absolute(relativePath);
  if (!fs.existsSync(file)) {
    fail(`ملف مفقود: content/${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch (error) {
    fail(`JSON غير صالح في content/${relativePath} — ${(error as Error).message}`);
    return null;
  }
}

function walk(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/* --------------------------------------------------------------- schema ---- */

type Localized = { ar?: unknown; en?: unknown };

function checkLocalized(value: unknown, label: string) {
  if (!value || typeof value !== "object") {
    fail(`${label}: يجب أن يكون كائنًا يحتوي على ar و en.`);
    return;
  }
  const localized = value as Localized;
  for (const language of ["ar", "en"] as const) {
    const text = localized[language];
    if (typeof text !== "string" || text.trim().length === 0) {
      fail(`${label}: القيمة "${language}" مفقودة أو فارغة.`);
    }
  }
}

const STATUSES = new Set(["available", "coming_soon", "beta", "in_development"]);

/* ------------------------------------------------------------------ main --- */

console.log("\n\u2500\u2500 فحص محتوى استوديو 5A1F \u2500\u2500\n");

console.log("[1/5] الملفات الأساسية والبنية");
const site = readJson<{
  studioName?: string;
  whatsappNumber?: string;
  logo?: string;
  defaultLanguage?: string;
  features?: { competitions?: boolean };
  joinForm?: { ageMode?: string; roles?: Array<{ id?: string; label?: Localized }> };
}>("site.json");

if (site) {
  if (!site.studioName) fail("site.json: studioName مطلوب.");
  if (!/^\d{8,15}$/.test(site.whatsappNumber ?? "")) {
    fail("site.json: whatsappNumber يجب أن يكون أرقامًا فقط (8–15 رقمًا) بدون + أو مسافات.");
  }
  if (!site.logo) fail("site.json: logo مطلوب.");
  if (site.defaultLanguage !== "ar" && site.defaultLanguage !== "en") {
    fail('site.json: defaultLanguage يجب أن تكون "ar" أو "en".');
  }
  if (typeof site.features?.competitions !== "boolean") {
    fail("site.json: features.competitions يجب أن تكون boolean.");
  }
  if (site.joinForm?.ageMode !== "exact" && site.joinForm?.ageMode !== "range") {
    fail('site.json: joinForm.ageMode يجب أن تكون "exact" أو "range".');
  }
  if (!Array.isArray(site.joinForm?.roles) || site.joinForm.roles.length === 0) {
    fail("site.json: joinForm.roles يجب أن تحتوي على تخصص واحد على الأقل.");
  } else {
    site.joinForm.roles.forEach((role, index) => {
      if (!role?.id) fail(`site.json: joinForm.roles[${index}].id مطلوب.`);
      checkLocalized(role?.label, `site.json: joinForm.roles[${index}].label`);
    });
  }
}

const translations = {
  ar: readJson<Record<string, unknown>>("translations/ar.json"),
  en: readJson<Record<string, unknown>>("translations/en.json"),
};

const team = readJson<Array<Record<string, unknown>>>("team/members.json");
const games = readJson<Array<Record<string, unknown>>>("games/games.json");
const software = readJson<Array<Record<string, unknown>>>("software/software.json");
const studioSocial = readJson<Array<Record<string, unknown>>>("social/studio.json");

const imageRefs: Array<{ ref: string; required: boolean; owner: string }> = [];
const addImage = (ref: unknown, required: boolean, owner: string) => {
  if (typeof ref === "string" && ref.trim().length > 0) {
    imageRefs.push({ ref: ref.trim(), required, owner });
  }
};

if (site?.logo) addImage(site.logo, true, "site.json: logo");

if (team) {
  if (team.length === 0) warn("members.json: لا يوجد أي عضو في الفريق.");
  team.forEach((member, index) => {
    const id = String(member.id ?? `#${index}`);
    if (!member.id) fail(`members.json[${index}]: id مطلوب.`);
    checkLocalized(member.name, `members.json[${id}].name`);
    checkLocalized(member.role, `members.json[${id}].role`);
    checkLocalized(member.bio, `members.json[${id}].bio`);
    checkLocalized(member.avatarAlt, `members.json[${id}].avatarAlt`);
    if (!Array.isArray(member.skills) || member.skills.length === 0) {
      fail(`members.json[${id}]: skills يجب أن تكون مصفوفة غير فارغة.`);
    }
    addImage(member.avatar, true, `members.json[${id}].avatar`);

    const social = member.social;
    if (!Array.isArray(social)) {
      fail(`members.json[${id}]: social يجب أن تكون مصفوفة.`);
      return;
    }
    social.forEach((link, linkIndex) => {
      const item = link as Record<string, unknown>;
      checkLocalized(item.label, `members.json[${id}].social[${linkIndex}].label`);
      addImage(item.icon, true, `members.json[${id}].social[${linkIndex}].icon`);
      if (typeof item.href !== "string" || !/^(https?:\/\/|mailto:)/.test(item.href)) {
        fail(`members.json[${id}].social[${linkIndex}].href رابط غير صالح.`);
      }
    });
  });
}

function checkProjects(
  list: Array<Record<string, unknown>> | null,
  file: string,
  localizedFields: string[],
) {
  if (!list) return;
  list.forEach((item, index) => {
    const id = String(item.id ?? `#${index}`);
    if (!item.id) fail(`${file}[${index}]: id مطلوب.`);
    for (const field of localizedFields) {
      checkLocalized(item[field], `${file}[${id}].${field}`);
    }
    if (!STATUSES.has(String(item.status))) {
      fail(`${file}[${id}].status قيمة غير مسموحة: ${String(item.status)}`);
    }
    addImage(item.cover, false, `${file}[${id}].cover`);
    if (Array.isArray(item.screenshots)) {
      item.screenshots.forEach((shot, shotIndex) =>
        addImage(shot, false, `${file}[${id}].screenshots[${shotIndex}]`),
      );
    }
    if (Array.isArray(item.links)) {
      item.links.forEach((link, linkIndex) => {
        const entry = link as Record<string, unknown>;
        checkLocalized(entry.label, `${file}[${id}].links[${linkIndex}].label`);
        if (typeof entry.href !== "string" || entry.href.length === 0) {
          warn(`${file}[${id}].links[${linkIndex}]: href فارغ — سيُخفى الرابط في الواجهة.`);
        }
      });
    } else {
      fail(`${file}[${id}].links يجب أن تكون مصفوفة.`);
    }
  });
}

checkProjects(games, "games.json", ["title", "tagline", "description"]);
checkProjects(software, "software.json", ["tagline", "description"]);

if (studioSocial) {
  if (studioSocial.length === 0) warn("studio.json: لا توجد قنوات للاستوديو.");
  studioSocial.forEach((link, index) => {
    const item = link as Record<string, unknown>;
    checkLocalized(item.label, `studio.json[${index}].label`);
    addImage(item.icon, true, `studio.json[${index}].icon`);
    if (typeof item.href !== "string") {
      fail(`studio.json[${index}].href مطلوب (يمكن أن يكون فارغًا مؤقتًا).`);
    } else if (item.href.length === 0) {
      warn(`studio.json[${index}]: href فارغ — سيُخفى الرابط حتى يتوفر.`);
    }
  });
}

/* ----------------------------------------------------- translation parity --- */

console.log("\n[2/5] اكتمال الترجمة (ar / en)");

function flatten(tree: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flatten(value as Record<string, unknown>, next);
    }
    return [next];
  });
}

if (translations.ar && translations.en) {
  const arKeys = new Set(flatten(translations.ar));
  const enKeys = new Set(flatten(translations.en));
  const missingInAr = [...enKeys].filter((key) => !arKeys.has(key));
  const missingInEn = [...arKeys].filter((key) => !enKeys.has(key));

  if (missingInAr.length === 0 && missingInEn.length === 0) {
    ok(`مفاتيح الترجمة متطابقة (${arKeys.size} مفتاحًا).`);
  } else {
    missingInAr.forEach((key) => fail(`ترجمة عربية ناقصة: ${key}`));
    missingInEn.forEach((key) => fail(`ترجمة إنجليزية ناقصة: ${key}`));
  }
}

/* --------------------------------------------------------------- media ----- */

console.log("\n[3/5] الملفات البصرية والروابط");

const seen = new Set<string>();
let missingPending = 0;

for (const { ref, required, owner } of imageRefs) {
  if (seen.has(ref)) continue;
  seen.add(ref);

  if (exists(ref)) continue;

  const isPendingAsset =
    ref === site?.logo || ref.startsWith("media/team/") || ref.startsWith("media/games/");

  if (isPendingAsset) {
    missingPending += 1;
    note(`بانتظار إضافة الملف: content/${ref} (${owner})`);
  } else if (required) {
    fail(`صورة مطلوبة غير موجودة: content/${ref} (${owner})`);
  } else {
    warn(`صورة اختيارية غير موجودة: content/${ref} (${owner})`);
  }
}

if (missingPending > 0) {
  note(`${missingPending} ملف/ملفات بانتظار إضافتها يدويًا — الواجهة تعرض بديلًا مؤقتًا.`);
}

/* ---------------------------------------------------------- file weights --- */

console.log("\n[4/5] أحجام الملفات (الحد 1MB)");

const mediaFiles = walk(path.join(CONTENT, "media"));
const blogFiles = walk(path.join(CONTENT, "blog"));
const allAssets = [...mediaFiles, ...blogFiles].filter((file) =>
  /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file),
);

let oversize = 0;
for (const file of allAssets) {
  const size = fs.statSync(file).size;
  if (size > 1024 * 1024) {
    oversize += 1;
    warn(`${rel(file)} حجمه ${(size / 1024 / 1024).toFixed(2)}MB — يجب ضغطه تحت 1MB.`);
  }
}
if (oversize === 0) ok(`${allAssets.length} ملفًا بصريًا، كلها تحت 1MB.`);

/* --------------------------------------------------------------- privacy --- */

console.log("\n[5/5] فحص الخصوصية");

const allowedNumber = (site?.whatsappNumber ?? "").replace(/\D/g, "");
const phonePattern = /\+?\d[\d\s\-()]{7,}\d/g;
const privateTerms: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /مدرسة|ثانوية|إعدادية/g, label: "اسم مدرسة" },
  { pattern: /\b(school|high school|college|lyc[ée]e)\b/gi, label: "school name" },
  { pattern: /\b(home address|street address|postal code)\b/gi, label: "home address" },
  { pattern: /العنوان السكني|شارع|رقم المنزل/g, label: "عنوان سكني" },
];

const textFiles = walk(CONTENT).filter(
  (file) =>
    /\.(json|md)$/i.test(file) &&
    !file.replaceAll("\\", "/").includes("/translations/"),
);

let leaks = 0;

for (const file of textFiles) {
  const source = fs.readFileSync(file, "utf8");
  const relative = rel(file);
  const isDocumentation = /README\.md$/i.test(file);

  for (const match of source.matchAll(phonePattern)) {
    const raw = match[0];
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) continue;

    const before = source.slice(Math.max(0, (match.index ?? 0) - 80), match.index ?? 0);
    const insideDiscordId = /discord\.com\/users\/\d*$/.test(before);
    const insideWhatsApp = /wa\.me\/$/.test(before);

    if (insideDiscordId) continue;
    if (insideWhatsApp && digits === allowedNumber) continue;
    if (digits === allowedNumber) continue;

    leaks += 1;
    fail(`${relative}: رقم يشبه الهاتف (${raw.trim()}) — لا تُدرج أرقامًا شخصية.`);
  }

  if (!isDocumentation) {
    for (const { pattern, label } of privateTerms) {
      pattern.lastIndex = 0;
      const hit = pattern.exec(source);
      if (hit) {
        leaks += 1;
        fail(`${relative}: كلمة قد تكشف ${label} ("${hit[0]}").`);
      }
    }
  }
}

if (leaks === 0) {
  ok("لا توجد أرقام شخصية أو عناوين أو أسماء مدارس داخل المحتوى.");
}

/* ----------------------------------------------------------------- result -- */

const placeholderCount = textFiles.reduce((total, file) => {
  const source = fs.readFileSync(file, "utf8");
  return total + (source.match(/PLACEHOLDER/g)?.length ?? 0);
}, 0);

if (placeholderCount > 0) {
  warn(`${placeholderCount} قيمة PLACEHOLDER مؤقتة — استبدلها قبل الإطلاق.`);
}

console.log("\n\u2500\u2500 النتيجة \u2500\u2500");
console.log(`  أخطاء: ${errors.length} · تحذيرات: ${warnings.length} · ملاحظات: ${notes.length}`);

if (errors.length > 0) {
  console.log("\n\u2717 فشل الفحص. أصلح الأخطاء أعلاه ثم أعد المحاولة.\n");
  process.exit(1);
}

console.log("\n\u2713 نجح الفحص. المحتوى جاهز للبناء.\n");
