import broodjes from './broodjes.js';
import speciaal from './speciaal.js';
import paninis from './paninis.js';
import wraps from './wraps.js';
import salades from './salades.js';

const SIZES = ['Small', 'Medium', 'Large'];
const PLACE = ['Ter plaatse', 'Mee te nemen'];

export const categories = [
  { id: 'broodjes', label: 'Broodjes', options: SIZES, items: broodjes },
  { id: 'speciaal', label: 'Speciaal', options: SIZES, items: speciaal },
  { id: 'paninis', label: 'Panini’s', options: PLACE, items: paninis },
  { id: 'wraps', label: 'Wraps', options: PLACE, items: wraps },
  { id: 'salades', label: 'Salades', options: PLACE, items: salades },
];

export const lookup = Object.fromEntries(
  categories.flatMap((c) => c.items.map((i) => [i.id, { item: i, options: c.options }]))
);