import { useState, type ReactNode } from "react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { site } from "@/lib/contentLoader";
import { whatsappHref } from "@/lib/presentation";
import { cn } from "@/lib/utils";

type FieldKey =
  | "clientName"
  | "serviceType"
  | "description"
  | "notes"
  | "timeline"
  | "instructions";

type FormValues = Record<FieldKey, string>;
type FormErrors = Partial<Record<FieldKey, string>>;

const EMPTY_VALUES: FormValues = {
  clientName: "",
  serviceType: "",
  description: "",
  notes: "",
  timeline: "",
  instructions: "",
};

const FIELD_IDS: Record<FieldKey, string> = {
  clientName: "service-client-name",
  serviceType: "service-type",
  description: "service-description",
  notes: "service-notes",
  timeline: "service-timeline",
  instructions: "service-instructions",
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

export function ServiceRequestForm() {
  const { t } = useLanguage();
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
    const required = t("services.errors.required");
    const minLength = t("services.errors.minLength");

    if (values.clientName.trim().length === 0) next.clientName = required;
    else if (values.clientName.trim().length < 2) next.clientName = minLength;

    if (values.serviceType.trim().length === 0) next.serviceType = required;

    if (values.description.trim().length === 0) next.description = required;
    else if (values.description.trim().length < 10) next.description = minLength;

    return next;
  };

  const send = (channel: "whatsapp" | "email") => {
    const nextErrors = validate();
    setErrors(nextErrors);

    const errorKeys = Object.keys(nextErrors) as FieldKey[];
    if (errorKeys.length > 0) {
      const first = errorKeys[0];
      if (first) document.getElementById(FIELD_IDS[first])?.focus();
      setStatus("idle");
      return;
    }

    const withValue = (key: FieldKey) => values[key].trim() || "—";
    const body = [
      `${site.studioName} — ${t("services.label")}`,
      "",
      `${t("services.fields.clientName")}: ${withValue("clientName")}`,
      `${t("services.fields.serviceType")}: ${withValue("serviceType")}`,
      `${t("services.fields.description")}: ${withValue("description")}`,
      `${t("services.fields.notes")}: ${withValue("notes")}`,
      `${t("services.fields.timeline")}: ${withValue("timeline")}`,
      `${t("services.fields.instructions")}: ${withValue("instructions")}`,
    ].join("\n");

    const subject = `${t("services.emailSubject")} — ${values.clientName.trim()}`;
    const href =
      channel === "whatsapp"
        ? whatsappHref(site.whatsappNumber, body)
        : `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setLastHref(href);
    setStatus("success");

    if (channel === "whatsapp") {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-5">
      {hasErrors && (
        <p
          role="alert"
          className="border-s-2 border-[var(--color-highlight-strong)] bg-[var(--color-bg-primary)] px-3 py-2 text-[12px] font-semibold text-[var(--color-highlight-strong)]"
        >
          {t("services.errors.fixFields")}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={FIELD_IDS.clientName}
          label={t("services.fields.clientName")}
          error={errors.clientName}
        >
          <input
            id={FIELD_IDS.clientName}
            name="clientName"
            type="text"
            required
            autoComplete="name"
            value={values.clientName}
            onChange={(event) => update("clientName", event.target.value)}
            placeholder={t("services.placeholders.clientName")}
            aria-invalid={Boolean(errors.clientName) || undefined}
            aria-describedby={errors.clientName ? `${FIELD_IDS.clientName}-error` : undefined}
            className={fieldClass(Boolean(errors.clientName))}
          />
        </Field>

        <Field
          id={FIELD_IDS.serviceType}
          label={t("services.fields.serviceType")}
          error={errors.serviceType}
        >
          <input
            id={FIELD_IDS.serviceType}
            name="serviceType"
            type="text"
            required
            value={values.serviceType}
            onChange={(event) => update("serviceType", event.target.value)}
            placeholder={t("services.placeholders.serviceType")}
            aria-invalid={Boolean(errors.serviceType) || undefined}
            aria-describedby={errors.serviceType ? `${FIELD_IDS.serviceType}-error` : undefined}
            className={fieldClass(Boolean(errors.serviceType))}
          />
        </Field>
      </div>

      <Field
        id={FIELD_IDS.description}
        label={t("services.fields.description")}
        error={errors.description}
      >
        <textarea
          id={FIELD_IDS.description}
          name="description"
          rows={4}
          required
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder={t("services.placeholders.description")}
          aria-invalid={Boolean(errors.description) || undefined}
          aria-describedby={errors.description ? `${FIELD_IDS.description}-error` : undefined}
          className={cn(fieldClass(Boolean(errors.description)), "resize-y")}
        />
      </Field>

      <Field id={FIELD_IDS.notes} label={t("services.fields.notes")} error={errors.notes}>
        <textarea
          id={FIELD_IDS.notes}
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder={t("services.placeholders.notes")}
          aria-describedby={errors.notes ? `${FIELD_IDS.notes}-error` : undefined}
          className={cn(fieldClass(Boolean(errors.notes)), "resize-y")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={FIELD_IDS.timeline}
          label={t("services.fields.timeline")}
          error={errors.timeline}
        >
          <input
            id={FIELD_IDS.timeline}
            name="timeline"
            type="text"
            value={values.timeline}
            onChange={(event) => update("timeline", event.target.value)}
            placeholder={t("services.placeholders.timeline")}
            aria-describedby={errors.timeline ? `${FIELD_IDS.timeline}-error` : undefined}
            className={fieldClass(Boolean(errors.timeline))}
          />
        </Field>

        <Field
          id={FIELD_IDS.instructions}
          label={t("services.fields.instructions")}
          error={errors.instructions}
        >
          <input
            id={FIELD_IDS.instructions}
            name="instructions"
            type="text"
            value={values.instructions}
            onChange={(event) => update("instructions", event.target.value)}
            placeholder={t("services.placeholders.instructions")}
            aria-describedby={errors.instructions ? `${FIELD_IDS.instructions}-error` : undefined}
            className={fieldClass(Boolean(errors.instructions))}
          />
        </Field>
      </div>

      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4"
        >
          <p className="flex items-start gap-2 text-[13px] font-bold text-[var(--color-accent-strong)]">
            <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {t("services.success")}
          </p>
          <p className="mt-1.5 ps-6 text-[12px] leading-relaxed text-[var(--color-fg-secondary)]">
            {t("services.successHint")}
          </p>
          {lastHref && (
            <a
              href={lastHref}
              className="mt-2 inline-flex items-center gap-1.5 border-b border-[var(--color-accent)] pb-0.5 text-[11px] font-bold text-[var(--color-accent)]"
            >
              {t("services.submitEmail")}
            </a>
          )}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => send("whatsapp")}
          className="group inline-flex min-h-12 items-center justify-center gap-3 border border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)] px-5 py-3 text-[12px] font-bold text-[var(--color-fg-inverse)] transition-colors hover:bg-[var(--color-accent)]"
        >
          {t("services.submitWhatsApp")}
          <MessageCircle
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
          />
        </button>

        <button
          type="button"
          onClick={() => send("email")}
          className="group inline-flex min-h-12 items-center justify-center gap-3 border border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] px-5 py-3 text-[12px] font-bold text-[var(--color-fg-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {t("services.submitEmail")}
          <Mail
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 rtl:-scale-x-100"
          />
        </button>
      </div>
    </div>
  );
}
