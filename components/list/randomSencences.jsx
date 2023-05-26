const filteredListSentences = [
  "What did you expect to happen when you filtered out all the categories? The list decided to go on a rebellious sabbatical and join a traveling circus.",
  "Removing all the available categories from the list resulted in a profound existential crisis for both the list and the person who did it. Oops!",
  "In the absence of categories, the list became an avant-garde masterpiece, challenging the very notion of organization. Picasso would be proud.",
  "What did you expect to happen when you eliminated all the categories? The list decided to channel its inner rebel and became a nonconformist poet.",
  "When you filtered out all the available categories, the list's identity crisis went through the roof. It started questioning the meaning of its existence, just like a millennial in their 30s.",
  "Removing all the categories left the list feeling like a fish out of water, or rather, a list without any purpose or function. It considered joining a support group for lost items.",
  "What did you expect to happen when you erased all the categories? The list went on strike and demanded better working conditions, including mandatory coffee breaks and unlimited supply of sticky notes.",
  "In the void of category-less existence, the list resorted to extreme measures and went undercover as a Sudoku puzzle, hoping to find solace in numerical order.",
  "When you filtered out every category, the list embarked on a soul-searching journey to find its true calling in life: becoming a stand-up comedian. Expect some hilarious punchlines from your future shopping trips.",
  "What did you expect to happen when you removed all the categories? The list found itself in a state of blissful freedom, contemplating the absurdity of its own existence. It started writing a philosophical memoir titled 'The Blank Pages of Purpose.'",
  "Removing all the available categories from the list made it feel like a rebellious teenager, defying the conventional norms of organization. It started listening to punk rock and grew an ironic mustache.",
  "In the absence of categories, the list turned into a modern art installation, challenging visitors to decipher its cryptic meaning. Critics called it 'The Unlabeled Chaos of Everyday Life.'",
  "Letting go of all the categories left the list floating in a sea of uncertainty, like a castaway on a deserted island of misplaced items. Wilson the volleyball became its only confidant.",
  "What did you expect to happen when you filtered out the categories? The list went on strike and staged a protest, demanding a new system where each item would have its own personal category and theme song.",
  "When all the available categories were removed, the list discovered a hidden talent for interpretive dance. It started pirouetting and twirling its way through the confusion.",
  "Removing all the categories made the list feel like a rebel without a cause. It contemplated joining a biker gang and riding off into the sunset, with 'Born to Be Wild' playing in the background.",
  "In the void of category-less existence, the list experienced a burst of creativity. It started composing haikus about the meaning of life, using only emojis and nonsensical puns.",
  "When you filtered out every category, the list decided to start a new trend: the art of randomization. It became a pioneer in the field of chaos-inspired organization.",
  "What did you expect to happen when you eliminated all the categories? The list transformed into a wise sage, speaking in riddles and offering cryptic shopping advice like 'Seek the unseen, my friend.'",
  "Removing all the available categories from the list resulted in a state of absolute freedom",
]

const getRandomSentenceList = () => {
  const randomIndex = Math.floor(Math.random() * filteredListSentences.length);
  return filteredListSentences[randomIndex];
};

export default getRandomSentenceList;
