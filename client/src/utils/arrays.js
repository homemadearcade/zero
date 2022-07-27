export function splitIntoSubarrays(array, subarraySize) {
  const subarrays = []
  for (let i = 0; i < array.length; i += subarraySize) {
      const chunk = array.slice(i, i + subarraySize);
      subarrays.push(chunk)
  }
  return subarrays
}