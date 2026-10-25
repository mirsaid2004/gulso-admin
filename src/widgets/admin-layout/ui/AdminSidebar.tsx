import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { Viewer } from '@/entities/viewer'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { NAV_ITEMS } from '../model/navigation'

interface AdminSidebarProps {
  pendingCount: number
  viewer?: Viewer
}

export function AdminSidebar({ pendingCount, viewer }: AdminSidebarProps) {
  const { t } = useLocale()
  return (
    <aside className="sticky top-0 z-10 flex h-screen w-64 shrink-0 flex-col border-r border-slate-50 bg-white">
      <div className="mb-4 flex h-24 flex-col items-center px-6 py-2">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Gulso" className="size-10 rounded-[14px]" />
          <div className="flex flex-col">
            <span className="text-lg leading-7 font-black tracking-tighter text-[#1a1a1a] uppercase">{t('layout.brand')}</span>
            <span className="text-[10px] leading-[15px] font-bold tracking-widest text-primary uppercase">
              {t('layout.panel')}
            </span>
          </div>
        </div>
      </div>

      <nav aria-label={t('layout.mainNav')} className="flex flex-1 flex-col gap-2 px-4 py-2">
        {NAV_ITEMS.map(({ key, to, icon: Icon }) => (
          <NavLink
            key={key}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex h-12 items-center gap-4 rounded-[14px] px-4 py-2 text-sm font-bold transition-colors',
                isActive
                  ? 'bg-primary/5 text-primary shadow-[var(--shadow-sm),0_0_0_1px_oklch(0.6067_0.2266_7.24/0.1)]'
                  : 'text-slate-500 hover:text-slate-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('size-5', isActive ? 'text-primary' : 'text-slate-400')} />
                <span className="flex-1 text-left">{t(`pages.${key}.title`)}</span>
                {key === 'requests' && pendingCount > 0 && (
                  <span
                    aria-label={t('layout.pendingBadge', { count: pendingCount })}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-black text-white"
                  >
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-50 p-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl p-3 hover:bg-slate-50">
          {viewer && (
            <div className="flex items-center gap-3">
              <img src={viewer.avatarUrl} alt="" className="size-9 rounded-[14px] border-2 border-white shadow-sm" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900">{viewer.name}</span>
                <span className="text-[9px] font-bold tracking-tighter text-slate-400 uppercase">
                  {viewer.role} · ID: {viewer.id}
                </span>
              </div>
            </div>
          )}
          <button
            type="button"
            title={t('layout.logout')}
            aria-label={t('layout.logout')}
            className="flex rounded-[10px] border-none bg-transparent p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
