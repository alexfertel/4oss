export default function Footer() {
  return (
    <footer className="flex items-center justify-center text-center h-10 text-zinc-600">
      <a
        className="inline-block hover:underline"
        href="https://urlbox.com/screenshot-api"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by <span className="font-mono">Urlbox</span>
      </a>
      <span className="select-none">&thinsp;•&thinsp;</span>
      <a
        href="https://alexfertel.me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:underline transition-all duration-200"
      >
        Made by <span className="font-mono">alexfertel</span>
      </a>
    </footer>
  );
}
