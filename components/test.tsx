'use client';

import axios from 'axios';
import { Button } from './ui/button';

export const ButtonForMember = () => {
  const onClick = async () => {
    await axios.patch('/api/boards/64f96bc85f3abbca191a9f33', {
      userId: '64f96ad85f3abbca191a9f31',
    });
  };
  return <Button onClick={onClick}>test</Button>;
};
