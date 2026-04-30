'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/Toaster';
import styles from './QAForum.module.css';

interface Answer {
  id: string;
  body: string;
  author: { name: string };
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  body: string;
  author: { name: string };
  createdAt: string;
  _count: { answers: number };
  answers?: Answer[];
  expanded?: boolean;
}

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [asking, setAsking] = useState(false);
  const [answerBody, setAnswerBody] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.getQuestions();
      setQuestions(res.data);
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to ask a question');
    if (!title.trim() || !body.trim()) return toast.error('Title and details are required');

    setAsking(true);
    try {
      await api.askQuestion({ title, body });
      toast.success('Question posted successfully!');
      setTitle('');
      setBody('');
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to post question');
    } finally {
      setAsking(false);
    }
  };

  const loadAnswers = async (id: string, index: number) => {
    const newQs = [...questions];
    if (newQs[index].expanded) {
      newQs[index].expanded = false;
      setQuestions(newQs);
      return;
    }
    try {
      const res = await api.getQuestion(id);
      newQs[index].answers = res.data.answers;
      newQs[index].expanded = true;
      setQuestions(newQs);
    } catch (err) {
      toast.error('Failed to load answers');
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string, index: number) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to answer');
    const ansBody = answerBody[questionId];
    if (!ansBody?.trim()) return toast.error('Answer cannot be empty');

    try {
      await api.answerQuestion(questionId, { body: ansBody });
      toast.success('Answer posted!');
      setAnswerBody(prev => ({ ...prev, [questionId]: '' }));
      const res = await api.getQuestion(questionId);
      const newQs = [...questions];
      newQs[index].answers = res.data.answers;
      newQs[index]._count.answers = res.data.answers?.length || 0;
      setQuestions(newQs);
    } catch (err: any) {
      toast.error(err.message || 'Failed to post answer');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        
        <header className={styles.headerSection}>
          <div className={styles.iconBox}>💬</div>
          <h1 className={styles.title}>Q&A Discussion Forum</h1>
          <p className={styles.subtitle}>Ask questions, share advice, and connect with other students across India.</p>
        </header>

        <div className={styles.askQuestionCard}>
          <h2 className={styles.formTitle}>
            <span>✏️</span> Ask a New Question
          </h2>
          <form onSubmit={handleAskQuestion}>
            <input 
              type="text" 
              placeholder="What do you want to ask? (e.g., Which is better for CSE, VIT or Manipal?)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={styles.inputField}
            />
            <textarea 
              placeholder="Add more details to help people answer..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={3}
              className={styles.inputField}
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={asking || !title.trim() || !body.trim()}
                className={styles.postBtn}
              >
                {asking ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>

        <div className={styles.questionsList}>
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-500 w-full">
              No questions yet. Be the first to ask!
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
                <div className="p-6 md:p-8 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => loadAnswers(q.id, index)}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {q.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-sm font-bold text-gray-900">{q.author.name}</div>
                    <div className="text-xs font-medium text-gray-500">• {formatDate(q.createdAt)}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{q.title}</h3>
                  <p className="text-gray-600 font-medium mb-4">{q.body}</p>
                  
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    {q._count.answers} {q._count.answers === 1 ? 'Answer' : 'Answers'}
                  </div>
                </div>

                {q.expanded && (
                  <div className="bg-gray-50 border-t border-gray-100 p-6 md:p-8">
                    <div className="space-y-6 mb-8">
                      {q.answers && q.answers.length > 0 ? (
                        q.answers.map(ans => (
                          <div key={ans.id} className="flex gap-4">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {ans.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-gray-900 text-sm">{ans.author.name}</span>
                                <span className="text-xs font-medium text-gray-500">{formatDate(ans.createdAt)}</span>
                              </div>
                              <p className="text-gray-700 font-medium text-sm">{ans.body}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm italic">No answers yet.</div>
                      )}
                    </div>

                    <form onSubmit={(e) => handleAnswerSubmit(e, q.id, index)} className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Write your answer..."
                        value={answerBody[q.id] || ''}
                        onChange={e => setAnswerBody(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button 
                        type="submit"
                        disabled={!answerBody[q.id]?.trim()}
                        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-xl transition-colors text-sm"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
