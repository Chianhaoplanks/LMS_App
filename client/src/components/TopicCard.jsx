import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function TopicCard({ topic }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/topics/${topic.topic_id}`)}
            style={{
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                cursor: 'pointer'
            }}>
            <div>
                <div>
                    <div>
                        <span>
                            {format(new Date(topic.topic_created_at), 'MMM d, yyyy')}
                        </span>
                    </div>

                    <h3>
                        {topic.topic_title}
                    </h3>
                    <p>
                        by {topic.topic_posted_by_user_id}
                    </p>

                    <p>
                        {topic.topic_content}
                    </p>
                </div>
            </div>
        </div>

    );
}