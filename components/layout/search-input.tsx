import { Input } from '@/components/ui/input';
import { useDebounceValue } from '@/hooks/use-debounce-value';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

const SearchInput = () => {
  const router = useRouter();
  const params = useSearchParams();
  const title = params.get('title');
  const [value, setValue] = useState(title || '');

  const debounceValue = useDebounceValue<string>(value);

  useEffect(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      title: debounceValue,
    };
    const url = queryString.stringifyUrl(
      {
        url: window.location.href,
        query: updatedQuery,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
    router.push(url);
  }, [debounceValue, params, router]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative hidden sm:block">
      <Search className="absolute top-3 left-4 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={handleOnChange}
        placeholder="Search"
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchInput;
