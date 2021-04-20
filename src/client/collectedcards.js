const collectedcards = document.getElementById('collectedcards');

export function setCollectedcardsHidden(hidden) {
  if (hidden) {
    collectedcards.classList.add('hidden');
  } else {
    collectedcards.classList.remove('hidden');
  }
}