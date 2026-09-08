import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowUpDown, Pencil, Plus, Trash2, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorPanel, LoadingPanel } from '@/components/data-states'
import { useToast } from '@/components/toast-context'
import { Button, ConfirmDialog, Modal, PageState, SearchField, Spinner, TextField } from '@/components/ui'
import { bandSchema, type BandValues } from '@/features/bands/schemas'
import { bandsService, queryKeys, tracksService } from '@/lib/services'
import { getErrorMessage } from '@/lib/utils'
import type { Band } from '@/types/api'

type Sort = 'name' | 'year'

export function BandsPage() {
  const queryClient = useQueryClient()
  const { notify } = useToast()
  const bands = useQuery({ queryKey: queryKeys.bands, queryFn: bandsService.list })
  const tracks = useQuery({ queryKey: queryKeys.tracks, queryFn: tracksService.list })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('name')
  const [editing, setEditing] = useState<Band | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Band | null>(null)

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...(bands.data || [])]
      .filter((band) => band.name.toLowerCase().includes(query) || String(band.formatYear).includes(query))
      .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : b.formatYear - a.formatYear)
  }, [bands.data, search, sort])

  const remove = useMutation({
    mutationFn: (id: string) => bandsService.remove(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.bands }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tracks }),
      ])
      setDeleting(null)
      notify('Band and related tracks deleted')
    },
    onError: (error) => notify(getErrorMessage(error), 'error'),
  })

  if (bands.isLoading || tracks.isLoading) return <LoadingPanel label="Loading bands" />
  if (bands.error || tracks.error) return <ErrorPanel error={bands.error || tracks.error} retry={() => { void bands.refetch(); void tracks.refetch() }} />

  const trackCounts = new Map<string, number>()
  for (const track of tracks.data || []) trackCounts.set(track.bandId, (trackCounts.get(track.bandId) || 0) + 1)

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (band: Band) => { setEditing(band); setFormOpen(true) }

  return (
    <div className="page-stack">
      <div className="toolbar">
        <SearchField value={search} onChange={setSearch} placeholder="Search bands or years…" />
        <div className="toolbar-actions">
          <Button variant="secondary" onClick={() => setSort((value) => value === 'name' ? 'year' : 'name')}><ArrowUpDown size={16} /> Sort: {sort === 'name' ? 'Name' : 'Newest'}</Button>
          <Button onClick={openCreate}><Plus size={17} /> Add band</Button>
        </div>
      </div>

      {!bands.data?.length ? (
        <PageState title="Build your artist roster" description="Add the first band to your catalog, then start assigning tracks." action={<Button onClick={openCreate}><Plus size={17} /> Add your first band</Button>} />
      ) : (
        <section className="table-card">
          <div className="table-meta"><div><strong>{rows.length} {rows.length === 1 ? 'band' : 'bands'}</strong><span>{search ? ' matching your search' : ' in your catalog'}</span></div></div>
          {rows.length ? <div className="table-scroll"><table><thead><tr><th>Band</th><th>Foundation year</th><th>Tracks</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {rows.map((band) => <tr key={band.id}><td><div className="entity-cell"><span className="entity-avatar"><UsersRound size={17} /></span><div><strong>{band.name}</strong><span>Band</span></div></div></td><td><span className="year-badge">{band.formatYear}</span></td><td>{trackCounts.get(band.id) || 0} tracks</td><td><div className="row-actions"><Button variant="ghost" size="icon" onClick={() => openEdit(band)} aria-label={`Edit ${band.name}`}><Pencil size={16} /></Button><Button variant="ghost" size="icon" className="danger-icon" onClick={() => setDeleting(band)} aria-label={`Delete ${band.name}`}><Trash2 size={16} /></Button></div></td></tr>)}
          </tbody></table></div> : <PageState title="No matching bands" description="Try a different band name or foundation year." />}
        </section>
      )}

      <BandForm open={formOpen} onOpenChange={setFormOpen} band={editing} />
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title={`Delete ${deleting?.name || 'band'}?`} description={`This permanently deletes the band and its ${trackCounts.get(deleting?.id || '') || 0} related tracks. This action cannot be undone.`} onConfirm={() => deleting && remove.mutate(deleting.id)} pending={remove.isPending} />
    </div>
  )
}

function BandForm({ open, onOpenChange, band }: { open: boolean; onOpenChange: (open: boolean) => void; band: Band | null }) {
  const queryClient = useQueryClient()
  const { notify } = useToast()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BandValues>({
    resolver: zodResolver(bandSchema),
    values: { name: band?.name || '', formatYear: band?.formatYear || new Date().getFullYear() },
  })

  const close = () => { onOpenChange(false); setApiError(''); reset() }
  const submit = handleSubmit(async (values) => {
    setApiError('')
    try {
      if (band) await bandsService.update(band.id, values)
      else await bandsService.create(values)
      await queryClient.invalidateQueries({ queryKey: queryKeys.bands })
      notify(band ? 'Band updated' : 'Band added to the catalog')
      close()
    } catch (error) { setApiError(getErrorMessage(error)) }
  })

  return <Modal open={open} onOpenChange={(value) => value ? onOpenChange(true) : close()} title={band ? 'Edit band' : 'Add a new band'} description={band ? 'Update this artist’s catalog details.' : 'Create an artist before assigning tracks.'}>
    <form className="dialog-form" onSubmit={submit} noValidate>
      {apiError && <div className="form-alert" role="alert">{apiError}</div>}
      <TextField label="Band name" placeholder="e.g. Radiohead" autoFocus error={errors.name?.message} {...register('name')} />
      <TextField label="Foundation year" type="number" min="1" max={new Date().getFullYear()} error={errors.formatYear?.message} {...register('formatYear')} />
      <div className="dialog-actions"><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Spinner />}{band ? 'Save changes' : 'Add band'}</Button></div>
    </form>
  </Modal>
}
