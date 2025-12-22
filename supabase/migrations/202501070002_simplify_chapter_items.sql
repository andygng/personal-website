alter table chapter_items
  alter column type set default 'entry';

alter table chapter_items
  drop constraint if exists chapter_items_type_check;

alter table chapter_items
  add constraint chapter_items_type_check check (
    type in (
      'entry',
      'statement',
      'timeline_event',
      'link_tile',
      'principle',
      'repeat_item',
      'media_item',
      'spot'
    )
  );
