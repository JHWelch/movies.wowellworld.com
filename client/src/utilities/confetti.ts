import JSConfetti from 'js-confetti'

export const fireConfetti = () => {
  const jsConfetti = new JSConfetti()

  jsConfetti.addConfetti({
    emojis: [
      ':‑)',
      ':]',
      'XD',
      ':(',
      '>:(',
      ':‑O',
      'X3',
      '=3',
      ':P',
      ':\\',
      '>:)',
      'X_X',
      'T_T',
      '(. Y .)',
      'ಠ_ಠ',
      '(／ロ°)／',
      '(╯°□°）╯︵ ┻━┻',
      'OwO',
      'UwU',
      '(*^_^*)',
      '(^_^)/',
      '(*´∀｀*)',
      '(´･_･`)',
    ],
  })
}
