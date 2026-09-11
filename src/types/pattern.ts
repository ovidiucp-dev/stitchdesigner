export type StitchType = "full";

export type Stitch = {
  x: number;
  y: number;
  colorId: string;
  type: StitchType;
};

export type Thread = {
  id: string;
  name: string;
  rgb: string;
  symbol: string;
  brand: string;
};

export type Fabric = {
  type: string;
  count: number;
  color: string;
};

export type Pattern = {
  version: "1.0";
  id: string;
  name: string;
  width: number;
  height: number;
  fabric: Fabric;
  palette: Thread[];
  stitches: Stitch[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
};

export type StitchHistoryEntry = {
  x: number;
  y: number;
  before: Stitch | null;
  after: Stitch | null;
};