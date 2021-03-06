import React from 'react';
import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import { match } from 'ts-pattern';
import { Error401, Error404, Error500s } from './components/Error';
import styles from './styles/global.css';
import libraryStyles from './styles/library.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: libraryStyles },
];

export const meta: MetaFunction = () => ({
  title: 'freeCodeCamp Dallas',
  description: 'Learn to code with learners in Dallas',
});

const Document: React.FC<{ title?: string }> = ({ title, children }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      {title ? <title>{title}</title> : null}
      <Meta />
      <Links />
    </head>
    <body>
      <React.StrictMode>{children}</React.StrictMode>
      <ScrollRestoration />
      <Scripts />
      {process.env.NODE_ENV === 'development' && <LiveReload />}
    </body>
  </html>
);

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Error500s />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      {match(caught.status)
        .with(401, () => <Error401 />)
        .with(404, () => <Error404 />)
        .otherwise(() => {
          throw new Error(caught.data || caught.statusText);
        })}
    </Document>
  );
}

const App = () => (
  <Document>
    <Outlet />
  </Document>
);

export default App;
