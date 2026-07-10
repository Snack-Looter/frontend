export type SelectOption = { value: number; label: string };

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  loading = false,
  error,
  emptyMessage,
}: {
  label: string;
  value: number | "";
  onChange: (value: number) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-label text-ink">{label}</span>
      {loading ? (
        <div className="h-[52px] w-full rounded-button bg-surface-sunken border-2.5 border-border-soft animate-pulse" />
      ) : (
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-[52px] rounded-button border-2.5 border-border-soft px-4 font-body text-body text-ink bg-surface-card focus:outline-none focus:border-primary disabled:opacity-50 transition-colors"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      {!loading && !disabled && options.length === 0 && emptyMessage && (
        <span className="font-body text-caption text-neutral">{emptyMessage}</span>
      )}
      {error && <span className="font-body text-caption text-danger">{error}</span>}
    </label>
  );
}
