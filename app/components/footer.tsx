export default function Footer() {
  return (
    <footer className="flex items-center justify-center text-center h-10 text-zinc-600">
      <p>
        Powered by{" "}
        <a
          className="inline-block hover:underline text-zinc-900"
          href="https://urlbox.com/screenshot-api"
          target="_blank"
          rel="noopener noreferrer"
        >
          Urlbox
        </a>
      </p>
      <span className="select-none">&thinsp;•&thinsp;</span>
      <p>
        Made by{" "}
        <a
          href="https://alexfertel.me"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:underline transition-all duration-200 text-zinc-900"
        >
          alexfertel
        </a>
      </p>
    </footer>
  );
}
