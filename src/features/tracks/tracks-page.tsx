import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowUpDown, Clock3, Music2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorPanel, LoadingPanel } from '@/components/data-states'
import { useToast } from '@/components/toast-context'
import { Button, ConfirmDialog, Modal, PageState, SearchField, SelectField, Spinner, TextField } from '@/components/ui'
import { trackSchema, type TrackValues } from '@/features/tracks/schemas'
import { bandsService, queryKeys, tracksService } from '@/lib/services'
import { formatDuration, getErrorMessage } from '@/lib/utils'
import type { Band, Track } from '@/types/api'

type Sort = 'title' | 'duration'

export function TracksPage() {
  const queryClient = useQueryClient()
  const { notify } = useToast()
  const tracks = useQuery({ queryKey: queryKeys.tracks, queryFn: tracksService.list })
  const bands = useQuery({ queryKey: queryKeys.bands, queryFn: bandsService.list })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Sort>('title')
  const [editing, setEditing] = useState<Track | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Track | null>(null)

  const bandNames = useMemo(() => new Map((bands.data || []).map((band) => [band.id, band.name])), [bands.data])
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...(tracks.data || [])]
      .filter((track) => track.title.toLowerCase().includes(query) || (bandNames.get(track.bandId) || '').toLowerCase().includes(query))
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : b.length - a.length)
  }, [tracks.data, bandNames, search, sort])

  const remove = useMutation({
    mutationFn: (id: string) => tracksService.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tracks })
      setDeleting(null)
      notify('Track deleted')
    },
    onError: (error) => notify(getErrorMessage(error), 'error'),
  })

  if (tracks.isLoading || bands.isLoading) return <LoadingPanel label="Loading tracks" />
  if (tracks.error || bands.error) return <ErrorPanel error={tracks.error || bands.error} retry={() => { void tracks.refetch(); void bands.refetch() }} />

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (track: Track) => { setEditing(track); setFormOpen(true) }
  const hasBands = Boolean(bands.data?.length)

  return (
    <div className="page-stack">
      <div className="toolbar">
        <SearchField value={search} onChange={setSearch} placeholder="Search tracks or bands…" />
        <div className="toolbar-actions">
          <Button variant="secondary" onClick={() => setSort((value) => value === 'title' ? 'duration' : 'title')}><ArrowUpDown size={16} /> Sort: {sort === 'title' ? 'Title' : 'Duration'}</Button>
          <Button onClick={openCreate} disabled={!hasBands} title={!hasBands ? 'Add a band first' : undefined}><Plus size={17} /> Add track</Button>
        </div>
      </div>

      {!hasBands ? (
        <PageState title="Add a band first" description="Every track belongs to a band. Create one from the Bands page before adding tracks." action={<a href="/bands" className="button button-primary button-md">Go to bands</a>} />
      ) : !tracks.data?.length ? (
        <PageState title="Your track list is quiet" description="Add the first song and connect it to an artist in your catalog." action={<Button onClick={openCreate}><Plus size={17} /> Add your first track</Button>} />
      ) : (
        <section className="table-card">
          <div className="table-meta"><div><strong>{rows.length} {rows.length === 1 ? 'track' : 'tracks'}</strong><span>{search ? ' matching your search' : ' in your catalog'}</span></div></div>
          {rows.length ? <div className="table-scroll"><table><thead><tr><th>Track</th><th>Band</th><th>Duration</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {rows.map((track) => <tr key={track.id}><td><div className="entity-cell"><span className="entity-avatar track-avatar"><Music2 size={17} /></span><div><strong>{track.title}</strong><span>Track</span></div></div></td><td>{bandNames.get(track.bandId) || <span className="muted">Unknown band</span>}</td><td><span className="duration-cell"><Clock3 size={15} />{formatDuration(track.length)}</span></td><td><div className="row-actions"><Button variant="ghost" size="icon" onClick={() => openEdit(track)} aria-label={`Edit ${track.title}`}><Pencil size={16} /></Button><Button variant="ghost" size="icon" className="danger-icon" onClick={() => setDeleting(track)} aria-label={`Delete ${track.title}`}><Trash2 size={16} /></Button></div></td></tr>)}
          </tbody></table></div> : <PageState title="No matching tracks" description="Try a different track or band name." />}
        </section>
      )}

      <TrackForm open={formOpen} onOpenChange={setFormOpen} track={editing} bands={bands.data || []} />
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title={`Delete ${deleting?.title || 'track'}?`} description="This permanently removes the track from the catalog. This action cannot be undone." onConfirm={() => deleting && remove.mutate(deleting.id)} pending={remove.isPending} />
    </div>
  )
}

function TrackForm({ open, onOpenChange, track, bands }: { open: boolean; onOpenChange: (open: boolean) => void; track: Track | null; bands: Band[] }) {
  const queryClient = useQueryClient()
  const { notify } = useToast()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrackValues>({
    resolver: zodResolver(trackSchema),
    values: { title: track?.title || '', length: track?.length || 180, bandId: track?.bandId || bands[0]?.id || '' },
  })

  const close = () => { onOpenChange(false); setApiError(''); reset() }
  const submit = handleSubmit(async (values) => {
    setApiError('')
    try {
      if (track) await tracksService.update(track.id, values)
      else await tracksService.create(values)
      await queryClient.invalidateQueries({ queryKey: queryKeys.tracks })
      notify(track ? 'Track updated' : 'Track added to the catalog')
      close()
    } catch (error) { setApiError(getErrorMessage(error)) }
  })

  return <Modal open={open} onOpenChange={(value) => value ? onOpenChange(true) : close()} title={track ? 'Edit track' : 'Add a new track'} description="Keep the title, duration, and artist connection accurate.">
    <form className="dialog-form" onSubmit={submit} noValidate>
      {apiError && <div className="form-alert" role="alert">{apiError}</div>}
      <TextField label="Track title" placeholder="e.g. Everything in Its Right Place" autoFocus error={errors.title?.message} {...register('title')} />
      <SelectField label="Band" error={errors.bandId?.message} {...register('bandId')}>{bands.map((band) => <option key={band.id} value={band.id}>{band.name}</option>)}</SelectField>
      <TextField label="Duration in seconds" type="number" min="1" hint="For example, 245 equals 4:05" error={errors.length?.message} {...register('length')} />
      <div className="dialog-actions"><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Spinner />}{track ? 'Save changes' : 'Add track'}</Button></div>
    </form>
  </Modal>
}
