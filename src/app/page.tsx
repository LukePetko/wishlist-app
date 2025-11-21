import { eq, exists, inArray, or } from 'drizzle-orm';
import Filters from '@/components/Filters';
import List from '@/components/List';
import LoginButton from '@/components/LoginButton';
import { db } from '@/drizzle';
import {
  categories as categoriesTable,
  difficultyLevels as difficultyLevelsTable,
  wishlistItems,
  wishlistItemsCategories,
} from '@/drizzle/schema';
import ENV from '@/lib/env';
import { mockOrders } from '@/mocks';
import convertToEur from '@/utils/convertToEur';
import ResetFilters from '@/components/ResetFilters';

const Wishlist = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const awaitedSearchParams = await searchParams;
  const isBought = awaitedSearchParams.bought === 'true';
  const filter = awaitedSearchParams.filter as string | undefined;
  const sort = (awaitedSearchParams.sort as string | undefined)?.split('.');
  const difficulty = (
    awaitedSearchParams.difficulty as string | undefined
  )?.split(',');
  const category = (awaitedSearchParams.category as string | undefined)?.split(
    ',',
  );

  const data = await db.query.wishlistItems.findMany({
    where: (wishlist, { eq, and, ilike }) => {
      const conditions = [!isBought ? eq(wishlist.isBought, false) : undefined];

      if (filter) {
        conditions.push(ilike(wishlist.name, `%${filter}%`));
      }

      if (difficulty) {
        conditions.push(
          or(...difficulty.map((d) => eq(wishlist.difficultyLevel, d))),
        );
      }

      if (category) {
        conditions.push(
          exists(
            db
              .select()
              .from(wishlistItemsCategories)
              .where(
                and(
                  eq(wishlistItemsCategories.itemId, wishlist.id),
                  inArray(wishlistItemsCategories.categoryId, category),
                ),
              ),
          ),
        );
      }

      return and(...conditions.filter((c) => c !== undefined));
    },
    with: {
      links: {
        with: {
          store: true,
        },
      },
      orders: ENV.MOCK_ORDERS ? undefined : true,
      categories: {
        with: {
          category: true,
        },
      },
      difficultyLevel: true,
    },
    orderBy: (wishlist, { asc, desc }) => {
      if (sort) {
        const [id, dir] = sort;

        if (id === 'name') {
          return [dir === 'asc' ? asc(wishlist.name) : desc(wishlist.name)];
        } else if (id === 'lowestPrice') {
          // This is a placeholder, as we can't directly sort by the calculated lowestPrice.
          // We will sort the data after fetching it.
        }
      }
      return [];
    },
  });

  const processedData = await Promise.all(
    data.map(async (item) => {
      const convertedLinks = await Promise.all(
        item.links.map(async (link) => ({
          ...link,
          priceEur:
            link.currency === 'EUR'
              ? link.price
              : (await convertToEur(+link.price, link.currency))
                  .toFixed(2)
                  .toString(),
        })),
      );

      const categories = item.categories.map((c) => c.category);

      const lowestPrice = convertedLinks.reduce((acc, curr) => {
        if (+acc.priceEur > +curr.priceEur) {
          return curr;
        }
        return acc;
      });

      const orders = ENV.MOCK_ORDERS
        ? (mockOrders.find((o) => o.id === item.id)?.orders ?? [])
        : item.orders;

      const isOrdered = orders.length > 0;

      return {
        ...item,
        categories,
        links: convertedLinks,
        isOrdered,
        orders,
        lowestPrice,
      };
    }),
  );

  const difficultyLevels = await db
    .select()
    .from(difficultyLevelsTable)
    .execute();

  const categories = await db
    .select()
    .from(categoriesTable)
    .where(
      exists(
        db
          .select()
          .from(wishlistItemsCategories)
          .where(eq(wishlistItemsCategories.categoryId, categoriesTable.id)),
      ),
    )
    .execute();

  if (sort && sort[0] === 'lowestPrice') {
    processedData.sort((a, b) => {
      if (sort[1] === 'asc') {
        return +a.lowestPrice - +b.lowestPrice;
      } else {
        return +b.lowestPrice - +a.lowestPrice;
      }
    });
  }

  return (
    <div className="py-12 max-w-7xl mx-auto flex flex-col gap-2 px-4">
      <div className="flex items-baseline gap-2 mb-4">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="text-sm text-gray-500">
          Vitaj na mojom zozname želaní 🥰
        </p>
      </div>
      <p className="text-md text-gray-500 pb-12">
        Ceny môžu byť aj nižšie, najmä pred Vianocami na Black Friday. 🎄
      </p>
      <div className="flex w-full justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Filters
            difficultyLevels={difficultyLevels}
            categories={categories}
          />
          <ResetFilters />
        </div>
        <LoginButton />
      </div>
      <List items={processedData} />
    </div>
  );
};

export default Wishlist;
