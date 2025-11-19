import { useState, useEffect } from 'react';
import { X, Sword, Shield, Star, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BattleGameProps {
  onClose: () => void;
}

type Action = 'attack' | 'defend' | 'special';

export const BattleGame = ({ onClose }: BattleGameProps) => {
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [playerDefending, setPlayerDefending] = useState(false);
  const [opponentDefending, setOpponentDefending] = useState(false);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState("Your turn! Choose an action.");
  const [gameOver, setGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState(false);
  const [animatingOpponent, setAnimatingOpponent] = useState(false);

  useEffect(() => {
    if (playerHP <= 0) {
      setGameOver(true);
      setPlayerWon(false);
      setMessage("You've been defeated... But you fought well! 🌸");
    } else if (opponentHP <= 0) {
      setGameOver(true);
      setPlayerWon(true);
      setMessage("Victory! You protected the garden! 🌟");
    }
  }, [playerHP, opponentHP]);

  const handlePlayerAction = (action: Action) => {
    if (!isPlayerTurn || gameOver) return;

    setIsPlayerTurn(false);
    let damage = 0;

    if (action === 'attack') {
      damage = 15 + Math.floor(Math.random() * 10);
      setAnimatingPlayer(true);
      setTimeout(() => setAnimatingPlayer(false), 500);
      
      if (opponentDefending) {
        damage = Math.floor(damage / 2);
        setMessage(`You attack! Opponent blocks. Dealt ${damage} damage! ⚔️`);
      } else {
        setMessage(`You attack! Dealt ${damage} damage! 💥`);
      }
      setOpponentHP(prev => Math.max(0, prev - damage));
    } else if (action === 'defend') {
      setPlayerDefending(true);
      setMessage("You raise your shield, ready to defend! 🛡️");
    } else if (action === 'special') {
      if (specialCooldown > 0) return;
      
      damage = 25 + Math.floor(Math.random() * 15);
      setAnimatingPlayer(true);
      setTimeout(() => setAnimatingPlayer(false), 500);
      setSpecialCooldown(3);
      
      if (opponentDefending) {
        damage = Math.floor(damage / 2);
        setMessage(`Special attack! Opponent blocks. Dealt ${damage} damage! ✨`);
      } else {
        setMessage(`Special attack! Dealt ${damage} damage! ⭐`);
      }
      setOpponentHP(prev => Math.max(0, prev - damage));
    }

    setTimeout(() => {
      if (opponentHP - damage > 0 && playerHP > 0) {
        opponentTurn();
      }
    }, 1500);
  };

  const opponentTurn = () => {
    setPlayerDefending(false);
    
    const actions: Action[] = ['attack', 'attack', 'defend', 'special'];
    const opponentAction = actions[Math.floor(Math.random() * actions.length)];
    
    let damage = 0;

    if (opponentAction === 'attack') {
      damage = 12 + Math.floor(Math.random() * 8);
      setAnimatingOpponent(true);
      setTimeout(() => setAnimatingOpponent(false), 500);
      
      if (playerDefending) {
        damage = Math.floor(damage / 2);
        setMessage(`Opponent attacks! You block it. Took ${damage} damage! 🛡️`);
      } else {
        setMessage(`Opponent attacks! Took ${damage} damage! 💢`);
      }
      setPlayerHP(prev => Math.max(0, prev - damage));
    } else if (opponentAction === 'defend') {
      setOpponentDefending(true);
      setMessage("Opponent prepares to defend! 🛡️");
    } else if (opponentAction === 'special') {
      damage = 20 + Math.floor(Math.random() * 12);
      setAnimatingOpponent(true);
      setTimeout(() => setAnimatingOpponent(false), 500);
      
      if (playerDefending) {
        damage = Math.floor(damage / 2);
        setMessage(`Opponent uses special! You block it. Took ${damage} damage! 🛡️✨`);
      } else {
        setMessage(`Opponent uses special attack! Took ${damage} damage! 💫`);
      }
      setPlayerHP(prev => Math.max(0, prev - damage));
    }

    if (specialCooldown > 0) {
      setSpecialCooldown(prev => prev - 1);
    }

    setTimeout(() => {
      setOpponentDefending(false);
      setIsPlayerTurn(true);
      if (!gameOver) {
        setMessage("Your turn! Choose an action.");
      }
    }, 1500);
  };

  const resetGame = () => {
    setPlayerHP(100);
    setOpponentHP(100);
    setPlayerDefending(false);
    setOpponentDefending(false);
    setSpecialCooldown(0);
    setIsPlayerTurn(true);
    setMessage("Your turn! Choose an action.");
    setGameOver(false);
    setPlayerWon(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#A8C8A0] via-[#C9D5B5] to-[#E6F3E6] overflow-hidden">
      {/* Background meadow elements */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {Math.random() > 0.5 ? '🌸' : '✨'}
          </div>
        ))}
      </div>

      {/* Game Container */}
      <div className="relative glass-effect rounded-3xl p-8 max-w-4xl w-full mx-4 border-2 border-white/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#4A7C4E] drop-shadow-lg">Enchanted Duel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full bg-white/50 hover:bg-white/70 border-2 border-[#4A7C4E]"
          >
            <X className="w-6 h-6 text-[#4A7C4E]" />
          </Button>
        </div>

        {/* Battle Arena */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Player Blob */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm font-bold text-[#4A7C4E]">You</div>
            <div
              className={`
                relative w-32 h-32 rounded-full 
                bg-gradient-to-br from-[#FFB3C6] to-[#FFC2D1]
                border-4 border-white shadow-xl
                flex items-center justify-center
                transition-all duration-300
                ${animatingPlayer ? 'translate-x-8 scale-110' : ''}
                ${playerDefending ? 'ring-4 ring-blue-400' : ''}
              `}
            >
              <div className="absolute top-8 left-8 w-3 h-3 bg-[#8B4513] rounded-full" />
              <div className="absolute top-8 right-8 w-3 h-3 bg-[#8B4513] rounded-full" />
              <div className="absolute top-16 left-10 w-4 h-4 bg-[#FFB3C6] rounded-full opacity-60" />
              <div className="absolute top-16 right-10 w-4 h-4 bg-[#FFB3C6] rounded-full opacity-60" />
              {playerDefending && <Shield className="absolute w-12 h-12 text-blue-400 animate-pulse" />}
            </div>
            
            {/* Player HP Bar */}
            <div className="w-40 glass-effect rounded-full p-2 border-2 border-white/40">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-[#4A7C4E]">{playerHP}/100</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${playerHP}%`,
                    clipPath: `inset(0 ${100 - playerHP}% 0 0)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* VS Indicator */}
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-12 h-12 text-[#FFD700] animate-glow-pulse" />
            <span className="text-2xl font-bold text-[#4A7C4E]">VS</span>
          </div>

          {/* Opponent Blob */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm font-bold text-[#4A7C4E]">Opponent</div>
            <div
              className={`
                relative w-32 h-32 rounded-full 
                bg-gradient-to-br from-[#B88B8B] to-[#A67B7B]
                border-4 border-white shadow-xl
                flex items-center justify-center
                transition-all duration-300
                ${animatingOpponent ? '-translate-x-8 scale-110' : ''}
                ${opponentDefending ? 'ring-4 ring-blue-400' : ''}
              `}
            >
              <div className="absolute top-8 left-8 w-3 h-3 bg-[#4A1F1F] rounded-full" />
              <div className="absolute top-8 right-8 w-3 h-3 bg-[#4A1F1F] rounded-full" />
              <div className="absolute top-16 left-10 w-4 h-4 bg-[#B88B8B] rounded-full opacity-60" />
              <div className="absolute top-16 right-10 w-4 h-4 bg-[#B88B8B] rounded-full opacity-60" />
              {opponentDefending && <Shield className="absolute w-12 h-12 text-blue-400 animate-pulse" />}
            </div>
            
            {/* Opponent HP Bar */}
            <div className="w-40 glass-effect rounded-full p-2 border-2 border-white/40">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold text-[#4A7C4E]">{opponentHP}/100</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500 rounded-full"
                  style={{ 
                    width: `${opponentHP}%`,
                    clipPath: `inset(0 ${100 - opponentHP}% 0 0)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        <div className="text-center mb-6 glass-effect rounded-2xl p-4 border-2 border-white/40">
          <p className="text-lg font-medium text-[#4A7C4E]">{message}</p>
        </div>

        {/* Action Buttons */}
        {!gameOver && (
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handlePlayerAction('attack')}
              disabled={!isPlayerTurn}
              className="flex-1 max-w-xs h-16 text-lg bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 border-2 border-red-600 disabled:opacity-50"
            >
              <Sword className="w-6 h-6 mr-2" />
              Attack
            </Button>
            <Button
              onClick={() => handlePlayerAction('defend')}
              disabled={!isPlayerTurn}
              className="flex-1 max-w-xs h-16 text-lg bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 border-2 border-blue-600 disabled:opacity-50"
            >
              <Shield className="w-6 h-6 mr-2" />
              Defend
            </Button>
            <Button
              onClick={() => handlePlayerAction('special')}
              disabled={!isPlayerTurn || specialCooldown > 0}
              className="flex-1 max-w-xs h-16 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 border-2 border-yellow-600 disabled:opacity-50 relative"
            >
              <Star className="w-6 h-6 mr-2" />
              Special
              {specialCooldown > 0 && (
                <span className="absolute top-1 right-1 text-xs bg-black/50 rounded-full w-6 h-6 flex items-center justify-center">
                  {specialCooldown}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-8 text-center border-3 border-white/60 max-w-md">
            <div className="text-6xl mb-4">{playerWon ? '👑' : '🌸'}</div>
            <h3 className="text-4xl font-bold mb-4 text-[#4A7C4E]">
              {playerWon ? 'Victory!' : 'Defeat'}
            </h3>
            <p className="text-lg mb-6 text-[#4A7C4E]">{message}</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow border-2"
              >
                Duel Again
              </Button>
              <Button onClick={onClose} variant="outline" className="border-2 border-[#4A7C4E]">
                Return to Garden
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
