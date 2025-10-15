/* eslint-disable react-hooks/exhaustive-deps */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: intentonal */
/** biome-ignore-all lint/correctness/useUniqueElementIds: used for labelling */
'use client';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { CircleCheck, Settings2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { categories, difficultyLevels } from '@/drizzle/schema';
import { useDebounce } from '@/hooks/useDebounce';
import { useMd } from '@/hooks/useMd';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Input } from '../ui/input';
import { Popover, PopoverContent } from '../ui/popover';
import DifficultyTooltip from './DifficultyTooltip';

type FiltersProps = {
  difficultyLevels: (typeof difficultyLevels.$inferSelect)[];
  categories: (typeof categories.$inferSelect)[];
};

const Filters: FC<FiltersProps> = ({ difficultyLevels, categories }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMd = useMd();

  const difficultyParams = searchParams.get('difficulty');
  const categoryParams = searchParams.get('category');
  const isBought = searchParams.get('bought') === 'true';

  const [filter, setFilter] = useState(searchParams.get('filter') ?? '');
  const debouncedFilter = useDebounce(filter);

  const skipNextDebouncedWriteRef = useRef(false);

  useEffect(() => {
    const next = searchParams.get('filter') ?? '';
    if (next !== filter) {
      skipNextDebouncedWriteRef.current = true;
      setFilter(next);
    }
  }, [searchParams]);

  const deduplicatedDifficultyLevels = useMemo(
    () => Array.from(new Map(difficultyLevels.map((i) => [i.id, i])).values()),
    [difficultyLevels],
  );
  const deduplicatedCategories = useMemo(
    () => Array.from(new Map(categories.map((i) => [i.id, i])).values()),
    [categories],
  );

  const pushParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams);
      mutate(params);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, searchParams, pathname],
  );

  const handleBoughtToggle = useCallback(() => {
    pushParams((p) => {
      const next = (!isBought).toString();
      if (next === 'false') p.delete('bought');
      else p.set('bought', next);
    });
  }, [isBought, pushParams]);

  const handleDifficultyChange = useCallback(
    (checkboxId: string) => {
      pushParams((p) => {
        const ids = p.get('difficulty')?.split(',').filter(Boolean) ?? [];
        const idx = ids.indexOf(checkboxId);
        if (idx === -1) ids.push(checkboxId);
        else ids.splice(idx, 1);
        ids.length
          ? p.set('difficulty', ids.join(','))
          : p.delete('difficulty');
      });
    },
    [pushParams],
  );

  const handleCategoryToggle = useCallback(
    (checkboxId: string) => {
      pushParams((p) => {
        const ids = p.get('category')?.split(',').filter(Boolean) ?? [];
        const idx = ids.indexOf(checkboxId);
        if (idx === -1) ids.push(checkboxId);
        else ids.splice(idx, 1);
        ids.length ? p.set('category', ids.join(',')) : p.delete('category');
      });
    },
    [pushParams],
  );

  useEffect(() => {
    if (skipNextDebouncedWriteRef.current) {
      skipNextDebouncedWriteRef.current = false;
      return;
    }
    const urlValue = searchParams.get('filter') ?? '';
    if (debouncedFilter === urlValue) return;
    pushParams((p) => {
      if (debouncedFilter) p.set('filter', debouncedFilter);
      else p.delete('filter');
    });
  }, [debouncedFilter, pushParams, searchParams]);

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
        <Input
          id="filter"
          type="text"
          className="w-full"
          placeholder="Hľadať…"
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
          {deduplicatedDifficultyLevels.map((d) => {
            const active = difficultyParams?.split(',').includes(d.id);
            return (
              <Button
                key={d.id}
                className="rounded-full"
                onClick={() => handleDifficultyChange(d.id)}
                variant={active ? 'default' : 'outline'}
                style={{
                  ...(active && { backgroundColor: d.color ?? '#000' }),
                }}
              >
                {active ? <CircleCheck className="h-4 w-4" /> : null}
                {d.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">Kategória</p>
        <div className="flex flex-wrap gap-2">
          {deduplicatedCategories.map((d) => {
            const active = categoryParams?.split(',').includes(d.id);
            return (
              <Button
                key={d.id}
                className="rounded-full"
                onClick={() => handleCategoryToggle(d.id)}
                variant={active ? 'default' : 'outline'}
              >
                {active ? <CircleCheck className="h-4 w-4" /> : null}
                {d.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={isBought}
          onCheckedChange={handleBoughtToggle}
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
