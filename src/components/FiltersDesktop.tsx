import type { Dispatch, FC, SetStateAction } from 'react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { difficultyLevels } from '@/drizzle/schema';

type FiltersDesktopProps = {
  difficultyLevels: (typeof difficultyLevels.$inferSelect)[];
  isBought: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  handleToggle: () => void;
  handleLogout: () => void;
};

const FiltersDesktop: FC<FiltersDesktopProps> = ({
  difficultyLevels,
  isBought,
  filter,
  setFilter,
  handleToggle,
}) => {
  const deduplicatedDifficultyLevels = Array.from(
    new Map(difficultyLevels.map((item) => [item.id, item])).values(),
  );
  return (
    <div className="flex justify-between border-gray-200 border py-3 pl-3 pr-4 rounded-md shadow-lg">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            className="max-w-64"
            placeholder="Hľadať..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoComplete="wishlist-filter"
          />
          <Select>
            <SelectTrigger className="flex items-center gap-2 w-full">
              <SelectValue placeholder="Náročnosť" />
            </SelectTrigger>
            <SelectContent>
              {deduplicatedDifficultyLevels.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div />
        </div>
        <label className="flex items-center gap-2" htmlFor="isBought">
          {/** biome-ignore lint/correctness/useUniqueElementIds: id is used for labelling */}
          <Checkbox
            checked={isBought}
            onCheckedChange={handleToggle}
            aria-label="isBought"
            id="isBought"
          />
          <span className="text-sm">Zobraziť aj už kúpené</span>
        </label>
      </div>
    </div>
  );
};

export default FiltersDesktop;
