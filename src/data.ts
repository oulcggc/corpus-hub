export const AUTHORS: Record<string, Author> = {
	"ninjal": {
		"name": {
			"ja": "国立国語研究所",
			"en": "National Institute for Japanese Language and Linguistics"
		},
		abbr: "NINJAL",
		"link": "https://www.ninjal.ac.jp/",
		"location": "Tokyo, Japan"
	}
}

export const CONCORDANCERS: Concordancer[] = [
	{
		id: "ja@ninjal/shonagon",
		lang: 'ja',
		name: "少納言",
		author: AUTHORS.ninjal,
		link: "https://shonagon.ninjal.ac.jp",
		usage: {
			online: true,
			free: true,
			freemium: false,
			registration: false,
			application: false,
		},
		corpora: [ 
			"ja@ninjal/bccwj",
		]
	}, {
		id: "ja@ninjal/chunagon",
		lang: 'ja',
		name: "中納言",
		author: AUTHORS.ninjal,
		link: "https://chunagon.ninjal.ac.jp/",
		usage: {
			online: true,
			free: true,
			freemium: false,
			registration: true,
			application: true,
		},
		corpora: [
			"ja@ninjal/bccwj",
			"ja@ninjal/chj",
		]
	}
]

export const CORPORA = [
	{
		id: "ja@ninjal/bccwj",
		lang: 'ja',
		tags: ["written", "comtemporary", "japanese"],
		name: {
			"ja": "現代日本語書き言葉均衡コーパス",
			"en": "Balanced Corpus of Contemporary Written Japanese"
		},
		abbr: "BCCWJ",
		link: "https://clrd.ninjal.ac.jp/bccwj/"
	},
	{
		id: "ja@ninjal/chj",
		lang: 'ja',
		tags: ["historical", "diachronic", "japanese", "middle japanese", "old japanese", "classical japanese"],
		name: {
			"ja": "日本語歴史コーパス",
			"en": "Corpus of Historical Japanese"
		},
		link: "https://clrd.ninjal.ac.jp/chj/index.html"
	}
]