import { Download, Search } from "lucide-react";

import { Button } from "./Button";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const TableSkeleton = ({ columnCount, rows }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={`skeleton-${rowIndex}`} className="odd:bg-gray-50">
        {Array.from({ length: columnCount }).map((__, columnIndex) => (
          <td
            key={`cell-${rowIndex}-${columnIndex}`}
            className="border-r border-gray-200 px-4 py-4 last:border-r-0"
          >
            <div className="h-4 rounded bg-gray-200" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const Table = ({
  actions,
  columns = [],
  data = [],
  emptyMessage = "No records found.",
  exportLabel = "Export",
  onExport,
  onSearchChange,
  renderRow,
  searchPlaceholder = "Search...",
  searchValue = "",
  showExport = false,
  showFooter = true,
  showSearch = false,
  skeletonRows = 5,
}) => {
  const visibleCount = data.length;
  const hasRows = visibleCount > 0;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {(showSearch || showExport || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          {showSearch ? (
            <div className="flex w-full max-w-xs items-center overflow-hidden rounded-md border border-gray-300 bg-white px-4 py-2">
              <Search className="mr-2 h-4 w-4 text-gray-600" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-slate-600 outline-none"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-3">
            {actions}
            {showExport ? (
              <Button
                variant="secondary"
                icon={Download}
                onClick={onExport}
                className="cursor-pointer"
              >
                {exportLabel}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <table className="min-w-full border border-gray-200">
        <thead className="bg-white whitespace-nowrap">
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={joinClasses(
                  "border-r border-gray-200 px-4 py-3 text-left text-[13px] font-medium text-slate-600 last:border-r-0",
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 whitespace-nowrap">
          {renderRow === null ? (
            <TableSkeleton columnCount={columns.length} rows={skeletonRows} />
          ) : hasRows ? (
            data.map(renderRow)
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showFooter ? (
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {visibleCount ? 1 : 0} to {visibleCount} of {visibleCount}{" "}
            entries
          </p>
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <div className="rounded-md border border-gray-300 px-3 py-1.5 text-slate-900">
              {visibleCount || skeletonRows}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Table;
