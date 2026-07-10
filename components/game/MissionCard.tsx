import { Card } from "@/components/ui/Card";
import { Chip, StickerTag, type ChipVariant } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";

export type MissionCardProps = {
  title: string;
  role: string;
  level: number;
  objective: string;
  deadlineLabel: string;
  percent: number;
  tags: { label: string; variant?: ChipVariant }[];
  isNew?: boolean;
};

export function MissionCard({
  title,
  role,
  level,
  objective,
  deadlineLabel,
  percent,
  tags,
  isNew,
}: MissionCardProps) {
  return (
    <Card animate>
      {isNew && <StickerTag>BARU!</StickerTag>}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div>
          <h4 className="font-display text-title-sm text-ink">{title}</h4>
          <Chip variant="earth" className="mt-1">
            {role} · Lv {level}
          </Chip>
        </div>
        <Chip variant="warning">{deadlineLabel}</Chip>
      </div>
      <p className="font-body text-caption text-ink-soft mb-3">{objective}</p>
      <ProgressBar percent={percent} className="mb-3" />
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Chip key={t.label} variant={t.variant ?? "neutral"}>
            {t.label}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
