import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  currentUser: any;
}

const menuItems = [
  { icon: 'Home', label: 'Главная', path: '/' },
  { icon: 'Compass', label: 'Исследуй', path: '/explore' },
  { icon: 'TrendingUp', label: 'Тренды', path: '/trends' },
  { icon: 'Radio', label: 'Подписки', path: '/subscriptions' },
];

const libraryItems = [
  { icon: 'Library', label: 'Библиотека', path: '/library' },
  { icon: 'History', label: 'История', path: '/history' },
  { icon: 'Video', label: 'Мои видео', path: '/studio' },
];

export default function Sidebar({ isOpen, currentUser }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-[#0F0F0F] border-r border-[#272727] overflow-y-auto z-40">
      <nav className="py-2">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-6 px-3 py-2.5 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-[#272727] text-white"
                  : "hover:bg-[#272727]/50 text-gray-300"
              )}
            >
              <Icon name={item.icon as any} size={24} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-[#272727] my-2" />

        <div className="px-3 space-y-1">
          {libraryItems.map((item) => {
            if (item.path === '/studio' && !currentUser) return null;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-6 px-3 py-2.5 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-[#272727] text-white"
                    : "hover:bg-[#272727]/50 text-gray-300"
                )}
              >
                <Icon name={item.icon as any} size={24} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {currentUser && (
          <>
            <div className="border-t border-[#272727] my-2" />
            <div className="px-3">
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-400">Подписки</h3>
              <div className="space-y-1">
                {['TechChannel', 'GameZone', 'MusicVibes'].map((channel) => (
                  <button
                    key={channel}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#272727]/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold">
                      {channel[0]}
                    </div>
                    <span className="text-sm text-gray-300">{channel}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
