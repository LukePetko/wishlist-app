'use client';
import { useAtom } from 'jotai';
import isLoggedInAtom from '@/jotai/loggenInAtom';
import PasswordModal from './PasswordModal';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const handleLogout = async () => {
    const res = await fetch('/api/logout');
    if (res.status === 200) {
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn) {
    return (
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        Odhlásiť
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <PasswordModal>
      <Button variant="outline">Rezervovať darčeky 🎁</Button>
    </PasswordModal>
  );
};

export default LoginButton;
