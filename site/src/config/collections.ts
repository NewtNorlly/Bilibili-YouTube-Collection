export type CollectionKind = 'creator' | 'series' | 'library';

export interface CollectionConfig {
  kind: CollectionKind;
  description?: string;
}

const collectionOverrides: Record<string, CollectionConfig> = {
  微信读书: {
    kind: 'library',
    description: '微信读书划线、笔记与书评归档。',
  },
  '于丹品读《论语》': {
    kind: 'series',
  },
  哔哩名人演讲录: {
    kind: 'series',
  },
};

const defaultCollection: CollectionConfig = { kind: 'creator' };

export function getCollectionConfig(name: string): CollectionConfig {
  return collectionOverrides[name] ?? defaultCollection;
}
