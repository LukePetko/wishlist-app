import type { Dispatch, FC, SetStateAction } from 'react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

type FiltersDesktopProps = {
  isBought: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  handleToggle: () => void;
  handleLogout: () => void;
};

const FiltersDesktop: FC<FiltersDesktopProps> = ({
  isBought,
  filter,
  setFilter,
  handleToggle,
}) => {
  return (
    <div className="flex justify-between border-gray-200 border p-2 rounded-md shadow-lg">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          className="max-w-64"
          placeholder="Hľadať..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoComplete="wishlist-filter"
        />
        {/** biome-ignore lint/correctness/useUniqueElementIds: id is used for labelling */}
        <Checkbox
          checked={isBought}
          onCheckedChange={handleToggle}
          aria-label="isBought"
          id="isBought"
        />
        <label className="flex items-center gap-2 w-full" htmlFor="isBought">
          <span className="text-sm">Zobraziť kúpené</span>
        </label>
      </div>
    </div>
  );
};

export default FiltersDesktop;
