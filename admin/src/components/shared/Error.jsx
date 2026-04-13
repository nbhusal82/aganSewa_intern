export const Error = ({ message = "Failed to load data." }) => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600 shadow-sm">
        {message}
      </div>
    </div>
  );
};
