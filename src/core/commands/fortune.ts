import type { CommandDefinition } from "@/core/engine/types";

const FORTUNES = [
  { quote: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { quote: "The most dangerous phrase in the English language is: 'We've always done it this way.'", author: "Grace Hopper" },
  { quote: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
  { quote: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { quote: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { quote: "There are only two hard things in computer science: cache invalidation and naming things.", author: "Phil Karlton" },
  { quote: "It's not a bug — it's an undocumented feature.", author: "Anonymous" },
  { quote: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { quote: "In theory, there is no difference between theory and practice. But in practice, there is.", author: "Jan L.A. van de Snepscheut" },
  { quote: "A language that doesn't affect the way you think about programming is not worth knowing.", author: "Alan Perlis" },
  { quote: "Unix is simple. It just takes a genius to understand its simplicity.", author: "Dennis Ritchie" },
  { quote: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { quote: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" },
];

export const fortuneCommand: CommandDefinition = {
  name: "fortune",
  description: "Display a random programming quote",
  aliases: ["quote"],
  execute: (ctx) => {
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: `  ┌${"─".repeat(60)}┐` },
      { type: "blank", content: "" },
    ]);

    // Word-wrap the quote at ~56 chars
    const words = fortune.quote.split(" ");
    let line = "    ";
    for (const word of words) {
      if (line.length + word.length > 58) {
        ctx.pushLine({ type: "output", content: line, color: "#00f0ff" });
        line = "    " + word + " ";
      } else {
        line += word + " ";
      }
    }
    if (line.trim()) {
      ctx.pushLine({ type: "output", content: line, color: "#00f0ff" });
    }

    ctx.pushLines([
      { type: "blank", content: "" },
      { type: "output", content: `    — ${fortune.author}`, color: "#bf5fff" },
      { type: "blank", content: "" },
      { type: "output", content: `  └${"─".repeat(60)}┘` },
      { type: "blank", content: "" },
    ]);
  },
};
