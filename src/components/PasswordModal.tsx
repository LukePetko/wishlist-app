import { type FC, type PropsWithChildren, useState, FormEvent } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSetAtom } from 'jotai';
import isLoggedInAtom from '@/jotai/loggenInAtom';
import { toast } from 'sonner';

type PasswordModalProps = {
  children: React.ReactNode;
};

const PasswordModal: FC<PropsWithChildren<PasswordModalProps>> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);

  const handleReserveModeButton = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/order-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setIsLoggedIn(true);
      setPassword('');
      return;
    }

    toast.error('Nesprávne heslo');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center" asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="w-11/12 md:w-[400px]!max-w-screen-lg px-12 py-8 max-h-[75vh] overflow-y-auto flex gap-4 flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-3xl">Režim rezervovaných</DialogTitle>
          <p className="text-sm">
            Zadaním hesla budeš môcť označiť vec ako rezervovanú, aby ostatní
            vedeli, že už ju niekto kupuje 🙂
          </p>
        </div>
        <form
          className="flex flex-col gap-2"
          onSubmit={handleReserveModeButton}
        >
          <Input
            className="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="wishlist-password"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setOpen(false);
                setPassword('');
              }}
              variant="outline"
              className="flex-1"
              type="button"
            >
              Zrušiť
            </Button>
            <Button type="submit" className="flex-1">
              Uložiť heslo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
