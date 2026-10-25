import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="m-0 text-sm font-medium text-slate-400">{subtitle}</p>
      </div>
      {actions}
    </div>
  )
}
