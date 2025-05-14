import { useState } from 'react';
import { createEntry } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EntryForm({ topicId, parentId, onSuccess, onCancel }) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await createEntry({
                topic_id: topicId,
                entry_parent_id: parentId,
                entry_content: content,
                entry_posted_by_user_id: user.user_id,
            });
            onSuccess();
        } catch (err) {
            console.error('Failed to post entry:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '12px' }}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your entry..."
                style={{
                    alignSelf: 'center',
                    width: '100%',
                    border: '2px solid #e5e7eb',
                    borderRadius: '5px',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '14px',
                }}
                rows={4}
                required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        opacity: submitting ? '0.5' : '1',
                        backgroundColor: submitting ? '#93c5fd' : '#2563eb',
                    }}
                >
                    {submitting ? 'Posting...' : 'Post Entry'}
                </button>
            </div>
        </form>
    );
}