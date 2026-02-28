"""
Seed the database with sample book excerpts for testing.
Run: python seed.py
"""
from database import SessionLocal, init_db
from models import Book, Excerpt

SEED_DATA = [
    {
        "title": "Meditations",
        "author": "Marcus Aurelius",
        "genre": "Philosophy",
        "cover_url": "https://covers.openlibrary.org/b/id/8739161-M.jpg",
        "excerpts": [
            "You have power over your mind, not outside events. Realize this, and you will find strength.",
            "The impediment to action advances action. What stands in the way becomes the way.",
            "It is not death that a man should fear, but he should fear never beginning to live.",
            "The happiness of your life depends upon the quality of your thoughts.",
            "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
        ],
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "genre": "Psychology",
        "cover_url": "https://covers.openlibrary.org/b/id/7552057-M.jpg",
        "excerpts": [
            "A reliable way to make people believe in falsehoods is frequent repetition, because familiarity is not easily distinguished from truth.",
            "Nothing in life is as important as you think it is, while you are thinking about it.",
            "We are prone to overestimate how much we understand about the world and to underestimate the role of chance in events.",
            "The confidence that individuals have in their beliefs depends mostly on the quality of the story they can tell about what they see, even if they see little.",
            "Odd as it may seem, I am my remembering self, and the experiencing self, who does my living, is like a stranger to me.",
        ],
    },
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "genre": "History",
        "cover_url": "https://covers.openlibrary.org/b/id/8739376-M.jpg",
        "excerpts": [
            "History is something that very few people have been doing while everyone else was ploughing fields and carrying water buckets.",
            "We did not domesticate wheat. It domesticated us.",
            "Money is the most universal and most efficient system of mutual trust ever devised.",
            "One of history's few iron laws is that luxuries tend to become necessities and to spawn new obligations.",
            "You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.",
        ],
    },
    {
        "title": "The Almanack of Naval Ravikant",
        "author": "Eric Jorgenson",
        "genre": "Self-Help",
        "cover_url": "https://covers.openlibrary.org/b/id/12342345-M.jpg",
        "excerpts": [
            "Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.",
            "Specific knowledge is knowledge that you cannot be trained for. If society can train you, it can train someone else, and replace you.",
            "The most important skill for getting rich is becoming a perpetual learner. You have to know how to learn anything you want to learn.",
            "Read what you love until you love to read.",
            "The three big ones in life are wealth, health, and happiness. We pursue them in that order, but their importance is reverse.",
        ],
    },
    {
        "title": "The Design of Everyday Things",
        "author": "Don Norman",
        "genre": "Design",
        "cover_url": "https://covers.openlibrary.org/b/id/8099474-M.jpg",
        "excerpts": [
            "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well that the design is invisible.",
            "The design of the door should indicate how to work it without any need for signs, certainly without any need for the word 'push'.",
            "Wherever there is a human, there will be error. Systems must be designed to minimize the opportunities for errors and to allow recovery from them when they occur.",
            "Affordances provide strong clues to the operations of things. Plates are for pushing. Knobs are for turning. Slots are for inserting things into.",
        ],
    },
]


def seed():
    init_db()
    db = SessionLocal()
    try:
        if db.query(Book).count() > 0:
            print("Database already seeded. Skipping.")
            return

        for book_data in SEED_DATA:
            book = Book(
                title=book_data["title"],
                author=book_data["author"],
                genre=book_data["genre"],
                cover_url=book_data["cover_url"],
            )
            db.add(book)
            db.flush()

            for text in book_data["excerpts"]:
                db.add(Excerpt(
                    book_id=book.id,
                    text=text,
                    source="manual",
                    tags=[book_data["genre"].lower()],
                ))

        db.commit()
        total = sum(len(b["excerpts"]) for b in SEED_DATA)
        print(f"Seeded {len(SEED_DATA)} books and {total} excerpts.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
