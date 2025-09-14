import Tag from '@/components/common/tag';
import { tags } from '@/lib/tags';
import { usePathname, useSearchParams } from 'next/navigation';
import './tags.css';

const Tags = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const tag = params.get('tag');

  const isFeedsPage = pathname.includes('/blog/feed');

  if (!isFeedsPage) {
    return null;
  }

  return (
    <div className="border-t">
      <div className="max-w-[1920px] w-full mx-auto px-4 pt-4 pb-0 x1:px-20">
        <div className="flex flex-row items-center justify-start gap-6 sm:gap-12 overflow-x-auto pb-2 tags-container">
          {tags.map((item) => (
            <Tag selected={tag === item || (item === 'All' && !tag)} key={item}>
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
