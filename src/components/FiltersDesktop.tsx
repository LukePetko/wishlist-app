'use client';
import { Settings2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FC, useCallback, useEffect, useState } from 'react';
import type { categories, difficultyLevels } from '@/drizzle/schema';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Input } from './ui/input';
import { Toggle } from './ui/toggle';
import { ToggleGroup } from './ui/toggle-group';

type FiltersDesktopProps = {
  difficultyLevels: (typeof difficultyLevels.$inferSelect)[];
  categories: (typeof categories.$inferSelect)[];
};

const FiltersDesktop: FC<FiltersDesktopProps> = ({
  difficultyLevels,
  categories,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const difficultyParams = params.get('difficulty');
  const categoryParams = params.get('category');
  const isBought = searchParams.get('bought') === 'true';
  const initialFilter = searchParams.get('filter') ?? '';
  const [filter, setFilter] = useState(initialFilter);
  const debouncedFilter = useDebounce(filter);

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
    (checkboxId: string, isChecked: boolean) => {
      const params = new URLSearchParams(searchParams);
      const ids = params.get('difficulty')?.split(',') ?? [];

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
    (checkboxId: string, isChecked: boolean) => {
      const params = new URLSearchParams(searchParams);
      const ids = params.get('category')?.split(',') ?? [];

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

  return (
    <Collapsible
      title="Filter"
      className="w-full flex flex-col gap-2 items-end"
    >
      <CollapsibleTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="text-sm">Filter</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <div className="flex justify-between border-gray-200 border py-3 pl-3 pr-4 rounded-md shadow-lg w-full">
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Náročnosť</p>
                <ToggleGroup type="single" className="flex flex-wrap gap-2">
                  {deduplicatedDifficultyLevels.map((d) => (
                    <Toggle
                      key={d.id}
                      value={d.id}
                      pressed={difficultyParams?.includes(d.id)}
                      onPressedChange={(e) => handleDifficultyChange(d.id, e)}
                    >
                      {d.name}
                    </Toggle>
                  ))}
                </ToggleGroup>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Kategória</p>
                <ToggleGroup type="single" className="flex flex-wrap gap-2">
                  {deduplicatedCategories.map((d) => (
                    <Toggle
                      key={d.id}
                      value={d.id}
                      pressed={categoryParams?.includes(d.id)}
                      onPressedChange={(e) => handleCategoryToggle(d.id, e)}
                    >
                      {d.name}
                    </Toggle>
                  ))}
                </ToggleGroup>
              </div>
              <label
                className="flex items-center gap-2 self-start"
                htmlFor="isBought"
              >
                {/** biome-ignore lint/correctness/useUniqueElementIds: id is used for labelling */}
                <Checkbox
                  checked={isBought}
                  onCheckedChange={handleDifficultyToggle}
                  aria-label="isBought"
                  id="isBought"
                />
                <span className="text-sm">Zobraziť aj už kúpené</span>
              </label>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FiltersDesktop;
