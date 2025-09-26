import React from "react";
import "./Stories.css";

/** Inspirational success stories and motivational content */
const stories = [
  {
    id: 1,
    title: "Small Wins Lead to Big Victories",
    text: "Success is built one step at a time. Our daily progress tracking helps teams celebrate small wins that compound into massive achievements. Like Sarah's team, who completed 1000+ tasks in 6 months by focusing on daily improvements.",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    img: "/assets/story-1-placeholder.jpg"
  },
  {
    id: 2,
    title: "Own Your Journey to Excellence",
    text: "Meet Alex, who turned his team's productivity around by implementing clear ownership principles. 'When everyone knows their role and takes pride in their work, magic happens,' he says. Their project delivery time improved by 60% in just three months.",
    quote: "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    img: "/assets/story-2-placeholder.jpg"
  },
  {
    id: 3,
    title: "Visualize Your Progress, Amplify Your Success",
    text: "The journey of a thousand miles begins with a single step. Our color-coded progress tracking helped Maria's international team stay aligned across time zones. They turned a struggling project into their department's biggest success story.",
    quote: "What you get by achieving your goals is not as important as what you become by achieving your goals. - Zig Ziglar",
    img: "/assets/story-3-placeholder.jpg"
  },
  {
    id: 4,
    title: "Champion the Spirit of Growth",
    text: "David's startup used our leaderboard to transform their culture. 'It's not about competition, it's about inspiration,' he shares. Their team's engagement scores rose by 85%, leading to breakthrough innovations and happier employees.",
    quote: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
    img: "/assets/story-4-placeholder.jpg"
  },
  {
    id: 5,
    title: "Success in Your Pocket",
    text: "Remote work shouldn't limit progress. Just ask Patricia's global team of 50+ developers who use our mobile-first approach to stay connected and motivated. They achieved a 95% project success rate while working across 12 different time zones.",
    quote: "The future depends on what you do today. - Mahatma Gandhi",
    img: "/assets/story-5-placeholder.jpg"
  },
  {
    id: 6,
    title: "Consistency Breeds Excellence",
    text: "Meet the team that never missed a daily standup for 365 days straight. Their secret? Making progress tracking as natural as checking your phone. They turned their consistent habits into groundbreaking achievements.",
    quote: "Success is not a destination, it's a journey. It's the commitment to consistent progress. - Tony Robbins",
    img: "/assets/story-6-placeholder.jpg"
  }
];

export default function Stories() {
  return (
    <section className="sb-stories" aria-label="Stories & Motivation">
      <div className="sb-stories__wrap">
        {stories.map((s, i) => (
          <article className={`sb-story ${i % 2 === 0 ? "left" : "right"}`} key={s.id}>
            <div className="sb-story__img">
              <img src={s.img} alt={s.title} loading="lazy" />
            </div>
            <div className="sb-story__text">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <blockquote className="sb-story__quote">{s.quote}</blockquote>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
