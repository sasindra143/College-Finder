'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { College } from '@/lib/types';
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
            <div className={styles.formActions}>
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
            <div className={styles.emptyState}>Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className={styles.emptyState}>
              No questions yet. Be the first to ask!
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className={styles.questionCard}>
                <div className={styles.questionHeader} onClick={() => loadAnswers(q.id, index)}>
                  <div className={styles.authorMeta}>
                    <div className={styles.authorAvatar}>
                      {q.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className={styles.authorName}>{q.author?.name || 'Anonymous'}</div>
                    <div className={styles.postDate}>• {formatDate(q.createdAt)}</div>
                  </div>
                  <h3 className={styles.questionTitle}>{q.title}</h3>
                  <p className={styles.questionBody}>{q.body}</p>
                  
                  <div className={styles.answerCount}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    {q._count?.answers || 0} {(q._count?.answers || 0) === 1 ? 'Answer' : 'Answers'}
                  </div>
                </div>

                {q.expanded && (
                  <div className={styles.answersSection}>
                    <div className={styles.answersList}>
                      {q.answers && q.answers.length > 0 ? (
                        q.answers.map(ans => (
                          <div key={ans.id} className={styles.answerItem}>
                            <div className={styles.answerAvatar}>
                              {ans.author?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className={styles.answerContent}>
                              <div className={styles.answerAuthor}>
                                <span className={styles.answerAuthorName}>{ans.author?.name || 'Anonymous'}</span>
                                <span className={styles.postDate}>{formatDate(ans.createdAt)}</span>
                              </div>
                              <p className={styles.answerBodyText}>{ans.body}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noAnswers}>No answers yet.</div>
                      )}
                    </div>

                    <form onSubmit={(e) => handleAnswerSubmit(e, q.id, index)} className={styles.answerForm}>
                      <input 
                        type="text" 
                        placeholder="Write your answer..."
                        value={answerBody[q.id] || ''}
                        onChange={e => setAnswerBody(prev => ({ ...prev, [q.id]: e.target.value }))}
                        className={styles.answerInput}
                      />
                      <button 
                        type="submit"
                        disabled={!answerBody[q.id]?.trim()}
                        className={styles.answerSubmitBtn}
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
