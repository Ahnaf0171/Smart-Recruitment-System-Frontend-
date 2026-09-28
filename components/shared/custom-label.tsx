export function CustomLabel({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`text-sm font-medium font-body text-foreground mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
