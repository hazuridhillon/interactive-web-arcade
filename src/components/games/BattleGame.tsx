/**
 * BattleGame.tsx — A turn-based RPG battle.
 * Pick a difficulty, choose an element (nature/water/fire), then trade
 * attacks with an AI opponent using quick, power, defend, or special moves.
 * Elements have rock-paper-scissors advantages.
 */

import React, { useState, useEffect } from 'react';
import { X, Sword, Shield, Star, Zap, Sparkles, Leaf, Droplet, Flame } from 'lucide-react';
import { DifficultySelector } from '@/components/DifficultySelector';

interface BattleGameProps {
  onClose: () => void;
}

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
    const elements: Element[] = ['nature', 'water', 'fire'];
    const randomOpponent = elements[Math.floor(Math.random() * elements.length)];
    setOpponentElement(randomOpponent);
    setMessage("Battle begins! Choose your action.");
    addToLog(`You chose ${ELEMENTS[element].name}! Opponent chose ${ELEMENTS[randomOpponent].name}!`);
  };

  const getElementAdvantage = (attacker: Element, defender: Element): number => {
    if (attacker === 'nature' && defender === 'water') return 10;
    if (attacker === 'water' && defender === 'fire') return 10;
    if (attacker === 'fire' && defender === 'nature') return 10;
    if (attacker === 'water' && defender === 'nature') return -5;
    if (attacker === 'fire' && defender === 'water') return -5;
    if (attacker === 'nature' && defender === 'fire') return -5;
    return 0;
  };

  const addToLog = (msg: string) => { setActionLog(prev => [...prev.slice(-4), msg]); };
  const showDamageNumber = (damage: number, isOpponent: boolean) => {
    setDamageNumber({ value: damage, x: isOpponent ? -100 : 100 });
    setTimeout(() => setDamageNumber(null), 1000);
  };

  const handlePlayerAction = (action: Action) => {
    if (!isPlayerTurn || gameOver || !playerElement || !opponentElement) return;
    setIsPlayerTurn(false);
    let damage = 0;
    const mult = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 1.2 : 1;

    if (action === 'quick') {
      damage = Math.floor((10 + Math.floor(Math.random() * 6)) * mult) + getElementAdvantage(playerElement, opponentElement);
      setAnimatingPlayer(true); setScreenShake(true);
      setTimeout(() => { setAnimatingPlayer(false); setScreenShake(false); }, 500);
      if (opponentDefending) { damage = Math.floor(damage * 0.4); setMessage(`Quick attack blocked! ${damage} dmg`); }
      else { setMessage(`Quick strike! ${damage} dmg`); }
      showDamageNumber(damage, false);
      setOpponentHP(prev => Math.max(0, prev - damage));
      addToLog(`You dealt ${damage} (Quick)`);
    } else if (action === 'power') {
      if (Math.random() > 0.2) {
        damage = Math.floor((20 + Math.floor(Math.random() * 11)) * mult) + getElementAdvantage(playerElement, opponentElement);
        setAnimatingPlayer(true); setScreenShake(true);
        setTimeout(() => { setAnimatingPlayer(false); setScreenShake(false); }, 600);
        if (opponentDefending) { damage = Math.floor(damage * 0.4); setMessage(`Power blocked! ${damage} dmg`); }
        else { setMessage(`Power hit! ${damage} dmg`); }
        showDamageNumber(damage, false);
        setOpponentHP(prev => Math.max(0, prev - damage));
        addToLog(`You dealt ${damage} (Power)`);
      } else { setMessage("Power attack missed!"); addToLog("Power missed!"); }
    } else if (action === 'defend') {
      setPlayerDefending(true);
      setPlayerHP(prev => Math.min(maxPlayerHP, prev + 5));
      setMessage("Defending! +5 HP"); addToLog("You defend +5 HP");
    } else if (action === 'special') {
      if (specialCooldown > 0) return;
      damage = Math.floor((35 + Math.floor(Math.random() * 11)) * mult) + getElementAdvantage(playerElement, opponentElement);
      setAnimatingPlayer(true); setScreenShake(true);
      setTimeout(() => { setAnimatingPlayer(false); setScreenShake(false); }, 700);
      setSpecialCooldown(3);
      if (opponentDefending) { damage = Math.floor(damage * 0.4); setMessage(`Special blocked! ${damage} dmg`); }
      else { setMessage(`SPECIAL! ${damage} dmg`); }
      showDamageNumber(damage, false);
      setOpponentHP(prev => Math.max(0, prev - damage));
      addToLog(`You dealt ${damage} (Special!)`);
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
    let damage = 0;
    const mult = difficulty === 'hard' ? 1.2 : difficulty === 'easy' ? 0.8 : 1;

    if (opponentAction === 'quick') {
      damage = Math.floor((10 + Math.floor(Math.random() * 6)) * mult);
      if (opponentElement && playerElement) damage += getElementAdvantage(opponentElement, playerElement);
      setAnimatingOpponent(true); setScreenShake(true);
      setTimeout(() => { setAnimatingOpponent(false); setScreenShake(false); }, 500);
      if (playerDefending) { damage = Math.floor(damage * 0.4); setMessage(`Blocked! Took ${damage}`); }
      else { setMessage(`Hit! Took ${damage}`); }
      showDamageNumber(damage, true); setPlayerHP(prev => Math.max(0, prev - damage));
      addToLog(`Opponent dealt ${damage}`);
    } else if (opponentAction === 'power') {
      if (Math.random() > 0.2) {
        damage = Math.floor((20 + Math.floor(Math.random() * 11)) * mult);
        if (opponentElement && playerElement) damage += getElementAdvantage(opponentElement, playerElement);
        setAnimatingOpponent(true); setScreenShake(true);
        setTimeout(() => { setAnimatingOpponent(false); setScreenShake(false); }, 600);
        if (playerDefending) { damage = Math.floor(damage * 0.4); setMessage(`Blocked power! Took ${damage}`); }
        else { setMessage(`Power hit! Took ${damage}`); }
        showDamageNumber(damage, true); setPlayerHP(prev => Math.max(0, prev - damage));
        addToLog(`Opponent power ${damage}`);
      } else { setMessage("Opponent missed!"); addToLog("Opponent missed!"); }
    } else if (opponentAction === 'defend') {
      setOpponentDefending(true);
      setOpponentHP(prev => Math.min(maxOpponentHP, prev + 5));
      setMessage("Opponent defends +5 HP"); addToLog("Opponent defends");
    } else if (opponentAction === 'special') {
      damage = Math.floor((35 + Math.floor(Math.random() * 11)) * mult);
      if (opponentElement && playerElement) damage += getElementAdvantage(opponentElement, playerElement);
      setAnimatingOpponent(true); setScreenShake(true);
      setTimeout(() => { setAnimatingOpponent(false); setScreenShake(false); }, 700);
      if (playerDefending) { damage = Math.floor(damage * 0.4); setMessage(`Blocked special! Took ${damage}`); }
      else { setMessage(`SPECIAL! Took ${damage}`); }
      showDamageNumber(damage, true); setPlayerHP(prev => Math.max(0, prev - damage));
      addToLog(`Opponent special ${damage}!`);
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

  if (!difficulty) {
    return <DifficultySelector onSelect={handleDifficultySelect} onCancel={onClose} easyDesc="120 HP vs 80 HP" mediumDesc="100 HP vs 100 HP" hardDesc="80 HP vs 120 HP, smarter AI" />;
  }

  if (!playerElement) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center y2k-lavender-bg">
        <div className="rounded-[22px] p-8 max-w-lg w-full mx-4" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc6e50' }}>
          <h2 style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }} className="text-2xl text-center mb-2">Choose Element</h2>
          <p className="text-center text-sm mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: '#9b7abf' }}>Pick your fighting style</p>
          <div className="flex flex-col gap-3">
            {(Object.keys(ELEMENTS) as Element[]).map((element) => {
              const el = ELEMENTS[element];
              const ElIcon = el.icon;
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
            {/* Player */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl ${animatingPlayer ? 'animate-attack-forward' : ''} ${playerDefending ? 'ring-4 ring-[#80e8ff]' : ''} transition-all`}
                  style={{ backgroundColor: playerElement ? ELEMENTS[playerElement].color : '#f0d6ff', boxShadow: `0 5px 0 0 ${playerElement ? ELEMENTS[playerElement].shadow : '#d8b4fe'}` }}>
                  {getExpression(playerHP, maxPlayerHP)}
                </div>
                {playerElement && (
                  <div className="absolute -top-1 -right-1 p-1.5 rounded-full" style={{ backgroundColor: ELEMENTS[playerElement].color, border: '2px solid #fff' }}>
                    {React.createElement(ELEMENTS[playerElement].icon, { className: 'w-4 h-4', style: { color: '#1a1040' } })}
                  </div>
                )}
                {playerDefending && <div className="absolute inset-0 flex items-center justify-center"><Shield className="w-16 h-16 opacity-40" style={{ color: '#80e8ff' }} /></div>}
              </div>
              <div className="mt-3 w-full max-w-[200px] mx-auto">
                <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }}>
                  <span>YOU</span><span>{playerHP}/{maxPlayerHP}</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#eee', border: '2px solid #ddd' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(playerHP / maxPlayerHP) * 100}%`, backgroundColor: getHPColor(playerHP, maxPlayerHP) }} />
                </div>
              </div>
            </div>

            <div style={{ fontFamily: "'Bungee', cursive", color: '#ff0098' }} className="text-3xl">VS</div>

            {/* Opponent */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl ${animatingOpponent ? 'animate-attack-backward' : ''} ${opponentDefending ? 'ring-4 ring-[#80e8ff]' : ''} transition-all`}
                  style={{ backgroundColor: opponentElement ? ELEMENTS[opponentElement].color : '#f0d6ff', boxShadow: `0 5px 0 0 ${opponentElement ? ELEMENTS[opponentElement].shadow : '#d8b4fe'}` }}>
                  {getExpression(opponentHP, maxOpponentHP)}
                </div>
                {opponentElement && (
                  <div className="absolute -top-1 -left-1 p-1.5 rounded-full" style={{ backgroundColor: ELEMENTS[opponentElement].color, border: '2px solid #fff' }}>
                    {React.createElement(ELEMENTS[opponentElement].icon, { className: 'w-4 h-4', style: { color: '#1a1040' } })}
                  </div>
                )}
                {opponentDefending && <div className="absolute inset-0 flex items-center justify-center"><Shield className="w-16 h-16 opacity-40" style={{ color: '#80e8ff' }} /></div>}
              </div>
              <div className="mt-3 w-full max-w-[200px] mx-auto">
                <div className="flex justify-between text-xs mb-1" style={{ fontFamily: "'Bungee', cursive", color: '#1a1040' }}>
                  <span>FOE</span><span>{opponentHP}/{maxOpponentHP}</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden" style={{ backgroundColor: '#eee', border: '2px solid #ddd' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(opponentHP / maxOpponentHP) * 100}%`, backgroundColor: getHPColor(opponentHP, maxOpponentHP) }} />
                </div>
              </div>
            </div>
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
                <button
                  key={action}
                  onClick={() => handlePlayerAction(action)}
                  disabled={action === 'special' && specialCooldown > 0}
                  className="flex flex-col items-center justify-center gap-1 rounded-[14px] p-3 transition-all hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: bg, boxShadow: `0 4px 0 0 ${shadow}`, color: '#1a1040' }}
                >
                  {action === 'special' && specialCooldown > 0 ? (
                    <>
                      <Zap className="w-5 h-5 opacity-50" />
                      <span style={{ fontFamily: "'Bungee', cursive" }} className="text-xs">CD: {specialCooldown}</span>
                    </>
                  ) : (
                    <>
                      <Icon className="w-5 h-5" />
                      <span style={{ fontFamily: "'Bungee', cursive" }} className="text-xs">{label}</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif" }} className="text-[10px] opacity-60">{desc}</span>
                    </>
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
            {actionLog.map((log, i) => (
              <p key={i} className="text-[11px] mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{log}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="rounded-[22px] p-8 text-center" style={{ backgroundColor: '#fff', boxShadow: '0 6px 0 0 #cc4fa3' }}>
            <Star className="w-14 h-14 mx-auto mb-3" style={{ color: playerWon ? '#fff176' : '#b388ff' }} />
            <h3 style={{ fontFamily: "'Bungee', cursive", color: playerWon ? '#69f0ae' : '#ff0098' }} className="text-3xl mb-2">
              {playerWon ? 'VICTORY!' : 'DEFEATED'}
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1040' }} className="mb-5">{message}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={resetGame} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#ff6fcf', boxShadow: '0 4px 0 0 #cc4fa3', color: '#fff' }}>
                <Sparkles className="w-4 h-4 inline mr-1" /> Again
              </button>
              <button onClick={onClose} className="px-5 py-3 rounded-[14px] text-sm transition-all hover:-translate-y-1" style={{ fontFamily: "'Bungee', cursive", backgroundColor: '#80e8ff', boxShadow: '0 4px 0 0 #5cb8cc', color: '#1a1040' }}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
