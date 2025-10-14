'use client';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { CircleCheck, Settings2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FC, useCallback, useEffect, useState } from 'react';
import type { categories, difficultyLevels } from '@/drizzle/schema';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Popover, PopoverContent } from '../ui/popover';
import DifficultyTooltip from './DifficultyTooltip';
import { useMd } from '@/hooks/useMd';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

type FiltersProps = {
  difficultyLevels: (typeof difficultyLevels.$inferSelect)[];
  categories: (typeof categories.$inferSelect)[];
};

const Filters: FC<FiltersProps> = ({ difficultyLevels, categories }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const difficultyParams = params.get('difficulty');
  const categoryParams = params.get('category');
  const isBought = searchParams.get('bought') === 'true';
  const initialFilter = searchParams.get('filter') ?? '';
  const [filter, setFilter] = useState(initialFilter);
  const debouncedFilter = useDebounce(filter);
  const isMd = useMd();

  const deduplicatedDifficultyLevels = Array.from(
    new Map(difficultyLevels.map((item) => [item.id, item])).values(),
  );
  const deduplicatedCategories = Array.from(
    new Map(categories.map((item) => [item.id, item])).values(),
  );

  const handleDifficultyToggle = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    const nextValue = (!isBought).toString();

    if (nextValue === 'false') {
      params.delete('bought'); // optional: remove when false
    } else {
      params.set('bought', nextValue);
    }

    router.push(`?${params.toString()}`);
  }, [isBought, router, searchParams]);

  const handleDifficultyChange = useCallback(
    (checkboxId: string) => {
      const params = new URLSearchParams(searchParams);
      const ids = params.get('difficulty')?.split(',') ?? [];

      const isChecked = !ids.includes(checkboxId);

      if (isChecked) {
        ids.push(checkboxId);
      } else {
        ids.splice(ids.indexOf(checkboxId), 1);
      }

      if (ids.length === 0) {
        params.delete('difficulty');
        router.push(`?${params.toString()}`);
        return;
      }

      params.set('difficulty', ids.join(','));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handleCategoryToggle = useCallback(
    (checkboxId: string) => {
      const params = new URLSearchParams(searchParams);
      const ids = params.get('category')?.split(',') ?? [];

      const isChecked = !ids.includes(checkboxId);

      if (isChecked) {
        ids.push(checkboxId);
      } else {
        ids.splice(ids.indexOf(checkboxId), 1);
      }

      if (ids.length === 0) {
        params.delete('category');
        router.push(`?${params.toString()}`);
        return;
      }

      params.set('category', ids.join(','));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedFilter) {
      params.set('filter', debouncedFilter);
    } else {
      params.delete('filter');
    }
    router.push(`?${params.toString()}`);
  }, [debouncedFilter, router, searchParams]);

  const renderTriggerButton = () => (
    <Button variant="outline" className="flex items-center gap-2">
      <Settings2 className="h-4 w-4" />
      <span className="text-sm">Filter</span>
    </Button>
  );

  const renderContent = () => (
    <div className="flex flex-col justify-between w-full gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="filter" className="text-sm font-semibold">
          Hľadať
        </label>
        {/** biome-ignore lint/correctness/useUniqueElementIds: using id for labelling */}
        <Input
          id="filter"
          type="text"
          className="w-full"
          placeholder="Hľadať..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoComplete="wishlist-filter"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <p className="text-sm font-semibold">Náročnosť</p>
          <DifficultyTooltip />
        </div>
        <div className="flex flex-wrap gap-2">
          {deduplicatedDifficultyLevels.map((d) => (
            <Button
              key={d.id}
              className="rounded-full"
              onClick={() => handleDifficultyChange(d.id)}
              variant={difficultyParams?.includes(d.id) ? 'default' : 'outline'}
            >
              {difficultyParams?.includes(d.id) ? (
                <CircleCheck className="h-4 w-4" />
              ) : null}
              {d.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">Kategória</p>
        <div className="flex flex-wrap gap-2">
          {deduplicatedCategories.map((d) => (
            <Button
              key={d.id}
              className="rounded-full"
              onClick={() => handleCategoryToggle(d.id)}
              variant={categoryParams?.includes(d.id) ? 'default' : 'outline'}
            >
              {categoryParams?.includes(d.id) ? (
                <CircleCheck className="h-4 w-4" />
              ) : null}
              {d.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/** biome-ignore lint/correctness/useUniqueElementIds: id is used for labelling */}
        <Checkbox
          checked={isBought}
          onCheckedChange={handleDifficultyToggle}
          aria-label="isBought"
          id="isBought"
        />
        <label
          className="flex items-center gap-2 self-start"
          htmlFor="isBought"
        >
          <span className="text-sm">Zobraziť aj už kúpené</span>
        </label>
      </div>
    </div>
  );

  if (!isMd) {
    return (
      <Drawer>
        <DrawerTrigger>{renderTriggerButton()}</DrawerTrigger>
        <DrawerContent className="px-4 pb-8 flex flex-col gap-4">
          <h1 className="text-xl font-bold">Filter</h1>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="w-full flex items-start">
      <Popover>
        <PopoverTrigger asChild>{renderTriggerButton()}</PopoverTrigger>
        <PopoverContent align="start" className="w-96">
          {renderContent()}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Filters;
