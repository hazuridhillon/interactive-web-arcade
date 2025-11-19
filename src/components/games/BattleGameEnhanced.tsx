import React, { useState, useEffect } from 'react';
import { X, Sword, Shield, Star, Heart, Zap, Sparkles, Leaf, Droplet, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DifficultySelector } from '@/components/DifficultySelector';

interface BattleGameProps {
  onClose: () => void;
}

type Action = 'quick' | 'power' | 'defend' | 'special';
type Element = 'nature' | 'water' | 'fire';

const ELEMENTS = {
  nature: { icon: Leaf, color: '#C9D5B5', name: 'Nature' },
  water: { icon: Droplet, color: '#7EC8E3', name: 'Water' },
  fire: { icon: Flame, color: '#FF6B6B', name: 'Fire' },
};

export const BattleGame = ({ onClose }: BattleGameProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [playerElement, setPlayerElement] = useState<Element | null>(null);
  const [opponentElement, setOpponentElement] = useState<Element | null>(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [maxPlayerHP, setMaxPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [maxOpponentHP, setMaxOpponentHP] = useState(100);
  const [playerDefending, setPlayerDefending] = useState(false);
  const [opponentDefending, setOpponentDefending] = useState(false);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState("Choose your element to begin!");
  const [gameOver, setGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState(false);
  const [animatingOpponent, setAnimatingOpponent] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [damageNumber, setDamageNumber] = useState<{value: number, x: number} | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);

  useEffect(() => {
    if (playerHP <= 0) {
      setGameOver(true);
      setPlayerWon(false);
      setMessage("You've been defeated... But you fought valiantly! 🌸");
    } else if (opponentHP <= 0) {
      setGameOver(true);
      setPlayerWon(true);
      setMessage("Victory! You protected the enchanted forest! 🌟👑");
    }
  }, [playerHP, opponentHP]);

  useEffect(() => {
    if (specialCooldown > 0 && isPlayerTurn) {
      // Countdown cooldown on player's turn start
    }
  }, [isPlayerTurn]);

  const handleDifficultySelect = (diff: 'easy' | 'medium' | 'hard') => {
    if (diff === 'easy') {
      setMaxPlayerHP(120);
      setPlayerHP(120);
      setMaxOpponentHP(80);
      setOpponentHP(80);
    } else if (diff === 'medium') {
      setMaxPlayerHP(100);
      setPlayerHP(100);
      setMaxOpponentHP(100);
      setOpponentHP(100);
    } else {
      setMaxPlayerHP(80);
      setPlayerHP(80);
      setMaxOpponentHP(120);
      setOpponentHP(120);
    }
    setDifficulty(diff);
  };

  const handleElementSelect = (element: Element) => {
    setPlayerElement(element);
    const elements: Element[] = ['nature', 'water', 'fire'];
    const randomOpponent = elements[Math.floor(Math.random() * elements.length)];
    setOpponentElement(randomOpponent);
    setMessage("Battle begins! Choose your action.");
    addToLog(`You chose ${ELEMENTS[element].name}! Opponent chose ${ELEMENTS[randomOpponent].name}!`);
  };

  const getElementAdvantage = (attacker: Element, defender: Element): number => {
    // Nature > Water > Fire > Nature
    if (attacker === 'nature' && defender === 'water') return 10;
    if (attacker === 'water' && defender === 'fire') return 10;
    if (attacker === 'fire' && defender === 'nature') return 10;
    if (attacker === 'water' && defender === 'nature') return -5;
    if (attacker === 'fire' && defender === 'water') return -5;
    if (attacker === 'nature' && defender === 'fire') return -5;
    return 0;
  };

  const addToLog = (msg: string) => {
    setActionLog(prev => [...prev.slice(-4), msg]);
  };

  const handlePlayerAction = (action: Action) => {
    if (!isPlayerTurn || gameOver || !playerElement || !opponentElement) return;

    setIsPlayerTurn(false);
    let damage = 0;
    const damageMultiplier = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 1.2 : 1;

    if (action === 'quick') {
      damage = Math.floor((10 + Math.floor(Math.random() * 6)) * damageMultiplier);
      damage += getElementAdvantage(playerElement, opponentElement);
      
      setAnimatingPlayer(true);
      setScreenShake(true);
      setTimeout(() => {
        setAnimatingPlayer(false);
        setScreenShake(false);
      }, 500);
      
      if (opponentDefending) {
        damage = Math.floor(damage * 0.4);
        setMessage(`Quick attack! Opponent blocks. Dealt ${damage} damage! ⚔️`);
      } else {
        setMessage(`Quick attack! Swift strike! Dealt ${damage} damage! 💥`);
      }
      showDamageNumber(damage, false);
      setOpponentHP(prev => Math.max(0, prev - damage));
      addToLog(`You dealt ${damage} damage with Quick Attack`);
    } else if (action === 'power') {
      const hitChance = Math.random();
      if (hitChance > 0.2) {
        damage = Math.floor((20 + Math.floor(Math.random() * 11)) * damageMultiplier);
        damage += getElementAdvantage(playerElement, opponentElement);
        
        setAnimatingPlayer(true);
        setScreenShake(true);
        setTimeout(() => {
          setAnimatingPlayer(false);
          setScreenShake(false);
        }, 600);
        
        if (opponentDefending) {
          damage = Math.floor(damage * 0.4);
          setMessage(`Power attack! Opponent blocks most of it. Dealt ${damage} damage! ⚔️`);
        } else {
          setMessage(`Power attack! Crushing blow! Dealt ${damage} damage! 💥💥`);
        }
        showDamageNumber(damage, false);
        setOpponentHP(prev => Math.max(0, prev - damage));
        addToLog(`You dealt ${damage} damage with Power Attack`);
      } else {
        setMessage("Power attack missed! Too slow! 💨");
        addToLog("Power Attack missed!");
      }
    } else if (action === 'defend') {
      setPlayerDefending(true);
      const heal = 5;
      setPlayerHP(prev => Math.min(maxPlayerHP, prev + heal));
      setMessage("You raise your shield and recover! +5 HP 🛡️");
      addToLog("You defend and recover 5 HP");
    } else if (action === 'special') {
      if (specialCooldown > 0) return;
      
      damage = Math.floor((35 + Math.floor(Math.random() * 11)) * damageMultiplier);
      damage += getElementAdvantage(playerElement, opponentElement);
      
      setAnimatingPlayer(true);
      setScreenShake(true);
      setTimeout(() => {
        setAnimatingPlayer(false);
        setScreenShake(false);
      }, 700);
      setSpecialCooldown(3);
      
      if (opponentDefending) {
        damage = Math.floor(damage * 0.4);
        setMessage(`SPECIAL MOVE! Opponent barely blocks it! Dealt ${damage} damage! ✨⚡`);
      } else {
        setMessage(`SPECIAL MOVE! Devastating attack! Dealt ${damage} damage! ⭐💫`);
      }
      showDamageNumber(damage, false);
      setOpponentHP(prev => Math.max(0, prev - damage));
      addToLog(`You dealt ${damage} damage with Special Attack!`);
    }

    setTimeout(() => {
      if (opponentHP - damage > 0 && playerHP > 0) {
        opponentTurn();
      }
    }, 2000);
  };

  const showDamageNumber = (damage: number, isOpponent: boolean) => {
    setDamageNumber({ value: damage, x: isOpponent ? -100 : 100 });
    setTimeout(() => setDamageNumber(null), 1000);
  };

  const opponentTurn = () => {
    setPlayerDefending(false);
    if (specialCooldown > 0) {
      setSpecialCooldown(prev => prev - 1);
    }
    
    let opponentAction: Action;
    
    // Smart AI based on difficulty
    if (difficulty === 'hard') {
      if (opponentHP < maxOpponentHP * 0.3) {
        opponentAction = Math.random() < 0.7 ? 'defend' : 'special';
      } else if (opponentHP > maxOpponentHP * 0.7) {
        opponentAction = Math.random() < 0.6 ? 'power' : 'quick';
      } else if (playerDefending) {
        opponentAction = Math.random() < 0.8 ? 'power' : 'special';
      } else {
        const actions: Action[] = ['quick', 'quick', 'power', 'special', 'defend'];
        opponentAction = actions[Math.floor(Math.random() * actions.length)];
      }
    } else {
      if (opponentHP < maxOpponentHP * 0.3) {
        opponentAction = Math.random() < 0.5 ? 'defend' : 'quick';
      } else {
        const actions: Action[] = ['quick', 'power', 'defend', 'special'];
        opponentAction = actions[Math.floor(Math.random() * actions.length)];
      }
    }
    
    let damage = 0;
    const damageMultiplier = difficulty === 'hard' ? 1.2 : difficulty === 'easy' ? 0.8 : 1;

    if (opponentAction === 'quick') {
      damage = Math.floor((10 + Math.floor(Math.random() * 6)) * damageMultiplier);
      if (opponentElement && playerElement) {
        damage += getElementAdvantage(opponentElement, playerElement);
      }
      
      setAnimatingOpponent(true);
      setScreenShake(true);
      setTimeout(() => {
        setAnimatingOpponent(false);
        setScreenShake(false);
      }, 500);
      
      if (playerDefending) {
        damage = Math.floor(damage * 0.4);
        setMessage(`Opponent's quick attack! You block it! Took ${damage} damage! 🛡️`);
      } else {
        setMessage(`Opponent's quick attack! Took ${damage} damage! 💢`);
      }
      showDamageNumber(damage, true);
      setPlayerHP(prev => Math.max(0, prev - damage));
      addToLog(`Opponent dealt ${damage} damage`);
    } else if (opponentAction === 'power') {
      const hitChance = Math.random();
      if (hitChance > 0.2) {
        damage = Math.floor((20 + Math.floor(Math.random() * 11)) * damageMultiplier);
        if (opponentElement && playerElement) {
          damage += getElementAdvantage(opponentElement, playerElement);
        }
        
        setAnimatingOpponent(true);
        setScreenShake(true);
        setTimeout(() => {
          setAnimatingOpponent(false);
          setScreenShake(false);
        }, 600);
        
        if (playerDefending) {
          damage = Math.floor(damage * 0.4);
          setMessage(`Opponent's power attack! You block most of it! Took ${damage} damage! 🛡️`);
        } else {
          setMessage(`Opponent's power attack! Heavy hit! Took ${damage} damage! 💢💢`);
        }
        showDamageNumber(damage, true);
        setPlayerHP(prev => Math.max(0, prev - damage));
        addToLog(`Opponent dealt ${damage} damage with Power Attack`);
      } else {
        setMessage("Opponent's power attack missed! You dodged it! ✨");
        addToLog("Opponent's Power Attack missed!");
      }
    } else if (opponentAction === 'defend') {
      setOpponentDefending(true);
      const heal = 5;
      setOpponentHP(prev => Math.min(maxOpponentHP, prev + heal));
      setMessage("Opponent defends and recovers! +5 HP 🛡️");
      addToLog("Opponent defends");
    } else if (opponentAction === 'special') {
      damage = Math.floor((35 + Math.floor(Math.random() * 11)) * damageMultiplier);
      if (opponentElement && playerElement) {
        damage += getElementAdvantage(opponentElement, playerElement);
      }
      
      setAnimatingOpponent(true);
      setScreenShake(true);
      setTimeout(() => {
        setAnimatingOpponent(false);
        setScreenShake(false);
      }, 700);
      
      if (playerDefending) {
        damage = Math.floor(damage * 0.4);
        setMessage(`Opponent's SPECIAL! You barely block it! Took ${damage} damage! 🛡️✨`);
      } else {
        setMessage(`Opponent's SPECIAL ATTACK! Massive damage! Took ${damage} damage! 💢⚡`);
      }
      showDamageNumber(damage, true);
      setPlayerHP(prev => Math.max(0, prev - damage));
      addToLog(`Opponent dealt ${damage} damage with Special!`);
    }

    setTimeout(() => {
      setOpponentDefending(false);
      setIsPlayerTurn(true);
      if (!gameOver) {
        setMessage("Your turn! Choose your action.");
      }
    }, 2000);
  };

  const resetGame = () => {
    setPlayerElement(null);
    setOpponentElement(null);
    setPlayerHP(maxPlayerHP);
    setOpponentHP(maxOpponentHP);
    setPlayerDefending(false);
    setOpponentDefending(false);
    setSpecialCooldown(0);
    setIsPlayerTurn(true);
    setMessage("Choose your element to begin!");
    setGameOver(false);
    setPlayerWon(false);
    setActionLog([]);
  };

  const getExpression = (hp: number, maxHp: number) => {
    const percentage = (hp / maxHp) * 100;
    if (percentage > 70) return "^_^";
    if (percentage > 30) return "o_o";
    return "x_x";
  };

  const getHPColor = (hp: number, maxHp: number) => {
    const percentage = (hp / maxHp) * 100;
    if (percentage > 70) return "from-[#C9D5B5] to-[#A8C8A0]";
    if (percentage > 40) return "from-[#FFD700] to-[#FFA500]";
    if (percentage > 20) return "from-[#FFA500] to-[#FF6B00]";
    return "from-[#FF6B6B] to-[#EE5A6F]";
  };

  if (!difficulty) {
    return (
      <DifficultySelector
        onSelect={handleDifficultySelect}
        onCancel={onClose}
        easyDesc="120 HP vs 80 HP, easier opponent"
        mediumDesc="100 HP vs 100 HP, balanced"
        hardDesc="80 HP vs 120 HP, smarter AI"
      />
    );
  }

  if (!playerElement) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#A8C8A0] via-[#C9D5B5] to-[#FFF4F0] overflow-hidden">
        {/* Background forest */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl">🌳</div>
          <div className="absolute top-20 right-20 text-5xl">🌸</div>
          <div className="absolute bottom-20 left-20 text-6xl">🌺</div>
          <div className="absolute bottom-10 right-10 text-5xl">🦋</div>
        </div>

        <div className="glass-effect rounded-3xl p-8 max-w-lg w-full mx-4 glow-soft border-2 border-primary/30">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Choose Your Element
          </h2>
          <p className="text-center text-muted-foreground mb-6">Select your fighting style</p>
          
          <div className="flex flex-col gap-4">
            {(Object.keys(ELEMENTS) as Element[]).map((element) => {
              const ElementIcon = ELEMENTS[element].icon;
              return (
                <Button
                  key={element}
                  onClick={() => handleElementSelect(element)}
                  className="h-auto py-4 px-6 text-foreground border-2 transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${ELEMENTS[element].color}, ${ELEMENTS[element].color}dd)`,
                    borderColor: ELEMENTS[element].color,
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <ElementIcon className="w-6 h-6" />
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg">{ELEMENTS[element].name}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#A8C8A0] via-[#C9D5B5] to-[#FFF4F0] overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
      {/* Enchanted forest background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl">🌳</div>
        <div className="absolute top-20 right-20 text-5xl">🌸</div>
        <div className="absolute bottom-20 left-20 text-6xl">🌺</div>
        <div className="absolute bottom-10 right-10 text-5xl">🦋</div>
        <div className="absolute top-1/2 left-10 text-4xl animate-float-slow">🍃</div>
        <div className="absolute top-1/2 right-10 text-4xl animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>
      </div>

      {/* Swaying flowers */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#A8C8A0]/30 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl mx-4">
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full hover:bg-destructive/20 z-50"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Battle Arena */}
        <div className="glass-effect rounded-3xl p-8 glow-soft border-2 border-white/50">
          <h2 className="text-3xl font-bold text-center mb-6 text-foreground drop-shadow-lg">
            ⚔️ Enchanted Duel ⚔️
          </h2>

          {/* Combatants */}
          <div className="flex justify-between items-center mb-8 gap-8">
            {/* Player */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary-glow to-secondary ${animatingPlayer ? 'animate-attack-forward' : ''} ${playerDefending ? 'ring-4 ring-blue-400' : ''} transition-all duration-300 flex items-center justify-center text-6xl shadow-2xl`}>
                  {getExpression(playerHP, maxPlayerHP)}
                </div>
                {playerElement && (
                  <div className="absolute -top-2 -right-2 p-2 rounded-full glass-effect" style={{ backgroundColor: ELEMENTS[playerElement].color }}>
                    {React.createElement(ELEMENTS[playerElement].icon, { className: 'w-6 h-6 text-white' })}
                  </div>
                )}
                {playerDefending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-20 h-20 text-blue-400 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* HP Bar */}
              <div className="mt-4 w-full max-w-xs mx-auto">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>YOU</span>
                  <span>{playerHP}/{maxPlayerHP}</span>
                </div>
                <div className="h-6 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-500 shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${getHPColor(playerHP, maxPlayerHP)} transition-all duration-500 flex items-center justify-center text-white text-xs font-bold`}
                    style={{ width: `${(playerHP / maxPlayerHP) * 100}%` }}
                  >
                    {playerHP > 0 && '❤️'.repeat(Math.ceil((playerHP / maxPlayerHP) * 5))}
                  </div>
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="text-4xl font-bold text-primary animate-pulse">VS</div>

            {/* Opponent */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-secondary via-accent to-muted ${animatingOpponent ? 'animate-attack-backward' : ''} ${opponentDefending ? 'ring-4 ring-blue-400' : ''} transition-all duration-300 flex items-center justify-center text-6xl shadow-2xl`}>
                  {getExpression(opponentHP, maxOpponentHP)}
                </div>
                {opponentElement && (
                  <div className="absolute -top-2 -left-2 p-2 rounded-full glass-effect" style={{ backgroundColor: ELEMENTS[opponentElement].color }}>
                    {React.createElement(ELEMENTS[opponentElement].icon, { className: 'w-6 h-6 text-white' })}
                  </div>
                )}
                {opponentDefending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-20 h-20 text-blue-400 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* HP Bar */}
              <div className="mt-4 w-full max-w-xs mx-auto">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>OPPONENT</span>
                  <span>{opponentHP}/{maxOpponentHP}</span>
                </div>
                <div className="h-6 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-500 shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${getHPColor(opponentHP, maxOpponentHP)} transition-all duration-500 flex items-center justify-center text-white text-xs font-bold`}
                    style={{ width: `${(opponentHP / maxOpponentHP) * 100}%` }}
                  >
                    {opponentHP > 0 && '❤️'.repeat(Math.ceil((opponentHP / maxOpponentHP) * 5))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Damage number */}
          {damageNumber && (
            <div className={`absolute top-1/3 ${damageNumber.x > 0 ? 'right-1/4' : 'left-1/4'} text-6xl font-bold text-red-500 animate-damage-float drop-shadow-lg z-50`}>
              -{damageNumber.value}
            </div>
          )}

          {/* Message */}
          <div className="glass-effect rounded-2xl p-4 mb-6 text-center border-2 border-primary/30 min-h-[80px] flex items-center justify-center">
            <p className="text-lg font-semibold text-foreground drop-shadow-sm">{message}</p>
          </div>

          {/* Action Buttons */}
          {isPlayerTurn && !gameOver && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Button
                onClick={() => handlePlayerAction('quick')}
                className="h-20 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FFB3C6] to-[#FFC2D1] hover:from-[#FF9FB5] hover:to-[#FFB0C0] text-foreground border-2 border-[#FF8FAB] transition-all hover:scale-105"
              >
                <Sword className="w-6 h-6" />
                <span className="text-xs font-bold">Quick Attack</span>
                <span className="text-xs opacity-80">10-16 dmg</span>
              </Button>
              
              <Button
                onClick={() => handlePlayerAction('power')}
                className="h-20 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FF6B6B] to-[#EE5A6F] hover:from-[#FF5252] hover:to-[#D84860] text-white border-2 border-[#C94560] transition-all hover:scale-105"
              >
                <Sword className="w-6 h-6" />
                <span className="text-xs font-bold">Power Attack</span>
                <span className="text-xs opacity-80">20-31 dmg, 20% miss</span>
              </Button>
              
              <Button
                onClick={() => handlePlayerAction('defend')}
                className="h-20 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#7EC8E3] to-[#5AB9D8] hover:from-[#6DB8D3] hover:to-[#49A8C8] text-white border-2 border-[#3A8FB8] transition-all hover:scale-105"
              >
                <Shield className="w-6 h-6" />
                <span className="text-xs font-bold">Defend</span>
                <span className="text-xs opacity-80">60% block, +5 HP</span>
              </Button>
              
              <Button
                onClick={() => handlePlayerAction('special')}
                disabled={specialCooldown > 0}
                className="h-20 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] text-foreground border-2 border-[#D2691E] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {specialCooldown > 0 ? (
                  <>
                    <Zap className="w-6 h-6 opacity-50" />
                    <span className="text-xs font-bold">Cooldown</span>
                    <span className="text-lg font-bold">{specialCooldown}</span>
                  </>
                ) : (
                  <>
                    <Star className="w-6 h-6" />
                    <span className="text-xs font-bold">Special Move</span>
                    <span className="text-xs opacity-80">35-46 dmg</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Turn indicator */}
          {!gameOver && (
            <div className={`text-center text-xl font-bold mb-4 ${isPlayerTurn ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>
              {isPlayerTurn ? '🌟 YOUR TURN! 🌟' : "Opponent's turn..."}
            </div>
          )}

          {/* Action Log */}
          <div className="glass-effect rounded-2xl p-4 border-2 border-white/30 max-h-32 overflow-y-auto">
            <h3 className="text-sm font-bold mb-2 text-muted-foreground">Battle Log:</h3>
            {actionLog.map((log, i) => (
              <p key={i} className="text-xs text-foreground/80 mb-1">{log}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full mx-4 text-center glow-strong">
            <div className="text-8xl mb-4">{playerWon ? '👑' : '🌸'}</div>
            <h3 className="text-3xl font-bold mb-2 text-foreground">{playerWon ? 'VICTORY!' : 'DEFEATED'}</h3>
            <p className="text-xl mb-6 text-muted-foreground">{message}</p>
            <div className="flex gap-4">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-primary text-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Duel Again
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2"
              >
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
