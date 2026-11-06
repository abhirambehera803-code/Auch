import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  RefreshCw, 
  Lightbulb, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Dumbbell, 
  Award,
  Bot,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, NutritionSummary, DayLog, FoodAlternative, ChatMessage } from '../types';

interface SmartAiPanelProps {
  profile: UserProfile;
  summary: NutritionSummary;
  dayLog: DayLog;
}

export const SmartAiPanel: React.FC<SmartAiPanelProps> = ({
  profile,
  summary,
  dayLog,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'alternatives' | 'chat'>('summary');

  // Daily Insights State
  const [insights, setInsights] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Alternatives State
  const [alternatives, setAlternatives] = useState<FoodAlternative[]>([]);
  const [alternativesLoading, setAlternativesLoading] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${profile.name}! I am CalorieMate AI. Ask me anything about Indian food calories, macro balancing, high-protein vegetarian swaps, or timing your meals!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Insights on mount or when summary changes
  const fetchDailyInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch('/api/ai/daily-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          mealsSummary: summary,
          dayLog,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Fetch Healthier Alternatives
  const fetchAlternatives = async () => {
    setAlternativesLoading(true);
    try {
      // Gather all food names logged today
      const allItems: string[] = [];
      for (const m of ['breakfast', 'lunch', 'dinner', 'snacks'] as const) {
        (dayLog.meals[m] || []).forEach(item => {
          allItems.push(`${item.quantity} ${item.unit} ${item.name}`);
        });
      }

      const res = await fetch('/api/ai/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodItems: allItems.length > 0 ? allItems : ['Samosa', 'White Rice', 'Aloo Paratha', 'Sweet Chai'],
        }),
      });
      const data = await res.json();
      if (data.success && data.alternatives) {
        setAlternatives(data.alternatives);
      }
    } catch (err) {
      console.error('Failed to load alternatives:', err);
    } finally {
      setAlternativesLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyInsights();
    fetchAlternatives();
  }, [summary.totalCalories, profile.id]);

  // Handle Send Chat
  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || inputMessage;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          userProfile: profile,
          currentLogSummary: summary,
        }),
      });
      const data = await res.json();

      if (data.success && data.reply) {
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sender: 'ai',
            text: 'I could not process that question right now. Please try asking again!',
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: 'Connection error with CalorieMate AI.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const sampleQuestions = [
    'How do I reach 80g protein on a vegetarian diet?',
    'Is curd safe to eat at dinner?',
    'What are the best low-calorie Indian evening snacks?',
    'Healthy dinner recipe under 400 calories',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-white">
                  Smart AI Nutritionist
                </h2>
                <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                  Powered by Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Personalized dietary insights, healthier swaps, and instant nutrition chat
              </p>
            </div>
          </div>

          {/* Sub-tabs inside panel */}
          <div className="flex items-center gap-1.5 bg-emerald-900/60 p-1 rounded-2xl border border-emerald-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'summary'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Daily Summary
            </button>
            <button
              onClick={() => setActiveTab('alternatives')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'alternatives'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Healthier Swaps
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Daily Nutrition Summary */}
      {activeTab === 'summary' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Daily Intake Analysis & Diet Quality
            </h3>
            <button
              onClick={fetchDailyInsights}
              disabled={insightsLoading}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${insightsLoading ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
          </div>

          {insightsLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Gemini AI is analyzing your meals, protein targets, and macro balance...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Highlight Grade & Overview Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 border border-emerald-200/80 flex flex-col md:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-800/20 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Diet Grade</span>
                  <span className="text-2xl font-black font-heading">{insights?.dietGrade || 'A'}</span>
                </div>
                <div className="space-y-1 text-center md:text-left flex-1">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {insights?.summaryText ||
                      `You have consumed ${summary.totalCalories} kcal (${summary.percentGoalReached}% of your ${summary.targetCalories} kcal goal). Keep maintaining balanced portions!`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Net calorie burn adjusted for {profile.name} • {profile.goal} mode
                  </p>
                </div>
              </div>

              {/* Protein Breakdown Flagging */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-800">
                      Meal-by-Meal Protein Evaluation
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {summary.totalProtein}g of {summary.targetProtein}g Target
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      High Protein Meals (Good Muscle Support)
                    </p>
                    <p className="text-slate-700 font-medium">
                      {summary.highProteinMeals.length > 0
                        ? summary.highProteinMeals.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')
                        : 'No meals have reached 20g protein yet.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Low Protein Meals (Opportunity to Boost)
                    </p>
                    <p className="text-slate-700 font-medium">
                      {summary.lowProteinMeals.length > 0
                        ? summary.lowProteinMeals.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')
                        : 'All meals have adequate protein density.'}
                    </p>
                  </div>
                </div>

                {insights?.proteinAssessment?.recommendation && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <strong>AI Recommendation:</strong> {insights.proteinAssessment.recommendation}
                  </p>
                )}
              </div>

              {/* Personalized Nutrition Tips */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Personalized Indian Nutrition Tips
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(insights?.tips || [
                    'Combine lentils (dal) with whole grain roti or brown rice for a complete amino acid profile.',
                    'Add a bowl of plain curd or cucumber raita with cumin for healthy probiotics and slower digestion.',
                    'Switch from deep-fried snacks to roasted makhana, chana, or sprouted moong chat.',
                  ]).map((tip: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Healthier Alternatives */}
      {activeTab === 'alternatives' && (
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Healthier Food Alternatives & Smart Swaps
              </h3>
              <p className="text-xs text-slate-500">
                Delicious replacements that save calories and boost high-quality protein
              </p>
            </div>
            <button
              onClick={fetchAlternatives}
              disabled={alternativesLoading}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${alternativesLoading ? 'animate-spin' : ''}`} />
              Refresh Swaps
            </button>
          </div>

          {alternativesLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Finding healthier options for your logged foods...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 line-through">
                      {alt.originalFood}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {alt.caloriesSaved > 0 && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          -{alt.caloriesSaved} kcal
                        </span>
                      )}
                      {alt.proteinBoost > 0 && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          +{alt.proteinBoost}g Protein
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-sm font-extrabold text-emerald-950 font-heading">
                      {alt.betterOption}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {alt.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interactive AI Assistant Chat */}
      {activeTab === 'chat' && (
        <div className="p-6 space-y-4">
          <div className="h-80 overflow-y-auto space-y-3 pr-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4 text-emerald-200" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <User className="w-4 h-4 text-slate-200" />
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-500">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-emerald-200" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Question Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendChat(q)}
                disabled={chatLoading}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 text-[11px] font-medium border border-slate-200 whitespace-nowrap transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask CalorieMate AI about calories, Indian recipes, macros, or diet goals..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={chatLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || chatLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
