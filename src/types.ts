// Major types

export interface Package<T = object> {
  url: string;
  response: Response;
  json: T;
}

export type PackageInjector = (pkg: Package) => Promise<Response>;

// Garland API types

export interface NameDescObject {
  name: string;
  description: string;
}

export interface GarlandAction {
  name: string;
  description: string;
  id: number;
  en: NameDescObject;
  ja: NameDescObject;
  fr: NameDescObject;
  de: NameDescObject;
  patch: number;
  category: number;
  icon: number;
  affinity: number;
  lvl: number;
  range: number;
  cast: number;
  recast: number;
  job: number;
}

export interface GarlandActionResponse {
  action: GarlandAction;
}

export interface GarlandItemAttributes {
  action: {
    [key: string]: {
      rate: number;
      limit: number;
    };
  };
}

export interface GarlandItemCraft {
  id: number;
  job: number;
  rlvl: number;
  durability: number;
  quality: number;
  progress: number;
  lvl: number;
  materialQualityFactor: number;
  yield: number;
  hq: number;
  quickSynth: number;
  ingredients: {
    id: number;
    amount: number;
  }[];
  complexity: {
    nq: number;
    hq: number;
  };
}

export interface GarlandItemIngredientTradeShop {
  shop: string;
  npcs: unknown[];
  listings: {
    item: {
      id: string;
      amount: number;
    }[];
    currency: {
      id: string;
      amount: number;
    }[];
  }[];
}

export interface GarlandItemIngredient {
  name: string;
  id: number;
  icon: number;
  category: number;
  ilvl: number;
  price: number;
  leves: number[];
  ventures: number[];
  nodes: number[];
  desynthedFrom: number[];
  reducedFrom: number[];
  tradeShops: GarlandItemIngredientTradeShop[];
}

export interface GarlandItemPartial {
  type: string;
  id: string;
  obj: {
    i: number;
    n: string;
    l: number;
    t: number;
    c: number | number[];
    z?: number;
    lt?: string;
    ti?: number[];
  };
}

export interface GarlandItem {
  name: string;
  description: string;
  id: number;
  en: NameDescObject;
  ja: NameDescObject;
  fr: NameDescObject;
  de: NameDescObject;
  patch: number;
  patchCategory: number;
  price: number;
  ilvl: number;
  category: number;
  dyecount: number;
  tradeable?: number;
  sell_price: number;
  rarity: number;
  unique?: number;
  unlistable?: number;
  stackSize: number;
  attr?: GarlandItemAttributes;
  attr_hq?: GarlandItemAttributes;
  icon: number;
  quests?: number[];
  loots?: number[];
  craft?: GarlandItemCraft[];
  supply?: {
    count: number;
    xp: number;
    seals: number;
  };
}

export interface GarlandItemResponse {
  item: GarlandItem;
  ingredients: GarlandItemIngredient[];
  partials: GarlandItemPartial[];
}

export interface GarlandStatus {
  name: string;
  description: string;
  id: number;
  icon: number;
  en: NameDescObject;
  ja: NameDescObject;
  fr: NameDescObject;
  de: NameDescObject;
  patch: number;
  category: number;
  canDispel: boolean;
}

export interface GarlandStatusResponse {
  status: GarlandStatus;
}

export interface GarlandSearchItem {
  id: number;
  type: string;
  obj: {
    i: number;
    n: string;
    c: number;
    j?: number | null;
    t: number;
    l: number;
  };
}

// XIVAPI types

export interface XIVAPIResponse<T> {
  schema: string;
  rows: T[];
}

// Action, Item, and Status are all the same structure
// "https://beta.xivapi.com/api/1/sheet/Action?rows=16554,37017&limit=2&fields=Name,Icon&transient=&language=en"
// "https://beta.xivapi.com/api/1/sheet/Item?rows=19890&limit=2&fields=Name,Icon&transient=&language=en"
// "https://beta.xivapi.com/api/1/sheet/Status?rows=1881,3895&limit=2&fields=Name,Icon&transient=&language=en"
export interface XIVAPIObject {
  row_id: number;
  fields: {
    Icon: {
      id: number;
      path: string;
      path_hr1: string;
    };
    Name: string;
  };
}

export interface XIVAPIObjectResponse extends XIVAPIResponse<XIVAPIObject> {}

export interface XIVAPIActionField {
  value: number;
  sheet: string;
  row_id: number;
  fields: {
    [key: string]: string;
  };
}

// Rich Action data
// "https://beta.xivapi.com/api/1/sheet/Action?rows=37026&limit=1&fields=Name,Icon,Description@as(html),ActionCategory.Name,Range,EffectRange,Cast100ms,Recast100ms,PrimaryCostType,PrimaryCostValue,ClassJob.Abbreviation,ClassJobLevel,ClassJobCategory.Name&transient=Description@as(html)&language=en"
export interface XIVAPIActionRich {
  row_id: number;
  fields: {
    ActionCategory: XIVAPIActionField;
    Cast100ms: number;
    ClassJob: XIVAPIActionField;
    ClassJobCategory: XIVAPIActionField;
    ClassJobLevel: number;
    EffectRange: number;
    Icon: {
      id: number;
      path: string;
      path_hr1: string;
    };
    Name: string;
    PrimaryCostType: number;
    PrimaryCostValue: number;
    Range: number;
    Recast100ms: number;
  };
  transient: {
    'Description@as(html)': string;
  };
}

// "https://beta.xivapi.com/api/1/sheet/Addon?rows=699,701,702,705,708,709,710,711,712&limit=9&fields=Text&transient=&language=en"
export interface XIVAPIAddon {
  row_id: number;
  fields: {
    Text: string;
  };
}
