import React from 'react';

// ============================================================================
// StatCard — การ์ดสรุปตัวเลขหนึ่งใบ
// pattern การ์ด (surface + border + shadow + material icon) ยกมาจาก NextStepsBento.jsx
// variant="highlight" = การ์ดพื้นเข้มใบซ้ายสุดใน mockup
// ============================================================================

export default function StatCard({
  icon,
  label,
  value,
  suffix,
  variant = 'default',
  onClick
}) {
  const isHighlight = variant === 'highlight';
  const isInteractive = typeof onClick === 'function';

  const surface = isHighlight
    ? 'bg-primary-container border-primary-container'
    : 'bg-surface-container-lowest border-outline-variant/20 hover:border-outline-variant/50';

  const labelTone = isHighlight ? 'text-on-primary/80' : 'text-on-surface-variant';
  const valueTone = isHighlight ? 'text-on-primary' : 'text-primary';
  const iconTone = isHighlight ? 'text-secondary-fixed-dim' : 'text-primary';
  const suffixTone = isHighlight ? 'text-on-primary/70' : 'text-on-surface-variant';

  return (
    <div
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`${surface} p-stack-lg rounded-xl border shadow-[0px_12px_32px_rgba(0,51,102,0.02)] flex flex-col justify-between min-h-[148px] transition-colors ${
        isInteractive ? 'cursor-pointer' : ''
      }`}
    >
      <span
        className={`material-symbols-outlined text-3xl ${iconTone}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true"
      >
        {icon}
      </span>

      <div className="mt-stack-md">
        <p className={`font-label-sm text-label-sm uppercase tracking-wider ${labelTone}`}>
          {label}
        </p>
        <p className={`font-headline-lg text-headline-lg mt-stack-sm ${valueTone}`}>
          {typeof value === 'number' ? value.toLocaleString('en-US') : value}
          {suffix && (
            <span className={`font-label-sm text-label-sm ml-1 ${suffixTone}`}>{suffix}</span>
          )}
        </p>
      </div>
    </div>
  );
}
