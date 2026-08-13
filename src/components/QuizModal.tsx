import React, { useState, useEffect } from 'react';
import { X, RotateCcw, CheckCircle2, XCircle, Sparkles, Trophy, Brain, ChevronRight, Flame, Award, Zap } from 'lucide-react';
import { QuizQuestion, KnowledgeItem } from '../types';
import { getShuffledQuizQuestions } from '../data/quizQuestions';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeItems: KnowledgeItem[];
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  knowledgeItems,
}) => {
  const [questionLimit, setQuestionLimit] = useState<number>(10); // 10 or 100
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  // Load High Score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('zooworld_quiz_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10) || 0);
    }
  }, []);

  // Initialize questions on modal open or restart
  const startNewGame = (limit: number = questionLimit) => {
    setQuestionLimit(limit);
    const shuffled = getShuffledQuizQuestions(limit, knowledgeItems);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  useEffect(() => {
    if (isOpen && questions.length === 0) {
      startNewGame(10);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    let currentScore = score;
    if (isCorrect) {
      const points = 10 + streak * 2;
      currentScore = score + points;
      setScore(currentScore);
      setStreak((prev) => prev + 1);

      // Save high score if exceeded
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('zooworld_quiz_highscore', currentScore.toString());
      }
    } else {
      setStreak(0);
    }

    setUserAnswers((prev) => [...prev, { questionId: currentQ.id, isCorrect }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      // Final highscore check
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('zooworld_quiz_highscore', score.toString());
      }
    }
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  const getRankBadge = (correct: number, total: number) => {
    const ratio = total > 0 ? correct / total : 0;
    if (ratio >= 0.9) return { title: "เซียนสารคดีระดับตำนาน", desc: "รอบรู้เรื่องสัตว์โลกและธรรมชาติขั้นสูงสุด!", color: "text-amber-400" };
    if (ratio >= 0.7) return { title: "นักสำรวจป่ามืออาชีพ", desc: "ความรู้แน่นและแม่นยำอย่างยิ่ง!", color: "text-emerald-400" };
    if (ratio >= 0.5) return { title: "นักรักธรรมชาติ", desc: "ผ่านเกณฑ์ระดับมาตรฐาน ยอดเยี่ยมมาก!", color: "text-cyan-400" };
    return { title: "ผู้เริ่มต้นสำรวจ", desc: "รับชมสารคดีเพิ่มความรู้เพิ่มเติมได้เสมอ", color: "text-[#E0E2DB]/70" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-lg bg-gray-900 sm:rounded-2xl border border-gray-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-gray-800 bg-black flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center font-black shadow-lg">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                เกมทายตอบคำถามสารคดี
              </h2>
              <p className="text-[10px] text-gray-400">
                คลังข้อสอบ 100 ข้อ • คะแนนสูงสุด: <span className="text-emerald-400 font-bold">{highScore}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
              aria-label="ปิด"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Limits / Mode Bar */}
        <div className="px-4 py-2 bg-gray-950 border-b border-gray-800/80 flex items-center justify-between text-xs">
          <span className="text-gray-400 text-[11px] font-medium">โหมดคำถาม:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => startNewGame(10)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                questionLimit === 10
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              ชุดละ 10 ข้อ
            </button>
            <button
              onClick={() => startNewGame(100)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                questionLimit === 100
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>มาราธอน 100 ข้อ</span>
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto bg-gray-900">
          {!isFinished && currentQ ? (
            <div className="space-y-4">
              
              {/* Progress Bar & Current Score */}
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-gray-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-[11px]">ข้อที่</span>
                  <span className="text-base font-bold text-emerald-400">{currentIndex + 1}</span>
                  <span className="text-gray-500 text-[11px]">/ {questions.length}</span>
                </div>

                <div className="flex items-center gap-3">
                  {streak > 1 && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-0.5 animate-pulse">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> สตรีค {streak}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{score} คะแนน</span>
                  </div>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Box */}
              <div className="p-4 rounded-xl bg-black/80 border border-gray-800 space-y-2">
                {currentQ.category && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/50">
                    {currentQ.category}
                  </span>
                )}
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = "bg-gray-800/60 hover:bg-gray-800 border-gray-700/60 text-gray-200";
                  let icon = null;

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md";
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-red-950/80 border-red-500 text-red-300 font-bold";
                      icon = <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
                    } else {
                      btnStyle = "bg-gray-900/40 border-gray-800 text-gray-600";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <span className={`w-6 h-6 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 ${
                          isAnswered && idx === currentQ.correctAnswerIndex
                            ? 'border-emerald-400 bg-emerald-400 text-black'
                            : 'border-gray-700 bg-gray-800 text-gray-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next button */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-black/90 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400 block mb-0.5">เกร็ดความรู้สารคดี:</span>
                      <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer transition-all"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'ข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Result Summary */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                  ทำแบบทดสอบสำเร็จ!
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  สรุปผลคะแนนของคุณ
                </h3>
              </div>

              {/* Score Box */}
              <div className="w-full bg-black/80 p-5 rounded-2xl border border-gray-800 space-y-2">
                <div className="text-3xl font-bold text-emerald-400">
                  {score} <span className="text-xs font-normal text-gray-400">คะแนน</span>
                </div>
                <p className="text-xs text-gray-300">
                  ตอบถูก <span className="text-emerald-400 font-bold">{correctCount}</span> จาก {questions.length} ข้อ
                </p>

                {/* Rank */}
                {(() => {
                  const rank = getRankBadge(correctCount, questions.length);
                  return (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <div className={`text-sm font-bold ${rank.color}`}>
                        {rank.title}
                      </div>
                      <p className="text-xs text-gray-400 font-light mt-0.5">
                        {rank.desc}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex gap-2.5">
                <button
                  onClick={() => startNewGame(questionLimit)}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>เล่นสลับคำถามใหม่</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs cursor-pointer"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800 bg-black text-center text-[10px] text-gray-500">
          ZOOWORLD • ระบบเกมแบบทดสอบสารคดีสัตว์โลกและธรรมชาติ 100 ข้อ
        </div>

      </div>
    </div>
  );
};
