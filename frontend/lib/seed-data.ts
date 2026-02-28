import type { Excerpt } from "@/types";

export const SEED_EXCERPTS: Excerpt[] = [
  // Meditations — Marcus Aurelius
  {
    id: 1, book_id: 1, text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    tags: ["philosophy", "stoicism"], source: "manual", liked: false, like_count: 0,
    book_title: "Meditations", book_author: "Marcus Aurelius",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
  },
  {
    id: 2, book_id: 1, text: "The impediment to action advances action. What stands in the way becomes the way.",
    tags: ["philosophy", "stoicism"], source: "manual", liked: false, like_count: 0,
    book_title: "Meditations", book_author: "Marcus Aurelius",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
  },
  {
    id: 3, book_id: 1, text: "It is not death that a man should fear, but he should fear never beginning to live.",
    tags: ["philosophy", "stoicism"], source: "manual", liked: false, like_count: 0,
    book_title: "Meditations", book_author: "Marcus Aurelius",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
  },
  {
    id: 4, book_id: 1, text: "The happiness of your life depends upon the quality of your thoughts.",
    tags: ["philosophy", "stoicism"], source: "manual", liked: false, like_count: 0,
    book_title: "Meditations", book_author: "Marcus Aurelius",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
  },
  {
    id: 5, book_id: 1, text: "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
    tags: ["philosophy", "stoicism"], source: "manual", liked: false, like_count: 0,
    book_title: "Meditations", book_author: "Marcus Aurelius",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
  },

  // Thinking, Fast and Slow — Daniel Kahneman
  {
    id: 6, book_id: 2, text: "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
    tags: ["psychology", "cognitive bias"], source: "manual", liked: false, like_count: 0,
    book_title: "Thinking, Fast and Slow", book_author: "Daniel Kahneman",
    book_cover_url: "https://covers.openlibrary.org/b/id/7552057-M.jpg",
  },
  {
    id: 7, book_id: 2, text: "Nothing in life is as important as you think it is, while you are thinking about it.",
    tags: ["psychology", "decision making"], source: "manual", liked: false, like_count: 0,
    book_title: "Thinking, Fast and Slow", book_author: "Daniel Kahneman",
    book_cover_url: "https://covers.openlibrary.org/b/id/7552057-M.jpg",
  },
  {
    id: 8, book_id: 2, text: "We are prone to overestimate how much we understand about the world and to underestimate the role of chance in events.",
    tags: ["psychology", "cognitive bias"], source: "manual", liked: false, like_count: 0,
    book_title: "Thinking, Fast and Slow", book_author: "Daniel Kahneman",
    book_cover_url: "https://covers.openlibrary.org/b/id/7552057-M.jpg",
  },
  {
    id: 9, book_id: 2, text: "Odd as it may seem, I am my remembering self, and the experiencing self, who does my living, is like a stranger to me.",
    tags: ["psychology", "identity"], source: "manual", liked: false, like_count: 0,
    book_title: "Thinking, Fast and Slow", book_author: "Daniel Kahneman",
    book_cover_url: "https://covers.openlibrary.org/b/id/7552057-M.jpg",
  },

  // Sapiens — Yuval Noah Harari
  {
    id: 10, book_id: 3, text: "History is something that very few people have been doing while everyone else was ploughing fields and carrying water buckets.",
    tags: ["history", "society"], source: "manual", liked: false, like_count: 0,
    book_title: "Sapiens", book_author: "Yuval Noah Harari",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739376-M.jpg",
  },
  {
    id: 11, book_id: 3, text: "We did not domesticate wheat. It domesticated us.",
    tags: ["history", "agriculture"], source: "manual", liked: false, like_count: 0,
    book_title: "Sapiens", book_author: "Yuval Noah Harari",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739376-M.jpg",
  },
  {
    id: 12, book_id: 3, text: "Money is the most universal and most efficient system of mutual trust ever devised.",
    tags: ["history", "economics"], source: "manual", liked: false, like_count: 0,
    book_title: "Sapiens", book_author: "Yuval Noah Harari",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739376-M.jpg",
  },
  {
    id: 13, book_id: 3, text: "One of history's few iron laws is that luxuries tend to become necessities and to spawn new obligations.",
    tags: ["history", "society"], source: "manual", liked: false, like_count: 0,
    book_title: "Sapiens", book_author: "Yuval Noah Harari",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739376-M.jpg",
  },
  {
    id: 14, book_id: 3, text: "You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.",
    tags: ["history", "religion"], source: "manual", liked: false, like_count: 0,
    book_title: "Sapiens", book_author: "Yuval Noah Harari",
    book_cover_url: "https://covers.openlibrary.org/b/id/8739376-M.jpg",
  },

  // The Almanack of Naval Ravikant
  {
    id: 15, book_id: 4, text: "Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth.",
    tags: ["wealth", "investing"], source: "manual", liked: false, like_count: 0,
    book_title: "The Almanack of Naval Ravikant", book_author: "Eric Jorgenson",
    book_cover_url: undefined,
  },
  {
    id: 16, book_id: 4, text: "Specific knowledge is knowledge that you cannot be trained for. If society can train you, it can train someone else, and replace you.",
    tags: ["career", "leverage"], source: "manual", liked: false, like_count: 0,
    book_title: "The Almanack of Naval Ravikant", book_author: "Eric Jorgenson",
    book_cover_url: undefined,
  },
  {
    id: 17, book_id: 4, text: "The most important skill for getting rich is becoming a perpetual learner. You have to know how to learn anything you want to learn.",
    tags: ["learning", "wealth"], source: "manual", liked: false, like_count: 0,
    book_title: "The Almanack of Naval Ravikant", book_author: "Eric Jorgenson",
    book_cover_url: undefined,
  },
  {
    id: 18, book_id: 4, text: "Read what you love until you love to read.",
    tags: ["reading", "learning"], source: "manual", liked: false, like_count: 0,
    book_title: "The Almanack of Naval Ravikant", book_author: "Eric Jorgenson",
    book_cover_url: undefined,
  },
  {
    id: 19, book_id: 4, text: "The three big ones in life are wealth, health, and happiness. We pursue them in that order, but their importance is reverse.",
    tags: ["life", "priorities"], source: "manual", liked: false, like_count: 0,
    book_title: "The Almanack of Naval Ravikant", book_author: "Eric Jorgenson",
    book_cover_url: undefined,
  },

  // The Design of Everyday Things — Don Norman
  {
    id: 20, book_id: 5, text: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.",
    tags: ["design", "ux"], source: "manual", liked: false, like_count: 0,
    book_title: "The Design of Everyday Things", book_author: "Don Norman",
    book_cover_url: "https://covers.openlibrary.org/b/id/8099474-M.jpg",
  },
  {
    id: 21, book_id: 5, text: "The design of the door should indicate how to work it without any need for signs, certainly without any need for the word 'push'.",
    tags: ["design", "affordance"], source: "manual", liked: false, like_count: 0,
    book_title: "The Design of Everyday Things", book_author: "Don Norman",
    book_cover_url: "https://covers.openlibrary.org/b/id/8099474-M.jpg",
  },
  {
    id: 22, book_id: 5, text: "Wherever there is a human, there will be error. Systems must be designed to minimize the opportunities for errors and to allow recovery from them when they occur.",
    tags: ["design", "systems"], source: "manual", liked: false, like_count: 0,
    book_title: "The Design of Everyday Things", book_author: "Don Norman",
    book_cover_url: "https://covers.openlibrary.org/b/id/8099474-M.jpg",
  },
  {
    id: 23, book_id: 5, text: "Affordances provide strong clues to the operations of things. Plates are for pushing. Knobs are for turning. Slots are for inserting things into.",
    tags: ["design", "affordance"], source: "manual", liked: false, like_count: 0,
    book_title: "The Design of Everyday Things", book_author: "Don Norman",
    book_cover_url: "https://covers.openlibrary.org/b/id/8099474-M.jpg",
  },
];
