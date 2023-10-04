import { Timestamp } from 'firebase/firestore'

export type FirestoreWeek = {
  id: string;
  theme: string;
  date: Timestamp;
  isSkipped: boolean;
  movies: FirestoreMovie[];
}

export type FirestoreMovie = {
  title: string;
  director: string | null;
  year: number | null;
  length: number | null;
  url: string | null;
  posterPath: string | null;
  tmdbId: number | null;
  notionId: string | null;
  theaterName: string | null;
  showingUrl: string | null;
}
