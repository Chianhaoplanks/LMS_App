import TopicCard from './TopicCard';

export default function TopicList({ topics }) {
  if (!topics || topics.length === 0) {
    return <div className="text-gray-500">No topics yet</div>;
  }

  return (
    <div>
      {topics.map(topic => (
        <TopicCard key={topic.topic_id} topic={topic} />
      ))}
    </div>
  );
}