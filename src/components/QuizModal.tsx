import React, { useState, useEffect } from 'react';
import { X, Award, RotateCcw, CheckCircle2, XCircle, Sparkles, Trophy, Brain, ChevronRight, HelpCircle } from 'lucide-react';
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  // Initialize questions on modal open or restart
  const startNewGame = () => {
    const shuffled = getShuffledQuizQuestions(10, knowledgeItems);
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
      startNewGame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;
    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
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
    }
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;

  const getRankBadge = (correct: number) => {
    if (correct >= 9) return { title: "ผู้เชี่ยวชาญสัตว์โลกขั้นสูง", desc: "รอบรู้ทุกเรื่องราวธรรมชาติระดับสารคดี!", color: "text-[#A3E635]" };
    if (correct >= 7) return { title: "นักสำรวจป่ามืออาชีพ", desc: "ความรู้แน่นและแม่นยำมาก!", color: "text-amber-400" };
    if (correct >= 5) return { title: "นักรักธรรมชาติ", desc: "เก่งมาก! ผ่านเกณฑ์ระดับมาตรฐาน", color: "text-sky-400" };
    return { title: "ผู้เริ่มต้นสำรวจ", desc: "สามารถเปิดชมสารคดีเพิ่มความรู้ได้ตลอดเวลา", color: "text-white/70" };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080A06]/95 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#080A06] rounded-2xl border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 bg-[#12150E] shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#A3E635] text-[#080A06] flex items-center justify-center font-black shadow-md">
              <Brain className="w-4 h-4 text-[#080A06]" />
            </div>
            <div>
              <h2 className="text-xs font-serif font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                ZOOWORLD <span className="text-[#A3E635] font-sans text-[10px]">เกมทดสอบ</span>
              </h2>
              <p className="text-[10px] text-white/50">
                สลับคำถามจากคลังความรู้ 100 เรื่อง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewGame}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#A3E635] text-[10px] font-bold border border-[#A3E635]/30 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              title="สลับคำถามใหม่"
            >
              <RotateCcw className="w-3 h-3" />
              <span>สลับชุดใหม่</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#080A06] bg-[#A3E635] hover:bg-white transition-all cursor-pointer font-bold"
            >
              <X className="w-4 h-4 text-[#080A06]" />
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        <div className="p-4 flex-1 overflow-y-auto bg-[#080A06] hide-scrollbar">
          {!isFinished && currentQ ? (
            <div className="space-y-4">
              
              {/* Progress Bar & Scores */}
              <div className="flex items-center justify-between bg-[#12150E] p-2.5 rounded-xl border border-white/5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/50">ข้อที่</span>
                  <span className="text-sm font-black text-[#A3E635]">{currentIndex + 1}</span>
                  <span className="text-[10px] text-white/30">/ {questions.length}</span>
                </div>

                <div className="flex items-center gap-3">
                  {streak > 1 && (
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 animate-pulse">
                      🔥 สตรีค {streak}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-[#A3E635] font-black">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{score} คะแนน</span>
                  </div>
                </div>
              </div>

              {/* Progress indicator bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#A3E635] h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-xl bg-[#12150E] border border-white/10 shadow-inner space-y-2">
                {currentQ.category && (
                  <span className="inline-block px-2 py-0.5 rounded bg-[#A3E635]/10 text-[#A3E635] text-[9px] font-bold uppercase tracking-wider border border-[#A3E635]/20">
                    {currentQ.category}
                  </span>
                )}
                <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options list */}
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = "bg-[#12150E] hover:bg-[#181C13] border-white/10 text-white";
                  let icon = null;

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnStyle = "bg-[#A3E635]/20 border-[#A3E635] text-[#A3E635] font-bold shadow-[0_0_15px_rgba(163,230,53,0.2)]";
                      icon = <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />;
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-400 font-bold";
                      icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                    } else {
                      btnStyle = "bg-[#12150E]/40 border-white/5 text-white/30";
                    }
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-[#A3E635] text-[#080A06] font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <span className={`w-5 h-5 rounded-lg border text-[10px] font-black flex items-center justify-center shrink-0 ${
                          isAnswered && idx === currentQ.correctAnswerIndex
                            ? 'border-[#A3E635] bg-[#A3E635] text-[#080A06]'
                            : 'border-white/20 bg-white/5'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-tight">{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next button when answered */}
              {isAnswered && (
                <div className="p-3.5 rounded-xl bg-[#12150E] border border-[#A3E635]/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-[#A3E635] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#A3E635] block mb-0.5">เกร็ดความรู้สารคดี:</span>
                      <p className="text-[11px] text-white/80 leading-relaxed font-light">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2.5 rounded-xl bg-[#A3E635] text-[#080A06] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer transition-transform"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'ข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Game Over / Summary Result */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center text-[#A3E635] shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3E635]">
                  ทดสอบความรู้สำเร็จ!
                </span>
                <h3 className="text-xl font-serif font-black text-white mt-1">
                  สรุปผลคะแนนของคุณ
                </h3>
              </div>

              {/* Score Display */}
              <div className="w-full bg-[#12150E] p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="text-3xl font-black text-[#A3E635]">
                  {score} <span className="text-xs font-normal text-white/50">คะแนน</span>
                </div>
                <p className="text-xs text-white/70">
                  ตอบถูก <span className="text-[#A3E635] font-bold">{correctCount}</span> จาก {questions.length} ข้อ
                </p>

                {/* Rank Badge */}
                {(() => {
                  const rank = getRankBadge(correctCount);
                  return (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className={`text-xs font-bold ${rank.color}`}>
                        {rank.title}
                      </div>
                      <p className="text-[10px] text-white/50 font-light mt-0.5">
                        {rank.desc}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Buttons */}
              <div className="w-full flex gap-2">
                <button
                  onClick={startNewGame}
                  className="flex-1 py-3 rounded-xl bg-[#A3E635] text-[#080A06] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>เล่นสลับคำถามใหม่</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 active:scale-95 cursor-pointer"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#12150E] text-center">
          <p className="text-[10px] text-white/40">
            ZOOWORLD • คลังความรู้และเกมแบบทดสอบสารคดีสัตว์โลก 100 ข้อ
          </p>
        </div>

      </div>
    </div>
  );
};
