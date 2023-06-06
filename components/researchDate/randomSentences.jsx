const fromComesBeforeTo = [
  "Psst, let's set it straight: From always comes before To!",
  "Hey folks, when it comes to time, From precedes To!",
  "Listen up, it's simple—From leads, To follows!",
  "Attention, everyone! From takes the lead, To comes second!",
  "Quick tip, my friends—always remember, From precedes To!",
  "Time's golden rule—From takes the stage before To!",
  "Important note: in the realm of time, From leads the way, To follows suit!",
  "Time's commandment: From shall precede To, no exceptions!",
  "Time's fundamental truth—From takes precedence over To!",
  "Just a friendly reminder—when it's time we discuss, From comes before To!",
  "Psst, here's the secret: From always takes the lead, To follows behind!",
  "Hey folks, time's rule is clear: From precedes To, no ifs or buts!",
  "Listen closely, it's as simple as can be—From leads the way, To trails along!",
  "Quick tip, my friends—remember the order: From comes first, To comes after!",
  "Time's wisdom speaks: From commands the stage, To waits for its cue!",
  "Important note: in the realm of time, From sets the course, To falls in line!",
  "Time's decree is absolute: From shall always come before To, no exceptions!",
  "Time's fundamental truth reveals itself: From takes precedence over To, always!",
  "Just a friendly reminder—when it's time we discuss, remember, From comes before To!",
]

const getRandomSentenceList = () => {
  const randomIndex = Math.floor(Math.random() * fromComesBeforeTo.length)
  return fromComesBeforeTo[randomIndex]
}

export default getRandomSentenceList
