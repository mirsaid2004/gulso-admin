import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('overflow-hidden rounded-[32px] bg-white shadow-sm', className)} {...props} />
}

interface DataTableProps {
  columns: Array<{ key: string; label: ReactNode }>
  minWidth?: number
  children: ReactNode
  empty?: ReactNode
}

/** White rounded card holding a borderless table, as used on every list page. */
export function DataTable({ columns, minWidth = 820, children, empty }: DataTableProps) {
  return (
    <Card className="overflow-x-auto px-8 pt-4 pb-6">
      <table className="w-full border-collapse" style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={cn(
                  'pt-4 pb-3 text-left text-[10px] font-black tracking-widest text-slate-400 uppercase',
                  i === 0 ? 'pr-3' : i === columns.length - 1 ? 'pl-3' : 'px-3',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty}
    </Card>
  )
}

export function Tr({ className, ...props }: ComponentProps<'tr'>) {
  return <tr className={cn('border-t border-slate-50 transition-opacity', className)} {...props} />
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-3 py-4 first:pl-0 last:pr-0', className)} {...props} />
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-2">{children}</div>
}

/** Clickable cell value that jumps to a filtered view (e.g. product count → Products). */
export function LinkButton({ className, type = 'button', ...props }: ComponentProps<'button'>) {
  return (
    <button
      type={type}
      className={cn('border-none bg-transparent p-0 text-left text-sm font-black text-primary hover:underline', className)}
      {...props}
    />
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="m-0 py-12 text-center text-sm font-bold text-slate-400">{children}</p>
}
