import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";
import { Announcement } from "../models/Announcement.js";
import { Ministry } from "../models/Ministry.js";

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
  const announcements = [
    {
      sampleKey: "fictional-announcement-sunday-welcome",
      title: "A welcome for Sunday",
      content: "Join us for worship this Sunday. Stay afterward for coffee, conversation, and a chance to meet the community.",
      publishAt: now,
      isPublished: true
    },
    {
      sampleKey: "fictional-announcement-community-care",
      title: "Community care team",
      content: "Our community care team is collecting practical support requests from neighbors. Contact the church office if you would like to help.",
      publishAt: now,
      isPublished: true
    }
  ];
  const ministries = [
    {
      sampleKey: "fictional-ministry-community-care",
      name: "Community Care",
      description: "A team offering practical help, friendly visits, and support to neighbors during difficult seasons.",
      meetingTime: "First Saturday of each month",
      isActive: true
    },
    {
      sampleKey: "fictional-ministry-children-families",
      name: "Children and Families",
      description: "A welcoming space for children and caregivers to learn, create, and grow together in faith.",
      meetingTime: "Sundays during the 10:00 AM service",
      isActive: true
    },
    {
      sampleKey: "fictional-ministry-music",
      name: "Music Ministry",
      description: "Singers and instrumentalists of all experience levels help lead music in worship and community events.",
      meetingTime: "Thursdays at 6:30 PM",
      isActive: true
    }
  ];
  await Promise.all([
    ...samples.map((event) => Event.updateOne({ sampleKey: event.sampleKey }, { $setOnInsert: event }, { upsert: true })),
    ...sermons.map((sermon) => Sermon.updateOne({ sampleKey: sermon.sampleKey }, { $setOnInsert: sermon }, { upsert: true })),
    ...announcements.map((announcement) => Announcement.updateOne({ sampleKey: announcement.sampleKey }, { $setOnInsert: announcement }, { upsert: true })),
    ...ministries.map((ministry) => Ministry.updateOne({ sampleKey: ministry.sampleKey }, { $setOnInsert: ministry }, { upsert: true }))
  ]);
}
