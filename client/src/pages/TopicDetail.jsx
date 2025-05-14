import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicWithEntries } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EntryItem from '../components/EntryItem';
import EntryForm from '../components/EntryForm';

export default function TopicDetail() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [replyingToId, setReplyingToId] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.user_id === 1;
    function EntryThread({ entry, depth = 0, onReplyingTo, replyingToId, onSuccess }) {
        const isReplying = replyingToId === entry.entry_id;

        return (
            <div style={{ position: 'relative', paddingLeft: '16px' }}>
                {/* Thread line (for nested replies) */}
                {depth > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            borderLeft: '2px solid #cecece',
                            marginLeft: `${(depth - 1) * 24}px`,
                        }}
                    />
                )}

                {/* Entry box with indentation */}
                <div style={{ marginLeft: `${depth * 24}px`, marginBottom: '16px' }}>
                    <div
                        style={{
                            border: '1px solid #e5e7eb', // Tailwind's border-gray-200
                            padding: '16px',
                            paddingLeft: '16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // shadow-sm
                        }}
                    >
                        <EntryItem entry={entry} onReply={() => onReplyingTo(entry.entry_id)} />
                    </div>

                    {isReplying && (
                        <div style={{ marginLeft: '16px', marginTop: '8px' }}>
                            <EntryForm
                                topicId={entry.topic_id}
                                parentId={entry.entry_id}
                                onSuccess={(newEntry) => {
                                    onReplyingTo(null);
                                    onSuccess(newEntry);
                                }}
                                onCancel={() => onReplyingTo(null)}
                            />
                        </div>
                    )}
                </div>

                {/* Recursively render replies */}
                {entry.replies.map((reply) => (
                    <EntryThread
                        key={reply.entry_id}
                        entry={reply}
                        depth={depth + 1}
                        onReplyingTo={onReplyingTo}
                        replyingToId={replyingToId}
                        onSuccess={onSuccess}
                    />
                ))}
            </div>

        );
    }

    const fetchTopic = async () => {
        try {
            const { data } = await getTopicWithEntries(topicId);
            const commentLength = data.entries.length;
            // Organize entries into thread structure
            const entryMap = {};
            const rootEntries = [];

            // Initialize map
            data.entries.forEach(entry => {
                entry.replies = [];
                entryMap[entry.entry_id] = entry;
            });

            // Nest replies
            data.entries.forEach(entry => {
                if (entry.entry_parent_id != null) {
                    const parent = entryMap[entry.entry_parent_id];
                    if (parent) {
                        parent.replies.push(entry);
                    }
                } else {
                    rootEntries.push(entry);
                }
            });

            const sortByDateDesc = (entries) => {
                entries.sort((a, b) => new Date(b.entry_created_at) - new Date(a.entry_created_at));
                entries.forEach(e => sortByDateDesc(e.replies));
            };

            sortByDateDesc(rootEntries)
            setData({ ...data, entries: rootEntries, commentLength: commentLength });
        } catch (err) {
            console.error('Failed to fetch topic:', err);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
        fetchTopic();
    }, [topicId, navigate]);

    if (loading) return <div>Loading topic...</div>;
    if (!data) return <div>Topic not found</div>;

    return (
        <div
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                maxWidth: '1024px',
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '40px',
                paddingBottom: '40px'
            }}
        >
            {/* Back Button */}
            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        color: '#2563eb',
                        textDecoration: 'underline',
                        marginBottom: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                    }}
                >
                    Back to Topics
                </button>
            </div>

            {/* Topic Header */}
            <div
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '40px'
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        fontSize: '20px',
                        fontWeight: '500',
                        color: '#4b5563',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        marginBottom: '8px'
                    }}
                >
                    {data.topic.course_name}
                </span>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                    {data.topic.topic_title}
                </h1>
                <p style={{ color: '#4b5563', lineHeight: '1.75' }}>{data.topic.topic_content}</p>
            </div>

            {/* Discussion Header */}
            <div
                style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h2 style={{ fontSize: '25px', fontWeight: '700', color: '#111827' }}>Discussion</h2>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {data.commentLength} {data.commentLength === 1 ? 'comment' : 'comments'}
                </span>
            </div>

            {/* New Entry Form */}
            {!isAdmin && (
                <div
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        padding: '24px',
                        marginBottom: '32px',
                    }}
                >
                    <EntryForm
                        topicId={topicId}
                        parentId={null}
                        onSuccess={() => {
                            setData('');
                            fetchTopic();
                        }}
                    />
                </div>
            )}

            {/* Entries */}
            <div style={{ marginTop: '24px' }}>
                {data.commentLength === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px', color: '#6b7280' }}>
                        <svg
                            style={{ marginLeft: 'auto', marginRight: 'auto', height: '48px', width: '48px', color: '#d1d5db', marginBottom: '12px' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <h3 style={{ fontSize: '18px', fontWeight: '500' }}>No comments yet...</h3>
                        {!isAdmin && <p>Be the first to share what you think!</p>}
                    </div>
                ) : (
                    data.entries.map(entry => (
                        <EntryThread
                            key={entry.entry_id}
                            entry={entry}
                            onReplyingTo={setReplyingToId}
                            replyingToId={replyingToId}
                            onSuccess={() => fetchTopic()}
                        />
                    ))
                )}
            </div>
        </div>

    );
}