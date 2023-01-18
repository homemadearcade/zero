export function splitIntoSubarrays(array, subarraySize) {
  const subarrays = []
  for (let i = 0; i < array.length; i += subarraySize) {
      const chunk = array.slice(i, i + subarraySize);
      subarrays.push(chunk)
  }
  return subarrays
}

export function shuffleArray(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}