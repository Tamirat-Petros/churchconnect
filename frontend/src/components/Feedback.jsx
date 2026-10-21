export function Loading({ label = "Loading..." }) {
  return <p className="status-message" role="status">{label}</p>;
}

export function ErrorMessage({ children }) {
  return children ? <p className="notice notice-error" role="alert">{children}</p> : null;
}

export function SuccessMessage({ children }) {
  return children ? <p className="notice notice-success" role="status">{children}</p> : null;
}

export function FormField({ label, name, as = "input", children, ...props }) {
  const Control = as;
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <Control id={name} name={name} {...props}>{children}</Control>
    </label>
  );
}
