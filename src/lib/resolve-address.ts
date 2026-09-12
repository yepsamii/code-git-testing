const IP_OR_LOCALHOST = /^(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?$/i
// bare host with a dot and a valid-looking TLD, no spaces (e.g. "example.com", "sub.example.co")
const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/.*)?$/i

/** Chrome-omnibox-style resolution: known URL forms load directly, anything else is a Google search. */
export function resolveAddress(input: string): string {
  const value = input.trim()

  if (/^https?:\/\//i.test(value)) return value
  if (/\s/.test(value)) return googleSearch(value)
  if (IP_OR_LOCALHOST.test(value) || BARE_DOMAIN.test(value)) return `https://${value}`

  return googleSearch(value)
}

function googleSearch(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
