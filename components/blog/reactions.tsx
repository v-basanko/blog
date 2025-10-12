'use client';

import { bookmarkBlog } from '@/actions/blogs/bookmark-blog';
import { clapBlog } from '@/actions/blogs/clap-blog';
import { BlogWithUser } from '@/components/blog/list-blogs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaBookmark, FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { FaHandsClapping } from 'react-icons/fa6';
import { PiHandsClapping } from 'react-icons/pi';

const Reactions = ({ blog }: { blog: BlogWithUser }) => {
  const [clapCount, setClapCount] = useState(blog._count.claps);
  const [userHasClapped, setUserHasClapped] = useState(!!blog.claps.length);
  const [userHasBookmarked, setUserHasBookmarked] = useState(!!blog.bookmarks.length);

  const router = useRouter();

  const handleClap = async () => {
    setClapCount((prevCount) => (userHasClapped ? prevCount - 1 : prevCount + 1));
    setUserHasClapped((prevState) => !prevState);
    await clapBlog(blog.id);
    router.refresh();
  };

  const handleBookmark = async () => {
    setUserHasBookmarked((prevState) => !prevState);
    await bookmarkBlog(blog.id);
    router.refresh();
  };

  return (
    <div className="flex justify-between items-center w-full text-sm">
      <div className="flex items-center gap-4">
        <span onClick={handleClap} className="mr-4 flex items-center gap-1 cursor-pointer">
          {userHasClapped ? <FaHandsClapping size={20} /> : <PiHandsClapping size={20} />}
          {clapCount}
        </span>
        <span className="mr-4 flex items-center gap-1 cursor-pointer">
          <FaRegComment size={20} />
          {blog._count.comments}
        </span>
      </div>
      <div>
        <span onClick={handleBookmark}>
          {userHasBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
        </span>
      </div>
    </div>
  );
};

export default Reactions;
