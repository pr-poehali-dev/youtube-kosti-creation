import VideoCard from '@/components/VideoCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

interface SubscriptionsPageProps {
  currentUser: any;
}

const subscriptions = [
  { id: '1', name: 'TechChannel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', subscribers: '1.2M' },
  { id: '2', name: 'GameZone', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=game', subscribers: '856K' },
  { id: '3', name: 'MusicVibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=music', subscribers: '2.4M' },
  { id: '4', name: 'FoodLab', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food', subscribers: '543K' },
];

const subscriptionVideos = Array.from({ length: 12 }, (_, i) => ({
  id: `sub-${i + 1}`,
  title: 'Новое видео от подписки ' + (i + 1),
  thumbnail: `https://picsum.photos/seed/sub${i}/640/360`,
  channel: subscriptions[i % subscriptions.length].name,
  channelAvatar: subscriptions[i % subscriptions.length].avatar,
  views: Math.floor(Math.random() * 500000) + 1000,
  uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  verified: true,
}));

export default function SubscriptionsPage({ currentUser }: SubscriptionsPageProps) {
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Подписки</h1>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {subscriptions.map((sub) => (
          <button
            key={sub.id}
            className="flex flex-col items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-20 w-20 ring-2 ring-red-600">
              <AvatarImage src={sub.avatar} />
              <AvatarFallback>{sub.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{sub.name}</span>
            <span className="text-xs text-gray-400">{sub.subscribers}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Последние видео</h2>
        <Button variant="outline" className="border-[#3f3f3f]">
          Управление подписками
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {subscriptionVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
