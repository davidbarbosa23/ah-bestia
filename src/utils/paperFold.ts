export type PaperPoint = { x: number; y: number };
type PaperRect = {
  topLeft: PaperPoint;
  topRight: PaperPoint;
  bottomLeft: PaperPoint;
  bottomRight: PaperPoint;
};
export type PaperFold = {
  angle: number;
  position: PaperPoint;
  rect: PaperRect;
  topIntersect: PaperPoint | null;
  sideIntersect: PaperPoint | null;
  bottomIntersect: PaperPoint | null;
  flippingArea: Array<PaperPoint | null>;
  bottomArea: Array<PaperPoint | null>;
};

export const easePageTurn = (progress: number) => progress * progress * (3 - 2 * progress);

export const distanceBetween = (one: PaperPoint | null, two: PaperPoint | null) => {
  if (!one || !two) return Number.POSITIVE_INFINITY;
  return Math.hypot(two.x - one.x, two.y - one.y);
};

const rotatePaperPoint = (point: PaperPoint, origin: PaperPoint, angle: number) => ({
  x: point.x * Math.cos(angle) + point.y * Math.sin(angle) + origin.x,
  y: point.y * Math.cos(angle) - point.x * Math.sin(angle) + origin.y,
});

const limitPointToCircle = (origin: PaperPoint, radius: number, point: PaperPoint) => {
  const distance = distanceBetween(origin, point);
  if (distance <= radius) return point;
  const ratio = radius / distance;
  return {
    x: origin.x + (point.x - origin.x) * ratio,
    y: origin.y + (point.y - origin.y) * ratio,
  };
};

const intersectPaperLines = (
  one: [PaperPoint, PaperPoint],
  two: [PaperPoint, PaperPoint],
  width: number,
  height: number,
) => {
  const [a, b] = one;
  const [c, d] = two;
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.0001) return null;
  const crossOne = a.x * b.y - a.y * b.x;
  const crossTwo = c.x * d.y - c.y * d.x;
  const point = {
    x: (crossOne * (c.x - d.x) - (a.x - b.x) * crossTwo) / denominator,
    y: (crossOne * (c.y - d.y) - (a.y - b.y) * crossTwo) / denominator,
  };
  if (point.x < -1 || point.x > width + 1 || point.y < -1 || point.y > height + 1) {
    return null;
  }
  return point;
};

export const calculatePaperFold = (
  localPosition: PaperPoint,
  width: number,
  height: number,
): PaperFold | null => {
  let position = localPosition;
  let angle = 0;
  let rect: PaperRect;

  const updateGeometry = (point: PaperPoint) => {
    const horizontal = width - point.x + 1;
    const vertical = height - point.y;
    const diagonal = Math.hypot(vertical, horizontal);
    if (diagonal < 0.001) return false;
    angle = 2 * Math.acos(Math.min(1, horizontal / diagonal));
    if (vertical < 0) angle *= -1;
    angle *= -1;

    const transformPoint = (base: PaperPoint) => ({
      x: base.x * Math.cos(angle) + base.y * Math.sin(angle) + point.x,
      y: base.y * Math.cos(angle) - base.x * Math.sin(angle) + point.y,
    });
    rect = {
      topLeft: transformPoint({ x: 0, y: -height }),
      topRight: transformPoint({ x: width, y: -height }),
      bottomLeft: transformPoint({ x: 0, y: 0 }),
      bottomRight: transformPoint({ x: width, y: 0 }),
    };
    return Number.isFinite(angle);
  };

  if (!updateGeometry(position)) return null;

  const firstLimit = limitPointToCircle({ x: 0, y: height }, width, position);
  if (firstLimit !== position) {
    position = firstLimit;
    if (!updateGeometry(position)) return null;
  }

  if (rect!.topRight.x <= 0) {
    const secondLimit = limitPointToCircle(
      { x: 0, y: 0 },
      Math.hypot(width, height),
      rect!.bottomLeft,
    );
    if (secondLimit !== rect!.bottomLeft) {
      position = secondLimit;
      if (!updateGeometry(position)) return null;
    }
  }

  const topIntersect = intersectPaperLines(
    [rect!.topLeft, rect!.topRight],
    [{ x: 0, y: 0 }, { x: width, y: 0 }],
    width,
    height,
  );
  const sideIntersect = intersectPaperLines(
    [position, rect!.topLeft],
    [{ x: width, y: 0 }, { x: width, y: height }],
    width,
    height,
  );
  const bottomIntersect = intersectPaperLines(
    [rect!.bottomLeft, rect!.bottomRight],
    [{ x: 0, y: height }, { x: width, y: height }],
    width,
    height,
  );

  const flippingArea: Array<PaperPoint | null> = [rect!.topLeft, topIntersect];
  if (sideIntersect) flippingArea.push(sideIntersect);
  flippingArea.push(bottomIntersect, rect!.bottomLeft);

  const bottomArea: Array<PaperPoint | null> = [topIntersect];
  if (topIntersect) bottomArea.push({ x: width, y: 0 });
  bottomArea.push({ x: width, y: height });
  if (sideIntersect && distanceBetween(sideIntersect, topIntersect) >= 10) {
    bottomArea.push(sideIntersect);
  }
  bottomArea.push(bottomIntersect, topIntersect);

  return {
    angle,
    position,
    rect: rect!,
    topIntersect,
    sideIntersect,
    bottomIntersect,
    flippingArea,
    bottomArea,
  };
};

export const toBookPoint = (
  point: PaperPoint,
  direction: 'next' | 'previous',
  pageWidth: number,
) => ({
  x: direction === 'next' ? point.x + pageWidth : pageWidth - point.x,
  y: point.y,
});

export const paperClipPath = (
  area: Array<PaperPoint | null>,
  position: PaperPoint,
  angle: number,
  direction: 'next' | 'previous',
  exclude = false,
) => {
  const coordinates = area.flatMap((point) => {
    if (!point) return [];
    const relative = direction === 'previous'
      ? { x: -point.x + position.x, y: point.y - position.y }
      : { x: point.x - position.x, y: point.y - position.y };
    const rotated = rotatePaperPoint(relative, { x: 0, y: 0 }, angle);
    return [`${rotated.x.toFixed(2)}px ${rotated.y.toFixed(2)}px`];
  });
  if (exclude && coordinates.length > 0) {
    // Keep the outgoing sheet everywhere except the area peeled back by its fold.
    const first = coordinates[0];
    return `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${first}, ${coordinates.join(', ')}, ${first}, 0 0)`;
  }
  return `polygon(${coordinates.join(', ')})`;
};

export const shadowClipPath = (
  area: PaperPoint[],
  shadowPosition: PaperPoint,
  shadowTranslate: number,
  angle: number,
  direction: 'next' | 'previous',
) => {
  const coordinates = area.map((point) => {
    const relative = direction === 'previous'
      ? { x: -point.x + shadowPosition.x, y: point.y - shadowPosition.y }
      : { x: point.x - shadowPosition.x, y: point.y - shadowPosition.y };
    const rotated = rotatePaperPoint(
      relative,
      { x: shadowTranslate, y: 100 },
      angle,
    );
    return `${rotated.x.toFixed(2)}px ${rotated.y.toFixed(2)}px`;
  });
  return `polygon(${coordinates.join(', ')})`;
};

