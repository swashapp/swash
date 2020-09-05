var internalFilters = [
  {
    "value": "https://*.dropbox.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://www.amazon.com/ap/signin*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://www.facebook.com/login*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://www.facebook.com/v3.2/dialog/oauth*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://login.yahoo.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://accounts.google.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://login.live.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://login.aol.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://twitter.com/login*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://twitter.com/account*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://drive.google.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "https://docs.google.com/*",
    "type": "wildcard",
    "internal": true
  },
  {
    "value": "^(?!http[s]?:).+",
    "type": "regex",
    "internal": true
  },
  {
    "value": "(http|https):\/\/(localhost|([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\\d{1,3}\\.){3}\\d{1,3}).*",
    "type": "regex",
    "internal": true
  }  
]

export {internalFilters};