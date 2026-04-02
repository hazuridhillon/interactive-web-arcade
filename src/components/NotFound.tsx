const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center y2k-lavender-bg">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold" style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }}>404</h1>
      <p className="mb-4 text-xl" style={{ color: '#1a1040' }}>Oops! Page not found</p>
      <a href="/" className="underline hover:opacity-80" style={{ color: '#ff0098', fontFamily: "'Bungee', cursive" }}>
        Return to Home
      </a>
    </div>
  </div>
);

export default NotFound;
