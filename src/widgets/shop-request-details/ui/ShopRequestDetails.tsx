import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import {
  getRequestNote,
  LEGAL_ENTITY_LABEL,
  REQUEST_STATUS_META,
  type RequestNoteKind,
  type ShopRequest,
} from '@/entities/shop-request'
import type { User } from '@/entities/user'
import type { Shop } from '@/entities/shop'
import { ReviewPanel, useReviewShopRequest } from '@/features/review-shop-request'
import { categoryWithEmoji } from '@/shared/config'
import { cn, formatDateTime } from '@/shared/lib'
import { Card, Monogram, Pill, SectionLabel } from '@/shared/ui'
import { getOwnerTag } from '../lib/ownerTag'

const NOTE_STYLE: Record<RequestNoteKind, { box: string; label: string }> = {
  resubmitted: { box: 'border-blue-100 bg-blue-50', label: 'text-blue-700' },
  changes: { box: 'border-rose-100 bg-rose-50', label: 'text-rose-500' },
  rejected: { box: 'border-slate-100 bg-slate-50', label: 'text-slate-500' },
  approved: { box: 'border-emerald-100 bg-emerald-50', label: 'text-emerald-700' },
}

const OWNER_TAG_STYLE = {
  rose: 'bg-rose-50 text-rose-500',
  emerald: 'bg-emerald-50 text-emerald-700',
  slate: 'bg-slate-50 text-slate-500',
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  )
}

interface ShopRequestDetailsProps {
  request: ShopRequest
  owner: User
  ownerShops: Shop[]
}

export function ShopRequestDetails({ request, owner, ownerShops }: ShopRequestDetailsProps) {
  const review = useReviewShopRequest(request, owner.name)
  const status = REQUEST_STATUS_META[request.status]
  const note = getRequestNote(request)
  const ownerTag = getOwnerTag(owner, ownerShops.map((s) => s.name))
  const rows = [
    { k: 'Phone', v: request.phone },
    { k: 'Pickup address', v: request.address },
    { k: 'Legal entity', v: LEGAL_ENTITY_LABEL[request.legalEntity] },
    { k: 'STIR', v: request.stir },
  ]

  return (
    <Card aria-label={`${request.name} application`} className="flex min-w-0 flex-[999_1_480px] flex-col">
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-50 px-8 pt-7 pb-6">
        <Monogram name={request.name} size="xl" />
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 text-2xl font-black tracking-tight text-slate-900">{request.name}</h2>
            <Pill tone={status.tone}>{status.badge}</Pill>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Application #A-{request.id} · submitted {formatDateTime(request.submittedAt)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7 px-8 py-6">
        <Section label="Owner">
          <div className="flex items-center gap-3">
            <Monogram name={owner.name} tone="neutral" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-black text-slate-900">{owner.name}</span>
              <span className="text-xs font-medium text-slate-400">
                {owner.phone} · ID: {owner.id}
              </span>
            </div>
          </div>
          <span className={cn('self-start rounded-lg px-2.5 py-1 text-[11px] font-bold', OWNER_TAG_STYLE[ownerTag.tone])}>
            {ownerTag.label}
          </span>
        </Section>

        <Section label="Shop">
          <div className="flex flex-wrap gap-1.5">
            {request.categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-slate-600"
              >
                {categoryWithEmoji(c)}
              </span>
            ))}
          </div>
          <p className="m-0 text-sm font-medium text-pretty text-slate-600">{request.description}</p>
        </Section>

        <Section label="Contact & legal">
          <dl className="m-0 flex flex-col gap-2.5">
            {rows.map((row) => (
              <div key={row.k} className="flex justify-between gap-4 text-[13px]">
                <dt className="shrink-0 font-medium text-slate-400">{row.k}</dt>
                <dd className="m-0 text-right font-bold text-slate-900">{row.v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section label="Documents">
          {request.documents.map((doc) => (
            <div key={doc.fileName} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <FileText className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13px] font-bold text-slate-900">{doc.title}</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {doc.fileName} · {doc.size}
                </span>
              </div>
              <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-black text-primary hover:underline">
                Open
              </a>
            </div>
          ))}
        </Section>
      </div>

      {note && (
        <div className={cn('mx-8 mb-6 flex flex-col gap-1.5 rounded-2xl border p-4', NOTE_STYLE[note.kind].box)}>
          <span className={cn('text-[10px] font-black tracking-[0.2em] uppercase', NOTE_STYLE[note.kind].label)}>
            {note.label}
          </span>
          <span className="text-sm font-semibold text-slate-900">{note.text}</span>
        </div>
      )}

      {request.status === 'PENDING' && <ReviewPanel model={review} />}
    </Card>
  )
}
