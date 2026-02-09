export interface BundleItem {
  itemTypeId: string;
  itemTypeName: string;
  itemId: string;
  itemName: string;
  itemDescription: string;
  itemAmount: number;
}

export interface SaveBundleItemsRequest {
  bundleId: string;
  items: { itemId: string; number: number }[];
}

export interface BundlePickListItem {
  itemId: string;
  itemName: string;
  itemDescription: string;
  itemTypeName: string;
  number: number;
}
