/*interface Language {
    full: string;
    abrev: string;
    bcp: string;
}*/
/*export const languageMap =  {
    "afrikaans": {
      "full": "Afrikaans",
      "abrev": "af",
      "bcp": "af-ZA"
    },
    "amharic": {
      "full": "Amharic",
      "abrev": "am",
      "bcp": "am-ET"
    },
    "armenian": {
      "full": "Armenian",
      "abrev": "hy",
      "bcp": "hy-AM"
    },
    "azerbaijani": {
      "full": "Azerbaijani",
      "abrev": "az",
      "bcp": "az-AZ"
    },
    "indonesian": {
      "full": "Indonesian",
      "abrev": "id",
      "bcp": "id-ID"
    },
    "malay": {
      "full": "Malay",
      "abrev": "ms",
      "bcp": "ms-MY"
    },
    "bengali": {
      "full": "Bengali",
      "abrev": "bn",
      "bcp": "bn-IN"
    },
    "catalan": {
      "full": "Catalan",
      "abrev": "ca",
      "bcp": "ca-ES"
    },
    "czech": {
      "full": "Czech",
      "abrev": "cs",
      "bcp": "cs-CZ"
    },
    "danish": {
      "full": "Danish",
      "abrev": "da",
      "bcp": "da-DK"
    },
    "german": {
      "full": "German",
      "abrev": "de",
      "bcp": "de-DE"
    },
    "english": {
      "full": "English",
      "abrev": "en",
      "bcp": "en-US"
    },
    "spanish": {
      "full": "Spanish",
      "abrev": "es",
      "bcp": "es-VE"
    },
    "basque": {
      "full": "Basque",
      "abrev": "eu",
      "bcp": "eu-ES"
    },
    "filipino": {
      "full": "Filipino",
      "abrev": "fi",
      "bcp": "fil-PH"
    },
    "french": {
      "full": "French",
      "abrev": "fr",
      "bcp": "fr-FR"
    },
    "galician": {
      "full": "Galician",
      "abrev": "gl",
      "bcp": "gl-ES"
    },
    "georgian": {
      "full": "Georgian",
      "abrev": "ka",
      "bcp": "ka-GE"
    },
    "gujarati": {
      "full": "Gujarati",
      "abrev": "gu",
      "bcp": "gu-IN"
    },
    "croatian": {
      "full": "Croatian",
      "abrev": "hr",
      "bcp": "hr-HR"
    },
    "zulu": {
      "full": "Zulu",
      "abrev": "zu",
      "bcp": "zu-ZA"
    },
    "icelandic": {
      "full": "Icelandic",
      "abrev": "is",
      "bcp": "is-IS"
    },
    "italian": {
      "full": "Italian",
      "abrev": "it",
      "bcp": "it-IT"
    },
    "javanese": {
      "full": "Javanese",
      "abrev": "jv",
      "bcp": "jv-ID"
    },
    "kannada": {
      "full": "Kannada",
      "abrev": "kn",
      "bcp": "kn-IN"
    },
    "khmer": {
      "full": "Khmer",
      "abrev": "km",
      "bcp": "km-KH"
    },
    "lao": {
      "full": "Lao",
      "abrev": "lo",
      "bcp": "lo-LA"
    },
    "latvian": {
      "full": "Latvian",
      "abrev": "lv",
      "bcp": "lv-LV"
    },
    "lithuanian": {
      "full": "Lithuanian",
      "abrev": "lt",
      "bcp": "lt-LT"
    },
    "hungarian": {
      "full": "Hungarian",
      "abrev": "hu",
      "bcp": "hu-HU"
    },
    "malayalam": {
      "full": "Malayalam",
      "abrev": "ml",
      "bcp": "ml-IN"
    },
    "marathi": {
      "full": "Marathi",
      "abrev": "mr",
      "bcp": "mr-IN"
    },
    "dutch": {
      "full": "Dutch",
      "abrev": "nl",
      "bcp": "nl-NL"
    },
    "nepali": {
      "full": "Nepali",
      "abrev": "ne",
      "bcp": "ne-NP"
    },
    "norwegian-bokmål": {
      "full": "Norwegian Bokmål",
      "abrev": "nb",
      "bcp": "nb-NO"
    },
    "polish": {
      "full": "Polish",
      "abrev": "pl",
      "bcp": "pl-PL"
    },
    "portuguese": {
      "full": "Portuguese",
      "abrev": "pt",
      "bcp": "pt-PT"
    },
    "romanian": {
      "full": "Romanian",
      "abrev": "ro",
      "bcp": "ro-RO"
    },
    "sinhala": {
      "full": "Sinhala",
      "abrev": "si",
      "bcp": "si-LK"
    },
    "slovak": {
      "full": "Slovak",
      "abrev": "sk",
      "bcp": "sk-SK"
    },
    "slovenian": {
      "full": "Slovenian",
      "abrev": "sl",
      "bcp": "sl-SI"
    },
    "sundanese": {
      "full": "Sundanese",
      "abrev": "su",
      "bcp": "su-ID"
    },
    "swahili": {
      "full": "Swahili",
      "abrev": "sw",
      "bcp": "sw-KE"
    },
    "finnish": {
      "full": "Finnish",
      "abrev": "fi",
      "bcp": "fi-FI"
    },
    "swedish": {
      "full": "Swedish",
      "abrev": "sv",
      "bcp": "sv-SE"
    },
    "tamil": {
      "full": "Tamil",
      "abrev": "ta",
      "bcp": "ta-MY"
    },
    "telugu": {
      "full": "Telugu",
      "abrev": "te",
      "bcp": "te-IN"
    },
    "vietnamese": {
      "full": "Vietnamese",
      "abrev": "vi",
      "bcp": "vi-VN"
    },
    "turkish": {
      "full": "Turkish",
      "abrev": "tr",
      "bcp": "tr-TR"
    },
    "urdu": {
      "full": "Urdu",
      "abrev": "ur",
      "bcp": "ur-IN"
    },
    "greek": {
      "full": "Greek",
      "abrev": "el",
      "bcp": "el-GR"
    },
    "bulgarian": {
      "full": "Bulgarian",
      "abrev": "bg",
      "bcp": "bg-BG"
    },
    "russian": {
      "full": "Russian",
      "abrev": "ru",
      "bcp": "ru-RU"
    },
    "serbian": {
      "full": "Serbian",
      "abrev": "sr",
      "bcp": "sr-RS"
    },
    "ukrainian": {
      "full": "Ukrainian",
      "abrev": "uk",
      "bcp": "uk-UA"
    },
    "hebrew": {
      "full": "Hebrew",
      "abrev": "he",
      "bcp": "he-IL"
    },
    "arabic": {
      "full": "Arabic",
      "abrev": "ar",
      "bcp": "ar-EG"
    },
    "persian": {
      "full": "Persian",
      "abrev": "fa",
      "bcp": "fa-IR"
    },
    "hindi": {
      "full": "Hindi",
      "abrev": "hi",
      "bcp": "hi-IN"
    },
    "thai": {
      "full": "Thai",
      "abrev": "th",
      "bcp": "th-TH"
    },
    "korean": {
      "full": "Korean",
      "abrev": "ko",
      "bcp": "ko-KR"
    },
    "chinese,-mandarin": {
      "full": "Chinese, Mandarin",
      "abrev": "zh",
      "bcp": "zh"
    },
    "chinese,-cantonese": {
      "full": "Chinese, Cantonese",
      "abrev": "yu",
      "bcp": "yue-Hant-HK"
    },
    "japanese": {
      "full": "Japanese",
      "abrev": "ja",
      "bcp": "ja-JP"
    }
  };*/

export const languageMap = {
  "afrikaans": {
    "full": "Afrikaans",
    "abrev": "af",
    "bcp": "af-ZA"
  },
  "amharic": {
    "full": "Amharic",
    "abrev": "am",
    "bcp": "am-ET"
  },
  "arabic": {
    "full": "Arabic",
    "abrev": "ar",
    "bcp": "ar-XA"
  },
  "bulgarian": {
    "full": "Bulgarian",
    "abrev": "bg",
    "bcp": "bg-BG"
  },
  "bengali": {
    "full": "Bengali",
    "abrev": "bn",
    "bcp": "bn-IN"
  },
  "catalan": {
    "full": "Catalan",
    "abrev": "ca",
    "bcp": "ca-ES"
  },
  "chinese_mandarin_cn": {
    "full": "Chinese (Mandarin, Simplified)",
    "abrev": "cmn",
    "bcp": "cmn-CN"
  },
  "chinese_mandarin_tw": {
    "full": "Chinese (Mandarin, Traditional)",
    "abrev": "cmn",
    "bcp": "cmn-TW"
  },
  "czech": {
    "full": "Czech",
    "abrev": "cs",
    "bcp": "cs-CZ"
  },
  "danish": {
    "full": "Danish",
    "abrev": "da",
    "bcp": "da-DK"
  },
  "german": {
    "full": "German",
    "abrev": "de",
    "bcp": "de-DE"
  },
  "greek": {
    "full": "Greek",
    "abrev": "el",
    "bcp": "el-GR"
  },
  "english_au": {
    "full": "English (Australia)",
    "abrev": "en",
    "bcp": "en-AU"
  },
  "english_gb": {
    "full": "English (United Kingdom)",
    "abrev": "en",
    "bcp": "en-GB"
  },
  "english_in": {
    "full": "English (India)",
    "abrev": "en",
    "bcp": "en-IN"
  },
  "english_us": {
    "full": "English (United States)",
    "abrev": "en",
    "bcp": "en-US"
  },
  "spanish_es": {
    "full": "Spanish (Spain)",
    "abrev": "es",
    "bcp": "es-ES"
  },
  "spanish_us": {
    "full": "Spanish (United States)",
    "abrev": "es",
    "bcp": "es-US"
  },
  "basque": {
    "full": "Basque",
    "abrev": "eu",
    "bcp": "eu-ES"
  },
  "finnish": {
    "full": "Finnish",
    "abrev": "fi",
    "bcp": "fi-FI"
  },
  "filipino": {
    "full": "Filipino",
    "abrev": "fil",
    "bcp": "fil-PH"
  },
  "french_ca": {
    "full": "French (Canada)",
    "abrev": "fr",
    "bcp": "fr-CA"
  },
  "french_fr": {
    "full": "French (France)",
    "abrev": "fr",
    "bcp": "fr-FR"
  },
  "galician": {
    "full": "Galician",
    "abrev": "gl",
    "bcp": "gl-ES"
  },
  "gujarati": {
    "full": "Gujarati",
    "abrev": "gu",
    "bcp": "gu-IN"
  },
  "hebrew": {
    "full": "Hebrew",
    "abrev": "he",
    "bcp": "he-IL"
  },
  "hindi": {
    "full": "Hindi",
    "abrev": "hi",
    "bcp": "hi-IN"
  },
  "hungarian": {
    "full": "Hungarian",
    "abrev": "hu",
    "bcp": "hu-HU"
  },
  "indonesian": {
    "full": "Indonesian",
    "abrev": "id",
    "bcp": "id-ID"
  },
  "icelandic": {
    "full": "Icelandic",
    "abrev": "is",
    "bcp": "is-IS"
  },
  "italian": {
    "full": "Italian",
    "abrev": "it",
    "bcp": "it-IT"
  },
  "japanese": {
    "full": "Japanese",
    "abrev": "ja",
    "bcp": "ja-JP"
  },
  "kannada": {
    "full": "Kannada",
    "abrev": "kn",
    "bcp": "kn-IN"
  },
  "korean": {
    "full": "Korean",
    "abrev": "ko",
    "bcp": "ko-KR"
  },
  "lithuanian": {
    "full": "Lithuanian",
    "abrev": "lt",
    "bcp": "lt-LT"
  },
  "latvian": {
    "full": "Latvian",
    "abrev": "lv",
    "bcp": "lv-LV"
  },
  "malayalam": {
    "full": "Malayalam",
    "abrev": "ml",
    "bcp": "ml-IN"
  },
  "marathi": {
    "full": "Marathi",
    "abrev": "mr",
    "bcp": "mr-IN"
  },
  "malay": {
    "full": "Malay",
    "abrev": "ms",
    "bcp": "ms-MY"
  },
  "norwegian": {
    "full": "Norwegian",
    "abrev": "nb",
    "bcp": "nb-NO"
  },
  "dutch_be": {
    "full": "Dutch (Belgium)",
    "abrev": "nl",
    "bcp": "nl-BE"
  },
  "dutch_nl": {
    "full": "Dutch (Netherlands)",
    "abrev": "nl",
    "bcp": "nl-NL"
  },
  "punjabi": {
    "full": "Punjabi",
    "abrev": "pa",
    "bcp": "pa-IN"
  },
  "polish": {
    "full": "Polish",
    "abrev": "pl",
    "bcp": "pl-PL"
  },
  "portuguese_br": {
    "full": "Portuguese (Brazil)",
    "abrev": "pt",
    "bcp": "pt-BR"
  },
  "portuguese_pt": {
    "full": "Portuguese (Portugal)",
    "abrev": "pt",
    "bcp": "pt-PT"
  },
  "romanian": {
    "full": "Romanian",
    "abrev": "ro",
    "bcp": "ro-RO"
  },
  "russian": {
    "full": "Russian",
    "abrev": "ru",
    "bcp": "ru-RU"
  },
  "slovak": {
    "full": "Slovak",
    "abrev": "sk",
    "bcp": "sk-SK"
  },
  "serbian": {
    "full": "Serbian",
    "abrev": "sr",
    "bcp": "sr-RS"
  },
  "swedish": {
    "full": "Swedish",
    "abrev": "sv",
    "bcp": "sv-SE"
  },
  "tamil": {
    "full": "Tamil",
    "abrev": "ta",
    "bcp": "ta-IN"
  },
  "telugu": {
    "full": "Telugu",
    "abrev": "te",
    "bcp": "te-IN"
  },
  "thai": {
    "full": "Thai",
    "abrev": "th",
    "bcp": "th-TH"
  },
  "turkish": {
    "full": "Turkish",
    "abrev": "tr",
    "bcp": "tr-TR"
  },
  "ukrainian": {
    "full": "Ukrainian",
    "abrev": "uk",
    "bcp": "uk-UA"
  },
  "urdu": {
    "full": "Urdu",
    "abrev": "ur",
    "bcp": "ur-IN"
  },
  "vietnamese": {
    "full": "Vietnamese",
    "abrev": "vi",
    "bcp": "vi-VN"
  },
  "chinese_cantonese": {
    "full": "Chinese (Cantonese)",
    "abrev": "yue",
    "bcp": "yue-HK"
  }
}

export const languageArray = [
"afrikaans",
"amharic",
"armenian",
"azerbaijani",
"indonesian",
"malay",
"bengali",
"catalan",
"czech",
"danish",
"german",
"english",
"spanish",
"basque",
"filipino",
"french",
"galician",
"georgian",
"gujarati",
"croatian",
"zulu",
"icelandic",
"italian",
"javanese",
"kannada",
"khmer",
"lao",
"latvian",
"lithuanian",
"hungarian",
"malayalam",
"marathi",
"dutch",
"nepali",
"norwegian-bokmål",
"polish",
"portuguese",
"romanian",
"sinhala",
"slovak",
"slovenian",
"sundanese",
"swahili",
"finnish",
"swedish",
"tamil",
"telugu",
"vietnamese",
"turkish",
"urdu",
"greek",
"bulgarian",
"russian",
"serbian",
"ukrainian",
"hebrew",
"arabic",
"persian",
"hindi",
"thai",
"korean",
"chinese,-mandarin",
"chinese,-cantonese",
"japanese"
];

export const examQuestions = [
"What activities do you enjoy doing in your free time?",
"Could you describe a memorable holiday or trip you've taken recently?",
"How do you usually unwind after a long day?",
"Can you share a favorite book or movie you've recently discovered?",
"What are some hobbies or interests you've been wanting to explore more?",
"Do you have any favorite places to eat out or special dishes you like to cook at home?",
"How do you like to spend time with your friends or family on weekends?",
"Are there any cultural events or festivals you look forward to attending each year?",
"Could you tell me about a hobby or activity you've been passionate about since childhood?",
"What's something new you've learned recently that you find fascinating?",
"Can you share a particularly memorable experience from your childhood?",
"What kinds of music do you enjoy listening to, and why?",
"How do you like to stay active or exercise during the week?",
"Could you describe a favorite dish from your culture or a cuisine you enjoy exploring?",
"What's something interesting you've learned about a different culture recently?",
"Do you have any favorite outdoor activities or sports you like to participate in?",
"Can you tell me about a skill or hobby you've been trying to improve recently?",
"How do you usually celebrate special occasions, like birthdays or holidays, with your loved ones?",
"What's a place you've always wanted to visit, and what draws you to it?",
"Can you share a funny or memorable story from your past that always makes you smile when you think about it?",
"Can you share a tradition or custom from your family or community that you find meaningful?",
"What do you enjoy most about your favorite season, and how do you like to spend time during it?",
"Could you describe a recent accomplishment or achievement you're proud of?",
"How do you like to relax and recharge when you're feeling stressed or overwhelmed?",
"Can you tell me about a role model or influential figure in your life and why they inspire you?",
"What's something you're curious about and eager to learn more about in the future?",
"How do you think technology has impacted your daily life, both positively and negatively?",
"Can you share a favorite quote or saying that resonates with you? What does it mean to you?",
"What's a goal you've set for yourself recently, and how are you working towards achieving it?",
"How do you think your upbringing or background has shaped who you are today?",
"Can you describe a favorite childhood game or activity you used to enjoy playing?",
"What's something that always makes you laugh, no matter how many times you've heard it?",
"How do you like to stay motivated and focused when you're working towards a goal?",
"Can you share a piece of advice or wisdom you've received that has stuck with you over the years?",
"What's a small act of kindness you've experienced recently that made a big impact on you?",
"How do you like to spend a quiet evening at home by yourself?",
"Can you describe a skill or talent you admire in others and would like to develop yourself?",
"What's a topic or subject you're passionate about discussing with others?",
"How do you like to challenge yourself to step out of your comfort zone?",
"Can you share a dream or ambition you have for the future, no matter how big or small?",
"Can you tell me about a hobby or activity you enjoy doing in your free time?",
"Could you describe a memorable holiday or trip you've taken recently?",
"How do you usually unwind after a long day?",
"Can you share a favorite book or movie you've recently discovered?",
"What are some hobbies or interests you've been wanting to explore more?",
"Do you have any favorite places to eat out or special dishes you like to cook at home?",
"How do you like to spend time with your friends or family on weekends?",
"Are there any cultural events or festivals you look forward to attending each year?",
"Could you tell me about a hobby or activity you've been passionate about since childhood?",
"What's something new you've learned recently that you find fascinating?",
"Can you share a particularly memorable experience from your childhood?",
"What kinds of music do you enjoy listening to, and why?",
"How do you like to stay active or exercise during the week?",
"Could you describe a favorite dish from your culture or a cuisine you enjoy exploring?",
"What's something interesting you've learned about a different culture recently?",
"Do you have any favorite outdoor activities or sports you like to participate in?",
"Can you tell me about a skill or hobby you've been trying to improve recently?"
]

export const currentLanguage = "french";

export const languageSpeedData = {
  "japanese": 240,
  "spanish": 260,
  "french": 220,
  "italian": 210,
  "portuguese": 230,
  "chinese,-mandarin": 200,
  "korean": 220,
  "vietnamese": 190,
  "turkish": 210,
  "hindi": 210
}