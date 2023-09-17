import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '../ui/input';
import { Tag, TagIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { createLabel } from '@/lib/create-label';
import useBoardStore from '@/hooks/use-board-store';
import { Label } from '@prisma/client';
import LabelBadge from '../LabelBadge';
import { addCardLabelPrisma } from '@/lib/add-card-label-prisma';

interface AddCardLabelsProps {
  cardId: string;
  listId: string;
  boardId: string;
}

const LABEL_COLORS = [
  { name: 'green', value: '#219653' },
  { name: 'yellow', value: '#F2C94C' },
  { name: 'orange', value: '#F2994A' },
  { name: 'red', value: '#EB5757' },
  { name: 'blue', value: '#2F80ED' },
  { name: 'cyan', value: '#56CCF2' },
  { name: 'mint', value: '#6FCF97' },
  { name: 'black', value: '#333333' },
  { name: 'gray', value: '#4F4F4F' },
  { name: 'light gray', value: '#828282' },
  { name: 'lighter gray', value: '#BDBDBD' },
  { name: 'lightest gray', value: '#E0E0E0' },
];
type Color = {
  name: string;
  value: string;
};

const AddCardLabels = ({ cardId, listId, boardId }: AddCardLabelsProps) => {
  const [labelBody, setLabelBody] = useState('');
  const [color, setColor] = useState<Color>();
  const [isOpen, setIsOpen] = useState(false);
  const { board, addBoardLabel, addCardLabel } = useBoardStore();

  const handleAddLabel = async () => {
    if (!color || !labelBody) return;
    // create label on prisma link to cardId and boardId
    const labelFromPrisma = await createLabel({
      cardId: cardId,
      boardId: boardId,
      color,
      labelBody,
    });
    // update store, both board->Labels and  board->list->card->label
    if (!labelFromPrisma) return;
    addCardLabel(listId, cardId, labelFromPrisma);
    addBoardLabel(boardId, labelFromPrisma);
    setIsOpen(false);
  };

  const addExistingLabel = async (label: Label) => {
    await addCardLabelPrisma(cardId, label);
    addCardLabel(listId, cardId, label);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full !justify-items-start !justify-start">
          <Tag className="mr-2 h-4 w-4" />
          Labels
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <h3>Label</h3>
        <p>Select a name and color</p>
        <Input
          value={labelBody}
          placeholder="Enter your label..."
          onChange={(e) => setLabelBody(e.target.value)}
        />
        <div className="grid grid-cols-4 grid-flow-row gap-2">
          {LABEL_COLORS.map((labelColor, index) => (
            <div
              key={index}
              onClick={() => setColor(LABEL_COLORS[index])}
              style={{ backgroundColor: labelColor.value }}
              className={`w-full rounded-md h-[27px] hover:cursor-pointer ${
                labelColor.name === color?.name && 'border-white border-2'
              } `}></div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {/*  Colors        */}
          <p className="flex flex-row gap-2 text-gray-400">
            <TagIcon />
            Available
          </p>
          <div className="flex flex-row flex-wrap gap-2">
            {board?.labels?.map((label: Label) => (
              // <div key={label.id}>{label.body}</div>
              <div
                className="hover:cursor-pointer"
                key={label.id}
                onClick={() => addExistingLabel(label)}>
                <LabelBadge label={label} />
              </div>
            ))}
          </div>
          {/* list available labels in board */}
        </div>
        <Button onClick={handleAddLabel}>Add</Button>
      </PopoverContent>
    </Popover>
  );
};

export default AddCardLabels;
