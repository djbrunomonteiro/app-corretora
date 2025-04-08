import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
    {
      path: '', // This renders the "/" route on the client (CSR)
      renderMode: RenderMode.Client,
    },
    {
      path: '**', // All other routes will be rendered on the server (SSR)
      renderMode: RenderMode.Server,
    },
  ];