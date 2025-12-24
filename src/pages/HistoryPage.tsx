import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Navigate } from 'react-router-dom';

interface HistoryPageProps {
  currentUser: any;
}

const historyVideos = Array.from({ length: 15 }, (_, i) => ({
  id: `history-${i + 1}`,
  title: 'Просмотренное видео ' + (i + 1),
  thumbnail: `https://picsum.photos/seed/history${i}/640/360`,
  channel: 'Channel' + (i + 1),
  channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=history${i}`,
  views: Math.floor(Math.random() * 500000) + 1000,
  uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  verified: i % 3 === 0,
}));

export default function HistoryPage({ currentUser }: HistoryPageProps) {
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">История просмотров</h1>
        <Button variant="outline" className="border-[#3f3f3f] text-red-400">
          <Icon name="Trash2" size={18} className="mr-2" />
          Очистить историю
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {historyVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
