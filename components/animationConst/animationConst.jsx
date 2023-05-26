const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1 / 4,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren", 
      staggerChildren: 0.1 / 3,
    },
  },
}

const listSearchBox = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1 / 4,
    },
  },
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1 / 3,
    },
  },
}

const itemSearchBox = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 5 },
  }

const item = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 5 },
}

export { list, item, listSearchBox, itemSearchBox }
