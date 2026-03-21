import JSConfetti from 'js-confetti'

export const fireConfetti = () => {
  const jsConfetti = new JSConfetti()

  jsConfetti.addConfetti({
    emojis: [
      '🎥',
      '🍿',
      '🎬',
      '🎭',
      '⭐',
      '❤️',
      '💖',
      '🎉',
      '🎊',
      '🎞️',
      '📽️',
      '🎪',
      '🌟',
      '💕',
      '🎈',
      '🎆',
      '✨',
      '🌈',
      '🎨',
      '🎤',
    ],
  })
}
