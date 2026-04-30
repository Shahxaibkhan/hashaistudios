"use client";

interface CustomerFormProps {
  name: string;
  whatsapp: string;
  onNameChange: (value: string) => void;
  onWhatsAppChange: (value: string) => void;
  errors: Record<string, string>;
}

export default function CustomerForm({
  name,
  whatsapp,
  onNameChange,
  onWhatsAppChange,
  errors,
}: CustomerFormProps) {
  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label
          htmlFor="customer-name"
          className="block text-sm font-medium text-[var(--hai-text-secondary)] mb-2"
        >
          Full Name
        </label>
        <input
          id="customer-name"
          type="text"
          className={`hai-input ${errors.name ? "border-[var(--hai-accent-red)]" : ""}`}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {errors.name && (
          <p className="text-[var(--hai-accent-red)] text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* WhatsApp Input */}
      <div>
        <label
          htmlFor="customer-whatsapp"
          className="block text-sm font-medium text-[var(--hai-text-secondary)] mb-2"
        >
          WhatsApp Number
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-4 bg-[var(--hai-bg-card)] border border-r-0 border-[var(--hai-border)] rounded-l-xl text-[var(--hai-text-muted)]">
            +92
          </span>
          <input
            id="customer-whatsapp"
            type="tel"
            className={`hai-input rounded-l-none ${
              errors.whatsapp ? "border-[var(--hai-accent-red)]" : ""
            }`}
            placeholder="3001234567"
            value={whatsapp}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, "");
              onWhatsAppChange(value);
            }}
            maxLength={10}
          />
        </div>
        {errors.whatsapp && (
          <p className="text-[var(--hai-accent-red)] text-sm mt-1">{errors.whatsapp}</p>
        )}
      </div>
    </div>
  );
}
