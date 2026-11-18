import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
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
  | "department"
  | "tools"
  | "previousProjects"
  | "aiUsage"
  | "daysPerWeek"
  | "hoursPerDay"
  | "internetElectricity"
  | "whyJoin"
  | "whereHeard"
  | "skills"
  | "contribution"
  | "contactHandle"
  | "acknowledge";

type FormValues = Record<Exclude<FieldKey, "acknowledge">, string>;
type FormErrors = Partial<Record<FieldKey, string>>;

const EMPTY_VALUES: FormValues = {
  name: "",
  age: "",
  ageRange: "",
  role: "",
  department: "",
  tools: "",
  previousProjects: "",
  aiUsage: "",
  daysPerWeek: "",
  hoursPerDay: "",
  internetElectricity: "",
  whyJoin: "",
  whereHeard: "",
  skills: "",
  contribution: "",
  contactHandle: "",
};

const FIELD_IDS: Record<FieldKey, string> = {
  name: "join-name",
  age: "join-age",
  ageRange: "join-age-range",
  role: "join-role",
  department: "join-department",
  tools: "join-tools",
  previousProjects: "join-previous-projects",
  aiUsage: "join-ai-usage",
  daysPerWeek: "join-days-per-week",
  hoursPerDay: "join-hours-per-day",
  internetElectricity: "join-internet-electricity",
  whyJoin: "join-why",
  whereHeard: "join-where-heard",
  skills: "join-skills",
  contribution: "join-contribution",
  contactHandle: "join-contact",
  acknowledge: "join-acknowledge",
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
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [lastHref, setLastHref] = useState<string>();

  const update = (key: Exclude<FieldKey, "acknowledge">, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "success") setStatus("idle");
  };

  const clearError = (key: FieldKey) => {
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "success") setStatus("idle");
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const required = t("join.errors.required");
    const minLength = t("join.errors.minLength");
    const numberError = t("join.errors.number");

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

    if (!values.department) next.department = required;
    if (!values.role) next.role = required;

    if (values.skills.trim().length === 0) next.skills = required;
    else if (values.skills.trim().length < 10) next.skills = minLength;

    if (values.tools.trim().length === 0) next.tools = required;
    else if (values.tools.trim().length < 2) next.tools = minLength;

    if (values.previousProjects.trim().length === 0) next.previousProjects = required;
    else if (values.previousProjects.trim().length < 3) next.previousProjects = minLength;

    if (!values.aiUsage) next.aiUsage = required;

    const days = Number(values.daysPerWeek);
    if (values.daysPerWeek.trim().length === 0) next.daysPerWeek = required;
    else if (!Number.isInteger(days) || days < 1 || days > 7) next.daysPerWeek = numberError;

    const hours = Number(values.hoursPerDay);
    if (values.hoursPerDay.trim().length === 0) next.hoursPerDay = required;
    else if (!Number.isInteger(hours) || hours < 1 || hours > 24) next.hoursPerDay = numberError;

    if (values.internetElectricity.trim().length === 0) next.internetElectricity = required;
    else if (values.internetElectricity.trim().length < 3) next.internetElectricity = minLength;

    if (values.whyJoin.trim().length === 0) next.whyJoin = required;
    else if (values.whyJoin.trim().length < 10) next.whyJoin = minLength;

    if (values.whereHeard.trim().length === 0) next.whereHeard = required;
    else if (values.whereHeard.trim().length < 2) next.whereHeard = minLength;

    if (values.contribution.trim().length === 0) next.contribution = required;
    else if (values.contribution.trim().length < 10) next.contribution = minLength;

    if (values.contactHandle.trim().length === 0) next.contactHandle = required;
    else if (values.contactHandle.trim().length < 2) next.contactHandle = minLength;

    if (!acknowledged) next.acknowledge = t("join.errors.acknowledgeRequired");

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
    const department = site.joinForm.departments.find(
      (item) => item.id === values.department,
    );
    const aiUsage = site.joinForm.aiUsageOptions.find(
      (item) => item.id === values.aiUsage,
    );
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
      `${t("join.fields.department")}: ${department?.label[language] ?? values.department}`,
      `${t("join.fields.role")}: ${role?.label[language] ?? values.role}`,
      `${t("join.fields.skills")}: ${values.skills.trim()}`,
      `${t("join.fields.tools")}: ${values.tools.trim()}`,
      `${t("join.fields.previousProjects")}: ${values.previousProjects.trim()}`,
      `${t("join.fields.aiUsage")}: ${aiUsage?.label[language] ?? values.aiUsage}`,
      `${t("join.fields.timeCommitment")}: ${t("join.fields.daysPerWeek")}=${values.daysPerWeek.trim()}, ${t("join.fields.hoursPerDay")}=${values.hoursPerDay.trim()}`,
      `${t("join.fields.internetElectricity")}: ${values.internetElectricity.trim()}`,
      `${t("join.fields.whyJoin")}: ${values.whyJoin.trim()}`,
      `${t("join.fields.whereHeard")}: ${values.whereHeard.trim()}`,
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

        <Field
          id={FIELD_IDS.department}
          label={t("join.fields.department")}
          error={errors.department}
        >
          <select
            id={FIELD_IDS.department}
            name="department"
            required
            value={values.department}
            onChange={(event) => update("department", event.target.value)}
            aria-invalid={Boolean(errors.department) || undefined}
            aria-describedby={
              errors.department ? `${FIELD_IDS.department}-error` : undefined
            }
            className={fieldClass(Boolean(errors.department))}
          >
            <option value="">{t("join.placeholders.department")}</option>
            {site.joinForm.departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.label[language]}
              </option>
            ))}
          </select>
        </Field>
      </div>

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
        id={FIELD_IDS.tools}
        label={t("join.fields.tools")}
        error={errors.tools}
      >
        <input
          id={FIELD_IDS.tools}
          name="tools"
          type="text"
          required
          value={values.tools}
          onChange={(event) => update("tools", event.target.value)}
          placeholder={t("join.placeholders.tools")}
          aria-invalid={Boolean(errors.tools) || undefined}
          aria-describedby={errors.tools ? `${FIELD_IDS.tools}-error` : undefined}
          className={fieldClass(Boolean(errors.tools))}
        />
      </Field>

      <Field
        id={FIELD_IDS.previousProjects}
        label={t("join.fields.previousProjects")}
        error={errors.previousProjects}
      >
        <textarea
          id={FIELD_IDS.previousProjects}
          name="previousProjects"
          rows={3}
          required
          value={values.previousProjects}
          onChange={(event) => update("previousProjects", event.target.value)}
          placeholder={t("join.placeholders.previousProjects")}
          aria-invalid={Boolean(errors.previousProjects) || undefined}
          aria-describedby={
            errors.previousProjects ? `${FIELD_IDS.previousProjects}-error` : undefined
          }
          className={cn(fieldClass(Boolean(errors.previousProjects)), "resize-y")}
        />
      </Field>

      <Field
        id={FIELD_IDS.aiUsage}
        label={t("join.fields.aiUsage")}
        error={errors.aiUsage}
      >
        <select
          id={FIELD_IDS.aiUsage}
          name="aiUsage"
          required
          value={values.aiUsage}
          onChange={(event) => update("aiUsage", event.target.value)}
          aria-invalid={Boolean(errors.aiUsage) || undefined}
          aria-describedby={errors.aiUsage ? `${FIELD_IDS.aiUsage}-error` : undefined}
          className={fieldClass(Boolean(errors.aiUsage))}
        >
          <option value="">{t("join.placeholders.aiUsage")}</option>
          {site.joinForm.aiUsageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label[language]}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="min-w-0">
        <legend className="text-[11px] font-bold text-[var(--color-fg-primary)]">
          {t("join.fields.timeCommitment")}
        </legend>
        <div className="mt-2 grid gap-5 sm:grid-cols-2">
          <Field
            id={FIELD_IDS.daysPerWeek}
            label={t("join.fields.daysPerWeek")}
            error={errors.daysPerWeek}
          >
            <input
              id={FIELD_IDS.daysPerWeek}
              name="daysPerWeek"
              type="number"
              inputMode="numeric"
              min={1}
              max={7}
              required
              value={values.daysPerWeek}
              onChange={(event) => update("daysPerWeek", event.target.value)}
              placeholder={t("join.placeholders.daysPerWeek")}
              aria-invalid={Boolean(errors.daysPerWeek) || undefined}
              aria-describedby={
                errors.daysPerWeek ? `${FIELD_IDS.daysPerWeek}-error` : undefined
              }
              className={fieldClass(Boolean(errors.daysPerWeek))}
            />
          </Field>

          <Field
            id={FIELD_IDS.hoursPerDay}
            label={t("join.fields.hoursPerDay")}
            error={errors.hoursPerDay}
          >
            <input
              id={FIELD_IDS.hoursPerDay}
              name="hoursPerDay"
              type="number"
              inputMode="numeric"
              min={1}
              max={24}
              required
              value={values.hoursPerDay}
              onChange={(event) => update("hoursPerDay", event.target.value)}
              placeholder={t("join.placeholders.hoursPerDay")}
              aria-invalid={Boolean(errors.hoursPerDay) || undefined}
              aria-describedby={
                errors.hoursPerDay ? `${FIELD_IDS.hoursPerDay}-error` : undefined
              }
              className={fieldClass(Boolean(errors.hoursPerDay))}
            />
          </Field>
        </div>
      </fieldset>

      <Field
        id={FIELD_IDS.internetElectricity}
        label={t("join.fields.internetElectricity")}
        error={errors.internetElectricity}
      >
        <input
          id={FIELD_IDS.internetElectricity}
          name="internetElectricity"
          type="text"
          required
          value={values.internetElectricity}
          onChange={(event) => update("internetElectricity", event.target.value)}
          placeholder={t("join.placeholders.internetElectricity")}
          aria-invalid={Boolean(errors.internetElectricity) || undefined}
          aria-describedby={
            errors.internetElectricity ? `${FIELD_IDS.internetElectricity}-error` : undefined
          }
          className={fieldClass(Boolean(errors.internetElectricity))}
        />
      </Field>

      <Field
        id={FIELD_IDS.whyJoin}
        label={t("join.fields.whyJoin")}
        error={errors.whyJoin}
      >
        <textarea
          id={FIELD_IDS.whyJoin}
          name="whyJoin"
          rows={3}
          required
          value={values.whyJoin}
          onChange={(event) => update("whyJoin", event.target.value)}
          placeholder={t("join.placeholders.whyJoin")}
          aria-invalid={Boolean(errors.whyJoin) || undefined}
          aria-describedby={errors.whyJoin ? `${FIELD_IDS.whyJoin}-error` : undefined}
          className={cn(fieldClass(Boolean(errors.whyJoin)), "resize-y")}
        />
      </Field>

      <Field
        id={FIELD_IDS.whereHeard}
        label={t("join.fields.whereHeard")}
        error={errors.whereHeard}
      >
        <input
          id={FIELD_IDS.whereHeard}
          name="whereHeard"
          type="text"
          required
          value={values.whereHeard}
          onChange={(event) => update("whereHeard", event.target.value)}
          placeholder={t("join.placeholders.whereHeard")}
          aria-invalid={Boolean(errors.whereHeard) || undefined}
          aria-describedby={
            errors.whereHeard ? `${FIELD_IDS.whereHeard}-error` : undefined
          }
          className={fieldClass(Boolean(errors.whereHeard))}
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

      <div className="min-w-0 border-t border-[var(--color-border)] pt-5">
        <div className="flex items-start gap-3">
          <input
            id={FIELD_IDS.acknowledge}
            name="acknowledge"
            type="checkbox"
            required
            checked={acknowledged}
            onChange={(event) => {
              setAcknowledged(event.target.checked);
              clearError("acknowledge");
            }}
            aria-invalid={Boolean(errors.acknowledge) || undefined}
            aria-describedby={
              errors.acknowledge ? `${FIELD_IDS.acknowledge}-error` : undefined
            }
            className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]"
          />
          <label
            htmlFor={FIELD_IDS.acknowledge}
            className="text-[11px] leading-[1.8] text-[var(--color-fg-secondary)]"
          >
            {t("join.preLaunchNotice")}{" "}
            <Link
              to="/privacy"
              className="font-bold text-[var(--color-accent)] underline underline-offset-2"
              onClick={(event) => event.stopPropagation()}
            >
              {t("footer.privacy")}
            </Link>
          </label>
        </div>
        {errors.acknowledge && (
          <p
            id={`${FIELD_IDS.acknowledge}-error`}
            className="mt-2 ps-7 text-[11px] font-semibold text-[var(--color-highlight-strong)]"
          >
            {errors.acknowledge}
          </p>
        )}
      </div>

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
