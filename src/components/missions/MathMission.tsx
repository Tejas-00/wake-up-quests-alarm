
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface MathMissionProps {
  onComplete: () => void;
  onCancel: () => void;
}

const MathMission: React.FC<MathMissionProps> = ({ onComplete, onCancel }) => {
  const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: "+", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to solve

  const generateProblem = () => {
    // Generate a medium difficulty math problem
    const operators = ["+", "-", "*"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1, num2, answer;
    
    switch (operator) {
      case "+":
        num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        num2 = Math.floor(Math.random() * num1); // Ensure positive result
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 12) + 1; // 1-12
        num2 = Math.floor(Math.random() * 12) + 1; // 1-12
        answer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        answer = 0;
    }
    
    setProblem({ num1, num2, operator, answer });
    setUserAnswer("");
    setIsCorrect(null);
  };

  useEffect(() => {
    generateProblem();
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Try again with a new problem");
          generateProblem();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const checkAnswer = () => {
    const parsedAnswer = parseInt(userAnswer, 10);
    
    if (isNaN(parsedAnswer)) {
      toast.error("Please enter a valid number");
      return;
    }
    
    if (parsedAnswer === problem.answer) {
      setIsCorrect(true);
      toast.success("Correct!");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setIsCorrect(false);
      toast.error("Incorrect! Try again");
      setTimeout(() => {
        setIsCorrect(null);
        setUserAnswer("");
      }, 1500);
    }
  };

  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case "+": return "+";
      case "-": return "-";
      case "*": return "×";
      default: return op;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="bg-mission-math text-white p-4">
        <h2 className="text-lg font-medium text-center">Math Mission</h2>
        <p className="text-center text-sm">
          Solve the math problem to turn off the alarm
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-mission-math/10 p-6 rounded-xl mb-6 w-full max-w-md">
          <div className="flex items-center justify-center">
            <p className="text-3xl font-bold">
              {problem.num1} {getOperatorSymbol(problem.operator)} {problem.num2} = ?
            </p>
          </div>
          
          <div className="mt-8">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="text-2xl text-center py-6"
              autoFocus
            />
          </div>
          
          {isCorrect !== null && (
            <div className="mt-4 flex justify-center">
              {isCorrect ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Time left: {timeLeft}s
            </p>
            <div className="w-1/2 bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  timeLeft > 15 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {isCorrect === null && (
          <div className="w-full max-w-md">
            <Button 
              onClick={checkAnswer} 
              className="w-full bg-mission-math hover:bg-mission-math/90 text-white"
              size="lg"
              disabled={userAnswer === ""}
            >
              Check Answer
            </Button>
          </div>
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

export default MathMission;
