const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-white text-slate-900 border border-gray-300 hover:bg-gray-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  warning: "bg-amber-700 text-white hover:bg-amber-800",
  muted: "bg-gray-200 text-slate-700 hover:bg-gray-300",
  teal: "bg-teal-600 text-white hover:bg-teal-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export const Button = ({
  children,
  className = "",
  disabled = false,
  icon: Icon,
  iconOnly = false,
  loading = false,
  loadingText = "Loading...",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={joinClasses(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70",
        iconOnly ? "h-10 w-10 p-0" : "",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span>{loadingText}</span>
      ) : (
        <>
          {Icon ? <Icon size={16} /> : null}
          {!iconOnly ? <span>{children}</span> : null}
        </>
      )}
    </button>
  );
};

export default Button;
