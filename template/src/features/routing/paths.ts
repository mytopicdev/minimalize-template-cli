export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]

// Para rutas con params (patrón a seguir cuando existan):
// export const userDetailPath = (id: string) => `/users/${id}` as const
