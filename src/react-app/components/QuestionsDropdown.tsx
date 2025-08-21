import { useState } from 'react';
import { ChevronDown, X, Sparkles } from 'lucide-react';

interface QuestionsDropdownProps {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  maxQuestions: number;
}

const SUGGESTED_QUESTIONS = [
  "When will I find true love and my soulmate?",
  "Will I get a promotion or career advancement in 2025?",
  "What does my future hold financially?",
  "Should I move to a new city or country?",
  "When is the best time to start a new business?",
  "Will my health improve in the coming months?",
  "How can I improve my relationship with family?",
  "What hidden talents should I develop?",
  "Will I travel abroad soon?",
  "What's my life purpose and calling?",
  "Should I invest in property this year?",
  "When will I get married?",
  "Will I have children in the near future?",
  "How can I overcome current challenges?",
  "What does the universe want me to know?",
  "Should I pursue higher education?",
  "Will my business idea succeed?",
  "How can I attract more abundance?",
  "What lessons is life trying to teach me?",
  "Should I trust my intuition about this decision?"
];

export default function QuestionsDropdown({ questions, setQuestions, maxQuestions }: QuestionsDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addSuggestedQuestion = (suggestion: string) => {
    if (questions.length < maxQuestions) {
      // Find first empty question or add new one
      const emptyIndex = questions.findIndex(q => q.trim() === '');
      if (emptyIndex >= 0) {
        updateQuestion(emptyIndex, suggestion);
      } else {
        setQuestions([...questions, suggestion]);
      }
    }
    setShowSuggestions(false);
  };

  const filledQuestions = questions.filter(q => q.trim() !== '').length;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[var(--text)] mb-2">
        Your Questions (up to {maxQuestions}) — Click to add
      </label>
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300 flex items-center justify-between"
      >
        <span className="text-left">
          {filledQuestions === 0 
            ? "Add up to 10 questions. Leave blanks if not using."
            : `${filledQuestions} question${filledQuestions !== 1 ? 's' : ''} added`
          }
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[var(--muted)] transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Expanded Questions Panel */}
      {isExpanded && (
        <div className="mt-3 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-lg p-4 space-y-4">
          {/* Question Inputs - Show all available slots */}
          {Array.from({ length: maxQuestions }, (_, index) => (
            <div key={index} className={`flex items-start gap-3 ${index >= questions.length ? 'opacity-50' : ''}`}>
              <span className="text-sm text-[var(--muted)] font-medium mt-3 flex-shrink-0">
                Q{index + 1}
              </span>
              <textarea
                value={questions[index] || ''}
                onChange={(e) => {
                  if (index >= questions.length) {
                    // Add empty questions up to this index
                    const newQuestions = [...questions];
                    while (newQuestions.length <= index) {
                      newQuestions.push('');
                    }
                    newQuestions[index] = e.target.value;
                    setQuestions(newQuestions);
                  } else {
                    updateQuestion(index, e.target.value);
                  }
                }}
                placeholder="What would you like to know about your future?"
                rows={2}
                className="flex-1 px-3 py-2 bg-transparent border border-white/10 rounded-lg text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-300 text-sm resize-none"
              />
              {questions.length > 1 && index < questions.length && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="w-8 h-8 mt-2 flex items-center justify-center text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--gold)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                <Sparkles className="w-4 h-4" />
                Suggestions
              </button>
            </div>

            <span className="text-sm text-[var(--muted)]">
              {filledQuestions} / {maxQuestions}
            </span>
          </div>

          {/* Suggested Questions */}
          {showSuggestions && (
            <div className="border-t border-white/10 pt-3">
              <div className="text-sm font-medium text-[var(--text)] mb-2">
                Popular Questions
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {SUGGESTED_QUESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestedQuestion(suggestion)}
                    disabled={questions.length >= maxQuestions}
                    className="w-full text-left px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--accent)]/10 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Helper text */}
      <p className="text-xs text-[var(--muted)] mt-2">
        No restrictions — proceed with any number of questions you'd like answered.
      </p>
    </div>
  );
}
