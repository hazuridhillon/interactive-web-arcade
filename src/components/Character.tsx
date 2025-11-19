interface CharacterProps {
  position: { x: number; y: number };
  isMoving: boolean;
}

export const Character = ({ position, isMoving }: CharacterProps) => {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={`relative ${isMoving ? "animate-bounce-subtle" : ""}`}>
        {/* Main blob */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary-glow to-secondary glow-soft transition-all duration-300" />
        
        {/* Eyes */}
        <div className="absolute top-4 left-2.5 w-1.5 h-2 bg-foreground/80 rounded-full" />
        <div className="absolute top-4 right-2.5 w-1.5 h-2 bg-foreground/80 rounded-full" />
        
        {/* Blush */}
        <div className="absolute top-5 left-1 w-2 h-1.5 bg-primary/50 rounded-full blur-sm" />
        <div className="absolute top-5 right-1 w-2 h-1.5 bg-primary/50 rounded-full blur-sm" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-glow-pulse" />
      </div>
    </div>
  );
};
