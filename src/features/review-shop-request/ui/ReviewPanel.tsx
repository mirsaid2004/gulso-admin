import { Check } from 'lucide-react'
import { Button } from '@/shared/ui'
import type { ReviewShopRequestModel } from '../model/useReviewShopRequest'
import { NoteComposer } from './NoteComposer'
import { VerificationChecks } from './VerificationChecks'

/** Checks, optional note composer and the Reject / Request changes / Approve action bar. */
export function ReviewPanel({ model }: { model: ReviewShopRequestModel }) {
  return (
    <>
      <VerificationChecks checks={model.checks} toggleCheck={model.toggleCheck} />
      {model.composer && (
        <NoteComposer
          composer={model.composer}
          noteText={model.noteText}
          setNoteText={model.setNoteText}
          closeComposer={model.closeComposer}
          send={model.send}
          canSend={model.canSend}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-50 px-8 py-5">
        <span className="text-xs font-semibold text-slate-400">{model.approveHint}</span>
        <div className="flex flex-wrap gap-2">
          <Button variant="dangerGhost" onClick={() => model.openComposer('reject')}>
            Reject
          </Button>
          <Button variant="soft" onClick={() => model.openComposer('changes')}>
            Request changes
          </Button>
          <Button variant="primary" className="px-7" onClick={model.approve} disabled={!model.canApprove}>
            <Check className="size-4" strokeWidth={2.5} />
            Approve &amp; open shop
          </Button>
        </div>
      </div>
    </>
  )
}
