interface IconProps {
  name: string;
  className?: string;
}

const icons: Record<string, string> = {
  dashboard: "▦",
  projects: "▣",
  users: "👥",
  database: "◎",
  bot: "🤖",
  settings: "⚙",
  building: "▰",
  check: "✓",
  chart: "▥",
  money: "$",
  clock: "◷",
  edit: "✎",
  plus: "+",
  search: "⌕",
  shield: "◆",
  trash: "×",
  message: "💬",
  zap: "⚡",
  arrow: "›",
};

export function Icon({ name, className = "h-5 w-5" }: IconProps) {
  return (
    <span className={`${className} inline-flex shrink-0 items-center justify-center font-bold leading-none`} aria-hidden="true">
      {icons[name] || "•"}
    </span>
  );
}
