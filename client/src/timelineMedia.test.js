import test from 'node:test';
import assert from 'node:assert/strict';

test('places the four Guizhou posters beside their matching journey phases', async () => {
  const { attachTimelineMedia } = await import('./timelineMedia.js');
  const phases = [
    { lab: 'Preparation' },
    { lab: 'Field Work' },
    { lab: 'Collaboration' },
    { lab: 'Creation' },
    { lab: 'Outcomes' },
  ];
  const images = ['interview', 'silver', 'batik', 'team'].map((url, id) => ({ id, url }));

  const result = attachTimelineMedia(phases, images, [3, 1, 0, 2]);

  assert.deepEqual(result.map(phase => phase.media?.url || null), [
    'team',
    'silver',
    'interview',
    'batik',
    null,
  ]);
});

test('adds a teacher note to the selected phase without changing the others', async () => {
  const { attachTeacherNote } = await import('./timelineMedia.js');
  const phases = [{ t: 'Prepare' }, { t: 'Interview' }, { t: 'Create' }];

  const result = attachTeacherNote(phases, 1, 'Listen for the motivation behind the craft.');

  assert.equal(result[1].teacherNote, 'Listen for the motivation behind the craft.');
  assert.equal(result[0].teacherNote, undefined);
  assert.equal(result[2].teacherNote, undefined);
});
