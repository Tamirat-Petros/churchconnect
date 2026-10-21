import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";

export async function ensureSampleContent() {
  const now = new Date();
  const samples = [
    {
      sampleKey: "fictional-event-community-table",
      title: "Community Table Sunday",
      description: "Share a relaxed meal after worship and meet neighbors from across the community.",
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      location: "Grace Community Hall",
      imageUrl: ""
    },
    {
      sampleKey: "fictional-event-neighborhood-garden",
      title: "Neighborhood Garden Morning",
      description: "Help plant, refresh the beds, and enjoy a morning of practical care for our neighborhood.",
      date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      location: "Community Garden, east entrance",
      imageUrl: ""
    },
    {
      sampleKey: "fictional-event-carol-evening",
      title: "An Evening of Carols",
      description: "A welcoming evening of music, reflection, and warm drinks for all ages.",
      date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      location: "Grace Community Church",
      imageUrl: ""
    }
  ];
  const sermons = [
    {
      sampleKey: "fictional-sermon-small-acts",
      title: "The Quiet Power of Small Acts",
      speaker: "Pastor Lena Brooks",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      description: "A reflection on how everyday compassion can strengthen an entire community.",
      mediaUrl: "",
      thumbnailUrl: ""
    },
    {
      sampleKey: "fictional-sermon-room-at-the-table",
      title: "Making Room at the Table",
      speaker: "Pastor Lena Brooks",
      date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      description: "What welcome looks like when it moves from words into shared life.",
      mediaUrl: "",
      thumbnailUrl: ""
    }
  ];
  await Promise.all([
    ...samples.map((event) => Event.updateOne({ sampleKey: event.sampleKey }, { $setOnInsert: event }, { upsert: true })),
    ...sermons.map((sermon) => Sermon.updateOne({ sampleKey: sermon.sampleKey }, { $setOnInsert: sermon }, { upsert: true }))
  ]);
}
