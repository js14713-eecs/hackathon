export function attachTimelineMedia(phases = [], images = [], placementOrder = []) {
  return phases.map((phase, index) => {
    const imageIndex = placementOrder[index];
    return imageIndex == null || !images[imageIndex]
      ? phase
      : { ...phase, media: images[imageIndex] };
  });
}

export function attachTeacherNote(phases = [], phaseIndex, note) {
  return phases.map((phase, index) => index === phaseIndex ? { ...phase, teacherNote: note } : phase);
}
