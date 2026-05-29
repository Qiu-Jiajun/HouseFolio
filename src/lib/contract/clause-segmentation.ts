export type ContractClauseSegment = {
  id: string;
  title: string;
  text: string;
};

const clauseMarkerPattern =
  /^(?:第[一二三四五六七八九十百千万零〇\d]+条|[一二三四五六七八九十]+、|\d+[.、]|（[一二三四五六七八九十\d]+）)/;

function normalizeContractText(text: string) {
  return text.replace(/\r\n?/g, "\n").trim();
}

function getSegmentTitle(text: string, index: number) {
  const firstLine = text.split("\n")[0]?.trim() ?? "";
  const marker = firstLine.match(clauseMarkerPattern)?.[0];

  return marker ? marker : `片段 ${index + 1}`;
}

export function segmentContractClauses(
  input: string,
): ContractClauseSegment[] {
  const normalizedText = normalizeContractText(input);

  if (!normalizedText) {
    return [];
  }

  const segments: string[] = [];
  let currentLines: string[] = [];

  function pushCurrentSegment() {
    const segmentText = currentLines.join("\n").trim();

    if (segmentText) {
      segments.push(segmentText);
    }

    currentLines = [];
  }

  for (const block of normalizedText.split(/\n\s*\n+/)) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      const startsClause = clauseMarkerPattern.test(line);

      if (startsClause && currentLines.length > 0) {
        pushCurrentSegment();
      }

      currentLines.push(line);
    }

    pushCurrentSegment();
  }

  return segments.map((text, index) => ({
    id: `clause-${index + 1}`,
    title: getSegmentTitle(text, index),
    text,
  }));
}
