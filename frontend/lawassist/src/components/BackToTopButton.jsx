import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  return (
    <button
      className="floating-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={22} />
    </button>
  );
}
