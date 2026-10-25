import { getTagColor } from "@/lib/chant/tagColors";

export default function TagChip({
  tag,
  allTags,
  active = false,
  onClick,
  size = "sm",
}: {
  tag: string;
  allTags: string[];
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const color = getTagColor(tag, allTags);
  const style = active
    ? { backgroundColor: color.solid, borderColor: color.solid, color: "#fff" }
    : { backgroundColor: color.soft, borderColor: color.border, color: color.solid };
  const className = `rounded-full border ${size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className} style={style}>
        {tag}
      </button>
    );
  }
  return (
    <span className={className} style={style}>
      {tag}
    </span>
  );
}