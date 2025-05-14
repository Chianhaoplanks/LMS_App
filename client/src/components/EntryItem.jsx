import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function EntryItem({ entry, onReply }) {
    const [showReplies, setShowReplies] = useState(false);
    const { user } = useAuth();

    const isAdmin = user?.user_id === 1;

    return (
        <div
            style={{
                paddingLeft: entry.entry_parent_id ? '32px' : '16px',
                marginBottom: '16px'
            }}
        >
            <div
                style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h4 style={{ fontWeight: '500' }}>{entry.user_name}</h4>
                        <p style={{ color: '#4b5563', marginTop: '4px' }}>{entry.entry_content}</p>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {format(new Date(entry.entry_created_at), 'MMM d, yyyy')}
                    </span>
                </div>

                {!isAdmin && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => onReply(entry.entry_id)}
                            style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Reply
                        </button>
                    </div>
                )}

                {entry.reply_count > 0 && (
                    <div>
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            style={{
                                fontSize: '12px',
                                color: '#4b5563',
                                textDecoration: 'underline',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {showReplies ? 'Hide replies' : `Show replies (${entry.reply_count})`}
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
}