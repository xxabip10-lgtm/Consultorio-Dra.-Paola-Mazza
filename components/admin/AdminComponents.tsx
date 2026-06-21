"use client";

export function Metric({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-ocean-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <Icon className="h-5 w-5 text-ocean-600" />
      <p className="mt-3 text-2xl font-bold text-clinic-ink dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-ocean-100">{label}</p>
    </div>
  );
}

export function Panel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-lg border border-ocean-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-5 text-2xl font-bold text-clinic-ink dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export function AdminInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-clinic-ink dark:text-white">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-clinic-ink dark:text-white">
      {label}
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring resize-none rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
      />
    </label>
  );
}

export function Insight({
  title,
  value,
  text
}: {
  title: string;
  value: string | number;
  text: string;
}) {
  return (
    <div className="rounded-lg bg-clinic-sky p-5 dark:bg-white/5">
      <p className="text-sm font-bold text-ocean-700 dark:text-ocean-300">{title}</p>
      <p className="mt-3 text-4xl font-bold text-clinic-ink dark:text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-ocean-50">{text}</p>
    </div>
  );
}
