import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/lib/contentLoader";
import { whatsappHref } from "@/lib/presentation";
import { cn } from "@/lib/utils";

type FieldKey =
  | "name"
  | "age"
  | "ageRange"
  | "role"
  | "skills"
  | "contribution"
  | "contactHandle";

type FormValues = Record<FieldKey, string>;
type FormErrors = Partial<Record<FieldKey, string>>;

const EMPTY_VALUES: FormValues = {
  name: "",
  age: "",
  ageRange: "",
  role: "",
  skills: "",
  contribution: "",
  contactHandle: "",
};

const FIELD_IDS: Record<FieldKey, string> = {
  name: "join-name",
  age: "join-age",
  ageRange: "join-age-range",
  role: "join-role",
  skills: "join-skills",
  contribution: "join-contribution",
  contactHandle: "join-contact",
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-[var(--color-fg-primary)]"
      >
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-[11px] font-semibold text-[var(--color-highlight-strong)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "min-h-11 w-full border bg-[var(--color-bg-primary)] px-3.5 py-2.5 text-[16px] text-[var(--color-fg-primary)] transition-colors placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-accent)]",
    hasError
      ? "border-[var(--color-highlight-strong)]"
      : "border-[var(--color-border-strong)]",
  );
}

export function JoinForm() {
  const { t, language } = useLanguage();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [lastHref, setLastHref] = useState<string>();

  const update = (key: FieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "success") setStatus("idle");
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const required = t("join.errors.required");
    const minLength = t("join.errors.minLength");

    if (values.name.trim().length === 0) next.name = required;
    else if (values.name.trim().length < 2) next.name = minLength;

    if (site.joinForm.ageMode === "exact") {
      const age = Number(values.age);
      if (values.age.trim().length === 0) next.age = required;
      else if (!Number.isInteger(age) || age < 10 || age > 100) {
        next.age = t("join.errors.ageNumber");
      }
    } else if (!values.ageRange) {
      next.ageRange = t("join.errors.ageRange");
    }

    if (!values.role) next.role = required;
    if (values.skills.trim().length === 0) next.skills = required;
    else if (values.skills.trim().length < 10) next.skills = minLength;

    if (values.contribution.trim().length === 0) next.contribution = required;
    else if (values.contribution.trim().length < 10) next.contribution = minLength;

    if (values.contactHandle.trim().length === 0) next.contactHandle = required;
    else if (values.contactHandle.trim().length < 2) next.contactHandle = minLength;

    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    const errorKeys = Object.keys(nextErrors) as FieldKey[];
    if (errorKeys.length > 0) {
      const first = errorKeys[0];
      if (first) document.getElementById(FIELD_IDS[first])?.focus();
      setStatus("idle");
      return;
    }

    const role = site.joinForm.roles.find((item) => item.id === values.role);
    const ageValue =
      site.joinForm.ageMode === "exact"
        ? values.age.trim()
        : values.ageRange === "under"
          ? t("join.ageRange.under")
          : t("join.ageRange.over");

    const lines = [
      `${site.studioName} — ${t("join.label")}`,
      "",
      `${t("join.fields.name")}: ${values.name.trim()}`,
      `${t(site.joinForm.ageMode === "exact" ? "join.fields.age" : "join.fields.ageRange")}: ${ageValue}`,
      `${t("join.fields.role")}: ${role?.label[language] ?? values.role}`,
      `${t("join.fields.skills")}: ${values.skills.trim()}`,
      `${t("join.fields.contribution")}: ${values.contribution.trim()}`,
      `${t("join.fields.contactHandle")}: ${values.contactHandle.trim()}`,
    ];

    const href = whatsappHref(site.whatsappNumber, lines.join("\n"));
    setLastHref(href);
    setStatus("success");
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {hasErrors && (
        <p
          role="alert"
          className="border-s-2 border-[var(--color-highlight-strong)] bg-[var(--color-bg-primary)] px-3 py-2 text-[12px] font-semibold text-[var(--color-highlight-strong)]"
        >
          {t("join.errors.fixFields")}
        </p>
      )}

      <Field id={FIELD_IDS.name} label={t("join.fields.name")} error={errors.name}>
        <input
          id={FIELD_IDS.name}
          name="name"
          type="text"
          required
          autoComplete="given-name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder={t("join.placeholders.name")}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={errors.name ? `${FIELD_IDS.name}-error` : undefined}
          className={fieldClass(Boolean(errors.name))}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        {site.joinForm.ageMode === "exact" ? (
          <Field
            id={FIELD_IDS.age}
            label={t("join.fields.age")}
            error={errors.age}
          >
            <input
              id={FIELD_IDS.age}
              name="age"
              type="number"
              inputMode="numeric"
              min={10}
              max={100}
              required
              value={values.age}
              onChange={(event) => update("age", event.target.value)}
              placeholder={t("join.placeholders.age")}
              aria-invalid={Boolean(errors.age) || undefined}
              aria-describedby={errors.age ? `${FIELD_IDS.age}-error` : undefined}
              className={fieldClass(Boolean(errors.age))}
            />
          </Field>
        ) : (
          <Field
            id={FIELD_IDS.ageRange}
            label={t("join.fields.ageRange")}
            error={errors.ageRange}
          >
            <select
              id={FIELD_IDS.ageRange}
              name="ageRange"
              required
              value={values.ageRange}
              onChange={(event) => update("ageRange", event.target.value)}
              aria-invalid={Boolean(errors.ageRange) || undefined}
              aria-describedby={
                errors.ageRange ? `${FIELD_IDS.ageRange}-error` : undefined
              }
              className={fieldClass(Boolean(errors.ageRange))}
            >
              <option value="">{t("join.ageRange.under")} / {t("join.ageRange.over")}</option>
              <option value="under">{t("join.ageRange.under")}</option>
              <option value="over">{t("join.ageRange.over")}</option>
            </select>
          </Field>
        )}

        <Field id={FIELD_IDS.role} label={t("join.fields.role")} error={errors.role}>
          <select
            id={FIELD_IDS.role}
            name="role"
            required
            value={values.role}
            onChange={(event) => update("role", event.target.value)}
            aria-invalid={Boolean(errors.role) || undefined}
            aria-describedby={errors.role ? `${FIELD_IDS.role}-error` : undefined}
            className={fieldClass(Boolean(errors.role))}
          >
            <option value="">{t("join.placeholders.role")}</option>
            {site.joinForm.roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label[language]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={FIELD_IDS.skills}
        label={t("join.fields.skills")}
        error={errors.skills}
      >
        <textarea
          id={FIELD_IDS.skills}
          name="skills"
          rows={3}
          required
          value={values.skills}
          onChange={(event) => update("skills", event.target.value)}
          placeholder={t("join.placeholders.skills")}
          aria-invalid={Boolean(errors.skills) || undefined}
          aria-describedby={errors.skills ? `${FIELD_IDS.skills}-error` : undefined}
          className={cn(fieldClass(Boolean(errors.skills)), "resize-y")}
        />
      </Field>

      <Field
        id={FIELD_IDS.contribution}
        label={t("join.fields.contribution")}
        error={errors.contribution}
      >
        <textarea
          id={FIELD_IDS.contribution}
          name="contribution"
          rows={3}
          required
          value={values.contribution}
          onChange={(event) => update("contribution", event.target.value)}
          placeholder={t("join.placeholders.contribution")}
          aria-invalid={Boolean(errors.contribution) || undefined}
          aria-describedby={
            errors.contribution ? `${FIELD_IDS.contribution}-error` : undefined
          }
          className={cn(fieldClass(Boolean(errors.contribution)), "resize-y")}
        />
      </Field>

      <Field
        id={FIELD_IDS.contactHandle}
        label={t("join.fields.contactHandle")}
        error={errors.contactHandle}
      >
        <input
          id={FIELD_IDS.contactHandle}
          name="contactHandle"
          type="text"
          required
          autoComplete="off"
          spellCheck={false}
          value={values.contactHandle}
          onChange={(event) => update("contactHandle", event.target.value)}
          placeholder={t("join.placeholders.contactHandle")}
          aria-invalid={Boolean(errors.contactHandle) || undefined}
          aria-describedby={
            errors.contactHandle ? `${FIELD_IDS.contactHandle}-error` : undefined
          }
          className={fieldClass(Boolean(errors.contactHandle))}
        />
      </Field>

      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4"
        >
          <p className="flex items-start gap-2 text-[13px] font-bold text-[var(--color-accent-strong)]">
            <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {t("join.success")}
          </p>
          <p className="mt-1.5 ps-6 text-[12px] leading-relaxed text-[var(--color-fg-secondary)]">
            {t("join.successHint")}
          </p>
          {lastHref && (
            <a
              href={lastHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 border-b border-[var(--color-accent)] pb-0.5 text-[11px] font-bold text-[var(--color-accent)]"
            >
              {t("join.submit")}
              <span className="sr-only">({t("a11y.openInNewTab")})</span>
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        className="group inline-flex min-h-12 w-full items-center justify-center gap-3 border border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] px-5 py-3 text-[12px] font-bold text-[var(--color-fg-inverse)] transition-colors hover:bg-[var(--color-accent)]"
      >
        {t("join.submit")}
        <Send
          size={15}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
        />
      </button>
    </form>
  );
}
