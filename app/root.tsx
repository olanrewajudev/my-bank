import {isRouteErrorResponse,Links,Meta,Outlet,Scripts,ScrollRestoration,} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import {ColorSchemeScript,MantineProvider,createTheme,mantineHtmlProps} from '@mantine/core';

import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import { store } from "./lib/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  fontFamily: 'Nunito Sans',
  headings: {
    fontFamily: 'Nunito Sans',
  },
});

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap",
  },
  
  {
    rel: "shortcut icon",
    href: `/images/logo.png`,
    type: "image/x-icon",
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>

      <body className="scrolls">
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <Provider store={store}>
              {children}
            </Provider>
          </MantineProvider>
        </QueryClientProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}