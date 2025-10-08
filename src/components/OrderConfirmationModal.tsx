import { type FC, type PropsWithChildren, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/app/actions';
import type { WishlistItem } from '@/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';

type OrderConfirmationModalProps = {
  item: WishlistItem;
};

const OrderConfirmationModal: FC<
  PropsWithChildren<OrderConfirmationModalProps>
> = ({ item, children }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  const router = useRouter();

  const order = async () => {
    const response = await createOrder({ itemId: item.id, note });

    if (response.ok) {
      router.refresh();
      toast.success(`Darček "${item.name}" bol označený ako objednaný`);
      return;
    }

    switch (response.error) {
      case 'ALREADY_ORDERED':
        toast.error('Niekto iný už predmet rezervoval, prosím obnov stránku');
        break;
      default:
        toast.error('Pri rezervovaní nastala chyba');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        {children}
      </DialogTrigger>
      <DialogContent className="w-11/12 md:w-1/3 p-8 max-h-[75vh] overflow-y-auto">
        <h3 className="text-xl font-semibold">Potvrdenie objednávania</h3>
        <p className="text-sm text-gray-500">
          Naozaj chceš nastaviť tento darček ako objednaný? Táto akcia je
          nezvratná.
        </p>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Poznámka</h4>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tu môžeš zadať poznámku (voliteľné)"
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Zrušiť
          </Button>
          <Button className="flex-1" onClick={order}>
            Nastaviť ako objendané
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;
