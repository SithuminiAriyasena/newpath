export default function Card({ children, className = "", alert = false }) {
  return (
    <div
      className={`my-3 rounded-2xl p-4 shadow-sm ${
        alert ? "bg-red-50 text-red-800" : "bg-white"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({ children, variant = "solid", className = "", ...props }) {
  const styles =
    variant === "ghost"
      ? "bg-leaf-100 text-leaf-700 hover:bg-emerald-100"
      : "bg-leaf-500 text-white hover:bg-leaf-700";
  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
