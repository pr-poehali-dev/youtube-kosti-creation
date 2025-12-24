import VideoCard from '@/components/VideoCard';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Navigate } from 'react-router-dom';

interface LibraryPageProps {
  currentUser: any;
}

const savedVideos = Array.from({ length: 8 }, (_, i) => ({
  id: `saved-${i + 1}`,
  title: 'Сохранённое видео ' + (i + 1),
  thumbnail: `https://picsum.photos/seed/saved${i}/640/360`,
  channel: 'Channel' + (i + 1),
  channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=saved${i}`,
  views: Math.floor(Math.random() * 500000) + 1000,
  uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  verified: i % 2 === 0,
}));

const playlists = [
  { id: '1', name: 'Любимые видео', count: 24, thumbnail: 'https://picsum.photos/seed/playlist1/320/180' },
  { id: '2', name: 'Смотреть позже', count: 12, thumbnail: 'https://picsum.photos/seed/playlist2/320/180' },
  { id: '3', name: 'Обучение', count: 8, thumbnail: 'https://picsum.photos/seed/playlist3/320/180' },
];

export default function LibraryPage({ currentUser }: LibraryPageProps) {
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Библиотека</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Плейлисты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="bg-[#181818] border-[#272727] cursor-pointer hover:bg-[#272727] transition-colors">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.name}
                    className="w-full aspect-video object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Icon name="PlayCircle" size={48} className="text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-sm font-semibold">
                    {playlist.count} видео
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{playlist.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Сохранённые видео</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {savedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
