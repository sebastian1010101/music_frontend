import { useQuery } from '@tanstack/react-query'
import { Clock3, Disc3, Music2, UsersRound } from 'lucide-react'
import { ErrorPanel, LoadingPanel } from '@/components/data-states'
import { bandsService, queryKeys, tracksService } from '@/lib/services'
import { formatDuration } from '@/lib/utils'

export function DashboardPage() {
  const bands = useQuery({
    queryKey: queryKeys.bands,
    queryFn: bandsService.list,
  })
  const tracks = useQuery({
    queryKey: queryKeys.tracks,
    queryFn: tracksService.list,
  })

  if (bands.isLoading || tracks.isLoading)
    return <LoadingPanel label="Preparing your overview" />
  if (bands.error || tracks.error) {
    return (
      <ErrorPanel
        error={bands.error || tracks.error}
        retry={() => {
          void bands.refetch()
          void tracks.refetch()
        }}
      />
    )
  }

  const bandList = bands.data || []
  const trackList = tracks.data || []
  const totalDuration = trackList.reduce(
    (total, track) => total + track.length,
    0,
  )
  const average = bandList.length
    ? (trackList.length / bandList.length).toFixed(1)
    : '0.0'
  const newestBands = [...bandList]
    .sort((a, b) => b.formatYear - a.formatYear)
    .slice(0, 4)
  const longestTracks = [...trackList]
    .sort((a, b) => b.length - a.length)
    .slice(0, 4)
  const bandNames = new Map(bandList.map((band) => [band.id, band.name]))

  return (
    <div className="page-stack">
      <section className="metrics-grid" aria-label="Catalog metrics">
        <MetricCard
          label="Total bands"
          value={bandList.length.toString()}
          note="Artists in the catalog"
          icon={<UsersRound />}
          tone="brand"
        />
        <MetricCard
          label="Total tracks"
          value={trackList.length.toString()}
          note="Songs ready to organize"
          icon={<Music2 />}
          tone="violet"
        />
        <MetricCard
          label="Catalog duration"
          value={formatDuration(totalDuration)}
          note="Combined listening time"
          icon={<Clock3 />}
          tone="amber"
        />
        <MetricCard
          label="Tracks per band"
          value={average}
          note="Catalog-wide average"
          icon={<Disc3 />}
          tone="green"
        />
      </section>

      <section className="overview-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Newest formations</h2>
              <p>Bands ordered by foundation year</p>
            </div>
            <span className="panel-count">{bandList.length} total</span>
          </div>
          {newestBands.length ? (
            <div className="summary-list">
              {newestBands.map((band) => (
                <div className="summary-row" key={band.id}>
                  <div className="summary-avatar">
                    {band.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <strong>{band.name}</strong>
                    <span>Founded in {band.formatYear}</span>
                  </div>
                  <span className="year-badge">{band.formatYear}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptySummary text="Add your first band to see it here." />
          )}
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Longest tracks</h2>
              <p>Tracks with the greatest duration</p>
            </div>
            <span className="panel-count">{trackList.length} total</span>
          </div>
          {longestTracks.length ? (
            <div className="summary-list">
              {longestTracks.map((track, index) => (
                <div className="summary-row" key={track.id}>
                  <div className="track-index">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <strong>{track.title}</strong>
                    <span>{bandNames.get(track.bandId) || 'Unknown band'}</span>
                  </div>
                  <span className="duration-badge">
                    {formatDuration(track.length)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptySummary text="Add your first track to see it here." />
          )}
        </article>
      </section>
      <div className="catalog-note">
        <Disc3 size={18} />
        <div>
          <strong>About these metrics</strong>
          <span>
            Statistics are calculated from your current bands and tracks. They
            update automatically as your catalog changes.
          </span>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string
  value: string
  note: string
  icon: React.ReactNode
  tone: string
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-${tone}`}>{icon}</div>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <span className="metric-note">{note}</span>
    </article>
  )
}

function EmptySummary({ text }: { text: string }) {
  return (
    <div className="summary-empty">
      <Music2 size={22} />
      <span>{text}</span>
    </div>
  )
}
