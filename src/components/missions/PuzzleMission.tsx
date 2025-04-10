
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Puzzle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface PuzzleMissionProps {
  onComplete: () => void;
  onCancel: () => void;
}

type MemoryCard = {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
};

const PuzzleMission: React.FC<PuzzleMissionProps> = ({ onComplete, onCancel }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize the memory game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create pairs of cards (1-6 for medium difficulty)
    const values = Array.from({ length: totalPairs }, (_, i) => i + 1);
    const pairs = [...values, ...values];
    
    // Shuffle the cards
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsCompleted(false);
  };

  const handleCardClick = (id: number) => {
    // Ignore if already flipped or matched
    if (cards.find(card => card.id === id)?.flipped || cards.find(card => card.id === id)?.matched) {
      return;
    }
    
    // Ignore if two cards are already flipped
    if (flippedCards.length === 2) {
      return;
    }
    
    // Flip the card
    const newCards = cards.map(card => {
      if (card.id === id) {
        return { ...card, flipped: true };
      }
      return card;
    });
    
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
    
    // If two cards are flipped, check for a match
    if (flippedCards.length === 1) {
      const firstCard = cards.find(card => card.id === flippedCards[0]);
      const secondCard = newCards.find(card => card.id === id);
      
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card => {
            if (card.id === flippedCards[0] || card.id === id) {
              return { ...card, matched: true, flipped: false };
            }
            return card;
          }));
          
          setFlippedCards([]);
          setMatchedPairs(prev => {
            const newCount = prev + 1;
            if (newCount === totalPairs) {
              setIsCompleted(true);
              toast.success("Puzzle completed!");
              setTimeout(() => {
                onComplete();
              }, 1500);
            }
            return newCount;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => prevCards.map(card => {
            if (card.id === flippedCards[0] || card.id === id) {
              return { ...card, flipped: false };
            }
            return card;
          }));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const getCardColor = (card: MemoryCard) => {
    if (card.matched) {
      return "bg-green-500 text-white";
    }
    if (card.flipped) {
      return "bg-mission-puzzle text-white";
    }
    return "bg-white border-2 border-mission-puzzle";
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="bg-mission-puzzle text-white p-4">
        <h2 className="text-lg font-medium text-center">Memory Puzzle</h2>
        <p className="text-center text-sm">
          Match all pairs to turn off the alarm
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isCompleted ? (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="animate-bounce-soft">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <p className="text-xl font-medium">Great job!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center w-full max-w-md mb-4">
              <p className="text-sm font-medium">
                Pairs: {matchedPairs}/{totalPairs}
              </p>
              <div className="w-1/2 bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-mission-puzzle"
                  style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {cards.map(card => (
                <button
                  key={card.id}
                  className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${getCardColor(card)}`}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.flipped || card.matched}
                >
                  {card.flipped ? card.value : card.matched ? "✓" : ""}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="p-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onCancel}
        >
          Emergency Cancel (Will Re-Ring Soon)
        </Button>
      </div>
    </div>
  );
};

export default PuzzleMission;
