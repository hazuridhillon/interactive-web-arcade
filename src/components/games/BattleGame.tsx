/**
 * BattleGame.tsx — A turn-based RPG battle.
 * Pick a difficulty, choose an element (nature/water/fire), then trade
 * attacks with an AI opponent using quick, power, defend, or special moves.
 * Elements have rock-paper-scissors advantages.
 */

import { useState, useEffect } from 'react';
import { X, Sword, Shield, Star, Zap, Sparkles, Leaf, Droplet, Flame } from 'lucide-react';
import { DifficultySelector } from '@/components/DifficultySelector';
import { GameOverModal } from '@/components/GameOverModal';

interface BattleGameProps { onClose: () => void; }
type Action = 'quick' | 'power' | 'defend' | 'special';
type Element = 'nature' | 'water' | 'fire';

const ELEMENTS = {
  nature: { icon: Leaf, color: '#69f0ae', shadow: '#4cc08a', name: 'Nature' },
  water: { icon: Droplet, color: '#80e8ff', shadow: '#5cb8cc', name: 'Water' },
  fire: { icon: Flame, color: '#ff8a65', shadow: '#cc6e50', name: 'Fire' },
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
  const [message, setMessage] = useState("Choose your element!");
  const [gameOver, setGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState(false);
  const [animatingOpponent, setAnimatingOpponent] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [damageNumber, setDamageNumber] = useState<{value: number, x: number} | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);

  useEffect(() => {
    if (playerHP <= 0) { setGameOver(true); setPlayerWon(false); setMessage("Defeated... but you fought well!"); }
    else if (opponentHP <= 0) { setGameOver(true); setPlayerWon(true); setMessage("Victory! You win!"); }
  }, [playerHP, opponentHP]);

  const handleDifficultySelect = (diff: 'easy' | 'medium' | 'hard') => {
    if (diff === 'easy') { setMaxPlayerHP(120); setPlayerHP(120); setMaxOpponentHP(80); setOpponentHP(80); }
    else if (diff === 'medium') { setMaxPlayerHP(100); setPlayerHP(100); setMaxOpponentHP(100); setOpponentHP(100); }
    else { setMaxPlayerHP(80); setPlayerHP(80); setMaxOpponentHP(120); setOpponentHP(120); }
    setDifficulty(diff);
  };

  const handleElementSelect = (element: Element) => {
    setPlayerElement(element);
    const rand: Element = (['nature', 'water', 'fire'] as Element[])[Math.floor(Math.random() * 3)];
    setOpponentElement(rand);
    setMessage("Battle begins! Choose your action.");
    addToLog(`You chose ${ELEMENTS[element].name}! Opponent chose ${ELEMENTS[rand].name}!`);
  };

  const getElementAdvantage = (attacker: Element, defender: Element): number => {
    if ((attacker === 'nature' && defender === 'water') || (attacker === 'water' && defender === 'fire') || (attacker === 'fire' && defender === 'nature')) return 10;
    if ((attacker === 'water' && defender === 'nature') || (attacker === 'fire' && defender === 'water') || (attacker === 'nature' && defender === 'fire')) return -5;
    return 0;
  };

  const addToLog = (msg: string) => setActionLog(prev => [...prev.slice(-4), msg]);
  const showDamageNumber = (damage: number, isOpponent: boolean) => {
    setDamageNumber({ value: damage, x: isOpponent ? -100 : 100 });
    setTimeout(() => setDamageNumber(null), 1000);
  };

  /* Shared damage helper — calculates damage, triggers animation, updates HP & log */
  const dealDamage = (
    base: number, range: number, mult: number,
    attackerEl: Element, defenderEl: Element,
    isPlayer: boolean, defending: boolean, label: string, animDuration: number
  ): number => {
    let damage = Math.floor((base + Math.floor(Math.random() * range)) * mult) + getElementAdvantage(attackerEl, defenderEl);
    if (isPlayer) { setAnimatingPlayer(true); setTimeout(() => setAnimatingPlayer(false), animDuration); }
    else { setAnimatingOpponent(true); setTimeout(() => setAnimatingOpponent(false), animDuration); }
    setScreenShake(true); setTimeout(() => setScreenShake(false), animDuration);
    if (defending) { damage = Math.floor(damage * 0.4); setMessage(`${label} blocked! ${damage} dmg`); }
    else { setMessage(`${label}! ${damage} dmg`); }
    showDamageNumber(damage, !isPlayer);
    if (isPlayer) { setOpponentHP(prev => Math.max(0, prev - damage)); addToLog(`You dealt ${damage} (${label})`); }
    else { setPlayerHP(prev => Math.max(0, prev - damage)); addToLog(`Opponent dealt ${damage}`); }
    return damage;
  };

  const handlePlayerAction = (action: Action) => {
    if (!isPlayerTurn || gameOver || !playerElement || !opponentElement) return;
    setIsPlayerTurn(false);
    const mult = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 1.2 : 1;
    let damage = 0;

    if (action === 'quick') {
      damage = dealDamage(10, 6, mult, playerElement, opponentElement, true, opponentDefending, 'Quick', 500);
    } else if (action === 'power') {
      if (Math.random() > 0.2) damage = dealDamage(20, 11, mult, playerElement, opponentElement, true, opponentDefending, 'Power', 600);
      else { setMessage("Power attack missed!"); addToLog("Power missed!"); }
    } else if (action === 'defend') {
      setPlayerDefending(true); setPlayerHP(prev => Math.min(maxPlayerHP, prev + 5));
      setMessage("Defending! +5 HP"); addToLog("You defend +5 HP");
    } else if (action === 'special') {
      if (specialCooldown > 0) return;
      setSpecialCooldown(3);
      damage = dealDamage(35, 11, mult, playerElement, opponentElement, true, opponentDefending, 'SPECIAL', 700);
    }

    setTimeout(() => { if (opponentHP - damage > 0 && playerHP > 0) opponentTurn(); }, 2000);
  };

  const opponentTurn = () => {
    setPlayerDefending(false);
    if (specialCooldown > 0) setSpecialCooldown(prev => prev - 1);

    let opponentAction: Action;
    if (difficulty === 'hard') {
      if (opponentHP < maxOpponentHP * 0.3) opponentAction = Math.random() < 0.7 ? 'defend' : 'special';
      else if (playerDefending) opponentAction = Math.random() < 0.8 ? 'power' : 'special';
      else { const a: Action[] = ['quick', 'quick', 'power', 'special', 'defend']; opponentAction = a[Math.floor(Math.random() * a.length)]; }
    } else {
      if (opponentHP < maxOpponentHP * 0.3) opponentAction = Math.random() < 0.5 ? 'defend' : 'quick';
      else { const a: Action[] = ['quick', 'power', 'defend', 'special']; opponentAction = a[Math.floor(Math.random() * a.length)]; }
    }

    const mult = difficulty === 'hard' ? 1.2 : difficulty === 'easy' ? 0.8 : 1;

    if (opponentAction === 'quick') {
      dealDamage(10, 6, mult, opponentElement!, playerElement!, false, playerDefending, 'Hit', 500);
    } else if (opponentAction === 'power') {
      if (Math.random() > 0.2) dealDamage(20, 11, mult, opponentElement!, playerElement!, false, playerDefending, 'Power hit', 600);
      else { setMessage("Opponent missed!"); addToLog("Opponent missed!"); }
    } else if (opponentAction === 'defend') {
      setOpponentDefending(true); setOpponentHP(prev => Math.min(maxOpponentHP, prev + 5));
      setMessage("Opponent defends +5 HP"); addToLog("Opponent defends");
    } else if (opponentAction === 'special') {
      dealDamage(35, 11, mult, opponentElement!, playerElement!, false, playerDefending, 'SPECIAL', 700);
    }

    setTimeout(() => { setOpponentDefending(false); setIsPlayerTurn(true); if (!gameOver) setMessage("Your turn!"); }, 2000);
  };

  const resetGame = () => {
    setPlayerElement(null); setOpponentElement(null); setPlayerHP(maxPlayerHP); setOpponentHP(maxOpponentHP);
    setPlayerDefending(false); setOpponentDefending(false); setSpecialCooldown(0);
    setIsPlayerTurn(true); setMessage("Choose your element!"); setGameOver(false); setPlayerWon(false); setActionLog([]);
  };

  const getExpression = (hp: number, maxHp: number) => {
    const pct = (hp / maxHp) * 100;
    if (pct > 70) return "^_^"; if (pct > 30) return "o_o"; return "x_x";
  };
  const getHPColor = (hp: number, maxHp: number) => {
    const pct = (hp / maxHp) * 100;
    if (pct > 70) return '#69f0ae'; if (pct > 40) return '#fff176'; if (pct > 20) return '#ff8a65'; return '#ff6fcf';
  };

  if (!difficulty) return <DifficultySelector onSelect={handleDifficultySelect} onCancel={onClose} easyDesc="120 HP vs 80 HP" mediumDesc="100 HP vs 100 HP" hardDesc="80 HP vs 120 HP, smarter AI" />;

  if (!playerElement) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center y2k-lavender-bg">
        <div className="rounded-[22px] p-8 max-w-lg w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc6e50' }}>
          <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-2xl text-center mb-2">Choose Element</h2>
          <p className="text-center text-sm mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>Pick your fighting style</p>
          <div className="flex flex-col gap-3">
            {(Object.keys(ELEMENTS) as Element[]).map(element => {
              const el = ELEMENTS[element]; const ElIcon = el.icon;
              return (
                <button key={element} onClick={() => handleElementSelect(element)}
                  className="flex items-center gap-3 w-full text-left rounded-[16px] p-4 transition-all hover:-translate-y-1"
                  style={{ backgroundColor: el.color, boxShadow: `0 5px 0 0 ${el.shadow}`, color: '#1a1040' }}>
                  <div className="p-2 rounded-xl bg-white/40"><ElIcon className="w-6 h-6" /></div>
                  <span style={{ fontFamily: "'Bungee', cursive" }} className="text-lg">{el.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* Helper to render a combatant (player or opponent) */
  const renderCombatant = (label: string, hp: number, maxHp: number, element: Element | null, isAnimating: boolean, isDefending: boolean, animClass: string, badgePos: string) => (
    <div className="flex-1 text-center">
      <div className="relative inline-block">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl ${isAnimating ? animClass : ''} ${isDefending ? 'ring-4 ring-[#80e8ff]' : ''} transition-all`}
          style={{ backgroundColor: element ? ELEMENTS[element].color : '#f0d6ff', boxShadow: `0 5px 0 0 ${element ? ELEMENTS[element].shadow : '#d8b4fe'}` }}>
          {getExpression(hp, maxHp)}
        </div>
        {element && (
          <div className={`absolute -top-1 ${badgePos} p-1.5 rounded-full`} style={{ backgroundColor: ELEMENTS[element].color, border: '2px solid #fff' }}>
            {(() => { const Icon = ELEMENTS[element].icon; return <Icon className="w-4 h-4" style={{ color: '#1a1040' }} />; })()}
          </div>
        )}
        {isDefending && <div className="absolute inset-0 flex items-center justify-center"><Shield className="w-16 h-16 opacity-40" style={{ color: '#80e8ff' }} /></div>}
      </div>
      <div className="mt-3 w-full max-w-[200px] mx-auto">
        <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }}>
          <span>{label}</span><span>{hp}/{maxHp}</span>
        </div>
        <div className="h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#eee', border: '2px solid #ddd' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(hp / maxHp) * 100}%`, backgroundColor: getHPColor(hp, maxHp) }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden y2k-lavender-bg ${screenShake ? 'animate-shake' : ''}`}>
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 z-50">
          <X className="w-5 h-5" style={{ color: '#1a1040' }} />
        </button>

        <div className="rounded-[22px] p-6" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc6e50' }}>
          <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-2xl text-center mb-4">Battle</h2>

          {/* Combatants */}
          <div className="flex justify-between items-center mb-6 gap-6">
            {renderCombatant('YOU', playerHP, maxPlayerHP, playerElement, animatingPlayer, playerDefending, 'animate-attack-forward', '-right-1')}
            <div style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }} className="text-3xl">VS</div>
            {renderCombatant('FOE', opponentHP, maxOpponentHP, opponentElement, animatingOpponent, opponentDefending, 'animate-attack-backward', '-left-1')}
          </div>

          {/* Damage number */}
          {damageNumber && (
            <div className={`absolute top-1/3 ${damageNumber.x > 0 ? 'right-1/4' : 'left-1/4'} text-5xl animate-damage-float z-50`}
              style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }}>
              -{damageNumber.value}
            </div>
          )}

          {/* Message */}
          <div className="rounded-[14px] p-3 mb-4 text-center min-h-[56px] flex items-center justify-center" style={{ backgroundColor: '#f0d6ff', border: '2px solid #d8b4fe' }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040', fontWeight: 600 }} className="text-sm">{message}</p>
          </div>

          {/* Actions */}
          {isPlayerTurn && !gameOver && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { action: 'quick' as Action, icon: Sword, label: 'Quick', desc: '10-16', bg: '#ff6fcf', shadow: '#cc4fa3' },
                { action: 'power' as Action, icon: Sword, label: 'Power', desc: '20-31', bg: '#ff8a65', shadow: '#cc6e50' },
                { action: 'defend' as Action, icon: Shield, label: 'Defend', desc: '+5 HP', bg: '#80e8ff', shadow: '#5cb8cc' },
                { action: 'special' as Action, icon: Star, label: 'Special', desc: '35-46', bg: '#fff176', shadow: '#ccc05e' },
              ].map(({ action, icon: Icon, label, desc, bg, shadow }) => (
                <button key={action} onClick={() => handlePlayerAction(action)}
                  disabled={action === 'special' && specialCooldown > 0}
                  className="flex flex-col items-center justify-center gap-1 rounded-[14px] p-3 transition-all hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: bg, boxShadow: `0 4px 0 0 ${shadow}`, color: '#1a1040' }}>
                  {action === 'special' && specialCooldown > 0 ? (
                    <><Zap className="w-5 h-5 opacity-50" /><span style={{ fontFamily: "'Bungee', cursive" }} className="text-xs">CD: {specialCooldown}</span></>
                  ) : (
                    <><Icon className="w-5 h-5" /><span style={{ fontFamily: "'Bungee', cursive" }} className="text-xs">{label}</span><span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[10px] opacity-60">{desc}</span></>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Turn indicator */}
          {!gameOver && (
            <p className="text-center text-sm mb-3" style={{ fontFamily: "'Bungee', cursive", color: isPlayerTurn ? '#ff0098' : '#9b7abf' }}>
              {isPlayerTurn ? 'YOUR TURN!' : "Opponent's turn..."}
            </p>
          )}

          {/* Log */}
          <div className="rounded-[12px] p-3 max-h-24 overflow-y-auto" style={{ backgroundColor: '#fafafa', border: '2px solid #eee' }}>
            <h4 className="text-xs mb-1" style={{ fontFamily: "'Bungee', cursive", color: '#9b7abf' }}>Battle Log</h4>
            {actionLog.map((log, i) => <p key={i} className="text-[11px] mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{log}</p>)}
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          title={playerWon ? 'VICTORY!' : 'DEFEATED'}
          titleColor={playerWon ? '#69f0ae' : '#ff0098'}
          message={message}
          icon={<Star className="w-14 h-14 mx-auto" style={{ color: playerWon ? '#fff176' : '#b388ff' }} />}
          onPlayAgain={resetGame}
          onClose={onClose}
          playLabel="Again"
          shadowColor="#cc4fa3"
        />
      )}
    </div>
  );
};
