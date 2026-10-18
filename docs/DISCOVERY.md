# Discovery engine (local 0.8.30)

Discovery now uses 480 base terms in English, Spanish, Portuguese, French, German, Italian, Japanese and Russian. Each language has six compatible groups. Four group-specific modifiers produce 1,920 phrase combinations. Camera-style filenames use six prefixes, three separators and four-digit numbers. These are search queries, not video identifiers.

A shuffled six-slot plan mixes two simple-term, three phrase and one camera query. Date windows are randomized and remain before the chosen cutoff. Partial discovery plans request only the two or four jobs they use. The most recent 256 normalized query terms are held in memory for this tab; they are not repeated within that window and reset when the tab reloads. No interests are consulted by Random, and no view thresholds or popularity weights are added.

The bundled vocabulary is prepared during development. It uses no live language model, API key or developer server. Existing two-worker concurrency, deadlines and rate-limit backoff remain in place.

The date parser also recognizes compact YouTube ages such as 9y ago and 2mo ago. Ambiguous ranges crossing the cutoff remain excluded.

A separate bounded live probe compared one multilingual query, one camera query and one batch of 32 generated identifiers. It used at most two concurrent requests and an eight-second request limit. The first two returned verifiably old candidates after compact-age support was added; the identifier query returned no exact matching identifier. This small probe is not a statistical benchmark or proof the identifier method never works. Identifier probing is not enabled in the production engine.

This still samples YouTube search results, not its full catalogue uniformly. Search ranking, indexing, regions, languages and content availability can affect the candidate set. The improvements expand query diversity, not a guarantee of unbiased video discovery.

## Local 0.8.31: avoid topic blocks

A random batch selects distinct query categories and prefers different languages. In pure discovery (100% Variety, or no learned interests), each query contributes at most two candidates, yielding up to 12 cards from six sources. Partial results are allowed; the existing scroll loader requests subsequent batches. Mixed-interest modes retain an adaptive discovery cap so the requested discovery share remains achievable. Discovery candidates are interleaved by query source rather than flattened into topic blocks. The query source is internal metadata only; no view-based eligibility or weighting was added.
