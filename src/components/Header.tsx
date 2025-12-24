import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentUser: any;
  onAuthClick: () => void;
  onLogout: () => void;
  onMenuClick: () => void;
}

export default function Header({ currentUser, onAuthClick, onLogout, onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Поиск:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0F0F0F] border-b border-[#272727] z-50 flex items-center px-4 gap-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-[#272727]"
          onClick={onMenuClick}
        >
          <Icon name="Menu" size={24} />
        </Button>
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center font-bold text-lg">
            Ю
          </div>
          <span className="text-xl font-semibold hidden sm:block">ЮтубКости</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto hidden md:flex gap-2">
        <div className="flex-1 flex">
          <Input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none border-[#272727] bg-[#121212] focus:border-blue-500"
          />
          <Button 
            type="submit"
            variant="outline"
            className="rounded-l-none border-[#272727] bg-[#222222] hover:bg-[#333333] px-6"
          >
            <Icon name="Search" size={20} />
          </Button>
        </div>
        <Button 
          variant="outline"
          size="icon"
          className="border-[#272727] bg-[#222222] hover:bg-[#333333] hidden lg:flex"
        >
          <Icon name="Mic" size={20} />
        </Button>
      </form>

      <div className="flex items-center gap-1 sm:gap-2">
        {currentUser ? (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-[#272727]"
              onClick={() => navigate('/studio')}
            >
              <Icon name="Video" size={24} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-[#272727]"
            >
              <Icon name="Bell" size={24} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#282828] border-[#3f3f3f]">
                <div className="px-2 py-3 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentUser.name}</span>
                    <span className="text-xs text-gray-400">{currentUser.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-[#3f3f3f]" />
                <DropdownMenuItem onClick={() => navigate('/studio')} className="cursor-pointer">
                  <Icon name="Video" size={18} className="mr-2" />
                  ЮтубКости Студио
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/library')} className="cursor-pointer">
                  <Icon name="Library" size={18} className="mr-2" />
                  Моя библиотека
                </DropdownMenuItem>
                {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <>
                    <DropdownMenuSeparator className="bg-[#3f3f3f]" />
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <Icon name="Shield" size={18} className="mr-2" />
                      {currentUser.role === 'admin' ? 'Админ-панель' : 'Модерация'}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-[#3f3f3f]" />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-400">
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button 
            onClick={onAuthClick}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
          >
            <Icon name="User" size={18} className="mr-2" />
            Войти
          </Button>
        )}
      </div>
    </header>
  );
}