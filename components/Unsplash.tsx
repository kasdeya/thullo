import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { ImageIcon, SearchIcon } from 'lucide-react';
import { fetchImages } from '@/lib/fetch-images';
import useBoardStore from '@/hooks/use-board-store';
import { updateDbCardCover } from '@/lib/update-db-card-cover';
interface UnsplashProps {
  cardId: string;
  listId: string;
}
const Unsplash = ({ cardId, listId }: UnsplashProps) => {
  const { updateCardCover } = useBoardStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<[]>();
  const handleSearch = async () => {
    try {
      const images = await fetchImages(search);
      setImages(images.results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageClick = async (imageUrl: string) => {
    // update database with prisma to add image url to the card as cover
    updateDbCardCover(cardId, imageUrl);
    // update store to show changes seamlessly in
    updateCardCover(listId, cardId, imageUrl);

    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full !justify-start !justify-items-start">
          <ImageIcon className="mr-2 h-4 w-4" /> Cover
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h3>Photo Search</h3>
        <p>Search for unsplash photos</p>
        <div className="flex w-full max-w-sm items-center my-2">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
          />
          <Button
            className="-ml-10"
            onClick={handleSearch}
            size={'icon'}>
            <SearchIcon />
          </Button>
        </div>
        <div className="grid-cols-4 grid grid-flow-row">
          {images &&
            images.map((image: any) => (
              <Image
                className="!w-[50px] !h-[50px] rounded-md !relative my-2"
                fill
                src={image.urls.regular}
                alt="image from unsplash"
                key={image.id}
                onClick={() => handleImageClick(image.urls.full)}
              />
            ))}
        </div>
        <div></div>
      </PopoverContent>
    </Popover>
  );
};

export default Unsplash;
