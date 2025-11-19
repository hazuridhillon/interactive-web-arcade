import { Gamepad2 } from "lucide-react";

interface GameStationProps {
  name: string;
  position: { x: number; y: number };
  color: "primary" | "secondary" | "accent" | "muted";
  isNear: boolean;
}

const colorClasses = {
  primary: "from-primary via-primary-glow to-secondary",
  secondary: "from-secondary via-primary-glow to-primary",
  accent: "from-accent via-muted to-primary",
  muted: "from-muted via-accent to-secondary",
};

export const GameStation = ({ name, position, color, isNear }: GameStationProps) => {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isNear ? 1.1 : 1})`,
      }}
    >
      <div
        className={`relative glass-effect rounded-2xl p-6 transition-all duration-300 ${
          isNear ? "glow-strong" : "glow-soft"
        }`}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[color]} opacity-20 transition-opacity duration-300 ${
            isNear ? "opacity-40" : ""
          }`}
        />
        
        {/* Content */}
        <div className="relative flex flex-col items-center gap-2">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} transition-transform duration-300 ${
              isNear ? "animate-float" : ""
            }`}
          >
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
            {name}
          </p>
        </div>

        {/* Glow ring */}
        {isNear && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[color]} opacity-30 blur-xl animate-glow-pulse`}
          />
        )}
      </div>
    </div>
  );
};
