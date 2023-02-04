import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html className="dark">
      <Head>
        <meta
          content="My NextJS Template"
          name="description"
        />
        <link
          href="/favicon.ico"
          rel="icon"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
