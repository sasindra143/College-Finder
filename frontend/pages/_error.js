function Error({ statusCode }) {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' }}>
      <h1>{statusCode ? `${statusCode} - Error` : 'An error occurred on client'}</h1>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Go back home</a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
