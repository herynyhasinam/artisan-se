import { InputHTMLAttributes, useId } from 'react';

type Props = { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;

export default function Field({ label, hint, ...inputProps }: Props) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps} />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}
