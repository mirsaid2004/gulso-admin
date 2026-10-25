import { Bell, PanelLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '@/features/switch-language'
import { ROUTES } from '@/shared/config'
import { useLocale } from '@/shared/i18n'

interface AdminHeaderProps {
  pageTitle: string
  pendingCount: number
  onToggleSidebar: () => void
}

const iconButton =
  'flex items-center justify-center rounded-[10px] border-none bg-transparent text-slate-600 transition-colors hover:bg-primary/5 hover:text-primary'

export function AdminHeader({ pageTitle, pendingCount, onToggleSidebar }: AdminHeaderProps) {
  const { t } = useLocale()
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={t('layout.toggleSidebar')}
          className="-ml-1 flex size-7 items-center justify-center rounded-lg border-none bg-transparent text-foreground hover:bg-accent"
        >
          <PanelLeft className="size-4" />
        </button>
        <div className="mr-2 h-4 w-px bg-border" />
        <nav aria-label={t('layout.breadcrumb')} className="flex items-center gap-2 text-xs">
          <span className="font-medium tracking-wider text-muted-foreground uppercase">{t('layout.panel')}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold whitespace-nowrap text-slate-900">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-1 pr-2">
        <LanguageSwitcher />
        <Link
          to={ROUTES.requests}
          aria-label={pendingCount ? t('layout.pendingRequests', { count: pendingCount }) : t('layout.notifications')}
          className={`${iconButton} relative size-10`}
        >
          <Bell className="size-5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {pendingCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
