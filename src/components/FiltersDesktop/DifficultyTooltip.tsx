import { CircleQuestionMark } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const DifficultyTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleQuestionMark className="h-3 w-3 text-gray-500" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          Pri výbere náročnosti zohľadňujem nasledujúce faktory:
        </p>
        <ul className="list-disc pl-4 text-sm">
          <li>
            <span className="font-bold">Ľahká</span>: Linky na overené slovenské
            obchody, dá sa len jednoducho objednať
          </li>
          <li>
            <span className="font-bold">Stredná</span>: Linky na zahraničné
            obchody v rámci európy, relatívne ľahko sa dajú objednať
          </li>
          <li>
            <span className="font-bold">Ťažká</span>:
            Ázijské/Americké/Austrálske obchody. Môžu obsahovať clo, dane, drahé
            poštovné, atď. Treba si dávať pozor na podmienky
          </li>
          <li>
            <span className="font-bold">Extra ťažká</span>: Z ďaleka najťažsia
            kategória. Zberateľské predmety, často nedostupné/bez linku. Nedajú
            sa len tak objednať.
          </li>
        </ul>
      </TooltipContent>
    </Tooltip>
  );
};

export default DifficultyTooltip;
