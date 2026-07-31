import { FaGithub,FaGlobe } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 bg-surface/30 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <p className="text-sm text-on-surface-variant">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-on-surface">
            Harsh Raj Minj
          </span>
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://harshrajminj.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <FaGlobe  size={16} />
            Portfolio
          </a>

          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant transition-colors hover:text-primary flex items-center gap-2"
          >
            <FaGithub size={16} />
             Github
          </a>
        </div>
      </div>
    </footer>
  );
}