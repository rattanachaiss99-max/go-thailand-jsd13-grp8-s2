import { Schema, model, models, Document, Model } from 'mongoose';

export interface IProvinceChunk extends Document {
  chunkId: string;
  province: string;
  provinceTh: string;
  category: string;
  subCategory?: string;
  amphoe?: string;
  amphoeTh?: string;
  title: string;
  titleEn?: string;
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  embeddingModel?: string;
  embeddingDim?: number;
  createdAt: Date;
  updatedAt: Date;
}

const provinceChunkSchema = new Schema<IProvinceChunk>(
  {
    chunkId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    province: {
      type: String,
      required: true,
      index: true
    },
    provinceTh: {
      type: String,
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    subCategory: {
      type: String,
      index: true
    },
    amphoe: {
      type: String,
      index: true
    },
    amphoeTh: {
      type: String,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    titleEn: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    embedding: {
      type: [Number],
      default: undefined
    },
    embeddingModel: {
      type: String,
      default: 'gemini-embedding-001'
    },
    embeddingDim: {
      type: Number,
      default: 768
    }
  },
  {
    timestamps: true,
    collection: 'province_chunks'
  }
);

const ProvinceChunk: Model<IProvinceChunk> =
  models.ProvinceChunk || model<IProvinceChunk>('ProvinceChunk', provinceChunkSchema);

export default ProvinceChunk;
