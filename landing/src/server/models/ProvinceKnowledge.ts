import { Schema, model, models, Document, Model } from 'mongoose';

export interface IVectorData {
  viewBox: string;
  width: number;
  height: number;
  d: string;
}

export interface IProvinceKnowledge extends Document {
  provinceId: string; // e.g. 'TH-83'
  slug: string;       // e.g. 'phuket'
  nameTh: string;     // e.g. 'ภูเก็ต'
  nameEn: string;     // e.g. 'Phuket'
  region: 'north' | 'isan' | 'central' | 'south' | 'east' | 'west';
  slogan?: string;
  summary: string;
  highlights: string[];
  unseenGems: string[];
  signatureFood: string[];
  bestMonths: string[];
  vibes: string[];
  travelTips?: string;
  vectorData?: IVectorData;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const vectorDataSchema = new Schema<IVectorData>(
  {
    viewBox: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    d: { type: String, required: true }
  },
  { _id: false }
);

const provinceKnowledgeSchema = new Schema<IProvinceKnowledge>(
  {
    provinceId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    nameTh: {
      type: String,
      required: true,
      index: true
    },
    nameEn: {
      type: String,
      required: true,
      index: true
    },
    region: {
      type: String,
      required: true,
      enum: ['north', 'isan', 'central', 'south', 'east', 'west'],
      index: true
    },
    slogan: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },
    unseenGems: {
      type: [String],
      default: []
    },
    signatureFood: {
      type: [String],
      default: []
    },
    bestMonths: {
      type: [String],
      default: []
    },
    vibes: {
      type: [String],
      default: []
    },
    travelTips: {
      type: String,
      default: ''
    },
    vectorData: {
      type: vectorDataSchema,
      required: false
    },
    embedding: {
      type: [Number],
      default: undefined
    }
  },
  {
    timestamps: true
  }
);

// Text Index on important fields for flexible search
provinceKnowledgeSchema.index({
  nameTh: 'text',
  nameEn: 'text',
  summary: 'text',
  highlights: 'text',
  unseenGems: 'text',
  signatureFood: 'text',
  vibes: 'text'
});

export const ProvinceKnowledge: Model<IProvinceKnowledge> =
  models.ProvinceKnowledge || model<IProvinceKnowledge>('ProvinceKnowledge', provinceKnowledgeSchema);

export default ProvinceKnowledge;
