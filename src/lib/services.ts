import { apiRequest } from '@/lib/api'
import type {
  AuthResponse,
  Band,
  BandInput,
  BandUpdate,
  LoginInput,
  RegisterInput,
  Track,
  TrackInput,
  TrackUpdate,
  User,
} from '@/types/api'

const json = (value: unknown) => JSON.stringify(value)

export const authService = {
  login: (input: LoginInput) =>
    apiRequest<AuthResponse>('/auth', { method: 'POST', body: json(input) }),
  register: (input: RegisterInput) =>
    apiRequest<User>('/users', { method: 'POST', body: json(input) }),
}

export const bandsService = {
  list: () => apiRequest<Band[]>('/bands'),
  create: (input: BandInput) =>
    apiRequest<Band>('/bands', { method: 'POST', body: json(input) }),
  update: (id: string, input: BandUpdate) =>
    apiRequest<Band>(`/bands/${id}`, { method: 'PATCH', body: json(input) }),
  remove: (id: string) =>
    apiRequest<void>(`/bands/${id}`, { method: 'DELETE' }),
}

export const tracksService = {
  list: () => apiRequest<Track[]>('/tracks'),
  create: (input: TrackInput) =>
    apiRequest<Track>('/tracks', { method: 'POST', body: json(input) }),
  update: (id: string, input: TrackUpdate) =>
    apiRequest<Track>(`/tracks/${id}`, { method: 'PATCH', body: json(input) }),
  remove: (id: string) =>
    apiRequest<void>(`/tracks/${id}`, { method: 'DELETE' }),
}

export const queryKeys = {
  bands: ['bands'] as const,
  tracks: ['tracks'] as const,
}
