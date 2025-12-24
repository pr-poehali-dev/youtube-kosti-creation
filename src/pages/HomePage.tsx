import VideoCard from '@/components/VideoCard';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  currentUser: any;
}

const categories = ['Все', 'Игры', 'Музыка', 'Фильмы', 'Новости', 'Спорт', 'Образование', 'Технологии', 'Кулинария'];

const mockVideos = Array.from({ length: 20 }, (_, i) => ({
  id: `video-${i + 1}`,
  title: [
    'Как создать свой YouTube канал с нуля',
    'ТОП 10 фишек React в 2024 году',
    'Готовим пиццу как в ресторане',
    'Обзор нового MacBook Pro M3',
    'Путешествие по Италии',
    'Тренировка для начинающих',
    'История искусства за 10 минут',
    'Лучшие игры 2024 года',
  ][i % 8],
  thumbnail: `https://picsum.photos/seed/video${i}/640/360`,
  channel: ['TechReview', 'CodeMaster', 'FoodLab', 'GamerZone', 'TravelVlog'][i % 5],
  channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=channel${i}`,
  views: Math.floor(Math.random() * 1000000) + 1000,
  uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  verified: i % 3 === 0,
}));

export default function HomePage({ currentUser }: HomePageProps) {
  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => (
          <Button
            key={category}
            variant={index === 0 ? 'default' : 'outline'}
            className={
              index === 0
                ? 'bg-white text-black hover:bg-gray-200 whitespace-nowrap'
                : 'bg-[#272727] border-[#272727] hover:bg-[#3f3f3f] whitespace-nowrap'
            }
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
